# Template: Architecture Decision Record (ADR)

> Arquivo: `docs/adr/ADR-[número]-[título-com-hifens].md`
> Exemplo: `docs/adr/ADR-001-escolha-de-banco-de-dados.md`

---

# ADR-[número]: [Título da Decisão]

**Status:** `Proposed` | `Accepted` | `Deprecated` | `Superseded by ADR-[número]`

**Data:** [YYYY-MM-DD]

**Decisores:** [Nome dos responsáveis pela decisão]

**Área:** `Arquitetura` | `Infraestrutura` | `Segurança` | `Dados` | `Integração`

---

## Contexto

[Descreva o problema ou situação que motivou essa decisão arquitetural.
Inclua constraints técnicas, de negócio ou organizacionais relevantes.
Seja específico sobre o que está em jogo e por que uma decisão precisa ser tomada agora.]

**Drivers de qualidade relevantes:**
- [ex: Alta disponibilidade (SLA 99.9%)]
- [ex: Latência < 200ms no p95]
- [ex: Custo de operação reduzido]
- [ex: Time-to-market acelerado]

---

## Decisão

[Declare claramente a decisão tomada. Use linguagem afirmativa:
"Decidimos usar X para Y porque Z."]

---

## Justificativa

[Explique detalhadamente por que esta foi a melhor opção no contexto dado.
Conecte a decisão com os drivers de qualidade e constraints identificados.]

---

## Alternativas Consideradas

### Opção A: [Nome da opção escolhida] ← ESCOLHIDA

**Descrição:** [O que é]

**Prós:**
- [Benefício 1]
- [Benefício 2]

**Contras:**
- [Limitação 1]
- [Limitação 2]

**Custo estimado:** [Alto | Médio | Baixo]

---

### Opção B: [Nome da alternativa]

**Descrição:** [O que é]

**Prós:**
- [Benefício]

**Contras:**
- [Limitação]

**Motivo de descarte:** [Por que não foi escolhida]

---

### Opção C: [Nome da alternativa]

**Motivo de descarte:** [Por que não foi escolhida]

---

## Consequências

### Positivas
- [Benefício direto da decisão]
- [Melhoria esperada]

### Negativas / Trade-offs
- [Custo ou limitação aceita]
- [Complexidade introduzida]

### Neutras / Ações necessárias
- [ ] [Ação de implementação necessária]
- [ ] [Documentação a ser criada]
- [ ] [Time a ser treinado]

---

## Plano de Implementação

| Fase | Ação | Responsável | Prazo |
|------|------|-------------|-------|
| 1 | [Ação inicial] | [Equipe/Pessoa] | [Sprint X] |
| 2 | [Ação seguinte] | [Equipe/Pessoa] | [Sprint Y] |

---

## Métricas de Sucesso

[Como saberemos se a decisão foi acertada?]
- [ ] [Métrica mensurável 1]
- [ ] [Métrica mensurável 2]

**Revisão programada:** [Data ou condição para revisar esta decisão]

---

## Referências

- [Documentação oficial]
- [Artigo técnico relevante]
- [ADR relacionada](ADR-XXX-titulo.md)
- [Ticket/Issue relacionado]

---

## Histórico de Revisões

| Data | Autor | Mudança |
|------|-------|---------|
| [YYYY-MM-DD] | [Nome] | Criação |
| [YYYY-MM-DD] | [Nome] | [Motivo da revisão] |
