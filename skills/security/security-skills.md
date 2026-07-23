# Skills: Security

Conjunto de skills reutilizáveis para o Security QA.

---

## Skill: Revisar Autenticação

**Checklist de revisão:**

### JWT
```
[ ] Algoritmo seguro (RS256 ou HS256 com secret forte)
[ ] Payload não contém dados sensíveis desnecessários
[ ] Expiração configurada (access token: 15min-1h, refresh: 7-30 dias)
[ ] Secret não hardcoded (usar variável de ambiente)
[ ] Refresh token com rotação implementada
[ ] Token invalidado no logout (blocklist ou token version)
[ ] Sem token em URLs (sempre no header Authorization)
```

### OAuth 2.0 / OIDC
```
[ ] PKCE implementado para SPAs e mobile
[ ] State parameter para prevenção de CSRF
[ ] Redirect URIs validadas contra whitelist
[ ] Scopes mínimos necessários
[ ] Token de acesso de curta duração
```

---

## Skill: Validar Autorização

**Checklist de autorização:**
```
[ ] Verificação de autorização no servidor (nunca só no frontend)
[ ] Teste de escalada horizontal (user A acessa recurso de user B)
[ ] Teste de escalada vertical (user comum acessa endpoint de admin)
[ ] IDs internos não expostos (usar UUIDs ou slugs)
[ ] Verificação de propriedade do recurso antes de modificar
```

**Testes de autorização:**
```typescript
describe('Autorização: Pedidos', () => {
  test('usuário não pode acessar pedido de outro usuário', async () => {
    const userA = await createUser()
    const userB = await createUser()
    const pedido = await createOrder({ userId: userA.id })

    const response = await request(app)
      .get(`/api/pedidos/${pedido.id}`)
      .set('Authorization', `Bearer ${userB.token}`)

    expect(response.status).toBe(403)
  })

  test('usuário comum não pode acessar rota de admin', async () => {
    const user = await createUser({ role: 'user' })

    const response = await request(app)
      .delete('/api/admin/usuarios/1')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(403)
  })
})
```

---

## Skill: Detectar Vulnerabilidades de Input

**SQL Injection:**
```typescript
// ❌ Vulnerável
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`)

// ✅ Seguro: query parametrizada
const user = await db.query('SELECT * FROM users WHERE email = $1', [email])

// ✅ Seguro: ORM
const user = await User.findOne({ where: { email } })
```

**XSS:**
```typescript
// ❌ Vulnerável
document.innerHTML = userInput

// ✅ Seguro: escaping automático (React JSX)
return <div>{userInput}</div>

// ✅ Seguro: sanitização quando HTML é necessário
import DOMPurify from 'dompurify'
const safeHtml = DOMPurify.sanitize(userInput)
```

**Command Injection:**
```typescript
// ❌ Vulnerável
exec(`convert ${userFileName} output.pdf`)

// ✅ Seguro: spawn com array de argumentos
const { execFile } = require('child_process')
execFile('convert', [sanitizedFileName, 'output.pdf'])

// ✅ Melhor ainda: validar extensão e caminho
const allowedExtensions = ['.jpg', '.png', '.pdf']
const ext = path.extname(fileName).toLowerCase()
if (!allowedExtensions.includes(ext)) throw new Error('Extensão não permitida')
```

---

## Skill: Configurar Headers de Segurança

**helmet.js (Node.js):**
```typescript
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.API_URL!],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}))
```

---

## Skill: Implementar Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

// Rate limit geral
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Muitas requisições' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limit rigoroso para autenticação (prevenir força bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'TOO_MANY_LOGIN_ATTEMPTS' },
  skipSuccessfulRequests: true, // Não conta tentativas bem-sucedidas
})

app.use('/api', generalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/forgot-password', authLimiter)
```
