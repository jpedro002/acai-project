# Açaí — Point dos Amigos

Loja online para montar e pedir açaí e gelato, com painel administrativo
para gerenciar pedidos, catálogo, clientes e administradores.

Stack: **Next.js 16** (App Router) · **React 19** · **Firebase** (Auth +
Firestore + Admin SDK) · **Cloudflare R2** (upload de imagens) · **Jotai**
(carrinho) · **Tailwind CSS 4** · **shadcn/ui** · **sonner**.

> ⚠️ Este projeto usa uma versão do Next.js com mudanças importantes em
> relação à documentação pública. Antes de escrever código, leia o guia
> relevante em `node_modules/next/dist/docs/`. Veja `AGENTS.md`.

## Pré-requisitos

- [Bun](https://bun.sh) (gerenciador/runner usado nos scripts)
- Um projeto Firebase com Firestore e Authentication (Email/Senha) ativos
- (Opcional) Um bucket Cloudflare R2 para upload de imagens do catálogo

## Configuração

1. Instale as dependências:
   ```bash
   bun install
   ```
2. Copie o arquivo de exemplo e preencha as credenciais:
   ```bash
   cp .env.example .env
   ```
   Veja `.env.example` para a lista de variáveis (Firebase Web, Firebase
   Admin SDK, R2). Detalhes de onde obter cada valor em `FIREBASE_SETUP.md`.
3. Popule o banco (catálogo + configs + usuário admin):
   ```bash
   bun run seed
   ```
   Guia completo em `SEED.md`.

## Desenvolvimento

```bash
bun run dev      # servidor de desenvolvimento em http://localhost:3000
bun run build    # build de produção
bun run start    # serve o build de produção
bun run lint     # eslint
```

## Estrutura

```
app/
  page.tsx              Landing (seletor de layout v1/v2/v3 via ?layout=)
  builder/              Montagem de açaí (fluxo de 6 passos)
  gelato-builder/       Montagem de gelato
  meu-carrinho/         Carrinho
  checkout/             Finalização do pedido (cria doc em `orders`)
  meus-pedidos/         Acompanhamento de pedidos do cliente (tempo real)
  admin/                Painel: pedidos (kanban/tabela), catálogo, clientes, admins
  admin-login/          Login do admin
  api/                  Rotas de servidor (sessão, gestão de admins, upload R2)
lib/firebase/           Inicialização dos SDKs client e admin
firestore.rules         Regras de segurança do Firestore
firestore.indexes.json  Índices compostos
```

## Deploy

O app usa rotas de API e componentes de servidor (cookies de sessão), então
**não** é um export estático. Faça deploy em uma plataforma com runtime de
servidor (Vercel, Firebase App Hosting ou Cloud Run). O bloco `hosting` em
`firebase.json` (export estático) precisa ser revisto antes de publicar.

Para publicar as regras e índices do Firestore:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Acesso

- **Cliente**: entra com número de telefone na finalização do pedido.
- **Admin**: `/admin-login` com o e-mail listado em `ADMIN_ALLOWED_EMAILS`
  (default `admin@acai.com`). O painel fica em `/admin`.
