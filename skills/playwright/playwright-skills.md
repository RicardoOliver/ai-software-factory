# Skills: Playwright

Conjunto de skills reutilizáveis para o Playwright Specialist.

---

## Skill: Criar Teste E2E

**Quando usar:** Necessidade de automatizar um novo fluxo de usuário.

**Inputs necessários:**
- URL ou rota da funcionalidade
- Passos do fluxo do usuário
- Critério de aceitação a validar
- Dados de teste necessários

**Saída:**
- Page Object (se nova página)
- Spec file com teste completo
- Fixture (se necessário)

**Template:**
```typescript
// tests/[feature]/[cenario].spec.ts
import { test, expect } from '../../fixtures'

test.describe('[Feature]: [Descrição]', () => {
  test.beforeEach(async ({ page }) => {
    // Setup comum ao describe
  })

  test('[cenario happy path]', async ({ page, [pageName]Page }) => {
    // Arrange
    await [pageName]Page.goto()
    
    // Act
    await [pageName]Page.[action]([data])
    
    // Assert
    await expect(page).toHaveURL('/[expected-url]')
    await expect(page.getByTestId('[element]')).toBeVisible()
    await expect(page.getByTestId('[element]')).toContainText('[expected]')
  })

  test('[cenario de erro]', async ({ page }) => {
    // ...
  })
})
```

---

## Skill: Atualizar Locator

**Quando usar:** Locator quebrado após mudança de UI.

**Estratégia de locators (ordem de preferência):**
1. `getByRole('button', { name: 'Enviar' })` — semântico e acessível
2. `getByLabel('Email')` — para inputs com label
3. `getByPlaceholder('Digite seu e-mail')` — para inputs com placeholder
4. `getByText('Confirmar')` — para texto visível
5. `getByTestId('submit-button')` — para elementos com `data-testid`
6. `locator('[aria-label="fechar"]')` — para ARIA labels
7. `locator('css')` — último recurso, evitar

**Regra:** Nunca usar XPath ou seletores CSS frágeis (classe, nth-child).

**Padrão de data-testid:**
```html
<!-- Convenção: [componente]-[ação/estado] -->
<button data-testid="login-submit">Entrar</button>
<input data-testid="login-email" />
<div data-testid="products-list">...</div>
<div data-testid="product-card-{id}">...</div>
```

---

## Skill: Criar Fixture

**Quando usar:** Dado ou estado reutilizado em múltiplos testes.

```typescript
// fixtures/index.ts
import { test as base } from '@playwright/test'

type MyFixtures = {
  authToken: string
  testUser: { id: string; email: string; token: string }
}

export const test = base.extend<MyFixtures>({
  authToken: async ({}, use) => {
    const token = await getAuthToken({
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    })
    await use(token)
  },

  testUser: async ({}, use) => {
    // Criar usuário para o teste
    const user = await createUser({
      email: `test-${Date.now()}@exemplo.com`,
      role: 'user',
    })
    
    await use(user)
    
    // Cleanup após o teste
    await deleteUser(user.id)
  },
})

export { expect } from '@playwright/test'
```

---

## Skill: Gerar Page Object

**Template completo de Page Object:**
```typescript
// pages/[nome].page.ts
import { Page, Locator, expect } from '@playwright/test'

export class [Nome]Page {
  // Locators como propriedades privadas
  private readonly [elemento]: Locator

  constructor(private readonly page: Page) {
    this.[elemento] = page.getByTestId('[testid]')
  }

  // Navegação
  async goto() {
    await this.page.goto('/[rota]')
    await this.page.waitForLoadState('networkidle')
  }

  // Ações
  async [acao]([param]: [tipo]) {
    await this.[elemento].fill([param])
    await this.page.getByRole('button', { name: '[label]' }).click()
    await this.page.waitForURL('/[expected]')
  }

  // Assertions
  async expect[Estado]() {
    await expect(this.[elemento]).toBeVisible()
  }
}
```

---

## Skill: Criar Mock de API

**Quando usar:** Isolar testes de APIs externas ou controlar respostas.

```typescript
// Em fixture ou beforeEach
test('exibe dados mockados', async ({ page }) => {
  // Mock de resposta específica
  await page.route('**/api/produtos**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: {
        data: [
          { id: '1', nome: 'Produto Mock', preco: 99.90 }
        ],
        meta: { total: 1, page: 1, limit: 10 }
      }
    })
  })

  // Mock de erro
  await page.route('**/api/pagamento**', route =>
    route.fulfill({ status: 503, json: { error: 'SERVICE_UNAVAILABLE' } })
  )

  // Interceptar e modificar
  await page.route('**/api/usuario**', async route => {
    const response = await route.fetch()
    const json = await response.json()
    await route.fulfill({ json: { ...json, nome: 'Usuário Modificado' } })
  })
})
```

---

## Skill: Visual Testing

```typescript
// Comparação de screenshot
test('layout da homepage', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Screenshot full page
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    threshold: 0.1, // 10% de diferença permitida
  })
  
  // Screenshot de componente específico
  const header = page.getByRole('banner')
  await expect(header).toHaveScreenshot('header.png')
})

// Atualizar screenshots: npx playwright test --update-snapshots
```

---

## Skill: API Testing com Playwright

```typescript
// tests/api/produtos.spec.ts
import { test, expect } from '@playwright/test'

test.describe('API: Produtos', () => {
  let apiContext: import('@playwright/test').APIRequestContext

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    })
  })

  test.afterAll(async () => {
    await apiContext.dispose()
  })

  test('GET /produtos retorna lista paginada', async () => {
    const response = await apiContext.get('/api/v1/produtos', {
      params: { page: 1, limit: 10 }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.data).toBeInstanceOf(Array)
    expect(body.meta.page).toBe(1)
  })
})
```
