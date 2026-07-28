import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { repoRoot } from "./common.mjs";

const scriptPath = path.join(repoRoot, "tools", "governance", "export-governance-history.mjs");

function runExport(envOverrides) {
  const env = {
    ...process.env,
    ...envOverrides,
  };

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", reject);
    child.on("close", (status) => {
      resolve({ status, stdout, stderr });
    });
  });
}

function startServer(handler) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler);
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      resolve({
        server,
        endpoint: `http://127.0.0.1:${addr.port}/governance`,
      });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function scenarioRetryAndAck() {
  let attempts = 0;
  const observed = [];

  const { server, endpoint } = await startServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("method not allowed");
      return;
    }

    attempts += 1;
    observed.push({
      idempotency: req.headers["x-idempotency-key"],
      signature: req.headers["x-governance-signature"],
    });
    req.resume();

    if (attempts === 1) {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ accepted: false, requestId: null }));
      return;
    }

    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ accepted: true, requestId: "req-ok-1" }));
    });
  });

  try {
    const result = await runExport({
      GOVERNANCE_HISTORY_ENDPOINT: endpoint,
      GOVERNANCE_EXPORT_EXPECT_ACK: "true",
      GOVERNANCE_EXPORT_RETRIES: "2",
      GOVERNANCE_EXPORT_TIMEOUT_MS: "10000",
      GOVERNANCE_EXPORT_BACKOFF_BASE_MS: "25",
      GOVERNANCE_EXPORT_BACKOFF_MAX_MS: "50",
      GOVERNANCE_HISTORY_SIGNING_SECRET: "integration-test-secret",
      GOVERNANCE_HISTORY_API_KEY: "integration-test-token",
    });

    if (result.status !== 0) {
      throw new Error(`Retry scenario failed unexpectedly. stdout=${result.stdout} stderr=${result.stderr}`);
    }

    if (attempts < 2) {
      throw new Error(`Retry scenario expected at least 2 attempts, got ${attempts}`);
    }

    const first = observed[0] || {};
    if (!first.idempotency || String(first.idempotency).length < 16) {
      throw new Error("Retry scenario missing X-Idempotency-Key header");
    }

    if (!first.signature || !String(first.signature).startsWith("sha256=")) {
      throw new Error("Retry scenario missing X-Governance-Signature header");
    }

    console.log("HTTP integration scenario A passed (retry + ACK + integrity headers).");
  } finally {
    await closeServer(server);
  }
}

async function scenarioInvalidAckFails() {
  const { server, endpoint } = await startServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("method not allowed");
      return;
    }

    req.resume();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ accepted: false, requestId: "bad-ack" }));
  });

  try {
    const result = await runExport({
      GOVERNANCE_HISTORY_ENDPOINT: endpoint,
      GOVERNANCE_EXPORT_EXPECT_ACK: "true",
      GOVERNANCE_EXPORT_RETRIES: "0",
      GOVERNANCE_EXPORT_TIMEOUT_MS: "10000",
      GOVERNANCE_EXPORT_BACKOFF_BASE_MS: "25",
      GOVERNANCE_EXPORT_BACKOFF_MAX_MS: "50",
    });

    if (result.status === 0) {
      throw new Error("Invalid ACK scenario should fail but returned success.");
    }

    const stderr = String(result.stderr || "");
    if (!stderr.includes("Export contract invalid")) {
      throw new Error(`Invalid ACK scenario failed with unexpected error: ${stderr}`);
    }

    console.log("HTTP integration scenario B passed (invalid ACK is rejected).");
  } finally {
    await closeServer(server);
  }
}

async function scenarioTimeoutThenRetrySucceeds() {
  let attempts = 0;

  const { server, endpoint } = await startServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("method not allowed");
      return;
    }

    attempts += 1;
    req.resume();

    if (attempts === 1) {
      // Intentionally delay first response so client timeout triggers retry.
      setTimeout(() => {
        if (!res.writableEnded) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ accepted: true, requestId: "late-response" }));
        }
      }, 2000);
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ accepted: true, requestId: "req-timeout-retry-ok" }));
  });

  try {
    const result = await runExport({
      GOVERNANCE_HISTORY_ENDPOINT: endpoint,
      GOVERNANCE_EXPORT_EXPECT_ACK: "true",
      GOVERNANCE_EXPORT_RETRIES: "2",
      GOVERNANCE_EXPORT_TIMEOUT_MS: "400",
      GOVERNANCE_EXPORT_BACKOFF_BASE_MS: "25",
      GOVERNANCE_EXPORT_BACKOFF_MAX_MS: "50",
    });

    if (result.status !== 0) {
      throw new Error(`Timeout retry scenario failed unexpectedly. stdout=${result.stdout} stderr=${result.stderr}`);
    }

    if (attempts < 2) {
      throw new Error(`Timeout retry scenario expected retry attempts >= 2, got ${attempts}`);
    }

    console.log("HTTP integration scenario C passed (timeout triggers retry and recovers).");
  } finally {
    await closeServer(server);
  }
}

async function main() {
  await scenarioRetryAndAck();
  await scenarioInvalidAckFails();
  await scenarioTimeoutThenRetrySucceeds();
  console.log("Export HTTP integration tests passed.");
}

await main();
