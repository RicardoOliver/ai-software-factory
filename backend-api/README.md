# Backend API

API REST em Node.js + Express + TypeScript com:

- Validacao de input com Zod
- Autenticacao e autorizacao via JWT
- Logs estruturados com Pino
- Tratamento padronizado de erros
- Documentacao OpenAPI em `/docs`
- Testes unitarios e de integracao com Jest + Supertest

## Executar localmente

1. Instalar dependencias:

```bash
npm install
```

1. Rodar em desenvolvimento:

```bash
npm run dev
```

1. Abrir documentacao:

`http://localhost:3000/docs`

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

## Usuario admin seed

- Email: `admin@example.com`
- Senha: `Admin@1234`
