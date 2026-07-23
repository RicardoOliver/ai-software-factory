# Template: README de Serviço

> Substitua os valores entre `[colchetes]` pelas informações do seu serviço.

---

# [Nome do Serviço]

> [Descrição em uma linha do que este serviço faz]

[![CI](https://github.com/[org]/[repo]/actions/workflows/ci.yml/badge.svg)](https://github.com/[org]/[repo]/actions)
[![Coverage](https://codecov.io/gh/[org]/[repo]/branch/main/graph/badge.svg)](https://codecov.io/gh/[org]/[repo])
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Visão Geral

[Descrição mais detalhada do serviço: o que faz, qual problema resolve, quem usa.]

### Funcionalidades Principais
- [Feature 1]
- [Feature 2]
- [Feature 3]

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Runtime | Node.js 20 / Python 3.12 / .NET 8 |
| Framework | Express / FastAPI / ASP.NET Core |
| Banco de dados | PostgreSQL 16 |
| Cache | Redis 7 |
| Mensageria | [RabbitMQ / Kafka / SQS] |
| Testes | Jest + Playwright |
| CI/CD | GitHub Actions |
| Container | Docker + Kubernetes |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20.x
- [Docker](https://www.docker.com/) >= 24.x
- [Docker Compose](https://docs.docker.com/compose/) >= 2.x

---

## Instalação e Execução Local

### 1. Clonar o repositório
```bash
git clone https://github.com/[org]/[repo].git
cd [repo]
```

### 2. Copiar e configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações locais
```

### 3. Subir dependências com Docker
```bash
docker compose up -d postgres redis
```

### 4. Instalar dependências e executar migrations
```bash
npm install
npm run db:migrate
npm run db:seed  # opcional: dados de exemplo
```

### 5. Iniciar em modo desenvolvimento
```bash
npm run dev
```

O serviço estará disponível em: **http://localhost:3000**

---

## Variáveis de Ambiente

| Variável | Obrigatória | Padrão | Descrição |
|----------|------------|--------|-----------|
| `DATABASE_URL` | ✅ | — | Connection string do PostgreSQL |
| `REDIS_URL` | ✅ | — | Connection string do Redis |
| `JWT_SECRET` | ✅ | — | Secret para assinar tokens JWT |
| `PORT` | ❌ | `3000` | Porta do servidor HTTP |
| `NODE_ENV` | ❌ | `development` | Ambiente de execução |
| `LOG_LEVEL` | ❌ | `info` | Nível de log (debug/info/warn/error) |

---

## Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot-reload
npm run build        # Build de produção
npm start            # Executar build de produção

npm test             # Todos os testes
npm run test:unit    # Testes unitários
npm run test:int     # Testes de integração
npm run test:e2e     # Testes E2E (Playwright)
npm run test:cov     # Testes com cobertura

npm run lint         # Verificar estilo de código
npm run lint:fix     # Corrigir automaticamente
npm run type-check   # Verificar tipos TypeScript

npm run db:migrate   # Executar migrations
npm run db:rollback  # Reverter última migration
npm run db:seed      # Popular dados de exemplo
```

---

## Estrutura do Projeto

```
src/
├── controllers/    # Handlers HTTP (entrada e saída)
├── services/       # Lógica de negócio
├── repositories/   # Acesso ao banco de dados
├── models/         # Entidades e tipos de domínio
├── middleware/     # Middlewares Express (auth, errors, logging)
├── routes/         # Definição de rotas
├── config/         # Configurações e variáveis de ambiente
└── utils/          # Utilitários compartilhados

tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
└── e2e/            # Testes E2E
```

---

## API

Documentação completa da API disponível em:
- **Desenvolvimento:** http://localhost:3000/api-docs
- **Staging:** https://[staging-url]/api-docs

### Endpoints Principais

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/v1/[recurso]` | Lista [recursos] paginados | ✅ |
| `POST` | `/api/v1/[recurso]` | Cria novo [recurso] | ✅ |
| `GET` | `/api/v1/[recurso]/:id` | Retorna [recurso] por ID | ✅ |
| `PATCH` | `/api/v1/[recurso]/:id` | Atualiza [recurso] | ✅ |
| `DELETE` | `/api/v1/[recurso]/:id` | Remove [recurso] | ✅ Admin |
| `GET` | `/health` | Health check | ❌ |

---

## Arquitetura

Veja a documentação de arquitetura em [`docs/architecture.md`](docs/architecture.md).

Decisões arquiteturais em [`docs/adr/`](docs/adr/).

---

## Testes

```bash
# Executar todos os testes
npm test

# Com cobertura
npm run test:cov

# Relatório de cobertura: coverage/index.html
```

**Cobertura mínima exigida:** 80%

---

## Deploy

Veja o [guia de deploy](docs/deploy.md) para instruções detalhadas.

**Ambientes:**
| Ambiente | Branch | URL |
|---------|--------|-----|
| Development | `develop` | https://dev.[dominio].com |
| Staging | `main` | https://staging.[dominio].com |
| Production | tag `v*` | https://[dominio].com |

---

## Contribuindo

Leia o [guia de contribuição](CONTRIBUTING.md) antes de abrir um PR.

1. Fork o repositório
2. Crie sua branch: `git checkout -b feat/minha-feature`
3. Commit com Conventional Commits: `git commit -m 'feat: adiciona X'`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença [MIT](LICENSE).
