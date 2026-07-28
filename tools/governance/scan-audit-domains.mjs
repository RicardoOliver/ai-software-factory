import fs from "node:fs";
import path from "node:path";
import { repoRoot, readJson, walkFiles } from "./common.mjs";

const EXCLUDE = ["node_modules", ".git", "dist", "coverage", ".next", "build"];
const LOCKFILES = [
  { file: "package-lock.json", manager: "npm" },
  { file: "pnpm-lock.yaml", manager: "pnpm" },
  { file: "yarn.lock", manager: "yarn" },
];

function isExcluded(filePath) {
  const normalized = filePath.split(path.sep);
  return EXCLUDE.some((segment) => normalized.includes(segment));
}

function discoverLockfileDirs() {
  const discovered = new Map();

  for (const lockfile of LOCKFILES) {
    const matches = walkFiles(repoRoot, (file) => file.endsWith(lockfile.file));
    for (const file of matches) {
      if (isExcluded(file)) {
        continue;
      }

      const relDir = path.relative(repoRoot, path.dirname(file)).split(path.sep).join("/");
      if (!discovered.has(relDir)) {
        discovered.set(relDir, {
          path: relDir,
          lockfiles: [],
          packageManagers: [],
        });
      }

      const item = discovered.get(relDir);
      if (!item.lockfiles.includes(lockfile.file)) {
        item.lockfiles.push(lockfile.file);
      }
      if (!item.packageManagers.includes(lockfile.manager)) {
        item.packageManagers.push(lockfile.manager);
      }
    }
  }

  return [...discovered.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function main() {
  const cfgPath = path.join(repoRoot, "tools", "governance", "config", "dependency-severity-baseline.json");
  const cfg = readJson(cfgPath);
  const knownPaths = new Set(
    Object.values(cfg.domains || {}).map((item) => (item.path || "").replace(/\\/g, "/")),
  );

  const discovered = discoverLockfileDirs();
  const candidates = discovered.filter((item) => !knownPaths.has(item.path));

  const report = {
    generatedAt: new Date().toISOString(),
    discovered,
    knownDomainPaths: [...knownPaths],
    candidates,
    suggestedDomains: candidates.map((item) => ({
      name: item.path.replace(/\//g, "-") || "workspace-root",
      path: item.path,
      packageManager: item.packageManagers[0] || "npm",
      lockfiles: item.lockfiles,
      optional: true,
      default: "high",
    })),
  };

  const outPath = path.join(repoRoot, "tools", "governance", "domain-discovery-report.json");
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Dependency audit domain discovery summary");
  console.log("---------------------------------------");
  console.log(`Discovered lockfile roots: ${report.discovered.length}`);
  console.log(`Known domain paths: ${report.knownDomainPaths.length}`);
  console.log(`New candidates: ${report.candidates.length}`);
  console.log(`Report: ${outPath}`);
}

main();
