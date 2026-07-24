# Release Checklist — SemVer & Deployment

**Duration:** 1-2 hours per release  
**Owners:** Release Manager, DevOps, Product Owner  
**Reference Agents:** `/release`, `/devops`, `/backend`

---

## Pre-Release Planning (1-2 hours before release)

### Version Number Determination

**Semantic Versioning (SemVer): MAJOR.MINOR.PATCH**

- [ ] **Determine Version Type**
  
  ```
  PATCH (1.2.3 → 1.2.4)
    ├─ Backward compatible bug fixes
    ├─ Security patches
    ├─ Performance optimizations
    └─ Internal refactors (no API changes)
  
  MINOR (1.2.0 → 1.3.0)
    ├─ Backward compatible new features
    ├─ Deprecations (old API still works but warned)
    └─ Internal improvements
  
  MAJOR (1.0.0 → 2.0.0)
    ├─ Breaking API changes
    ├─ Removed deprecated features
    └─ Database schema breaking changes
  ```

- [ ] **Examples**
  - Added new POST endpoint → MINOR
  - Fixed bug in existing endpoint → PATCH
  - Changed response format of endpoint → MAJOR
  - Added optional field to response → MINOR (backward compatible)
  - Removed required field from response → MAJOR (breaking)

### Change Log Generation

- [ ] **Changelog File Updated** (`CHANGELOG.md`)
  
  Format:
  ```markdown
  # Changelog
  All notable changes to this project documented here.
  
  ## [1.5.0] - 2026-07-23
  ### Added
  - New payment webhook endpoint POST /webhooks/payment
  - Feature flag for dark mode UI (disabled by default)
  - Database migration to add user_preferences table
  
  ### Fixed
  - Bug: User logout didn't clear session cookies (#4521)
  - Bug: Search API returned 500 for non-ASCII characters (#4530)
  - Security: API key not rotated on password change
  
  ### Changed
  - Deprecated GET /user/profile (use GET /users/:id instead)
  - Database query optimization reduced API latency by 15%
  
  ### Security
  - Updated lodash from 4.17.15 to 4.17.21 (security fix)
  - Enabled HSTS header for enhanced security
  
  ## [1.4.2] - 2026-07-15
  ...
  ```

- [ ] **Commit Categorization**
  - Scan git log: `git log v1.4.2..HEAD`
  - Categorize each commit:
    - `feat:` → Added section
    - `fix:` → Fixed section
    - `security:` → Security section
    - `docs:` → Skip (usually)
    - `chore:` → Skip (unless significant)

- [ ] **Breaking Changes Documented**
  - If MAJOR version:
    - [ ] Migration guide created (how to upgrade)
    - [ ] Deprecated endpoints listed (with timeline for removal)
    - [ ] Database migration documented
    - [ ] Examples of old vs new API provided

### Git Tagging & Release Notes

- [ ] **Git Tag Created**
  ```bash
  git tag -a v1.5.0 -m "Release version 1.5.0
  
  Features:
  - New payment webhook endpoint
  - Database optimizations (15% latency improvement)
  
  Breaking Changes:
  - GET /user/profile deprecated, use GET /users/:id
  
  See CHANGELOG.md for full details"
  
  git push origin v1.5.0
  ```

- [ ] **Release Notes Written**
  - Audience: Customers, support team, internal stakeholders
  - Highlights: Top 3-5 features, most impactful fixes
  - Breaking changes: If any, migration guide included
  - Known issues: Workarounds provided if applicable
  - Timeline: When available (beta, GA, etc.)

---

## Build & Artifact Creation (30-45 minutes)

- [ ] **Code Frozen**
  - No new commits to release branch
  - Only hotfixes allowed (on branch)
  - Release branch: `release/v1.5.0`

- [ ] **Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - E2E tests: 100% pass
  - Linting: 0 errors
  - Type checking: 0 errors

- [ ] **Build Artifact Created**
  
  For containerized apps:
  ```bash
  docker build -t myapp:1.5.0 .
  docker tag myapp:1.5.0 myapp:latest
  docker push myapp:1.5.0
  docker push myapp:latest
  ```

  For compiled languages (Java, Go):
  ```bash
  mvn package -DskipTests
  java -jar target/myapp-1.5.0.jar
  ```

