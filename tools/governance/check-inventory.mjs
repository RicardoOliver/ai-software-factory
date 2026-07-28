import path from "node:path";
import {
  repoRoot,
  readJson,
  walkFiles,
  printSummary,
  toPosixRelative,
} from "./common.mjs";

function countInventory() {
  const agents = walkFiles(path.join(repoRoot, "agents"), (file) => file.endsWith(".md")).length;
  const prompts = walkFiles(
    path.join(repoRoot, ".github", "prompts"),
    (file) => file.endsWith(".prompt.md"),
  ).length;
  const githubAgents = walkFiles(
    path.join(repoRoot, ".github", "agents"),
    (file) => file.endsWith(".agent.md"),
  ).length;
  const checklistsMarkdown = walkFiles(
    path.join(repoRoot, "checklists"),
    (file) => file.endsWith(".md") && !file.endsWith("README.md"),
  ).length;
  const checklistsYaml = walkFiles(
    path.join(repoRoot, "checklists"),
    (file) => file.endsWith(".yaml"),
  ).length;
  const skills = walkFiles(path.join(repoRoot, "skills"), (file) => file.endsWith(".md")).length;
  const workflows = walkFiles(path.join(repoRoot, "workflows"), (file) => file.endsWith(".md")).length;

  return {
    agents,
    prompts,
    githubAgents,
    checklistsMarkdown,
    checklistsYaml,
    skills,
    workflows,
  };
}

function main() {
  const baselinePath = path.join(repoRoot, "tools", "governance", "config", "inventory-baseline.json");
  const baseline = readJson(baselinePath);
  const actual = countInventory();

  printSummary("Inventory baseline", baseline);
  printSummary("Inventory actual", actual);

  const mismatches = Object.keys(baseline)
    .filter((key) => baseline[key] !== actual[key])
    .map((key) => ({ key, expected: baseline[key], actual: actual[key] }));

  if (mismatches.length > 0) {
    console.error("\nInventory mismatches detected:");
    for (const item of mismatches) {
      console.error(`- ${item.key}: expected=${item.expected} actual=${item.actual}`);
    }
    process.exit(1);
  }

  console.log("\nInventory check passed.");
  console.log(`Baseline file: ${toPosixRelative(baselinePath)}`);
}

main();
