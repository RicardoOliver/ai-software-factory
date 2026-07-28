import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

const checkerPath = path.join(repoRoot, "tools", "governance", "check-decisions-capacity.mjs");
const policyPath = path.join(repoRoot, "tools", "governance", "config", "decisions-capacity-policy.json");
const tempSummaryPath = path.join(
  repoRoot,
  "tools",
  "governance",
  "history",
  "tmp-decisions-capacity-summary.json",
);

function writeCriticalSummary() {
  const payload = {
    decisionsRetentionCapacity: {
      maxBytes: 100,
      usagePercent: 96,
      level: "critical",
      exceededThresholds: ["warn", "high", "critical"],
      thresholds: {
        warn: 70,
        high: 85,
        critical: 95,
      },
    },
  };

  fs.writeFileSync(tempSummaryPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function runCheck(branch, envOverrides = {}) {
  const env = {
    ...process.env,
    GITHUB_REF_NAME: branch,
    GOVERNANCE_DECISIONS_CAPACITY_SUMMARY_PATH: tempSummaryPath,
    ...envOverrides,
  };

  return spawnSync(process.execPath, [checkerPath], {
    env,
    encoding: "utf8",
  });
}

function assertEqual(actual, expected, context) {
  if (actual !== expected) {
    throw new Error(`${context}: expected=${expected}, actual=${actual}`);
  }
}

function main() {
  const originalPolicy = fs.existsSync(policyPath) ? fs.readFileSync(policyPath, "utf8") : null;
  writeCriticalSummary();

  try {
    const policyFixture = {
      default: { failOnCritical: false },
      branches: {
        main: { failOnCritical: true },
        develop: { failOnCritical: false },
      },
    };
    fs.writeFileSync(policyPath, `${JSON.stringify(policyFixture, null, 2)}\n`, "utf8");

    const mainPolicyResult = runCheck("main");
    assertEqual(mainPolicyResult.status, 1, "main branch policy should fail");

    const developPolicyResult = runCheck("develop");
    assertEqual(developPolicyResult.status, 0, "develop branch policy should pass");

    const mainEnvOverrideResult = runCheck("main", {
      GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL: "false",
    });
    assertEqual(mainEnvOverrideResult.status, 0, "env override false should pass on main");

    const developEnvOverrideResult = runCheck("develop", {
      GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL: "true",
    });
    assertEqual(developEnvOverrideResult.status, 1, "env override true should fail on develop");

    console.log("Decisions capacity policy tests passed.");
  } finally {
    if (originalPolicy === null) {
      if (fs.existsSync(policyPath)) {
        fs.unlinkSync(policyPath);
      }
    } else {
      fs.writeFileSync(policyPath, originalPolicy, "utf8");
    }

    if (fs.existsSync(tempSummaryPath)) {
      fs.unlinkSync(tempSummaryPath);
    }
  }
}

main();
