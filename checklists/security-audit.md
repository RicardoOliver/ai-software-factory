# Security Audit Checklist — OWASP Alignment

**Duration:** 2-4 hours  
**Owners:** DevSecOps Engineer, Security QA  
**Reference Agents:** `/devsecops-engineer`, `/security`, `/backend`

---

## Overview

Comprehensive security review aligned with OWASP Top 10 2023. This checklist ensures systematic coverage of all critical security domains including authentication, data protection, infrastructure hardening, and compliance.

---

## OWASP A01: Broken Access Control

**Goal:** Ensure users can only access resources they're authorized to access.

- [ ] **Authentication Verification**
  - [ ] All endpoints requiring authentication have auth middleware
  - [ ] No public endpoints that should be private
  - [ ] Session tokens include expiration time
  - [ ] Session management: secure storage (HttpOnly, Secure flags for cookies)

- [ ] **Authorization Verification**
  - [ ] Role-based access control (RBAC) implemented
  - [ ] Permissions checked before resource access
  - [ ] Admin operations audit-logged
  - [ ] Privilege escalation not possible (e.g., user can't change their own role)

- [ ] **API Key / Token Security**
  - [ ] API keys rotated regularly (every 90 days)
  - [ ] Tokens scoped to minimum required permissions
  - [ ] Leaked tokens revocable
  - [ ] No tokens in logs, error messages, URLs

- [ ] **Resource Access Control**
  - [ ] Users can't access other users' data (filter by user_id)
  - [ ] Tenant isolation enforced (if multi-tenant)
  - [ ] Admin operations require explicit authorization
  - [ ] URL traversal/parameter tampering tested (e.g., `/user/123` → can't access `/user/124`)

---

## OWASP A02: Cryptographic Failures

**Goal:** Protect sensitive data in transit and at rest.

- [ ] **Data in Transit**
  - [ ] All external connections use HTTPS/TLS
  - [ ] TLS version >= 1.2 enforced
  - [ ] Strong cipher suites configured (no weak ciphers like DES)
  - [ ] Certificate pinning (if applicable for mobile/desktop)
  - [ ] No downgrade attacks possible

- [ ] **Data at Rest**
  - [ ] Sensitive data encrypted (passwords, API keys, PII, payment info)
  - [ ] Encryption algorithm: AES-256 or better
  - [ ] Keys managed securely (AWS KMS, HashiCorp Vault, Azure Key Vault)
  - [ ] Keys rotated annually
  - [ ] Decryption keys never logged

- [ ] **Passwords**
  - [ ] Passwords hashed with strong algorithm (bcrypt, scrypt, Argon2)
  - [ ] Salt used (automatic with bcrypt)
  - [ ] Hash iterations >= 10 (bcrypt cost factor >= 12)
  - [ ] Passwords never logged or stored in plain text

- [ ] **Cryptographic Key Management**
  - [ ] Keys stored in secrets manager, not in code
  - [ ] Key rotation policy documented
  - [ ] Old keys retained for decryption (if data encrypted with old key)
  - [ ] Key access audit-logged

---

## OWASP A03: Injection

**Goal:** Prevent attackers from injecting malicious code/commands.

- [ ] **SQL Injection**
  - [ ] Parameterized queries used (prepared statements)
  - [ ] Never concatenate user input into SQL
  - [ ] ORMs used correctly (not bypassed with raw SQL)
  - [ ] Dynamic query construction validated/escaped

- [ ] **Command Injection**
  - [ ] No shell execution with user input (`system()`, `exec()`, backticks)
  - [ ] If unavoidable: input validated against whitelist
  - [ ] Escaped with shell-specific functions (e.g., `escapeshellarg`)

- [ ] **Code Injection**
  - [ ] No `eval()`, `exec()`, or `Function()` with user input
  - [ ] No dynamic class/method loading with user-controlled names
  - [ ] Deserialization safe (not deserializing untrusted data)

- [ ] **LDAP/XML/NoSQL Injection**
  - [ ] LDAP: Input validated/escaped
  - [ ] XML: External entity (XXE) disabled (disable DTD parsing)
  - [ ] NoSQL: Parameterized queries or strict schema validation

---

## OWASP A04: Insecure Design

**Goal:** Ensure security is built into architecture from the start.

- [ ] **Threat Modeling**
  - [ ] Threat model created (data flow diagram + threats)
  - [ ] High-risk flows identified
  - [ ] Mitigations documented (use of encryption, auth, etc.)

- [ ] **Secure Defaults**
  - [ ] Features disabled by default, enabled explicitly
  - [ ] Fail-secure: errors don't leak sensitive info
  - [ ] Admin mode requires explicit activation
  - [ ] Debug mode disabled in production

- [ ] **API Security**
  - [ ] Rate limiting enforced (prevent brute force, DoS)
  - [ ] Input validation enforced (type, length, format)
  - [ ] Output encoding enforced (JSON encoding, HTML encoding)
  - [ ] CORS configured restrictively (not `*`)

- [ ] **Data Flow**
  - [ ] Sensitive data flow through encrypted channels
  - [ ] Data minimization: only collect what's needed
  - [ ] Retention policy: old data deleted
  - [ ] PII not logged or shared unnecessarily

---

## OWASP A05: Security Misconfiguration

**Goal:** Eliminate unnecessary services, features, and configuration weaknesses.

- [ ] **Default Credentials**
  - [ ] All default usernames/passwords changed
  - [ ] No admin/admin, root/root, etc.
  - [ ] Initial configuration documented in runbook

- [ ] **Unnecessary Services Disabled**
  - [ ] Development tools disabled in production (debuggers, verbose logging)
  - [ ] Directory listing disabled (no `./ index of`)
  - [ ] Debug endpoints removed
  - [ ] Unnecessary services running? (SSH on frontend? Disable)

- [ ] **Security Headers Configured**
  - [ ] Strict-Transport-Security (HSTS) enabled
  - [ ] X-Frame-Options: DENY (prevent clickjacking)
  - [ ] X-Content-Type-Options: nosniff (prevent MIME sniffing)
  - [ ] Content-Security-Policy (CSP) configured
  - [ ] Referrer-Policy configured

- [ ] **Error Handling**
  - [ ] Stack traces not shown to users
  - [ ] Detailed errors logged server-side only
  - [ ] User-facing errors are generic ("An error occurred")

- [ ] **Dependencies Updated**
  - [ ] All dependencies on latest patched version
  - [ ] Dependency vulnerabilities scanned (Snyk, Trivy)
  - [ ] Monthly security updates applied

---

## OWASP A06: Vulnerable & Outdated Components

**Goal:** Keep dependencies secure and up-to-date.

- [ ] **Dependency Management**
  - [ ] Dependency list maintained (`package.json`, `requirements.txt`, `pom.xml`)
  - [ ] No unknown/unmaintained dependencies
  - [ ] Licenses compatible with project (Apache 2.0, MIT, not GPL if closed-source)

- [ ] **Vulnerability Scanning**
  - [ ] SCA tool integrated in CI/CD (Snyk, Trivy, OWASP DC)
  - [ ] Critical/high vulns block builds
  - [ ] Medium vulns reviewed, prioritized
  - [ ] Vulnerabilities tracked in JIRA/backlog

- [ ] **Update Strategy**
  - [ ] Security patches applied immediately (within 24-48h)
  - [ ] Major version updates tested before deployment
  - [ ] Breaking changes mitigated or delayed until planned release

- [ ] **SBOM (Software Bill of Materials)**
  - [ ] SBOM generated for container images (SPDX format)
  - [ ] SBOM tracked for compliance/audits
  - [ ] Supply chain attacks mitigated

---

## OWASP A07: Identification & Authentication Failures

**Goal:** Protect user identity and prevent account takeover.

- [ ] **Password Policy**
  - [ ] Minimum length: 12+ characters
  - [ ] Complexity: mix of upper, lower, numbers, symbols
  - [ ] No common passwords (checked against HIBP)
  - [ ] Password expiration (optional, but rotation on compromise)

- [ ] **Multi-Factor Authentication (MFA)**
  - [ ] MFA available for critical accounts (admin, payment)
  - [ ] TOTP (Google Authenticator) or hardware keys preferred
  - [ ] SMS MFA acceptable if no better alternative (avoid SMS if possible)

- [ ] **Session Management**
  - [ ] Session tokens cryptographically random
  - [ ] Session timeout: 15-30 minutes inactivity
  - [ ] Logout invalidates session (server-side)
  - [ ] No session data in URL (use cookies with HttpOnly flag)

- [ ] **Password Reset**
  - [ ] Reset link time-limited (15-60 minutes)
  - [ ] Reset link single-use (expires after use)
  - [ ] No predictable reset tokens
  - [ ] Reset confirmation email sent

- [ ] **Account Lockout**
  - [ ] Brute force protection: lock after 5 failed attempts
  - [ ] Lockout duration: 15-30 minutes
  - [ ] Admin unlock available
  - [ ] Lockout logged

---

## OWASP A08: Software & Data Integrity Failures

**Goal:** Ensure code and data hasn't been tampered with.

- [ ] **Code Integrity**
  - [ ] Git commits signed with GPG
  - [ ] PR reviews required before merge (no force push to main)
  - [ ] CI/CD pipeline protected (can't skip security checks)
  - [ ] Artifacts signed (container images, binaries)

- [ ] **Data Integrity**
  - [ ] Database transactions ensure consistency
  - [ ] Checksums/hashes verify data not corrupted
  - [ ] Audit logs immutable (tamper detection)
  - [ ] Backups verified (restore tested)

- [ ] **Third-Party Updates**
  - [ ] Updates only from official sources
  - [ ] GPG/signature verification enabled
  - [ ] No auto-update without verification

---

## OWASP A09: Logging & Monitoring Failures

**Goal:** Detect and respond to security incidents.

- [ ] **Audit Logging**
  - [ ] Login attempts logged (success & failure)
  - [ ] Admin actions logged (user creation, role changes, deletes)
  - [ ] Sensitive data access logged (payment info, PII)
  - [ ] Failed authorization logged
  - [ ] Configuration changes logged

- [ ] **Log Content**
  - [ ] Sufficient detail to investigate incidents
  - [ ] No passwords, API keys, PII in logs
  - [ ] Timestamp, user ID, action, result, IP address included

- [ ] **Log Retention**
  - [ ] Retention: 90 days minimum (1+ year for compliance)
  - [ ] Immutable: can't delete/modify historical logs
  - [ ] Centralized: logs aggregated from all services

- [ ] **Monitoring & Alerting**
  - [ ] Failed login spikes trigger alerts
  - [ ] Admin action spikes trigger alerts
  - [ ] Unusual access patterns detected
  - [ ] Alerts reach security team < 5 minutes

- [ ] **Incident Response**
  - [ ] Response plan documented (see incident-response.md)
  - [ ] On-call rotation configured
  - [ ] Incident severity levels defined
  - [ ] Post-mortems conducted (within 48h)

---

## OWASP A10: Server-Side Request Forgery (SSRF)

**Goal:** Prevent attackers from making server perform requests to internal systems.

- [ ] **URL Validation**
  - [ ] URL destination validated against whitelist (if possible)
  - [ ] Internal IP ranges blocked (10.0.0.0/8, 192.168.0.0/16, 127.0.0.1, 169.254.0.0/16)
  - [ ] Scheme validated (only http/https, not file://, gopher://, etc.)

- [ ] **Network Isolation**
  - [ ] Services in DMZ can't access internal services
  - [ ] Egress filtering: outbound to internal IPs blocked
  - [ ] VPC security groups configured

- [ ] **Redirects**
  - [ ] Redirects validated against whitelist
  - [ ] No arbitrary redirects to attacker-controlled URLs

---

## Cross-Cutting Security Concerns

### Compliance

- [ ] **GDPR (EU/EEA residents)**
  - [ ] Data processing agreement (DPA) in place
  - [ ] Right to deletion implemented ("right to be forgotten")
  - [ ] Data portability (user can export data)
  - [ ] Privacy notice visible

- [ ] **LGPD (Brazil)**
  - [ ] Consent collected for data processing
  - [ ] Data breach notification plan (within 72h)
  - [ ] DPA in place
  - [ ] Data minimization enforced

- [ ] **PCI-DSS (Payment Card Data)**
  - [ ] Credit card data never stored (use tokenization)
  - [ ] Secure transmission (TLS)
  - [ ] Annual penetration testing required
  - [ ] Vendor management (if using payment processor)

- [ ] **HIPAA (Healthcare data)**
  - [ ] PHI encryption at rest & in transit
  - [ ] Audit logs immutable
  - [ ] Business Associate Agreement (BAA) in place

### Secrets Management

- [ ] **No Secrets in Code**
  - [ ] No API keys, passwords, certificates in Git
  - [ ] Secrets scanning enabled (GitGuardian, TruffleHog)
  - [ ] Accidental commits detected & revoked

- [ ] **Secrets Storage**
  - [ ] AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault
  - [ ] Fine-grained access control (least privilege)
  - [ ] Automatic rotation enabled
  - [ ] Access audit-logged

### Infrastructure Security

- [ ] **Network**
  - [ ] Firewall rules configured (default deny, whitelist allow)
  - [ ] DDoS protection (CloudFlare, AWS Shield)
  - [ ] WAF (Web Application Firewall) enabled
  - [ ] VPN/bastion host for admin access

- [ ] **Host/Container**
  - [ ] Vulnerability scanning enabled (container images, VMs)
  - [ ] Least privilege: services run as non-root
  - [ ] Immutable infrastructure (don't patch running containers)
  - [ ] Automated patching enabled

- [ ] **Access Control**
  - [ ] RBAC enforced (who can access what)
  - [ ] MFA required for admin access
  - [ ] SSH key management (no password SSH)
  - [ ] Access logs audited regularly

---

## Security Testing

- [ ] **SAST (Static Analysis)**
  - [ ] Semgrep or SonarQube scanning code
  - [ ] Critical/high findings remediated
  - [ ] False positives documented

- [ ] **DAST (Dynamic Analysis)**
  - [ ] Burp Suite or OWASP ZAP scanning running app
  - [ ] Findings prioritized & tracked
  - [ ] Retested after fixes

- [ ] **Penetration Testing**
  - [ ] Annual penetration test by external firm (if critical app)
  - [ ] Scope: external network, internal network, physical security
  - [ ] Findings tracked and remediated

- [ ] **Manual Review**
  - [ ] Code review includes security focus
  - [ ] Threat model reviewed with changes
  - [ ] Security runbook updated

---

## Sign-Off

- [ ] **Security Review Complete** ✅
- [ ] **Critical/High findings:** [Count]
- [ ] **Medium findings:** [Count]
- [ ] **Low findings:** [Count]
- [ ] **Decision:**
  - [ ] **APPROVE** — Can proceed to production
  - [ ] **CONDITIONAL** — Approve with critical findings remediated within [timeline]
  - [ ] **REJECT** — Do not deploy, critical security issues require redesign

**Reviewer:** [Security Lead]  
**Date:** [YYYY-MM-DD]  
**Duration:** [Hours]  
**Next Audit:** [Date, typically 6-12 months]
