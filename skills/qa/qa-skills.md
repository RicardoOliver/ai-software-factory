# Skills: QA

Conjunto de skills reutilizáveis para QA Architects e SDETs.

---

## Skill: Criar Estratégia de Testes Rápida

Use quando precisar definir rapidamente a cobertura de testes para uma feature:

```
Feature: [NOME]
Stack: [TECNOLOGIA]
Criticidade: [Alta/Média/Baixa]

Tipos recomendados:
[ ] Unitário: lógica de negócio e utilitários
[ ] Integração: repository + banco de dados
[ ] API: endpoints REST (happy + errors)
[ ] E2E: fluxo principal do usuário (Playwright)
[ ] Contrato: se houver microsserviços (Pact)
[ ] Performance: se for endpoint crítico (K6)
[ ] Segurança: se houver auth/dados sensíveis
[ ] Acessibilidade: se for interface web (axe-core)
```

---

## Skill: Gerar Casos de Teste a partir de Critérios de Aceitação

### Input
```
Dado: usuário na página de checkout com carrinho preenchido
Quando: clica em "Finalizar Compra"
Então: pedido é criado e usuário recebe email de confirmação
```

### Output gerado
```
TC-001: [P1] Finalizar compra com dados válidos
  Pré: usuário logado, carrinho com 1+ item, endereço cadastrado
  Ação: clica em "Finalizar Compra" → confirma pagamento
  Esperado: pedido criado com status "confirmado" + email enviado

TC-002: [P1] Finalizar compra sem endereço cadastrado
  Pré: usuário logado, carrinho com 1+ item, sem endereço
  Ação: clica em "Finalizar Compra"
  Esperado: redirecionado para cadastro de endereço

TC-003: [P1] Finalizar compra com cartão recusado
  Pré: usuário logado, carrinho preenchido, cartão inválido
  Ação: tenta finalizar compra
  Esperado: mensagem "Pagamento não aprovado. Tente outro cartão."

TC-004: [P2] Finalizar compra com carrinho vazio
  Pré: usuário logado, carrinho vazio
  Ação: acessa checkout diretamente via URL
  Esperado: redirecionado para o carrinho com mensagem informativa

TC-005: [P2] Email de confirmação contém dados corretos
  Pré: pedido finalizado com sucesso (TC-001)
  Verificar: email contém número do pedido, itens, total e prazo de entrega
```

---

## Skill: Calcular Cobertura Mínima por Criticidade

| Criticidade | Unitário | Integração | E2E |
|------------|---------|-----------|-----|
| Alta (pagamentos, auth, dados pessoais) | ≥ 90% | Todos os fluxos | Todos os happy paths |
| Média (features principais) | ≥ 80% | Fluxos críticos | Happy paths P1 |
| Baixa (features secundárias) | ≥ 70% | Happy path | Somente crítico |

---

## Skill: Criar Report de Execução de Testes

```markdown
## Relatório de Execução: [Feature/Sprint]

**Data:** [YYYY-MM-DD]
**Ambiente:** [staging]
**Build:** [commit SHA ou versão]

### Resumo

| Tipo | Total | Passou | Falhou | Skipped | Cobertura |
|------|-------|--------|--------|---------|-----------|
| Unitário | X | X | X | X | X% |
| Integração | X | X | X | X | - |
| E2E | X | X | X | X | - |
| API | X | X | X | X | - |

### Falhas

| Teste | Motivo | Severidade | Bug? |
|-------|--------|-----------|------|

### Bugs Encontrados

| ID | Título | Severidade | Prioridade |
|----|--------|-----------|-----------|

### Decisão de Release
[ ] Aprovado — nenhum bug bloqueante
[ ] Aprovado com ressalvas — [bugs aceitos]
[ ] Reprovado — [motivo]
```
