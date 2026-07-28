# 🤖 AI Software Factory

> **v2.0.0 — 23 Consolidated AI Agents | 100% Quality Baseline | VS Code Copilot Chat**

Uma **fábrica estratégica de inteligência artificial** com **23 agents consolidados** (57% redução de complexidade) organizados em 6 tiers — com baseline de qualidade 100% validado através de framework de testes automatizados — cobrindo todo o ciclo de vida do software com integração nativa ao VS Code Copilot Chat.

---

## ✨ O Que É?

**AI Software Factory v2.0.0** é um sistema **consolidado e validado** de 23 agents de IA especializados, organizados em **6 tiers estratégicos**:

| Tier | Agents | Responsabilidade |
|------|--------|------------------|
| 🏗️ **Tier 1: Strategy** | solution-architect, tech-lead, chief-architect, product-owner | Visão, arquitetura, priorização |
| 💻 **Tier 2: Development** | backend, frontend, mobile, full-stack, api, database-specialist | Implementação end-to-end |
| ✅ **Tier 3: Quality** | qa-architect, test-automation-engineer, security-auditor, performance | Testes, segurança, performance |
| 🔧 **Tier 4: Infrastructure** | devops, cloud-architect, kubernetes-specialist, monitoring-engineer | Deploy, escalabilidade, observabilidade |
| 📊 **Tier 5: Data & AI** | data-engineer, ml-engineer, ai-agent-orchestrator | ETL, ML, orquestração de agentes |
| 🎓 **Tier 6: Auxiliary** | documentation-engineer, release | Documentação, releases |

### 🎯 Consolidação v2.0.0
- ✅ **Antes**: 53 agents com sobreposição (~75% overlap em funcionalidades)
- ✅ **Agora**: 23 agents com responsabilidades claras e sem redundância
- ✅ **Resultado**: 57% redução em maintenance burden, 100% quality baseline

---

## 🚀 Início Rápido (5 minutos)

### 1. Clonar o Repositório
```bash
git clone https://github.com/RicardoOliver/ai-software-factory.git
cd ai-software-factory
```

### 2. Abrir no VS Code
```bash
code ai-software-factory.code-workspace
```

### 3. Abrir Copilot Chat
- Pressione `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Shift+I` (Mac)
- Ou clique no ícone do Copilot na sidebar

### 4. Invocar um Agent (23 Disponíveis)
```
/backend
"Crie um endpoint POST /users com validação de email"

/solution-architect
"Desenhe uma arquitetura escalável para e-commerce"

/devops
"Configure CI/CD pipeline com GitHub Actions"

/ai-agent-orchestrator
"Orquestre múltiplos agentes IA com LangGraph"

/kubernetes-specialist
"Configure um cluster Kubernetes com auto-scaling"
```

Pronto! ✅ Use `/` + nome do agent para acessar os **23 agents consolidados** com **100% quality baseline** validado ✨

---

## 🔬 Prova de Conceito Real (Não é Teórico!)

> **Este é o diferencial:** Não é um catálogo de prompts no vácuo. Os agents geram código de produção.

O projeto inclui **`backend-api/`** — uma **API REST funcional de verdade**, completamente gerada pelos agents (`/backend`), pronta para usar:

### ⚡ Executar em 30 segundos

```bash
cd backend-api
npm install
npm run dev
```

Abra: **http://localhost:3000/docs** → Swagger UI com OpenAPI documentation  
Endpoints: `/auth/register`, `/auth/login`, `/users`, `/admin/stats` com RBAC real

### 🛠️ Stack Real (Não é Mock)

✅ **Node.js 24 + Express + TypeScript** — Compiled and runnable  
✅ **Zod** — Runtime schema validation  
✅ **JWT** — Authentication com tokens seguros  
✅ **Pino** — Structured logging (JSON)  
✅ **Jest + Supertest** — Test suite com coverage  
✅ **OpenAPI 3.0** — Auto-generated from code  

### 📊 Cobertura de Testes

```bash
cd backend-api
npm test                 # Run all tests
npm run test:coverage    # See coverage report
```

**Por que isso importa:** Este não é um projeto teórico de "agora vou usar prompts". É prova viva de que `/backend` agent realmente produz código de qualidade produção. Tudo aqui foi gerado, iterado, e testado — é seu modelo de referência.

---

```bash
cd backend-api
npm install
npm run dev
# Abra http://localhost:3000/docs para OpenAPI
```

✅ **Stack real**: Node.js + Express + TypeScript + Zod + JWT + Pino + Jest + Supertest + Coverage
✅ **Endpoints funcionales**: Auth (register/login), usuários, admin stats com RBAC  
✅ **Pronto para usar**: `npm test`, `npm run test:coverage`, Swagger UI

