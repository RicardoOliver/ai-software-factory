import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { repoRoot, readJson } from "./common.mjs";

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function calcSummary(records) {
  const total = records.length;
  const passed = records.filter((r) => !r.governanceFailed && !r.dependencyFailed).length;
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 10000) / 100;
  return { total, passed, passRate };
}

function calcPackageManagerSummary(records) {
  const map = new Map();

  for (const record of records) {
    const managers = Array.isArray(record.dependencyPackageManagers)
      ? record.dependencyPackageManagers
      : [];

    for (const manager of managers) {
      const name = String(manager.packageManager || "unknown");
      if (!map.has(name)) {
        map.set(name, {
          packageManager: name,
          runs: 0,
          domains: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          executionErrors: 0,
          vulnerabilities: {
            info: 0,
            low: 0,
            moderate: 0,
            high: 0,
            critical: 0,
            total: 0,
          },
        });
      }

      const item = map.get(name);
      item.runs += 1;
      item.domains += Number(manager.domains || 0);
      item.passed += Number(manager.passed || 0);
      item.failed += Number(manager.failed || 0);
      item.skipped += Number(manager.skipped || 0);
      item.executionErrors += Number(manager.executionErrors || 0);

      const sourceVulns = manager.vulnerabilities || {};
      for (const key of Object.keys(item.vulnerabilities)) {
        item.vulnerabilities[key] += Number(sourceVulns[key] || 0);
      }
    }
  }

  const entries = [...map.values()].sort((a, b) => a.packageManager.localeCompare(b.packageManager));

  return entries.map((item) => {
    const executed = item.passed + item.failed;
    const reliabilityScore = executed === 0 ? 0 : Math.round((item.passed / executed) * 10000) / 100;
    return {
      ...item,
      reliabilityScore,
    };
  });
}

function filterByLastDays(records, days) {
  const now = Date.now();
  const windowMs = days * 24 * 60 * 60 * 1000;

  return records.filter((record) => {
    const ts = Date.parse(record.timestamp);
    if (Number.isNaN(ts)) {
      return false;
    }
    return now - ts <= windowMs;
  });
}

function findLastBranchEntry(records, branch) {
  for (let i = records.length - 1; i >= 0; i -= 1) {
    if (records[i]?.dependencyBranch === branch) {
      return records[i];
    }
  }
  return null;
}

function classifyDecisionType(previousMode, currentMode) {
  if (previousMode === "observe" && currentMode === "enforce") {
    return "promotion";
  }

  if (previousMode === "enforce" && currentMode === "observe") {
    return "rollback";
  }

  return null;
}

function detectGateDecision(records, currentEntry) {
  const branch = currentEntry?.dependencyBranch;
  const currentMode = currentEntry?.dependencyGateMode;
  if (!branch || !currentMode) {
    return null;
  }

  const previous = findLastBranchEntry(records, branch);
  if (!previous || !previous.dependencyGateMode) {
    return null;
  }

  const previousMode = previous.dependencyGateMode;
  const decisionType = classifyDecisionType(previousMode, currentMode);
  if (!decisionType) {
    return null;
  }

  return {
    timestamp: currentEntry.timestamp,
    branch,
    decisionType,
    fromMode: previousMode,
    toMode: currentMode,
    approvedBy: process.env.GOVERNANCE_PM_PROMOTION_APPROVER || process.env.GITHUB_ACTOR || "unknown",
    runSource: process.env.GITHUB_ACTIONS ? "github-actions" : "local",
    commitSha: process.env.GITHUB_SHA || null,
    reason:
      decisionType === "promotion"
        ? "auto-detected gate mode transition observe->enforce"
        : "auto-detected gate mode transition enforce->observe",
  };
}

function summarizeDecisions(decisions) {
  const total = decisions.length;
  const promotions = decisions.filter((item) => item.decisionType === "promotion").length;
  const rollbacks = decisions.filter((item) => item.decisionType === "rollback").length;
  return {
    total,
    promotions,
    rollbacks,
    latest: total > 0 ? decisions[total - 1] : null,
  };
}

function cleanupOldArchives(historyPath, archiveMaxDays) {
  const dir = path.dirname(historyPath);
  const file = path.basename(historyPath);
  const prefix = `${file}.`;
  const suffix = ".bak.gz";
  const maxAgeMs = archiveMaxDays * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    if (!entry.name.startsWith(prefix) || !entry.name.endsWith(suffix)) {
      continue;
    }

    const archivePath = path.join(dir, entry.name);
    const stats = fs.statSync(archivePath);
    if (now - stats.mtimeMs > maxAgeMs) {
      fs.unlinkSync(archivePath);
    }
  }
}

