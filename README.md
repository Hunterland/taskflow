# TaskFlow - Painel de Gestão de Projetos e Tarefas

[ [ [ [

**TaskFlow** é um sistema fullstack didático para aprender arquitetura modular profissional com **NestJS + Angular + Prisma + PostgreSQL**. Um mini-Trello para freelancers gerenciarem projetos e tarefas com autenticação JWT e kanban simples.

## 🎯 Visão do Produto

Um painel web para **freelancers e pequenas equipes** organizarem projetos e tarefas diárias, com:
- Autenticação segura (JWT)
- Múltiplos projetos por usuário
- Kanban simples por projeto (Todo → In Progress → Done)
- Design responsivo com Tailwind CSS

**Casos de uso principais:**
1. Registrar/login na plataforma
2. Criar projetos para clientes
3. Adicionar tarefas com status e responsáveis
4. Visualizar quadro kanban por projeto

## 🏗️ Arquitetura & Tecnologias

```
Frontend: Angular 19 + Tailwind CSS + Standalone Components
Backend:  NestJS 11 + Prisma ORM + JWT Auth
Database: PostgreSQL 18.2.1
DevOps:  Docker (opcional) + Git
```

### Estrutura Modular
```
backend/     # NestJS (auth, users, projects, tasks, core)
frontend/    # Angular (core, shared, auth, dashboard, projects, tasks)
prisma/      # Schema + migrations
```

## 🚀 Instalação Rápida

### Pré-requisitos
```bash
Node.js 20+ | PostgreSQL 18+ | Angular CLI | Nest CLI | Git
```

### 1. Clonar e instalar
```bash
git clone <repo>
cd taskflow

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Configurar banco
```bash
# PostgreSQL local (porta 5432)
psql -U postgres -c "CREATE DATABASE taskflow;"

# Backend
cd backend
cp .env.example .env
# Editar .env → DATABASE_URL com sua senha PostgreSQL
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Rodar projeto
```bash
# Terminal 1: Backend
cd backend
npm run start:dev           # http://localhost:3000

# Terminal 2: Frontend  
cd frontend
ng serve                    # http://localhost:4200
```

## 📁 Estrutura de Pastas

### Backend (NestJS Modular)
```
src/
├── auth/          # Login, register, JWT
├── users/         # CRUD usuários
├── projects/      # Projetos + owner
├── tasks/         # Tarefas + kanban
├── core/          # PrismaService, guards
└── shared/        # DTOs, decorators
```

### Frontend (Angular Standalone)
```
src/app/
├── core/          # AuthService, interceptors
├── shared/        # Header, sidebar, buttons
├── auth/          # Login/register pages
├── dashboard/     # Home pós-login
├── projects/      # Lista + formulários
└── tasks/         # Kanban com drag/drop
```

## 🗄️ Modelo de Dados (Prisma)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      UserRole @default(USER)
  
  projects  Project[] # Projetos como owner
  tasks     Task[]    # Tarefas como assignee
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id])
  tasks       Task[]
}

model Task {
  id          Int         @id @default(autoincrement())
  title       String
  status      TaskStatus  @default(TODO) # TODO | IN_PROGRESS | DONE
  projectId   Int
  project     Project     @relation(fields: [projectId], references: [id])
  assigneeId  Int?
  assignee    User?       @relation(fields: [assigneeId], references: [id])
}
```

## 📋 API Endpoints

| Método | Endpoint                        | Descrição              | Auth |
|--------|---------------------------------|------------------------|------|
| POST   | `/auth/register`                | Criar conta            | -    |
| POST   | `/auth/login`                   | Login + JWT            | -    |
| GET    | `/projects`                     | Meus projetos          | ✅   |
| POST   | `/projects`                     | Criar projeto          | ✅   |
| POST   | `/projects/:id/tasks`           | Criar tarefa           | ✅   |
| PATCH  | `/projects/:id/tasks/:id`       | Atualizar tarefa/status| ✅   |

## 🛠️ Scripts Úteis

```bash
# Desenvolvimento
npm run start:dev    # Backend dev + hot reload
ng serve             # Frontend dev

# Banco
npx prisma migrate dev     # Nova migração
npx prisma studio          # Interface gráfica
npx prisma db push         # Sync rápido (dev)

# Build produção
npm run build             # Backend
ng build                  # Frontend
npm run start:prod        # Backend produção
```

## 📊 Kanban de Desenvolvimento

| Backlog | Em Progresso | Concluído |
|---------|--------------|-----------|
| Tasks module | Auth module | ✅ Setup<br>✅ Banco<br>✅ Backend base |

**Próximo:** JWT Auth → Users → Projects → Tasks → Frontend

## 🤝 Contribuição

1. Fork o projeto
2. Crie branch `feat/nome-da-feature`
3. Commit com mensagens claras
4. Pull Request para `main`

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE)

## 👨‍💻 Autor

**Alan Barroncas** - Fullstack Developer  
💃 Artista/B-boy | Manaus, AM | [GitHub](https://github.com/alanbarroncas)

***

<div align="center">
  <br/>
  <small>Feito com ❤️ para aprender arquitetura fullstack moderna</small>
</div>
