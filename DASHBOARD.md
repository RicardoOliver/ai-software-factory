# 📊 AI Software Factory — Metrics Dashboard

> Status em tempo real de todos os 50+ agents, checklists e workflows

---

## 🏆 Scorecard do Projeto

| Dimensão | Status | Score |
|----------|--------|-------|
| **Cobertura de Agents** | ✅ Completa | 53/53 |
| **Integração Copilot Chat** | ✅ Completa | 51 prompts |
| **Checklists Produção** | ✅ Completo | 6 (+YAML) |
| **Encoding UTF-8** | ✅ Limpo | 0 erros |
| **Documentação** | ✅ Completa | USAGE + CONTRIBUTING + README |
| **Inovação IA** | ✅ Avançado | Multi-agent, RAG, Guardrails |
| **Governança Executável** | ✅ Ativa | Inventory + Parity + Links + Frontmatter |

---


<!-- governance-metrics:start -->
## Governance KPIs (Auto)

Updated at: 2026-07-28T01:39:47.890Z

| KPI | Value |
|-----|-------|
| Agents inventory | 53 |
| Prompt inventory | 51 |
| Checklists (md/yaml) | 7/6 |
| Parity coverage | 53/53 (100%) |
| Dependency policy | threshold=high, policy=PASS, high=0, critical=0, domains=4 |
| Dependency managers | npm:pass=1,fail=0,skip=1,execErr=0 | pnpm:pass=1,fail=0,skip=0,execErr=0 | yarn:pass=1,fail=0,skip=0,execErr=0 |
| Last 7 snapshots pass rate | 97.96% (48/49) |
| Manager reliability (7d) | npm:100% | pnpm:100% | yarn:100% |

<!-- governance-metrics:end -->

## 🤖 Catálogo de Agents por Domínio

### 🧠 Estratégia e Negócio (6 agents)
| Agent | Arquivo | Prompt `/cmd` | Linhas |
|-------|---------|--------------|--------|
| Orchestrator | `agents/orchestrator.md` | `/orchestrator` | ~82 |
| Business Analyst | `agents/business-analyst.md` | `/business-analyst` | ~200 |
| Product Owner | `agents/product-owner.md` | `/product-owner` | ~51 |
| Solution Architect | `agents/solution-architect.md` | `/solution-architect` | ~200 |
| Microservices Architect | `agents/microservices-architect.md` | `/microservices-architect` | ~358 |
| Frontend Architect | `agents/frontend-architect.md` | `/frontend-architect` | ~353 |

### 👨‍💻 Desenvolvimento (7 agents)
| Agent | Arquivo | Prompt `/cmd` | Especialidade |
|-------|---------|--------------|---------------|
| Backend Engineer | `agents/backend.md` | `/backend` | Node.js, Python, Go, Java |
| Frontend Engineer | `agents/frontend.md` | `/frontend` | React, Next.js, Vue |
| Mobile Engineer | `agents/mobile.md` | `/mobile` | React Native, Flutter |
| Desktop Engineer | `agents/desktop-engineer.md` | `/desktop-engineer` | Electron, MAUI |
| GraphQL Engineer | `agents/graphql-engineer.md` | `/graphql-engineer` | Schema, DataLoader, Federation |
| AI Engineer | `agents/ai-engineer.md` | `/ai-engineer` | LLM, RAG, embeddings |
| ML Engineer | `agents/ml-engineer.md` | `/ml-engineer` | MLflow, drift, serving |

### 🤖 IA Avançada (1 agent — NOVO)
| Agent | Arquivo | Prompt `/cmd` | Especialidade |
|-------|---------|--------------|---------------|
| AI Agent Orchestrator | `agents/ai-agent-orchestrator.md` | `/ai-agent-orchestrator` | LangGraph, CrewAI, AutoGen, Mem0 |

### 🧪 Qualidade e Testes (12 agents)
| Agent | Arquivo | Prompt `/cmd` |
|-------|---------|--------------|
| QA Architect | `agents/qa-architect.md` | `/qa-architect` |
| SDET Principal | `agents/sdet.md` | `/sdet` |
| Playwright Specialist | `agents/playwright.md` | `/playwright` |
| Selenium Specialist | `agents/selenium.md` | `/selenium` |
| Cypress Specialist | `agents/cypress.md` | `/cypress` |
| API Test Engineer | `agents/api.md` | `/api` |
| Contract Testing | `agents/contract-testing.md` | `/contract-testing` |
| Performance Engineer | `agents/performance.md` | `/performance` |
| Security QA | `agents/security.md` | `/security` |
| Accessibility QA | `agents/accessibility.md` | `/accessibility` |
| Test Data Engineer | `agents/test-data.md` | `/test-data` |
| Flaky Test Detective | `agents/flaky-test-detective.md` | `/flaky-test-detective` |
| Bug Investigator | `agents/bug-investigator.md` | `/bug-investigator` |