function listHistoryFiles(historyPath) {
  const dir = path.dirname(historyPath);
  const file = path.basename(historyPath);
  const prefix = `${file}.`;
  const suffix = ".bak.gz";

  const files = [];
  if (fs.existsSync(historyPath)) {
    files.push(historyPath);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    if (!entry.name.startsWith(prefix) || !entry.name.endsWith(suffix)) {
      continue;
    }
    files.push(path.join(dir, entry.name));
  }

  return files;
}

function getTotalBytes(filePaths) {
  return filePaths.reduce((sum, item) => {
    if (!fs.existsSync(item)) {
      return sum;
    }
    return sum + fs.statSync(item).size;
  }, 0);
}

function enforceSizeBudget(historyPath, maxBytes, minKeepEntries) {
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) {
    return;
  }

  const files = listHistoryFiles(historyPath);
  let totalBytes = getTotalBytes(files);
  if (totalBytes <= maxBytes) {
    return;
  }

  const archives = files
    .filter((file) => file !== historyPath)
    .map((file) => ({ file, mtimeMs: fs.statSync(file).mtimeMs }))
    .sort((a, b) => a.mtimeMs - b.mtimeMs);

  for (const archive of archives) {
    if (totalBytes <= maxBytes) {
      break;
    }
    fs.unlinkSync(archive.file);
    totalBytes = getTotalBytes(listHistoryFiles(historyPath));
  }

  if (!fs.existsSync(historyPath)) {
    return;
  }

  if (totalBytes <= maxBytes) {
    return;
  }

  const lines = fs
    .readFileSync(historyPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);

  if (lines.length <= minKeepEntries) {
    return;
  }

  let keepCount = lines.length;
  while (totalBytes > maxBytes && keepCount > minKeepEntries) {
    keepCount = Math.max(minKeepEntries, Math.floor(keepCount * 0.8));
    const kept = lines.slice(-keepCount);
    fs.writeFileSync(historyPath, `${kept.join("\n")}\n`, "utf8");

    if (keepCount === minKeepEntries) {
      break;
    }

    totalBytes = getTotalBytes(listHistoryFiles(historyPath));
  }
}

function rotateHistoryFile(historyPath, maxEntries, keepEntries) {
  if (!fs.existsSync(historyPath)) {
    return;
  }

  const lines = fs
    .readFileSync(historyPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);

  if (lines.length <= maxEntries) {
    return;
  }

  const archivePath = `${historyPath}.${Date.now()}.bak.gz`;
  const raw = fs.readFileSync(historyPath);
  const compressed = zlib.gzipSync(raw, { level: zlib.constants.Z_BEST_COMPRESSION });
  fs.writeFileSync(archivePath, compressed);

  const kept = lines.slice(-keepEntries);
  fs.writeFileSync(historyPath, `${kept.join("\n")}\n`, "utf8");
}

function applyRetentionPolicy(historyPath, cfg) {
  rotateHistoryFile(historyPath, cfg.maxEntries, cfg.keepEntries);
  cleanupOldArchives(historyPath, cfg.archiveMaxDays);
  enforceSizeBudget(historyPath, cfg.maxBytes, cfg.minKeepEntries);
}

function parsePercent(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0 || num > 100) {
    return fallback;
  }
  return Math.round(num * 100) / 100;
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

