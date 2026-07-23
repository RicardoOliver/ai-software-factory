# Prompts: Biblioteca da AI Software Factory

Prompts reutilizáveis para tarefas comuns de desenvolvimento de software.

---

## Análise e Requisitos

### Analisar Feature e Decompor
```
Analise a seguinte feature e decomponha em:
1. User stories com critérios de aceitação (formato BDD)
2. Requisitos não funcionais implícitos
3. Riscos técnicos e de negócio
4. Dependências com outros sistemas
5. Estimativa de complexidade (P/M/G)

Feature: [DESCREVER AQUI]
Contexto do sistema: [STACK E ARQUITETURA]
```

### Levantar Requisitos Implícitos
```
Para a seguinte user story, identifique:
1. Requisitos não funcionais implícitos (segurança, performance, acessibilidade)
2. Edge cases não cobertos pelos critérios de aceitação
3. Impactos em outras funcionalidades do sistema
4. Regras de negócio que precisam ser confirmadas

User story: [DESCREVER AQUI]
```

---

## Arquitetura

### Revisar Arquitetura
```
Analise a seguinte arquitetura e forneça:
1. Pontos fortes
2. Riscos e vulnerabilidades arquiteturais
3. Sugestões de melhoria com justificativa
4. ADRs recomendados para as principais decisões
5. Alternativas não consideradas que merecem análise

Arquitetura atual: [DESCREVER OU COLAR DIAGRAMA]
Requisitos principais: [SLAs, volume, restrições]
```

### Criar ADR
```
Crie um Architecture Decision Record (ADR) para a seguinte decisão:
[DECISÃO A DOCUMENTAR]

Contexto: [POR QUE ESSA DECISÃO FOI NECESSÁRIA]
Opções consideradas: [LISTA DAS ALTERNATIVAS]
Decisão tomada: [O QUE FOI ESCOLHIDO]

Use o template em templates/adr.md
```

---

## Desenvolvimento

### Implementar Feature
```
Implemente a seguinte feature seguindo as convenções do projeto:
[DESCRIÇÃO DA FEATURE]

Requisitos técnicos:
- Stack: [LINGUAGEM/FRAMEWORK]
- Seguir padrões em knowledge/conventions.md
- Incluir testes unitários
- Incluir validação de input
- Incluir tratamento de erros
- Documentar com JSDoc/docstring nos pontos públicos

Critérios de aceitação: [LISTA]
```

### Revisar Código
```
Revise o seguinte código com foco em:
1. Segurança (OWASP Top 10)
2. Princípios SOLID
3. Performance e possíveis gargalos
4. Testabilidade
5. Legibilidade e manutenibilidade

Classifique cada issue como: 🔴 Bloqueante | 🟡 Sugestão | 🟢 Elogio

Código a revisar:
[COLAR CÓDIGO AQUI]
```

---

## Testes

### Criar Testes Playwright
```
Crie testes Playwright E2E para o seguinte fluxo:
[DESCREVER O FLUXO]

Requisitos:
- Page Object Model obrigatório
- Fixtures para autenticação
- Locators usando getByRole/getByTestId (sem CSS frágeis)
- Sem waitForTimeout (usar waitForResponse ou waitForSelector)
- Cobrir: happy path + cenários de erro + edge cases principais
- Gerar screenshots em falha
- Parametrizado para múltiplos browsers

Ambiente: [URL base, credenciais de teste]
```

### Criar Testes de API
```
Crie testes de API para os seguintes endpoints:
[DOCUMENTAÇÃO DOS ENDPOINTS OU OPENAPI]

Cobrir:
- Happy path com dados válidos
- Todos os códigos de erro possíveis (400, 401, 403, 404, 422, 500)
- Validação de schema da resposta
- Autenticação e autorização
- Paginação e filtros
- Edge cases de input

Framework: [Jest/Supertest | Playwright | pytest | etc.]
```

### Diagnosticar Teste Flaky
```
Este teste está falhando de forma intermitente. Diagnostique a causa raiz e forneça correção:

Teste: [CÓDIGO DO TESTE]
Log de falha: [MENSAGEM DE ERRO]
Frequência: [X% das execuções]
Ambiente: [CI/CD | Local | Ambos]

Siga o processo do agente flaky-test-detective.md
```

---

## Segurança

### Security Review
```
Faça uma revisão de segurança completa do seguinte código:
[CÓDIGO A REVISAR]

Verificar:
- OWASP Top 10 completo
- Autenticação e autorização
- Validação e sanitização de inputs
- Gestão de segredos
- Headers de segurança
- Rate limiting
- Logs seguros

Gerar relatório no formato do agente security.md
```

---

## Documentação

### Gerar README
```
Gere um README completo para o seguinte serviço/projeto:

Nome: [NOME]
Descrição: [O QUE FAZ]
Stack: [TECNOLOGIAS USADAS]
Endpoints principais: [LISTA]
Variáveis de ambiente: [LISTA]

Use o template em templates/readme.md
```

### Gerar Changelog
```
Gere um changelog para a seguinte release baseado nos commits:

Versão: [X.Y.Z]
Commits: [LISTA DE COMMITS OU git log --oneline]
Público-alvo: [técnico | executivo | usuário final]

Use o formato Keep a Changelog
```

---

## Infraestrutura

### Criar Pipeline GitHub Actions
```
Crie um pipeline GitHub Actions completo para:
[DESCREVER O PROJETO E STACK]

Incluir:
- Lint e type check
- Testes unitários com cobertura
- Scan de segurança (Trivy/Snyk)
- Build de Docker image
- Deploy para [staging/produção]
- Notificação em caso de falha

Gatilho: [PR | Push para main | Tag]
```

### Criar Docker Compose
```
Crie um docker-compose.yml para desenvolvimento local do seguinte projeto:

Serviços necessários: [lista]
Stack: [tecnologias]

Incluir:
- Health checks
- Volumes para persistência
- Rede isolada
- Variáveis de ambiente via .env
- Hot-reload para desenvolvimento
```
