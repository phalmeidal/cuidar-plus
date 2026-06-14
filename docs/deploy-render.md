# Deploy no Render

Ambiente publicado:

- Frontend: <https://cuidar-plus-web.onrender.com>
- API: <https://cuidar-plus-api.onrender.com>
- PostgreSQL: `cuidar-plus-db`, acessível internamente pela API

Os três recursos usam serviços nativos do Render, sem Docker:

| Recurso     | Configuração                                                      |
| ----------- | ----------------------------------------------------------------- |
| PostgreSQL  | PostgreSQL 16, plano Free, banco `cuidar_plus`                    |
| API Node    | Build `npm ci && npm run db:generate`                             |
| API Node    | Start `npm run db:deploy && npm run db:seed && npm run start:api` |
| Static Site | Build `npm ci && npm run build`                                   |
| Static Site | Publish directory `dist`                                          |

Variáveis configuradas, sem registrar valores sensíveis:

- API: `NODE_ENV`, `DATABASE_URL`
- Frontend: `VITE_API_URL`

O seed é transacional. Assim, reinícios e cold starts restauram os dados didáticos sem expor um
estado parcialmente apagado para a API.

## Deploy hook

O Auto Deploy da API está desativado. No GitHub, o secret `RENDER_DEPLOY_HOOK_URL` contém o Deploy
Hook privado da API:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

Crie o secret `RENDER_DEPLOY_HOOK_URL` com a URL completa do hook.

`.github/workflows/deploy-render.yml`:

- roda somente após o workflow `CI` terminar com sucesso em `main`;
- não faz checkout do código;
- expõe o secret como variável de ambiente;
- não referencia `secrets` diretamente em condicionais `if`;
- executa um no-op informativo quando o secret não existe.

Nunca coloque a URL do hook em arquivos, logs ou pull requests.

O Static Site mantém Auto Deploy em `main`. Isso separa a demonstração: a API exemplifica CD
controlado pelo GitHub Actions, enquanto o frontend exemplifica o Auto Deploy nativo do Render.

## Validação

Endpoints públicos:

```text
GET https://cuidar-plus-api.onrender.com/health
GET https://cuidar-plus-api.onrender.com/ready
GET https://cuidar-plus-api.onrender.com/api/profile
GET https://cuidar-plus-api.onrender.com/api/summary
GET https://cuidar-plus-api.onrender.com/api/events
GET https://cuidar-plus-api.onrender.com/api/analytics
```

Todos devem retornar HTTP 200. O frontend deve carregar Dashboard, Detalhes e Análises com esses
dados.

## Limitações gratuitas

- A API pode suspender por inatividade e levar cerca de 50 segundos para responder novamente.
- O banco gratuito criado em 14 de junho de 2026 expira em 14 de julho de 2026.
- O Pre-Deploy Command é pago, então migrations e seed são executados no Start Command.
- Sem `RENDER_DEPLOY_HOOK_URL`, o workflow continua bem-sucedido e informa que o deploy opcional foi
  ignorado.