function readDecisionsCapacityPolicy() {
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

function normalizeCapacityThresholds(thresholds) {
  const warn = parsePercent(thresholds.warn, 70);
  const high = Math.max(warn, parsePercent(thresholds.high, 85));
  const critical = Math.max(high, parsePercent(thresholds.critical, 95));

  return { warn, high, critical };
}

function resolveDecisionsCapacityThresholds(branch) {
  const policy = readDecisionsCapacityPolicy();
  const defaults = policy?.default?.capacityThresholds || {};
  const branchCfg = policy?.branches?.[branch]?.capacityThresholds || {};

  const envWarn = process.env.GOVERNANCE_DECISIONS_CAPACITY_WARN_PERCENT;
  const envHigh = process.env.GOVERNANCE_DECISIONS_CAPACITY_HIGH_PERCENT;
  const envCritical = process.env.GOVERNANCE_DECISIONS_CAPACITY_CRITICAL_PERCENT;

  const warn =
    envWarn !== undefined && String(envWarn).trim() !== ""
      ? parsePercent(envWarn, 70)
      : branchCfg.warn !== undefined
        ? parsePercent(branchCfg.warn, 70)
        : parsePercent(defaults.warn, 70);
  const high =
    envHigh !== undefined && String(envHigh).trim() !== ""
      ? parsePercent(envHigh, 85)
      : branchCfg.high !== undefined
        ? parsePercent(branchCfg.high, 85)
        : parsePercent(defaults.high, 85);
  const critical =
    envCritical !== undefined && String(envCritical).trim() !== ""
      ? parsePercent(envCritical, 95)
      : branchCfg.critical !== undefined
        ? parsePercent(branchCfg.critical, 95)
        : parsePercent(defaults.critical, 95);

  const thresholdSources = {
    warn:
      envWarn !== undefined && String(envWarn).trim() !== ""
        ? "env"
        : branchCfg.warn !== undefined
          ? "branch-policy"
          : "default-policy",
    high:
      envHigh !== undefined && String(envHigh).trim() !== ""
        ? "env"
        : branchCfg.high !== undefined
          ? "branch-policy"
          : "default-policy",
    critical:
      envCritical !== undefined && String(envCritical).trim() !== ""
        ? "env"
        : branchCfg.critical !== undefined
          ? "branch-policy"
          : "default-policy",
  };

  return {
    branch,
    thresholds: normalizeCapacityThresholds({ warn, high, critical }),
    thresholdSources,
  };
}

function getHistoryStorageUsage(historyPath) {
  const files = listHistoryFiles(historyPath);
  const mainPath = historyPath;
  const archives = files.filter((item) => item !== mainPath);
  const mainBytes = fs.existsSync(mainPath) ? fs.statSync(mainPath).size : 0;
  const archivesBytes = getTotalBytes(archives);
  const totalBytes = mainBytes + archivesBytes;

  return {
    fileCount: files.length,
    archiveCount: archives.length,
    mainBytes,
    archivesBytes,
    totalBytes,
  };
}

function evaluateCapacityThresholds(usage, maxBytes, thresholds) {
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) {
    return {
      maxBytes,
      usagePercent: 0,
      level: "not-configured",
      exceededThresholds: [],
      thresholds,
    };
  }

  const usagePercent = Math.round((Number(usage.totalBytes || 0) / maxBytes) * 10000) / 100;
  const exceededThresholds = [];
  if (usagePercent >= thresholds.warn) {
    exceededThresholds.push("warn");
  }
  if (usagePercent >= thresholds.high) {
    exceededThresholds.push("high");
  }
  if (usagePercent >= thresholds.critical) {
    exceededThresholds.push("critical");
  }

  const level =
    usagePercent >= thresholds.critical
      ? "critical"
      : usagePercent >= thresholds.high
        ? "high"
        : usagePercent >= thresholds.warn
          ? "warn"
          : "ok";

  return {
    maxBytes,
    usagePercent,
    level,
    exceededThresholds,
    thresholds,
  };
}

