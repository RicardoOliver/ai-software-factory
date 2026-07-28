import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

function parsePositiveNumber(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return fallback;
  }
  return num;
}

function mapManagers(items) {
  const map = new Map();
  for (const item of items || []) {
    const name = String(item.packageManager || "").trim();
    if (!name) {
      continue;
    }
    map.set(name, item);
  }
  return map;
}

function evaluateManagerDeltas(summary, maxDeltaPp) {
  const last7 = mapManagers(summary?.packageManagers?.last7 || []);
  const last30 = mapManagers(summary?.packageManagers?.last30 || []);
  const names = new Set([...last7.keys(), ...last30.keys()]);
  const managers = [];

  for (const name of [...names].sort((a, b) => a.localeCompare(b))) {
    const r7 = Number(last7.get(name)?.reliabilityScore || 0);
    const r30 = Number(last30.get(name)?.reliabilityScore || 0);
    const delta = Math.round((r7 - r30) * 100) / 100;
    const withinLimit = Math.abs(delta) <= maxDeltaPp;

    managers.push({
      packageManager: name,
      reliability7d: r7,
      reliability30d: r30,
      delta,
      withinLimit,
    });
  }

  return managers;
}

function evaluateReadiness(summary) {
  const minRuns = parsePositiveNumber(process.env.GOVERNANCE_READINESS_MIN_RUNS, 5);
  const minPassRate = parsePositiveNumber(process.env.GOVERNANCE_READINESS_MIN_PASS_RATE, 95);
  const maxManagerDeltaPp = parsePositiveNumber(process.env.GOVERNANCE_READINESS_MAX_MANAGER_DELTA_PP, 2);

  const runs7d = Number(summary?.last7?.total || 0);
  const passRate7d = Number(summary?.last7?.passRate || 0);
  const managerDeltas = evaluateManagerDeltas(summary, maxManagerDeltaPp);
  const managersWithinLimit = managerDeltas.every((item) => item.withinLimit);
  const decisionsCapacityLevel = String(summary?.decisionsRetentionCapacity?.level || "unknown");
  const capacityOk = decisionsCapacityLevel !== "critical";

  const checks = {
    minRunsReached: runs7d >= minRuns,
    passRateReached: passRate7d >= minPassRate,
    managerDeltaWithinLimit: managersWithinLimit,
    retentionCapacityHealthy: capacityOk,
  };

  const ready = Object.values(checks).every(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    criteria: {
      minRuns,
      minPassRate,
      maxManagerDeltaPp,
    },
    status: {
      ready,
      checks,
    },
    metrics: {
      runs7d,
      passRate7d,
      decisionsCapacityLevel,
      managerDeltas,
    },
    recommendation: ready
      ? "ready-to-freeze-thresholds"
      : "keep-observation-window",
  };
}

function main() {
  const summaryPath = path.join(repoRoot, "tools", "governance", "history", "governance-history-summary.json");
  const outputPath = path.join(repoRoot, "tools", "governance", "latest-threshold-readiness.json");

  if (!fs.existsSync(summaryPath)) {
    throw new Error("governance-history-summary.json not found. Run snapshot-governance-history.mjs first.");
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const result = evaluateReadiness(summary);

  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  console.log("Threshold readiness evaluation");
  console.log("----------------------------");
  console.log(`Recommendation: ${result.recommendation}`);
  console.log(`Ready: ${result.status.ready}`);
  console.log(`Runs7d: ${result.metrics.runs7d}`);
  console.log(`PassRate7d: ${result.metrics.passRate7d}%`);
  console.log(`RetentionCapacity: ${result.metrics.decisionsCapacityLevel}`);
  console.log(`Output: ${outputPath}`);
}

main();
