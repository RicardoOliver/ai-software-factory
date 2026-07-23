# Incident Response Playbook

**Duration:** Real-time + 24-48 hours post-mortem  
**Owners:** Incident Investigator, Platform Engineer, On-Call Engineer  
**Reference Agents:** `/incident-investigator`, `/platform-engineer`, `/monitoring`

---

## Severity Levels

| Level | Definition | Response Time | Example |
|-------|-----------|----------------|---------|
| **SEV-1** | Complete service down, all users affected | **Immediate** (< 5 min) | API completely unreachable, database offline |
| **SEV-2** | Partial service down, some users affected | **Urgent** (< 15 min) | Payment processing failing for 10% of users |
| **SEV-3** | Degraded performance, workaround exists | **High** (< 1 hour) | API latency 5x normal, users can retry |
| **SEV-4** | Minor issue, no user impact | **Normal** (< 24 hours) | Non-critical service degraded, internal tool slow |

---

## Phase 1: Detection & Alerting (0-5 minutes)

**Goal:** Detect and notify on-call engineer immediately.

### Automated Detection
- [ ] **Monitoring alerts triggered** (on metrics below)
  - Error rate > 1% (SEV-1) or > 0.5% (SEV-2)
  - P99 latency > SLO + 20% (SEV-1) or > SLO (SEV-2)
  - CPU/memory > 80% (SEV-1) or > 60% (SEV-2)
  - Disk space < 10% free (SEV-1)
  - Database connection pool exhausted (SEV-1)
  - Pod restart loops (SEV-1)

### Alert Routing
- [ ] **Alert reaches on-call engineer**
  - Primary channel: PagerDuty notification + SMS
  - Secondary channel: Slack #incidents channel
  - Escalation: Manager notified if no ack within 5 minutes

### Alert Content
- [ ] **Alert includes critical info**
  - Service name & component
  - Current metric values vs thresholds
  - Runbook link (if exists)
  - Grafana dashboard link
  - Related logs link (Loki/ELK)

---

## Phase 2: Initial Response (5-15 minutes)

**Goal:** Acknowledge incident and gather context.

### Incident Commander Assigned
- [ ] **On-call engineer acknowledges alert**
  - Acknowledge in PagerDuty
  - Create Slack thread in #incidents
  - Post: "Acknowledged at [time], investigating..."

- [ ] **Severity assessed & confirmed**
  - Ask: Are users affected? How many?
  - Check: Error rate, latency, business metrics
  - Decision: Bump up or down severity if needed
  - Post: "Confirmed SEV-[X]: [Impact statement]"

### Initial Context Gathering
- [ ] **Access dashboards & logs**
  - Grafana: Error rates, latency, resource usage (last 30 min)
  - Loki/ELK: Error logs, stack traces (last 10 min)
  - Status page: Any known incidents?

- [ ] **Check recent changes**
  - Git: Recent deployments (last 2 hours)?
  - Feature flags: Any recently enabled?
  - Database: Any migrations running?
  - Infrastructure: Any scaling events?

### Escalation Decision
- [ ] **Page additional engineers if needed**
  - SEV-1: Page Backend Lead, DevOps Lead, Manager
  - SEV-2: Page Backend Lead + on-call backup
  - SEV-3: Monitor, escalate only if worsens

---

## Phase 3: Investigation (15-60 minutes)

**Goal:** Find root cause of incident.

### Error Rate Investigation
- [ ] **Identify affected endpoint/component**
  - Which service/endpoint has errors?
  - Which error code? (500, 503, timeout, etc.)
  - Stack trace: Last 20 errors in logs

- [ ] **Gather error context**
  - User ID / request ID (for reproducibility)
  - Correlation ID (trace related requests)
  - Database slow query log
  - External API responses

### Performance Investigation
- [ ] **Latency root cause**
  - Database query slow? (EXPLAIN ANALYZE)
  - External API call slow?
  - Network latency?
  - CPU/memory constrained?

- [ ] **Check resource usage**
  - Pod CPU/memory: Approaching limits?
  - Database connections: Pool exhausted?
  - Disk I/O: High utilization?
  - Memory leaks? (Check GC logs)

### Dependency Check
- [ ] **Check external dependencies**
  - Third-party APIs: Are they responding?
  - Database: Health checks passing?
  - Cache (Redis): Connected?
  - Message queue: Processing backlog?

### Pattern Recognition
- [ ] **Use Bug Investigator patterns** (reference `/bug-investigator`)
  - Memory leak: Gradual latency increase?
  - N+1 queries: Correlate error with database queries?
  - Race condition: Intermittent failures?
  - Cascading failure: One service brings down others?

### Likely Root Causes (Diagnosis Tree)

