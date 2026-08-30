# 📚 Edital → Plano Diário

**Micro-SaaS para gerar cronogramas de estudo automáticos para concursos públicos e vestibulares**

## 🎯 Objetivo

Transformar editais de concursos em planos de estudo personalizados e inteligentes, utilizando técnicas de revisão espaçada (Spaced Repetition) e distribuição automática de conteúdo.

## 🚀 Funcionalidades Principais

✅ **Registro de Concursos** - Adicione concursos com data da prova e link do edital
✅ **Estrutura de Disciplinas** - Organize por disciplinas e tópicos com horas estimadas
✅ **Plano de Estudo Personalizado** - Configure horas disponíveis e dias da semana
✅ **Cronograma Automático** - Gera tarefas diárias com revisão espaçada
✅ **Rastreamento de Progresso** - Tarefas de hoje, histórico e estatísticas
✅ **Analytics** - Acompanhe evolução por disciplina e acurácia em questões
✅ **Registro de Sessões de Questões** - Acompanhe desempenho em exercícios

## 📁 Estrutura do Projeto

```
edital-plano-diario/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Lógica das rotas
│   │   ├── services/     # Lógica de negócio
│   │   ├── middlewares/  # Autenticação e validação
│   │   ├── models/       # Conexão com BD
│   │   ├── routes/       # Definição de rotas
│   │   ├── utils/        # Funções auxiliares
│   │   └── app.js        # Configuração Express
│   ├── package.json
│   ├── index.js
│   └── README.md
├── frontend/             # HTML/CSS/JS vanilla
│   ├── public/
│   │   ├── pages/        # Páginas HTML
│   │   ├── styles/       # CSS
│   │   ├── js/           # JavaScript
│   │   └── index.html
│   ├── package.json
│   └── .gitignore
├── database/
│   └── init.sql          # Schema PostgreSQL
└── README.md             # Este arquivo
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **CORS** - Requisições do frontend

### Frontend
- **HTML5** + **CSS3** - Interface responsiva
- **JavaScript Vanilla** - Sem dependências pesadas
- **Fetch API** - Comunicação com backend

## 📋 Pré-requisitos

- **Node.js** 14+ instalado
- **PostgreSQL** 12+ instalado e rodando
- **Git** para controle de versão

## 🚀 Instalação e Execução

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/JaoRzzo/edital-plano-diario.git
cd edital-plano-diario
```

### 2️⃣ Configurar Banco de Dados

```bash
# Criar banco de dados
creatdb edital_plano_diario

# Executar script de inicialização
psql -U seu_usuario -d edital_plano_diario -f database/init.sql
```

### 3️⃣ Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL=postgresql://usuario:senha@localhost:5432/edital_plano_diario
# JWT_SECRET=sua_chave_secreta_aqui
# PORT=5000
# NODE_ENV=development
```

#### Rodar Backend em Desenvolvimento

```bash
npm run dev
```

O servidor estará em `http://localhost:5000`

#### Rodar Backend em Produção

```bash
npm start
```

### 4️⃣ Configurar Frontend

```bash
cd ../frontend

# Instalar dependências (opcional)
npm install
```

#### Rodar Frontend em Desenvolvimento

**Opção 1: Usando Python**
```bash
python -m http.server 3000 --directory public
```

**Opção 2: Usando Node.js**
```bash
npm start
```

**Opção 3: Servir direto do navegador**
- Abra `file:///path/to/edital-plano-diario/frontend/public/pages/login.html`

### 5️⃣ Acessar Aplicação

