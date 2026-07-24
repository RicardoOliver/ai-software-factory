# Code Review Checklist — 8-Dimension Framework

**Duration:** 15-30 minutes per PR  
**Owners:** PR Reviewer, Code Reviewer  
**Reference Agents:** `/pr-reviewer`, `/code-reviewer`

---

## Overview

This checklist standardizes code reviews across 8 dimensions, ensuring consistent quality, security, and maintainability. Each dimension has specific criteria and scoring.

---

## Dimension 1: Context & Scope (5 min)

**Goal:** Understand the PR purpose and verify it addresses the requirements.

### Checks
- [ ] **PR Title & Description Clear**
  - Title follows pattern: `[TYPE] Descriptive title` (feat, fix, refactor, docs)
  - Description explains: what, why, how
  - Related issues/tickets linked in description

- [ ] **Requirements Understood**
  - Feature requirements met (acceptance criteria in linked ticket)
  - Bug fix addresses root cause (not symptom)
  - Refactoring improves measurable metric (complexity, performance, readability)

- [ ] **Scope is Reasonable**
  - Single responsibility: One feature/fix per PR (prefer multiple smaller PRs)
  - No scope creep: Unrelated changes (typos, formatting) in separate PR
  - Size acceptable: < 400 lines of code (flag > 600 lines for discussion)

- [ ] **Dependencies Clear**
  - Other PRs or external systems this depends on are documented
  - Database migrations sequenced correctly
  - New environment variables documented

### Scoring
- ✅ All clear: **PASS**
- ⚠️ Minor clarification needed: **REQUEST CHANGES** (non-blocking)
- ❌ Unclear scope or concerning changes: **REQUEST CHANGES** (blocking)

---

## Dimension 2: Design & Architecture (10 min)

**Goal:** Verify design aligns with system architecture and best practices.

### Checks
- [ ] **Architectural Alignment**
  - Follows established patterns (MVC, Hexagonal, DDD, etc.)
  - Fits existing system layers (API → Service → Repository)
  - No architectural shortcuts (tight coupling, circular dependencies)

- [ ] **Design Patterns Applied**
  - Factory/Builder for complex object creation
  - Strategy for swappable behavior
  - Observer/Event for loose coupling
  - Dependency Injection for testability

- [ ] **Consistency with Codebase**
  - Naming conventions followed
  - Folder structure respected
  - Framework conventions followed (React hooks, Django models, etc.)

- [ ] **Modularity & Reusability**
  - Code can be tested in isolation
  - No premature abstractions (YAGNI)
  - Shared logic extracted to utilities/libraries
  - Duplication minimized (DRY principle)

- [ ] **Performance Considered**
  - Database queries optimized (no N+1)
  - Unnecessary loops/iterations eliminated
  - Caching strategy (if applicable)
  - No blocking operations on critical paths

### Scoring
- ✅ Design is sound: **PASS**
- ⚠️ Minor design improvements: **REQUEST CHANGES** (non-blocking)
- ❌ Architectural concerns: **REQUEST CHANGES** (blocking)

---

## Dimension 3: Correctness (10 min)

**Goal:** Verify logic is correct and handles edge cases.

### Checks
- [ ] **Logic Correctness**
  - Algorithm implementation matches specification
  - Math/calculations verified (especially financial, statistical)
  - State transitions valid (state machine logic)
  - No infinite loops or recursion issues

- [ ] **Edge Cases Handled**
  - Null/undefined values handled
  - Empty collections handled
  - Boundary conditions tested (min/max values, first/last items)
  - Error scenarios handled gracefully

- [ ] **Error Handling**
  - Try-catch blocks appropriate (not swallowing errors silently)
  - User-facing errors have helpful messages
  - Errors logged with context (request ID, user ID, stack trace)
  - Graceful degradation where applicable

- [ ] **Data Integrity**
  - Database transactions used for multi-step operations
  - Concurrent updates handled (optimistic locking, etc.)
  - Deleted/archived data handled correctly
  - Cascading deletes verified if applicable

