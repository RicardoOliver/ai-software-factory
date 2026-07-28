# Guia de Uso da Governanca (Tecnico e Leigo)

Este guia mostra como usar a governanca do projeto em dois niveis:
- Modo Leigo: para quem quer so validar se esta tudo certo.
- Modo Tecnico: para quem configura policy, thresholds e CI.

## 1. Para Leigos (passo a passo simples)

Objetivo: verificar rapidamente se o projeto esta saudavel.

### Passo 1: executar validacao completa

```bash
node tools/governance/run-governance.mjs
```

Se tudo estiver certo, voce vera mensagem de sucesso no final.

### Passo 2: gerar status de governanca

```bash
node tools/governance/run-dependency-audit.mjs
node tools/governance/snapshot-governance-history.mjs
node tools/governance/check-decisions-capacity.mjs
node tools/governance/evaluate-threshold-readiness.mjs
node tools/governance/build-pr-comment.mjs
```

### Passo 3: abrir os resultados principais

- Resumo de comentario para PR:
  - tools/governance/latest-pr-comment.md
- Resumo historico:
  - tools/governance/history/governance-history-summary.json
- Prontidao para congelar thresholds:
  - tools/governance/latest-threshold-readiness.json

### Como interpretar rapido

- Se aparecer PASSED: ok.
- Se aparecer FAIL: existe risco e precisa ajuste.
- Se recommendation for ready-to-freeze-thresholds: janela de observacao esta boa para congelar thresholds.

## 2. Para Tecnicos (operacao e configuracao)

Objetivo: ajustar politica, thresholds e comportamento de bloqueio por branch.

### Arquivos de politica

- tools/governance/config/package-manager-gates.json
  - gates de confiabilidade e trend por gerenciador.
- tools/governance/config/decisions-capacity-policy.json
  - failOnCritical por branch.
  - thresholds de capacidade (warn/high/critical) por branch.

### Precedencia de configuracao

- Fail on critical (capacidade):
  - policy.default -> policy.branches.<branch> -> GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL
- Thresholds de capacidade:
  - policy.default.capacityThresholds -> policy.branches.<branch>.capacityThresholds -> GOVERNANCE_DECISIONS_CAPACITY_*_PERCENT

### Variaveis principais de ambiente

- Gates e tendencia:
  - GOVERNANCE_PM_GATE_MODE
  - GOVERNANCE_PM_PROMOTE_AFTER_RUNS
  - GOVERNANCE_PM_MIN_EXECUTED
  - GOVERNANCE_PM_MAX_EXEC_ERRORS
  - GOVERNANCE_PM_MAX_RELIABILITY_DROP_PP
  - GOVERNANCE_PM_MIN_TREND_RUNS

- Retencao do historico:
  - GOVERNANCE_HISTORY_MAX_ENTRIES
  - GOVERNANCE_HISTORY_KEEP_ENTRIES
  - GOVERNANCE_HISTORY_ARCHIVE_MAX_DAYS
  - GOVERNANCE_HISTORY_MAX_BYTES
  - GOVERNANCE_HISTORY_MIN_KEEP_ENTRIES

- Retencao e capacidade de decisoes:
  - GOVERNANCE_DECISIONS_MAX_ENTRIES
  - GOVERNANCE_DECISIONS_KEEP_ENTRIES
  - GOVERNANCE_DECISIONS_ARCHIVE_MAX_DAYS
  - GOVERNANCE_DECISIONS_MAX_BYTES
  - GOVERNANCE_DECISIONS_MIN_KEEP_ENTRIES
  - GOVERNANCE_DECISIONS_CAPACITY_WARN_PERCENT
  - GOVERNANCE_DECISIONS_CAPACITY_HIGH_PERCENT
  - GOVERNANCE_DECISIONS_CAPACITY_CRITICAL_PERCENT
  - GOVERNANCE_DECISIONS_CAPACITY_FAIL_ON_CRITICAL

- Readiness para congelar thresholds:
  - GOVERNANCE_READINESS_MIN_RUNS
  - GOVERNANCE_READINESS_MIN_PASS_RATE
  - GOVERNANCE_READINESS_MAX_MANAGER_DELTA_PP

### Sequencia recomendada no CI

```bash
node tools/governance/run-governance.mjs
node tools/governance/run-dependency-audit.mjs
node tools/governance/tests-gate-policy-resolution.mjs
node tools/governance/tests-decisions-capacity-policy.mjs
node tools/governance/tests-decisions-capacity-thresholds.mjs
node tools/governance/snapshot-governance-history.mjs
node tools/governance/check-decisions-capacity.mjs
node tools/governance/evaluate-threshold-readiness.mjs
node tools/governance/build-pr-comment.mjs
```

## 3. Quando considerar pronto para producao

Checklist curto:
- run-governance sem falhas.
- check-decisions-capacity em PASS (ou WARN controlado fora de main).
- evaluate-threshold-readiness com ready=true.
- comentarios de PR sem risk signal critico.

## 4. Solucao rapida de problemas

- Erro de policy:
  - validar JSON em config/package-manager-gates.json e config/decisions-capacity-policy.json.
- Erro de capacidade critica:
  - reduzir retencao, aumentar limite, ou manter failOnCritical=false fora de main.
- Readiness nao pronto:
  - aumentar janela de observacao e reexecutar snapshot/readiness.

---

Se quiser uso minimo: execute apenas run-governance e abra latest-pr-comment.md.
