# 🔐 GitHub Secrets - Configuração

Este documento lista todos os secrets necessários para o deploy automático via GitHub Actions.

## 📋 Secrets Necessários

Configure estes secrets em: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 🖥️ Servidor (SSH)

| Secret Name | Descrição | Exemplo |
|------------|-----------|---------|
| `SERVER_HOST` | IP ou domínio do servidor | `94.72.118.5` ou `nohau.agency` |
| `SERVER_USERNAME` | Usuário SSH do servidor | `root` ou `ubuntu` |
| `SERVER_SSH_KEY` | Chave privada SSH (conteúdo completo) | Conteúdo do arquivo `~/.ssh/id_rsa` |

### 🗄️ Banco de Dados

| Secret Name | Descrição | Exemplo |
|------------|-----------|---------|
| `DATABASE_URL` | URL de conexão do PostgreSQL | `postgresql://user:password@host:5432/dbname` |

### ☁️ AWS (S3/R2)

| Secret Name | Descrição | Exemplo |
|------------|-----------|---------|
| `ACCESS_KEY_ID` | Access Key ID do S3/R2 | `AKIAIOSFODNN7EXAMPLE` |
| `SECRET_ACCESS_KEY` | Secret Access Key do S3/R2 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `BUCKET` | Nome do bucket | `membros-assets` |

### 🔑 JWT

| Secret Name | Descrição | Como Gerar |
|------------|-----------|-----------|
| `JWT_PRIVATE_KEY` | Chave privada JWT (base64) | Conteúdo do arquivo `backend/jwt-keys/private.pem` em base64 |
| `JWT_PUBLIC_KEY` | Chave pública JWT (base64) | Conteúdo do arquivo `backend/jwt-keys/public.pem` em base64 |
| `JWT_EXPIRATION_TIME` | Tempo de expiração do token | `3600` (1 hora) ou `86400` (1 dia) |

### 📧 Email (SMTP)

| Secret Name | Descrição | Exemplo |
|------------|-----------|---------|
| `MAILER_USERNAME` | Usuário do servidor SMTP | `noreply@nohau.agency` |
| `MAILER_PASSWORD` | Senha do servidor SMTP | `sua-senha-smtp` |

### 🌐 Frontend

| Secret Name | Descrição | Exemplo |
|------------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API para o frontend | `http://api.nohau.agency/api` ou `https://api.nohau.agency/api` |

---

## 🔧 Como Gerar os Secrets

### SSH Key

```bash
# No seu computador local, copie o conteúdo da chave privada
cat ~/.ssh/id_rsa

# OU gere uma nova chave específica para deploy
ssh-keygen -t rsa -b 4096 -C "deploy@github-actions" -f github-deploy-key
cat github-deploy-key  # Conteúdo vai para SERVER_SSH_KEY

# Adicione a chave pública no servidor
cat github-deploy-key.pub  # Adicione em ~/.ssh/authorized_keys no servidor
```

### JWT Keys (Base64)

```bash
# No diretório backend/jwt-keys/
# Para PRIVATE KEY
cat private.pem | base64 -w 0

# Para PUBLIC KEY
cat public.pem | base64 -w 0
```

**⚠️ IMPORTANTE**: Copie a saída completa (incluindo o base64) e cole como secret no GitHub.

### Database URL

Formato padrão do PostgreSQL:
```
postgresql://[usuario]:[senha]@[host]:[porta]/[nome_banco]
```

Exemplo:
```
postgresql://membros_user:SenhaSegura123@localhost:5432/membros_db
```

### NEXT_PUBLIC_API_URL

**Para Produção:**
```
http://api.nohau.agency/api
```

**OU com HTTPS (recomendado):**
```
https://api.nohau.agency/api
```

**⚠️ ATENÇÃO**: 
- Não inclua barra `/` no final
- Use `http://` ou `https://` conforme sua configuração
- Certifique-se de que o domínio está apontando corretamente

---

## ✅ Checklist de Configuração

- [ ] `SERVER_HOST` - IP/domínio do servidor
- [ ] `SERVER_USERNAME` - Usuário SSH
- [ ] `SERVER_SSH_KEY` - Chave SSH privada
- [ ] `DATABASE_URL` - String de conexão do banco
- [ ] `ACCESS_KEY_ID` - AWS/R2 Access Key
- [ ] `SECRET_ACCESS_KEY` - AWS/R2 Secret Key
- [ ] `BUCKET` - Nome do bucket
- [ ] `JWT_PRIVATE_KEY` - Chave privada JWT (base64)
- [ ] `JWT_PUBLIC_KEY` - Chave pública JWT (base64)
- [ ] `JWT_EXPIRATION_TIME` - Tempo de expiração do token
- [ ] `MAILER_USERNAME` - Usuário SMTP
- [ ] `MAILER_PASSWORD` - Senha SMTP
- [ ] `NEXT_PUBLIC_API_URL` - URL da API para o frontend

---

## 🧪 Testando os Secrets

Após configurar todos os secrets, faça um commit na branch `master` e verifique:

1. Acesse: `Actions` → `Deploy`
2. Veja o workflow rodando
3. Verifique os logs de cada step
4. Se houver erro, verifique qual secret pode estar incorreto

---

## 🔒 Segurança

### Boas Práticas:

1. ✅ **Nunca commite secrets** no código
2. ✅ **Use secrets diferentes** para dev/staging/prod
3. ✅ **Rotacione as chaves** periodicamente
4. ✅ **Limite o acesso** aos secrets apenas para pessoas autorizadas
5. ✅ **Use HTTPS** sempre que possível em produção
6. ✅ **Mantenha backups** dos secrets em local seguro (ex: 1Password, Vault)

### Em Caso de Vazamento:

1. 🚨 **Revogue imediatamente** as credenciais comprometidas
2. 🔄 **Gere novas chaves** e atualize os secrets
3. 🔍 **Investigue** possíveis acessos não autorizados
4. 📝 **Documente** o incidente

---

## 📞 Suporte

Se tiver dúvidas sobre algum secret:

1. Verifique a documentação do backend em `backend/README.md`
2. Consulte os arquivos `.env.example` nos diretórios
3. Veja o arquivo `DEPLOY.md` para mais informações

---

## 🔄 Atualização de Secrets

Para atualizar um secret:

1. Vá em `Settings` → `Secrets and variables` → `Actions`
2. Clique no secret que deseja atualizar
3. Clique em "Update secret"
4. Cole o novo valor
5. Clique em "Update secret"

Após atualizar, você pode precisar:
- Re-rodar o workflow de deploy
- Reiniciar os containers no servidor

---

## 📊 Variáveis de Ambiente vs Secrets

### Use **Secrets** para:
- ✅ Senhas
- ✅ Chaves API
- ✅ Tokens
- ✅ Credenciais
- ✅ Qualquer informação sensível

### Use **Variables** (não-secretas) para:
- ⚪ Nome do projeto
- ⚪ Versão
- ⚪ Ambiente (dev/staging/prod)
- ⚪ Configurações públicas

---

**Última atualização**: Outubro 2025
