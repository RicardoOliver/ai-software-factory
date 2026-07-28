import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { __dirname } from "./common.mjs";

const checks = [
  "check-inventory.mjs",
  "check-frontmatter.mjs",
  "check-parity.mjs",
  "check-links.mjs",
];

const results = [];
let failed = false;

for (const check of checks) {
  const checkPath = path.join(__dirname, check);
  console.log(`\nRunning ${check}`);
  console.log("=".repeat(`Running ${check}`.length));

  const result = spawnSync(process.execPath, [checkPath], {
    encoding: "utf8",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  results.push({
    name: check,
    status: result.status === 0 ? "PASS" : "FAIL",
    exitCode: result.status ?? 1,
  });

  if (result.status !== 0) {
    failed = true;
  }
}

const reportJsonPath = path.join(__dirname, "latest-report.json");
const reportMdPath = path.join(__dirname, "latest-report.md");
const report = {
  generatedAt: new Date().toISOString(),
  failed,
  checks: results,
};

fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const tableRows = results.map((item) => {
  const icon = item.status === "PASS" ? "✅" : "❌";
  return `| ${item.name} | ${icon} ${item.status} | ${item.exitCode} |`;
});

const markdown = [
  "# Governance Report",
  "",
  `Generated at: ${report.generatedAt}`,
  `Overall: ${failed ? "FAILED" : "PASSED"}`,
  "",
  "| Check | Status | Exit Code |",
  "|------|--------|-----------|",
  ...tableRows,
  "",
].join("\n");

fs.writeFileSync(reportMdPath, `${markdown}\n`, "utf8");

console.log(`\nReport JSON: ${reportJsonPath}`);
console.log(`Report Markdown: ${reportMdPath}`);

if (failed) {
  process.exit(1);
}

console.log("\nAll governance checks passed.");
