import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

function managerReliabilityScore(item) {
  const executed = Number(item.passed || 0) + Number(item.failed || 0);
  if (executed <= 0) {
    return 0;
  }
  return Math.round((Number(item.passed || 0) / executed) * 10000) / 100;
}

function mapManagersByName(items) {
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

function getParityStatus() {
  const matrixPath = path.join(repoRoot, "tools", "governance", "parity-matrix.md");
  if (!fs.existsSync(matrixPath)) {
    return "matrix not generated";
  }

  const content = fs.readFileSync(matrixPath, "utf8");
  const lines = content.split(/\r?\n/).filter((line) => line.startsWith("| "));
  let ok = 0;
  let exempt = 0;
  let missing = 0;

  for (const line of lines) {
    if (line.includes("| OK |")) {
      ok += 1;
    } else if (line.includes("| EXEMPT |")) {
      exempt += 1;
    } else if (line.includes("| MISSING |")) {
      missing += 1;
    }
  }

  return `ok=${ok}, exempt=${exempt}, missing=${missing}`;
}

function readPackageManagerGatePolicy() {
  const policyPath = path.join(repoRoot, "tools", "governance", "config", "package-manager-gates.json");
  if (!fs.existsSync(policyPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(policyPath, "utf8"));
  } catch {
    return null;
  }
}

function buildPromotionSnippet(policy, branch) {
  const branchKey = String(branch || "").trim();
  if (!branchKey) {
    return "";
  }

  const currentBranchPolicy = policy?.branches?.[branchKey] || {};
  const promotedBranchPolicy = {
    ...currentBranchPolicy,
    gateMode: "enforce",
  };

  const snippet = {
    branches: {
      [branchKey]: promotedBranchPolicy,
    },
  };

  return JSON.stringify(snippet, null, 2);
}

function main() {
  const reportPath = path.join(repoRoot, "tools", "governance", "latest-report.json");
  const dependencyPath = path.join(repoRoot, "tools", "governance", "latest-dependency-report.json");
  const historySummaryPath = path.join(
    repoRoot,
    "tools",
    "governance",
    "history",
    "governance-history-summary.json",
  );
  const outputPath = path.join(repoRoot, "tools", "governance", "latest-pr-comment.md");
  const discoveryPath = path.join(repoRoot, "tools", "governance", "domain-discovery-report.json");
  const readinessPath = path.join(repoRoot, "tools", "governance", "latest-threshold-readiness.json");

  if (!fs.existsSync(reportPath)) {
    throw new Error("latest-report.json not found. Run governance suite first.");
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const dependency = fs.existsSync(dependencyPath)
    ? JSON.parse(fs.readFileSync(dependencyPath, "utf8"))
    : null;
  const historySummary = fs.existsSync(historySummaryPath)
    ? JSON.parse(fs.readFileSync(historySummaryPath, "utf8"))
    : null;
  const discovery = fs.existsSync(discoveryPath)
    ? JSON.parse(fs.readFileSync(discoveryPath, "utf8"))
    : null;
  const readiness = fs.existsSync(readinessPath)
    ? JSON.parse(fs.readFileSync(readinessPath, "utf8"))
    : null;
  const gatePolicy = readPackageManagerGatePolicy();
  const rows = report.checks
    .map((check) => {
      const icon = check.status === "PASS" ? "✅" : "❌";
      return `| ${check.name} | ${icon} ${check.status} |`;
    })
    .join("\n");

  const dependencyLine = dependency
    ? `- default-threshold=${dependency.defaultThreshold}, policy=${dependency.failedByPolicy ? "FAIL" : "PASS"}, total=${dependency.vulnerabilities?.total ?? 0}, high=${dependency.vulnerabilities?.high ?? 0}, critical=${dependency.vulnerabilities?.critical ?? 0}`
    : "- not executed in this run";

  const dependencyDomainLines = dependency?.domains?.length
    ? dependency.domains
        .map(
          (item) =>
            `  - ${item.domain}: threshold=${item.threshold}, policy=${item.failedByPolicy ? "FAIL" : "PASS"}, total=${item.vulnerabilities?.total ?? 0}`,
        )
        .join("\n")
    : "  - domains not available";

  const dependencyManagerLines = dependency?.packageManagers?.length
    ? dependency.packageManagers
        .map(
          (item) =>
            `  - ${item.packageManager}: score=${managerReliabilityScore(item)}%, domains=${item.domains}, passed=${item.passed}, failed=${item.failed}, skipped=${item.skipped}, execErrors=${item.executionErrors}, total=${item.vulnerabilities?.total ?? 0}`,
        )
        .join("\n")
    : "  - package manager summary not available";

  const managerGateLine = dependency?.packageManagerGates
    ? `- gate-status=${dependency.packageManagerGates.failed ? "FAIL" : "PASS"}, mode=${dependency.packageManagerGateMode || "enforce"}, source-branch=${dependency.packageManagerGateInputs?.source?.branch || "unknown"}, configured-min-executed=${Object.keys(dependency.packageManagerGates.config?.minExecutedByManager || {}).length}, configured-max-exec-errors=${Object.keys(dependency.packageManagerGates.config?.maxExecErrorsByManager || {}).length}`
    : "- gate-status=not available";

  const managerGateFailureLines = dependency?.packageManagerGates?.failures?.length
    ? dependency.packageManagerGates.failures
        .map((item) => `  - ${item.packageManager}/${item.type}: expected=${item.expected}, actual=${item.actual}`)
        .join("\n")
    : "  - none";

  const managerTrendGateLine = dependency?.packageManagerTrendGates
    ? `- trend-gate-status=${dependency.packageManagerTrendGates.failed ? "FAIL" : "PASS"}, mode=${dependency.packageManagerGateMode || "enforce"}, source-policy=${dependency.packageManagerTrendGates.config?.source?.policyFile || "env-only"}, configured-max-drop=${Object.keys(dependency.packageManagerTrendGates.config?.maxDropByManager || {}).length}, configured-min-runs=${Object.keys(dependency.packageManagerTrendGates.config?.minTrendRunsByManager || {}).length}`
    : "- trend-gate-status=not available";

  const managerTrendGateFailureLines = dependency?.packageManagerTrendGates?.failures?.length
    ? dependency.packageManagerTrendGates.failures
        .map((item) => `  - ${item.packageManager}/${item.type}: expected<=${item.expected}pp, actual=${item.actual}pp`)
        .join("\n")
    : "  - none";

  const gateRolloutLine = dependency?.gatePromotion
    ? `- recommendation=${dependency.gatePromotion.recommendation}, branch=${dependency.gatePromotion.branch}, mode=${dependency.gatePromotion.gateMode}, streak=${dependency.gatePromotion.projectedConsecutiveObservePasses}/${dependency.gatePromotion.promoteAfterConsecutivePasses}`
    : "- recommendation=not available";

  const trendLine = historySummary
    ? `- 7d pass-rate=${historySummary.last7?.passRate ?? 0}% (${historySummary.last7?.passed ?? 0}/${historySummary.last7?.total ?? 0}), 30d pass-rate=${historySummary.last30?.passRate ?? 0}% (${historySummary.last30?.passed ?? 0}/${historySummary.last30?.total ?? 0})`
    : "- trend not available (history summary missing)";

  const managerTrendDeltaLines = dependency?.packageManagerTrendGates?.managers?.length
    ? dependency.packageManagerTrendGates.managers
        .map((item) => {
          const delta = Number(item.delta || 0);
          const sign = delta > 0 ? "+" : "";
          const signal = delta > 0 ? "improving" : delta < 0 ? "regressing" : "stable";
          return `  - ${item.packageManager}: 7d=${item.reliability7d}%, 30d=${item.reliability30d}%, delta=${sign}${delta}pp (${signal}), gate=${item.gateStatus}`;
        })
        .join("\n")
    : historySummary?.packageManagers
      ? (() => {
        const last7 = mapManagersByName(historySummary.packageManagers.last7 || []);
        const last30 = mapManagersByName(historySummary.packageManagers.last30 || []);
        const names = new Set([...last7.keys(), ...last30.keys()]);

        if (names.size === 0) {
          return "  - not available";
        }

        return [...names]
          .sort((a, b) => a.localeCompare(b))
          .map((name) => {
            const r7 = Number(last7.get(name)?.reliabilityScore || 0);
            const r30 = Number(last30.get(name)?.reliabilityScore || 0);
            const delta = Math.round((r7 - r30) * 100) / 100;
            const signal = delta > 0 ? "improving" : delta < 0 ? "regressing" : "stable";
            const sign = delta > 0 ? "+" : "";
            return `  - ${name}: 7d=${r7}%, 30d=${r30}%, delta=${sign}${delta}pp (${signal})`;
          })
          .join("\n");
        })()
      : "  - not available";

  const riskSignalItems = [];
  if (dependency?.failedByPolicy) {
    riskSignalItems.push("policy-failed");
  }
  if (dependency?.failedByManagerGates) {
    riskSignalItems.push("manager-gate-failed");
  }
  if (dependency?.failedByTrendGates) {
    riskSignalItems.push("manager-trend-gate-failed");
  }
  if (dependency?.failedByExecution) {
    riskSignalItems.push("audit-execution-failed");
  }
  const decisionCapacity = historySummary?.decisionsRetentionCapacity;
  if (decisionCapacity?.level === "warn") {
    riskSignalItems.push("decision-log-capacity-warn");
  }
  if (decisionCapacity?.level === "high") {
    riskSignalItems.push("decision-log-capacity-high");
  }
  if (decisionCapacity?.level === "critical") {
    riskSignalItems.push("decision-log-capacity-critical");
  }
  const riskSignalLine = riskSignalItems.length > 0 ? `- ${riskSignalItems.join(", ")}` : "- no active risk signal";

  const needsGateRemediation = Boolean(
    dependency?.failedByManagerGatesEnforced || dependency?.failedByTrendGatesEnforced,
  );
  const hasObserveWarnings = Boolean(
    dependency &&
      (dependency.failedByManagerGates || dependency.failedByTrendGates) &&
      !needsGateRemediation,
  );
  const remediationSection = needsGateRemediation
    ? [
        "",
        "Gate remediation:",
        "- blocking failure detected: tune gate thresholds or fix failing domains before merge",
        "- inspect [tools/governance/latest-dependency-report.json](tools/governance/latest-dependency-report.json) for gate failure details",
        "- run `node tools/governance/run-dependency-audit.mjs` and `node tools/governance/tests-gate-policy-resolution.mjs` locally",
      ].join("\n")
    : hasObserveWarnings
      ? [
          "",
          "Gate warnings (observe mode):",
          "- non-blocking gate signals detected; review thresholds before switching this branch to enforce",
          "- inspect [tools/governance/latest-dependency-report.json](tools/governance/latest-dependency-report.json) for warning details",
        ].join("\n")
      : "";

  const promotionSection = dependency?.gatePromotion?.recommendation === "promote-to-enforce"
    ? (() => {
      const policySnippet = buildPromotionSnippet(gatePolicy, dependency.gatePromotion.branch);
      const snippetLines = policySnippet
        ? [
            "- suggested policy snippet:",
            "```json",
            policySnippet,
            "```",
          ]
        : [];

      return [
        "",
        "Promotion ready alert:",
        "- branch is eligible to move from observe to enforce based on consecutive clean runs",
        `- target branch: ${dependency.gatePromotion.branch}`,
        `- achieved streak: ${dependency.gatePromotion.projectedConsecutiveObservePasses}/${dependency.gatePromotion.promoteAfterConsecutivePasses}`,
        "- action now: update [tools/governance/config/package-manager-gates.json](tools/governance/config/package-manager-gates.json) and set `gateMode` to `enforce` for the target branch while preserving current thresholds",
        "- after change: rerun `node tools/governance/run-dependency-audit.mjs` and `node tools/governance/tests-gate-policy-resolution.mjs`",
        ...snippetLines,
      ].join("\n");
    })()
    : "";

  const promotionChecklistSection = dependency?.gatePromotion?.recommendation === "promote-to-enforce"
    ? [
        "",
        "Promotion approval checklist:",
        "- [ ] no blocking gate failures in current run (`failedByManagerGatesEnforced=false` and `failedByTrendGatesEnforced=false`)",
        "- [ ] trend remains stable or improving across all package managers (7d vs 30d)",
        "- [ ] promotion snippet applied to [tools/governance/config/package-manager-gates.json](tools/governance/config/package-manager-gates.json)",
        "- [ ] post-change validation executed (`run-dependency-audit` + `tests-gate-policy-resolution` + `run-governance`)",
        "",
        "Rollback conditions:",
        "- if any manager gate fails within the observation window after promotion, revert branch `gateMode` to `observe`",
        "- if trend gate fails with sustained reliability drop, revert to `observe` and recalibrate thresholds before retrying promotion",
        "- if audit execution errors increase above policy tolerance, revert to `observe` until runner stability is restored",
      ].join("\n")
    : "";

  const discoveryLine = discovery
    ? `- new domain candidates=${discovery.candidates?.length ?? 0}`
    : "- domain discovery not available";

  const latestDecision = historySummary?.gateModeDecisions?.allTime?.latest;
  const decisionLine = latestDecision
    ? `- latest decision=${latestDecision.decisionType}, branch=${latestDecision.branch}, transition=${latestDecision.fromMode}->${latestDecision.toMode}, approvedBy=${latestDecision.approvedBy}, at=${latestDecision.timestamp}`
    : "- no promotion/rollback decision recorded yet";
  const decisionsUsage = historySummary?.decisionsRetentionUsage;
  const decisionsCapacityLine = decisionCapacity
    ? `- decision-log-capacity: level=${decisionCapacity.level}, usage=${decisionCapacity.usagePercent}%, branch=${decisionCapacity.branch || "unknown"}, thresholds=${decisionCapacity.thresholds.warn}/${decisionCapacity.thresholds.high}/${decisionCapacity.thresholds.critical}%, threshold-source=${decisionCapacity.thresholdSources?.warn || "n/a"}/${decisionCapacity.thresholdSources?.high || "n/a"}/${decisionCapacity.thresholdSources?.critical || "n/a"}`
    : "- decision-log-capacity: not available";
  const decisionsUsageLine = decisionsUsage
    ? `- decision-log-storage: files=${decisionsUsage.fileCount}, archives=${decisionsUsage.archiveCount}, totalBytes=${decisionsUsage.totalBytes}, activeBytes=${decisionsUsage.mainBytes}, archivesBytes=${decisionsUsage.archivesBytes}`
    : "- decision-log-storage: not available";
  const readinessLine = readiness
    ? `- threshold-readiness: recommendation=${readiness.recommendation}, ready=${readiness.status?.ready}, runs7d=${readiness.metrics?.runs7d}, passRate7d=${readiness.metrics?.passRate7d}%, capacity=${readiness.metrics?.decisionsCapacityLevel}`
    : "- threshold-readiness: not available";

  const body = [
    "<!-- governance-quality-report -->",
    "## Governance Quality Report",
    "",
    `Overall: ${report.failed ? "❌ FAILED" : "✅ PASSED"}`,
    `Generated at: ${report.generatedAt}`,
    "",
    "| Check | Status |",
    "|------|--------|",
    rows,
    "",
    `Parity details: ${getParityStatus()}`,
    "",
    "Risk summary:",
    riskSignalLine,
    "",
    "Dependency audit:",
    dependencyLine,
    "- Domains:",
    dependencyDomainLines,
    "- Package managers:",
    dependencyManagerLines,
    "- Package manager gates:",
    managerGateLine,
    managerGateFailureLines,
    "- Package manager trend gates:",
    managerTrendGateLine,
    managerTrendGateFailureLines,
    "- Gate rollout:",
    gateRolloutLine,
    "",
    "Trend:",
    trendLine,
    "- Manager reliability delta (7d vs 30d):",
    managerTrendDeltaLines,
    "",
    "Domain onboarding:",
    discoveryLine,
    "",
    "Rollout decision record:",
    decisionLine,
    decisionsCapacityLine,
    decisionsUsageLine,
    readinessLine,
    remediationSection,
    promotionSection,
    promotionChecklistSection,
    "",
    "If this report fails, run `node tools/governance/run-governance.mjs` locally.",
  ].join("\n");

  fs.writeFileSync(outputPath, `${body}\n`, "utf8");
  console.log(`PR comment generated at ${outputPath}`);
}

main();
