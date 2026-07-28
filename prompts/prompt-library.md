# Prompts: Biblioteca da AI Software Factory

Prompts reutilizáveis para tarefas comuns de desenvolvimento de software.

---

## Análise e Requisitos

### Analisar Feature e Decompor
```
Analise a seguinte feature e decomponha em:
1. User stories com critérios de aceitação (formato BDD)
2. Requisitos não funcionais implícitos
3. Riscos técnicos e de negócio
4. Dependências com outros sistemas
5. Estimativa de complexidade (P/M/G)

Feature: [DESCREVER AQUI]
Contexto do sistema: [STACK E ARQUITETURA]
```

### Levantar Requisitos Implícitos
```
Para a seguinte user story, identifique:
1. Requisitos não funcionais implícitos (segurança, performance, acessibilidade)
2. Edge cases não cobertos pelos critérios de aceitação
3. Impactos em outras funcionalidades do sistema
4. Regras de negócio que precisam ser confirmadas

User story: [DESCREVER AQUI]
```

---

## Arquitetura

### Revisar Arquitetura
```
Analise a seguinte arquitetura e forneça:
1. Pontos fortes
2. Riscos e vulnerabilidades arquiteturais
3. Sugestões de melhoria com justificativa
4. ADRs recomendados para as principais decisões
5. Alternativas não consideradas que merecem análise

Arquitetura atual: [DESCREVER OU COLAR DIAGRAMA]
Requisitos principais: [SLAs, volume, restrições]
```

### Criar ADR
```
Crie um Architecture Decision Record (ADR) para a seguinte decisão:
[DECISÃO A DOCUMENTAR]

Contexto: [POR QUE ESSA DECISÃO FOI NECESSÁRIA]
Opções consideradas: [LISTA DAS ALTERNATIVAS]
Decisão tomada: [O QUE FOI ESCOLHIDO]

Use o template em templates/adr.md
```

---

## Desenvolvimento

### Implementar Feature
```
Implemente a seguinte feature seguindo as convenções do projeto:
[DESCRIÇÃO DA FEATURE]

Requisitos técnicos:
- Stack: [LINGUAGEM/FRAMEWORK]
- Seguir padrões em knowledge/conventions.md
- Incluir testes unitários
- Incluir validação de input
- Incluir tratamento de erros
- Documentar com JSDoc/docstring nos pontos públicos

Critérios de aceitação: [LISTA]
```

### Revisar Código
```
Revise o seguinte código com foco em:
1. Segurança (OWASP Top 10)
2. Princípios SOLID
3. Performance e possíveis gargalos
4. Testabilidade
5. Legibilidade e manutenibilidade

Classifique cada issue como: 🔴 Bloqueante | 🟡 Sugestão | 🟢 Elogio

Código a revisar:
[COLAR CÓDIGO AQUI]
```

---

## Testes

### Criar Testes Playwright
```
Crie testes Playwright E2E para o seguinte fluxo:
[DESCREVER O FLUXO]

Requisitos:
- Page Object Model obrigatório
- Fixtures para autenticação
- Locators usando getByRole/getByTestId (sem CSS frágeis)
- Sem waitForTimeout (usar waitForResponse ou waitForSelector)
- Cobrir: happy path + cenários de erro + edge cases principais
- Gerar screenshots em falha
- Parametrizado para múltiplos browsers

Ambiente: [URL base, credenciais de teste]
```

### Criar Testes de API
```
Crie testes de API para os seguintes endpoints:
[DOCUMENTAÇÃO DOS ENDPOINTS OU OPENAPI]

Cobrir:
- Happy path com dados válidos
- Todos os códigos de erro possíveis (400, 401, 403, 404, 422, 500)
- Validação de schema da resposta
- Autenticação e autorização
- Paginação e filtros
- Edge cases de input

Framework: [Jest/Supertest | Playwright | pytest | etc.]
```

### Diagnosticar Teste Flaky
```
Este teste está falhando de forma intermitente. Diagnostique a causa raiz e forneça correção:

Teste: [CÓDIGO DO TESTE]
Log de falha: [MENSAGEM DE ERRO]
Frequência: [X% das execuções]
Ambiente: [CI/CD | Local | Ambos]

Siga o processo do agente flaky-test-detective.md
```

---

## Segurança