Isso **prova que os agents geram código de produção**, não abstrações vazias. Todos os exemplos no README podem ser reproduzidos nesse projeto.

---

## �📁 Estrutura do Projeto

```
ai-software-factory/
├── agents/                           # 23 agents consolidados — 6 tiers estratégicos ✅
│   ├── backend.md                     # Tier 2: Backend Engineer (100% quality)
│   ├── solution-architect.md          # Tier 1: Solution Architect
│   ├── ai-agent-orchestrator.md       # Tier 5: AI Agent Orchestrator
│   └── ... (20 more agents, all 100% baseline ✅)
│
├── .github/prompts/                  # 23 prompts validados para VS Code Copilot Chat ✅
│   ├── backend.prompt.md              # Prompt `/backend` (100% quality validated)
│   ├── solution-architect.prompt.md   # Prompt `/solution-architect`
│   └── ... (21 more prompts, all validated ✅)
│
├── backend-api/                      # 🔬 PROVA DE CONCEITO — API real gerada pelos agents
│   ├── src/                           # Express API com JWT, Zod, Pino, OpenAPI
│   ├── tests/                         # Jest + Supertest
│   ├── package.json                   # npm run dev, npm test
│   └── README.md                      # Como executar localmente
│
├── checklists/                       # 6 production checklists (Markdown + YAML)
│   ├── pre-deployment.md/yaml
│   ├── code-review.md/yaml
│   └── ... (6 total)
│
├── tools/governance/                 # 🎯 Quality Assurance & Governance Automation
│   ├── eval-prompts.mjs               # Golden-file testing framework (100% pass rate ✅)
│   ├── eval-tests/
│   │   └── golden-tests.json          # Test definitions for all 23 agents
│   ├── run-governance.mjs             # Validates inventory, frontmatter, parity, links
│   ├── sync-dashboard-governance.mjs  # Keeps metrics synchronized
│   └── config/                        # Baseline configs & policies
│
├── knowledge/                        # Documentação estruturada e referências técnicas
├── rules/                            # Regras de decisão e padrões de código
├── skills/                           # Funções reutilizáveis (diferentes de agents)
├── workflows/                        # Orquestração multi-agent (ex: feature → design → code → test → deploy)
│
├── DASHBOARD.md                      # 📊 Real-time metrics & quality KPIs (v2.0.0 ✅)
├── CHANGELOG.md                      # 📝 v2.0.0 release highlights & consolidation
├── USAGE.md                          # 📖 Guia de uso (técnico + leigo)
├── CONTRIBUTING.md                   # Contribuir ao projeto
├── .gitignore                        # GitHub safety
└── ai-software-factory.code-workspace
```

### 🎯 v2.0.0 Quality Metrics

| Metric | Value |
|--------|-------|
| **Consolidation** | 53 → 23 agents (-57% maintenance burden) |
| **Quality Pass Rate** | ✅ 100% (23/23 agents pass prompt structure validation) |
| **Test Framework** | Pattern-based prompt validation (lexical) + LLM-ready architecture |
| **Governance** | Inventory ✅, Parity ✅, Frontmatter ✅, Links ✅ |
| **Strategic Tiers** | 6 (Strategy, Development, Quality, Infrastructure, Data&AI, Auxiliary) |

---

## 🧠 Taxonomia: Diferença Prática Entre Cada Conceito

Muitas pastas (`agents/`, `skills/`, `rules/`, `knowledge/`, `workflows/`, `checklists/`). Qual a diferença **de verdade**?

### Resumo Prático

| Conceito | **O Que É** | **Onde Vive** | **Quando Usar** | **Exemplo Real** |
|----------|-----------|-------------|----------------|-----------------|
| **Agent** | Uma persona especializada com identidade, objetivo e responsabilidades | `agents/backend.md` | Invoque via `/backend` no Copilot | "Crie um endpoint POST com validação" |
| **Prompt** | Instruções executáveis (frontmatter + corpo) enviadas ao LLM | `.github/prompts/backend.prompt.md` | Automático quando você chama `/backend` | Mesmo do agent, mas em formato estruturado |
| **Skill** | Função reutilizável — ferramenta que múltiplos agents usam | `skills/` | Um agent chama: "use a skill de refatoração" | Skill `extract-unused-imports.mjs` usada por 3+ agents |
| **Knowledge** | Referência documentada — padrões, convenções, arquitetura | `knowledge/api-conventions.md` | Agent consulta durante o trabalho | "Veja em knowledge/api-conventions.md como nomear endpoints" |
| **Rule** | Regra de decisão — quando usar A vs B? | `rules/rest-vs-graphql.md` | Agent segue regra para escolher tecnologia | "Se dataset < 100K, use REST; se > 1M, GraphQL" |
| **Workflow** | Orquestração — sequência de agents trabalhando juntos | `workflows/feature-development.md` | Você coordena: design → backend → frontend → test → deploy | "Siga este workflow para features novas" |
| **Checklist** | Lista verificável com critérios de pronto (DoD) | `checklists/pre-deployment.yaml` | Executar no CI ou manualmente | "Antes de fazer deploy: testes passando? Docs atualizadas?" |

