import { spawnSync } from "node:child_process";
import path from "node:path";
import { repoRoot } from "./common.mjs";

const scriptPath = path.join(repoRoot, "tools", "governance", "export-governance-history.mjs");

const env = {
  ...process.env,
  GOVERNANCE_EXPORT_DRY_RUN: "true",
  GOVERNANCE_HISTORY_SIGNING_SECRET: process.env.GOVERNANCE_HISTORY_SIGNING_SECRET || "local-test-secret",
};

const result = spawnSync(process.execPath, [scriptPath], {
  env,
  encoding: "utf8",
});

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log("Export contract test passed.");
