# Skills: Database

Conjunto de skills reutilizáveis para os especialistas de banco de dados.

---

## Skill: Modelagem de Schema PostgreSQL

### Convenções
- Nomes em snake_case
- Tabelas no plural: `users`, `orders`, `products`
- Primary key: `id UUID DEFAULT gen_random_uuid()`
- Timestamps: `created_at`, `updated_at`, `deleted_at` (soft delete)
- Foreign keys: `[tabela_singular]_id` (ex: `user_id`, `order_id`)

### Template de Tabela
```sql
CREATE TABLE [tabela] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- campos específicos
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ  -- soft delete
);

-- Índice padrão para soft delete
CREATE INDEX idx_[tabela]_deleted_at ON [tabela](deleted_at)
WHERE deleted_at IS NULL;

-- Trigger de updated_at
CREATE TRIGGER [tabela]_updated_at
    BEFORE UPDATE ON [tabela]
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Skill: Análise de Query Lenta

```sql
-- 1. Ativar logging de queries lentas (postgresql.conf)
-- log_min_duration_statement = 1000  (queries > 1s)

-- 2. Verificar queries mais lentas
SELECT
    calls,
    total_exec_time,
    mean_exec_time,
    stddev_exec_time,
    rows,
    query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- 3. Analisar query específica
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT ... FROM ... WHERE ...;

-- 4. Verificar índices não utilizados
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- 5. Verificar tabelas sem índices em FK
SELECT
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND NOT EXISTS (
    SELECT 1 FROM pg_indexes pi
    WHERE pi.tablename = tc.table_name
    AND pi.indexdef LIKE '%' || kcu.column_name || '%'
);
```

---

## Skill: Redis — Padrões de Cache

```typescript
// Padrão: cache-aside
async function getProduto(id: string): Promise<Produto> {
  const cacheKey = `produto:${id}`
  
  // 1. Tentar cache
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)
  
  // 2. Buscar no banco
  const produto = await db.produto.findUniqueOrThrow({ where: { id } })
  
  // 3. Armazenar no cache com TTL
  await redis.setex(cacheKey, 3600, JSON.stringify(produto)) // 1 hora
  
  return produto
}

// Invalidar cache ao atualizar
async function atualizarProduto(id: string, dados: UpdateProdutoDto) {
  const produto = await db.produto.update({ where: { id }, data: dados })
  await redis.del(`produto:${id}`)
  return produto
}

// Padrão de chaves
// [entidade]:[id]                    → produto:uuid
// [entidade]:list:[filtros-hash]     → produto:list:abc123
// [usuario]:[id]:[recurso]           → usuario:uuid:carrinho
// session:[token]                    → session:jwt-token
```

---

## Skill: MongoDB — Aggregation Pipeline

```javascript
// Exemplo: relatório de vendas por categoria
db.pedidos.aggregate([
  // Stage 1: Filtrar período
  {
    $match: {
      status: 'concluido',
      criadoEm: {
        $gte: ISODate('2026-01-01'),
        $lt: ISODate('2026-07-01'),
      },
    }
  },
  // Stage 2: Descompor itens
  { $unwind: '$itens' },
  // Stage 3: Join com produtos
  {
    $lookup: {
      from: 'produtos',
      localField: 'itens.produtoId',
      foreignField: '_id',
      as: 'produto',
    }
  },
  { $unwind: '$produto' },
  // Stage 4: Agrupar por categoria
  {
    $group: {
      _id: '$produto.categoria',
      totalVendas: { $sum: '$itens.quantidade' },
      receita: { $sum: { $multiply: ['$itens.quantidade', '$itens.preco'] } },
      ticketMedio: { $avg: '$itens.preco' },
    }
  },
  // Stage 5: Ordenar por receita
  { $sort: { receita: -1 } },
  // Stage 6: Projeção final
  {
    $project: {
      categoria: '$_id',
      totalVendas: 1,
      receita: { $round: ['$receita', 2] },
      ticketMedio: { $round: ['$ticketMedio', 2] },
      _id: 0,
    }
  }
])
```
