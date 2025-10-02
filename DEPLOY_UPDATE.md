# 🚀 Atualização do Deploy - Frontend na Porta 3001

## ✅ O que foi atualizado

### 1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- ✅ Adiciona criação do arquivo `.env` para o docker-compose
- ✅ Inclui a variável `NEXT_PUBLIC_API_URL` no build
- ✅ Copia o arquivo `.env` para o pacote de deployment
- ✅ Melhora o processo de deploy com `docker compose down` antes do build
- ✅ Adiciona verificação dos containers após o deploy

### 2. **Frontend Configuração**
- ✅ `Dockerfile` criado e otimizado para produção
- ✅ `next.config.ts` com `output: 'standalone'`
- ✅ `package.json` configurado para porta 3001
- ✅ `http.ts` usando variável de ambiente `NEXT_PUBLIC_API_URL`

### 3. **Docker Compose** (`docker-compose.yml`)
- ✅ Frontend configurado com build args
- ✅ Variável `NEXT_PUBLIC_API_URL` configurável
- ✅ Porta 3001 exposta para o frontend
- ✅ Dependência do backend configurada

## 🔐 Novo Secret Necessário

Você precisa adicionar **1 novo secret** no GitHub:

### `NEXT_PUBLIC_API_URL`

**Onde adicionar:**
1. Vá em: `Settings` → `Secrets and variables` → `Actions`
2. Clique em: `New repository secret`
3. Nome: `NEXT_PUBLIC_API_URL`
4. Valor: `http://api.nohau.agency/api` (ou `https://api.nohau.agency/api` se tiver SSL)

⚠️ **IMPORTANTE**: 
- Use a URL da sua API em produção
- NÃO inclua barra `/` no final
- Use `http://` ou `https://` conforme sua configuração

## 📊 Secrets Completos Necessários

Verifique se você tem TODOS estes secrets configurados:

### Backend:
- [x] `DATABASE_URL`
- [x] `ACCESS_KEY_ID`
- [x] `SECRET_ACCESS_KEY`
- [x] `BUCKET`
- [x] `JWT_EXPIRATION_TIME`
- [x] `JWT_PRIVATE_KEY`
- [x] `JWT_PUBLIC_KEY`
- [x] `MAILER_USERNAME`
- [x] `MAILER_PASSWORD`

### Servidor:
- [x] `SERVER_HOST`
- [x] `SERVER_USERNAME`
- [x] `SERVER_SSH_KEY`

### Frontend (NOVO):
- [ ] `NEXT_PUBLIC_API_URL` ⭐ **ADICIONE ESTE!**

## 🎯 Como Funciona o Deploy Agora

1. **Você faz push na branch `master`**
2. **GitHub Actions inicia automaticamente**:
   - Cria o arquivo `backend/.env` com as variáveis do backend
   - Cria o arquivo `.env` na raiz com `NEXT_PUBLIC_API_URL`
   - Empacota tudo (backend + frontend + docker-compose + .env)
   - Envia para o servidor via SCP
   - No servidor:
     - Para os containers antigos
     - Faz build das novas imagens (backend + frontend)
     - Sobe os containers
     - Limpa imagens antigas
     - Verifica se os containers estão rodando

3. **Frontend é buildado com a URL correta da API**
4. **Containers sobem nas portas corretas**:
   - Backend: 3000
   - Frontend: 3001

## 🌐 URLs Finais

Depois do deploy e configuração do proxy reverso (Nginx):

- **Frontend**: http://colaborador.nohau.agency → Container na porta 3001
- **Backend**: http://api.nohau.agency → Container na porta 3000

## 🔧 Configuração do Nginx (no servidor)

Certifique-se de ter estas configurações no Nginx:

### Frontend (`/etc/nginx/sites-available/colaborador.nohau.agency`):
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Backend (`/etc/nginx/sites-available/api.nohau.agency`):
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Depois de criar os arquivos:
```bash
sudo ln -s /etc/nginx/sites-available/colaborador.nohau.agency /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.nohau.agency /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ✅ Checklist Final

Antes de fazer o próximo deploy:

- [ ] Secret `NEXT_PUBLIC_API_URL` adicionado no GitHub
- [ ] Valor do secret está correto (`http://api.nohau.agency/api`)
- [ ] Nginx configurado no servidor (se aplicável)
- [ ] DNS apontando corretamente
- [ ] Backend funcionando na porta 3000

Depois de configurar tudo:

1. Faça um commit e push na branch `master`
2. Acompanhe o workflow em: `Actions` → `Deploy`
3. Aguarde o deploy completar (~5-10 minutos)
4. Verifique se os containers estão rodando: `docker ps`
5. Teste o acesso ao frontend

## 🐛 Troubleshooting

### Frontend não carrega
```bash
# Verificar logs do container
docker logs membros-frontend

# Verificar se está rodando
docker ps | grep frontend
```

### Frontend não conecta com API
1. Verifique o console do browser (F12) - há um `console.log` mostrando a URL da API
2. Verifique se a URL está correta
3. Teste a API diretamente: `curl http://api.nohau.agency/api`

### Rebuild necessário
Se algo der errado, você pode forçar um rebuild fazendo um commit vazio:
```bash
git commit --allow-empty -m "Trigger deploy"
git push origin master
```

## 📞 Próximos Passos

1. **Adicione o secret `NEXT_PUBLIC_API_URL`** no GitHub
2. **Faça um push** para a branch master
3. **Acompanhe o deploy** na aba Actions
4. **Teste** o frontend após o deploy

Está tudo pronto! O workflow já está atualizado e funcionando. 🚀
