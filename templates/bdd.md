# Template: BDD — Gherkin

> Use este template para escrever especificações em BDD (Behavior-Driven Development).
> Arquivo: `features/[feature].feature`

---

## Feature: [Nome da Feature]

```gherkin
# language: pt

Funcionalidade: [Nome da funcionalidade]
  Como [persona / tipo de usuário]
  Quero [ação ou capacidade]
  Para que [benefício ou objetivo]

  Contexto:
    Dado que o sistema está disponível
    E existe um usuário com email "usuario@exemplo.com" e senha "Senha@123"

  # === CENÁRIOS DE SUCESSO (Happy Path) ===

  Cenário: [Cenário principal de sucesso]
    Dado que [pré-condição inicial]
    Quando [ação do usuário ou evento]
    Então [resultado esperado principal]
    E [resultado adicional esperado]

  Esquema do Cenário: [Cenário com múltiplos exemplos]
    Dado que o usuário está na página de "[pagina]"
    Quando preenche o campo "[campo]" com "<valor>"
    Então vê a mensagem "<mensagem_esperada>"

    Exemplos:
      | valor     | mensagem_esperada              |
      | ""        | "Campo obrigatório"            |
      | "a"       | "Mínimo de 3 caracteres"       |
      | "válido"  | "Salvo com sucesso"            |

  # === CENÁRIOS DE ERRO ===

  Cenário: [Cenário de erro por input inválido]
    Dado que [contexto]
    Quando [ação com dados inválidos]
    Então [mensagem de erro esperada]
    E o formulário permanece na mesma página

  Cenário: [Cenário de acesso não autorizado]
    Dado que o usuário não está autenticado
    Quando tenta acessar "[rota protegida]"
    Então é redirecionado para a página de login
    E vê a mensagem "Faça login para continuar"

  # === CENÁRIOS DE BORDA (Edge Cases) ===

  Cenário: [Edge case importante]
    Dado que [condição de borda]
    Quando [ação]
    Então [comportamento esperado neste caso]
```

---

## Exemplo Completo: Login

```gherkin
# language: pt

Funcionalidade: Login de usuário
  Como visitante do sistema
  Quero fazer login com meu e-mail e senha
  Para que possa acessar as funcionalidades autenticadas

  Contexto:
    Dado que existe um usuário cadastrado com:
      | campo  | valor                |
      | email  | joao@exemplo.com     |
      | senha  | MinhaSenh@123        |
      | status | ativo                |

  Cenário: Login com credenciais válidas
    Dado que estou na página de login
    Quando preencho o e-mail com "joao@exemplo.com"
    E preencho a senha com "MinhaSenh@123"
    E clico em "Entrar"
    Então sou redirecionado para o dashboard
    E vejo a mensagem "Bem-vindo, João!"

  Cenário: Login com senha incorreta
    Dado que estou na página de login
    Quando preencho o e-mail com "joao@exemplo.com"
    E preencho a senha com "senhaerrada"
    E clico em "Entrar"
    Então vejo a mensagem de erro "E-mail ou senha inválidos"
    E permaneço na página de login

  Cenário: Bloqueio após 5 tentativas falhas
    Dado que estou na página de login
    Quando tento fazer login com senha incorreta 5 vezes seguidas
    Então vejo a mensagem "Conta temporariamente bloqueada"
    E não consigo fazer login por 15 minutos

  Cenário: Login com conta inativa
    Dado que existe um usuário com status "inativo"
    Quando tento fazer login com as credenciais desse usuário
    Então vejo a mensagem "Sua conta está inativa. Contate o suporte."

  Cenário: Redirecionamento após login
    Dado que tentei acessar "/pedidos/123" sem estar autenticado
    E fui redirecionado para o login
    Quando faço login com credenciais válidas
    Então sou redirecionado de volta para "/pedidos/123"
```

---

## Boas Práticas de BDD

### ✅ Faça
- Use linguagem de negócio (não técnica)
- Cada cenário deve ser independente e autocontido
- Use `Contexto` para pré-condições comuns ao describe
- Seja específico nos resultados esperados
- Use `Esquema do Cenário` para múltiplas variações

### ❌ Evite
- Linguagem técnica ("clica no elemento #submit-btn")
- Cenários que dependem da ordem de execução
- Cenários muito longos (> 10 passos é sinal de problema)
- Implementar lógica nos steps (só orquestrar Page Objects)
- Verificar apenas que "não houve erro" (seja específico)
