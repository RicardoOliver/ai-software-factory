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

## � Prova de Conceito Real

**Não é teórico.** O projeto inclui `backend-api/` — um API REST funcional gerado pelos agents `/backend`:

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
| **Quality Pass Rate** | ✅ 100% (23/23 agents pass golden-file tests) |
| **Test Framework** | Pattern-based validation + LLM-ready architecture |
| **Governance** | Inventory ✅, Parity ✅, Frontmatter ✅, Links ✅ |
| **Strategic Tiers** | 6 (Strategy, Development, Quality, Infrastructure, Data&AI, Auxiliary) |

---

### Taxonomia: Qual a diferença?

| Conceito | O que é | Exemplo | Invocação |
|----------|---------|---------|----------|
| **Agent** | Especialista com guias estruturados (identidade, objetivo, responsabilidades, limitações) | `backend.md` (Backend Engineer) | `/backend` no Copilot Chat |
| **Prompt** | Instruções executáveis para LLM + frontmatter YAML | `.github/prompts/backend.prompt.md` | Mesmo que agent (`/backend`) |
| **Skill** | Função reutilizável (ex: ferramenta de refatoração, gerador de testes) | `skills/refactor-unused-imports.mjs` | Usada por múltiplos agents |
| **Knowledge** | Documentação e referências estruturadas | `knowledge/governance-architecture.md` | Leitura durante elaboração de prompts |
| **Rule** | Critério de decisão (ex: quando usar REST vs GraphQL) | `rules/api-style-decision.md` | Consultado durante design |
| **Workflow** | Orquestração de múltiplos agents em sequência | `workflows/feature-development.md` (design → backend → frontend → test) | Guia para o humano coordenar agents |
| **Checklist** | Lista verificável com critérios de pronto | `checklists/pre-deployment.yaml` | Manual ou automático no CI |

**Modelo mental**: Agent ≈ persona com expertise; Prompt ≈ instrução executável; Skill ≈ ferramenta; Knowledge ≈ referência; Rule ≈ decisão; Workflow ≈ pipeline; Checklist ≈ gate.

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

### Leia [USAGE.md](USAGE.md) para Detalhes Completos

---

## 🌟 Principais Agents

### Estratégia & Arquitetura
- 🏗️ **Solution Architect** — C4 models, system design
- 👔 **Tech Lead** — Technical roadmaps, team guidance
- 🔌 **API Architect** — REST, GraphQL, gRPC design

### Desenvolvimento
- 🖥️ **Backend** — Node.js, Python, Go, Java
- 🎨 **Frontend** — React, Vue, Angular
- 📱 **Mobile** — React Native, Flutter, iOS/Android
- 🖲️ **Desktop** — Electron, MAUI, WPF

### Qualidade & Segurança
- 🧪 **QA Architect** — Test strategy, automation
- 🐛 **Bug Investigator** — 7-step systematic approach
- 🔒 **Security Auditor** — OWASP Top 10, compliance

### Infraestrutura
- ⚙️ **DevOps** — CI/CD pipelines, containerization
- ☸️ **Kubernetes** — K8s clusters, helm charts
- ☁️ **Cloud Architect** — AWS, Azure, GCP
- 📊 **Monitoring** — Prometheus, Grafana, SLOs

### Dados & ML
- 📈 **Data Engineer** — dbt, Airflow, Medallion
- 🤖 **ML Engineer** — ML pipelines, model training
- 🔬 **MLOps** — Model versioning, A/B testing

### Observabilidade
- 📝 **Logging Engineer** — Structured JSON, ELK, Loki
- 🔍 **Observability Engineer** — Tracing, metrics
- 🚨 **Incident Investigator** — 5 Porquês RCA

### 🤖 IA Avançada — Multi-Agent Systems (NOVO)
- 🧠 **AI Agent Orchestrator** — LangGraph, CrewAI, AutoGen, memória persistente (Mem0 + Qdrant), RAG hierárquico, NeMo Guardrails

### 🔐 DevSecOps Avançado (NOVO)
- 🛡️ **DevSecOps Advanced** — SBOM com Syft, assinatura Sigstore/Cosign, Threat Modeling STRIDE+IA, OPA/Rego policies, auto-remediação de CVEs

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
