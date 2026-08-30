# 🚀 Guia Rápido de Início

## Instalação em 5 Minutos

### Pré-requisitos
```bash
# Verificar Node.js
node --version  # v14+

# Verificar PostgreSQL
psql --version  # v12+
```

### Setup Completo

```bash
# 1. Clonar repositório
git clone https://github.com/JaoRzzo/edital-plano-diario.git
cd edital-plano-diario

# 2. Criar banco de dados
creatdb edital_plano_diario
psql -U postgres -d edital_plano_diario -f database/init.sql

# 3. Configurar e rodar backend
cd backend
cp .env.example .env
# Editar .env com suas informações
npm install
npm run dev

# 4. Em outro terminal - rodar frontend
cd frontend
python -m http.server 3000 --directory public

# 5. Acessar
# Frontend: http://localhost:3000/pages/login.html
# Backend: http://localhost:5000
```

## Variáveis de Ambiente

**Backend (.env)**
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/edital_plano_diario
JWT_SECRET=sua-chave-super-secreta-mudeme
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Primeiro Uso

1. Registre-se ou faça login
2. Crie um novo concurso
3. Adicione disciplinas (ex: Português, Matemática)
4. Configure seu plano (horas/dia, dias disponíveis)
5. Gere o cronograma
6. Acompanhe em "Hoje" e "Evolução"

## Comandos Úteis

```bash
# Backend
npm run dev          # Desenvolvimento com auto-reload
npm start            # Produção

# Frontend
python -m http.server 3000 --directory public

# Banco de dados
psql -U postgres -d edital_plano_diario
```

## Dúvidas?

Ver [README.md](README.md) para documentação completa
