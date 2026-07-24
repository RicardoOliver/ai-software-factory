# Skills: Backend

Conjunto de skills reutilizáveis para o Backend Engineer.

---

## Skill: Criar Endpoint REST

**Checklist antes de implementar:**
- [ ] Método HTTP correto (GET=leitura, POST=criação, PUT=substituição total, PATCH=atualização parcial, DELETE=remoção)
- [ ] Rota seguindo padrão RESTful (`/recursos`, `/recursos/{id}`, `/recursos/{id}/sub-recursos`)
- [ ] Autenticação necessária?
- [ ] Autorização necessária? (papel/permissão)
- [ ] Paginação para coleções
- [ ] Validação de input
- [ ] Tratamento de erros padronizado

**Template Node.js/Express:**
```typescript
// src/controllers/produto.controller.ts
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ProdutoService } from '../services/produto.service'
import { AppError } from '../errors/app-error'

const createProdutoSchema = z.object({
  nome: z.string().min(1).max(255),
  preco: z.number().positive(),
  categoria: z.enum(['eletronicos', 'roupas', 'alimentos']),
  descricao: z.string().optional(),
})

export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, categoria } = req.query

      const resultado = await this.produtoService.listar({
        page: Number(page),
        limit: Math.min(Number(limit), 100), // max 100 por página
        categoria: categoria as string | undefined,
        userId: req.user.id, // usuário autenticado
      })

      res.json({
        data: resultado.items,
        meta: {
          page: resultado.page,
          limit: resultado.limit,
          total: resultado.total,
          totalPages: Math.ceil(resultado.total / resultado.limit),
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const dadosValidados = createProdutoSchema.parse(req.body)
      const produto = await this.produtoService.criar(dadosValidados)
      res.status(201).json(produto)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError('INVALID_INPUT', 400, error.errors))
      }
      next(error)
    }
  }
}
```

---

## Skill: Implementar Autenticação JWT

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/app-error'

interface JwtPayload {
  sub: string
  email: string
  role: string
  iat: number
  exp: number
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('UNAUTHORIZED', 401, 'Token não fornecido')
  }

  const token = authHeader.substring(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.user = { id: payload.sub, email: payload.email, role: payload.role }
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('TOKEN_EXPIRED', 401, 'Token expirado')
    }
    throw new AppError('INVALID_TOKEN', 401, 'Token inválido')
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('FORBIDDEN', 403, 'Permissão insuficiente')
    }
    next()
  }
}
```

---

## Skill: Criar Migration de Banco de Dados

**Convenção de nomenclatura:**
- `V{número}__{descrição_com_underscores}.sql`
- Ex: `V001__create_users_table.sql`
- Ex: `V002__add_index_users_email.sql`
- Ex: `V003__alter_products_add_category.sql`

**Regras:**
- Sempre criar migration de `up` e `down` (reversível)
- Nunca alterar uma migration que já foi aplicada
- Testar migration em ambiente de staging antes de produção

---

## Skill: Otimizar Consulta ao Banco

**Checklist de otimização:**
1. Verificar se existe índice nas colunas de filtro
2. Usar `SELECT` com campos específicos (nunca `SELECT *`)
3. Usar `LIMIT` em todas as queries de lista
4. Verificar N+1 queries com query logging
5. Usar eager loading quando relacionamentos são sempre necessários
6. Usar cache para dados que mudam raramente

```typescript
// ❌ N+1 problem
const pedidos = await Pedido.findAll()
for (const pedido of pedidos) {
  pedido.itens = await PedidoItem.findAll({ where: { pedidoId: pedido.id } })
}

// ✅ Eager loading
const pedidos = await Pedido.findAll({
  include: [{ model: PedidoItem }],
  where: { userId: req.user.id, status: 'pending' },
  limit: 20,
  offset: (page - 1) * 20,
})
```

---

## Skill: Tratamento de Erros Padronizado

```typescript
// src/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message?: string | unknown,
  ) {
    super(typeof message === 'string' ? message : JSON.stringify(message))
  }
}

// src/middleware/error-handler.ts
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
      path: req.path,
    })
  }

  // Log do erro inesperado (sem expor detalhes ao cliente)
  logger.error({ error, req: { method: req.method, path: req.path } })

  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Ocorreu um erro interno',
    timestamp: new Date().toISOString(),
  })
}
```