### Security Review
```
Faça uma revisão de segurança completa do seguinte código:
[CÓDIGO A REVISAR]

Verificar:
- OWASP Top 10 completo
- Autenticação e autorização
- Validação e sanitização de inputs
- Gestão de segredos
- Headers de segurança
- Rate limiting
- Logs seguros

Gerar relatório no formato do agente security.md
```

---

## Documentação

### Gerar README
```
Gere um README completo para o seguinte serviço/projeto:

Nome: [NOME]
Descrição: [O QUE FAZ]
Stack: [TECNOLOGIAS USADAS]
Endpoints principais: [LISTA]
Variáveis de ambiente: [LISTA]

Use o template em templates/readme.md
```

### Gerar Changelog
```
Gere um changelog para a seguinte release baseado nos commits:

Versão: [X.Y.Z]
Commits: [LISTA DE COMMITS OU git log --oneline]
Público-alvo: [técnico | executivo | usuário final]

Use o formato Keep a Changelog
```

---

## Infraestrutura

### Criar Pipeline GitHub Actions
```
Crie um pipeline GitHub Actions completo para:
[DESCREVER O PROJETO E STACK]

Incluir:
- Lint e type check
- Testes unitários com cobertura
- Scan de segurança (Trivy/Snyk)
- Build de Docker image
- Deploy para [staging/produção]
- Notificação em caso de falha

Gatilho: [PR | Push para main | Tag]
```

### Criar Docker Compose
```
Crie um docker-compose.yml para desenvolvimento local do seguinte projeto:

Serviços necessários: [lista]
Stack: [tecnologias]

Incluir:
- Health checks
- Volumes para persistência
- Rede isolada
- Variáveis de ambiente via .env
- Hot-reload para desenvolvimento
```

---

## Governança

Prompt principal desta linha:
- `prompts/principal-conselho-permanente-engenharia.md`

### Auditar Governança do Repositório
```
Execute uma auditoria de governanca no repositorio com foco em:
1. Divergencias de inventario (agents/prompts/checklists/skills/workflows)
2. Paridade agent -> prompt e excecoes nao justificadas
3. Integridade de links da documentacao principal
4. Frontmatter obrigatorio ausente em prompts/templates

No final:
- liste falhas bloqueantes
- proponha correcoes com menor risco primeiro
- apresente diff sugerido por arquivo
```

### Atualizar Baseline de Inventário
```
Analise o estado atual do repositorio e atualize o baseline de inventario.

Regras:
- nao mudar baseline sem justificar cada diferenca
- se houver alteracao estrutural, atualizar dashboard e readme
- gerar resumo com antes/depois

Arquivo-alvo: tools/governance/config/inventory-baseline.json
```

### Revisar Baseline de Dependencias por Branch
```
Revise a policy de severidade por branch e proponha ajustes com foco em risco.

Entradas:
- tools/governance/config/dependency-severity-baseline.json
- ultimo relatorio: tools/governance/latest-dependency-report.json

Saida esperada:
1. Risco atual por branch
2. Se a severidade minima esta adequada
3. Impacto de apertar/afrouxar threshold
4. Plano de rollout seguro por ambiente
```

### Analisar Tendencia de Governanca (7d/30d)
```
Use os artefatos de historico para diagnosticar degradacao de qualidade:

Entradas:
- tools/governance/history/governance-history-summary.json
- tools/governance/latest-report.json
- tools/governance/latest-dependency-report.json

Saida esperada:
1. Diagnostico de tendencia 7d e 30d
2. Principais causas de falha recorrente
3. Acoes corretivas de baixo risco
4. Ajustes recomendados no baseline por dominio
```

### Ajustar Resiliencia de Export Externo
```
Revise configuracao de export externo de historico de governanca e proponha tuning.

Parametros:
- GOVERNANCE_EXPORT_TIMEOUT_MS
- GOVERNANCE_EXPORT_RETRIES

Saida esperada:
1. Timeout recomendado por ambiente
2. Numero de retries por criticidade
3. Trade-off entre latencia e confiabilidade
4. Plano de rollout sem impacto no pipeline principal
```

### Revisar Descoberta de Dominios Auditaveis
```
Use o relatorio de descoberta para propor onboarding de novos dominios de dependency audit.

Entradas:
- tools/governance/domain-discovery-report.json
- tools/governance/config/dependency-severity-baseline.json

Saida esperada:
1. Dominios candidatos priorizados por risco
2. Sugestao de threshold inicial por branch
3. Plano incremental de ativacao sem falso positivo
4. Checklist de validacao para promover de opcional para obrigatorio
```

