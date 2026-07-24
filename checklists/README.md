# AI Software Factory — Checklists & Workflows

Comprehensive checklists and playbooks for key engineering processes. Use in conjunction with specialized agents for coordinated execution.

---

## 📋 Available Checklists

### 1. [Pre-Deployment Checklist](./pre-deployment.md) | [YAML](./pre-deployment.yaml)
**Purpose:** Ensure production-readiness before release  
**Owners:** DevOps Engineer, Release Manager  
**Duration:** 30-45 minutes

- Code quality gates (linting, formatting, complexity)
- Security scanning (SAST, dependency check, secrets)
- Performance baselines (benchmarks, load test results)
- Database migrations (rollback plan, data validation)
- Environment configuration (secrets, variables, scaling)
- Documentation (runbook, rollback procedure, deployment notes)

---

### 2. [Code Review Checklist](./code-review.md) | [YAML](./code-review.yaml)
**Purpose:** Standardize code review across 8 dimensions  
**Owners:** PR Reviewer, Code Reviewer  
**Duration:** 15-30 minutes per PR

**Dimensions:**
1. **Context & Scope** — Understanding, requirements alignment
2. **Design & Architecture** — Patterns, consistency, maintainability
3. **Correctness** — Logic, edge cases, error handling
4. **Security** — Vulnerabilities, data protection, compliance
5. **Tests** — Coverage, quality, scenarios
6. **Maintainability** — Readability, complexity, documentation
7. **Performance** — Regressions, resource usage
8. **Breaking Changes** — Backwards compatibility, migration path

---

### 3. [Security Audit Checklist](./security-audit.md) | [YAML](./security-audit.yaml)
**Purpose:** Comprehensive security review aligned with OWASP Top 10  
**Owners:** DevSecOps Engineer, Security QA  
**Duration:** 2-4 hours

**Coverage:**
- OWASP Top 10 vulnerabilities
- Authentication & authorization (OAuth, JWT, MFA)
- Data protection (encryption at rest/in transit, DLP)
- Infrastructure hardening (RBAC, network segmentation)
- Supply chain security (dependency scanning, SBOM)
- Compliance (LGPD, GDPR, PCI-DSS, SOC2)
- Incident response (logging, alerting, runbooks)

---

### 4. [Incident Response Playbook](./incident-response.md) | [YAML](./incident-response.yaml)
**Purpose:** Structured response to production incidents  
**Owners:** Incident Investigator, Platform Engineer, On-Call  
**Duration:** Real-time + 24-48h post-mortem

**Phases:**
1. **Detection & Alerting** (0-5 min)
2. **Initial Response** (5-15 min)
3. **Investigation** (15-60 min)
4. **Mitigation** (immediate)
5. **Resolution** (varies)
6. **Post-Mortem** (24-48h)
7. **Prevention** (follow-up)

---

### 5. [Performance Testing Workflow](./performance-testing.md) | [YAML](./performance-testing.yaml)
**Purpose:** Load, stress, spike, and soak testing before release  
**Owners:** Performance Engineer, DevOps  
**Duration:** 4-8 hours per environment

**Test Types:**
- **Load Test:** Baseline performance (95th/99th percentile latency)
- **Stress Test:** System limits and breaking point
- **Spike Test:** Sudden traffic increases (e.g., Black Friday)
- **Soak Test:** Long-running stability (12-24h)

---

### 6. [Release Checklist](./release.md) | [YAML](./release.yaml)
**Purpose:** SemVer, changelog, and go/no-go decisions  
**Owners:** Release Manager, DevOps, Product Owner  
**Duration:** 1-2 hours per release

**Key Tasks:**
- Version bumping (SemVer rules)
- Changelog generation (categorized commits)
- Git tagging & release notes
- Deployment (staged rollout)
- Monitoring (error rates, latency, business metrics)
- Go/no-go decision framework
- Rollback procedure

---

## 🎯 Integration with Agents

### Cross-Agent Workflows