### ☁️ Infraestrutura e Cloud (10 agents)
| Agent | Arquivo | Prompt `/cmd` |
|-------|---------|--------------|
| DevOps Engineer | `agents/devops.md` | `/devops` |
| GitHub Actions | `agents/github-actions.md` | `/github-actions` |
| Docker Expert | `agents/docker.md` | `/docker` |
| Kubernetes Expert | `agents/kubernetes.md` | `/kubernetes` |
| Azure Architect | `agents/azure-architect.md` | `/azure-architect` |
| AWS Architect | `agents/aws-architect.md` | `/aws-architect` |
| DevSecOps Engineer | `agents/devsecops-engineer.md` | `/devsecops-engineer` |
| DevSecOps Advanced | `agents/devsecops-advanced.md` | *(referência avançada)* |
| Platform Engineer / SRE | `agents/platform-engineer.md` | `/platform-engineer` |
| Platform Advanced | `agents/platform-engineer-advanced.md` | *(referência avançada)* |

### 🗄️ Bancos de Dados (5 agents)
| Agent | Arquivo | Prompt `/cmd` |
|-------|---------|--------------|
| Database Architect | `agents/database-architect.md` | `/database-architect` |
| PostgreSQL Specialist | `agents/postgresql.md` | `/postgresql` |
| SQL Server Specialist | `agents/sql-server.md` | `/sql-server` |
| MongoDB Specialist | `agents/mongodb.md` | `/mongodb` |
| Redis Specialist | `agents/redis.md` | `/redis` |

### 📊 Dados e IA (3 agents)
| Agent | Arquivo | Prompt `/cmd` |
|-------|---------|--------------|
| Data Engineer | `agents/data-engineer.md` | `/data-engineer` |
| ML Engineer | `agents/ml-engineer.md` | `/ml-engineer` |
| AI Engineer | `agents/ai-engineer.md` | `/ai-engineer` |

### 🔍 Observabilidade (4 agents)
| Agent | Arquivo | Prompt `/cmd` |
|-------|---------|--------------|
| Observability Engineer | `agents/observability-engineer.md` | `/observability-engineer` |
| Logging Engineer | `agents/logging-engineer.md` | `/logging-engineer` |
| Monitoring Engineer | `agents/monitoring.md` | `/monitoring` |
| OpenTelemetry Engineer | `agents/opentelemetry.md` | `/opentelemetry` |
| Incident Investigator | `agents/incident-investigator.md` | `/incident-investigator` |

### 📝 Governança e Qualidade (6 agents)
| Agent | Arquivo | Prompt `/cmd` |
|-------|---------|--------------|
| Code Reviewer | `agents/code-reviewer.md` | `/code-reviewer` |
| PR Reviewer | `agents/pr-reviewer.md` | `/pr-reviewer` |
| Documentation Engineer | `agents/documentation.md` | `/documentation` |
| Release Manager | `agents/release.md` | `/release` |
| Technical Writer | `agents/technical-writer.md` | `/technical-writer` |
| API Architect | `agents/api.md` | `/api` |

---

## ✅ Checklists de Produção

| Checklist | Markdown | YAML | Fases | Uso Recomendado |
|-----------|----------|------|-------|-----------------|
| Pre-Deployment | `checklists/pre-deployment.md` | `pre-deployment.yaml` | 7 | 30-45min antes de deploy |
| Code Review | `checklists/code-review.md` | `code-review.yaml` | 8 dimensões | Durante PR review |
| Security Audit | `checklists/security-audit.md` | `security-audit.yaml` | OWASP A01-A10 | Antes de produção |
| Incident Response | `checklists/incident-response.md` | `incident-response.yaml` | SEV-1 a SEV-4 | Durante incidentes |
| Performance Testing | `checklists/performance-testing.md` | `performance-testing.yaml` | 4 tipos de teste | Antes de release |
| Release Checklist | `checklists/release.md` | `release.yaml` | SemVer + rollback | Durante releases |

---

## 🚀 Workflows Multi-Agent

### Workflow 1: Feature Completa (2-3 dias)
```
/business-analyst → /solution-architect → /backend + /frontend
→ /qa-architect → /security → /devops → /documentation
```

### Workflow 2: Bug Crítico em Produção (2-4 horas)
```
/incident-investigator → /bug-investigator → /backend
→ /devops → /monitoring → /incident-investigator (post-mortem)
```

### Workflow 3: Microsserviços do Zero (3-5 dias)
```
/microservices-architect → /solution-architect → /backend (×N serviços)
→ /devops → /kubernetes → /monitoring → /observability-engineer
```

### Workflow 4: AI-Powered Code Review (Autônomo — NOVO)
```
/ai-agent-orchestrator → LangGraph workflow:
  → code_analyzer → security_scanner → approval_gate
  → (loop até aprovado)
```

