import fs from "node:fs";
import path from "node:path";
import { repoRoot, walkFiles, toPosixRelative } from "./common.mjs";

const DOC_SCOPES = [
  path.join(repoRoot, "README.md"),
  path.join(repoRoot, "USAGE.md"),
  path.join(repoRoot, "DASHBOARD.md"),
  path.join(repoRoot, "CONTRIBUTING.md"),
  path.join(repoRoot, "knowledge"),
  path.join(repoRoot, "workflows"),
  path.join(repoRoot, "prompts"),
  path.join(repoRoot, "rules"),
  path.join(repoRoot, "checklists", "README.md"),
];

function getMarkdownFiles() {
  const files = [];

  for (const scope of DOC_SCOPES) {
    if (!fs.existsSync(scope)) {
      continue;
    }

    const stats = fs.statSync(scope);
    if (stats.isFile()) {
      files.push(scope);
      continue;
    }

    files.push(...walkFiles(scope, (file) => file.endsWith(".md")));
  }

  return files;
}

function extractLinks(content) {
  const links = [];
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  let match = regex.exec(content);

  while (match) {
    links.push(match[1].trim());
    match = regex.exec(content);
  }

  return links;
}

function shouldSkipLink(link) {
  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("mailto:") ||
    link.startsWith("#")
  );
}

function resolveLink(baseFile, link) {
  const noAnchor = link.split("#")[0];
  const decoded = decodeURIComponent(noAnchor);
  return path.resolve(path.dirname(baseFile), decoded);
}

function main() {
  const files = getMarkdownFiles();
  const errors = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const links = extractLinks(content);

    for (const link of links) {
      if (shouldSkipLink(link)) {
        continue;
      }

      const resolved = resolveLink(filePath, link);
      if (!fs.existsSync(resolved)) {
        errors.push(`${toPosixRelative(filePath)} -> ${link}`);
      }
    }
  }

  console.log("Link validation summary");
  console.log("-----------------------");
  console.log(`Files scanned: ${files.length}`);

  if (errors.length > 0) {
    console.error("\nBroken links detected:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("\nLink check passed.");
}

main();
