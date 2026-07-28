# Skills: DevOps

Conjunto de skills reutilizáveis para o DevOps Engineer.

---

## Skill: Criar .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.npm
.env
.env.*
!.env.example
.git
.gitignore
.github
*.md
README*
docs/
tests/
coverage/
.nyc_output
dist/
build/
.DS_Store
*.log
Dockerfile*
docker-compose*
.dockerignore
```

---

## Skill: Configurar GitHub Environments

```yaml
# Usar environments para aprovação manual em produção
# No repositório: Settings → Environments → Adicionar reviewers obrigatórios

jobs:
  deploy-production:
    environment:
      name: production
      url: https://meuapp.com
    # Isso cria um gate de aprovação manual!
```

---

## Skill: Script de Healthcheck

```bash
#!/bin/bash
# scripts/healthcheck.sh

MAX_RETRIES=30
RETRY_INTERVAL=10
SERVICE_URL="${SERVICE_URL:-http://localhost:3000/health}"

for i in $(seq 1 $MAX_RETRIES); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL")

  if [ "$STATUS" = "200" ]; then
    echo "✅ Serviço saudável após $i tentativa(s)"
    exit 0
  fi

  echo "⏳ Tentativa $i/$MAX_RETRIES — Status: $STATUS"
  sleep $RETRY_INTERVAL
done

echo "❌ Serviço não ficou saudável após $MAX_RETRIES tentativas"
exit 1
```

---

## Skill: Configurar Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
    labels:
      - dependencies
      - automated
    groups:
      production-deps:
        patterns: ["*"]
        exclude-patterns: ["@types/*", "eslint*", "jest*"]
      dev-deps:
        patterns: ["@types/*", "eslint*", "jest*", "playwright*"]
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]

  - package-ecosystem: docker
    directory: /
    schedule:
      interval: weekly

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

---

## Skill: Variáveis de Ambiente por Ambiente

```yaml
# Padrão de nomenclatura de secrets no GitHub
# [AMBIENTE]_[SERVIÇO]_[VARIÁVEL]

Produção:
  PROD_DATABASE_URL
  PROD_REDIS_URL
  PROD_JWT_SECRET
  PROD_API_KEY_STRIPE

Staging:
  STAGING_DATABASE_URL
  STAGING_REDIS_URL
  STAGING_JWT_SECRET

Compartilhados:
  CODECOV_TOKEN
  SLACK_WEBHOOK_URL
  SNYK_TOKEN

# No workflow:
env:
  DATABASE_URL: ${{ secrets[format('{0}_DATABASE_URL', env.ENVIRONMENT)] }}
```

---

## Skill: Pipeline de Governança de Conteúdo

```yaml
# .github/workflows/governance-quality.yml
name: Governance Quality

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  governance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node tools/governance/run-governance.mjs
```

Checklist operacional:
- [ ] Baseline de inventario versionado em `tools/governance/config/inventory-baseline.json`
- [ ] Excecoes de paridade explicitas em `tools/governance/config/parity-allowlist.json`
- [ ] Matriz de paridade gerada em `tools/governance/parity-matrix.md`
- [ ] Falha do pipeline bloqueia merge em PR
- [ ] Security audit de dependencias (alto risco) executado em CI
- [ ] Baseline por dominio definido em `dependency-severity-baseline.json`
- [ ] Snapshot historico com tendencia temporal real (7d/30d) atualizado
- [ ] Export externo configurado com timeout/retry quando habilitado
- [ ] Export com idempotency key e assinatura HMAC quando aplicavel
- [ ] Relatorio de descoberta de novos dominios auditaveis revisado
- [ ] Teste dry-run de contrato de export passando no CI
- [ ] Retencao e compressao de historico configuradas por policy
- [ ] Dominios fixture pnpm/yarn ativos para validar audit multi-manager de forma continua
- [ ] Teste HTTP de export valida timeout com retry e contrato ACK
- [ ] Workflows instalam pnpm/yarn em versao fixada para reduzir variacao entre runners
- [ ] KPI por package manager publicado em dashboard e comentario de PR
- [ ] Gate por package manager configurado com minimo de execucao e teto de erros
- [ ] Tendencia de confiabilidade por manager (7d/30d) revisada em rotina operacional
- [ ] Gate de regressao por manager configurado com delta maximo aceitavel (7d vs 30d)
- [ ] Policy de gates por branch definida e revisada em cada ciclo de release
