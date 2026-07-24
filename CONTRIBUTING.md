# 🤝 Guia de Contribuição

Obrigado por querer contribuir ao **AI Software Factory**! Este guia explica como adicionar novos agents, checklists e melhorias.

---

## 📋 Tipos de Contribuição

- 🤖 **Novo Agent** — Especialista para novo domínio
- ✅ **Novo Checklist** — Lista de verificação para novo processo
- 🐛 **Bug Fix** — Correção em agent/checklist existente
- 📚 **Documentação** — Melhorias na documentação
- ✨ **Enhancement** — Melhoria em agent/checklist existente

---

## 🚀 Como Criar um Novo Agent

### Passo 1: Planejar

Defina claramente:
- **Nome**: Nome único e descritivo
- **Domínio**: Em qual das 7 categorias se encaixa?
- **Responsabilidades**: 5-10 atividades principais
- **Entradas**: Quais informações o agent recebe?
- **Saídas**: Qual expertise ele fornece?

### Passo 2: Criar o Arquivo do Agent

Crie `agents/seu-agent.md` seguindo este template:

```markdown
# 🎯 Nome do Agent

## Identidade
Quem é este agent? Qual expertise ele representa?
- Especialista em: [área]
- Experiência: [nível]
- Certificações/Skills: [lista]

## Objetivo Principal
O que este agent resolve?

## Responsabilidades
1. Atividade 1
2. Atividade 2
3. Atividade 3
...

## Entradas Esperadas
- Input 1 — descrição
- Input 2 — descrição

## Processo de Raciocínio
Como o agent aborda os problemas?

1. **Fase 1** — Descrição
2. **Fase 2** — Descrição
3. **Fase 3** — Descrição

## Critérios de Qualidade
Como validar saída?

- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Exemplos Práticos
### Exemplo 1: [Descrição]
```
[Prompt de entrada]
```

**Resposta esperada:**
[Resposta modelo]

### Exemplo 2: [Descrição]
[Idem]

## Tecnologias & Ferramentas
- Ferramenta 1
- Ferramenta 2
- Framework 1

## Padrões & Metodologias
- Padrão 1
- Padrão 2
- Padrão 3

## Ver Também
- Agent relacionado 1
- Agent relacionado 2
- Checklist relacionado 1
```

### Passo 3: Criar o Arquivo Prompt para VS Code

Crie `.github/prompts/seu-agent.prompt.md`:

```markdown
---
mode: agent
description: "Breve descrição do que o agent faz"
tools: [semantic_search, read_file]
agents: []
---

Você é o especialista [Nome do Agent]. Seu objetivo é [objetivo principal].

Utilize o arquivo `agents/seu-agent.md` como referência de expertise.

Quando receber uma solicitação:
1. Identifique a categoria do problema
2. Aplique a metodologia apropriada
3. Valide contra os critérios de qualidade

Mantenha sempre o contexto do projeto em mente.
```

### Passo 4: Atualizar copilot-instructions.md

Adicione o novo agent à tabela em `.github/copilot-instructions.md`:

```markdown
| Agent | Prompt | Responsabilidade |
|-------|--------|------------------|
| seu-agent | `/seu-agent` | Descrição breve |
```

### Passo 5: Testar

1. Abra `ai-software-factory.code-workspace`
2. Abra Copilot Chat (`Ctrl+Shift+I`)
3. Digite `/seu-agent` → deve aparecer o novo agent
4. Teste com um prompt de exemplo

### Passo 6: Enviar PR

```bash
git checkout -b add/novo-agent
git add agents/seu-agent.md
git add .github/prompts/seu-agent.prompt.md
git add .github/copilot-instructions.md
git commit -m "Add [Agent Name] agent for [domain]"
git push origin add/novo-agent
```

**Descrição do PR:**
```
## Novo Agent: [Nome]

### Descrição
Breve descrição do agent.

### Domínio
[Estratégia | Desenvolvimento | Qualidade | Infraestrutura | Dados | IA/Observabilidade | Especialista]

### Responsabilidades
- [ ] Responsabilidade 1
- [ ] Responsabilidade 2
- [ ] Responsabilidade 3

### Tecnologias
- Tecnologia 1
- Tecnologia 2

### Checklist
- [x] Arquivo agent criado
- [x] Arquivo prompt criado
- [x] copilot-instructions.md atualizado
- [x] Testado no VS Code
- [x] Exemplos práticos inclusos
```

---

## ✅ Como Criar um Novo Checklist

### Passo 1: Planejar

Defina:
- **Nome**: Descritivo e único
- **Quando**: Em que momento é usado?
- **Duração**: Quanto tempo leva?
- **Responsável**: Quem executa?

### Passo 2: Criar Versão Markdown

