import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

const auditScript = path.join(repoRoot, "tools", "governance", "run-dependency-audit.mjs");
const snapshotScript = path.join(repoRoot, "tools", "governance", "snapshot-governance-history.mjs");
const policyPath = path.join(repoRoot, "tools", "governance", "config", "decisions-capacity-policy.json");
const tempHistoryDir = path.join(repoRoot, "tools", "governance", "history", "tmp-threshold-tests");
const tempHistoryPath = path.join(tempHistoryDir, "governance-history.jsonl");
const tempSummaryPath = path.join(tempHistoryDir, "governance-history-summary.json");
const tempDecisionsPath = path.join(tempHistoryDir, "gate-promotion-decisions.jsonl");
const tempDependencyReportPath = path.join(tempHistoryDir, "latest-dependency-report.json");

function runScript(scriptPath, branch, envOverrides = {}) {
  const env = {
    ...process.env,
    GITHUB_REF_NAME: branch,
    GOVERNANCE_PM_REPORT_PATH: tempDependencyReportPath,
    GOVERNANCE_HISTORY_PATH: tempHistoryPath,
    GOVERNANCE_HISTORY_SUMMARY_PATH: tempSummaryPath,
    GOVERNANCE_DECISIONS_PATH: tempDecisionsPath,
    ...envOverrides,
  };

  const result = spawnSync(process.execPath, [scriptPath], {
    env,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const out = [result.stdout || "", result.stderr || ""].filter(Boolean).join("\n");
    throw new Error(`Script failed for branch ${branch}: ${out}`);
  }
}

function runAuditAndSnapshot(branch, envOverrides = {}) {
  runScript(auditScript, branch, envOverrides);
  runScript(snapshotScript, branch, envOverrides);

  if (!fs.existsSync(tempSummaryPath)) {
    throw new Error("governance-history-summary.json not generated");
  }

  return JSON.parse(fs.readFileSync(tempSummaryPath, "utf8"));
}

function assertEqual(actual, expected, context) {
  if (actual !== expected) {
    throw new Error(`${context}: expected=${expected}, actual=${actual}`);
  }
}

function testBranchThresholdsFromPolicy() {
  const summary = runAuditAndSnapshot("develop");
  const cap = summary.decisionsRetentionCapacity;

  assertEqual(cap.branch, "develop", "capacity branch");
  assertEqual(cap.thresholds.warn, 80, "develop warn threshold");
  assertEqual(cap.thresholds.high, 90, "develop high threshold");
  assertEqual(cap.thresholds.critical, 97, "develop critical threshold");
  assertEqual(cap.thresholdSources.warn, "branch-policy", "develop warn source");
  assertEqual(cap.thresholdSources.high, "branch-policy", "develop high source");
  assertEqual(cap.thresholdSources.critical, "branch-policy", "develop critical source");
}

function testEnvOverridePrecedence() {
  const summary = runAuditAndSnapshot("develop", {
    GOVERNANCE_DECISIONS_CAPACITY_WARN_PERCENT: "66",
    GOVERNANCE_DECISIONS_CAPACITY_HIGH_PERCENT: "87",
    GOVERNANCE_DECISIONS_CAPACITY_CRITICAL_PERCENT: "98",
  });
  const cap = summary.decisionsRetentionCapacity;

  assertEqual(cap.thresholds.warn, 66, "env warn threshold");
  assertEqual(cap.thresholds.high, 87, "env high threshold");
  assertEqual(cap.thresholds.critical, 98, "env critical threshold");
  assertEqual(cap.thresholdSources.warn, "env", "env warn source");
  assertEqual(cap.thresholdSources.high, "env", "env high source");
  assertEqual(cap.thresholdSources.critical, "env", "env critical source");
}

function ensureTempHistoryDir() {
  if (!fs.existsSync(tempHistoryDir)) {
    fs.mkdirSync(tempHistoryDir, { recursive: true });
  }
}

function cleanupTempHistoryDir() {
  if (fs.existsSync(tempHistoryDir)) {
    fs.rmSync(tempHistoryDir, { recursive: true, force: true });
  }
}

function main() {
  const originalPolicy = fs.existsSync(policyPath) ? fs.readFileSync(policyPath, "utf8") : null;

  const fixture = {
    default: {
      failOnCritical: false,
      capacityThresholds: {
        warn: 70,
        high: 85,
        critical: 95,
      },
    },
    branches: {
      main: {
        failOnCritical: true,
        capacityThresholds: {
          warn: 70,
          high: 85,
          critical: 95,
        },
      },
      staging: {
        failOnCritical: false,
        capacityThresholds: {
          warn: 75,
          high: 88,
          critical: 96,
        },
      },
      develop: {
        failOnCritical: false,
        capacityThresholds: {
          warn: 80,
          high: 90,
          critical: 97,
        },
      },
    },
  };

  try {
    ensureTempHistoryDir();
    fs.writeFileSync(policyPath, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");
    testBranchThresholdsFromPolicy();
    testEnvOverridePrecedence();
    console.log("Decisions capacity threshold tests passed.");
  } finally {
    if (originalPolicy === null) {
      if (fs.existsSync(policyPath)) {
        fs.unlinkSync(policyPath);
      }
    } else {
      fs.writeFileSync(policyPath, originalPolicy, "utf8");
    }

    cleanupTempHistoryDir();
  }
}

main();