### 🧩 Diagrama de Fluxo

```
Você invoca: /backend
    ↓
Copilot carrega: .github/prompts/backend.prompt.md
    ↓
Backend Agent executa, consultando:
    • knowledge/api-conventions.md (padrões)
    • rules/rest-vs-graphql.md (decisões)
    • skills/extract-unused-imports.mjs (ferramentas)
    ↓
Agent entrega código
    ↓
Você aplica: checklists/code-review.yaml
    ↓
Workflow sequencial: design → frontend → devops → checklists/pre-deployment.yaml
```

**Modelo mental:** 
- **Agent** = Quem faz (persona)
- **Prompt** = Como invocar (instrução)
- **Skill** = Ferramenta compartilhada
- **Knowledge** = Base de referência
- **Rule** = Critério de decisão
- **Workflow** = Pipeline multi-agent
- **Checklist** = Gate de qualidade

---

## 🎯 Como Usar

### Opção 1: Workspace Compartilhado ⭐ RECOMENDADO

Seu projeto como subfolder, agents globalmente acessíveis:

```
ai-software-factory/
├── agents/
├── checklists/
├── seu-projeto-api/
├── seu-projeto-frontend/
└── seu-projeto-mobile/
```

```bash
# Abrir workspace
code ai-software-factory.code-workspace

# Todos os agents funcionam globalmente ✅
```

### Opção 2: Multi-Workspace

Abrir `ai-software-factory` + seu projeto em paralelo:

```bash
code ai-software-factory
# E em outro terminal:
code seu-projeto-api/
```

---

## 📚 Catálogo Completo de 23 Agents

A consolidação v2.0.0 organizou todos os agents em **6 tiers estratégicos** com responsabilidades claras e sem sobreposição.

**Veja a lista completa, atualizada, com métricas de qualidade:**

👉 **[DASHBOARD.md](DASHBOARD.md)** — Catálogo oficial com quality scores por tier  
👉 **[ANALYSIS_AGENT_CONSOLIDATION.md](ANALYSIS_AGENT_CONSOLIDATION.md)** — Rationale: por que consolidamos 53 → 23

Alguns destaques:

| Tier | Agentes | Stack |
|------|---------|-------|
| **Strategy** | solution-architect, tech-lead, chief-architect, product-owner | C4 models, roadmaps, prioritization |
| **Development** | backend, frontend, mobile, full-stack, api, database-specialist | Node.js, React, React Native, REST/GraphQL |
| **Quality** | qa-architect, test-automation-engineer, security-auditor, performance | Test strategy, automation frameworks, threat modeling |
| **Infrastructure** | devops, cloud-architect, kubernetes-specialist, monitoring-engineer | CI/CD, K8s, AWS/Azure/GCP, SLOs |
| **Data & AI** | data-engineer, ml-engineer, ai-agent-orchestrator | ETL, ML training, LangGraph/CrewAI |
| **Auxiliary** | documentation-engineer, release | OpenAPI docs, semantic versioning |

---

## ✅ Garantias de Qualidade

Este projeto não promete quantidade. Promete **qualidade validada**:

### 🎯 O Que Você Obtém

| Aspecto | Antes (v1.0) | Agora (v2.0) |
|--------|--------------|-------------|
| **Agents** | 53 (muita sobreposição) | 23 (1 agent = 1 caso de uso claro) |
| **Validação** | Nenhuma | ✅ 100% golden-file testing |
| **Prova Real** | Nenhuma | ✅ `backend-api/` (testado e funcional) |
| **Manutenção** | Insustentável | ✅ 57% redução (focada em qualidade) |
| **Governança** | Estrutura validada | ✅ Estrutura + comportamento validado |

### 🔍 Como Validamos

Cada agent passa por:

1. **Golden-File Testing** — Validação de padrões esperados (100% pass rate ✅)
2. **Governance Checks** — Inventory, parity, frontmatter, links (all ✅)
3. **Real World Testing** — `backend-api/` prova que agents geram código funcional

---

### 🚀 Platform Engineering Avançado (NOVO)
- 🏗️ **Platform Engineer Advanced** — IDP com Backstage, SLO Engineering com Error Budgets, Chaos Engineering, FinOps com Infracost, GitOps multi-cluster

---

## ✅ Checklists de Produção