### Workflow 5: Security-First Feature (NOVO)
```
/devsecops-engineer (threat model) → /solution-architect
→ /backend → /devsecops-engineer (SAST/SCA) → /security
→ /devops (pipeline seguro) → /devsecops-engineer (SBOM)
```

---

## 📈 Métricas de Qualidade

### Cobertura de Seções (por agent)
- ✅ `## Identidade` — 50/50 agents (100%)
- ✅ `## Objetivo` — 50/50 agents (100%)
- ✅ `## Responsabilidades` — 50/50 agents (100%)
- ✅ `## Criterios de Qualidade` — 50/50 agents (100%)
- ✅ `## Limitacoes` — 50/50 agents (100%)
- ✅ `## Proximos Especialistas` — 50/50 agents (100%)

### Encoding
- ✅ Mojibake emoji corrigido em 11 arquivos
- ✅ Replacement chars removidos de todos os arquivos
- ✅ Bell chars removidos de todos os prompts
- ✅ UTF-8 consistente em todo o repositório

### Integração Copilot Chat
- ✅ 51 prompt files para invocação direta via `/`
- ✅ Todos os prompts com YAML frontmatter válido
- ✅ Placeholder `$input` em todos os prompts

### Governança Automatizada (NOVO)
- ✅ Pipeline em `.github/workflows/governance-quality.yml`
- ✅ Suite local em `tools/governance/run-governance.mjs`
- ✅ Matriz de paridade gerada em `tools/governance/parity-matrix.md`
- ✅ Baselines versionados em `tools/governance/config/`

---

## 🔬 Inovações Avançadas (NOVO)

| Inovação | Arquivo | Tecnologias |
|----------|---------|-------------|
| Multi-Agent Autonomous System | `agents/ai-agent-orchestrator.md` | LangGraph, CrewAI, AutoGen |
| Memória Contextual Persistente | `agents/ai-agent-orchestrator.md` | Mem0, Qdrant, OpenAI Embeddings |
| RAG sobre Documentação | `agents/ai-agent-orchestrator.md` | LlamaIndex, AutoMerging Retriever |
| Guardrails de Segurança | `agents/ai-agent-orchestrator.md` | NeMo Guardrails |
| AI-Powered Threat Modeling | `agents/devsecops-advanced.md` | STRIDE + GPT-4o |
| SBOM + Supply Chain Security | `agents/devsecops-advanced.md` | Syft, Cosign, Sigstore |
| SLO Engineering Avançado | `agents/platform-engineer-advanced.md` | Sloth, Pyrra, Error Budgets |
| Chaos Engineering | `agents/platform-engineer-advanced.md` | Chaos Toolkit, Litmus |
| Internal Developer Platform | `agents/platform-engineer-advanced.md` | Backstage, ArgoCD ApplicationSets |
| FinOps Automation | `agents/platform-engineer-advanced.md` | Infracost, Reserved Instances |

---

## 🛠️ Stack de Tecnologias Suportadas

### Linguagens de Programação
`TypeScript` `JavaScript (Node.js)` `Python` `Go` `Java` `Rust` `C#/.NET` `Kotlin` `Swift`

### Frameworks Backend
`Express` `Fastify` `NestJS` `FastAPI` `Django` `Spring Boot` `Gin` `Axum`

### Frameworks Frontend
`React` `Next.js` `Vue.js` `Nuxt` `Angular` `Svelte` `SvelteKit` `Remix`

### IA e ML
`LangChain` `LangGraph` `CrewAI` `AutoGen` `LlamaIndex` `OpenAI` `Anthropic` `Hugging Face`
`MLflow` `Kubeflow` `Ray` `Triton` `ONNX` `PyTorch` `TensorFlow`

### Infraestrutura
`Kubernetes` `Helm` `ArgoCD` `Flux` `Terraform` `Pulumi` `AWS CDK` `Bicep`
`Docker` `Podman` `Buildah` `Kaniko`

### Cloud
`AWS (ECS, EKS, Lambda, RDS, S3, CloudWatch)` `Azure (AKS, APIM, Key Vault)` `GCP (GKE, Cloud Run)`

### Bancos de Dados
`PostgreSQL` `MySQL` `MongoDB` `Redis` `Cassandra` `DynamoDB` `Neo4j` `Qdrant` `Weaviate` `Pinecone`

### Observabilidade
`Prometheus` `Grafana` `Loki` `Tempo` `Jaeger` `OpenTelemetry` `Datadog` `New Relic` `LangSmith`

### Segurança
`Vault` `Sigstore/Cosign` `Trivy` `Semgrep` `Snyk` `OPA` `Kyverno` `NeMo Guardrails`

---

*Última atualização: 2026-07-24 | AI Software Factory v2.0*
