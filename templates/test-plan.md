# Template: Plano de Testes

> Arquivo: `docs/test-plan-[feature-ou-release].md`

---

# Plano de Testes: [Nome da Feature ou Release]

**Versão:** [1.0]
**Data:** [YYYY-MM-DD]
**Responsável:** QA Architect / SDET Principal
**Status:** `Rascunho` | `Em Revisão` | `Aprovado` | `Em Execução` | `Concluído`

---

## 1. Escopo

### 1.1 O que está sendo testado
[Descreva claramente o que entra no escopo deste plano.]

### 1.2 Fora do escopo
[O que explicitamente NÃO será testado neste ciclo e por quê.]

### 1.3 Features relacionadas
| Feature | Tipo de Impacto | Necessita Regressão? |
|---------|----------------|---------------------|
| [Feature A] | Direto | Sim |
| [Feature B] | Indireto | Parcial |

---

## 2. Objetivos de Teste

- [ ] Validar que todos os critérios de aceitação das user stories estão implementados
- [ ] Verificar que não houve regressão nas funcionalidades existentes
- [ ] Confirmar que SLAs de performance são atendidos
- [ ] Validar que requisitos de segurança estão satisfeitos
- [ ] Verificar conformidade com WCAG 2.1 AA (acessibilidade)

---

## 3. Matriz de Riscos

| Funcionalidade | Criticidade | Probabilidade de Falha | Prioridade de Teste |
|---------------|------------|----------------------|-------------------|
| [Autenticação] | Alta | Baixa | P1 |
| [Checkout] | Alta | Média | P1 |
| [Relatórios] | Média | Média | P2 |
| [Configurações] | Baixa | Baixa | P3 |

---

## 4. Tipos de Teste

| Tipo | Ferramenta | Cobertura Alvo | Responsável |
|------|-----------|---------------|------------|
| Unitário | Jest / xUnit | ≥ 80% | Dev |
| Integração | Supertest / TestContainers | Fluxos críticos | SDET |
| E2E | Playwright | Happy paths + Edge cases P1 | SDET |
| API | Playwright / Postman | 100% endpoints | SDET |
| Performance | K6 | Endpoints críticos | SDET |
| Segurança | OWASP ZAP + manual | OWASP Top 10 | Security QA |
| Acessibilidade | axe-core + manual | WCAG 2.1 AA | Accessibility QA |
| Visual | Playwright Screenshots | Páginas principais | SDET |
| Cross-browser | Playwright | Chrome, Firefox, Safari | SDET |
| Mobile | Playwright | Chrome Mobile, Safari iOS | SDET |

---

## 5. Critérios de Entrada

Condições necessárias para iniciar os testes:
- [ ] Build estável disponível no ambiente de staging
- [ ] Migrations de banco de dados executadas
- [ ] Dados de teste preparados e carregados
- [ ] Documentação de API atualizada (OpenAPI/Swagger)
- [ ] User stories com critérios de aceitação definidos
- [ ] Ambiente de teste isolado e configurado
- [ ] Credenciais de teste disponíveis

---

## 6. Critérios de Saída

Condições necessárias para concluir os testes:
- [ ] 100% dos casos de teste P1 executados
- [ ] Zero bugs de severidade Crítica abertos
- [ ] Zero bugs de severidade Alta abertos (ou com waiver documentado)
- [ ] Cobertura de testes automatizados ≥ 80%
- [ ] Testes de regressão passando
- [ ] Performance dentro dos SLAs definidos
- [ ] Revisão de segurança aprovada
- [ ] Relatório de testes gerado e aprovado

---

## 7. Casos de Teste

### Feature: [Nome da Feature]

| ID | Título | Tipo | Prioridade | Pré-condição | Passos | Resultado Esperado | Automatizado? |
|----|--------|------|-----------|-------------|--------|-------------------|--------------|
| TC-001 | [Happy path] | E2E | P1 | [Usuário logado] | 1. [...] 2. [...] | [Resultado] | Sim |
| TC-002 | [Cenário de erro] | E2E | P1 | [Usuário sem permissão] | 1. [...] | [Erro 403] | Sim |
| TC-003 | [Edge case] | Manual | P2 | [...] | [...] | [...] | Não |

---

## 8. Dados de Teste

| Perfil | Usuário | Senha | Papel | Propósito |
|--------|---------|-------|-------|-----------|
| Admin | admin@teste.com | (vault) | admin | Operações administrativas |
| Usuário padrão | user@teste.com | (vault) | user | Fluxos normais |
| Usuário sem permissão | readonly@teste.com | (vault) | viewer | Testes de autorização |

---

## 9. Ambientes de Teste

| Ambiente | URL | Banco | Dados | Propósito |
|---------|-----|-------|-------|-----------|
| Staging | https://staging.app.com | staging-db | Sintéticos | Testes de aceite |
| QA | https://qa.app.com | qa-db | Sintéticos | Testes funcionais |

---

## 10. Cronograma

| Fase | Atividade | Início | Fim | Responsável |
|------|-----------|--------|-----|-------------|
| 1 | Preparação de ambiente e dados | [data] | [data] | SDET |
| 2 | Execução de testes funcionais | [data] | [data] | SDET |
| 3 | Testes de regressão | [data] | [data] | SDET |
| 4 | Testes exploratórios | [data] | [data] | QA |
| 5 | Revisão de bugs e re-teste | [data] | [data] | SDET |
| 6 | Relatório final | [data] | [data] | QA Architect |

---

## 11. Gestão de Defeitos

| Severidade | Descrição | SLA de Correção |
|-----------|-----------|----------------|
| Crítica | Sistema indisponível ou perda de dados | Imediato (bloqueia release) |
| Alta | Funcionalidade principal com falha | 24h (bloqueia release) |
| Média | Funcionalidade secundária com falha | Sprint atual |
| Baixa | Problema cosmético ou melhoria | Backlog |

---

## 12. Aprovações

| Papel | Nome | Aprovação | Data |
|-------|------|-----------|------|
| QA Architect | | | |
| Product Owner | | | |
| Tech Lead | | | |
