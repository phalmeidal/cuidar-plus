# Deploy opcional no Render

O deploy no Render é opcional e não interfere no CI.

## Serviços sugeridos

1. Crie um PostgreSQL no Render.
2. Crie uma API usando `Dockerfile.api` e configure `DATABASE_URL`, `PORT=3001` e
   `NODE_ENV=production`.
3. Crie o frontend usando `Dockerfile.web` e informe `VITE_API_URL` como build arg apontando para a
   URL pública da API.

## Deploy hook

No serviço Render que deve iniciar o deploy, crie um **Deploy Hook**. No GitHub, abra:

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

## Sem configuração

Sem `RENDER_DEPLOY_HOOK_URL`, o job mostra:

```text
RENDER_DEPLOY_HOOK_URL is not configured; optional deployment skipped.
```

O workflow termina com sucesso sem efetuar deploy.
