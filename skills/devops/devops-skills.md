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