- **Frontend**: `http://localhost:3000/pages/login.html`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`

## 📡 API Endpoints

Ver documentação completa em [backend/README.md](backend/README.md)

### Autenticação
```
POST   /api/auth/register          Registrar novo usuário
POST   /api/auth/login             Fazer login
GET    /api/auth/profile           Obter perfil (requer token)
```

### Concursos
```
POST   /api/exams                  Criar concurso
GET    /api/exams                  Listar concursos
GET    /api/exams/:examId          Obter concurso específico
PUT    /api/exams/:examId          Atualizar concurso
DELETE /api/exams/:examId          Deletar concurso
```

### Plano de Estudo
```
POST   /api/exams/:examId/study-plans      Criar/atualizar plano
GET    /api/exams/:examId/study-plans      Obter plano
```

### Tarefas
```
POST   /api/exams/:examId/tasks/generate           Gerar cronograma
GET    /api/exams/:examId/tasks/today              Tarefas de hoje
GET    /api/exams/:examId/tasks                    Listar tarefas
POST   /api/exams/:examId/tasks/:taskId/complete   Marcar concluída
POST   /api/exams/:examId/tasks/:taskId/skip       Pular tarefa
```

### Analytics
```
GET    /api/exams/:examId/questions/analytics/stats              Estatísticas gerais
GET    /api/exams/:examId/questions/analytics/subjects/:subjectId  Evolução por disciplina
```

## 🎓 Como Usar

### Passo 1: Criar Conta
1. Acesse a página de login
2. Clique em "Registre-se"
3. Preencha nome, email e senha

### Passo 2: Criar Concurso
1. No dashboard, clique em "+ Novo Concurso"
2. Preencha nome, data da prova e link do edital (opcional)
3. Clique em "Criar Concurso"

### Passo 3: Adicionar Disciplinas e Tópicos
1. Clique em "Abrir" no concurso
2. Adicione as disciplinas que serão cobradas
3. Para cada disciplina, adicione os tópicos com horas estimadas

### Passo 4: Configurar Plano de Estudo
1. Defina quantas horas por dia você pode estudar
2. Selecione os dias da semana disponíveis
3. Escolha seu nível de base (iniciante, intermediário, avançado)
4. Clique em "Gerar Cronograma"

### Passo 5: Acompanhar Progresso
1. Acesse "Hoje" para ver tarefas do dia
2. Marque como concluída ou pule
3. Registre sessões de questões para acompanhar evolução
4. Veja gráficos em "Evolução"

## 🔐 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação via JWT
- Validação de entrada em todos os endpoints
- CORS configurado
- Variáveis sensíveis em `.env`

## 📊 Banco de Dados

**Tabelas Principais:**
- `users` - Usuários do sistema
- `exams` - Concursos/vestibulares
- `subjects` - Disciplinas
- `topics` - Tópicos por disciplina
- `study_plans` - Planos de estudo personalizados
- `tasks` - Tarefas do cronograma
- `question_sessions` - Registros de desempenho em questões

Ver schema completo em [database/init.sql](database/init.sql)

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED" ao conectar com banco
- Verifique se PostgreSQL está rodando
- Verifique `DATABASE_URL` no `.env`
- Verifique credenciais de usuário

### Erro: CORS ao fazer requisições do frontend
- Verifique se `CORS_ORIGIN` no backend está correto
- Padrão é `http://localhost:3000`

### Tarefas não aparecem após gerar cronograma
- Verifique se disciplinas foram adicionadas
- Verifique se plano de estudo foi configurado
- Tente gerar novamente

## 🚀 Próximos Passos

- [ ] Autenticação via OAuth (Google, GitHub)
- [ ] Mobile app (React Native)
- [ ] Integração com Mercado Pago
- [ ] Upload de documentos PDF
- [ ] Sistema de lembretes por email
- [ ] Modo offline
- [ ] Compartilhamento de cronogramas
- [ ] Integração com Anki
- [ ] AI para otimização automática de cronograma
- [ ] Gamificação (badges, pontos)

## 📝 Licença

MIT License - Veja [LICENSE](LICENSE) para mais detalhes

## 👨‍💻 Contribuições

Contribuições são bem-vindas! Para alterações maiores:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -am 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📧 Contato

- Email: [seu-email]
- GitHub: [JaoRzzo](https://github.com/JaoRzzo)

---

**Feito com ❤️ para ajudar você a conquistar seu concurso!**
