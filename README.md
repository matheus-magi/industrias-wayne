# Sistema de Inventário - Indústrias Wayne

## Descrição

Sistema de gerenciamento de inventário desenvolvido para praticar desenvolvimento Full Stack com JavaScript, Node.js, Express e MySQL.

O projeto está sendo construído gradualmente e faz parte do meu portfólio de estudos.

## Status

Em desenvolvimento.

### Funcionalidades implementadas

- Login com autenticação utilizando MySQL
- API de inventário
  - Listagem de itens
  - Cadastro de itens
  - Edição de itens
  - Exclusão de itens
- Validação dos dados enviados pelo cliente
- Organização do backend em rotas e conexão separada com o banco de dados

### Próximas etapas

- Desenvolver a interface de gerenciamento do inventário
- Integrar completamente o frontend com a API
- Implementar gerenciamento de usuários
- Melhorar o layout da aplicação
- Publicar o projeto

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Express
- MySQL
- Git

## Como executar

1. Clone o repositório.
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=industriaswayne
```

4. Execute os scripts localizados em `database/scripts` na seguinte ordem:

- `create_tables.sql`
- `inserts.sql`

5. Inicie o servidor:

```bash
node --watch app.js
```