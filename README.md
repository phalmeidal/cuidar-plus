# Cuidar+ - Minicurso DevOps com GitHub Actions

O Cuidar+ é um protótipo de monitoramento de quedas e mobilidade de pessoas idosas.
Este repositório transforma a interface React original em um projeto full stack didático para
demonstrar PostgreSQL, testes, análise estática, Docker, CI e deploy opcional.

## Objetivo do seminário

O projeto permite mostrar o ciclo completo de uma alteração:

```text
Código -> lint/testes/build -> Docker -> GitHub Actions -> deploy opcional
                     |
Frontend -> API Express -> Prisma -> PostgreSQL
```

Responsabilidades definidas na proposta:

- **Misael Fernandes:** Docker, Docker Compose e PostgreSQL.
- **Nicolas Marques:** testes, V&V e análise estática com ESLint.
- **Pedro Henrique Almeida:** GitHub Actions, orquestração e deploy cloud.

## Evolução dos mocks

Os mocks originais continuam em `src/services/mockData.js`. Uma cópia comentada em
`api/prisma/seedData.js` é usada pelo seed:

```text
mockData.js -> seedData.js -> PostgreSQL -> API -> useMonitoring -> telas React
```

Isso permite comparar o protótipo inicial com a versão persistida. `npm run db:seed` reinicia os
dados de demonstração.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL 16 para execução local sem Docker
- Docker Desktop para execução completa via Compose

No Windows, instale os requisitos em um PowerShell executado como administrador:

```powershell
winget install --id PostgreSQL.PostgreSQL.16 -e
wsl --install --no-distribution
winget install --id Docker.DockerDesktop -e
```

Reinicie o Windows quando solicitado pelo WSL/Docker Desktop. Abra o Docker Desktop e aguarde o
engine indicar que está em execução antes de usar Compose.

Copie `.env.example` para `.env.local` e ajuste somente quando necessário. Os scripts da API e do
Prisma carregam `.env` e depois `.env.local`; variáveis já definidas pelo CI ou Docker continuam
funcionando quando esses arquivos não existem. Nunca versione secrets.

## Execução sem Docker

Crie o usuário e banco locais no PostgreSQL:

No Windows, se `psql --version` não for reconhecido após a instalação, use o caminho completo:

```powershell
& 'C:\Program Files\PostgreSQL\16\bin\psql.exe' -U postgres
```

Informe a senha do usuário `postgres` definida no instalador e execute:

```sql
CREATE USER cuidar WITH PASSWORD 'cuidar';
CREATE DATABASE cuidar_plus OWNER cuidar;
```

Depois execute:

