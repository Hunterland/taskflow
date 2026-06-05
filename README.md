# 🚀 TaskFlow — Gerenciamento de Projetos e Tarefas

O **TaskFlow** é um projeto fullstack criado para simular um cenário real de mercado: um sistema de gestão de projetos e tarefas inspirado em ferramentas como Trello, com foco especial em freelancers, organização de entregas e evolução arquitetural.

Mais do que um CRUD, a proposta do projeto é exercitar decisões de arquitetura, separação de responsabilidades, escalabilidade e integração entre backend e frontend usando **NestJS** e **Angular**.

***

## 💡 Objetivo do projeto

Este projeto foi desenvolvido para praticar, de forma aplicada:

- Arquitetura modular orientada por domínio.
- Autenticação completa com JWT.
- Validação e documentação de API.
- Controle de acesso em rotas protegidas.
- Estruturação de frontend com layout reutilizável e base escalável.
- Integração real entre backend, banco de dados e interface.

Em resumo: o foco não é apenas “fazer funcionar”, mas construir uma base sólida para crescimento contínuo.

***

## 🧠 Stack utilizada

```txt
Backend:  NestJS 11 + Prisma ORM + JWT + Swagger
Database: PostgreSQL
Frontend: Angular 21 + Tailwind CSS + ngx-toastr
DevOps:   Docker + Git + Postman
```

***

## 📌 Status do projeto

O projeto já possui uma base funcional e organizada, com backend e frontend integrados nos fluxos principais de autenticação.

### ✅ Backend

- Arquitetura modular por domínio (`auth`, `users`, `projects`, `tasks`).
- Autenticação com JWT, incluindo login, registro e refresh token.
- DTOs com validação usando `class-validator` e transformação com `ValidationPipe` global.
- Exception Filter global para padronização de erros.
- Integração com Prisma ORM.
- Documentação com Swagger.
- Estrutura inicial do módulo de tasks com foco em evolução para Kanban.
- DTOs de resposta revisados para melhor compatibilidade com TypeScript em modo `strict`.
- Preparação para filtros mais elegantes nas rotas de tasks com `QueryTasksDto`.

### ✅ Frontend

- Login integrado ao backend.
- Fluxo de autenticação funcional.
- Área autenticada com layout reutilizável.
- Dashboard inicial estruturado.
- Sistema de notificações padronizadas com toast.
- Base pronta para expansão dos módulos de projetos e tarefas.

### 🔄 Em evolução

- Dashboard com dados reais.
- Módulo completo de projetos.
- Módulo de tarefas com visual estilo Kanban.
- Testes automatizados.
- Rate limiting.
- Refinos de UX/UI.

***

## 🖥️ Como rodar o projeto

### Pré-requisitos

```bash
Node.js 20+
PostgreSQL
Angular CLI
Nest CLI
```

### Clonar o projeto

```bash
git clone https://github.com/Hunterland/taskflow.git
cd taskflow
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configure o arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/taskflow_dev"
JWT_SECRET="sua_chave"
JWT_REFRESH_SECRET="sua_chave_refresh"
FRONTEND_URL="http://localhost:4200"
PORT=3000
```

Execute o backend:

```bash
npm run start:dev
```

A API ficará disponível em:

- `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

### Frontend

```bash
cd frontend
npm install
ng serve
```

O frontend ficará disponível em:

- `http://localhost:4200`

***

## 🔐 Autenticação

O fluxo de autenticação implementado atualmente inclui:

- Registro de usuário.
- Login com geração de `accessToken` e `refreshToken`.
- Proteção de rotas com Bearer Token.
- Renovação de sessão via refresh token.
- Redirecionamento do usuário autenticado para a área logada no frontend.

***

## 🧱 Arquitetura do projeto

O projeto foi estruturado com foco em organização e crescimento.

### Backend

- Separação por domínio (`auth`, `users`, `projects`, `tasks`).
- Services desacoplados da camada de controller.
- Prisma centralizado em módulo próprio.
- DTOs para entrada, saída e filtros.
- Uso de Swagger para explicitar contratos da API.
- Preparação do módulo de tasks para retorno tipado e filtros reutilizáveis.

### Frontend

- Separação entre `core`, `features` e `shared`.
- Layout reutilizável para área autenticada.
- Guards e interceptors para autenticação e controle de acesso.
- Serviços centralizados para autenticação e notificações.

***

## ✅ Evoluções recentes

Nas últimas iterações, o projeto recebeu ajustes importantes no módulo de tasks:

- Correção dos erros `TS2564` em DTOs de resposta com compatibilidade para TypeScript em modo estrito.
- Padronização dos DTOs de resposta usados no Swagger.
- Preparação do controller para respostas tipadas com `@ApiOkResponse` e `@ApiCreatedResponse`.
- Estruturação de um `QueryTasksDto` para filtros como `status`, `projectId` e `assigneeId`.
- Revisão do `main.ts` para confirmar o suporte adequado a transformação e validação global.
- Revisão do `tasks.service.ts` para padronizar includes, filtros e consistência das rotas do módulo.

***

## 📊 O que este projeto demonstra

Na prática, o TaskFlow evidencia:

- Capacidade de estruturar aplicações fullstack reais.
- Organização de código com foco em manutenção.
- Integração entre frontend e backend.
- Implementação de autenticação segura com JWT.
- Uso de boas práticas com NestJS, Prisma e Angular.
- Pensamento arquitetural aplicado ao desenvolvimento.

***

## 🛣️ Próximos passos

Os próximos passos planejados para o projeto são:

- Evoluir o dashboard com dados reais.
- Concluir o módulo de projetos.
- Finalizar o módulo de tarefas com experiência Kanban.
- Adicionar testes automatizados.
- Implementar rate limiting.
- Refinar experiência visual e usabilidade.

***

## 🤝 Contribuição

Contribuições são bem-vindas.

```bash
git checkout -b feat/sua-feature
```

***

## 👨‍💻 Autor

**Alan Barroncas**  
Fullstack Developer

- GitHub: [github.com/Hunterland](https://github.com/Hunterland)
- LinkedIn: [linkedin.com/in/alan-barroncas95](https://linkedin.com/in/alan-barroncas95)