Crie `checklists/meu-checklist.md`:

```markdown
# ✅ Meu Checklist

**Quando:** [Momento]  
**Duração:** [Tempo]  
**Responsável:** [Perfil]

## Objetivo
Qual é o objetivo desta checklist?

## Fase 1: [Nome]

### Seção 1.1: [Descrição]
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

**Critério:** O que valida sucesso?

### Seção 1.2: [Descrição]
- [ ] Item 1
- [ ] Item 2

**Critério:** O que valida sucesso?

## Fase 2: [Nome]
[Idem]

## Critério de Saída

**PROCEED se:**
- ✅ Todas as fases completadas
- ✅ Sem bloqueadores críticos

**BLOCK se:**
- ❌ Items críticos falharem
- ❌ Critérios de saída não atendidos

## Rollback Plan

Como reverter se necessário?

### Passo 1
[Descrição]

### Passo 2
[Descrição]

## Referências
- [Link relevante]
- [Documentação]
```

### Passo 3: Criar Versão YAML

Crie `checklists/meu-checklist.yaml`:

```yaml
checklist:
  name: "Meu Checklist"
  version: "1.0"
  when: "Em qual momento"
  duration_minutes: 30
  responsible_role: "Role"

phases:
  - id: "phase_1"
    name: "Nome da Fase"
    items:
      - id: "item_1.1"
        description: "Descrição"
        critical: true
        auto_check: false
        command: null
      - id: "item_1.2"
        description: "Descrição"
        critical: false
        auto_check: true
        command: "comando para verificar"

exit_criteria:
  proceed:
    - all_phases_complete
    - no_critical_failures
  block:
    - critical_item_failed
    - threshold_exceeded

thresholds:
  failure_rate: 0.0
  warning_rate: 0.1
```

### Passo 4: Enviar PR

```bash
git checkout -b add/novo-checklist
git add checklists/meu-checklist.md
git add checklists/meu-checklist.yaml
git commit -m "Add [Checklist Name] checklist"
git push origin add/novo-checklist
```

---

## 🐛 Reportar Bugs

Encontrou um problema? Abra uma **Issue** com:

```markdown
## Descrição
Descrição clara do bug.

## Passos para Reproduzir
1. Abra ...
2. Invoque ...
3. Observe ...

## Comportamento Esperado
O que deveria acontecer.

## Comportamento Atual
O que realmente acontece.

## Ambiente
- OS: [Windows/Mac/Linux]
- VS Code version: [versão]
- Agent/Checklist afetado: [nome]

## Screenshots
[Se aplicável]
```

---

## 🌟 Melhorias em Agents/Checklists Existentes

Para melhorar um agent ou checklist:

1. **Entenda** o atual (leia o arquivo)
2. **Identifique** o que melhorar
3. **Implemente** a melhoria
4. **Teste** no VS Code
5. **Envie PR** com descrição clara

**Exemplo de PR:**

```markdown
## Melhoria: [Agent/Checklist Name]

### Mudanças
- Adicionado: [o quê]
- Removido: [o quê]
- Refatorado: [o quê]

### Razão
Por que esta melhoria?

### Impacto
Qual é o impacto?

Antes:
```
[Código antigo]
```

Depois:
```
[Código novo]
```
```

---

## 📚 Melhorias na Documentação

Para melhorar USAGE.md, README.md ou guias:

1. **Identifique** a seção a melhorar
2. **Reescreva** com clareza
3. **Adicione** exemplos se necessário
4. **Valide** ligações e referências
5. **Envie PR**

---

## ✨ Convenções

### Nomes de Agents
- Use snake_case: `backend`, `bug_investigator`
- Descritivo e único
- Máximo 30 caracteres

### Estrutura de Arquivo
```
agents/nome-agent.md
.github/prompts/nome-agent.prompt.md
```

### Markdown Style
- Use emojis para seções principais (🎯, ✅, 🐛)
- Use bold para **destaques**
- Use code blocks com syntax highlighting
- Use listas para enumerações

### Commit Messages
```
add/melhoria: Descrição breve (50 chars max)

Descrição completa explicando:
- O que foi feito
- Por que foi feito
- Impacto da mudança
```

---

## 🔄 Processo de Review

1. **Submeta PR** com descrição clara
2. **CI checks** devem passar
3. **Maintainers** revisam
4. **Melhorias** são sugeridas
5. **Aprovado** e mergeado

---

## 📞 Perguntas?

- **Documentação**: Veja [USAGE.md](RicardoOliver/ai-software-factory/blob/main/USAGE.md)
- **Issues**: Abra uma issue
- **Discussões**: Use GitHub Discussions

---

## ⭐ Obrigado!

Suas contribuições fazem AI Software Factory melhor para todos! 🎉
