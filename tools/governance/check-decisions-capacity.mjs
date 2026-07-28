import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

function asBoolean(value, fallback = false) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) {
    return fallback;
  }
  return text === "1" || text === "true" || text === "yes" || text === "on";
}

function parseBooleanOrUndefined(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) {
    return undefined;
  }

  if (["1", "true", "yes", "on"].includes(text)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(text)) {
    return false;
  }

  return undefined;
}

function resolveBranch() {
  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }

  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }

  return "main";
}

function readCapacityPolicy() {
  const policyPath = path.join(repoRoot, "tools", "governance", "config", "decisions-capacity-policy.json");
  if (!fs.existsSync(policyPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(policyPath, "utf8"));
  } catch {
    return {};
  }
}

function resolveFailOnCritical(branch) {
  const policy = readCapacityPolicy();
  const defaultValue = asBoolean(policy?.default?.failOnCritical, false);
  const branchValueRaw = policy?.branches?.[branch]?.failOnCritical;
  const branchValue = branchValueRaw === undefined ? undefined : asBoolean(branchValueRaw, false);
  const envValue = parseBooleanOrUndefined(process.env.GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL);

  if (envValue !== undefined) {
    return { value: envValue, source: "env" };
  }

  if (branchValue !== undefined) {
    return { value: branchValue, source: "branch-policy" };
  }

  return { value: defaultValue, source: "default-policy" };
}

function main() {
  const summaryPath = process.env.GOVERNANCE_DECISIONS_CAPACITY_SUMMARY_PATH
    ? path.resolve(process.env.GOVERNANCE_DECISIONS_CAPACITY_SUMMARY_PATH)
    : path.join(repoRoot, "tools", "governance", "history", "governance-history-summary.json");

  if (!fs.existsSync(summaryPath)) {
    throw new Error("governance-history-summary.json not found. Run snapshot-governance-history.mjs first.");
  }

  const branch = resolveBranch();
  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const capacity = summary?.decisionsRetentionCapacity;
  const failOnCritical = resolveFailOnCritical(branch);

  if (!capacity) {
    console.log("Decision log capacity: not available");
    return;
  }

  const level = String(capacity.level || "unknown");
  const usagePercent = Number(capacity.usagePercent || 0);
  const maxBytes = Number(capacity.maxBytes || 0);
  const warn = Number(capacity.thresholds?.warn ?? 70);
  const high = Number(capacity.thresholds?.high ?? 85);
  const critical = Number(capacity.thresholds?.critical ?? 95);

  console.log("Decision log capacity check");
  console.log("--------------------------");
  console.log(`level: ${level}`);
  console.log(`usagePercent: ${usagePercent}%`);
  console.log(`maxBytes: ${maxBytes}`);
  console.log(`thresholds: warn=${warn} high=${high} critical=${critical}`);
  console.log(`branch: ${branch}`);
  console.log(`failOnCritical: ${failOnCritical.value} (source=${failOnCritical.source})`);

  if (level === "critical" && failOnCritical.value) {
    console.log("Capacity status: FAIL (critical level with fail-on-critical enabled)");
    process.exit(1);
  }

  if (level === "critical") {
    console.log("Capacity status: WARN (critical level but fail-on-critical disabled)");
    return;
  }

  console.log("Capacity status: PASS");
}

main();
