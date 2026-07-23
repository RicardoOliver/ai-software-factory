# Performance Testing Workflow

**Duration:** 4-8 hours per environment  
**Owners:** Performance Engineer, DevOps  
**Reference Agents:** `/performance`, `/devops`, `/backend`

---

## Overview

Comprehensive performance testing workflow covering load testing, stress testing, spike testing, and soak testing. Tests before production deployment to prevent performance regressions.

---

## Pre-Testing Setup (30 minutes)

### Test Environment Preparation

- [ ] **Test Environment Mirrors Production**
  - Database size: Same scale (if possible, use production snapshot anonymized)
  - Hardware: Same instance types, same count
  - Network: Same bandwidth limits, same latency
  - Configuration: Identical to production (feature flags, scaling limits)
  - Secrets: Test credentials/API keys

- [ ] **Baseline Metrics Recorded**
  - Current production p50/p95/p99 latency
  - Current production error rate
  - Current production throughput (requests/sec)
  - Current production resource usage (CPU, memory)
  - Target metrics for new release

- [ ] **Monitoring Set Up**
  - Prometheus/Grafana collecting metrics
  - Logs being sent to Loki/ELK
  - APM tool tracking distributed traces
  - Export metrics to CSV for analysis

- [ ] **Test Scenarios Created**
  - Realistic user workflows scripted (not synthetic)
  - Data prepared (test users, orders, etc.)
  - Load distribution matches production (80% read, 20% write)
  - Ramp-up profiles defined (gradual increase vs sudden)

- [ ] **Success Criteria Defined**
  ```
  Metric              | Threshold | Action if Failed
  ─────────────────────────────────────────────────
  p99 latency         | < [SLO]   | FAIL test, investigate
  error rate          | < 0.1%    | FAIL test, investigate
  pod CPU             | < 70%     | FAIL test, increase resources
  pod memory          | < 80%     | FAIL test, increase resources
  GC pause time       | < 100ms   | WARN, may need optimization
  database conn pool  | < 90%     | WARN, may need tuning
  ```

---

## Test 1: Load Test (1-2 hours)

**Goal:** Verify system performs under expected peak load.

### Baseline Load Test

- [ ] **Run baseline with current codebase**
  - Load: [Expected peak users] concurrent users
  - Duration: 10 minutes
  - Ramp-up: 1 minute (simulate users arriving)
  - Record: p50, p95, p99 latency, error rate, CPU, memory

- [ ] **Repeat with new code**
  - Same load profile
  - Compare metrics to baseline
  - Expected: < 5% regression in latency

### Breakpoint Discovery (Optional)

- [ ] **Find system breaking point**
  - Start with peak load
  - Increase users by 50% every 10 minutes
  - Stop when error rate > 1% or latency > 2x normal
  - Record: Maximum sustainable throughput (RPS)

### Analysis

- [ ] **Identify bottlenecks**
  - Database: Is CPU/memory the limit?
  - Network: Is bandwidth the limit?
  - Application: Is process the limit?
  - External APIs: Are they the limit?

- [ ] **Example: Database CPU Limit Found**
  - Query optimization opportunity? (EXPLAIN ANALYZE)
  - Need caching layer? (Redis)
  - Need read replicas?
  - Need horizontal sharding?

---

## Test 2: Stress Test (1-2 hours)

**Goal:** Find breaking point and ensure graceful degradation.

### Ramp-Up Stress Test

- [ ] **Run with increasing load**
  - Phase 1: Baseline load (5 min)
  - Phase 2: Baseline + 50% (10 min)
  - Phase 3: Baseline + 100% (10 min)
  - Phase 4: Baseline + 150% (10 min)
  - Phase 5: Baseline + 200% (10 min)
  - Continue until: Error rate > 5% or latency > 5x normal

- [ ] **Observe system behavior**
  - Error handling: Returns 503 gracefully? Or crashes?
  - Degradation: Slow but recoverable? Or cascade failure?
  - Resource cleanup: Memory released after spike? Or leak?
  - Alerting: Did alerts trigger?

