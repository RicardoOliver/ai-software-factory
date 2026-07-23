# 📖 Como Usar — AI Software Factory

Guia completo para utilizar os 50 agents especializados, 6 checklists de produção e integração com VS Code Copilot Chat.

---

## 🚀 Início Rápido (5 minutos)

### 1. Abrir o Workspace
```bash
code "C:\Users\Ricardo\ai-software-factory\ai-software-factory.code-workspace"
```

### 2. Abrir Copilot Chat
- **VS Code:** `Ctrl+Shift+I` (ou `Cmd+Shift+I` no Mac)
- Ou clique no ícone do Copilot na sidebar esquerda

### 3. Invocar um Agent
```
/devops — Para tarefas DevOps
/backend — Para desenvolvimento backend
/qa-architect — Para estratégia de testes
```

---

## ⚙️ Configuração de Workspace (Múltiplos Projetos)

### ❓ Preciso Copiar o ai-software-factory em Cada Projeto?

**Não!** 🎉 O `ai-software-factory` é um **repositório central** de agents. Você tem 3 opções:

### Opção 1: Workspace Compartilhado (⭐ RECOMENDADO)

Use o ai-software-factory como workspace raiz e adicione seus projetos como subpastas:

```
ai-software-factory/
├─ agents/ (50 agents — acessíveis globalmente)
├─ checklists/ (6 checklists — compartilhados)
├─ USAGE.md
├─ projeto-api/ ← Seu projeto 1
│  ├─ src/
│  ├─ package.json
│  └─ .git
├─ projeto-frontend/ ← Seu projeto 2
│  ├─ src/
│  └─ ...
└─ projeto-mobile/ ← Seu projeto 3
   ├─ src/
   └─ ...
```

**Como usar:**
```bash
# 1. Abrir workspace
code ai-software-factory.code-workspace

# 2. Adicionar seus projetos
File → Add Folder to Workspace → seu-projeto/

# 3. Todos os agents funcionam globalmente ✅
/backend /devops /qa-architect
```

**Vantagens:**
- ✅ Um workspace com tudo
- ✅ Agents acessíveis em qualquer projeto
- ✅ Checklists centralizados
- ✅ Sem duplicação de arquivos

---

### Opção 2: Multi-Workspace (Para Projetos Independentes)

Abrir múltiplos workspaces em paralelo:

```bash
# Terminal 1
code ai-software-factory

# Terminal 2 (novo)
code meu-projeto-api/
```

**VS Code abre com duas abas/janelas:**
- Aba 1: `ai-software-factory` ← Agents disponíveis
- Aba 2: `meu-projeto-api` ← Seu código

**Vantagens:**
- ✅ Workflows separados
- ✅ Agents acessíveis globalmente (Copilot Chat é global)
- ✅ Melhor para grandes projetos

---

### Opção 3: Copiar Configuração (Não Recomendado)

Se você **realmente** quer um projeto independente:

```bash
cp -r ai-software-factory/.github novo-projeto/
cp -r ai-software-factory/agents novo-projeto/
cp -r ai-software-factory/checklists novo-projeto/
```

**Desvantagens:**
- ❌ Duplicação de arquivos (+100MB)
- ❌ Difícil de manter atualizado
- ❌ Agents desincronizados entre projetos

---

### 📊 Comparação das Opções

| Opção | Setup | Agents | Checklists | Recomendação |
|-------|-------|--------|-----------|--------------|
| **1. Workspace Compartilhado** | Fácil | Globais ✅ | Compartilhados ✅ | ⭐ RECOMENDADO |
| **2. Multi-Workspace** | Normal | Globais ✅ | Compartilhados ✅ | ✅ Bom |
| **3. Copiar Config** | Complexo | Locais | Locais | ❌ Evitar |

---

## 🎯 Casos de Uso Principais

### Caso 1: Implementar uma Nova Feature (Workflow Completo)

**Objetivo:** Implementar pagamento com PIX do zero até produção

**Passo 1: Design da Arquitetura**
```
/solution-architect

"Design uma arquitetura de sistema para:
- Novo endpoint de pagamento com PIX
- Integração com gateway
- Tratamento de webhooks
- Implementar segundo C4 model"
```

**Passo 2: Implementação Backend**
```
/backend

"Implemente o endpoint POST /payments/pix com:
- Validação de input
- Integração com gateway (Stripe/MercadoPago)
- Tratamento de erros
- Logging estruturado"
```

**Passo 3: Testes de Qualidade**
```
/qa-architect

"Crie estratégia de testes para:
- Testes unitários do serviço de pagamento
- Testes de integração com webhook
- Testes E2E do fluxo completo"
```