function main() {
  const governancePath = path.join(repoRoot, "tools", "governance", "latest-report.json");
  const dependencyPath = path.join(repoRoot, "tools", "governance", "latest-dependency-report.json");

  const gov = readIfExists(governancePath);
  if (!gov) {
    throw new Error("latest-report.json not found. Run governance checks first.");
  }

  const dep = readIfExists(dependencyPath);
  const defaultHistoryDir = path.join(repoRoot, "tools", "governance", "history");
  const historyPath =
    process.env.GOVERNANCE_HISTORY_PATH || path.join(defaultHistoryDir, "governance-history.jsonl");
  const summaryPath =
    process.env.GOVERNANCE_HISTORY_SUMMARY_PATH ||
    path.join(defaultHistoryDir, "governance-history-summary.json");
  const decisionsPath =
    process.env.GOVERNANCE_DECISIONS_PATH || path.join(defaultHistoryDir, "gate-promotion-decisions.jsonl");
  const maxEntries = Number(process.env.GOVERNANCE_HISTORY_MAX_ENTRIES || 5000);
  const keepEntries = Number(process.env.GOVERNANCE_HISTORY_KEEP_ENTRIES || 4000);
  const archiveMaxDays = Number(process.env.GOVERNANCE_HISTORY_ARCHIVE_MAX_DAYS || 30);
  const maxBytes = Number(process.env.GOVERNANCE_HISTORY_MAX_BYTES || 20971520);
  const minKeepEntries = Number(process.env.GOVERNANCE_HISTORY_MIN_KEEP_ENTRIES || 1000);
  const decisionMaxEntries = Number(process.env.GOVERNANCE_DECISIONS_MAX_ENTRIES || 2000);
  const decisionKeepEntries = Number(process.env.GOVERNANCE_DECISIONS_KEEP_ENTRIES || 1500);
  const decisionArchiveMaxDays = Number(process.env.GOVERNANCE_DECISIONS_ARCHIVE_MAX_DAYS || 90);
  const decisionMaxBytes = Number(process.env.GOVERNANCE_DECISIONS_MAX_BYTES || 5242880);
  const decisionMinKeepEntries = Number(process.env.GOVERNANCE_DECISIONS_MIN_KEEP_ENTRIES || 500);
  const branch = resolveBranch();
  const decisionsCapacityThresholds = resolveDecisionsCapacityThresholds(branch);

  const requiredDirs = new Set([
    path.dirname(historyPath),
    path.dirname(summaryPath),
    path.dirname(decisionsPath),
  ]);
  for (const dirPath of requiredDirs) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  applyRetentionPolicy(historyPath, {
    maxEntries,
    keepEntries,
    archiveMaxDays,
    maxBytes,
    minKeepEntries,
  });

  const historicalEntries = readJsonLines(historyPath);

  const entry = {
    timestamp: new Date().toISOString(),
    governanceFailed: Boolean(gov.failed),
    governanceChecks: gov.checks || [],
    dependencyBranch: dep?.branch || null,
    dependencyGateMode: dep?.packageManagerGateMode || null,
    dependencyFailed: dep ? Boolean(dep.failedByPolicy) : null,
    dependencyFailedByManagerGates: dep ? Boolean(dep.failedByManagerGates) : null,
    dependencyFailedByTrendGates: dep ? Boolean(dep.failedByTrendGates) : null,
    dependencyAuditExecutionFailed: dep ? Boolean(dep.failedByExecution) : null,
    dependencyGatePromotionEligible: dep ? Boolean(dep.gatePromotion?.eligibleForEnforcePromotion) : null,
    dependencyConsecutiveObservePasses: dep?.gatePromotion?.projectedConsecutiveObservePasses ?? null,
    dependencyPromoteAfterConsecutivePasses: dep?.gatePromotion?.promoteAfterConsecutivePasses ?? null,
    dependencyThreshold: dep?.threshold || null,
    dependencyVulnerabilities: dep?.vulnerabilities || null,
    dependencyPackageManagers: dep?.packageManagers || [],
  };

  const decision = detectGateDecision(historicalEntries, entry);
  if (decision) {
    fs.appendFileSync(decisionsPath, `${JSON.stringify(decision)}\n`, "utf8");
  }

  applyRetentionPolicy(decisionsPath, {
    maxEntries: decisionMaxEntries,
    keepEntries: decisionKeepEntries,
    archiveMaxDays: decisionArchiveMaxDays,
    maxBytes: decisionMaxBytes,
    minKeepEntries: decisionMinKeepEntries,
  });

  fs.appendFileSync(historyPath, `${JSON.stringify(entry)}\n`, "utf8");

  const lines = readJsonLines(historyPath);
  const decisions = readJsonLines(decisionsPath);
  const decisionsUsage = getHistoryStorageUsage(decisionsPath);
  const decisionsCapacity = {
    ...evaluateCapacityThresholds(decisionsUsage, decisionMaxBytes, decisionsCapacityThresholds.thresholds),
    branch,
    thresholdSources: decisionsCapacityThresholds.thresholdSources,
  };

  const last7 = filterByLastDays(lines, 7);
  const last30 = filterByLastDays(lines, 30);
  const decisionsLast30 = filterByLastDays(decisions, 30);
  const summary = {
    generatedAt: new Date().toISOString(),
    windows: {
      last7Days: "timestamp-based",
      last30Days: "timestamp-based",
    },
    retention: {
      maxEntries,
      keepEntries,
      archiveMaxDays,
      maxBytes,
      minKeepEntries,
    },
    decisionsRetention: {
      maxEntries: decisionMaxEntries,
      keepEntries: decisionKeepEntries,
      archiveMaxDays: decisionArchiveMaxDays,
      maxBytes: decisionMaxBytes,
      minKeepEntries: decisionMinKeepEntries,
    },
    decisionsRetentionUsage: decisionsUsage,
    decisionsRetentionCapacity: decisionsCapacity,
    allTime: calcSummary(lines),
    last7: calcSummary(last7),
    last30: calcSummary(last30),
    packageManagers: {
      allTime: calcPackageManagerSummary(lines),
      last7: calcPackageManagerSummary(last7),
      last30: calcPackageManagerSummary(last30),
    },
    gateModeDecisions: {
      allTime: summarizeDecisions(decisions),
      last30: summarizeDecisions(decisionsLast30),
    },
    latest: entry,
    latestDecision: decision,
  };

  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  console.log("Governance history snapshot saved.");
  console.log(`History: ${historyPath}`);
  console.log(`Summary: ${summaryPath}`);
}

main();
