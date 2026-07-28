import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { repoRoot, readJson } from "./common.mjs";

const SEVERITY_ORDER = ["info", "low", "moderate", "high", "critical"];
const LOCKFILE_BY_MANAGER = {
  npm: "package-lock.json",
  pnpm: "pnpm-lock.yaml",
  yarn: "yarn.lock",
};

function resolveBranch() {
  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }

  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }

  return "main";
}

function resolveConfig() {
  const cfgPath = path.join(repoRoot, "tools", "governance", "config", "dependency-severity-baseline.json");
  return readJson(cfgPath);
}

function resolveThreshold(cfg, branch, domainCfg) {
  if (domainCfg?.branches?.[branch]) {
    return domainCfg.branches[branch];
  }

  if (domainCfg?.default) {
    return domainCfg.default;
  }

  return cfg.branches?.[branch] || cfg.default || "critical";
}

function parseAudit(stdout) {
  const parsed = parseJsonAuditOutput(stdout);
  const vulns = extractVulnerabilityCounts(parsed);

  return {
    info: Number(vulns.info || 0),
    low: Number(vulns.low || 0),
    moderate: Number(vulns.moderate || 0),
    high: Number(vulns.high || 0),
    critical: Number(vulns.critical || 0),
    total: Number(vulns.total || 0),
  };
}

function parseJsonAuditOutput(stdout) {
  const text = String(stdout || "").trim();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const parsedLines = [];
    for (const line of lines) {
      try {
        parsedLines.push(JSON.parse(line));
      } catch {
        // Some package managers print non-JSON lines even with --json.
      }
    }

    if (parsedLines.length > 0) {
      return parsedLines[parsedLines.length - 1];
    }

    return {};
  }
}

function emptyVulnerabilities() {
  return {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
    total: 0,
  };
}

function normalizeSeverity(value) {
  const key = String(value || "").toLowerCase();
  return SEVERITY_ORDER.includes(key) ? key : null;
}

function finalizeCounts(counts) {
  const total = SEVERITY_ORDER.reduce((sum, key) => sum + Number(counts[key] || 0), 0);
  return { ...counts, total };
}

function extractVulnerabilityCounts(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return emptyVulnerabilities();
  }

  if (parsed.metadata?.vulnerabilities && typeof parsed.metadata.vulnerabilities === "object") {
    const meta = parsed.metadata.vulnerabilities;
    return finalizeCounts({
      info: Number(meta.info || 0),
      low: Number(meta.low || 0),
      moderate: Number(meta.moderate || 0),
      high: Number(meta.high || 0),
      critical: Number(meta.critical || 0),
    });
  }

  if (parsed.vulnerabilities && typeof parsed.vulnerabilities === "object") {
    const counts = emptyVulnerabilities();
    const values = Object.values(parsed.vulnerabilities);

    if (values.every((value) => typeof value === "number")) {
      for (const key of SEVERITY_ORDER) {
        counts[key] = Number(parsed.vulnerabilities[key] || 0);
      }
      return finalizeCounts(counts);
    }

    for (const vuln of values) {
      const sev = normalizeSeverity(vuln?.severity);
      if (sev) {
        counts[sev] += 1;
      }
    }
    return finalizeCounts(counts);
  }

  if (parsed.advisories && typeof parsed.advisories === "object") {
    const counts = emptyVulnerabilities();
    for (const advisory of Object.values(parsed.advisories)) {
      const sev = normalizeSeverity(advisory?.severity);
      if (sev) {
        counts[sev] += 1;
      }
    }
    return finalizeCounts(counts);
  }

  return emptyVulnerabilities();
}

function resolveCommand(packageManager) {
  return packageManager;
}

function getAuditCommands(packageManager) {
  if (packageManager === "npm") {
    return [["audit", "--omit=dev", "--package-lock-only", "--json"]];
  }

  if (packageManager === "pnpm") {
    return [["audit", "--prod", "--json"]];
  }

  if (packageManager === "yarn") {
    return [
      ["npm", "audit", "--recursive", "--json"],
      ["audit", "--groups", "dependencies", "--json"],
    ];
  }

  return [];
}

