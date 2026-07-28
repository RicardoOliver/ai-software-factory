# Análise: Consolidação e Deduplicação de Agents

> Fruto da análise profunda de Ricardo Oliver sobre escopo inflado e falta de prova viva.

---

## 📊 Problema Identificado

**53 agents** mencionados como força, mas análise revela:
- Sobreposição conceitual significativa
- Muitos tocam o mesmo domínio (API design, por exemplo)
- Métrica de vaidade (quantidade) sem proporcional métrica de qualidade (teste de output)
- Impossível manter 53 agentes atualizados sozinho

**Exemplo de sobreposição:**

| Contexto | Agents Envolvidos | Problema |
|----------|------------------|----------|
| Design de API | Backend, Full-Stack, API Architect, GraphQL, Microservices Architect | 5 agents tocam o mesmo tópico; qual chamar? |
| Testes | QA Architect, SDET, Playwright, Cypress, Selenium, Contract Testing | 6 specialistas de teste; cobertura fragmentada |
| Infra/Deployment | DevOps, Kubernetes, Docker, GitHub Actions, AWS, Azure, Platform Engineer | 7 agents; precedência unclear |
| Observabilidade | Observability Engineer, Logging, Monitoring, Incident Investigator | 4 agents; não há pipeline claro |

---

## 🎯 Proposta: Consolidação em 20-25 Agents Núcleo

### Tier 1: Estratégia (4 agents)
- **Solution Architect** (design de sistemas)
- **Tech Lead** (roadmaps técnicos)
- **Product Manager** (requisitos)
- **Chief Architect** (decisões de longo prazo)

### Tier 2: Desenvolvimento (6 agents)
- **Backend Engineer** (Node/Python/Go/Java)
- **Frontend Engineer** (React/Vue/Angular)
- **Mobile Engineer** (React Native/Flutter)
- **Full-Stack Engineer** (pegar o atalho quando necessário)
- **API Architect** (consolidar REST/GraphQL/gRPC)
- **Database Specialist** (consolidar SQL/NoSQL)

### Tier 3: Qualidade (4 agents)
- **QA Architect** (estratégia, cobertura)
- **Test Automation Engineer** (Selenium/Cypress/Playwright — unificados)
- **Security Auditor** (OWASP, compliance)
- **Performance Engineer** (load, soak, spike)

### Tier 4: Infraestrutura (4 agents)
- **DevOps Engineer** (CI/CD, Docker, general deploy)
- **Cloud Architect** (AWS/Azure/GCP — selector + patterns)
- **Kubernetes Specialist** (orchestration)
- **Monitoring Engineer** (observability, SLOs, alerting)

### Tier 5: Dados & IA (3 agents)
- **Data Engineer** (ETL, pipelines, warehousing)
- **ML Engineer** (model training, versioning)
- **AI Agent Orchestrator** (LangGraph, CrewAI, AutoGen — keep advanced)

### Tier 6: Especialistas Auxiliares (2 agents)
- **Documentation Engineer**
- **Release Manager** (versioning, rollback)

**Total: 23 agents** — mantível, deduplicated, com propósito claro.

---

## 🔄 Mapa de Substituição (Antiga → Consolidada)