**Passo 4: Revisão de Código**
```
/pr-reviewer

"Revise este PR usando framework 8-dimensões:
[Colar URL do PR]"
```

**Passo 5: Auditoria de Segurança**
```
/devsecops-engineer

"Revise segurança de:
- Autenticação do webhook
- Proteção de dados de pagamento
- Compliance PCI-DSS"
```

**Passo 6: Deploy para Produção**
```
/release

"Prepare release v2.5.0 com:
- Versionamento SemVer
- Changelog gerado
- Plano de deploy blue-green"
```

---

### Caso 2: Investigar Bug em Produção (2 horas)

**Objetivo:** "Usuários não conseguem fazer login em iOS"

**Passo 1: Investigação**
```
/bug-investigator

"Investigar por que usuários iOS não conseguem fazer login:
- Stack trace: [colar erro]
- Quando começou: [data/hora]
- Quantos usuários: [%]"
```

**Passo 2: Análise de Performance**
```
/monitoring

"Verificar métricas no período do bug:
- Taxa de erro da API /auth/login
- Latência do servidor
- Conexões de banco de dados"
```

**Passo 3: Implementar Fix**
```
/backend

"Corrija o bug de autenticação iOS:
- Root cause: [do bug-investigator]
- Solução: [sugestão]
- Inclua testes de regressão"
```

**Passo 4: Response em Produção**
```
/incident-investigator

"Conduzir post-mortem usando 5 Porquês:
- O que falhou: Login iOS
- Por que: [investigação]
- Ações preventivas"
```

---

### Caso 3: Preparar Release para Produção (1 hora)

**Objetivo:** Liberar v3.0.0 com breaking changes

**Passo 1: Planejar Release**
```
/release

"Preparar release v3.0.0:
- Commits: [range git]
- Tipo: MAJOR (breaking changes)
- Gerar CHANGELOG"
```

**Passo 2: Validar Segurança**
```
/devsecops-engineer

"Executar security audit completo com:
- SAST scanning
- Dependency check
- OWASP Top 10 review"
```

**Passo 3: Testes de Performance**
```
/performance

"Executar performance testing:
- Load test (1000 usuários)
- Stress test (encontrar breaking point)
- Spike test (sudden 10x increase)
- Soak test (8h stability)"
```

**Passo 4: Usar Checklists**

Abrir arquivo [checklists/pre-deployment.md](checklists/pre-deployment.md):
```
✅ Code quality gates (linting, testes)
✅ Security scanning (SAST, secrets)
✅ Performance baselines
✅ Database migrations validated
✅ Environment config verified
✅ Monitoring enabled
✅ Go/No-go decision
```

**Passo 5: Deploy**
```
/devops

"Deploy release v3.0.0:
- Strategy: Blue-green
- Canary: 5% → 25% → 100%
- Monitoring: 30 minutos pós-deploy"
```

---

## 📚 Usando os 50 Agents

### Por Domínio

**Estratégia & Negócio**
```
/orchestrator — Coordenar múltiplos agents
/business-analyst — User stories, BDD
/product-owner — Backlog, priorização
/solution-architect — Design de sistemas
```

**Desenvolvimento**
```
/backend — APIs REST, middleware, SOLID
/frontend — React, TypeScript, design patterns
/mobile — React Native, Expo
/graphql-engineer — Schema design, Federation
```

**Qualidade & Testes**
```
/qa-architect — Estratégia de testes
/sdet — Automation framework, page objects
/playwright — E2E testing, visual regression
/contract-testing — Pact consumer/provider
```

**DevOps & Infraestrutura**
```
/devops — CI/CD pipelines
/docker — Dockerfile otimizado
/kubernetes — Clusters, operators
/github-actions — GitHub Actions workflows
```

**Databases**
```
/postgresql — Window functions, performance
/mongodb — Document modeling, aggregation
/redis — Caching, rate limiting, pub/sub
/database-architect — Polyglot persistence
```

**Observabilidade**
```
/monitoring — Prometheus, Grafana, SLOs
/logging-engineer — Structured logging
/observability-engineer — MLT stack setup
/incident-investigator — RCA, 5 Porquês
```

---

## 📋 Usando os 6 Checklists

### Pre-Deployment Checklist
**Quando:** 30-45 min antes de deploy  
**Arquivo:** [checklists/pre-deployment.md](checklists/pre-deployment.md)

**Exemplo:**
```
/devops

"Executar pre-deployment checklist para v2.5.0:
- Código passou em quality gates?
- Security scanning passou?
- Performance baselines OK?
- Database migration testada?
- Monitoring habilitado?
- Go/no-go decision: YES/NO"
```