function toShellCommand(command, args) {
  const escapedArgs = args.map((arg) => {
    const value = String(arg).replace(/"/g, '\\"');
    return `"${value}"`;
  });

  return [command, ...escapedArgs].join(" ");
}

function runAuditCommand(packageManager, domainPath) {
  const command = resolveCommand(packageManager);
  const candidates = getAuditCommands(packageManager);

  if (candidates.length === 0) {
    return {
      status: 0,
      stdout: "{}",
      stderr: "",
      command,
      args: [],
      error: null,
    };
  }

  let lastResult = null;
  for (const args of candidates) {
    const result =
      process.platform === "win32"
        ? spawnSync(toShellCommand(command, args), {
            cwd: domainPath,
            encoding: "utf8",
            shell: true,
          })
        : spawnSync(command, args, {
            cwd: domainPath,
            encoding: "utf8",
          });

    const stdout = result.stdout || "";
    const stderr = result.stderr || "";
    const parsed = parseJsonAuditOutput(stdout);
    const hasStructuredPayload = Object.keys(parsed).length > 0;

    lastResult = {
      status: result.status ?? 1,
      stdout,
      stderr,
      command,
      args,
      error: result.error || null,
    };

    if (result.error) {
      continue;
    }

    if (hasStructuredPayload) {
      return lastResult;
    }

    if ((result.status ?? 1) === 0) {
      return lastResult;
    }
  }

  return (
    lastResult || {
      status: 1,
      stdout: "{}",
      stderr: "no audit command executed",
      command,
      args: [],
      error: null,
    }
  );
}

function shouldFail(vulnCount, threshold) {
  const minIdx = SEVERITY_ORDER.indexOf(threshold);
  if (minIdx < 0) {
    return false;
  }

  for (let i = minIdx; i < SEVERITY_ORDER.length; i += 1) {
    const key = SEVERITY_ORDER[i];
    if ((vulnCount[key] || 0) > 0) {
      return true;
    }
  }

  return false;
}

function runAuditForDomain(branch, cfg, domainName, domainCfg) {
  const domainPath = path.join(repoRoot, domainCfg.path);
  const threshold = resolveThreshold(cfg, branch, domainCfg);
  const packageManager = domainCfg.packageManager || "npm";
  const lockFileName = LOCKFILE_BY_MANAGER[packageManager] || null;
  const lockPath = lockFileName ? path.join(domainPath, lockFileName) : null;

  if (!lockFileName) {
    return {
      domain: domainName,
      path: domainCfg.path,
      packageManager,
      threshold,
      auditExitCode: 0,
      vulnerabilities: emptyVulnerabilities(),
      failedByPolicy: false,
      failedByExecution: false,
      skipped: true,
      skipReason: `unsupported package manager: ${packageManager}`,
      stderr: "",
      executionError: null,
    };
  }

  if (lockPath && !fs.existsSync(lockPath) && domainCfg.optional) {
    return {
      domain: domainName,
      path: domainCfg.path,
      packageManager,
      threshold,
      auditExitCode: 0,
      vulnerabilities: emptyVulnerabilities(),
      failedByPolicy: false,
      failedByExecution: false,
      skipped: true,
      skipReason: `optional domain without ${lockFileName}`,
      stderr: "",
      executionError: null,
    };
  }

  const execution = runAuditCommand(packageManager, domainPath);
  const stdout = execution.stdout || "{}";
  const stderr = execution.stderr || "";
  const vulnerabilities = parseAudit(stdout);
  const executionError = execution.error ? String(execution.error.message || execution.error) : null;
  const failedByExecution = Boolean(executionError);
  const failedByPolicy = shouldFail(vulnerabilities, threshold);

  return {
    domain: domainName,
    path: domainCfg.path,
    packageManager,
    threshold,
    auditExitCode: execution.status ?? 1,
    npmExitCode: packageManager === "npm" ? execution.status ?? 1 : null,
    auditCommand: execution.command,
    auditArgs: execution.args,
    vulnerabilities,
    failedByPolicy: failedByPolicy || failedByExecution,
    failedByExecution,
    skipped: false,
    stderr: stderr.trim(),
    executionError,
  };
}

function summarizePackageManagers(domainReports) {
  const summaryMap = new Map();

  for (const report of domainReports) {
    const manager = report.packageManager || "unknown";
    if (!summaryMap.has(manager)) {
      summaryMap.set(manager, {
        packageManager: manager,
        domains: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        executionErrors: 0,
        vulnerabilities: emptyVulnerabilities(),
      });
    }

    const item = summaryMap.get(manager);
    item.domains += 1;

    if (report.skipped) {
      item.skipped += 1;
      continue;
    }

    if (report.failedByExecution) {
      item.executionErrors += 1;
      item.failed += 1;
      continue;
    }

    if (report.failedByPolicy) {
      item.failed += 1;
    } else {
      item.passed += 1;
    }

    for (const key of Object.keys(item.vulnerabilities)) {
      item.vulnerabilities[key] += Number(report.vulnerabilities?.[key] || 0);
    }
  }

  return [...summaryMap.values()].sort((a, b) => a.packageManager.localeCompare(b.packageManager));
}

function parseManagerThresholdMap(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    return {};
  }

  const entries = text.split(",").map((item) => item.trim()).filter(Boolean);
  const map = {};

  for (const entry of entries) {
    const [key, value] = entry.split(":").map((part) => part?.trim());
    if (!key || value === undefined) {
      continue;
    }

    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0) {
      continue;
    }

    map[key] = Math.floor(numberValue);
  }

  return map;
}

