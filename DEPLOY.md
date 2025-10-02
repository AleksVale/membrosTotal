# 🚀 Guia de Deploy com Docker

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Arquivo `.env` no diretório `backend/` com as configurações do backend
- (Opcional) Arquivo `.env` na raiz do projeto para configurações do Docker Compose

## 🔧 Configuração

### 1. Variáveis de Ambiente

#### Backend (`backend/.env`)
Certifique-se de ter o arquivo `.env` no diretório backend com todas as configurações necessárias (banco de dados, AWS, JWT, etc.)

#### Docker Compose (`.env` na raiz - opcional)
Crie um arquivo `.env` na raiz do projeto baseado no `.env.docker.example`:

```bash
cp .env.docker.example .env
```

Edite o arquivo `.env` e configure a URL da API:

```env
# Para produção com domínio
NEXT_PUBLIC_API_URL=http://api.nohau.agency/api

# OU para comunicação interna entre containers
# NEXT_PUBLIC_API_URL=http://membros:3000/api
```

### 2. Portas Utilizadas

- **Backend (API)**: `3000`
- **Frontend**: `3001`

### 3. URLs de Acesso

Após o deploy:
- Frontend: `http://colaborador.nohau.agency` (porta 3001)
- API: `http://api.nohau.agency` (porta 3000)

## 🐳 Deploy com Docker Compose

### Build e Start

```bash
# Build das imagens e start dos containers
docker-compose up -d --build

# Apenas start (sem rebuild)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs apenas do frontend
docker-compose logs -f frontend

# Ver logs apenas do backend
docker-compose logs -f api
```

### Gerenciamento

```bash
# Parar os containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Restart de um serviço específico
docker-compose restart frontend
docker-compose restart api

# Rebuild de um serviço específico
docker-compose up -d --build frontend
docker-compose up -d --build api
```

## 🔍 Verificação

Após o deploy, verifique se os serviços estão rodando:

```bash
# Lista os containers
docker ps

# Deve mostrar:
# - membros (backend) rodando na porta 3000
# - membros-frontend rodando na porta 3001
```

Teste os endpoints:

```bash
# Frontend
curl http://localhost:3001

# API
curl http://localhost:3000/api
```

## 🛠️ Troubleshooting

### Frontend não conecta com o Backend

1. Verifique se a variável `NEXT_PUBLIC_API_URL` está configurada corretamente
2. No console do navegador, verifique qual URL está sendo usada (há um console.log no http.ts)
3. Se estiver usando proxy reverso, certifique-se de que as rotas estão configuradas corretamente

### Verificar variáveis de ambiente no container

```bash
# Frontend
docker exec membros-frontend env | grep NEXT_PUBLIC

# Backend
docker exec membros env
```

### Rebuild completo

Se houver problemas, faça um rebuild completo:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Notas Importantes

### Variáveis NEXT_PUBLIC_*

As variáveis que começam com `NEXT_PUBLIC_` precisam estar disponíveis em **build time** (quando a imagem é criada), não apenas em runtime. Por isso:

1. São passadas como `build args` no docker-compose.yml
2. São configuradas como `ARG` e `ENV` no Dockerfile
3. São embarcadas no build do Next.js

### Configuração do Proxy Reverso (Nginx/Apache)

Se você estiver usando um proxy reverso, configure assim:

**Para o Frontend (porta 3001):**
```nginx
server {
    listen 80;
    server_name colaborador.nohau.agency;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Para o Backend (porta 3000):**
```nginx
server {
    listen 80;
    server_name api.nohau.agency;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Produção

Para produção, considere:

1. ✅ Usar HTTPS (Let's Encrypt com Certbot)
2. ✅ Configurar variáveis de ambiente adequadas
3. ✅ Usar volumes para dados persistentes (banco de dados)
4. ✅ Configurar logs e monitoramento
5. ✅ Fazer backup regular dos dados
6. ✅ Usar secrets do Docker para informações sensíveis

## 📚 Comandos Úteis para Desenvolvimento

```bash
# Desenvolvimento local (sem Docker)
cd frontend && npm run dev    # Roda na porta 3001
cd backend && npm run start:dev  # Roda na porta 3000

# Build local para testar
cd frontend && npm run build && npm start

# Verificar se o build está correto
cd frontend && npm run build
```

## 🎯 Checklist de Deploy

- [ ] Arquivo `backend/.env` configurado
- [ ] Arquivo `.env` na raiz configurado (opcional, mas recomendado)
- [ ] Proxy reverso configurado (Nginx/Apache)
- [ ] DNS apontando para o servidor
- [ ] SSL/TLS configurado
- [ ] Firewall liberando portas 80 e 443
- [ ] Docker e Docker Compose instalados
- [ ] Teste de conectividade entre frontend e backend
