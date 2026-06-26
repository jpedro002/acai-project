# 🌱 Database Seeding Guide

Este guia explica como popular o seu banco de dados Firebase com os dados iniciais (catálogo de produtos e usuário admin).

## Pré-requisitos

1. **Firebase Project configurado** - Você deve ter criado um projeto no [Firebase Console](https://console.firebase.google.com)
2. **Firestore Database criado** - Crie um banco de dados Firestore no modo de produção
3. **Variáveis de Ambiente** - Preencha seu `.env.local` com as credenciais

## Passos

### 1. Copie o arquivo de exemplo
```bash
cp .env.example .env.local
```

### 2. Adicione suas credenciais Firebase

Vá para [Firebase Console](https://console.firebase.google.com):

1. Abra seu projeto
2. Vá em **Configurações do Projeto** (engrenagem no canto superior esquerdo)
3. Guia **Geral**
4. Copie os dados da seção "Seus aplicativos" (Web):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

5. Para credenciais do Admin SDK:
   - Vá em **Contas de Serviço**
   - Clique em **Gerar nova chave privada**
   - Um arquivo JSON será baixado
   - Extraia desse JSON:
     - `FIREBASE_CLIENT_EMAIL` (campo `client_email`)
     - `FIREBASE_PRIVATE_KEY` (campo `private_key` - copie com as quebras de linha: `\n`)

### 3. Popular o banco de dados

```bash
bun run seed
```

Você verá uma saída como:

```
🌱 Seeding database...
✅ Added base: especial (Açaí Especial)
✅ Added base: fit (Açaí Fit)
✅ Added base: sem-acai (Sem Açaí)
✅ Added fruit: morango (Morango)
... (mais frutas)

✅ Added admin user with uid: admin_user_seed_uid

🎉 Database seeded successfully!
📝 Next steps:
1. Create a user in Firebase Auth with email: admin@acai.com
2. ...
```

### 4. Criar usuário Admin no Firebase Auth

1. No Firebase Console, vá em **Autenticação**
2. Clique em **Adicionar usuário**
3. Email: `admin@acai.com`
4. Senha: uma senha segura (por exemplo: `Admin@123456`)
5. **Salvar usuário**

> **Nota**: O usuário pode logar na aplicação usando o número de telefone `11999999999`. Se desejar definir uma senha, ele pode fazê-lo na primeira vez que logar.

## Verificar se tudo funcionou

1. Abra o [Firestore Console](https://console.firebase.google.com)
2. Procure pela coleção **`catalog`** - deve ter vários documentos com bases e frutas
3. Procure pela coleção **`users`** - deve ter um documento com UID `admin_user_seed_uid` com role `admin`

## Troubleshooting

### Erro: "Missing Firebase credentials in .env.local"

- Verifique se seu `.env.local` está preenchido corretamente
- Certifique-se de que `FIREBASE_PRIVATE_KEY` é uma string com `\n` no lugar das quebras de linha reais

### Erro: "Permission denied"

- As Firestore Rules podem estar bloqueando. Verifique em **Firestore** > **Regras** se estão configuradas corretamente
- Ou execute o seed a partir do Firebase Console (usando o Admin SDK direto é mais confiável)

### Erro: "Invalid private key"

- Verifique se a chave privada está corretamente formatada
- Firebase private key começa com `-----BEGIN PRIVATE KEY-----`
- Certifique-se de manter os `\n` no final de cada linha

## Próximos Passos

Depois que o seed for concluído com sucesso:

1. Inicie o app: `bun run dev`
2. Navegue para http://localhost:3000
3. Você pode logar como:
   - **Cliente**: Qualquer número de telefone (ex: `11988887777`)
   - **Admin**: Número `11999999999` ou email `admin@acai.com`
4. O painel Admin estará disponível em `/admin` após logar

---

**Dúvidas?** Leia a documentação do [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start) ou [Firestore](https://firebase.google.com/docs/firestore)