function parseManagerFloatThresholdMap(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    return {};
  }

  const entries = text.split(",").map((item) => item.trim()).filter(Boolean);
  const map = {};

  for (const entry of entries) {
    const [key, value] = entry.split(":").map((part) => part?.trim());
    if (!key || value === undefined) {
      continue;
    }

    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0) {
      continue;
    }

    map[key] = Math.round(numberValue * 100) / 100;
  }

  return map;
}

function readBranchGatePolicy() {
  const policyPath = path.join(repoRoot, "tools", "governance", "config", "package-manager-gates.json");
  if (!fs.existsSync(policyPath)) {
    return {};
  }

  try {
    return readJson(policyPath);
  } catch {
    return {};
  }
}

function mergeNumberMaps(baseMap, overrideMap) {
  return {
    ...(baseMap || {}),
    ...(overrideMap || {}),
  };
}

function normalizeGateMode(value) {
  const mode = String(value || "").trim().toLowerCase();
  return mode === "observe" ? "observe" : "enforce";
}

function parsePositiveInteger(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return null;
  }
  return Math.floor(num);
}

function resolveHistoryPath() {
  const envPath = String(process.env.GOVERNANCE_PM_HISTORY_PATH || "").trim();
  if (envPath) {
    return path.resolve(envPath);
  }
  return path.join(repoRoot, "tools", "governance", "history", "governance-history.jsonl");
}

