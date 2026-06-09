# api-test

Projeto de exemplo utilizando **Express** e o ORM **Orion** (`@wrsouza/orion`) com banco de dados PostgreSQL. Demonstra o uso do ORM em um cenário real com relacionamentos `HasMany`, `BelongsTo` e `BelongsToMany`, incluindo factories, seeders e migrações.

---

## Tecnologias

- [Node.js](https://nodejs.org) + TypeScript
- [Express 5](https://expressjs.com)
- [@wrsouza/orion](https://www.npmjs.com/package/@wrsouza/orion) — ORM para PostgreSQL
- [PostgreSQL](https://www.postgresql.org)
- [Docker](https://www.docker.com) (banco de dados)
- [Faker.js](https://fakerjs.dev) (dados de teste)

---

## Estrutura do projeto

```
src/
├── server.ts                        # Entry point da aplicação Express
├── database.ts                      # Configuração da conexão com o banco
├── database/
│   ├── migrations/                  # Migrações do banco de dados
│   ├── models/                      # Models do ORM (User, Post, Category)
│   ├── factories/                   # Factories para geração de dados falsos
│   └── seeders/                     # Seeders para popular o banco
├── routes/
│   ├── index.ts
│   ├── users.route.ts
│   ├── posts.route.ts
│   └── categories.route.ts
└── services/
    └── bcrypt.service.ts            # Hash e comparação de senhas
```

---

## Esquema das tabelas

### `users`

| Coluna       | Tipo          | Restrições              |
|--------------|---------------|-------------------------|
| id           | UUID          | PK                      |
| name         | VARCHAR(100)  | NOT NULL                |
| email        | VARCHAR(255)  | NOT NULL, UNIQUE        |
| password     | VARCHAR(255)  |                         |
| created_at   | TIMESTAMP     |                         |
| updated_at   | TIMESTAMP     |                         |

### `posts`

| Coluna       | Tipo          | Restrições                           |
|--------------|---------------|--------------------------------------|
| id           | UUID          | PK                                   |
| user_id      | UUID          | NOT NULL, FK → users(id) ON DELETE CASCADE |
| title        | VARCHAR(255)  | NOT NULL                             |
| body         | TEXT          |                                      |
| published    | BOOLEAN       | DEFAULT false                        |
| published_at | TIMESTAMP     |                                      |
| created_at   | TIMESTAMP     |                                      |
| updated_at   | TIMESTAMP     |                                      |

### `categories`

| Coluna       | Tipo          | Restrições              |
|--------------|---------------|-------------------------|
| id           | UUID          | PK                      |
| name         | VARCHAR(50)   | NOT NULL                |
| slug         | VARCHAR(100)  | NOT NULL, UNIQUE        |
| description  | VARCHAR(255)  |                         |
| is_active    | BOOLEAN       | DEFAULT false           |
| created_at   | TIMESTAMP     |                         |
| updated_at   | TIMESTAMP     |                         |

### `category_post` (tabela pivot)

| Coluna       | Tipo | Restrições                                  |
|--------------|------|---------------------------------------------|
| category_id  | UUID | FK → categories(id) ON DELETE CASCADE       |
| post_id      | UUID | FK → posts(id) ON DELETE CASCADE            |

---

## Relacionamentos entre as tabelas

```
users ──< posts >──< category_post >──< categories
```

| De         | Para       | Tipo           | Descrição                                  |
|------------|------------|----------------|--------------------------------------------|
| User       | Post       | HasMany        | Um usuário possui muitos posts             |
| Post       | User       | BelongsTo      | Um post pertence a um usuário              |
| Post       | Category   | BelongsToMany  | Um post pode ter muitas categorias         |
| Category   | Post       | BelongsToMany  | Uma categoria pode ter muitos posts        |

O relacionamento `Post ↔ Category` é gerenciado pela tabela pivot `category_post`.

---

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o banco de dados PostgreSQL via Docker

```bash
docker-compose up -d
```

Isso cria um container PostgreSQL com:
- **Host:** `localhost`
- **Porta:** `5432`
- **Banco:** `myapp`
- **Usuário:** `postgres`
- **Senha:** `postgres`

### 3. Executar as migrações

```bash
npm run migrate
```

Para verificar o status das migrações:

```bash
npm run migrate:status
```

Para rollback da última batch:

```bash
npm run migrate:rollback
```

Para resetar tudo (rollback completo + re-run):

```bash
npm run migrate:reset
```

### 4. Executar o seed

```bash
npm run seed
```

O seed cria:
- **5 usuários**, cada um com **2 posts** (10 posts no total)
- **5 categorias**, cada uma associada a ~5 posts aleatórios

### 5. Iniciar o servidor

```bash
npm run dev
```

O servidor sobe na porta `3000` (configurável via variável `PORT`).

Acesse: `http://localhost:3000`

---

## Variáveis de ambiente

| Variável    | Padrão      | Descrição               |
|-------------|-------------|-------------------------|
| DB_HOST     | localhost   | Host do PostgreSQL      |
| DB_PORT     | 5432        | Porta do PostgreSQL     |
| DB_USER     | postgres    | Usuário do banco        |
| DB_PASSWORD | postgres    | Senha do banco          |
| DB_NAME     | myapp       | Nome do banco           |
| PORT        | 3000        | Porta da API            |

---

## Rotas da API

### Health check

```
GET /
```

---

### Users

| Método | Rota          | Descrição                          |
|--------|---------------|------------------------------------|
| GET    | /users        | Lista todos os usuários            |
| POST   | /users        | Cria um novo usuário               |
| GET    | /users/:id    | Busca usuário com seus posts       |
| PUT    | /users/:id    | Atualiza um usuário                |
| DELETE | /users/:id    | Remove um usuário                  |

---

### Posts

| Método | Rota                           | Descrição                                         |
|--------|--------------------------------|---------------------------------------------------|
| GET    | /posts                         | Lista todos os posts com o usuário                |
| POST   | /posts                         | Cria um novo post                                 |
| GET    | /posts/:id                     | Busca post com usuário e categorias               |
| PUT    | /posts/:id                     | Atualiza um post                                  |
| DELETE | /posts/:id                     | Remove um post                                    |
| POST   | /posts/:id/categories          | Adiciona uma categoria ao post                    |
| PUT    | /posts/:id/categories          | Substitui todas as categorias do post             |
| DELETE | /posts/:id/categories/:catId   | Remove uma categoria do post                      |

#### POST /posts/:id/categories — body

```json
{ "category_id": "uuid-da-categoria" }
```

#### PUT /posts/:id/categories — body

```json
{ "category_ids": ["uuid-1", "uuid-2"] }
```

---

### Categories

| Método | Rota                              | Descrição                                      |
|--------|-----------------------------------|------------------------------------------------|
| GET    | /categories                       | Lista todas as categorias com seus posts       |
| POST   | /categories                       | Cria uma nova categoria                        |
| GET    | /categories/:id                   | Busca categoria com seus posts                 |
| PUT    | /categories/:id                   | Atualiza uma categoria                         |
| DELETE | /categories/:id                   | Remove uma categoria                           |
| POST   | /categories/:id/posts             | Adiciona um post à categoria                   |
| PUT    | /categories/:id/posts             | Substitui todos os posts da categoria          |
| DELETE | /categories/:id/posts/:postId     | Remove um post da categoria                    |

#### POST /categories/:id/posts — body

```json
{ "post_id": "uuid-do-post" }
```

#### PUT /categories/:id/posts — body

```json
{ "post_ids": ["uuid-1", "uuid-2"] }
```

---

## Exemplo de uso do Orion ORM

### Definindo um Model

```typescript
import { Model, BelongsToMany, HasMany, BelongsTo } from '@wrsouza/orion';

@table('posts')
export class Post extends Model {
  @uuid() id!: string;
  @map('user_id') userId!: string;
  title!: string;
  body!: string | null;

  user(): BelongsTo<User> {
    return this.belongsTo(User, 'userId');
  }

  categories(): BelongsToMany<Category> {
    return this.belongsToMany(Category, 'category_post', 'post_id', 'category_id').withoutPivot();
  }
}
```

### Queries comuns

```typescript
// Listar com relacionamento
const posts = await Post.with(['user', 'categories']).orderBy('createdAt', 'desc').get();

// Buscar por id
const post = await Post.find(id);

// Criar
const post = await Post.create({ userId, title, body });

// Atualizar
await post.update({ title: 'Novo título' });

// Deletar
await post.delete();

// Gerenciar many-to-many
await post.categories().attach([categoryId]);        // adiciona
await post.categories().detach([categoryId]);        // remove um
await post.categories().detach();                    // remove todos
```
