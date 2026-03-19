# Sistema de Reserva de Cinema

Projeto desenvolvido para a disciplina de Sistemas Distribuídos.

## Objetivo

Implementar um sistema distribuído de reserva de assentos de cinema, utilizando:

- Frontend separado do backend
- Comunicação via API REST
- Autenticação de usuários
- Persistência de dados em nuvem

---

## Arquitetura

O projeto segue uma arquitetura cliente-servidor:

client (Vue 3) → server (Node.js/Express) → Supabase (Banco + Auth)


---

## Tecnologias Utilizadas

### Frontend
- Vue 3
- Vite
- Axios

### Backend
- Node.js
- Express
- Supabase JS

### Banco de Dados
- Supabase

### Autenticação
- Supabase Auth (email/senha)

---

## Funcionalidades

-  Login de usuário
-  Visualização de assentos
-  Assentos disponíveis
-  Assentos ocupados
-  Reservar assento
-  Cancelar reserva
-  Atualização em tempo real

---

## Estrutura do Projeto

SD_TRABALHO01/
├── client/                  
│   ├── src/
│   │   └── App.vue          
│   ├── package.json
│   └── vite.config.js
├── server/                  
│   ├── index.js             
│   ├── .env                 
│   ├── package.json
│   └── seed.sql             
├── screenshots/            
├── README.md

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- Conta no Supabase

---

## 1. Clonar o repositório

git clone SEU_LINK_AQUI
cd SD_Trabalho1

2. Rodar o Backend
cd server
npm install
node index.js

Servidor rodando em:

http://localhost:3000


3. Rodar o Frontend
cd client
npm install
npm run dev

Acesse:

http://localhost:5173



## 4. Configuração do Supabase

1 Criar projeto no Supabase

2 Criar tabela assentos com:

Campo	    Tipo
id	        uuid
code	    text
status	    text
category	text

3 Inserir dados de exemplo:

A1 | disponível | normal
A2 | ocupado | vip


Autenticação

Email e senha via Supabase

Usuário deve estar cadastrado para acessar o sistema

Prints do Sistema
Tela de Login

Painel de Assentos

Endpoints da API

GET /assentos
Lista todos os assentos

POST /reserva
Reserva um assento

POST /cancela
Cancela uma reserva