function readHistoryEntries(historyPath) {
  if (!fs.existsSync(historyPath)) {
    return [];
  }

  const lines = fs
    .readFileSync(historyPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const entries = [];
  for (const line of lines) {
    try {
      entries.push(JSON.parse(line));
    } catch {
      // Ignore malformed historical lines and continue.
    }
  }

  return entries;
}

function isObservePassRecord(record) {
  if (!record || typeof record !== "object") {
    return false;
  }

  if ((record.dependencyGateMode || "") !== "observe") {
    return false;
  }

  if (record.dependencyAuditExecutionFailed === true) {
    return false;
  }

  if (record.dependencyFailedByManagerGates === true) {
    return false;
  }

  if (record.dependencyFailedByTrendGates === true) {
    return false;
  }

  return record.dependencyFailed === false;
}

function calcConsecutiveObservePasses(historyEntries, branch) {
  const branchEntries = historyEntries.filter((entry) => entry?.dependencyBranch === branch);
  let streak = 0;

  for (let i = branchEntries.length - 1; i >= 0; i -= 1) {
    const record = branchEntries[i];
    if (!isObservePassRecord(record)) {
      break;
    }
    streak += 1;
  }

  return streak;
}

function evaluateGatePromotion(branch, gateInputs, status) {
  const gateMode = gateInputs.gateMode || "enforce";
  const promoteAfterConsecutivePasses = Number(gateInputs.promoteAfterConsecutivePasses || 5);

  if (gateMode !== "observe") {
    return {
      branch,
      gateMode,
      promoteAfterConsecutivePasses,
      historicalConsecutiveObservePasses: 0,
      projectedConsecutiveObservePasses: 0,
      eligibleForEnforcePromotion: false,
      recommendation: "not-applicable",
      reason: "branch already in enforce mode",
    };
  }

  const historyPath = resolveHistoryPath();
  const historyEntries = readHistoryEntries(historyPath);
  const historicalConsecutiveObservePasses = calcConsecutiveObservePasses(historyEntries, branch);
  const currentObservePass =
    !status.failedByExecution && !status.failedByManagerGates && !status.failedByTrendGates;
  const projectedConsecutiveObservePasses = currentObservePass
    ? historicalConsecutiveObservePasses + 1
    : 0;
  const eligibleForEnforcePromotion =
    currentObservePass && projectedConsecutiveObservePasses >= promoteAfterConsecutivePasses;

  return {
    branch,
    gateMode,
    promoteAfterConsecutivePasses,
    historicalConsecutiveObservePasses,
    projectedConsecutiveObservePasses,
    eligibleForEnforcePromotion,
    recommendation: eligibleForEnforcePromotion ? "promote-to-enforce" : "keep-observe",
    reason: currentObservePass
      ? eligibleForEnforcePromotion
        ? `streak reached ${projectedConsecutiveObservePasses}/${promoteAfterConsecutivePasses}`
        : `streak ${projectedConsecutiveObservePasses}/${promoteAfterConsecutivePasses} not enough for promotion`
      : "current run has gate failures while in observe mode",
  };
}

function resolvePackageManagerGateInputs(branch) {
  const policy = readBranchGatePolicy();
  const defaults = policy.default || {};
  const branchPolicy = policy.branches?.[branch] || {};
  const envGateMode = process.env.GOVERNANCE_PM_GATE_MODE;
  const gateMode = normalizeGateMode(envGateMode ?? branchPolicy.gateMode ?? defaults.gateMode ?? "enforce");
  const envPromoteAfter = parsePositiveInteger(process.env.GOVERNANCE_PM_PROMOTE_AFTER_RUNS);
  const branchPromoteAfter = parsePositiveInteger(branchPolicy.promoteAfterConsecutivePasses);
  const defaultPromoteAfter = parsePositiveInteger(defaults.promoteAfterConsecutivePasses);
  const promoteAfterConsecutivePasses = envPromoteAfter || branchPromoteAfter || defaultPromoteAfter || 5;

  return {
    source: {
      policyFile: "tools/governance/config/package-manager-gates.json",
      branch,
      gateModeFrom: envGateMode ? "env" : branchPolicy.gateMode ? "branch" : defaults.gateMode ? "default" : "implicit",
      promoteAfterFrom: envPromoteAfter
        ? "env"
        : branchPromoteAfter
          ? "branch"
          : defaultPromoteAfter
            ? "default"
            : "implicit",
    },
    gateMode,
    promoteAfterConsecutivePasses,
    minExecutedByManager: mergeNumberMaps(
      mergeNumberMaps(defaults.minExecutedByManager, branchPolicy.minExecutedByManager),
      parseManagerThresholdMap(process.env.GOVERNANCE_PM_MIN_EXECUTED),
    ),
    maxExecErrorsByManager: mergeNumberMaps(
      mergeNumberMaps(defaults.maxExecErrorsByManager, branchPolicy.maxExecErrorsByManager),
      parseManagerThresholdMap(process.env.GOVERNANCE_PM_MAX_EXEC_ERRORS),
    ),
    maxDropByManager: mergeNumberMaps(
      mergeNumberMaps(defaults.maxReliabilityDropPpByManager, branchPolicy.maxReliabilityDropPpByManager),
      parseManagerFloatThresholdMap(process.env.GOVERNANCE_PM_MAX_RELIABILITY_DROP_PP),
    ),
    minTrendRunsByManager: mergeNumberMaps(
      mergeNumberMaps(defaults.minTrendRunsByManager, branchPolicy.minTrendRunsByManager),
      parseManagerThresholdMap(process.env.GOVERNANCE_PM_MIN_TREND_RUNS),
    ),
  };
}

function readHistorySummary() {
  const summaryPath = path.join(repoRoot, "tools", "governance", "history", "governance-history-summary.json");
  if (!fs.existsSync(summaryPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  } catch {
    return null;
  }
}

function indexManagers(items) {
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

function evaluatePackageManagerTrendGates(packageManagerSummary, gateInputs) {
  const maxDropByManager = gateInputs.maxDropByManager || {};
  const minTrendRunsByManager = gateInputs.minTrendRunsByManager || {};
  const historySummary = readHistorySummary();
  const last7Map = indexManagers(historySummary?.packageManagers?.last7 || []);
  const last30Map = indexManagers(historySummary?.packageManagers?.last30 || []);
  const failures = [];
  const managers = [];

  for (const current of packageManagerSummary) {
    const manager = current.packageManager;
    const hist7 = last7Map.get(manager);
    const hist30 = last30Map.get(manager);
    const r7 = Number(hist7?.reliabilityScore || 0);
    const r30 = Number(hist30?.reliabilityScore || 0);
    const delta = Math.round((r7 - r30) * 100) / 100;
    const drop = Math.round((r30 - r7) * 100) / 100;
    const minRuns = Number(minTrendRunsByManager[manager] ?? 1);
    const runs7 = Number(hist7?.runs || 0);
    const runs30 = Number(hist30?.runs || 0);
    const hasData = Boolean(hist7 && hist30);
    const gateApplied = Number.isFinite(maxDropByManager[manager]);
    const maxDrop = Number(maxDropByManager[manager] ?? 0);

    const trendItem = {
      packageManager: manager,
      reliability7d: r7,
      reliability30d: r30,
      delta,
      drop,
      runs7,
      runs30,
      minRuns,
      gateApplied,
      maxDrop,
      gateStatus: "PASS",
      reason: null,
    };

    if (!hasData) {
      trendItem.gateStatus = gateApplied ? "NO_DATA" : "NOT_CONFIGURED";
      trendItem.reason = "history missing for manager";
      if (gateApplied) {
        failures.push({
          packageManager: manager,
          type: "trend-data-missing",
          expected: "history available",
          actual: "missing",
          message: trendItem.reason,
        });
        trendItem.gateStatus = "FAIL";
      }
      managers.push(trendItem);
      continue;
    }

    if (!gateApplied) {
      trendItem.gateStatus = "NOT_CONFIGURED";
      managers.push(trendItem);
      continue;
    }

    if (runs7 < minRuns || runs30 < minRuns) {
      trendItem.gateStatus = "INSUFFICIENT_RUNS";
      trendItem.reason = `insufficient runs (7d=${runs7}, 30d=${runs30}, min=${minRuns})`;
      failures.push({
        packageManager: manager,
        type: "insufficient-trend-runs",
        expected: minRuns,
        actual: Math.min(runs7, runs30),
        message: trendItem.reason,
      });
      trendItem.gateStatus = "FAIL";
      managers.push(trendItem);
      continue;
    }

    if (drop > maxDrop) {
      trendItem.gateStatus = "FAIL";
      trendItem.reason = `drop ${drop}pp exceeds max ${maxDrop}pp`;
      failures.push({
        packageManager: manager,
        type: "reliability-drop-pp",
        expected: maxDrop,
        actual: drop,
        message: trendItem.reason,
      });
    }

    managers.push(trendItem);
  }

  return {
    config: {
      maxDropByManager,
      minTrendRunsByManager,
      source: gateInputs.source || null,
    },
    managers,
    failures,
    failed: failures.length > 0,
  };
}

function evaluatePackageManagerGates(packageManagerSummary, gateInputs) {
  const minExecutedByManager = gateInputs.minExecutedByManager || {};
  const maxExecErrorsByManager = gateInputs.maxExecErrorsByManager || {};
  const failures = [];

  for (const item of packageManagerSummary) {
    const executed = item.passed + item.failed;
    const minExecuted = minExecutedByManager[item.packageManager];
    if (Number.isFinite(minExecuted) && executed < minExecuted) {
      failures.push({
        packageManager: item.packageManager,
        type: "min-executed",
        expected: minExecuted,
        actual: executed,
        message: `executed domains ${executed} is below minimum ${minExecuted}`,
      });
    }

    const maxExecErrors = maxExecErrorsByManager[item.packageManager];
    if (Number.isFinite(maxExecErrors) && item.executionErrors > maxExecErrors) {
      failures.push({
        packageManager: item.packageManager,
        type: "max-execution-errors",
        expected: maxExecErrors,
        actual: item.executionErrors,
        message: `execution errors ${item.executionErrors} exceeds maximum ${maxExecErrors}`,
      });
    }
  }

  return {
    config: {
      minExecutedByManager,
      maxExecErrorsByManager,
      source: gateInputs.source || null,
    },
    failures,
    failed: failures.length > 0,
  };
}

function main() {
  const branch = resolveBranch();
  const cfg = resolveConfig();
  const domains = Object.entries(cfg.domains || {});

  if (domains.length === 0) {
    throw new Error("No dependency audit domains configured in dependency-severity-baseline.json");
  }

  const domainReports = domains.map(([domainName, domainCfg]) =>
    runAuditForDomain(branch, cfg, domainName, domainCfg),
  );

  const aggregate = {
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
    total: 0,
  };

  for (const report of domainReports) {
    for (const key of Object.keys(aggregate)) {
      aggregate[key] += Number(report.vulnerabilities[key] || 0);
    }
  }

  const failedByExecution = domainReports.some((report) => report.failedByExecution);
  const failedByPolicy = domainReports.some((report) => report.failedByPolicy);
  const packageManagerSummary = summarizePackageManagers(domainReports);
  const packageManagerGateInputs = resolvePackageManagerGateInputs(branch);
  const packageManagerGateMode = packageManagerGateInputs.gateMode || "enforce";
  const gatesEnforced = packageManagerGateMode === "enforce";
  const packageManagerGates = evaluatePackageManagerGates(packageManagerSummary, packageManagerGateInputs);
  const failedByManagerGates = packageManagerGates.failed;
  const failedByManagerGatesEnforced = gatesEnforced && failedByManagerGates;
  const packageManagerTrendGates = evaluatePackageManagerTrendGates(
    packageManagerSummary,
    packageManagerGateInputs,
  );
  const failedByTrendGates = packageManagerTrendGates.failed;
  const failedByTrendGatesEnforced = gatesEnforced && failedByTrendGates;
  const gatePromotion = evaluateGatePromotion(branch, packageManagerGateInputs, {
    failedByExecution,
    failedByManagerGates,
    failedByTrendGates,
  });

  const report = {
    generatedAt: new Date().toISOString(),
    branch,
    defaultThreshold: cfg.branches?.[branch] || cfg.default || "critical",
    vulnerabilities: aggregate,
    domains: domainReports,
    packageManagers: packageManagerSummary,
    packageManagerGateInputs,
    packageManagerGateMode,
    gatesEnforced,
    packageManagerGates,
    packageManagerTrendGates,
    gatePromotion,
    failedByExecution,
    failedByPolicy: failedByPolicy || failedByManagerGatesEnforced || failedByTrendGatesEnforced,
    failedByManagerGates,
    failedByManagerGatesEnforced,
    failedByTrendGates,
    failedByTrendGatesEnforced,
  };

  const reportPath = path.join(repoRoot, "tools", "governance", "latest-dependency-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Dependency audit summary");
  console.log("------------------------");
  console.log(`Branch: ${branch}`);
  console.log(`Default threshold: ${report.defaultThreshold}`);
  console.log(
    `Aggregate vulnerabilities: info=${aggregate.info}, low=${aggregate.low}, moderate=${aggregate.moderate}, high=${aggregate.high}, critical=${aggregate.critical}, total=${aggregate.total}`,
  );
  for (const domainReport of domainReports) {
    if (domainReport.skipped) {
      console.log(
        `Domain ${domainReport.domain} (${domainReport.path}, ${domainReport.packageManager}): skipped (${domainReport.skipReason})`,
      );
      continue;
    }
    if (domainReport.failedByExecution) {
      console.log(
        `Domain ${domainReport.domain} (${domainReport.path}, ${domainReport.packageManager}): execution error (${domainReport.executionError || "unknown error"})`,
      );
      continue;
    }
    console.log(
      `Domain ${domainReport.domain} (${domainReport.path}, ${domainReport.packageManager}): threshold=${domainReport.threshold}, policy=${domainReport.failedByPolicy ? "FAIL" : "PASS"}, total=${domainReport.vulnerabilities.total}`,
    );
  }
  if (packageManagerSummary.length > 0) {
    console.log("Package manager summary:");
    for (const item of packageManagerSummary) {
      console.log(
        `- ${item.packageManager}: domains=${item.domains}, passed=${item.passed}, failed=${item.failed}, skipped=${item.skipped}, execErrors=${item.executionErrors}, total=${item.vulnerabilities.total}`,
      );
    }
  }
  if (packageManagerGates.failures.length > 0) {
    console.log(`Package manager gates (${packageManagerGateMode}):`);
    for (const failure of packageManagerGates.failures) {
      console.log(`- ${failure.packageManager}/${failure.type}: ${failure.message}`);
    }
  }
  if (packageManagerTrendGates.failures.length > 0) {
    console.log(`Package manager trend gates (${packageManagerGateMode}):`);
    for (const failure of packageManagerTrendGates.failures) {
      console.log(`- ${failure.packageManager}/${failure.type}: ${failure.message}`);
    }
  }
  if (gatePromotion.gateMode === "observe") {
    console.log(
      `Gate promotion: ${gatePromotion.recommendation} (${gatePromotion.projectedConsecutiveObservePasses}/${gatePromotion.promoteAfterConsecutivePasses})`,
    );
  }
  console.log(
    `Gate enforcement mode: ${packageManagerGateMode} (${gatesEnforced ? "blocking" : "warning-only"})`,
  );
  console.log(
    `Policy status: ${failedByPolicy || failedByManagerGatesEnforced || failedByTrendGatesEnforced ? "FAIL" : "PASS"}`,
  );
  if (failedByExecution) {
    console.log("Execution status: FAIL");
  }
  console.log(`Report: ${reportPath}`);

  if (failedByPolicy || failedByManagerGatesEnforced || failedByTrendGatesEnforced) {
    process.exit(1);
  }
}

main();
