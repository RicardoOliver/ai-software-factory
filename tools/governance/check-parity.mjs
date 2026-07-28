import fs from "node:fs";
import path from "node:path";
import { repoRoot, readJson, walkFiles, toPosixRelative } from "./common.mjs";

function toName(filePath, suffix) {
  return path.basename(filePath).replace(suffix, "");
}

function main() {
  const agentsDir = path.join(repoRoot, "agents");
  const promptsDir = path.join(repoRoot, ".github", "prompts");
  const allowlistPath = path.join(repoRoot, "tools", "governance", "config", "parity-allowlist.json");

  const allowlist = readJson(allowlistPath);
  const exemptSet = new Set((allowlist.exemptAgents || []).map((item) => item.name));

  const agentFiles = walkFiles(agentsDir, (file) => file.endsWith(".md"));
  const promptFiles = walkFiles(promptsDir, (file) => file.endsWith(".prompt.md"));

  const agentNames = new Set(agentFiles.map((file) => toName(file, ".md")));
  const promptNames = new Set(promptFiles.map((file) => toName(file, ".prompt.md")));

  const missingPrompts = [];
  for (const agent of agentNames) {
    if (!promptNames.has(agent) && !exemptSet.has(agent)) {
      missingPrompts.push(agent);
    }
  }

  const orphanPrompts = [];
  for (const prompt of promptNames) {
    if (!agentNames.has(prompt)) {
      orphanPrompts.push(prompt);
    }
  }

  console.log("Parity summary");
  console.log("--------------");
  console.log(`Agents: ${agentNames.size}`);
  console.log(`Prompts: ${promptNames.size}`);
  console.log(`Exempt agents: ${exemptSet.size}`);

  if (missingPrompts.length > 0 || orphanPrompts.length > 0) {
    if (missingPrompts.length > 0) {
      console.error("\nAgents without prompt and not exempt:");
      for (const name of missingPrompts) {
        console.error(`- ${name}`);
      }
    }

    if (orphanPrompts.length > 0) {
      console.error("\nPrompts without matching agent:");
      for (const name of orphanPrompts) {
        console.error(`- ${name}`);
      }
    }

    process.exit(1);
  }

  const matrixPath = path.join(repoRoot, "tools", "governance", "parity-matrix.md");
  const lines = [
    "# Parity Matrix",
    "",
    `Generated on: ${new Date().toISOString()}`,
    "",
    "| Agent | Prompt | Status |",
    "|-------|--------|--------|",
  ];

  const sortedAgents = [...agentNames].sort();
  for (const agent of sortedAgents) {
    const hasPrompt = promptNames.has(agent);
    const isExempt = exemptSet.has(agent);
    const prompt = hasPrompt ? `${agent}.prompt.md` : "-";
    const status = hasPrompt ? "OK" : isExempt ? "EXEMPT" : "MISSING";
    lines.push(`| ${agent}.md | ${prompt} | ${status} |`);
  }

  fs.writeFileSync(matrixPath, `${lines.join("\n")}\n`, "utf8");
  console.log("\nParity check passed.");
  console.log(`Matrix: ${toPosixRelative(matrixPath)}`);
}

main();
