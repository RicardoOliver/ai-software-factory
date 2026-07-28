import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["tools/governance/run-governance.mjs"], {
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(1);
}

console.log("Governance smoke test passed.");