### Recovery Test

- [ ] **After reaching breakpoint**
  - Gradually reduce load back to baseline
  - System recovers? Error rate returns to normal?
  - Any stuck connections/processes?
  - Pod restart needed?

### Analysis

- [ ] **Identify failure modes**
  - Circuit breaker: Trips at right threshold?
  - Rate limiting: Working correctly?
  - Connection pool: Handles exhaustion?
  - Graceful shutdown: Clean or crashed?

---

## Test 3: Spike Test (30 minutes)

**Goal:** Verify system handles sudden traffic spikes (e.g., Black Friday, viral tweet).

### Spike Scenarios

- [ ] **Sudden 10x increase**
  - Current: 1,000 RPS
  - Spike to: 10,000 RPS instantly
  - Duration: 5 minutes
  - Then: Back to baseline

- [ ] **Gradual spike (more realistic)**
  - Current: 1,000 RPS
  - Increase by 50% every 30 seconds
  - Reach: 10,000 RPS
  - Duration at peak: 5 minutes
  - Then: Gradual decrease

### Success Criteria

- [ ] **Immediate spike response**
  - Latency spike: Yes, expected (up to 2x)
  - Error rate spike: < 1% OK, > 5% FAIL
  - Auto-scaling: Triggered within 1-2 min?
  - Database: Connection pool stable?

- [ ] **Recovery**
  - Latency returns to normal: < 2 min
  - Error rate returns to < 0.1%: < 2 min
  - Pod autoscaling scales down: 5-10 min

### Analysis

- [ ] **Identify scaling limitations**
  - HPA min/max replicas: Appropriate?
  - Scale-up time: < 2 min acceptable?
  - Database scaling: Can handle spike?
  - Cache warmup: Pre-warm before spike?

---

## Test 4: Soak Test (8-12 hours)

**Goal:** Verify system stability under sustained load over long duration.

### Long-Running Load

- [ ] **Run at sustained peak load**
  - Load: [Expected peak] concurrent users
  - Duration: 8-12 hours (overnight)
  - Ramp-up: 5 minutes (gradual)
  - Ramp-down: 5 minutes (gradual)

- [ ] **Monitor continuously**
  - Hourly snapshots: latency, error rate, CPU, memory
  - Compare hour 1 vs hour 8 — any drift?
  - Memory usage: Stable or growing?
  - GC pauses: Increasing over time?

### Failure Detection

- [ ] **Detect memory leaks**
  - Memory growing: Yes = potential leak
  - Check: Heap snapshot after 4 hours
  - Look for: Retained objects, circular references
  - Action: Profile with YourKit, Chrome DevTools, Java Flight Recorder

- [ ] **Detect connection leaks**
  - Database connections: Stable or growing?
  - HTTP connections: Closed properly?
  - Action: Check connection pool logs

- [ ] **Detect gradual performance degradation**
  - p99 latency hour 1 vs hour 8: Should be same (±5%)
  - If degrading: Investigate root cause
  - Common: Connection leak, memory leak, lock contention

### Success Criteria

- [ ] **System stable after 8 hours**
  - p99 latency: Consistent (< 5% variation)
  - Error rate: < 0.1%
  - Memory: Not growing > 5%
  - CPU: Steady
  - GC pauses: Not increasing
  - No pod crashes/restarts

---

## Tools & Configuration

### Load Testing Tools

| Tool | Best For | Pros | Cons |
|------|----------|------|------|
| **k6** | Modern, JS-based | Easy scripting, real-time metrics | Smaller scale (< 1M RPS) |
| **JMeter** | Distributed testing | Can scale to 1M+ RPS | Verbose, steep learning curve |
| **Locust** | Python-based | Python familiar, intuitive | Python overhead |
| **Gatling** | High throughput | 1M+ RPS, beautiful reports | Scala-based |
| **Apache ab** | Simple, quick tests | Built-in, quick start | Limited features |

