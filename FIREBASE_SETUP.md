# 🚀 Próximos Passos - Setup Firebase

Você está muito perto! Aqui está o que você precisa fazer agora para colocar o projeto em funcionamento com Firebase e Vercel:

## 1️⃣ Criar Projeto Firebase

1. Entre em [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Criar novo projeto"**
3. Nome: `acai-project` (ou similar)
4. Configure o Google Analytics conforme preferir
5. **Criar projeto** (leva alguns minutos)

## 2️⃣ Ativar Firestore Database

1. No seu projeto Firebase, clique em **"Firestore Database"** no menu esquerdo
2. **Criar banco de dados**
3. Localização: `South America (São Paulo)` ou mais próxima a você
4. Modo de início: **Modo de produção** (ou teste se preferir testar localmente)
   > ⚠️ **Nota**: Usaremos Firestore Rules para segurança, então produção é mais seguro
5. **Criar**

## 3️⃣ Ativar Firebase Authentication

1. Vá em **Authentication** no menu esquerdo
2. **Começar**
3. Na guia **Provedores de sinal**, clique em **Email/Senha**
4. Ative **Email/Senha** e **Sem password sign-in**
5. **Salvar**

## 4️⃣ Deploy das Firestore Rules

Seu arquivo `firestore.rules` já existe no projeto. Para fazer deploy:

### Opção A: Usando Firebase CLI (Recomendado)

```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Faça login
firebase login

# Inicialize Firebase no seu projeto (se ainda não fez)
firebase init firestore

# Deploy as regras
firebase deploy --only firestore:rules
```

### Opção B: Manual no Firebase Console

1. Vá em **Firestore Database** > **Regras**
2. Cole o conteúdo do seu arquivo `firestore.rules`
3. **Publicar**

## 5️⃣ Copiar Credenciais para `.env.local`

1. No Firebase Console, vá em **Configurações do Projeto** (⚙️)
2. Guia **Geral**
3. Seção "Seus aplicativos" > Clique no app Web
4. Copie os dados de configuração
5. Crie e preencha `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Para Admin SDK (usado no seed)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Como obter credenciais do Admin SDK:

1. **Contas de Serviço** no Firebase Console
2. **Gerar nova chave privada**
3. Um arquivo JSON será baixado
4. Abra com um editor e copie os campos necessários

## 6️⃣ Popular o Banco de Dados

```bash
bun run seed
```

Isso irá:
- ✅ Adicionar o catálogo (bases de açaí, frutas, cremes, etc)
- ✅ Criar usuário admin inicial
- ✅ Popular com os dados iniciais

**Leia [SEED.md](./SEED.md) para instruções detalhadas!**

## 7️⃣ Testar Localmente

```bash
bun run dev
```

Acesse http://localhost:3000 e teste:
- ✅ Login com número de telefone
- ✅ Criação de account
- ✅ Opção de senha
- ✅ Carrinho funcionando
- ✅ Admin panel em `/admin`

## 8️⃣ Deploy na Vercel (Opcional)

### Conectar repositório Git

```bash
git add .
git commit -m "Add Firebase integration"
git push origin main
```

### Deploy na Vercel

1. Abra [Vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Conecte seu repositório Git
4. Configure variáveis de ambiente:
   - Copie todas as variáveis do `.env.local` para Vercel
5. **Deploy**

### Configurar Firebase App Check (Opcional, mas recomendado)

Para proteger suas APIs das requisições de fora da Vercel:

1. Firebase Console > **App Check**
2. Crie um "Attestation provider" com **reCAPTCHA Enterprise**
3. Configure a URL de sua app Vercel
4. Atualize sua chave pública do reCAPTCHA em `.env.local`

---

## Checklist Final ✅

- [ ] Firebase Project criado
- [ ] Firestore Database ativado
- [ ] Authentication configurado
- [ ] Firestore Rules deployadas
- [ ] `.env.local` preenchido
- [ ] `bun run seed` executado com sucesso
- [ ] Aplicação testada localmente
- [ ] (Opcional) Deployado na Vercel

---

**Problemas?** Consulte:
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js + Firebase](https://nextjs.org/learn)
- [SEED.md](./SEED.md) - Setup specific do seed

Sucesso! 🎉