- [ ] **Artifact Verified**
  - [ ] Container image scans: 0 critical/high vulns
  - [ ] Binary size acceptable: Not ballooned
  - [ ] Dependencies: No new surprises
  - [ ] SBOM generated: For supply chain transparency

- [ ] **Smoke Test on Artifact**
  - Start container/application
  - Health check: GET /health returns 200 OK
  - Basic API call: GET /api/status works
  - Database connection: Successful

---

## Staging Deployment (30-45 minutes)

- [ ] **Deploy to Staging**
  ```bash
  kubectl set image deployment/myapp \
    myapp=myapp:1.5.0 \
    -n staging
  kubectl rollout status deployment/myapp -n staging
  ```

- [ ] **Staging Tests**
  - API health: All endpoints responding
  - Database migration: Ran successfully, data valid
  - Feature flags: New features disabled (for staged rollout)
  - Smoke tests: Pass on staging environment
  - Performance test: p99 latency acceptable

- [ ] **Stakeholder Sign-Off** (if required)
  - Product Owner: Feature completeness ✓
  - QA Lead: Test coverage ✓
  - Tech Lead: Code quality ✓
  - DevOps: Infrastructure readiness ✓

---

## Production Deployment Decision

### Go/No-Go Criteria

**✅ PROCEED TO PRODUCTION IF:**
- [ ] All staging tests passed
- [ ] No critical/high security issues
- [ ] Performance regression < 5% (or expected)
- [ ] Rollback plan documented & tested
- [ ] Monitoring & alerting enabled
- [ ] On-call engineer available
- [ ] All required sign-offs obtained
- [ ] No business-critical events happening (events, sales, etc.)

**❌ DO NOT DEPLOY IF:**
- ❌ Test failures not investigated
- ❌ Critical security vulnerabilities open
- ❌ Rollback untested
- ❌ No on-call coverage
- ❌ Major business event (Black Friday, product launch)
- ❌ Database migration not validated

### Go/No-Go Meeting (15 min)

**Attendees:** Release Manager, Tech Lead, DevOps Lead, Product Owner, On-Call

**Format:**
```
Release Manager: "Ready for 1.5.0?"
Tech Lead: "Code quality green, 0 critical issues"
DevOps: "Staging passed, rollback plan ready, on-call available"
Product Owner: "All features delivered, stakeholders ready"
QA Lead: "Test coverage at 92%, no showstoppers"
Release Manager: "👍 GO — proceeding with deployment"
```

---

## Production Deployment (Staged Rollout)

### Blue-Green Deployment (Recommended)

- [ ] **Deploy New Version (Green)**
  ```bash
  # Deploy alongside current version (Blue)
  kubectl apply -f deployment-v1.5.0.yaml -n production
  kubectl rollout status deployment/myapp-v1.5.0
  ```

- [ ] **Health Checks**
  - GET /health returns 200 OK
  - Pod CPU/memory within limits
  - Pod logs: No errors
  - All replicas ready

- [ ] **Canary Route (5% traffic)**
  ```bash
  kubectl patch service myapp \
    -p '{"spec":{"selector":{"version":"v1.5.0"}}}'
  # Route 5% traffic to v1.5.0, 95% to v1.4.2
  ```

- [ ] **Monitor Canary (5 minutes)**
  - Error rate: Should stay < 0.1%
  - Latency p99: Should stay < SLO
  - CPU/memory: Should stay < 70%
  - Alert: Any triggered?

- [ ] **Gradual Rollout**
  ```
  0min:  5% to v1.5.0
  5min: 25% to v1.5.0 (monitor 5 min)
  10min: 50% to v1.5.0 (monitor 5 min)
  15min: 100% to v1.5.0 (monitor 15 min)
  ```

- [ ] **Full Production (100% traffic)**
  - After 30 minutes with green at 100%
  - All metrics normal
  - All alerts cleared
  - **Declare success! ðŸŽ‰**

### Alternative: Rolling Deployment

If blue-green not available:
```bash
kubectl rollout undo deployment/myapp -n production
kubectl set image deployment/myapp \
  myapp=myapp:1.5.0 \
  -n production
kubectl rollout status deployment/myapp -n production
```

---

## Post-Deployment Monitoring (30 minutes)

