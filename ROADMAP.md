# Roadmap de Execucao Tecnica

Este roadmap foi atualizado para iniciar pelo menor risco e ampliar para capacidades enterprise.

## Fase 1 (0-30 dias) - Fundacao de Governanca

- Governanca executavel em PR e main
- Baselines de inventario e paridade versionados
- Bloqueio de merge para inconsistencias estruturais
- Baseline de severidade de dependencias por branch
- Comentario automatico de governanca em PR

Entregas:
- `.github/workflows/governance-quality.yml`
- `tools/governance/*`
- Atualizacoes em README, USAGE e DASHBOARD

## Fase 2 (30-90 dias) - Seguranca e Confiabilidade

- Hardening do backend de referencia
- Gates de seguranca em release
- Checklists YAML com execucao parcial automatica

## Fase 3 (90-180 dias) - Observabilidade e Analytics

- KPIs operacionais de uso por prompt
- Tempo medio por workflow multi-agent
- Taxa de retrabalho por tipo de tarefa
- Snapshot diario de governanca com pass-rate historico
- Tendencia 7d e 30d no comentario de PR
- Export opcional do historico para endpoint externo
- Retry/timeout no export externo para resiliencia operacional
- Rollout incremental de dominios de dependency audit (dominios opcionais)
- Idempotency key e assinatura HMAC no export externo
- Rotacao automatica do historico JSONL
- Assistente de descoberta de novos dominios auditaveis
- Teste automatizado de contrato de export (dry-run)
- Rotacao com compressao e retencao temporal de arquivos historicos
- Execucao real de dependency audit para dominios pnpm e yarn
- Retencao de historico com limite total de tamanho em disco
- Teste de integracao HTTP do export com cenarios de falha, retry e ACK
- Cobertura continua de audit multi-manager com dominios fixture pnpm/yarn
- Setup deterministico de pnpm/yarn no CI para execucao previsivel
- Validacao de retry por timeout no fluxo de export externo
- KPI de saude por package manager publicado em dashboard e comentario de PR
- Gate configuravel por package manager (minimo de execucao e maximo de erros)
- Tendencia historica de confiabilidade por package manager (all-time/7d/30d)
- Gate de regressao de confiabilidade por package manager (delta 7d vs 30d)
- Policy de gates por package manager com configuracao por branch (develop/staging/main)

## Fase 4 (180+ dias) - Open Core e Verticalizacao

- Linha OSS e Enterprise formalizada
- Packs verticais (Financas e Saude)
- Evidencias de compliance por release
