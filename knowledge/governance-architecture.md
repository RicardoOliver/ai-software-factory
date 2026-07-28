# Arquitetura de Governanca Executavel

## Objetivo

Garantir consistencia estrutural entre catalogos de agentes, prompts, checklists, skills e documentacao, com validacao automatica local e em CI.

## Componentes

1. Inventory Checker
- Arquivo: `tools/governance/check-inventory.mjs`
- Funcao: comparar estado atual com `config/inventory-baseline.json`

2. Frontmatter Checker
- Arquivo: `tools/governance/check-frontmatter.mjs`
- Funcao: validar frontmatter em prompts e templates de agents

3. Parity Checker
- Arquivo: `tools/governance/check-parity.mjs`
- Funcao: verificar paridade agent -> prompt com excecoes em allowlist

4. Links Checker
- Arquivo: `tools/governance/check-links.mjs`
- Funcao: validar links internos em documentos estrategicos

5. Governance Runner
- Arquivo: `tools/governance/run-governance.mjs`
- Funcao: orquestrar todos os checks com fail fast

6. CI Gate
- Arquivo: `.github/workflows/governance-quality.yml`
- Funcao: executar governanca em push e PR

7. Dashboard KPI Sync
- Arquivo: `tools/governance/sync-dashboard-governance.mjs`
- Funcao: manter KPIs de governanca sincronizados no `DASHBOARD.md`

8. PR Governance Reporter
- Arquivo: `tools/governance/build-pr-comment.mjs`
- Funcao: publicar status consolidado dos checks em PR
- Observabilidade: inclui saude por package manager (pass/fail/skip/erro de execucao)
- Sinal de risco: destaca gates de regressao de confiabilidade por manager

9. Dependency Baseline Policy
- Arquivo: `tools/governance/config/dependency-severity-baseline.json`
- Funcao: definir severidade minima bloqueante por branch e por dominio
- Observacao: dominios opcionais podem ser ignorados sem quebrar o pipeline quando nao ha lockfile

10. Dependency Audit Runner
- Arquivo: `tools/governance/run-dependency-audit.mjs`
- Funcao: executar auditoria de dependencias por dominio e aplicar policy de branch
- Compatibilidade: suporte real para `npm`, `pnpm` e `yarn` com fallback explicito de erro de execucao
- Cobertura continua: dominios fixture (`pnpm` e `yarn`) mantem verificacao ativa em pipeline
- Telemetria: gera resumo agregado por package manager para dashboard e PR
- Policy avancada: gates configuraveis por package manager (min-executed e max-exec-errors)
- Policy de tendencia: gate configuravel para regressao de confiabilidade (delta 7d vs 30d)
- Policy versionada: regras de gate podem ser definidas por branch em `config/package-manager-gates.json`

11. History Snapshot Engine
- Arquivo: `tools/governance/snapshot-governance-history.mjs`
- Funcao: persistir snapshots e calcular pass-rate historico (7d e 30d)
- Retencao: rotacao automatica por limite de entradas
- Armazenamento: arquivos rotacionados comprimidos (`.bak.gz`) e retidos por janela de dias
- Retencao adicional: limite de tamanho total em disco com poda incremental
- Analytics: consolida confiabilidade por package manager em janelas all-time/7d/30d

12. External History Exporter
- Arquivo: `tools/governance/export-governance-history.mjs`
- Funcao: exportar resumo e amostras historicas para endpoint externo
- Resiliencia: timeout configuravel e retries com backoff exponencial
- Integridade: idempotency key e assinatura HMAC opcional

13. Domain Discovery Assistant
- Arquivo: `tools/governance/scan-audit-domains.mjs`
- Funcao: detectar novos roots com lockfile e sugerir dominios auditaveis

14. Export Contract Tester
- Arquivo: `tools/governance/tests-export-contract.mjs`
- Funcao: validar contrato de export (idempotency e assinatura) em dry-run no CI

15. Export HTTP Integration Tester
- Arquivo: `tools/governance/tests-export-http-integration.mjs`
- Funcao: validar cenarios de retry em falha transiente e enforcement do ACK em endpoint local
- Resiliencia adicional: valida retry por timeout com recuperacao na tentativa seguinte

## Fluxo

1. Desenvolvedor altera catalogo/documentacao
2. Executa `node tools/governance/run-governance.mjs`
3. Corrige inconsistencias locais
4. Abre PR
5. CI executa gate de governanca
6. CI valida sincronizacao de KPIs no dashboard
7. CI publica comentario de status no PR
8. CI executa audit de dependencias com baseline por branch
9. CI grava snapshot historico de governanca
10. Merge apenas se todos os checks passarem

## Trade-offs

- Pro: reduz drift e aumenta confiabilidade documental
- Pro: cria base para automacao enterprise
- Contra: adiciona tempo no ciclo de PR
- Contra: exige manutencao de baseline e allowlist