### Scoring
- ✅ Logic is correct, edge cases handled: **PASS**
- ⚠️ Minor edge cases or improvements: **REQUEST CHANGES** (non-blocking)
- ❌ Logical errors or missing edge cases: **REQUEST CHANGES** (blocking)

---

## Dimension 4: Security (10 min)

**Goal:** Identify potential security vulnerabilities.

### Checks
- [ ] **Authentication & Authorization**
  - User identity verified before sensitive operations
  - Permissions checked (role-based, attribute-based)
  - No hardcoded credentials or API keys
  - Token expiration/refresh handled correctly

- [ ] **Input Validation**
  - User inputs validated (type, length, format)
  - No SQL injection (parameterized queries used)
  - No XSS (output encoding/escaping)
  - No command injection (shell escaping)

- [ ] **Data Protection**
  - Sensitive data encrypted in transit (HTTPS/TLS)
  - Sensitive data encrypted at rest (if stored)
  - PII/passwords never logged
  - Secrets (API keys) in environment variables, not code

- [ ] **OWASP Top 10 Compliance**
  - A01: Broken Access Control — authorization verified
  - A02: Cryptographic Failures — encryption used correctly
  - A03: Injection — parameterized queries, input validation
  - A04: Insecure Design — threat model considered
  - A05: Security Misconfiguration — secure defaults used
  - A06: Vulnerable Components — dependencies up-to-date
  - A07: Identification & Authentication Failures — MFA, strong passwords
  - A08: Software & Data Integrity Failures — signed artifacts
  - A09: Logging & Monitoring Failures — security events logged
  - A10: SSRF — external URL validation

### Scoring
- ✅ No security issues: **PASS**
- ⚠️ Minor security improvements: **REQUEST CHANGES** (non-blocking)
- ❌ Security vulnerabilities: **REQUEST CHANGES** (blocking, escalate to security team)

---

## Dimension 5: Tests (5 min)

**Goal:** Verify test coverage and quality.

### Checks
- [ ] **Test Coverage**
  - New code has unit tests (aim for > 80%)
  - Integration tests for API endpoints
  - Happy path and error scenarios covered
  - Critical business logic tested

