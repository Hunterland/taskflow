# 🚀 TaskFlow — Gerenciamento de Projetos e Tarefas

O **TaskFlow** é um projeto fullstack criado para simular um cenário real de mercado:
um sistema de gestão de projetos e tarefas inspirado em ferramentas como Trello, pensado especialmente para freelancers.

Mais do que um CRUD, o foco aqui é arquitetura, organização e escalabilidade — aplicando boas práticas com **NestJS no backend** e **Angular no frontend**.

---

## 💡 Por que esse projeto existe?

Este projeto foi desenvolvido com o objetivo de:

* Praticar **arquitetura modular real**
* Construir um fluxo completo de **autenticação com JWT**
* Trabalhar com **controle de acesso (RBAC)**
* Estruturar uma aplicação frontend com **layout escalável**
* Simular um sistema pronto para crescer

Em resumo: não é só sobre funcionar, é sobre **como o sistema é construído**.

---

## 🧠 Stack utilizada

```txt
Backend:  NestJS 11 + Prisma ORM + JWT + Swagger
Database: PostgreSQL
Frontend: Angular 21 + Tailwind CSS + ngx-toastr
DevOps:   Docker + Git + Postman
```

---

## 📌 Status do Projeto (Abril 2026)

Hoje o projeto já possui uma base sólida e funcional:

### ✅ Backend

* Arquitetura modular por domínio (auth, users, projects, tasks)
* Autenticação completa com JWT (login, register e refresh)
* DTOs com validação
* Exception Filter global
* Documentação com Swagger

### ✅ Frontend

* Login integrado ao backend
* Sistema de autenticação funcional
* Área logada estruturada (Dashboard + Layout reutilizável)
* Notificações padronizadas com toast
* Base pronta para expansão dos módulos

### 🔄 Em evolução

* Dashboard com dados reais
* Módulo de projetos
* Módulo de tarefas (com futuro Kanban)
* Testes automatizados
* Rate limiting

---

## 🖥️ Como rodar o projeto

### Pré-requisitos

```bash
Node.js 20+
PostgreSQL
Angular CLI
Nest CLI
```

### Clone o projeto

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

Configure seu `.env`:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/taskflow_dev"
JWT_SECRET="sua_chave"
JWT_REFRESH_SECRET="sua_chave_refresh"
```

Execute:

```bash
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

---

## 🔐 Autenticação

O fluxo implementado:

* Registro de usuário
* Login com geração de access + refresh token
* Proteção de rotas com Bearer Token
* Renovação de sessão via refresh

No frontend, o usuário é redirecionado automaticamente para o dashboard após login.

---

## 🧱 Arquitetura

O projeto foi estruturado pensando em crescimento.

### Backend

* Separação por domínio (auth, users, projects, tasks)
* Camada de serviços desacoplada
* Prisma centralizado
* DTOs reutilizáveis

### Frontend

* Separação clara entre `core`, `features` e `shared`
* Layout reutilizável para área autenticada
* Guards e interceptors para controle de acesso
* Serviços centralizados (auth + notificações)

---

## 📊 O que esse projeto demonstra

Esse projeto evidencia na prática:

* Capacidade de estruturar aplicações reais
* Organização de código escalável
* Integração frontend + backend
* Implementação de autenticação segura
* Pensamento arquitetural (não só código funcional)

---

## 🛣️ Próximos passos

* Evoluir dashboard com dados reais
* Implementar módulo completo de projetos
* Criar sistema de tarefas com Kanban (drag and drop)
* Adicionar testes automatizados
* Refinar UX/UI

---

## 🤝 Contribuição

Contribuições são bem-vindas.

```bash
git checkout -b feat/sua-feature
```

---

## 👨‍💻 Autor

**Alan Barroncas**
Fullstack Developer

* GitHub: [https://github.com/Hunterland](https://github.com/Hunterland)
* LinkedIn: [https://linkedin.com/in/alan-barroncas95](https://linkedin.com/in/alan-barroncas95)

