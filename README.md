# Sistema de Reserva de Cinema

Projeto desenvolvido para a disciplina de Sistemas Distribuídos.

## Objetivo

Implementar um sistema distribuído de reserva de assentos de cinema, utilizando:

- Frontend separado do backend
- Comunicação via API
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
│   ├── server.js             
│   ├── .env                 
│   ├── package.json                     
├── README.md

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- Conta no Supabase

---

## 1. Clonar o repositório

2. Rodar o Backend
cd server
npm install
node server.js


3. Rodar o Frontend
cd client
npm install
npm run dev