### Recommended: k6 for most use cases

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp-up
    { duration: '5m', target: 100 },   // Stay
    { duration: '1m', target: 0 },     // Ramp-down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],    // 95% of requests < 500ms
    'http_req_failed': ['rate<0.1'],       // Error rate < 0.1%
  }
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

### Monitoring Stack

- **Metrics:** Prometheus scraping endpoints
- **Visualization:** Grafana dashboards
- **Logs:** Loki aggregation
- **APM:** Datadog/New Relic/Jaeger for distributed tracing

---

## Performance Regression Detection

### Before vs After Comparison

```yaml
Baseline (Main Branch):
  p50: 50ms
  p95: 150ms
  p99: 300ms
  error_rate: 0.05%
  throughput: 10,000 RPS

After Code Changes:
  p50: 52ms (↑4%)
  p95: 165ms (↑10%)
  p99: 330ms (↑10%)
  error_rate: 0.06% (↑20%)
  throughput: 9,800 RPS (↓2%)

DECISION: WARNING - p95/p99 regression detected
  Action: Investigate changes, profile hotspots, optimize
```

### Decision Framework

| Metric | Regression | Action |
|--------|-----------|--------|
| p99 latency | > 10% | BLOCK, optimize or revert |
| error rate | > 20% | BLOCK, investigate bugs |
| throughput | > 5% down | WARN, may indicate inefficiency |
| memory | > 10% increase | WARN, potential memory leak |
| CPU | > 20% increase | WARN, may need resources |

---

## Performance Optimization Workflow

If regression detected:

1. **Profile the code**
   - Node.js: `--inspect` with Chrome DevTools
   - Python: `cProfile` or `py-spy`
   - Java: JFR or async-profiler

2. **Identify hotspots** (top 3 functions using CPU/memory)
   - Example: "User lookup query takes 80% of time"

3. **Optimize**
   - Add index if database query
   - Add caching if repeated calculation
   - Optimize algorithm if logic inefficient
   - Reduce allocations if memory-heavy

4. **Re-test**
   - Re-run same test
   - Verify regression resolved
   - Ensure no new regressions

---

## Pre-Deployment Checklist

- [ ] **Load test passed** (< 5% regression)
- [ ] **Stress test passed** (graceful degradation)
- [ ] **Spike test passed** (auto-scaling works)
- [ ] **Soak test passed** (no memory leaks, stable)
- [ ] **No performance regressions** (p99 within threshold)
- [ ] **Monitoring alerts configured** (for performance anomalies)
- [ ] **Runbook updated** with performance tuning steps
- [ ] **Results documented** (save test reports, metrics exports)

---

## Performance Test Report Template

```markdown
# Performance Test Report

**Test Date:** [YYYY-MM-DD]  
**Tested Version:** [git commit/tag]  
**Test Environment:** [staging/production-mirror]  
**Tester:** [Name]

## Summary
[1-2 sentence overview of test results]

## Test Results

### Load Test
- Baseline: [p99 latency], [error rate]
- New Code: [p99 latency], [error rate]
- Regression: [Yes/No, %]
- **Result:** [PASS/FAIL]

### Stress Test
- Breaking Point: [RPS/concurrent users]
- Graceful Degradation: [Yes/No]
- Recovery Time: [seconds]
- **Result:** [PASS/FAIL]

### Spike Test
- Spike Size: [10x, 5x, etc.]
- Peak Latency: [ms]
- Error Rate at Peak: [%]
- Auto-scaling Response: [seconds]
- **Result:** [PASS/FAIL]

### Soak Test
- Duration: [hours]
- Memory Leak: [None detected/Yes]
- Latency Drift: [%]
- **Result:** [PASS/FAIL]

## Issues Found
- [Issue 1] — [Severity] — [Action]
- [Issue 2] — [Severity] — [Action]

## Recommendations
- [Optimization 1]
- [Optimization 2]

## Approval
- [ ] Ready for production: [Yes/No]
- Approved by: [Name]
- Date: [YYYY-MM-DD]
```

---

**Last Updated:** 2026-07-23