```
Error rate spike?
├─ YES: Check logs for exception stack trace
│   ├─ NullPointerException → Recent code change? Null input handling?
│   ├─ OutOfMemoryError → Memory leak? Large data processing?
│   ├─ DatabaseException → Connection pool exhausted? Slow queries?
│   └─ TimeoutException → External service down? Network issue?
└─ NO: Check latency spike
    ├─ YES: Database slow? Check EXPLAIN ANALYZE
    │   ├─ YES: Missing index? Inefficient query?
    │   └─ NO: External service slow?
    └─ NO: Resource constrained? Check CPU/memory/disk
        ├─ CPU: Hot loop? Inefficient algorithm?
        ├─ Memory: Memory leak? Large data loading?
        └─ Disk: Disk I/O contention? Full disk?
```

---

## Phase 4: Mitigation (Immediate)

**Goal:** Stop user impact immediately (even before root cause fix).

### Mitigation Options (in priority order)

| Mitigation | Time | Downsides | Use When |
|-----------|------|-----------|----------|
| **Feature Flag Disable** | < 2 min | Users can't use feature | New feature causing errors |
| **Scale Up (HPA)** | 3-5 min | Costs $$, doesn't fix root cause | Resource constrained but service works |
| **Rollback Deployment** | 5-10 min | Loses recent changes, downtime | Recent deploy introduced bug |
| **Database Connection Reset** | < 1 min | Brief connection drops | Connection pool exhausted |
| **Cache Clear** | < 1 min | Brief performance degradation | Corrupted cache data |
| **Restart Service** | 2-5 min | Temporary downtime, doesn't fix root cause | Memory leak, stuck threads |
| **Failover to Standby** | 5-15 min | Brief requests lost, DNS TTL delay | Primary database/region down |
| **Circuit Breaker Enable** | < 1 min | Graceful degradation | External service cascading failure |

### Decision Framework

**SEV-1: Use fastest mitigation (< 5 min)**
```
1. Is it a bad deployment? → ROLLBACK
2. Is it resource constrained? → SCALE UP
3. Is it a new feature? → DISABLE FLAG
4. Otherwise → Restart service
```

**SEV-2: Try targeted mitigation (< 15 min)**
```
1. Identify root cause (if obvious)
2. Try safest mitigation first
3. If unsuccessful, escalate to rollback/restart
```

**SEV-3: Investigate before acting**
```
1. Gather full context
2. Implement targeted fix
3. Monitor for 15 minutes
```

### Mitigation Execution

- [ ] **Execute mitigation**
  - Document what action taken
  - Document why (root cause hypothesis)
  - Document time action taken

- [ ] **Monitor immediately**
  - Error rate: Returns to normal?
  - Latency: Returns to SLO?
  - Alerts: All cleared?
  - New errors?: No side effects?

- [ ] **Declare mitigated** (if successful)
  - Post in Slack: "Mitigated at [time]. Error rate returned to normal."
  - Post dashboard screenshot (before/after)
  - Keep incident thread open for root cause analysis

---

## Phase 5: Resolution (Varies)

**Goal:** Implement permanent fix.

### If Quick Fix Available (< 30 min)
- [ ] **Fix & deploy immediately**
  - Code change in Git
  - Run full test suite
  - Deploy to staging (verify)
  - Deploy to production
  - Post: "Fixed at [time]. Permanent solution deployed."

### If Complex Fix Needed (> 30 min)
- [ ] **Continue with mitigation in place**
  - Work on permanent fix in parallel
  - Target deployment time: [time]
  - Keep incident thread updated every 15 minutes

- [ ] **Staged rollout (if complex)**
  - Deploy to canary (5% traffic)
  - Monitor for 5 minutes
  - Deploy to 25% traffic
  - Monitor for 5 minutes
  - Deploy to 100% traffic

### Validation
- [ ] **Verify fix works**
  - Error rate: < 0.1% for 10 minutes
  - Latency: Back to normal
  - Business metrics: Recovered
  - No regressions in other services

---

## Phase 6: Post-Mortem (24-48 hours)

**Goal:** Learn and prevent recurrence.

### Post-Mortem Meeting (30-45 min)

**Attendees:** Incident Commander, on-call engineer, Backend Lead, DevOps, QA

**Agenda:**
1. **Timeline** (5 min)
   - What time did issue start?
   - What time detected?
   - What time mitigated?
   - What time resolved?

2. **Root Cause (5 Porquês)** (10 min)
   - What failed?
     - Example: "API endpoint returned 500 errors"
   - Why?
     - Example: "Database connection pool exhausted"
   - Why?
     - Example: "Slow query on user table"
   - Why?
     - Example: "Missing index on user_id"
   - Why?
     - Example: "Index not added during schema migration"
   - Root Cause: **Process failure** — migration process didn't validate indexes

3. **Detection & Response** (5 min)
   - How quickly detected? (Alert latency)
   - Was alert accurate? (Any false positives?)
   - Could detection be faster?

4. **Mitigation Effectiveness** (5 min)
   - How quickly mitigated?
   - Did mitigation work?
   - Any side effects?
   - Better mitigation options?

5. **Lessons Learned** (5 min)
   - What went well?
   - What could improve?

6. **Action Items** (5 min)
   - Immediate actions (this week)
   - Short-term (this month)
   - Long-term (this quarter)

