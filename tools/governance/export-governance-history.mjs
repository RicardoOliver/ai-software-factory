import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { repoRoot } from "./common.mjs";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postWithRetry({ endpoint, headers, payload, retries, timeoutMs, backoffBaseMs, backoffMaxMs }) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Export failed with status ${res.status}: ${txt}`);
      }

      const contentType = res.headers.get("content-type") || "";
      let body = null;
      if (contentType.includes("application/json")) {
        body = await res.json();
      }

      return {
        status: res.status,
        contentType,
        body,
      };
    } catch (err) {
      clearTimeout(timer);
      lastError = err;

      if (attempt === retries) {
        break;
      }

      const backoff = Math.min(backoffBaseMs * 2 ** attempt, backoffMaxMs);
      await wait(backoff);
      attempt += 1;
      continue;
    }
  }

  throw lastError || new Error("Unknown export error");
}

async function main() {
  const endpoint = process.env.GOVERNANCE_HISTORY_ENDPOINT;
  const apiKey = process.env.GOVERNANCE_HISTORY_API_KEY;
  const signingSecret = process.env.GOVERNANCE_HISTORY_SIGNING_SECRET;
  const timeoutMs = Number(process.env.GOVERNANCE_EXPORT_TIMEOUT_MS || 8000);
  const retries = Number(process.env.GOVERNANCE_EXPORT_RETRIES || 2);
  const backoffBaseMs = Number(process.env.GOVERNANCE_EXPORT_BACKOFF_BASE_MS || 1000);
  const backoffMaxMs = Number(process.env.GOVERNANCE_EXPORT_BACKOFF_MAX_MS || 8000);
  const expectAck = (process.env.GOVERNANCE_EXPORT_EXPECT_ACK || "false").toLowerCase() === "true";
  const dryRun = (process.env.GOVERNANCE_EXPORT_DRY_RUN || "false").toLowerCase() === "true";

  if (!endpoint && !dryRun) {
    console.log("Skipping external export: GOVERNANCE_HISTORY_ENDPOINT is not configured.");
    return;
  }

  const summaryPath = path.join(repoRoot, "tools", "governance", "history", "governance-history-summary.json");
  const jsonlPath = path.join(repoRoot, "tools", "governance", "history", "governance-history.jsonl");

  if (!fs.existsSync(summaryPath) || !fs.existsSync(jsonlPath)) {
    throw new Error("Governance history files not found. Run snapshot-governance-history.mjs first.");
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const lines = fs
    .readFileSync(jsonlPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-50)
    .map((line) => JSON.parse(line));

  const payload = {
    exportedAt: new Date().toISOString(),
    summary,
    recentEntries: lines,
  };

  const payloadJson = JSON.stringify(payload);
  const idempotencyKey = crypto.createHash("sha256").update(payloadJson).digest("hex");

  const headers = {
    "Content-Type": "application/json",
    "X-Idempotency-Key": idempotencyKey,
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (signingSecret) {
    const signature = crypto
      .createHmac("sha256", signingSecret)
      .update(payloadJson)
      .digest("hex");
    headers["X-Governance-Signature"] = `sha256=${signature}`;
  }

  if (dryRun) {
    if (!headers["X-Idempotency-Key"]) {
      throw new Error("Dry-run failed: missing X-Idempotency-Key");
    }

    if (signingSecret) {
      const expected = crypto
        .createHmac("sha256", signingSecret)
        .update(payloadJson)
        .digest("hex");
      const actual = String(headers["X-Governance-Signature"] || "").replace("sha256=", "");
      if (expected !== actual) {
        throw new Error("Dry-run failed: signature mismatch");
      }
    }

    console.log("Governance export dry-run contract passed.");
    console.log(`Idempotency key: ${idempotencyKey}`);
    return;
  }

  try {
    const response = await postWithRetry({
      endpoint,
      headers,
      payload,
      retries,
      timeoutMs,
      backoffBaseMs,
      backoffMaxMs,
    });

    if (expectAck) {
      const accepted = Boolean(response?.body?.accepted);
      const requestId = response?.body?.requestId;
      if (!accepted) {
        throw new Error("Export contract invalid: expected body.accepted=true");
      }
      if (!requestId || typeof requestId !== "string") {
        throw new Error("Export contract invalid: expected body.requestId as non-empty string");
      }
    }

    console.log(`Governance history exported to ${endpoint}`);
    console.log(`Idempotency key: ${idempotencyKey}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

await main();
