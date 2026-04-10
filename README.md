# TaskFlow - Gerenciamento de Projetos e Tarefas

**TaskFlow** é um sistema fullstack didático para estudar **arquitetura modular com NestJS** no backend e **Angular** no frontend. A proposta é simular um mini-Trello para freelancers gerenciarem projetos e tarefas com autenticação JWT, RBAC, organização modular, dashboard autenticado e API documentada com Swagger.

## 🎯 Status Atual (Abril 2026)

**✅ Backend MVP funcional** | **✅ Frontend iniciado e autenticado**
```txt
Backend
✅ Modularidade por domínio (auth/users/projects/tasks/core)
✅ JWT Auth (register/login/refresh + guards)
✅ DTOs + Validation Pipes
✅ Exception Filter Global
✅ Swagger/OpenAPI
🔄 Rate Limiting pendente
🔄 Testes automatizados pendentes
🔄 Prisma Migrations pendentes de revisão

Frontend
✅ Angular configurado e rodando
✅ Tela de login funcional
✅ Integração com backend de autenticação
✅ Redirecionamento após login para /dashboard
✅ Toast customizado com ngx-toastr
✅ NotificationService para padronizar alertas
🔄 Dashboard em evolução
🔄 Módulos de projetos e tarefas em construção
```

**Swagger da API:** `http://localhost:3000/api` após subir o backend.

## 🏗️ Stack Técnica

```txt
Backend:  NestJS 11 + Prisma ORM + JWT + Swagger
Database: PostgreSQL 18
Frontend: Angular 21 + Tailwind CSS + ngx-toastr
DevOps:   Git + Docker + Postman/Swagger
```

## 🚀 Instalação & Execução

### Pré-requisitos
```bash
Node.js 20+ | PostgreSQL 18+ | Nest CLI | Angular CLI | Git
```

### 1. Clone e instale
```bash
git clone https://github.com/Hunterland/taskflow.git
cd taskflow
git checkout master

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar banco
```bash
# PostgreSQL
psql -U postgres -c "CREATE DATABASE taskflow_dev;"

# Backend
cd backend
cp .env.example .env
```

Depois edite o `.env` com sua conexão PostgreSQL, por exemplo:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/taskflow_dev"
JWT_SECRET="sua_chave_jwt"
JWT_REFRESH_SECRET="sua_chave_refresh"
```

As migrations Prisma ainda devem ser revisadas e executadas conforme o estado atual do projeto.

### 3. Rodar o projeto
```bash
# Backend
cd backend
npm run start:dev
```

Backend disponível em:
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

```bash
# Frontend
cd frontend
ng serve
```

Frontend disponível em:
- App: `http://localhost:4200`

## 📁 Estrutura do Projeto

### Backend
```txt
src/
├── auth/           # JWT login/register/refresh
├── users/          # Usuários + RBAC
├── projects/       # CRUD de projetos
├── tasks/          # CRUD de tarefas + filtros
├── core/prisma/    # PrismaService
├── common/filters/ # HttpExceptionFilter global
└── shared/dto/     # DTOs + validação
```

### Frontend
```txt
src/app/
├── core/
│   ├── services/       # auth.service, notification.service
│   └── interceptors/   # auth.interceptor
├── features/
│   └── auth/           # login
├── dashboard/          # tela autenticada inicial
└── app.config.ts       # providers globais
```

## 🔐 Autenticação JWT

Fluxo atual de autenticação:
1. `POST /auth/register` cria usuário e retorna tokens.
2. `POST /auth/login` autentica e retorna access token e refresh token.
3. Rotas protegidas usam `Authorization: Bearer <token>`.
4. `POST /auth/refresh` emite novo access token.

No frontend, o login já está integrado e funcionando com redirecionamento para `/dashboard` após autenticação bem-sucedida.

## 📋 Endpoints principais

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Criar conta | - |
| POST | `/auth/login` | Login JWT | - |
| POST | `/auth/refresh` | Renovar token | - |
| GET | `/users/me` | Dados do usuário autenticado | ✅ |
| GET | `/users` | Listar usuários (ADMIN) | ✅ |
| GET | `/projects` | Listar meus projetos | ✅ |
| POST | `/projects` | Criar projeto | ✅ |
| GET | `/projects/:id` | Detalhes do projeto | ✅ |
| GET | `/tasks` | Listar tarefas | ✅ |
| GET | `/tasks/my-tasks?status=TODO` | Tarefas atribuídas | ✅ |
| GET | `/tasks/project/:projectId` | Tarefas por projeto | ✅ |

Os endpoints acima já fazem parte da estrutura atual documentada do backend MVP.

## 🗄️ Schema Prisma

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

Esse schema representa a base atual do domínio de usuários, projetos e tarefas usada no MVP.

## 🖥️ Progresso do Frontend

O frontend já saiu do estágio de planejamento inicial e agora possui:
- tela de login integrada ao backend;
- autenticação funcional;
- redirecionamento para dashboard após login;
- feedback visual com toast customizado;
- serviço central de notificação para padronizar alertas da aplicação.

Exemplo de credencial usada em testes locais:
- Email: `test2@taskflow.com`
- Senha: `123456`

## 🛠️ Scripts úteis

### Backend
```bash
npm run start:dev
npm run start:prod
npx prisma studio
npx prisma migrate dev --name nome_da_migracao
npm run test:cov
```

### Frontend
```bash
ng serve
ng build
npm test
```

## 📊 Checklist atual

| Item | Status |
|---|---|
| Backend modular | ✅ |
| JWT Auth | ✅ |
| Swagger | ✅ |
| Exception Filter global | ✅ |
| Frontend Angular iniciado | ✅ |
| Login integrado | ✅ |
| Dashboard autenticado | ✅ |
| Toast customizado | ✅ |
| NotificationService | ✅ |
| Rate limiting | 🔄 |
| Testes automatizados | 🔄 |
| Revisão de migrations Prisma | 🔄 |

O backend segue funcional para MVP, enquanto o frontend já começou a consolidar a camada de autenticação e feedback visual.

## 🤝 Contribuição

1. Crie uma branch:
```bash
git checkout -b feat/nova-feature
```

2. Faça commits descritivos:
```bash
feat: adicionar dashboard autenticado
fix: ajustar toast de login
```

3. Teste localmente backend e frontend antes de abrir PR para `master`.

## 📄 Licença
MIT - veja o arquivo [LICENSE](LICENSE)

## 👨‍💻 Autor

**Alan Barroncas**  
Fullstack Developer  
Manaus - AM  
GitHub: https://github.com/Hunterland  
LinkedIn: https://linkedin.com/in/alanbarroncas
