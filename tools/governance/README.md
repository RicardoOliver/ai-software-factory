# Governance Automation

This module enforces repository governance for inventory, metadata, parity, and link integrity.

Usage guide (technical and non-technical): `tools/governance/GUIA-USO-GOVERNANCA.md`

## Checks

- `check-inventory.mjs`: validates the baseline inventory against the repository state.
- `check-frontmatter.mjs`: validates required frontmatter fields in prompt and agent files.
- `check-parity.mjs`: validates parity between `agents/*.md` and `.github/prompts/*.prompt.md` with allowlisted exceptions.
- `check-links.mjs`: validates internal Markdown links across strategic documentation.
- `check-decisions-capacity.mjs`: evaluates decision-log retention capacity and optionally fails on critical usage.
- `run-governance.mjs`: orchestrates all checks.
- `sync-dashboard-governance.mjs`: syncs governance KPIs in `DASHBOARD.md`.
- `build-pr-comment.mjs`: creates an automated PR comment payload with governance status.
- `tests-smoke.mjs`: smoke execution wrapper for governance suite.
- `run-dependency-audit.mjs`: runs npm dependency audit using branch-based severity baseline.
- `snapshot-governance-history.mjs`: appends governance snapshots and computes trend summaries.
- `export-governance-history.mjs`: optionally exports governance history to an external endpoint.
- `scan-audit-domains.mjs`: discovers new lockfile roots and suggests dependency-audit domains.
- `evaluate-threshold-readiness.mjs`: evaluates whether observation window is strong enough to freeze branch thresholds.
- `tests-export-contract.mjs`: validates export contract in dry-run mode.
- `tests-export-http-integration.mjs`: validates retry and ACK behavior with a local HTTP endpoint.
- `tests-gate-policy-resolution.mjs`: validates branch-aware gate policy resolution and environment override precedence.
- `tests-decisions-capacity-policy.mjs`: validates branch-aware decision-capacity fail policy and environment override precedence.
- `tests-decisions-capacity-thresholds.mjs`: validates branch-aware decision-capacity thresholds and environment override precedence.

## Run locally

```bash
node tools/governance/run-governance.mjs
```

Optional local commands:

```bash
node tools/governance/sync-dashboard-governance.mjs
node tools/governance/build-pr-comment.mjs
node tools/governance/run-dependency-audit.mjs
node tools/governance/snapshot-governance-history.mjs
node tools/governance/export-governance-history.mjs
node tools/governance/scan-audit-domains.mjs
node tools/governance/tests-export-contract.mjs
node tools/governance/tests-export-http-integration.mjs
node tools/governance/tests-gate-policy-resolution.mjs
node tools/governance/tests-decisions-capacity-policy.mjs
node tools/governance/tests-decisions-capacity-thresholds.mjs
node tools/governance/check-decisions-capacity.mjs
node tools/governance/evaluate-threshold-readiness.mjs
```

## Baselines and policies

- `config/inventory-baseline.json`: source of truth for expected counts.
- `config/parity-allowlist.json`: approved exceptions for prompt parity.
- `config/dependency-severity-baseline.json`: dependency severity threshold per branch.

Schema highlights:
- `default` and `branches`: global threshold fallback
- `domains`: per-domain path and threshold overrides
- `domains.<name>.optional`: skip audit when lockfile is absent
- `domains.<name>.packageManager`: package manager metadata (`npm`, `pnpm`, `yarn`)
- `domains.fixture-pnpm-audit` and `domains.fixture-yarn-audit`: controlled fixtures for continuous multi-manager audit coverage

## CI integration

Workflow: `.github/workflows/governance-quality.yml`

CI package managers:
- `pnpm@10.10.0` and `yarn@1.22.19` are installed explicitly in workflow to ensure deterministic multi-domain audit execution.

The CI pipeline executes:
1. Governance checks
2. Dependency audit with branch baseline policy
3. Governance history snapshot generation
4. Dashboard KPI sync verification
5. PR comment publication with governance and dependency status

Dependency observability:
- `latest-dependency-report.json` now includes `packageManagers` summary with pass/fail/skip/execution-error counts and vulnerabilities aggregated per manager.
- PR comment and dashboard publish this summary to highlight manager-specific health drift.
- `governance-history-summary.json` now includes package manager reliability trend for all-time, 7d, and 30d windows.
- PR comment now reports 7d vs 30d reliability delta per package manager to surface regressions earlier.

Optional package manager gates:
- `GOVERNANCE_PM_GATE_MODE` (`enforce` or `observe`) controls whether gate failures block the pipeline or are emitted as warnings.
- `GOVERNANCE_PM_PROMOTE_AFTER_RUNS` (example: `5`) controls the minimum consecutive clean observe-mode runs required to recommend promote-to-enforce.
- `GOVERNANCE_PM_MIN_EXECUTED` (example: `npm:1,pnpm:1,yarn:1`) enforces minimum executed domains per manager.
- `GOVERNANCE_PM_MAX_EXEC_ERRORS` (example: `npm:0,pnpm:0,yarn:0`) limits execution errors per manager.
- `GOVERNANCE_PM_MAX_RELIABILITY_DROP_PP` (example: `npm:2,pnpm:1,yarn:1`) limits tolerated reliability drop between 30d and 7d windows.
- `GOVERNANCE_PM_MIN_TREND_RUNS` (example: `npm:3,pnpm:3,yarn:3`) defines the minimum runs required before trend gates are enforced.