```
Backend Engineer          → ✅ Tier 2
Full-Stack Engineer       → ✅ Tier 2
Frontend Engineer         → ✅ Tier 2
Mobile Engineer           → ✅ Tier 2
Desktop Engineer          → Merge com Full-Stack ou Frontend (baixa demanda)
API Architect             → ✅ Tier 2 (consolidado REST/GraphQL/gRPC)
GraphQL Engineer          → API Architect
Microservices Architect   → Solution Architect (decisão) + Backend (implementação)
Database Architect        → Database Specialist (Tier 2)
PostgreSQL Specialist     → Database Specialist (exemplo)
SQL Server Specialist     → Database Specialist (exemplo)
MongoDB Specialist        → Database Specialist (exemplo)
Redis Specialist          → Database Specialist (cache/queue)

QA Architect              → ✅ Tier 3
SDET                      → Test Automation Engineer (Tier 3)
Playwright Specialist     → Test Automation Engineer
Selenium Specialist       → Test Automation Engineer
Cypress Specialist        → Test Automation Engineer
Contract Testing          → Test Automation Engineer (sub-skill)
Performance Engineer      → ✅ Tier 3
Accessibility QA          → Test Automation Engineer + Security Auditor
Security Auditor          → ✅ Tier 3
Bug Investigator          → Test Automation Engineer + Backend/Frontend (context)
Flaky Test Detective      → Test Automation Engineer (sub-skill)

DevOps Engineer           → ✅ Tier 4
GitHub Actions            → DevOps Engineer (CI/CD context)
Docker Expert             → DevOps Engineer (container context)
Kubernetes Expert         → Kubernetes Specialist (Tier 4)
Cloud Architect           → ✅ Tier 4 (AWS/Azure/GCP selector)
AWS Architect             → Cloud Architect (example)
Azure Architect           → Cloud Architect (example)
Platform Engineer         → DevOps Engineer (IDP/infra patterns)
Monitoring Engineer       → Monitoring Engineer (Tier 4)
OpenTelemetry Engineer    → Monitoring Engineer (instrumentation)
Observability Engineer    → Monitoring Engineer
Incident Investigator     → Monitoring Engineer (RCA context)
Logging Engineer          → Monitoring Engineer (logs + structured logging)

Data Engineer             → ✅ Tier 5
Analytics Engineer        → Data Engineer (context)
ML Engineer               → ✅ Tier 5
MLOps Engineer            → ML Engineer (CI/CD context)
AI Engineer               → AI Agent Orchestrator (Tier 5)
AI Agent Orchestrator     → ✅ Tier 5

Solution Architect        → ✅ Tier 1
Tech Lead                 → ✅ Tier 1
Product Owner/Manager     → ✅ Tier 1
Chief Architect           → ✅ Tier 1
Business Analyst          → Product Manager (context)
Release Manager           → ✅ Tier 6
Documentation Engineer    → ✅ Tier 6
Code Reviewer             → (meta — é a função do humano, não agent)
PR Reviewer               → (meta)
Technical Writer          → Documentation Engineer
```

---

## 🧪 Passo 3: Eval Automatizado de Prompts

Hoje, governança valida **estrutura** (metadados, links, frontmatter).  
Proposta: evoluir para validar **comportamento** (os prompts realmente funcionam?).

### Exemplo: "Golden File Testing" para Prompts

```bash
tools/governance/eval-prompts.mjs

Para cada agent:
  1. Carrega prompt da pasta .github/prompts/
  2. Define um caso de teste padrão (input + expected output pattern)
  3. Chama LLM com prompt + input
  4. Compara output gerado contra padrão (fuzzy matching)
  5. Relata pass/fail + divergência
```

**Casos de teste propostos:**

```yaml
backend:
  input: "Crie um endpoint POST /api/users com validacao de email e JWT"
  checks:
    - "Express app"
    - "route POST"
    - "Zod validation"
    - "JWT middleware"
    - "Error handling"

frontend:
  input: "Crie um componente React de login com form validation"
  checks:
    - "React component"
    - "useState hooks"
    - "form handling"
    - "validation logic"
    - "error messages"

api-architect:
  input: "Design uma API REST para e-commerce"
  checks:
    - "HTTP methods defined"
    - "Resource URIs"
    - "Status codes"
    - "Error responses"
```

**Benefício**: Detectar rapidamente se prompt ficou desatualizado (ex: referencia lib v1.x quando v3.x é padrão).

---

## ✅ Próximos Passos Imediatos

1. **[DONE]** Colocar `backend-api` como prova viva no README
2. **[TODO]** Consolidar agents: mapear 53 → 23, criar migration guide
3. **[TODO]** Implementar eval básico: 3-5 agents piloto com golden-file testing
4. **[TODO]** Releases com SemVer + exemplos de output real em repo tags
5. **[TODO]** Documentar "quando chamar qual agent" com árvore de decisão

---

## 📝 Revisão de Impacto

| Métrica | Antes | Depois | Ganho |
|---------|-------|--------|-------|
| Agents a manter | 53 | 23 | -57% (sustainable) |
| Prova tangível | 0 exemplos testados | 23+ exemplos | ∞ |
| Confiança | "53 agents" (vaidade) | "23 tested + proven" (qualidade) | Real |
| Governança | Valida estrutura | Valida estrutura + comportamento | Completo |