### Validar Cobertura Multi-Manager com Dominios Fixture
```
Revise se os dominios fixture de dependency audit estao cobrindo package managers secundarios.

Entradas:
- tools/governance/config/dependency-severity-baseline.json
- tools/governance/latest-dependency-report.json

Saida esperada:
1. Status de execucao por package manager (npm, pnpm, yarn)
2. Falhas de execucao por toolchain ausente ou lockfile invalido
3. Recomendacoes de hardening no workflow para previsibilidade
4. Criterios para converter fixture opcional em dominio obrigatorio
```

### Revisar KPI de Saude por Package Manager
```
Analise os KPIs de package manager no dashboard e comentario de PR para detectar regressao.

Entradas:
- tools/governance/latest-dependency-report.json
- tools/governance/latest-pr-comment.md
- DASHBOARD.md

Saida esperada:
1. Managers com queda de cobertura (pass/skip/erro)
2. Causas provaveis (lockfile, toolchain, workflow)
3. Acoes corretivas de menor risco
4. Gate recomendado para evitar recorrencia
```

### Calibrar Gates por Package Manager
```
Proponha valores seguros para gates por package manager no pipeline de governanca.

Entradas:
- tools/governance/latest-dependency-report.json
- tools/governance/history/governance-history-summary.json
- ambiente alvo (dev/staging/main)

Parametros de saida:
- GOVERNANCE_PM_MIN_EXECUTED
- GOVERNANCE_PM_MAX_EXEC_ERRORS

Saida esperada:
1. Valores recomendados por ambiente
2. Justificativa por manager (npm/pnpm/yarn)
3. Risco de falso positivo por configuracao
4. Plano de rollout incremental com rollback
```

### Calibrar Gate de Regressao de Confiabilidade
```
Defina limiares de regressao por package manager comparando confiabilidade 7d vs 30d.

Entradas:
- tools/governance/history/governance-history-summary.json
- tools/governance/latest-dependency-report.json

Parametros de saida:
- GOVERNANCE_PM_MAX_RELIABILITY_DROP_PP
- GOVERNANCE_PM_MIN_TREND_RUNS

Saida esperada:
1. Limiar de queda (pp) por manager e justificativa
2. Minimo de runs por janela para evitar ruido
3. Plano de ativacao por ambiente
4. Criterios objetivos de rollback
```

### Revisar Policy de Gates por Branch
```
Revise e proponha ajustes para a policy versionada de gates por branch.

Entradas:
- tools/governance/config/package-manager-gates.json
- tools/governance/latest-dependency-report.json

Saida esperada:
1. Divergencias entre develop/staging/main
2. Ajuste de rigor por ambiente
3. Riscos de falso positivo e falso negativo
4. Proposta final com justificativa tecnica
```

### Validar Export Assinado e Idempotente
```
Revise o fluxo de export de historico para garantir:
1. Idempotency key consistente por payload
2. Assinatura HMAC valida
3. Timeout e retries adequados por ambiente
4. Tratamento de falhas sem quebrar governanca local
```

### Validar Contrato de ACK do Endpoint
```
Avalie se o endpoint de persistencia externa atende o contrato esperado.

Regras de contrato (quando EXPECT_ACK=true):
- HTTP 2xx
- Content-Type: application/json
- body.accepted = true
- body.requestId = string nao vazia

Saida esperada:
1. Diagnostico de conformidade
2. Campos faltantes/inconsistentes
3. Plano de adequacao sem downtime
4. Testes de contrato recomendados
```

### Testar Resiliencia de Timeout e Retry no Export
```
Avalie se o fluxo de export externo se recupera de timeout sem gerar inconsistencias.

Parametros:
- GOVERNANCE_EXPORT_TIMEOUT_MS
- GOVERNANCE_EXPORT_RETRIES
- GOVERNANCE_EXPORT_BACKOFF_BASE_MS
- GOVERNANCE_EXPORT_BACKOFF_MAX_MS

Saida esperada:
1. Cenarios de timeout que devem acionar retry
2. Tuning de backoff por ambiente
3. Evidencias de idempotencia em repeticao de tentativa
4. Criterio de rollback da configuracao em caso de degradacao
```
