# Frontend Fivam

Estrutura inicial do front-end em React para consumo da API de posts.

## Requisitos

- Node.js 22+
- Backend em execucao em `http://localhost:3000`

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Arquitetura

- `src/api/client.js`: camada de chamadas REST (`/auth/*` e `/posts/*`)
- `src/context/AuthContext.jsx`: estado global de autenticacao com token e usuario
- `src/components/AuthPanel.jsx`: login e registro
- `src/components/PostDashboard.jsx`: listagem e CRUD (professor) / leitura (aluno)
- `src/styles/*`: tema e estilos globais com Styled Components

## Fluxo de uso

1. Registre usuario aluno ou professor.
2. Faça login para obter JWT.
3. Aluno: lista posts.
4. Professor: cria, edita e remove posts.

## Responsividade

- Layout centralizado com largura fluida.
- Componentes com quebra de linha e elementos adaptativos para mobile/desktop.
