# MCPs Envolvidos na Governanca

Este projeto usa MCPs para ampliar observabilidade, colaboracao e qualidade operacional.

## MCPs Prioritarios

1. GitHub Pull Request MCP
- Uso: status checks, comentarios automáticos e resolucao de threads
- Valor: governanca acoplada ao fluxo de revisao

2. GitKraken CLI MCP
- Uso: inspeção de status, commits e revisoes estruturadas
- Valor: trilha de auditoria para mudancas estruturais

3. Container Tools MCP
- Uso: preparacao para etapas de build e supply chain
- Valor: base para evolucao de seguranca em release

## Politica de Uso

- Alteracoes estruturais exigem evidencias dos checks de governanca
- PR sem checks verdes nao deve ser aprovado
- Excecoes devem ser documentadas em baseline/allowlist
- Baseline de severidade de dependencias deve seguir policy por branch
- Snapshot diario de governanca deve ser preservado para analise historica
- Publicacao externa deve usar timeout e retries configuraveis
- Publicacao externa deve usar idempotency key e assinatura quando habilitada
- Relatorio de descoberta de dominios deve alimentar backlog de governanca
- Quando `EXPECT_ACK` estiver ativo, endpoint deve responder contrato com `accepted` e `requestId`
- Dominios fixture de package managers alternativos devem permanecer ativos para cobertura operacional continua
- Fluxo de export externo deve ser testado contra timeout com retry antes de tornar ACK obrigatorio
- Saude por package manager deve ser acompanhada em PR e dashboard para detectar regressao de toolchain
- Gates por package manager devem ser versionados por variavel e revisados por ambiente
- Regressao de confiabilidade por manager (7d vs 30d) deve acionar gate conforme limiar de risco
- Limiares de gate devem ser diferenciados por branch para reduzir risco de falso positivo em ambientes nao produtivos

## Proxima Evolucao

- Criar MCP dedicado de inventory analytics
- Integrar sinais de governanca ao dashboard de operacao
- Publicar snapshots historicos para endpoint externo com autenticacao
