# 🤖 AI Software Factory

> **53 AI Agents + 6 Production Checklists + VS Code Copilot Chat Integration**

Uma **fábrica completa de inteligência artificial** com **53 agents especializados** — incluindo agents avançados de IA multi-agente (LangGraph, CrewAI, AutoGen), DevSecOps com SBOM/Sigstore e Platform Engineering com SLO Engineering e Chaos Engineering — cobrindo todo o ciclo de vida do software com integração nativa ao VS Code Copilot Chat.

---

## ✨ O Que É?

**AI Software Factory** é um sistema de agents de IA especializados que automatizam e orientam práticas de engenharia de software em **7 domínios principais**:

| Domínio | Agents | Foco |
|---------|--------|------|
| 🏗️ **Estratégia** | Solution Architect, Tech Lead, Product Manager | Design de sistemas, decisões tecnológicas |
| 💻 **Desenvolvimento** | Backend, Frontend, Full-Stack, Mobile, Desktop | Implementação em múltiplas stacks |
| ✅ **Qualidade** | QA Architect, Bug Investigator, Security Auditor | Testes, bugs, segurança |
| 🔧 **Infraestrutura** | DevOps, Kubernetes, Cloud Architect, Monitoring | Deploy, escalabilidade, observabilidade |
| 📊 **Dados** | Data Engineer, Analytics Engineer, ML Engineer | ETL, pipelines, machine learning |
| 🎯 **IA/Observabilidade** | MLOps, Logging Engineer, Incident Investigator | MLOps, logs estruturados, RCA |
| 🎓 **Especialistas** | API Architect, GraphQL, Microservices, Databases | Domínios técnicos específicos |
| 🤖 **IA Avançada** | AI Agent Orchestrator | LangGraph, CrewAI, AutoGen, RAG, Guardrails |

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

### 4. Invocar um Agent
```
/backend
"Crie um endpoint POST /users com validação de email"

/devops
"Configure CI/CD para deploy em ECS"

/qa-architect
"Design uma estratégia de testes para API GraphQL"
```

Pronto! ✅ Use `/` + nome do agent para acessar **53 especialistas**

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
├── agents/                           # 53 especialistas — instruções estruturadas para cada função
│   ├── backend.md                     # Guia do agent Backend Engineer
│   ├── ai-agent-orchestrator.md      # Agent LangGraph/CrewAI/AutoGen
│   └── ... (53 total)
│
├── .github/prompts/                  # 51 prompts para VS Code Copilot Chat (invocação via `/`)
│   ├── backend.prompt.md              # Prompt executável para `/backend`
│   └── ... (51 total)
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
├── tools/governance/                 # Automação de integridade (CI + checks)
│   ├── run-governance.mjs              # Valida inventory, frontmatter, parity, links
│   ├── sync-dashboard-governance.mjs   # Mantém métricas sincronizadas
│   └── ... (policy configs, history)
│
├── knowledge/                        # Documentação estruturada e referências técnicas
├── rules/                            # Regras de decisão e padrões de código
├── skills/                           # Funções reutilizáveis (diferentes de agents)
├── workflows/                        # Orquestração multi-agent (ex: feature → design → code → test → deploy)
│
├── DASHBOARD.md                      # 📊 Scorecard vivo com KPIs da governança
├── USAGE.md                          # 📖 Guia de uso (técnico + leigo)
├── CONTRIBUTING.md                   # Contribuir ao projeto
├── .gitignore                        # GitHub safety
└── ai-software-factory.code-workspace
```

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
