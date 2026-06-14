# AGENTS.md

## Estrutura

- `src/`: frontend Vite/React e mocks originais de referência.
- `api/src/`: API Express, serviço de monitoramento e Prisma.
- `api/prisma/`: schema, migration, seed e dados didáticos preservados.
- `tests/web/` e `tests/api/`: testes automatizados.
- `.github/workflows/`: CI e deploy Render opcional.
- `docs/`: material do seminário e deploy.

## Comandos

```bash
npm run dev
npm run test
npm run test:coverage
npm run lint
npm run format:check
npm run build
npm run db:generate
npm run db:deploy
npm run db:seed
npm run docker:validate
npm run docker:up
npm run docker:down
```

## Convenções

- Mantenha o código explícito e fácil de apresentar em aula.
- Preserve a identidade visual e as telas do Cuidar+.
- Use variáveis de ambiente; nunca versione credenciais ou hooks reais.
- Mantenha `/health` independente do banco e `/ready` dependente do PostgreSQL.
- Atualize migration e seed quando o schema mudar.
- Preserve `src/services/mockData.js` e `api/prisma/seedData.js` como material didático.
- Use PostgreSQL local em `localhost:5432` e o PostgreSQL publicado pelo Compose em
  `localhost:5433`.
- Use `.env.local` apenas localmente; os scripts carregam `.env` e `.env.local`.
- Não adicione autenticação complexa ou Kubernetes.

## Definition of Done

- Formatação, lint, testes e build passam.
- Migrations e seed funcionam contra PostgreSQL.
- `npm run docker:validate` passa.
- Compose completo é validado quando Docker está disponível.
- `/health`, `/ready` e as telas principais são validados com PostgreSQL real.
- CI continua funcionando sem secrets de deploy.
- Documentação acompanha mudanças de comandos ou arquitetura.
