# Template: Pull Request

> Configure este arquivo em `.github/pull_request_template.md` no seu repositório.

---

## Descrição

[Descreva de forma clara e objetiva o que foi implementado neste PR.
Explique o problema que resolve ou a feature que implementa.]

**Tipo de mudança:**
- [ ] 🐛 Bug fix (mudança que corrige um problema)
- [ ] ✨ Nova feature (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (mudança que pode quebrar compatibilidade)
- [ ] ♻️ Refactoring (melhoria de código sem mudança de comportamento)
- [ ] 📚 Documentação
- [ ] 🔧 Configuração / CI/CD
- [ ] ⚡ Performance
- [ ] 🔒 Segurança

---

## Issue Relacionada

Fecha #[número da issue]

---

## Mudanças Realizadas

- [Mudança principal]
- [Mudança secundária]
- [Se breaking change: descreva o impacto e guia de migração]

---

## Como Testar

### Pré-requisitos
- [Dependência ou configuração necessária]

### Passos
1. [Passo 1]
2. [Passo 2]
3. [Verificação esperada]

### Dados de Teste
```
Usuário: [email de teste]
Cenário: [descrição]
```

---

## Checklist do Autor

### Código
- [ ] O código segue os padrões do projeto (lint passando)
- [ ] Self-review realizado
- [ ] Código novo é compreensível e bem nomeado
- [ ] Sem código comentado ou debug (`console.log`, `TODO` sem issue)
- [ ] Sem segredos ou dados sensíveis no código

### Testes
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes de integração adicionados/atualizados (se aplicável)
- [ ] Testes E2E adicionados/atualizados (se aplicável)
- [ ] Todos os testes passando localmente
- [ ] Cobertura de testes mantida ou melhorada

### Segurança
- [ ] Inputs validados e sanitizados
- [ ] Sem vulnerabilidades OWASP introduzidas
- [ ] Autorização verificada nos novos endpoints
- [ ] Dados sensíveis protegidos

### Documentação
- [ ] README atualizado (se necessário)
- [ ] Documentação de API atualizada (OpenAPI)
- [ ] ADR criado (se decisão arquitetural relevante)
- [ ] Changelog atualizado (se feature/fix relevante)

### Deploy
- [ ] Migrations de banco de dados incluídas e reversíveis
- [ ] Variáveis de ambiente documentadas
- [ ] Breaking changes documentadas com guia de migração
- [ ] Compatível com versão atual em produção (sem downtime)

---

## Screenshots / Evidências

[Adicione screenshots, GIFs ou vídeos mostrando as mudanças de UI]
[Para mudanças de backend, mostre logs ou respostas de API]

---

## Notas para o Revisor

[Algum ponto específico que merece atenção especial?
Decisão de design que pode gerar discussão?
Área que precisa de revisão mais cuidadosa?]
