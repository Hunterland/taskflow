# TaskFlow - Gerenciamento de Projetos e Tarefas

**TaskFlow** é um sistema fullstack didático para estudar **arquitetura modular com NestJS** no backend e **Angular** no frontend. A proposta é simular um mini-Trello para freelancers gerenciarem projetos e tarefas com autenticação JWT, RBAC, organização modular, dashboard autenticado e API documentada com Swagger.

## 🎯 Status Atual (Abril 2026)

**✅ Backend MVP funcional** | **✅ Frontend autenticado com área logada estruturada**.

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
✅ DashboardLayout com header + sidebar + router-outlet
✅ Dashboard autenticado com resumo do usuário e KPIs iniciais
🔄 Dashboard em evolução com dados reais
🔄 Módulos de projetos e tarefas em construção
🔄 Kanban com drag and drop planejado para Tasks
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
│   ├── guards/             # auth.guard, admin.guard, guest.guard
│   ├── interceptors/       # auth.interceptor
│   └── services/           # auth.service, notification.service
├── features/
│   ├── admin/              # telas administrativas
│   ├── auth/               # login e register
│   ├── dashboard/          # home autenticada
│   ├── projects/           # módulo de projetos (em evolução)
│   └── tasks/              # módulo de tarefas (em evolução)
├── shared/
│   └── components/
│       ├── dashboard-layout/ # shell da área autenticada
│       ├── header/           # topo da área logada
│       └── sidebar/          # navegação lateral
├── app.config.ts
├── app.routes.ts
└── app.ts
```

A estrutura atual do frontend foi reorganizada para separar **layout compartilhado** e **features**, mantendo `header`, `sidebar` e `dashboard-layout` como componentes reutilizáveis da área autenticada.

## 🔐 Autenticação JWT

Fluxo atual de autenticação:
1. `POST /auth/register` cria usuário e retorna tokens.
2. `POST /auth/login` autentica e retorna access token e refresh token.
3. Rotas protegidas usam `Authorization: Bearer <token>`.
4. `POST /auth/refresh` emite novo access token.[1]

No frontend, o login já está integrado e funcionando com redirecionamento para `/dashboard` após autenticação bem-sucedida, além de persistência dos dados do usuário autenticado para exibição no dashboard.

## 🧭 Área autenticada no frontend

A aplicação frontend agora utiliza um **layout pai** para a área protegida, composto por:
- `DashboardLayoutComponent`
- `HeaderComponent`
- `SidebarComponent`
- `router-outlet` para renderização das páginas internas.

Com isso, a rota `/dashboard` deixou de ser apenas uma tela isolada e passou a fazer parte de uma estrutura comum reutilizável para futuras páginas como `/projects`, `/tasks` e `/admin`.

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

Os endpoints acima já fazem parte da estrutura atual documentada do backend MVP e sustentam a evolução futura das telas de Dashboard, Projects e Tasks.

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

O frontend já saiu do estágio inicial e agora possui:
- tela de login integrada ao backend;
- autenticação funcional;
- redirecionamento para dashboard após login;
- feedback visual com toast customizado;
- serviço central de notificação para padronizar alertas da aplicação;
- área autenticada estruturada com sidebar e header;
- dashboard com KPIs iniciais, resumo do usuário e ações rápidas.

Atualmente, a Dashboard cumpre o papel de **visão geral do sistema**, enquanto o fluxo de operação mais pesado, como **Kanban com drag and drop**, está planejado para a futura tela de Tasks, não para a tela inicial.

Exemplo de credencial usada em testes locais:
- Email: `test2@taskflow.com`
- Senha: `123456`

## 🛣️ Roadmap por prioridade

### Alta prioridade
- Finalizar Dashboard com dados reais, próximos prazos e atividade recente.
- Criar página de Projects com listagem básica.
- Criar página de Tasks com listagem inicial antes do Kanban.

### Média prioridade
- Evoluir Tasks para board Kanban.
- Implementar drag and drop entre colunas e persistência no backend.
- Adicionar filtros por status, prioridade e prazo.
- Expandir a área administrativa com funcionalidades reais.

### Baixa prioridade
- Adicionar gráficos e relatórios mais ricos na Dashboard.
- Criar notificações mais avançadas e alertas contextuais.
- Refinar microinterações, polimento visual e responsividade final.

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
| DashboardLayout com header/sidebar | ✅ |
| Toast customizado | ✅ |
| NotificationService | ✅ |
| Página Projects | 🔄 |
| Página Tasks | 🔄 |
| Kanban com drag and drop | 🔄 |
| Rate limiting | 🔄 |
| Testes automatizados | 🔄 |
| Revisão de migrations Prisma | 🔄 |

O backend segue funcional para MVP, enquanto o frontend já consolidou autenticação, estrutura visual da área logada e uma dashboard inicial, preparando o terreno para os módulos de projetos e tarefas.

## 🤝 Contribuição

1. Crie uma branch:
```bash
git checkout -b feat/nova-feature
```

2. Faça commits descritivos:
```bash
feat: adicionar dashboard autenticado
feat: estruturar dashboard-layout com sidebar e header
fix: ajustar role do usuário no dashboard
```

3. Teste localmente backend e frontend antes de abrir PR para `master`.

## 📄 Licença
MIT - veja o arquivo [LICENSE](LICENSE)

## 👨‍💻 Autor

**Alan Barroncas**  
Fullstack Developer  
Manaus - AM  
GitHub: [https://github.com/Hunterland](https://github.com/Hunterland)  
LinkedIn: [https://linkedin.com/in/alanbarroncas](https://linkedin.com/in/alan-barroncas95)