### Code Review Checklist (8 Dimensões)
**Quando:** Toda PR antes de merge  
**Arquivo:** [checklists/code-review.md](checklists/code-review.md)

**Exemplo:**
```
/pr-reviewer

"Revisar PR usando 8-dimensões:
[PR URL]

1. Context & Scope ✅
2. Design & Architecture ✅
3. Correctness ✅
4. Security ✅
5. Tests ✅
6. Maintainability ✅
7. Performance ✅
8. Breaking Changes ✅"
```

### Security Audit Checklist
**Quando:** Antes de release crítica  
**Arquivo:** [checklists/security-audit.md](checklists/security-audit.md)

**Exemplo:**
```
/devsecops-engineer

"Executar security audit OWASP completo:
- A01: Broken Access Control ✅
- A02: Cryptographic Failures ✅
- A03: Injection ✅
- A04: Insecure Design ✅
- A05: Security Misconfiguration ✅
- A06: Vulnerable Components ✅
- A07: Auth Failures ✅
- A08: Data Integrity ✅
- A09: Logging & Monitoring ✅
- A10: SSRF ✅"
```

### Incident Response Playbook
**Quando:** Produção está em falha  
**Arquivo:** [checklists/incident-response.md](checklists/incident-response.md)

**Exemplo:**
```
/incident-investigator

"Responder a incidente em produção:
- Severity: SEV-2
- Affected: Payment API
- Error rate: 5%
- Action taken: [rollback/scale-up]"
```

### Performance Testing Workflow
**Quando:** Antes de release para validar performance  
**Arquivo:** [checklists/performance-testing.md](checklists/performance-testing.md)

**Exemplo:**
```
/performance

"Executar performance testing:
- Load test: 1000 users × 5 min
- Stress test: Find breaking point
- Spike test: 10x sudden increase
- Soak test: 8h stability"
```

### Release Checklist (SemVer)
**Quando:** Antes de liberar para produção  
**Arquivo:** [checklists/release.md](checklists/release.md)

**Exemplo:**
```
/release

"Liberar v2.5.0:
- Version: MINOR (novo endpoint)
- Changelog: Gerado ✅
- Tests: Passando ✅
- Security: Auditado ✅
- Go/No-go: GO ✅"
```

---

## 🔄 Workflows Completos (Multi-Agent)

### Workflow 1: Feature Completa (Do Zero até Produção)

```
1. /solution-architect
   └─ System design, C4 diagrams

2. /backend
   └─ API implementation

3. /frontend
   └─ UI components

4. /sdet + /playwright
   └─ E2E test automation

5. /code-reviewer
   └─ 8-dimension PR review

6. /devsecops-engineer
   └─ Security audit

7. /performance
   └─ Load & stress testing

8. /release + /devops
   └─ Deploy blue-green

9. /monitoring
   └─ 30-min post-deployment
```

**Tempo total:** 2-3 dias  
**Agentes envolvidos:** 9  
**Checklists usados:** Pre-Deployment, Code Review, Security Audit, Release

---

### Workflow 2: Bug Investigation & Fix

```
1. /bug-investigator
   └─ Root cause analysis (5 Porquês)

2. /monitoring
   └─ Check metrics & dashboards

3. /backend
   └─ Implement fix

4. /sdet
   └─ Add regression test

5. /code-reviewer
   └─ Review hotfix

6. /incident-investigator
   └─ Post-mortem & lessons learned
```

**Tempo total:** 2-4 horas  
**Agentes envolvidos:** 6  
**Checklists usados:** Incident Response

---

### Workflow 3: Microservices Architecture

```
1. /microservices-architect
   └─ Design bounded contexts, sagas

2. /backend (× N serviços)
   └─ Implement each service

3. /contract-testing
   └─ Consumer-provider tests (Pact)

4. /kubernetes
   └─ Deploy & scale services

5. /monitoring + /logging-engineer
   └─ Distributed tracing, centralized logs

6. /devsecops-engineer
   └─ Secrets management, service mesh
```

**Tempo total:** 3-5 dias  
**Agentes envolvidos:** 8  
**Checklists usados:** Pre-Deployment, Security Audit

---

## 💡 Dicas & Melhores Práticas

### Tip 1: Começar com o Orchestrator
Para tarefas complexas, comece com o orchestrator:
```
/orchestrator

"Coordenar implementação de:
[descrição da tarefa]

Sugerir sequência de agents para executar"
```

