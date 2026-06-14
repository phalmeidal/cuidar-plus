# Roteiro do minicurso gravado

## 1. Introdução

- Apresente o Cuidar+ e o problema de monitoramento.
- Mostre o fluxo `frontend -> API -> PostgreSQL`.
- Explique as responsabilidades de Misael, Nicolas e Pedro.

**Pause o vídeo e tente:** faça fork do repositório e localize os workflows.

## 2. Aplicação local

- Execute `npm ci`, migration, seed e `npm run dev`.
- Explique que o PostgreSQL local usa `localhost:5432` e o Compose publica o banco em
  `localhost:5433`.
- Entre com o administrador demonstrativo.
- Abra Dashboard, Análises e Detalhes.
- Compare `src/services/mockData.js` com `api/prisma/seedData.js`.

**Pause o vídeo e tente:** filtre eventos por intensidade.

## 3. Docker e PostgreSQL

- Explique cada serviço e health check do Compose.
- Execute `npm run docker:validate` e `npm run docker:up`.
- Compare `/health` e `/ready`.

**Pause o vídeo e tente:** pare o banco e observe `/ready` retornar 503 enquanto `/health` continua.

## 4. Testes, V&V e análise estática

- Execute `npm run test:coverage`.
- Mostre um teste web e um teste da API.
- Execute `npm run lint` e `npm run format:check`.

**Pause o vídeo e tente:** quebre a expectativa do `RiskCard`, execute testes e depois reverta.

## 5. GitHub Actions

- Abra `.github/workflows/ci.yml`.
- Mostre PostgreSQL, gates de qualidade, build e imagens Docker.
- Abra uma pull request com um teste propositalmente quebrado.
- Mostre que o merge deve ser bloqueado pela proteção de branch.

**Pause o vídeo e tente:** faça uma quebra de lint em uma branch própria e acompanhe o job.

## 6. Deploy opcional

- Abra <https://cuidar-plus-web.onrender.com> e percorra Dashboard, Detalhes e Análises.
- Valide `/health` e `/ready` em <https://cuidar-plus-api.onrender.com>.
- Mostre os recursos nativos `cuidar-plus-db`, `cuidar-plus-api` e `cuidar-plus-web`.
- Explique o Deploy Hook da API e o secret `RENDER_DEPLOY_HOOK_URL`.
- Mostre a sequência de um `CI` bem-sucedido seguida de `Optional Render Deploy`.
- Compare a API com Auto Deploy desativado ao Static Site com Auto Deploy ativo.
- Explique cold start e a expiração do PostgreSQL gratuito em 14 de julho de 2026.
- Apresente Railway Autodeploy + Wait for CI como alternativa.

## 7. Encerramento

- Recapitule infraestrutura, V&V, CI e cloud.
- Reforce que secrets nunca pertencem ao código.
- Mostre como restaurar o dataset com `npm run db:seed`.
