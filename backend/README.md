# Edital → Plano Diário - Backend

Backend do Micro-SaaS para gerar cronogramas de estudo automáticos.

## Instalação

```bash
npm install
```

## Configuração

1. Crie um arquivo `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente:
   - `DATABASE_URL`: URL de conexão PostgreSQL
   - `JWT_SECRET`: Chave secreta para JWT
   - `PORT`: Porta do servidor (padrão: 5000)
   - `NODE_ENV`: Ambiente (development, production)

## Banco de Dados

Execute o arquivo `database/init.sql` para criar as tabelas:

```bash
psql -U seu_usuario -d edital_plano_diario -f database/init.sql
```

## Rodar Localmente

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário (requer token)

### Exames
- `POST /api/exams` - Criar exame
- `GET /api/exams` - Listar exames
- `GET /api/exams/:examId` - Obter exame específico
- `PUT /api/exams/:examId` - Atualizar exame
- `DELETE /api/exams/:examId` - Deletar exame

### Disciplinas
- `POST /api/exams/:examId/subjects` - Criar disciplina
- `GET /api/exams/:examId/subjects` - Listar disciplinas
- `PUT /api/exams/:examId/subjects/:subjectId` - Atualizar disciplina
- `DELETE /api/exams/:examId/subjects/:subjectId` - Deletar disciplina

### Tópicos
- `POST /api/exams/:examId/subjects/:subjectId/topics` - Criar tópico
- `GET /api/exams/:examId/subjects/:subjectId/topics` - Listar tópicos
- `PUT /api/exams/:examId/subjects/:subjectId/topics/:topicId` - Atualizar tópico
- `DELETE /api/exams/:examId/subjects/:subjectId/topics/:topicId` - Deletar tópico

### Plano de Estudo
- `POST /api/exams/:examId/study-plans` - Criar/atualizar plano
- `GET /api/exams/:examId/study-plans` - Obter plano

### Tarefas
- `POST /api/exams/:examId/tasks/generate` - Gerar cronograma
- `GET /api/exams/:examId/tasks/today` - Tarefas de hoje
- `GET /api/exams/:examId/tasks` - Listar tarefas
- `POST /api/exams/:examId/tasks/:taskId/complete` - Marcar concluída
- `POST /api/exams/:examId/tasks/:taskId/skip` - Pular tarefa

### Questões & Analytics
- `POST /api/exams/:examId/questions` - Registrar sessão de questões
- `GET /api/exams/:examId/questions/analytics/subjects/:subjectId` - Evolução por disciplina
- `GET /api/exams/:examId/questions/analytics/stats` - Estatísticas gerais
- `GET /api/exams/:examId/questions/analytics/tasks` - Estatísticas de tarefas