```bash
npm ci
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:3001>
- Health: <http://localhost:3001/health>
- Readiness: <http://localhost:3001/ready>

O login demonstrativo pode ser preenchido pela própria tela. A autenticação usa `localStorage` e
não deve ser usada como modelo de produção.

## Execução com Docker

```bash
npm run docker:validate
npm run docker:up
```

`docker compose up --build` inicia frontend, API e PostgreSQL. O banco local do Compose usa
`cuidar/cuidar` apenas para desenvolvimento e persiste no volume `cuidar_plus_db`.

Para permitir PostgreSQL local e Compose na mesma máquina sem ambiguidade:

- PostgreSQL instalado no Windows: `localhost:5432`.
- PostgreSQL do Compose: `localhost:5433`, encaminhado para a porta `5432` interna do container.

A API do Compose acessa `db:5432`; nenhum ajuste de `DATABASE_URL` é necessário dentro dos
containers.

Para encerrar:

```bash
npm run docker:down
```

## Endpoints

| Método | Endpoint         | Objetivo                                                       |
| ------ | ---------------- | -------------------------------------------------------------- |
| GET    | `/health`        | Confirma que o processo da API está ativo, sem acessar o banco |
| GET    | `/ready`         | Confirma conectividade com PostgreSQL                          |
| GET    | `/api/profile`   | Perfil da pessoa monitorada                                    |
| GET    | `/api/summary`   | Risco, quedas e conectividade atual                            |
| GET    | `/api/events`    | Eventos; filtros: `type`, `intensity`, `location`, `period`    |
| POST   | `/api/events`    | Cria um evento demonstrativo                                   |
| GET    | `/api/analytics` | Séries usadas pelos gráficos                                   |

Exemplo:

```bash
curl "http://localhost:3001/api/events?intensity=Alta&period=Noite"
```

## Scripts principais

| Comando                   | Função                                           |
| ------------------------- | ------------------------------------------------ |
| `npm run dev`             | Inicia frontend e API                            |
| `npm run build`           | Compila o frontend                               |
| `npm run test`            | Executa testes web e API                         |
| `npm run test:coverage`   | Executa testes com cobertura                     |
| `npm run lint`            | Executa análise estática                         |
| `npm run format:check`    | Verifica formatação                              |
| `npm run db:deploy`       | Aplica migrations existentes                     |
| `npm run db:seed`         | Restaura dados didáticos                         |
| `npm run docker:validate` | Valida sintaxe e estrutura do Compose sem Docker |

## Validação rápida no Windows

```powershell
psql --version
docker --version
docker compose version
docker run hello-world
npm run db:deploy
npm run db:seed
npm run docker:validate
docker compose config
```

Ao executar o Prisma diretamente em vez dos scripts do projeto, defina `DATABASE_URL` na sessão:

```powershell
$env:DATABASE_URL='postgresql://cuidar:cuidar@localhost:5432/cuidar_plus?schema=public'
npx prisma validate --schema api/prisma/schema.prisma
```

Se `psql` não estiver no `PATH`, use temporariamente
`C:\Program Files\PostgreSQL\16\bin\psql.exe` ou reabra o terminal após a instalação.

## GitHub Actions

`.github/workflows/ci.yml` roda em pull requests e pushes para `main`. Ele:

1. inicia PostgreSQL;
2. instala dependências com `npm ci`;
3. gera Prisma, aplica migrations e seed;
4. verifica formatação e lint;
5. executa testes e cobertura;
6. compila o frontend;
7. valida Compose e constrói as imagens.

O deploy Render é **opcional**. `.github/workflows/deploy-render.yml` roda somente após CI
bem-sucedido em `main`. Sem o secret `RENDER_DEPLOY_HOOK_URL`, ele executa um no-op informativo e
termina com sucesso. Consulte [docs/deploy-render.md](docs/deploy-render.md).

## Produção no Render

- Frontend: <https://cuidar-plus-web.onrender.com>
- API: <https://cuidar-plus-api.onrender.com>
- Health: <https://cuidar-plus-api.onrender.com/health>
- Readiness: <https://cuidar-plus-api.onrender.com/ready>

O ambiente usa PostgreSQL, Web Service Node e Static Site nativos do Render. A API tem Auto Deploy
desativado: após o CI concluir com sucesso em `main`, o workflow `Optional Render Deploy` aciona seu
Deploy Hook. O Static Site acompanha os commits da `main` pelo Auto Deploy do Render.

O plano gratuito pode suspender a API por inatividade, adicionando até cerca de 50 segundos à
primeira requisição. O PostgreSQL gratuito criado para o seminário expira em 14 de julho de 2026,
caso não seja migrado para outro plano ou recriado.

## Experimentos para o seminário

- **Quebrar teste:** altere `78` para `77` em `tests/web/RiskCard.test.jsx`.
- **Quebrar lint:** crie uma variável não utilizada.
- **Quebrar build:** importe um arquivo inexistente.
- **Quebrar Docker:** altere o nome de um Dockerfile no Compose.
- **Quebrar readiness:** pare PostgreSQL e compare `/health` com `/ready`.

Abra uma pull request após cada experimento e observe o GitHub Actions bloquear a alteração.
Desfaça a quebra antes do próximo exercício.

## Estratégia de qualidade

- Testes web usam Vitest, React Testing Library e jsdom.
- Testes da API usam Vitest, Supertest e banco falso injetado.
- O CI também aplica migrations e seed contra PostgreSQL real.
- ESLint é o bloqueio obrigatório de análise estática; Sonar pode ser adicionado futuramente.
- Prettier mantém a formatação consistente.

## Documentação complementar

- [Roteiro do seminário](docs/seminar-script.md)
- [Deploy opcional no Render](docs/deploy-render.md)
- [Deploy alternativo no Railway](docs/deploy-railway.md)