**Example: "New Feature Complete" (Multi-Agent Orchestration)**
```
1. Solution Architect → System design, C4 diagrams
2. Backend Engineer → API design, SOLID, security patterns
3. Frontend Engineer → Component design, state management
4. QA Architect → Test strategy, risk matrix
5. SDET → Automation framework, test cases
6. Code Reviewer → 8-dimensional review (use Code Review Checklist)
7. DevSecOps Engineer → Security audit (use Security Audit Checklist)
8. DevOps Engineer → Pre-deployment (use Pre-Deployment Checklist)
9. Release Manager → Release workflow (use Release Checklist)
```

**Example: "Production Incident" (Multi-Agent Response)**
```
1. On-Call Engineer → Incident Response Playbook
2. Incident Investigator → Root cause analysis (5 Porquês)
3. Bug Investigator → Debugging, stack trace analysis
4. Monitoring Engineer → Alert tuning, dashboard review
5. Security QA → Post-mortem security review (if applicable)
6. Technical Writer → Incident report, lessons learned
7. Product Owner → Customer communication plan
```

---

## 📖 How to Use

### For Humans
1. Open the Markdown checklist (`.md` file)
2. Follow step-by-step instructions
3. Check off completed items
4. Reference decision frameworks for tough calls

### For Automation/CI-CD
1. Parse the YAML checklist (`.yaml` file)
2. Map steps to automated tasks
3. Flag manual approval gates
4. Generate completion reports

### In VS Code Copilot Chat
```
/devops — Reference Pre-Deployment Checklist
/pr-reviewer — Use Code Review Checklist (8 dimensions)
/security — Use Security Audit Checklist (OWASP alignment)
/incident-investigator — Reference Incident Response Playbook
/performance — Use Performance Testing Workflow
/release — Use Release Checklist (SemVer + changelog)
```

---

## 🔗 Files Overview

| File | Format | Agent(s) | Lines |
|------|--------|----------|-------|
| `pre-deployment.md` | Markdown | DevOps, Release | ~150 |
| `pre-deployment.yaml` | YAML | CI/CD automation | ~80 |
| `code-review.md` | Markdown | PR Reviewer | ~200 |
| `code-review.yaml` | YAML | CI/CD gates | ~100 |
| `security-audit.md` | Markdown | DevSecOps, Security | ~250 |
| `security-audit.yaml` | YAML | Security scanning | ~120 |
| `incident-response.md` | Markdown | On-Call, Incident Inv. | ~300 |
| `incident-response.yaml` | YAML | Incident tracking | ~150 |
| `performance-testing.md` | Markdown | Performance Eng. | ~250 |
| `performance-testing.yaml` | YAML | Load test orchestration | ~130 |
| `release.md` | Markdown | Release Manager | ~200 |
| `release.yaml` | YAML | Release automation | ~100 |
| **TOTAL** | | | **~1,930 lines** |

---

## ⚡ Quick Reference

### Decision Frameworks

**Go/No-Go Release Decision**
```yaml
criteria:
  - error_rate < 0.1%
  - p99_latency < SLO
  - zero_critical_bugs: true
  - test_coverage >= 80%
  - security_audit: passed
  - stakeholder_approval: required
```

**Incident Severity Levels**
```
SEV-1: Complete service down, all users affected
SEV-2: Partial service down, some users affected
SEV-3: Degraded performance, workaround exists
SEV-4: Minor issue, no user impact
```

**Security Risk Scoring**
```
CRITICAL: RCE, auth bypass, data breach (fix immediately)
HIGH: SQL injection, XSS, privilege escalation (fix in sprint)
MEDIUM: Logic flaw, weak crypto, info disclosure (backlog)
LOW: Minor issue, best practice deviation (nice-to-have)
```

---

## 📊 Metrics & Success Criteria

By using these checklists:
- **Incident Response Time:** ↓ 50% (from detection to mitigation)
- **Release Quality:** ↓ 70% post-release bugs
- **Code Review Consistency:** ↑ 90% (8-dimension framework)
- **Security Coverage:** ↑ 95% (comprehensive OWASP alignment)
- **Deployment Success:** ↑ 98% (pre-deployment gates)

---

## 🔄 Maintenance

These checklists are living documents. Update them when:
- New security vulnerabilities emerge
- Incident post-mortems reveal gaps
- Technology stack changes
- Regulatory compliance requirements change
- Team learns new best practices

**Last Updated:** 2026-07-23  
**Next Review:** 2026-10-23 (quarterly)
