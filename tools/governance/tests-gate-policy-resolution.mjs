import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

const auditScript = path.join(repoRoot, "tools", "governance", "run-dependency-audit.mjs");
const reportPath = path.join(repoRoot, "tools", "governance", "latest-dependency-report.json");

function runAudit(branch, envOverrides = {}, options = {}) {
  const env = {
    ...process.env,
    GITHUB_REF_NAME: branch,
    ...envOverrides,
  };

  const result = spawnSync(process.execPath, [auditScript], {
    env,
    encoding: "utf8",
  });

  const allowFailure = Boolean(options.allowFailure);
  if (result.status !== 0 && !allowFailure) {
    const err = [result.stdout || "", result.stderr || ""].filter(Boolean).join("\n");
    throw new Error(`Dependency audit failed for branch ${branch}: ${err}`);
  }

  if (!fs.existsSync(reportPath)) {
    throw new Error("latest-dependency-report.json not generated");
  }

  return {
    status: result.status ?? 1,
    report: JSON.parse(fs.readFileSync(reportPath, "utf8")),
  };
}

function assertEqual(actual, expected, context) {
  if (actual !== expected) {
    throw new Error(`${context}: expected=${expected}, actual=${actual}`);
  }
}

function assertUndefined(value, context) {
  if (value !== undefined) {
    throw new Error(`${context}: expected undefined, actual=${JSON.stringify(value)}`);
  }
}

function testMainPolicyFromFile() {
  const { report } = runAudit("main");
  const cfg = report.packageManagerGateInputs;

  assertEqual(cfg.source.branch, "main", "main source branch");
  assertEqual(cfg.minExecutedByManager.npm, 1, "main minExecuted npm");
  assertEqual(cfg.maxExecErrorsByManager.npm, 0, "main maxExecErrors npm");
  assertEqual(cfg.maxDropByManager.npm, 2, "main maxDrop npm");
  assertEqual(cfg.minTrendRunsByManager.npm, 5, "main minTrendRuns npm");
  assertEqual(cfg.gateMode, "enforce", "main gateMode");
  assertEqual(cfg.promoteAfterConsecutivePasses, 1, "main promoteAfter");
}

function testDevelopPolicyFromFile() {
  const { report } = runAudit("develop");
  const cfg = report.packageManagerGateInputs;

  assertEqual(cfg.source.branch, "develop", "develop source branch");
  assertEqual(cfg.maxDropByManager.npm, 4, "develop maxDrop npm");
  assertEqual(cfg.minTrendRunsByManager.npm, 2, "develop minTrendRuns npm");
  assertUndefined(cfg.minExecutedByManager.npm, "develop minExecuted npm");
  assertEqual(cfg.gateMode, "observe", "develop gateMode");
  assertEqual(cfg.promoteAfterConsecutivePasses, 4, "develop promoteAfter");
}

function testEnvOverridePrecedence() {
  const { report } = runAudit("main", {
    GOVERNANCE_PM_MAX_EXEC_ERRORS: "npm:2",
    GOVERNANCE_PM_MAX_RELIABILITY_DROP_PP: "npm:1",
    GOVERNANCE_PM_GATE_MODE: "observe",
    GOVERNANCE_PM_PROMOTE_AFTER_RUNS: "7",
  });
  const cfg = report.packageManagerGateInputs;

  assertEqual(cfg.maxExecErrorsByManager.npm, 2, "env override maxExecErrors npm");
  assertEqual(cfg.maxDropByManager.npm, 1, "env override maxDrop npm");
  assertEqual(cfg.gateMode, "observe", "env override gateMode");
  assertEqual(cfg.promoteAfterConsecutivePasses, 7, "env override promoteAfter");
}

function testObservePromotionRecommendation() {
  const historyPath = path.join(repoRoot, "tools", "governance", "history", "tmp-gate-policy-resolution-history.jsonl");
  const records = [
    {
      timestamp: "2026-07-27T00:00:00.000Z",
      dependencyBranch: "develop",
      dependencyGateMode: "observe",
      dependencyFailed: false,
      dependencyFailedByManagerGates: false,
      dependencyFailedByTrendGates: false,
      dependencyAuditExecutionFailed: false,
    },
    {
      timestamp: "2026-07-27T01:00:00.000Z",
      dependencyBranch: "develop",
      dependencyGateMode: "observe",
      dependencyFailed: false,
      dependencyFailedByManagerGates: false,
      dependencyFailedByTrendGates: false,
      dependencyAuditExecutionFailed: false,
    },
  ];

  fs.writeFileSync(historyPath, `${records.map((item) => JSON.stringify(item)).join("\n")}\n`, "utf8");

  try {
    const { report } = runAudit("develop", {
      GOVERNANCE_PM_HISTORY_PATH: historyPath,
      GOVERNANCE_PM_PROMOTE_AFTER_RUNS: "3",
      GOVERNANCE_PM_GATE_MODE: "observe",
    });

    assertEqual(report.gatePromotion.recommendation, "promote-to-enforce", "promotion recommendation");
    assertEqual(report.gatePromotion.projectedConsecutiveObservePasses, 3, "promotion projected streak");
    assertEqual(report.gatePromotion.promoteAfterConsecutivePasses, 3, "promotion threshold");
  } finally {
    if (fs.existsSync(historyPath)) {
      fs.unlinkSync(historyPath);
    }
  }
}

function testObserveModeDoesNotBlock() {
  const { status, report } = runAudit(
    "develop",
    {
      GOVERNANCE_PM_GATE_MODE: "observe",
      GOVERNANCE_PM_MIN_EXECUTED: "npm:99",
    },
    { allowFailure: true },
  );

  assertEqual(status, 0, "observe mode exit code");
  assertEqual(report.failedByManagerGates, true, "observe mode raw gate failure");
  assertEqual(report.failedByManagerGatesEnforced, false, "observe mode enforced gate failure");
  assertEqual(report.failedByPolicy, false, "observe mode final policy failure");
}

function testEnforceModeBlocksOnGateFailure() {
  const { status, report } = runAudit(
    "develop",
    {
      GOVERNANCE_PM_GATE_MODE: "enforce",
      GOVERNANCE_PM_MIN_EXECUTED: "npm:99",
    },
    { allowFailure: true },
  );

  assertEqual(status, 1, "enforce mode exit code");
  assertEqual(report.failedByManagerGates, true, "enforce mode raw gate failure");
  assertEqual(report.failedByManagerGatesEnforced, true, "enforce mode enforced gate failure");
  assertEqual(report.failedByPolicy, true, "enforce mode final policy failure");
}

function restoreMainArtifacts() {
  runAudit("main");
}

function main() {
  testMainPolicyFromFile();
  testDevelopPolicyFromFile();
  testEnvOverridePrecedence();
  testObserveModeDoesNotBlock();
  testEnforceModeBlocksOnGateFailure();
  testObservePromotionRecommendation();
  restoreMainArtifacts();
  console.log("Gate policy resolution tests passed.");
}

main();
