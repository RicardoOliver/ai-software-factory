# Base de Conhecimento: Convenções e Padrões

Este documento centraliza as convenções, guias de estilo e boas práticas adotadas pela AI Software Factory.

---

## Convenções de Código

### Nomenclatura Geral

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivo TypeScript | kebab-case | `user-service.ts` |
| Classe | PascalCase | `UserService` |
| Interface | PascalCase + prefixo I (opcional) | `UserRepository` ou `IUserRepository` |
| Type | PascalCase | `CreateUserDto` |
| Enum | PascalCase | `UserRole` |
| Variável / função | camelCase | `getUserById` |
| Constante | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Componente React | PascalCase | `UserProfile.tsx` |
| Hook React | camelCase + use | `useUserProfile` |
| Arquivo de teste | mesmo nome + `.spec.ts` | `user-service.spec.ts` |

### Estrutura de Branches

```
main              ← produção (protegida, deploy automático)
develop           ← integração (CI obrigatório)
feat/[ticket]-[descricao]     ← nova feature
fix/[ticket]-[descricao]      ← bug fix
hotfix/[ticket]-[descricao]   ← correção urgente em produção
chore/[descricao]             ← tarefas de manutenção
docs/[descricao]              ← documentação
refactor/[descricao]          ← refatoração
```

### Conventional Commits

```
feat: adiciona funcionalidade de exportação
fix: corrige cálculo de total do carrinho
docs: atualiza guia de instalação
chore: atualiza dependências
refactor: extrai módulo de autenticação
test: adiciona testes de integração para checkout
perf: otimiza query de produtos com índice composto
ci: adiciona cache de dependências no workflow
style: aplica formatação do prettier
revert: reverte feat de exportação (bug crítico)

# Breaking change:
feat!: migra para API v2 com novos contratos

# Com escopo:
feat(auth): implementa refresh token
fix(cart): corrige arredondamento de preços
```

---

## Padrões de API REST

### URLs
- Substantivos no plural: `/usuarios`, `/pedidos`, `/produtos`
- Hierarquia lógica: `/usuarios/{id}/pedidos`
- Kebab-case: `/tipos-de-produto`
- Versionamento via path: `/api/v1/`, `/api/v2/`

### Códigos de Status HTTP

| Status | Quando Usar |
|--------|-------------|
| 200 OK | GET/PUT/PATCH bem-sucedido |
| 201 Created | POST que criou recurso |
| 204 No Content | DELETE bem-sucedido |
| 400 Bad Request | Input inválido |
| 401 Unauthorized | Não autenticado |
| 403 Forbidden | Autenticado mas sem permissão |
| 404 Not Found | Recurso não existe |
| 409 Conflict | Conflito (ex: email duplicado) |
| 422 Unprocessable Entity | Validação de negócio falhou |
| 429 Too Many Requests | Rate limit atingido |
| 500 Internal Server Error | Erro interno (não expor detalhes) |

### Formato de Resposta de Erro

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Dados inválidos",
  "details": [
    { "field": "email", "message": "E-mail inválido" },
    { "field": "senha", "message": "Mínimo de 8 caracteres" }
  ],
  "timestamp": "2026-07-23T10:00:00Z",
  "path": "/api/v1/usuarios"
}
```

### Paginação

```json
// Request: GET /api/v1/produtos?page=2&limit=20
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## Padrões de Segurança

### Obrigatórios em Todo Projeto

1. **Validação de input** — Validar e sanitizar TODOS os inputs no servidor
2. **Autenticação** — JWT com expiração curta + refresh token com rotação
3. **Autorização** — Verificar permissões no servidor em cada operação
4. **HTTPS** — Obrigatório em todos os ambientes (staging e produção)
5. **Secrets** — Sempre via variáveis de ambiente ou secrets manager
6. **Rate limiting** — Implementar em todos os endpoints públicos
7. **Headers de segurança** — helmet.js ou equivalente
8. **Logs seguros** — Nunca logar senhas, tokens, PII
9. **Dependências** — Scan automático no CI (Snyk ou equivalente)
10. **CORS** — Whitelist explícita (nunca `origin: '*'` em produção)

---

## Padrões de Qualidade

### Definition of Ready (para iniciar desenvolvimento)
- [ ] User story com critérios de aceitação claros
- [ ] Wireframes ou protótipo aprovados (se UI)
- [ ] Contrato de API definido (se nova API)
- [ ] Dependências identificadas e resolvidas
- [ ] Estimativa realizada

### Definition of Done (para fechar)
- [ ] Critérios de aceitação verificados
- [ ] Testes automatizados escritos e passando
- [ ] Cobertura de testes ≥ 80%
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Deploy em staging validado
- [ ] Sem bugs P1 ou P2 abertos

---

## Stack Aprovada

### Backend
| Tipo | Tecnologia | Versão |
|------|-----------|--------|
| Runtime | Node.js | 20 LTS |
| Framework | Express / Fastify | Latest |
| ORM | Prisma / TypeORM | Latest |
| Validação | Zod | Latest |
| Testes | Jest + Supertest | Latest |
| Logger | Pino | Latest |

### Frontend
| Tipo | Tecnologia | Versão |
|------|-----------|--------|
| Framework | React / Next.js | 18+ / 14+ |
| State | Zustand / TanStack Query | Latest |
| UI | Tailwind CSS / shadcn/ui | Latest |
| Testes | Vitest + Testing Library | Latest |
| E2E | Playwright | Latest |

### Infraestrutura
| Tipo | Tecnologia |
|------|-----------|
| Container | Docker + Docker Compose |
| Orquestração | Kubernetes |
| CI/CD | GitHub Actions |
| Registry | GHCR / ACR |
| Secrets | Azure Key Vault / AWS Secrets Manager |

### Banco de Dados
| Tipo | Tecnologia |
|------|-----------|
| Relacional | PostgreSQL 16 |
| Cache | Redis 7 |
| Documentos | MongoDB Atlas |
| Search | Elasticsearch / OpenSearch |

---

## Glossário

| Termo | Definição |
|-------|-----------|
| ADR | Architecture Decision Record — documento que registra uma decisão arquitetural significativa |
| BDD | Behavior-Driven Development — desenvolvimento orientado a comportamento (Gherkin/Cucumber) |
| CRUD | Create, Read, Update, Delete — operações básicas de persistência |
| DDD | Domain-Driven Design — modelagem de software centrada no domínio de negócio |
| SDET | Software Development Engineer in Test — engenheiro de automação de testes |
| SLA | Service Level Agreement — acordo de nível de serviço (compromisso com cliente) |
| SLI | Service Level Indicator — métrica que mede o comportamento do serviço |
| SLO | Service Level Objective — meta interna para um SLI |
| OWASP | Open Web Application Security Project — referência global em segurança web |
| POM | Page Object Model — padrão de design para testes de UI |
| RAG | Retrieval-Augmented Generation — técnica de LLM com base de conhecimento |
| HPA | Horizontal Pod Autoscaler — escalonamento automático de pods no Kubernetes |