- [ ] **Test Quality**
  - Tests are specific (one assertion per test where possible)
  - Tests have clear, descriptive names (what/given/when/then)
  - Tests use fixtures/mocks appropriately (don't call real APIs)
  - Tests are deterministic (no flakiness)

- [ ] **Test Maintenance**
  - Tests updated when behavior changes
  - No skipped/commented-out tests (xdescribe, @Ignore, pytest.skip)
  - Tests don't duplicate functionality (avoid redundant testing)

### Scoring
- ✅ Good coverage, quality tests: **PASS**
- ⚠️ Coverage acceptable but could improve: **REQUEST CHANGES** (non-blocking)
- ❌ Insufficient tests or low quality: **REQUEST CHANGES** (blocking)

---

## Dimension 6: Maintainability (5 min)

**Goal:** Ensure code is readable and maintainable.

### Checks
- [ ] **Readability**
  - Variable/function names are clear and descriptive
  - No ambiguous abbreviations (use `user_id` not `uid`)
  - Complex logic has comments explaining *why* (not *what*)
  - Code formatted consistently

- [ ] **Complexity**
  - Functions/methods short (< 50 lines preferred)
  - Cyclomatic complexity < 10
  - No deep nesting (> 3 levels)
  - Deeply nested conditions extracted to helper functions

- [ ] **Documentation**
  - Public APIs have docstrings (parameters, return values, exceptions)
  - Complex algorithms explained
  - Config options documented
  - Breaking changes (if any) documented with migration path

- [ ] **No Technical Debt**
  - TODO comments have issue references (otherwise fix now)
  - Deprecated APIs not used in new code
  - No known bugs left unfixed
  - Dead code removed

### Scoring
- ✅ Code is maintainable: **PASS**
- ⚠️ Minor readability improvements: **REQUEST CHANGES** (non-blocking)
- ❌ Poor readability, high complexity: **REQUEST CHANGES** (blocking)

---

## Dimension 7: Performance (5 min)

**Goal:** Identify potential performance regressions.

### Checks
- [ ] **Algorithmic Efficiency**
  - Appropriate data structures used (HashMap vs Array, etc.)
  - Algorithm complexity acceptable for expected data size
  - No accidental quadratic algorithms (nested loops over same data)
  - Sorting/searching algorithms optimized

- [ ] **Database Queries**
  - No N+1 queries (use JOIN or batch loading)
  - Queries use indexes
  - EXPLAIN ANALYZE reviewed for slow queries
  - Pagination used for large result sets

- [ ] **Memory & Resource Usage**
  - No memory leaks (especially in Node.js/Python)
  - Large data structures disposed properly
  - Connection pools configured
  - Timeouts set on external API calls

- [ ] **Benchmarks**
  - Performance regression test added (if applicable)
  - Baseline metrics recorded
  - Expected impact estimated (e.g., "10ms per request")

### Scoring
- ✅ No performance concerns: **PASS**
- ⚠️ Minor optimization opportunities: **REQUEST CHANGES** (non-blocking)
- ❌ Performance regression likely: **REQUEST CHANGES** (blocking)

---

## Dimension 8: Breaking Changes (5 min)

**Goal:** Identify and document breaking changes.

### Checks
- [ ] **API Changes**
  - Endpoint removed/changed: Documented in CHANGELOG
  - Request/response format changed: Migration guide provided
  - Deprecated endpoints: Timeline for removal documented
  - Backwards compatibility maintained (if possible)

- [ ] **Database Schema Changes**
  - Column removed/renamed: Data migration provided
  - Type changed: Compatibility checked
  - Constraints added: Existing data validated
  - New required columns: Default values or migration logic provided

- [ ] **Dependency Changes**
  - Major version bump: Changelog reviewed for breaking changes
  - New dependency: License compatibility checked, security audit done
  - Removed dependency: Dependent code updated

- [ ] **Configuration Changes**
  - New required environment variables: Documented
  - Config format changed: Migration path provided
  - Secrets rotation needed: Procedure documented

### Scoring
- ✅ No breaking changes or well documented: **PASS**
- ⚠️ Minor breaking changes, migration path provided: **REQUEST CHANGES** (non-blocking)
- ❌ Major breaking changes, no migration path: **REQUEST CHANGES** (blocking)

---

## Summary

| Dimension | Status | Comments |
|-----------|--------|----------|
| 1. Context & Scope | ⭕ | [Required] |
| 2. Design & Architecture | ⭕ | [Required] |
| 3. Correctness | ⭕ | [Required] |
| 4. Security | ⭕ | [Required] |
| 5. Tests | ⭕ | [Required] |
| 6. Maintainability | ⭕ | [Required] |
| 7. Performance | ⭕ | [Optional] |
| 8. Breaking Changes | ⭕ | [Optional] |

---

## Final Decision

- [ ] **APPROVE** — All dimensions pass, PR ready to merge
- [ ] **REQUEST CHANGES** — Issues found, please address before merge
- [ ] **COMMENT** — Informational only, no changes required

---

## Reviewer Sign-Off

**Reviewer:** [Name]  
**Date:** [YYYY-MM-DD]  
**Time Spent:** [Minutes]  
**Overall Assessment:** [Brief summary]

---

## Tips for Reviewers

1. **Be Constructive** — Suggest improvements, don't just criticize
2. **Explain Why** — Reference design patterns, best practices, policies
3. **Prioritize Issues** — Flag blocking issues first, non-blocking later
4. **Ask Questions** — If unclear, ask author to clarify rather than assume
5. **Approve Good Code** — Don't hold PRs for minor preferences (be pragmatic)
6. **Respect Expertise** — Author may have context you don't have
7. **Review Promptly** — Slow reviews block progress (aim for < 4 hours)
8. **Check Tests** — Pay special attention to test quality (tests are documentation)