### Post-Mortem Document

- [ ] **Document written & shared**
  - File: `incidents/INCIDENT-[date]-[service].md`
  - Include: Timeline, root cause, mitigation, lessons learned
  - Shared: Slack, email, wiki

- [ ] **Action Items Tracked**
  - JIRA tickets created
  - Assigned owners
  - Target completion dates
  - Linked to incident document

---

## Phase 7: Prevention (Follow-up)

**Goal:** Implement changes to prevent recurrence.

### Example Prevention Actions

| Root Cause | Prevention | Owner | Timeline |
|-----------|-----------|-------|----------|
| Missing index on DB query | Code review process to check all queries, add index review step | DevOps | 1 week |
| No alerting on slow queries | Add slow query alert (queries > 1 sec) | Monitoring Eng. | 2 weeks |
| Manual schema migration | Automate schema migrations in CI/CD | Platform Eng. | 1 month |
| Cascading failure (no circuit breaker) | Implement circuit breaker on external API call | Backend Lead | 2 weeks |
| No connection pool limiting | Set max connection pool size, add monitoring | DevOps | 1 week |

### Prevention Verification

- [ ] **Action items completed**
  - Code changes deployed
  - Tests added (prevent regression)
  - Documentation updated
  - Runbook updated

- [ ] **Monitoring for recurrence**
  - Alert created for early detection
  - Baseline metrics established
  - Dashboard updated with new metrics

---

## Incident Report Template

```markdown
# Incident Report: [Service Name]

**Date:** [YYYY-MM-DD HH:MM UTC]  
**Severity:** SEV-[1-4]  
**Duration:** [HH:MM]  
**Affected Users:** [Count/percentage]

## Summary
[2-3 sentence description of what happened]

## Timeline
- **HH:MM** — Issue started (or detected by customers)
- **HH:MM** — Alert triggered
- **HH:MM** — Incident confirmed, SEV-X declared
- **HH:MM** — Mitigation action taken: [action]
- **HH:MM** — Error rate returned to normal
- **HH:MM** — Permanent fix deployed

## Root Cause
[5 Porquês analysis]

## Impact
- Users affected: [count]
- Duration: [HH:MM]
- Revenue impact: $[amount] (if applicable)
- Data loss: [yes/no, describe]

## Mitigation
- Action taken: [description]
- Time to mitigation: [minutes]
- Effectiveness: [% improvement in metrics]

## Permanent Fix
- Changes deployed: [git commits]
- Tests added: [link to PR]
- Deployment time: [HH:MM]

## Action Items
1. [Action] — Owner: [Name] — Deadline: [date]
2. [Action] — Owner: [Name] — Deadline: [date]

## Lessons Learned
### What went well
- [What worked]

### What could improve
- [Gap]

## References
- Runbook: [link]
- Dashboard: [link]
- Related PRs: [links]
```

---

## Incident Commander Responsibilities

- [ ] **Communication**
  - Slack thread updates every 10 minutes
  - Regular updates to stakeholders
  - Final "incident closed" message

- [ ] **Decision Making**
  - Severity assessment
  - Mitigation strategy choice
  - Escalation decisions

- [ ] **Documentation**
  - Timeline recording
  - Action items created
  - Post-mortem scheduled

- [ ] **Follow-up**
  - Verify action items completed
  - Monitor for recurrence (1 week)
  - Update runbook based on lessons

---

## Checklist for On-Call Engineers

**[ ] Before On-Call Shift**
- [ ] Runbooks reviewed and accessible
- [ ] PagerDuty app installed on phone
- [ ] Grafana, Loki, production access tested
- [ ] Escalation paths known (who to call?)

**[ ] During SEV-1 Incident**
- [ ] Acknowledge alert within 1 minute
- [ ] Create Slack thread with status
- [ ] Assess severity within 2 minutes
- [ ] Page additional engineers if needed
- [ ] Find root cause hypothesis within 15 min
- [ ] Mitigate within 5-30 minutes (based on severity)
- [ ] Monitor for 15 minutes post-mitigation
- [ ] Schedule post-mortem (24-48 hours)

**[ ] Post-Incident**
- [ ] Post-mortem completed
- [ ] Action items tracked in JIRA
- [ ] Runbook updated
- [ ] Next on-call handed off with context

---

## Emergency Contact List

| Role | Name | Phone | Email | Slack |
|------|------|-------|-------|-------|
| VP Engineering | [Name] | [Phone] | [Email] | @[handle] |
| Engineering Manager | [Name] | [Phone] | [Email] | @[handle] |
| Platform Lead | [Name] | [Phone] | [Email] | @[handle] |
| DevOps Lead | [Name] | [Phone] | [Email] | @[handle] |
| Database Admin | [Name] | [Phone] | [Email] | @[handle] |
| Security Lead | [Name] | [Phone] | [Email] | @[handle] |

---

**Last Updated:** 2026-07-23  
**Review Frequency:** Quarterly (next review: 2026-10-23)
