# Backend API

API REST em Node.js + Express + TypeScript com:

- Validacao de input com Zod
- Autenticacao e autorizacao via JWT
- Logs estruturados com Pino
- Tratamento padronizado de erros
- Documentacao OpenAPI em `/docs`
- Testes unitarios e de integracao com Jest + Supertest

## Executar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

**Variáveis críticas** (require configuração):

- `JWT_SECRET` — **OBRIGATÓRIO em produção**. Gere com: `openssl rand -base64 32`
  - ⚠️ Se não configurar, a aplicação não vai iniciar
  - Nunca use fallback em produção (segurança crítica)

**Variáveis opcionais**:

- `NODE_ENV` — `development` | `production` (default: `development`)
- `PORT` — Porta do servidor (default: `3000`)
- `JWT_EXPIRES_IN` — Expiração do token (default: `15m`)
- `CORS_ORIGIN` — Origens CORS permitidas (default: `http://localhost:3000`)

Veja `.env.example` para documentação completa.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Abrir documentação

Abra: **http://localhost:3000/docs** (Swagger UI com OpenAPI)

## Endpoints

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/usuarios/me` (JWT)
- `GET /api/v1/usuarios/admin/stats` (JWT + role admin)

## Testes

```bash
npm test
npm run test:coverage
```

## 🔐 Segurança

### Variáveis Críticas Sem Fallback

Algumas variáveis **não possuem fallback** e **exigem configuração explícita** — isso é intencional para evitar vulnerabilidades silenciosas:

- **`JWT_SECRET`** — Obrigatório. Se não configurar, a aplicação não inicia.
  - ❌ Nunca use valor padrão em produção
  - ✅ Gere com: `openssl rand -base64 32`
  - ✅ Armazene em secret manager (AWS Secrets, Azure Key Vault, etc.)

### Checklist de Segurança para Produção

- [ ] `JWT_SECRET` configurado com valor aleatório forte (min 32 caracteres)
- [ ] `NODE_ENV=production` configurado
- [ ] `CORS_ORIGIN` restringido ao seu domínio (não `*`)
- [ ] HTTPS ativado (configuração do reverse proxy)
- [ ] Rate limiting implementado (considerar middleware adicional)
- [ ] Logs auditados e armazenados de forma segura
- [ ] Senhas não logadas (Pino configura isso automaticamente)
- [ ] Testes de segurança rodados (`npm test`)

## Usuario admin seed

- Email: `admin@example.com`
- Senha: `Admin@1234`