Branch-aware gate policy:
- `config/package-manager-gates.json` defines default and per-branch gate values.
- Resolution order: `policy.default` -> `policy.branches.<branch>` -> environment variables.
- `gateMode` in branch policy controls rollout strategy (`main=enforce`, non-production branches can remain `observe`).
- `promoteAfterConsecutivePasses` defines how many consecutive clean observe runs are needed before recommendation to enforce.
- This allows stricter production gates with softer non-production rollout.

PR risk signaling:
- `latest-pr-comment.md` includes a `Risk summary` section and reports trend-gate failures as active risk signals.
- When observe-mode streak reaches promotion threshold, PR comment emits a `Promotion ready alert` with direct action to flip branch gate mode to `enforce`.
- Promotion-ready comments also include an approval checklist and explicit rollback conditions to support controlled rollout decisions.

Rollout decision records:
- `history/gate-promotion-decisions.jsonl` stores auto-detected branch gate-mode transitions (`observe->enforce` and `enforce->observe`).
- Each decision record includes timestamp, branch, transition, approver (`GOVERNANCE_PM_PROMOTION_APPROVER` or `GITHUB_ACTOR`), and commit SHA when available.
- `governance-history-summary.json` exposes aggregated decision metrics and latest decision snapshot.
- `governance-history-summary.json` also exposes `decisionsRetentionUsage` (file count, archive count, and bytes) for storage observability.
- `governance-history-summary.json` also exposes `decisionsRetentionCapacity` with usage percent and severity (`ok`, `warn`, `high`, `critical`).
- `config/decisions-capacity-policy.json` defines branch-aware `failOnCritical` behavior for capacity enforcement.
- Resolution order for `failOnCritical`: `policy.default` -> `policy.branches.<branch>` -> `GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL`.
- `config/decisions-capacity-policy.json` also defines branch-aware `capacityThresholds` (`warn`, `high`, `critical`) for decisions log capacity severity.
- Resolution order for capacity thresholds: `policy.default.capacityThresholds` -> `policy.branches.<branch>.capacityThresholds` -> `GOVERNANCE_DECISIONS_CAPACITY_*_PERCENT` environment overrides.
- Decision log retention controls:
	- `GOVERNANCE_DECISIONS_MAX_ENTRIES` (default 2000)
	- `GOVERNANCE_DECISIONS_KEEP_ENTRIES` (default 1500)
	- `GOVERNANCE_DECISIONS_ARCHIVE_MAX_DAYS` (default 90)
	- `GOVERNANCE_DECISIONS_MAX_BYTES` (default 5242880)
	- `GOVERNANCE_DECISIONS_MIN_KEEP_ENTRIES` (default 500)
	- `GOVERNANCE_DECISIONS_CAPACITY_WARN_PERCENT` (default 70)
	- `GOVERNANCE_DECISIONS_CAPACITY_HIGH_PERCENT` (default 85)
	- `GOVERNANCE_DECISIONS_CAPACITY_CRITICAL_PERCENT` (default 95)
	- `GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL` (default false) enables pipeline failure when level is critical.

Trend data:
- 7-day pass rate (real time window)
- 30-day pass rate (real time window)

Threshold freeze readiness:
- `latest-threshold-readiness.json` summarizes if thresholds are ready to freeze.
- Criteria env vars:
	- `GOVERNANCE_READINESS_MIN_RUNS` (default 5)
	- `GOVERNANCE_READINESS_MIN_PASS_RATE` (default 95)
	- `GOVERNANCE_READINESS_MAX_MANAGER_DELTA_PP` (default 2)

History retention:
- `GOVERNANCE_HISTORY_MAX_ENTRIES` (default 5000)
- `GOVERNANCE_HISTORY_KEEP_ENTRIES` (default 4000)
- `GOVERNANCE_HISTORY_ARCHIVE_MAX_DAYS` (default 30)
- `GOVERNANCE_HISTORY_MAX_BYTES` (default 20971520)
- `GOVERNANCE_HISTORY_MIN_KEEP_ENTRIES` (default 1000)
- Rotated archives are compressed as `.bak.gz`

Optional external persistence:
- Configure `GOVERNANCE_HISTORY_ENDPOINT`
- Optionally configure `GOVERNANCE_HISTORY_API_KEY`
- Optionally configure `GOVERNANCE_EXPORT_TIMEOUT_MS` (default 8000)
- Optionally configure `GOVERNANCE_EXPORT_RETRIES` (default 2)
- Optionally configure `GOVERNANCE_EXPORT_BACKOFF_BASE_MS` (default 1000)
- Optionally configure `GOVERNANCE_EXPORT_BACKOFF_MAX_MS` (default 8000)
- Optionally configure `GOVERNANCE_HISTORY_SIGNING_SECRET` for HMAC signature header
- Optionally configure `GOVERNANCE_EXPORT_EXPECT_ACK=true` to enforce response contract (`accepted`, `requestId`)

Contract dry-run:
- `GOVERNANCE_EXPORT_DRY_RUN=true` validates idempotency header and HMAC signature generation locally.

Export integration test:
- `node tools/governance/tests-export-http-integration.mjs` validates retry on transient server failure and ACK contract enforcement on response payload.
- The suite also validates timeout-triggered retry recovery with bounded backoff.
