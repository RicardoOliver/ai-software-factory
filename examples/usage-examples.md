# Exemplos de Uso — AI Software Factory

Este documento mostra como usar a AI Software Factory no VS Code para tarefas comuns de desenvolvimento.

---

## Exemplo 1: Nova Feature Completa

**Cenário:** Adicionar endpoint de exportação de pedidos em CSV.

### Passo 1: Levantar Requisitos
```
Prompt no chat:
"Como Business Analyst, levante os requisitos para um endpoint de exportação 
de pedidos em CSV. O usuário deve poder filtrar por data e status."
→ Use /business-analyst no Copilot Chat
```

### Passo 2: Definir Arquitetura
```
"Como Solution Architect, avalie o impacto de adicionar exportação CSV 
assíncrona no sistema atual. Considere que exportações podem ter 100k+ linhas."
→ Use /solution-architect
```

### Passo 3: Implementar Backend
```
"Como Backend Engineer, implemente o endpoint GET /api/v1/pedidos/exportar 
que aceita filtros de data e status e retorna um arquivo CSV. 
Use jobs assíncronos (BullMQ) para exportações grandes."
→ Use /backend
```

### Passo 4: Criar Testes
```
"Como Playwright Specialist, crie testes E2E para o fluxo de exportação CSV:
1. Usuário seleciona filtros
2. Clica em exportar
3. Arquivo é baixado automaticamente"
→ Use /playwright
```

### Passo 5: Security Review
```
"Como Security QA, revise o endpoint de exportação CSV:
- Verificar autorização (usuário só exporta seus próprios dados)
- Verificar que não há injeção via filtros
- Verificar que dados sensíveis (CPF) estão mascarados no CSV"
→ Use /security
```

### Passo 6: Code Review
```
"Como Code Reviewer, revise o PR #234 do endpoint de exportação CSV."
→ Use /code-reviewer
```

---

## Exemplo 2: Investigação de Bug

**Cenário:** Pedidos de alguns usuários estão sendo duplicados.

```
Prompt:
"Como Bug Investigator, investigue este bug:
- Alguns pedidos aparecem duplicados no banco de dados
- Ocorre especialmente em horários de pico
- Stack trace: [colar aqui]
- Logs relevantes: [colar aqui]

Identifique a causa raiz e proponha correção com teste de regressão."
→ Use /bug-investigator
```

---

## Exemplo 3: Pipeline CI/CD

**Cenário:** Configurar pipeline completo para novo projeto Node.js.

```
"Como GitHub Actions Expert, crie um workflow CI/CD completo para:
- Node.js 20 + TypeScript
- Testes com Jest e Playwright
- Docker image publicada no GHCR
- Deploy automático para staging ao mergear na main
- Deploy para produção ao criar tag v*.*.*
- Security scanning obrigatório (Snyk, Trivy)"
→ Use /github-actions
```

---

## Exemplo 4: Arquitetura Microsserviços

**Cenário:** Decompor um monolito de e-commerce.

```
"Como Microservices Architect, analise o monolito de e-commerce e:
1. Identifique os bounded contexts naturais
2. Proponha a decomposição em microsserviços
3. Defina a estratégia de comunicação (sync/async)
4. Identifique os anti-patterns atuais
5. Proponha plano de migração incremental (Strangler Fig)"
→ Use /microservices-architect
```

---

## Exemplo 5: Performance Issue

**Cenário:** API de listagem está lenta (> 2 segundos).

```
Sequência de prompts:

1. "Como Bug Investigator, o endpoint GET /api/v1/produtos está com p95 > 2s.
   Query logs mostram isso: [colar EXPLAIN ANALYZE]"
→ /bug-investigator

2. "Como Performance Engineer, crie um script K6 para load test do endpoint 
   GET /api/v1/produtos com 100 usuários simultâneos por 5 minutos."
→ /performance

3. "Como PostgreSQL Specialist, analise esta query lenta e sugira otimizações:
   [colar query]"
→ (agente em agents/postgresql.md)
```

---

## Exemplo 6: Security Audit

**Cenário:** Auditoria completa antes de go-live.

```
"Como Security QA, faça uma auditoria de segurança completa do endpoint 
de autenticação:
[colar código da implementação]

Verificar OWASP Top 10, JWT security, rate limiting, brute force protection."
→ /security

"Como DevSecOps Engineer, configure o pipeline de segurança para este projeto:
- SAST com Semgrep
- Dependency scanning com Snyk
- Container scanning com Trivy
- Secret detection com Gitleaks"
→ /devsecops-engineer
```

---

## Dicas de Uso

### No VS Code Copilot Chat:
1. Use `/` para ver a lista de prompt files disponíveis
2. Digite o nome do agente após `/` para filtrar
3. Adicione contexto: `#codebase` para incluir o código atual

### Combinando Agentes:
```
Para tarefas complexas, o /orchestrator coordena automaticamente.
Para tarefas específicas, use o agente diretamente.

Exemplo de prompt ao Orchestrator:
"Preciso implementar autenticação com OAuth 2.0 + Google no nosso sistema.
Coordene: análise de requisitos, arquitetura, implementação, testes e documentação."
→ /orchestrator
```

### Referenciando Agentes em Contexto:
```
"Implemente seguindo as boas práticas do agente Backend Engineer 
(agents/backend.md) e inclua testes conforme padrões do SDET Principal 
(agents/sdet.md)"
```
