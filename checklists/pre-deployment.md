# Pre-Deployment Checklist

**Duration:** 30-45 minutes  
**Owners:** DevOps Engineer, Release Manager  
**Reference Agents:** `/devops`, `/release`, `/backend`

---

## Phase 1: Code Quality Gates (10 min)

- [ ] **Linting:** All files pass ESLint/Pylint with zero errors
  - Command: `npm run lint` or `pylint src/`
  - Expected: 0 errors, warnings reviewed & documented

- [ ] **Code Formatting:** Automated formatting applied (Prettier/Black)
  - Command: `npm run format` or `black src/`
  - Expected: No diffs after running formatter

- [ ] **Type Checking:** TypeScript/Python type checks pass
  - Command: `tsc --noEmit` or `mypy src/`
  - Expected: 0 type errors

- [ ] **Complexity Metrics:** Cyclomatic complexity < 10 (average)
  - Tool: SonarQube, ESLint complexity plugin
  - Expected: No functions > 15 complexity

- [ ] **Dependency Audit:** No high-risk dependency vulnerabilities
  - Command: `npm audit` or `pip audit`
  - Expected: 0 critical/high vulns (medium/low reviewed)

---

## Phase 2: Security Scanning (10 min)

- [ ] **SAST (Static Application Security Testing)**
  - Tool: Semgrep, SonarQube, Snyk
  - Expected: 0 critical/high findings (medium/low triaged)
  - False positives documented in `.semgrep-ignore`

- [ ] **Secrets Detection**
  - Tool: git-secrets, Trivy, detect-secrets
  - Command: `trivy fs . --scanners secret`
  - Expected: 0 secrets found

- [ ] **Dependency Scanning (SCA)**
  - Tool: Snyk, OWASP Dependency-Check
  - Expected: All transitive dependencies known & approved

- [ ] **Container Image Scan (if containerized)**
  - Tool: Trivy, Grype
  - Command: `trivy image myapp:latest`
  - Expected: 0 critical/high vulns

---

## Phase 3: Performance Baselines (10 min)

- [ ] **API Response Time**
  - Baseline: p95 latency < [SLO value] ms
  - Tool: Postman, Insomnia, k6
  - Check: No regression from main branch

- [ ] **Database Query Performance**
  - Command: `EXPLAIN ANALYZE` on critical queries
  - Expected: Index usage confirmed, no full table scans

- [ ] **Memory Leaks Check**
  - Tool: Heap snapshots (Node), memory profiler (Python)
  - Expected: Stable memory usage over 5-minute load test

- [ ] **Load Test Results**
  - Conditions: 100 concurrent users × 5 minutes
  - Expected: p99 latency < [SLO], error rate < 0.1%
  - Tool: k6, JMeter, Locust

---

## Phase 4: Database Migrations (10 min)

- [ ] **Migration Scripts Exist**
  - Location: `migrations/` or `db/` directory
  - Format: Numbered (001_, 002_, etc.) with timestamps

- [ ] **Rollback Plan Documented**
  - File: `ROLLBACK.md` in same directory
  - Content: Step-by-step rollback procedure with SQL

- [ ] **Data Validation Script Created**
  - Command: `npm run validate-migration` or `python validate_migration.py`
  - Expected: Confirms data integrity post-migration

- [ ] **Dry-Run Successful**
  - Environment: Staging (mirror of prod)
  - Expected: Migration completes, data valid, app starts

- [ ] **Backwards Compatibility Confirmed**
  - Check: Old app version can read new schema (if needed)
  - Or: Blue-green deployment plan documented

---

## Phase 5: Environment Configuration (5 min)

- [ ] **Environment Variables Set**
  - Location: `.env` files or secrets manager
  - Check: All required vars present (see `env.example`)
  - Missing vars result in startup error (fail-fast)

- [ ] **Secrets in Secrets Manager**
  - Tool: AWS Secrets Manager, Azure Key Vault, Vault
  - Expected: Zero secrets in `.env` or code
  - Audit: Verify access controls & rotation policies

- [ ] **Scaling Configuration Updated**
  - If K8s: HPA min/max replicas, request/limit resources
  - If Serverless: Memory, timeout, concurrency limits
  - If VMs: Load balancer config, health checks

- [ ] **Feature Flags Configured**
  - Tool: LaunchDarkly, Unleash, or custom
  - Check: New feature disabled by default
  - Rollout plan: % targets, user segments

---

## Phase 6: Documentation & Runbooks (5 min)