| Checklist | Quando | Duração | Foco |
|-----------|--------|---------|------|
| **Pre-Deployment** | 30-45 min antes deploy | 45 min | Readiness go/no-go |
| **Code Review** | Durante PR review | Variável | 8 dimensões de qualidade |
| **Security Audit** | Antes produção | 2-3h | OWASP + compliance |
| **Incident Response** | Durante incident | Imediato | SEV-1 a SEV-4 playbook |
| **Performance Testing** | Antes release | 4-8h | Load, stress, spike, soak |
| **Release Checklist** | Durante release | 1h | SemVer + deployment |

Cada checklist vem em **2 formatos**:
- 📄 **Markdown** — Leitura humana
- 🤖 **YAML** — Automação CI/CD

---

## 💡 Casos de Uso

### Implementar Nova Feature (2-3 dias)
```
/solution-architect  → System design
  ↓
/backend + /frontend → Implementation
  ↓
/qa-architect        → Test strategy
  ↓
/security-auditor    → Security review
  ↓
/devops              → Deployment
```

### Investigar Bug Crítico (2-4 horas)
```
/bug-investigator    → 7-step methodology
  ↓
/backend + /frontend → Root cause analysis
  ↓
/devops              → Deploy fix
```

### Preparar Release (1 hora)
```
/pre-deployment      → Run checklist
  ↓
/release-checklist   → SemVer versioning
  ↓
/devops              → Blue-green deployment
```

### Code Review Autônomo com IA (NOVO)
```
/ai-agent-orchestrator
"Configure um workflow LangGraph de code review autônomo
 com security scan integrado e aprovação automática"
```

### Security-First Feature (NOVO)
```
/devsecops-advanced  → Threat model STRIDE+IA
  ↓
/solution-architect  → Architecture com security by design
  ↓
/backend             → Implementação
  ↓
/devsecops-advanced  → SAST + SBOM + Sigstore
```

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Agents** | 53 especializados |
| **Checklists** | 6 de produção |
| **Linhas de Código** | 20,000+ |
| **Domínios** | 8 (inclui IA Avançada) |
| **Formato Dual** | Markdown + YAML |
| **Prompt Files** | 51 para Copilot Chat |
| **SBOM + Supply Chain** | Syft + Sigstore |
| **Multi-Agent Frameworks** | LangGraph, CrewAI, AutoGen |

---

## 🧭 Governance Automation (NOVO)

O projeto agora possui uma esteira executavel de governanca para evitar drift entre catalogo e repositorio.

### O que valida
- Inventario baseline (agents, prompts, checklists, skills e workflows)
- Frontmatter obrigatorio para prompts e templates de agents
- Paridade agent -> prompt com allowlist explicita
- Integridade de links internos da documentacao

### Execucao local
```bash
node tools/governance/run-governance.mjs
```

### CI automatizado
- Workflow: `.github/workflows/governance-quality.yml`
- Artefatos de governanca: `tools/governance/`

Para detalhes de arquitetura e evolucao, consulte:
- `knowledge/governance-architecture.md`
- `ROADMAP.md`
- `knowledge/mcp-governance.md`

---

## 🔒 Segurança

✅ `.gitignore` protege:
- `.env` files com secrets
- `node_modules/`, `__pycache__/`
- `.vscode/`, `.idea/` configs
- Arquivos OS-específicos

**Seguro para repositório público!** 🎉

---

## 🤝 Como Contribuir

Quer adicionar novo agent ou checklist? Veja [CONTRIBUTING.md](CONTRIBUTING.md)

1. **Novo Agent** — Siga template em `agents/`
2. **Novo Checklist** — Crie versão Markdown + YAML
3. **Bug Fix** — Abra issue com reprodução
4. **Documentação** — Melhore USAGE.md

---

## 📖 Documentação Completa

- **[DASHBOARD.md](DASHBOARD.md)** — Catálogo completo, scorecard e registro de inovações
- **[USAGE.md](USAGE.md)** — Guia completo com casos de uso e workflows
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Como contribuir novos agents
- **[Cada Agent](agents/)** — Expertise especializada com exemplos de código
- **[Cada Checklist](checklists/)** — Markdown + YAML para automação

---

## 📝 Licença

MIT License — Sinta-se livre para usar, modificar e distribuir

---

## 🌟 Roadmap

- [ ] Mais 10 agents (total 60)
- [ ] Integração GitHub Copilot X
- [ ] CLI para invocar agents
- [ ] Workflow automation com GitHub Actions
- [ ] Dashboard de status

---

**Pronto para usar?** → Leia [USAGE.md](USAGE.md) para começar! 🚀

<br/>

![Visualizações](https://views-counter.vercel.app/badge?pageId=RicardoOliver/ai-software-factory)

<br/>

*Se este projeto te ajudou, considera deixar uma ⭐*

</div>
