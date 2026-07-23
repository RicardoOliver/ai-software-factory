# Checklists de Qualidade

Checklists rápidos para garantir qualidade em cada fase do desenvolvimento.

---

## Checklist: Code Review

### Segurança (Bloqueante)
- [ ] Sem credenciais ou secrets hardcoded
- [ ] Inputs validados e sanitizados
- [ ] Queries parametrizadas (sem SQL Injection)
- [ ] Autorização verificada no servidor
- [ ] Sem dados sensíveis em logs
- [ ] Dependências sem CVEs críticos

### Corretude
- [ ] Lógica implementada corretamente
- [ ] Edge cases tratados
- [ ] Erros não silenciados (`catch {}` vazio)
- [ ] Recursos liberados (connections, streams, handles)

### Qualidade
- [ ] SOLID aplicado (cada classe/função com responsabilidade única)
- [ ] DRY — sem duplicação desnecessária
- [ ] KISS — solução mais simples possível
- [ ] Nomes descritivos e expressivos
- [ ] Sem código morto ou comentado

### Testes
- [ ] Testes unitários incluídos
- [ ] Edge cases cobertos
- [ ] Testes legíveis (Arrange/Act/Assert)
- [ ] Sem testes frágeis (sleeps, dados hardcoded)

---

## Checklist: Pull Request

- [ ] Descrição clara do que foi feito e por quê
- [ ] Issue relacionada referenciada
- [ ] Tipo de mudança indicado
- [ ] Screenshots para mudanças de UI
- [ ] Passos para testar documentados
- [ ] Self-review realizado
- [ ] CI/CD passando

---

## Checklist: Deploy em Produção

### Pré-deploy
- [ ] Todos os testes automatizados passando
- [ ] Code review aprovado
- [ ] Migrations testadas em staging
- [ ] Rollback documentado
- [ ] Equipe informada

### Durante o deploy
- [ ] Monitorar error rate em tempo real
- [ ] Monitorar latência p95
- [ ] Verificar logs por erros incomuns
- [ ] Health checks passando

### Pós-deploy (30 minutos)
- [ ] Error rate dentro do normal (< 1%)
- [ ] Latência dentro do SLA
- [ ] Sem alertas disparados
- [ ] Funcionalidades críticas verificadas manualmente
- [ ] Stakeholders comunicados

---

## Checklist: Segurança de Aplicação

### Autenticação
- [ ] JWT com algoritmo seguro e expiração
- [ ] Refresh token com rotação
- [ ] Rate limiting em endpoints de auth
- [ ] Senha com hash seguro (bcrypt/Argon2)

### Autorização
- [ ] Verificação no servidor em cada operação
- [ ] Princípio do menor privilégio
- [ ] Sem IDOR (verificar que recurso pertence ao usuário)

### Input/Output
- [ ] Validação em todas as entradas
- [ ] Sanitização de HTML se necessário
- [ ] Sem dados sensíveis em respostas desnecessárias
- [ ] Content-Type correto nas respostas

### Infraestrutura
- [ ] HTTPS obrigatório
- [ ] Headers de segurança configurados (helmet)
- [ ] CORS com whitelist
- [ ] Rate limiting global
- [ ] Scan de dependências no CI

---

## Checklist: Performance

- [ ] Queries com índices adequados
- [ ] Sem N+1 queries
- [ ] Paginação em todas as listas
- [ ] Cache para dados frequentes e estáticos
- [ ] Assets otimizados (imagens, bundle size)
- [ ] Lazy loading para componentes pesados
- [ ] Testes de carga para endpoints críticos

---

## Checklist: Acessibilidade (WCAG 2.1 AA)

- [ ] Imagens com `alt` descritivo
- [ ] Formulários com `label` vinculados
- [ ] Hierarquia de headings lógica (h1 → h2 → h3)
- [ ] Contraste de cor ≥ 4.5:1 para texto normal
- [ ] Navegação por teclado funcional
- [ ] Foco visível em elementos interativos
- [ ] ARIA roles quando necessário
- [ ] Sem conteúdo apenas por cor
- [ ] Sem flashes que possam causar convulsões
- [ ] Testado com leitor de tela (NVDA/VoiceOver)

---

## Checklist: Documentação

- [ ] README com instalação e execução local
- [ ] Variáveis de ambiente documentadas
- [ ] API documentada (OpenAPI/Swagger)
- [ ] ADRs para decisões arquiteturais relevantes
- [ ] Changelog atualizado
- [ ] Guia de contribuição presente
- [ ] Runbooks para operações críticas
