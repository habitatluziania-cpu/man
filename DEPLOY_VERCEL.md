# 🚀 Guia de Deploy na Vercel

Este documento fornece instruções passo a passo para fazer deploy do Sistema Habitat Social na Vercel.

---

## 📋 Pré-requisitos

Antes de começar, você precisa:

1. ✅ Conta na [Vercel](https://vercel.com/)
2. ✅ Repositório Git (GitHub, GitLab ou Bitbucket)
3. ✅ Projeto Supabase configurado
4. ✅ Variáveis de ambiente do Supabase

---

## 🔧 Passo 1: Preparar Variáveis de Ambiente

Você precisará das seguintes variáveis de ambiente do Supabase:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_key_aqui
```

### Como obter as variáveis:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

---

## 📦 Passo 2: Push para o Git

Se ainda não fez, faça push do projeto para um repositório Git:

```bash
# Inicializar git (se necessário)
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "feat: configurar projeto para deploy na Vercel"

# Adicionar remote (substitua pela sua URL)
git remote add origin https://github.com/seu-usuario/seu-repositorio.git

# Push
git push -u origin main
```

---

## 🌐 Passo 3: Deploy na Vercel

### Opção A: Deploy via Dashboard (Recomendado)

1. Acesse [vercel.com](https://vercel.com/)
2. Faça login
3. Clique em **"Add New..."** > **"Project"**
4. Selecione seu repositório Git
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. Adicione as **Environment Variables**:
   - Nome: `VITE_SUPABASE_URL`
   - Valor: (cole sua URL do Supabase)

   - Nome: `VITE_SUPABASE_ANON_KEY`
   - Valor: (cole sua chave do Supabase)

7. Clique em **Deploy**

### Opção B: Deploy via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy para produção
vercel --prod
```

---

## ✅ Passo 4: Verificar Deploy

Após o deploy, a Vercel fornecerá uma URL (exemplo: `https://seu-projeto.vercel.app`)

### Checklist de Verificação:

- [ ] Página inicial carrega corretamente
- [ ] Formulário de cadastro funciona
- [ ] Login de admin funciona
- [ ] Dashboard carrega os dados
- [ ] Tema claro/escuro alterna
- [ ] Imagens aparecem corretamente
- [ ] Console do navegador sem erros

### Testar no Console do Navegador:

```javascript
// Verificar se variáveis de ambiente foram carregadas
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('ANON_KEY existe:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
```

---

## 🔄 Passo 5: Atualizações Automáticas

A Vercel faz deploy automático quando você faz push para o repositório:

```bash
# Fazer mudanças no código
git add .
git commit -m "feat: sua mensagem"
git push

# A Vercel detecta e faz deploy automaticamente! 🎉
```

---

## 🐛 Solução de Problemas

### Problema: Página em branco

**Solução:**

1. Verifique o console do navegador (F12)
2. Verifique se as variáveis de ambiente estão corretas:
   - Vá em **Project Settings** > **Environment Variables**
   - Confirme que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão presentes
3. Refaça o deploy:
   - Vá em **Deployments**
   - Clique nos três pontos do último deploy
   - Clique em **Redeploy**

### Problema: Erro 404 ao navegar

**Solução:**
- O arquivo `vercel.json` já está configurado para SPA
- Garanta que ele está na raiz do projeto
- Refaça o deploy

### Problema: Imagens não aparecem

**Solução:**
- As imagens devem estar na pasta `public/`
- Referências devem usar `/nome-da-imagem.png` (começando com `/`)
- Exemplo: `<img src="/Habitat.png" />`

### Problema: Variáveis de ambiente não funcionam

**Solução:**
- Variáveis **devem** começar com `VITE_` para serem expostas ao frontend
- Após adicionar/modificar variáveis, faça redeploy
- NÃO commite o arquivo `.env` no Git

### Problema: Erro de build

**Solução:**
```bash
# Testar build localmente
npm run build

# Se funcionar localmente mas falhar na Vercel:
# 1. Verifique a versão do Node.js
# 2. Vá em Project Settings > General
# 3. Defina Node.js Version para: 18.x ou 20.x
```

---

## 🔐 Segurança

### ✅ O que é seguro expor:

- `VITE_SUPABASE_URL` - URL pública
- `VITE_SUPABASE_ANON_KEY` - Chave anônima pública

### ❌ NUNCA exponha:

- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (bypass RLS)
- Senhas do banco de dados
- Chaves de API privadas

### Proteção Implementada:

- ✅ Row Level Security (RLS) ativado
- ✅ Políticas de acesso configuradas
- ✅ Senhas hasheadas com bcrypt
- ✅ Validações server-side

---

## 📊 Monitoramento

### Vercel Analytics (Opcional)

Para ativar analytics:

1. Vá em **Analytics** no projeto
2. Clique em **Enable**
3. Acompanhe:
   - Visitas
   - Performance
   - Core Web Vitals

### Vercel Logs

Para ver logs em tempo real:

1. Vá em **Deployments**
2. Clique em um deployment
3. Vá em **Runtime Logs**

---

## 🌍 Domínio Customizado (Opcional)

Para usar seu próprio domínio:

1. Vá em **Settings** > **Domains**
2. Clique em **Add**
3. Digite seu domínio (ex: `habitat.seudominio.com.br`)
4. Configure os registros DNS conforme instruções da Vercel
5. Aguarde propagação (pode levar até 48h)

---

## ⚡ Performance

### Otimizações Aplicadas:

- ✅ Build otimizado com Vite
- ✅ Code splitting automático
- ✅ Tree shaking
- ✅ Minificação de CSS e JS
- ✅ Cache de assets estáticos (1 ano)
- ✅ Compressão gzip

### Configurações no vercel.json:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📱 Preview Deployments

A Vercel cria preview deployments automaticamente:

- **Pull Requests** → Preview URL único
- **Branches** → Preview URL único
- **Main/Master** → URL de produção

Útil para testar mudanças antes de ir para produção!

---

## 🎯 Checklist Final

Antes de considerar o deploy completo:

- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL de produção acessível
- [ ] Cadastro de beneficiário funciona
- [ ] Login de admin funciona (`1@1.com` / `111111`)
- [ ] Dashboard carrega dados
- [ ] Exportação Excel funciona
- [ ] Tema claro/escuro funciona
- [ ] Responsivo em mobile
- [ ] Console sem erros
- [ ] RLS funcionando (segurança)

---

## 📞 Suporte

### Documentação Oficial:

- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [Supabase Docs](https://supabase.com/docs)

### Problemas Comuns:

- [Vercel Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## 🎉 Pronto!

Seu Sistema Habitat Social agora está no ar! 🚀

**Próximos passos:**

1. Compartilhe a URL com os usuários
2. Configure domínio customizado (opcional)
3. Ative analytics (opcional)
4. Monitore logs e performance
5. Atualize conforme necessário (push para Git)

---

**Deploy realizado com sucesso?** ✅
**URL de produção:** `https://seu-projeto.vercel.app`
**Status:** 🟢 Online

---

*Última atualização: Novembro 2025*
