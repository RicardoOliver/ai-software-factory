import fs from "node:fs";
import path from "node:path";
import { repoRoot, walkFiles } from "./common.mjs";

function countInventory() {
  const agents = walkFiles(path.join(repoRoot, "agents"), (file) => file.endsWith(".md")).length;
  const prompts = walkFiles(
    path.join(repoRoot, ".github", "prompts"),
    (file) => file.endsWith(".prompt.md"),
  ).length;
  const checklistsMarkdown = walkFiles(
    path.join(repoRoot, "checklists"),
    (file) => file.endsWith(".md") && !file.endsWith("README.md"),
  ).length;
  const checklistsYaml = walkFiles(
    path.join(repoRoot, "checklists"),
    (file) => file.endsWith(".yaml"),
  ).length;

  return { agents, prompts, checklistsMarkdown, checklistsYaml };
}

function computeParityCoverage() {
  const agents = new Set(
    walkFiles(path.join(repoRoot, "agents"), (file) => file.endsWith(".md")).map((file) =>
      path.basename(file).replace(/\.md$/, ""),
    ),
  );

  const prompts = new Set(
    walkFiles(path.join(repoRoot, ".github", "prompts"), (file) => file.endsWith(".prompt.md")).map(
      (file) => path.basename(file).replace(/\.prompt\.md$/, ""),
    ),
  );

  const allowlistPath = path.join(repoRoot, "tools", "governance", "config", "parity-allowlist.json");
  const allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));
  const exempt = new Set((allowlist.exemptAgents || []).map((item) => item.name));

  let covered = 0;
  for (const agent of agents) {
    if (prompts.has(agent) || exempt.has(agent)) {
      covered += 1;
    }
  }

  const pct = agents.size === 0 ? 100 : Math.round((covered / agents.size) * 10000) / 100;
  return { covered, total: agents.size, percent: pct };
}

function buildBlock() {
  const inv = countInventory();
  const parity = computeParityCoverage();
  const dependencyPath = path.join(repoRoot, "tools", "governance", "latest-dependency-report.json");
  const historySummaryPath = path.join(
    repoRoot,
    "tools",
    "governance",
    "history",
    "governance-history-summary.json",
  );

  let dependencyLine = "not available";
  let packageManagerLine = "not available";
  if (fs.existsSync(dependencyPath)) {
    const dep = JSON.parse(fs.readFileSync(dependencyPath, "utf8"));
    const threshold = dep.defaultThreshold || dep.threshold || "not-set";
    const domainCount = Array.isArray(dep.domains) ? dep.domains.length : 0;
    dependencyLine = `threshold=${threshold}, policy=${dep.failedByPolicy ? "FAIL" : "PASS"}, high=${dep.vulnerabilities?.high ?? 0}, critical=${dep.vulnerabilities?.critical ?? 0}, domains=${domainCount}`;

    if (Array.isArray(dep.packageManagers) && dep.packageManagers.length > 0) {
      packageManagerLine = dep.packageManagers
        .map(
          (item) =>
            `${item.packageManager}:pass=${item.passed},fail=${item.failed},skip=${item.skipped},execErr=${item.executionErrors}`,
        )
        .join(" | ");
    }
  }

  let passRate7d = "not available";
  let managerTrend7dLine = "not available";
  if (fs.existsSync(historySummaryPath)) {
    const hist = JSON.parse(fs.readFileSync(historySummaryPath, "utf8"));
    passRate7d = `${hist.last7?.passRate ?? 0}% (${hist.last7?.passed ?? 0}/${hist.last7?.total ?? 0})`;

    if (Array.isArray(hist.packageManagers?.last7) && hist.packageManagers.last7.length > 0) {
      managerTrend7dLine = hist.packageManagers.last7
        .map((item) => `${item.packageManager}:${item.reliabilityScore}%`)
        .join(" | ");
    }
  }

  const lines = [
    "<!-- governance-metrics:start -->",
    "## Governance KPIs (Auto)",
    "",
    `Updated at: ${new Date().toISOString()}`,
    "",
    "| KPI | Value |",
    "|-----|-------|",
    `| Agents inventory | ${inv.agents} |`,
    `| Prompt inventory | ${inv.prompts} |`,
    `| Checklists (md/yaml) | ${inv.checklistsMarkdown}/${inv.checklistsYaml} |`,
    `| Parity coverage | ${parity.covered}/${parity.total} (${parity.percent}%) |`,
    `| Dependency policy | ${dependencyLine} |`,
    `| Dependency managers | ${packageManagerLine} |`,
    `| Last 7 snapshots pass rate | ${passRate7d} |`,
    `| Manager reliability (7d) | ${managerTrend7dLine} |`,
    "",
    "<!-- governance-metrics:end -->",
  ];

  return lines.join("\n");
}

function main() {
  const dashboardPath = path.join(repoRoot, "DASHBOARD.md");
  const original = fs.readFileSync(dashboardPath, "utf8");
  const block = buildBlock();

  const hasMarkers =
    original.includes("<!-- governance-metrics:start -->") &&
    original.includes("<!-- governance-metrics:end -->");

  let next;

  if (hasMarkers) {
    next = original.replace(
      /<!-- governance-metrics:start -->[\s\S]*?<!-- governance-metrics:end -->/,
      block,
    );
  } else {
    const anchorRegex = /\n##\s+🤖\s+Catálogo de Agents por Domínio/;
    if (anchorRegex.test(original)) {
      next = original.replace(anchorRegex, `\n\n${block}\n\n## 🤖 Catálogo de Agents por Domínio`);
    } else {
      next = `${original.trimEnd()}\n\n---\n\n${block}\n`;
    }
  }

  if (next !== original) {
    fs.writeFileSync(dashboardPath, next, "utf8");
    console.log("DASHBOARD.md synced with governance metrics.");
    return;
  }

  console.log("DASHBOARD.md already synced.");
}

main();