- [ ] **First 5 Minutes**
  - Error rate: < 0.1%
  - Latency p95: < SLO
  - Latency p99: < SLO
  - Pod restarts: None

- [ ] **Continuous 30-Minute Monitoring**
  - Every 5 minutes check dashboard:
    - Error rate trending down?
    - Latency stable?
    - Business metrics (logins, orders, etc.) normal?
    - Alerts triggered?

- [ ] **Business Metrics**
  - User logins/hour: Normal?
  - API requests/hour: Normal?
  - Transactions: Processing?
  - Errors by service: Any spikes?

- [ ] **Issue Response**
  - Minor issues (< 0.5% error rate) → Monitor 10 more min
  - Major issues (> 1% error rate) → **ROLLBACK IMMEDIATELY**

---

## Rollback Procedure (If Needed)

### Immediate Rollback (< 5 minutes)

```bash
# Blue-Green:
kubectl patch service myapp \
  -p '{"spec":{"selector":{"version":"v1.4.2"}}}'

# Rolling (if no green still running):
kubectl rollout undo deployment/myapp -n production
kubectl rollout status deployment/myapp
```

### Verification Post-Rollback
- [ ] Error rate returned to normal
- [ ] Latency back to baseline
- [ ] Alerts cleared
- [ ] Post-mortem scheduled

---

## Release Completion

### Success Declaration

- [ ] **Post Announcement** (Slack, email)
  ```
  ✅ v1.5.0 released to production
  
  Key Features:
  - New payment webhook endpoint
  - 15% API latency improvement
  - 12 bug fixes
  
  Monitoring: All green ✅
  On-call: Available for support
  
  Changelog: https://github.com/myorg/myapp/blob/main/CHANGELOG.md
  ```

- [ ] **Update Status Dashboard**
  - Mark release as live
  - Update version number displayed to users

- [ ] **Notify Support/Customers**
  - Release notes email sent
  - In-app banner (if applicable)
  - Help center updated

- [ ] **Archive Release Artifacts**
  - Screenshots of dashboard (before/after)
  - Performance metrics exported
  - Release notes saved

### Documentation Updated

- [ ] **Runbook updated** for future releases
  - What went well?
  - What could improve?
  - Any new gotchas?

- [ ] **Deployment guide updated** (if process changed)

---

## Release Checklist Template

```markdown
# Release v1.5.0 - 2026-07-23

## Pre-Release
- [ ] Version number determined: 1.5.0
- [ ] Changelog generated and reviewed
- [ ] Release notes written for customers
- [ ] Git tag created: v1.5.0

## Build
- [ ] Tests passing: unit, integration, E2E
- [ ] Linting: 0 errors
- [ ] Container image built and scanned
- [ ] Artifact verified (health check passed)

## Staging
- [ ] Deployed to staging
- [ ] Staging tests passed
- [ ] Performance acceptable
- [ ] Stakeholder sign-offs obtained

## Go/No-Go
- [ ] Release Manager: Ready
- [ ] Tech Lead: No blocking issues
- [ ] DevOps: Infrastructure ready
- [ ] Product Owner: Features complete
- [ ] On-Call: Available for support
- [ ] **DECISION: GO** ✅

## Production
- [ ] Deployment initiated at [HH:MM]
- [ ] Canary (5%) deployed, no alerts
- [ ] Gradually rolled out to 100%
- [ ] 30-minute monitoring complete
- [ ] All metrics green ✅

## Post-Release
- [ ] Success announced (Slack)
- [ ] Release metrics archived
- [ ] Post-release runbook documented
- [ ] Next release planned

**Deployed by:** [Name]  
**Duration:** [minutes]  
**Issues encountered:** None / [List]  
**Rollback needed:** No / Yes
```

---

## Release Frequency & Windows

### Recommended Schedule
- **Patch releases (1.2.3):** As needed (security, critical bugs)
- **Minor releases (1.2.0):** Every 2 weeks
- **Major releases (2.0.0):** Every quarter

### Deployment Windows
- **Production releases:** Avoid 5pm-10am (off-hours)
- **Preferred times:** 10am-3pm (business hours, support available)
- **Blackout periods:** Product launches, major sales events, holidays

---

**Last Updated:** 2026-07-23  
**Next Release:** [Date]