### Tip 2: Copiar Contexto da Stack Trace
Quando investigar bugs, copie informações específicas:
```
✅ BOM: Stack trace completa
✅ BOM: Request ID / Correlation ID
✅ BOM: Logs contextuais
✅ BOM: Timestamp exato
❌ RUIM: "Não funciona"
```

### Tip 3: Usar os Checklists como Referência Rápida
Abra os arquivos markdown dos checklists em um split pane:
- Esquerda: Código / Terminal
- Direita: [checklists/code-review.md](checklists/code-review.md) ou [checklists/pre-deployment.md](checklists/pre-deployment.md)

### Tip 4: Customizar para Sua Empresa
Editar os arquivos para incluir:
- SLOs específicos (latência p99, error rate threshold)
- Contatos de emergência (on-call rotation)
- Políticas internas (deployment windows, escalation paths)

### Tip 5: Versionar os Checklists
```bash
git commit -am "Updated pre-deployment checklist with new SLOs"
git tag -a checklist-v1.1 -m "Checklist updates"
```

---

## 🔍 Encontrar o Agent Certo

**Usar quando você precisa de...**

| Necessidade | Agent | Comando |
|------------|-------|---------|
| Arquitetar novo sistema | `/solution-architect` | Design C4 |
| Implementar API | `/backend` | `/backend` |
| Revisar código | `/pr-reviewer` | `/pr-reviewer` |
| Investigar bug | `/bug-investigator` | `/bug-investigator` |
| Testar performance | `/performance` | `/performance` |
| Deploy em produção | `/devops` | `/devops` |
| Auditoria segurança | `/devsecops-engineer` | `/devsecops-engineer` |
| Response incidente | `/incident-investigator` | `/incident-investigator` |
| Coordenar múltiplos | `/orchestrator` | `/orchestrator` |

---

## 📁 Estrutura de Arquivos

```
ai-software-factory/
├─ agents/                    # 50 agents especializados
│  ├─ backend.md
│  ├─ frontend.md
│  ├─ devops.md
│  └─ ... (47 mais)
│
├─ .github/prompts/          # 25 VS Code prompt files
│  ├─ backend.prompt.md
│  ├─ devops.prompt.md
│  └─ ... (23 mais)
│
├─ checklists/               # 6 production checklists
│  ├─ pre-deployment.md      # 7 fases
│  ├─ code-review.md         # 8 dimensões
│  ├─ security-audit.md      # OWASP Top 10
│  ├─ incident-response.md   # RCA & 5 Porquês
│  ├─ performance-testing.md # Load, stress, spike, soak
│  ├─ release.md             # SemVer & blue-green
│  └─ README.md              # Guia dos checklists
│
├─ examples/
│  └─ usage-examples.md      # 6 casos de uso completos
│
├─ .github/
│  └─ copilot-instructions.md # Config com 50-agent catalog
│
├─ USAGE.md                  # Este arquivo
├─ CHANGELOG.md
└─ README.md
```

---

## ❓ Perguntas Frequentes

**P: Como invocar um agent no Copilot Chat?**  
R: Digite `/` na caixa de chat e selecione o agent ou digite `/nome-agent`

**P: Posso usar múltiplos agents na mesma conversa?**  
R: Sim! Comece com `/orchestrator` ou chame agents sequencialmente

**P: Como atualizar os checklists para minha empresa?**  
R: Edite os arquivos em `checklists/` e commite as mudanças

**P: Onde estão os 50 agents?**  
R: Em `agents/` (50 arquivos .md) e em `.github/prompts/` (25 prompt files)

**P: Posso exportar um checklist para usar offline?**  
R: Sim, os checklists estão em formato Markdown puro - abra em qualquer editor

**P: Como escalar para usar com a equipe?**  
R: Compartilhe o workspace no Git, configure um `.code-workspace` compartilhado

---

## 🎓 Recursos Adicionais

- [Guia dos 50 Agents](.github/copilot-instructions.md)
- [Exemplos de Uso Completos](examples/usage-examples.md)
- [Guia dos Checklists](checklists/README.md)
- [CHANGELOG com atualizações](CHANGELOG.md)

---

## 📞 Suporte

**Problema com um agent?**
1. Verifique se o agent existe em `agents/`
2. Confirme que o VS Code está aberto no workspace correto
3. Copilot Chat pode estar desconectado - reconecte

**Precisa customizar?**
1. Edite o arquivo `.md` correspondente
2. Use `Ctrl+F` para encontrar seções
3. Commit e push as mudanças

---

**Última atualização:** 2026-07-23  
**Versão:** 1.0  
**Agentes:** 50 | **Checklists:** 6 | **Total de linhas:** ~19,000

🚀 **Você está pronto para usar o AI Software Factory!**
