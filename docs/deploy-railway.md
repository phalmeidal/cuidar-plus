# Deploy alternativo no Railway

O Railway pode ser usado sem adicionar outro workflow de deploy:

1. Crie um projeto e um PostgreSQL.
2. Conecte o repositório GitHub.
3. Crie um serviço para a API com `Dockerfile.api`.
4. Crie um serviço para o frontend com `Dockerfile.web`.
5. Configure `DATABASE_URL`, `PORT`, `NODE_ENV` e `VITE_API_URL`.
6. Ative GitHub Autodeploy e a opção **Wait for CI**.

Assim, o Railway só publica commits aceitos pelo GitHub Actions. Nenhum token Railway precisa ser
armazenado no repositório.
