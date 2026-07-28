<!-- governance-quality-report -->
## Governance Quality Report

Overall: ✅ PASSED
Generated at: 2026-07-28T01:09:21.519Z

| Check | Status |
|------|--------|
| check-inventory.mjs | ✅ PASS |
| check-frontmatter.mjs | ✅ PASS |
| check-parity.mjs | ✅ PASS |
| check-links.mjs | ✅ PASS |

Parity details: ok=51, exempt=2, missing=0

Risk summary:
- no active risk signal

Dependency audit:
- default-threshold=critical, policy=PASS, total=0, high=0, critical=0
- Domains:
  - backend-api: threshold=critical, policy=PASS, total=0
  - workspace-root: threshold=high, policy=PASS, total=0
  - fixture-pnpm-audit: threshold=critical, policy=PASS, total=0
  - fixture-yarn-audit: threshold=critical, policy=PASS, total=0
- Package managers:
  - npm: score=100%, domains=2, passed=1, failed=0, skipped=1, execErrors=0, total=0
  - pnpm: score=100%, domains=1, passed=1, failed=0, skipped=0, execErrors=0, total=0
  - yarn: score=100%, domains=1, passed=1, failed=0, skipped=0, execErrors=0, total=0
- Package manager gates:
- gate-status=PASS, mode=enforce, source-branch=main, configured-min-executed=3, configured-max-exec-errors=3
  - none
- Package manager trend gates:
- trend-gate-status=PASS, mode=enforce, source-policy=tools/governance/config/package-manager-gates.json, configured-max-drop=3, configured-min-runs=3
  - none
- Gate rollout:
- recommendation=not-applicable, branch=main, mode=enforce, streak=0/1

Trend:
- 7d pass-rate=97.92% (47/48), 30d pass-rate=97.92% (47/48)
- Manager reliability delta (7d vs 30d):
  - npm: 7d=100%, 30d=100%, delta=0pp (stable), gate=PASS
  - pnpm: 7d=100%, 30d=100%, delta=0pp (stable), gate=PASS
  - yarn: 7d=100%, 30d=100%, delta=0pp (stable), gate=PASS

Domain onboarding:
- new domain candidates=0

Rollout decision record:
- latest decision=rollback, branch=develop, transition=enforce->observe, approvedBy=unknown, at=2026-07-28T01:08:58.860Z
- decision-log-capacity: level=ok, usage=0.01%, branch=main, thresholds=70/85/95%, threshold-source=branch-policy/branch-policy/branch-policy
- decision-log-storage: files=1, archives=0, totalBytes=506, activeBytes=506, archivesBytes=0
- threshold-readiness: recommendation=ready-to-freeze-thresholds, ready=true, runs7d=48, passRate7d=97.92%, capacity=ok




If this report fails, run `node tools/governance/run-governance.mjs` locally.
