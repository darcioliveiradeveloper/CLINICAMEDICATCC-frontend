# Clínica Médica - Frontend

Interface web para gerenciamento de uma clínica médica, desenvolvida como Trabalho de Conclusão de Curso da **Turma Lions Dev**.

## Integrantes

- **Darci R. S. Oliveira**
- **Wesley Espedito**

## Tecnologias

- React 18
- Vite
- React Router DOM v6
- Axios
- CSS (próprio)

## Funcionalidades

- Tela de login com autenticação JWT
- Dashboard com visão geral
- CRUD de médicos, pacientes, consultas e usuários
- Relatórios (totais, consultas por período, especialidades mais atendidas)
- Controle de perfis: admin, funcionario, medico
- Sidebar com navegação por perfil
- Proteção de rotas (usuário não autenticado é redirecionado)

## Estrutura

```
src/
├── api/           # Configuração do Axios
├── components/    # Sidebar, Layout, PrivateRoute
├── context/       # AuthContext (autenticação)
├── pages/         # Dashboard, Login, Medicos, Pacientes, Consultas, Usuarios, Relatorios
└── services/      # Chamadas à API (auth, medico, paciente, consulta, usuario, relatorio)
```

## Como executar

### Pré-requisitos

- Node.js >= 18
- Backend rodando em `http://localhost:3000`

### Instalação

```bash
git clone https://github.com/darcioliveiradeveloper/CLINICAMEDICATCC-frontend.git
cd CLINICAMEDICATCC-frontend
npm install
```

### Configuração

Crie um arquivo `.env` na raiz (use o `.env.example` como referência):

```env
VITE_API_URL=http://localhost:3000
```

### Execução

```bash
npm run dev
```

O frontend rodará em `http://localhost:5173`.

### Build

```bash
npm run build
```

## Deploy

- **Frontend:** https://clinicamedicatcc-frontend.onrender.com
- **Backend:** https://clinicamedicatcc-backend.onrender.com

## Repositórios

- **Frontend:** https://github.com/darcioliveiradeveloper/CLINICAMEDICATCC-frontend
- **Backend:** https://github.com/darcioliveiradeveloper/CLINICAMEDICATCC-backend
