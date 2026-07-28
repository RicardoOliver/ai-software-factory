import fs from "node:fs";
import path from "node:path";
import {
  repoRoot,
  walkFiles,
  hasFrontmatter,
  extractFrontmatter,
  findMissingKeys,
  toPosixRelative,
} from "./common.mjs";

function validateFile(filePath, requiredKeys) {
  const content = fs.readFileSync(filePath, "utf8");

  if (!hasFrontmatter(content)) {
    return [`${toPosixRelative(filePath)} is missing frontmatter block.`];
  }

  const frontmatter = extractFrontmatter(content);
  const missing = findMissingKeys(frontmatter, requiredKeys);

  return missing.map((key) => `${toPosixRelative(filePath)} is missing key: ${key}`);
}

function main() {
  const promptFiles = walkFiles(
    path.join(repoRoot, ".github", "prompts"),
    (file) => file.endsWith(".prompt.md"),
  );
  const agentFiles = walkFiles(
    path.join(repoRoot, ".github", "agents"),
    (file) => file.endsWith(".agent.md"),
  );

  const errors = [];

  for (const filePath of promptFiles) {
    errors.push(...validateFile(filePath, ["mode", "description"]));
  }

  for (const filePath of agentFiles) {
    errors.push(...validateFile(filePath, ["name", "description"]));
  }

  console.log("Frontmatter validation summary");
  console.log("-----------------------------");
  console.log(`Prompt files: ${promptFiles.length}`);
  console.log(`Agent files: ${agentFiles.length}`);

  if (errors.length > 0) {
    console.error("\nFrontmatter issues detected:");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log("\nFrontmatter check passed.");
}

main();
