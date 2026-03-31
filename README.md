# TaskFlow - Gerenciamento de Projetos e Tarefas

**TaskFlow** é um sistema fullstack didático para aprender **arquitetura modular NestJS** com **JWT Auth + Prisma + PostgreSQL**. Um mini-Trello para freelancers gerenciarem projetos e tarefas com RBAC, kanban e API documentada com Swagger.


## 🎯 Status Atual (Março 2026)

**✅ Backend MVP Completo** | **🔄 Frontend em Planejamento**
```
✅ Modularidade 100% (auth/users/projects/tasks/core)
✅ JWT Auth (register/login/refresh + guards)
✅ DTOs + Validation Pipes
✅ Exception Filter Global
✅ Swagger OpenAPI Documentada
✅ Prisma Schema + Migrations Pendentes
🔄 Rate Limiting + Jest Tests Pendentes
```

**API Swagger:** http://localhost:3000/api (após `npm run start:dev`)

## 🏗️ Stack Técnica

```
Backend:  NestJS 11 + Prisma ORM + JWT + Swagger
Database: PostgreSQL 18.2.1
Frontend: Angular 19 + Tailwind CSS (planejado)
DevOps:   Docker + Git + Postman/Swagger
```

## 🚀 Instalação & Execução

### Pré-requisitos
```bash
Node.js 20+ | PostgreSQL 18+ | Nest CLI | Angular CLI | Git
```

### 1. Clone e Instale
```bash
git clone https://github.com/Hunterland/taskflow.git
cd taskflow
git checkout master  # Default branch

# Backend
cd backend
npm install

# Frontend (futuro)
cd ../frontend
npm install
```

### 2. Configurar Banco
```bash
# PostgreSQL (porta 5432)
psql -U postgres -c "CREATE DATABASE taskflow_dev;"

# Backend
cd backend
cp .env.example .env
# Edite .env → DATABASE_URL="postgresql://user:senha@localhost:5432/taskflow_dev"
npx prisma migrate dev --name init-taskflow
npx prisma generate
```

### 3. Rodar
```bash
# Backend + Swagger
cd backend
npm run start:dev  # http://localhost:3000 | Swagger: /api

# Testes API (Postman/Swagger)
POST /auth/register  # {name:"Test",email:"test@test.com",password:"123456"}
POST /auth/login     # Retorna JWT tokens
GET /projects        # Authorization: Bearer <token>
```

## 📁 Estrutura Backend (NestJS Modular)

```
src/
├── auth/           # JWT Login/register/refresh
├── users/          # CRUD users + RBAC (ADMIN)
├── projects/       # CRUD projects (owner-only)
├── tasks/          # CRUD tasks + kanban filters
├── core/prisma/    # PrismaService
├── common/filters/ # HttpExceptionFilter global
└── shared/dto/     # DTOs + Pipes
```

## 🔑 Autenticação JWT

**Fluxo completo:**
1. `POST /auth/register` → User + tokens
2. `POST /auth/login` → AccessToken (15min) + RefreshToken (7d)
3. `Authorization: Bearer <accessToken>` em rotas protegidas
4. `POST /auth/refresh` → Novo accessToken

**Guards aplicados:**
- `JwtAuthGuard` → Todas rotas `/users/projects/tasks`
- `RolesGuard + @Roles('ADMIN')` → `GET /users` e `PATCH /users/:id`

## 📋 API Endpoints (Swagger: /api)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Criar conta | - |
| POST | `/auth/login` | Login JWT | - |
| POST | `/auth/refresh` | Renovar token | - |
| GET | `/users/me` | Dados usuário logado | ✅ |
| GET | `/users` | Todos usuários (ADMIN) | ✅ |
| GET | `/projects` | Meus projetos | ✅ |
| POST | `/projects` | Criar projeto | ✅ |
| GET | `/projects/:id` | Detalhes projeto | ✅ |
| GET | `/tasks` | Minhas tasks | ✅ |
| GET | `/tasks/my-tasks?status=TODO` | Tasks atribuídas | ✅ |
| GET | `/tasks/project/:projectId` | Kanban por projeto | ✅ |

## 🗄️ Schema Prisma (Atual)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      UserRole @default(USER)
  projects  Project[]
  tasks     Task[]
}

model Project {
  id        Int      @id @default(autoincrement())
  name      String
  ownerId   Int
  owner     User     @relation(fields: [ownerId], references: [id])
  tasks     Task[]
}

model Task {
  id          Int         @id @default(autoincrement())
  title       String
  status      TaskStatus  @default(TODO)
  projectId   Int
  project     Project     @relation(fields: [projectId], references: [id])
  assigneeId  Int?
  assignee    User?       @relation(fields: [assigneeId], references: [id])
}
```

## 🛠️ Scripts de Desenvolvimento

```bash
# Backend
npm run start:dev    # Dev + hot reload + Swagger
npm run start:prod   # Produção
npx prisma studio    # Banco GUI
npx prisma migrate dev --name nome_da_migracao
npm run test:cov     # Jest coverage (futuro)

# Frontend (futuro)
ng serve             # http://localhost:4200
ng build             # Produção
```

## 📊 Checklist Backend

| Item | Status | Comando |
|------|--------|---------|
| Modularidade | ✅ 100% | - |
| JWT Auth | ✅ Completo | /auth/register/login/refresh |
| DTOs + Pipes | ✅ 100% | ValidationPipe global |
| Exception Filter | ✅ Testado | JSON padronizado 404/500 |
| Swagger | ✅ Completo | /api com @ApiTags/@ApiOperation |
| Rate Limiting | 🔄 Pendente | `@nestjs/throttler` |
| Jest Tests | 🔄 Pendente | `npm run test:cov` |
| Prisma Migrations | ❓ Verificar | `npx prisma migrate dev` |

## 🤝 Contribuir

1. `git checkout -b feat/nova-feature`
2. Commit claro: `feat: adicionar rate limiting`
3. Teste: `npm run start:dev` + Swagger
4. PR para `master`

## 📄 Licença
MIT - Veja [LICENSE](LICENSE)

## 👨‍💻 Autor
**Alan Barroncas** - Fullstack Dev  
Manaus, AM | [GitHub](https://github.com/Hunterland) | [LinkedIn](https://linkedin.com/in/alanbarroncas)
