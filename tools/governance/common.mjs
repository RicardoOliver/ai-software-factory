import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const repoRoot = path.resolve(__dirname, "..", "..");

export function walkFiles(dirPath, matcher) {
  const out = [];

  if (!fs.existsSync(dirPath)) {
    return out;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath, matcher));
      continue;
    }

    if (!matcher || matcher(fullPath)) {
      out.push(fullPath);
    }
  }

  return out;
}

export function toPosixRelative(absPath) {
  return path.relative(repoRoot, absPath).split(path.sep).join("/");
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function hasFrontmatter(content) {
  return /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n/.test(content);
}

export function extractFrontmatter(content) {
  const match = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match ? match[1] : "";
}

export function findMissingKeys(frontmatterText, keys) {
  return keys.filter((key) => {
    const regex = new RegExp(`^${key}\\s*:`, "m");
    return !regex.test(frontmatterText);
  });
}

export function printSummary(title, payload) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
  for (const [key, value] of Object.entries(payload)) {
    console.log(`${key}: ${value}`);
  }
}
