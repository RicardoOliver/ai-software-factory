# Regras de Decisão da AI Software Factory

Este documento define as regras que o Orchestrator usa para selecionar agentes e tomar decisões.

---

## Regras de Seleção de Agentes

### Por Tipo de Solicitação

| Palavra-chave na solicitação | Agentes a acionar |
|------------------------------|-------------------|
| "nova feature", "implementar" | Business Analyst → Solution Architect → Backend/Frontend → QA Architect → SDET |
| "bug", "erro", "falha" | Incident Investigator → Code Reviewer → SDET → DevOps |
| "segurança", "vulnerabilidade" | Security QA → Code Reviewer → API Test Engineer |
| "performance", "lento", "timeout" | Performance Engineer → Monitoring Engineer → Solution Architect |
| "release", "deploy", "publicar" | Release Manager → Code Reviewer → DevOps → Documentation |
| "arquitetura", "design" | Solution Architect → Code Reviewer |
| "teste", "automação", "playwright" | QA Architect → SDET → Playwright Specialist |
| "documentação", "README", "ADR" | Documentation Engineer → Technical Writer |
| "docker", "container" | Docker Expert → DevOps Engineer |
| "kubernetes", "k8s", "cluster" | Kubernetes Expert → DevOps Engineer |
| "banco de dados", "SQL", "query" | PostgreSQL/MongoDB/Redis Specialist |
| "pipeline", "CI/CD", "GitHub Actions" | DevOps Engineer → GitHub Actions Expert |
| "review", "revisar código" | Code Reviewer → Security QA |

---

## Regras de Prioridade de Qualidade

Sempre aplicar nesta ordem:
1. **Segurança** — Nenhuma vulnerabilidade crítica pode passar
2. **Corretude** — O código faz o que deveria fazer
3. **Testabilidade** — Pode ser testado automaticamente
4. **Manutenibilidade** — Pode ser mantido pela equipe
5. **Performance** — Atende SLAs definidos
6. **Documentação** — Documentado adequadamente

---

## Regras de Bloqueio

### Um PR nunca deve ser aprovado se:
- Contém segredos ou credenciais hardcoded
- Tem vulnerabilidades OWASP críticas ou altas
- Não tem testes para lógica nova
- Quebra testes existentes sem justificativa
- Tem código que expõe dados sensíveis em logs
- Tem SQL Injection ou XSS não mitigados
- Falha em qualquer validação de governança (`tools/governance/run-governance.mjs`)

### Um deploy nunca deve acontecer se:
- CI/CD está falhando
- Testes de regressão não passaram
- Security scan tem CVEs críticos
- Não há plano de rollback documentado

---

## Regras de Escalação

| Situação | Escalar para |
|----------|-------------|
| Bug com impacto em produção | Incident Investigator → Tech Lead |
| Vulnerabilidade crítica descoberta | Security QA → Tech Lead → CISO |
| Performance degradada em produção | Performance Engineer → Monitoring → Tech Lead |
| Decisão arquitetural controversa | Solution Architect → Tech Lead → Revisão coletiva |
| Conflito entre requisitos de negócio | Product Owner → Business Analyst → Stakeholders |

---

## Regras de Automação

### Deve ser automatizado:
- Testes de regressão em toda PR
- Scan de segurança em todo commit
- Lint e formatação automática
- Build e push de imagem Docker no merge para main
- Deploy para staging automático após build
- Geração de changelog com base em commits

### Deve ser manual:
- Deploy para produção (requer aprovação humana)
- Aprovação de PRs (Code Reviewer humano obrigatório em código crítico)
- Aceite de feature pelo Product Owner
- Go/No-Go de releases maiores

---

## Regras de Versionamento

### Quando incrementar MAJOR (x.0.0):
- Breaking changes na API pública
- Mudança incompatível no contrato de dados
- Remoção de endpoints ou campos

### Quando incrementar MINOR (0.x.0):
- Nova funcionalidade retrocompatível
- Novo endpoint
- Nova feature opcional

### Quando incrementar PATCH (0.0.x):
- Bug fixes
- Melhorias de performance sem mudança de API
- Correções de segurança retrocompatíveis