- [ ] **Deployment Runbook Updated**
  - File: `docs/deployment.md` or wiki
  - Content: Step-by-step deployment procedure
  - Includes: Pre-checks, deploy steps, post-checks, rollback

- [ ] **Monitoring & Alerting Enabled**
  - Alerts: Critical error rate, p99 latency, CPU/memory
  - Dashboards: Created/updated for key metrics
  - Expected: Alerts reach on-call engineer in < 1 minute

- [ ] **Rollback Procedure Tested**
  - Environment: Staging
  - Steps: Rollback to previous version, verify data
  - Expected: Rollback completes in < 5 minutes

- [ ] **Change Log Updated**
  - Format: Semantic versioning headers (Added, Fixed, Security)
  - Include: Issue references, breaking changes (if any)

- [ ] **Release Notes Written**
  - Audience: Customers, support team, internal stakeholders
  - Content: Feature summaries, migration guides (if needed)

---

## Phase 7: Approvals & Sign-Off (Optional, 5 min)

- [ ] **Tech Lead Approval**
  - Sign: Architecture, security, scalability
  - Sign-off in: JIRA ticket, PR, or spreadsheet

- [ ] **DevOps Lead Approval**
  - Sign: Infrastructure readiness, deployment plan
  - Sign-off in: JIRA ticket, deployment checklist

- [ ] **Security Review Approved**
  - Sign: Zero critical/high security findings
  - Sign-off in: Security ticket, JIRA epic

- [ ] **Product Owner Sign-Off**
  - Sign: Feature readiness, acceptance criteria met
  - Sign-off in: JIRA acceptance tab

---

## ðŸš€ Go/No-Go Decision

### ✅ PROCEED TO DEPLOYMENT IF:
- [x] All code quality gates passed
- [x] All security scans passed
- [x] Performance baselines met
- [x] Database migrations validated
- [x] Environment config verified
- [x] Runbooks & documentation complete
- [x] All approvals obtained (if required)

### ðŸ›‘ DO NOT DEPLOY IF:
- ❌ Any critical/high security findings open
- ❌ Performance baseline regression > 20%
- ❌ Test coverage < 70% (if threshold set)
- ❌ Database migration rollback not tested
- ❌ Secrets found in code/artifacts
- ❌ Monitoring/alerting not enabled

---

## ðŸ“‹ Deployment Execution

Once approved:

1. **Create Release Branch**
   ```bash
   git checkout -b release/v${VERSION}
   git tag -a v${VERSION} -m "Release version ${VERSION}"
   git push origin release/v${VERSION} --tags
   ```

2. **Build Artifact**
   ```bash
   docker build -t myapp:${VERSION} .
   docker push myapp:${VERSION}
   ```

3. **Deploy to Staging (Optional)**
   ```bash
   kubectl set image deployment/myapp myapp=myapp:${VERSION} -n staging
   kubectl rollout status deployment/myapp -n staging
   ```

4. **Smoke Tests**
   - Health check: GET /health returns 200 OK
   - API endpoints: Random sample endpoints return expected responses
   - Critical workflows: User signup, payment, order processing

5. **Deploy to Production**
   ```bash
   # Blue-green: Create new deployment
   kubectl apply -f deployment-v${VERSION}.yaml -n production
   kubectl rollout status deployment/myapp-v${VERSION}
   
   # Switch traffic
   kubectl patch service myapp -p '{"spec":{"selector":{"version":"v'${VERSION}'"}}}'
   ```

6. **Monitor for 30 Minutes**
   - Error rate: Should be < 0.1%
   - Latency: p99 should be < SLO
   - Resource usage: CPU/memory steady
   - No alerts triggered

7. **Declare Success**
   - Post message: Slack/Teams channel
   - Update status: JIRA ticket marked done
   - Archive metrics: Screenshot dashboard for post-mortem

---

## ðŸ”„ If Issues Found

### Minor Issue (< 1% error rate)
1. Enable detailed logging
2. Monitor for 10 more minutes
3. If persists, proceed to rollback

### Major Issue (> 1% error rate or complete outage)
1. **Initiate Rollback** (usually < 5 min)
   ```bash
   kubectl rollout undo deployment/myapp -n production
   kubectl rollout status deployment/myapp
   ```
2. **Notify Stakeholders** (immediately)
3. **Create Incident Ticket** (reference Incident Response Playbook)
4. **Post-Mortem** (within 24 hours)

---

**Deployment Owner:** [Name]  
**Date:** [YYYY-MM-DD]  
**Version:** [Version number]  
**Sign-off:** [Approver signature]
