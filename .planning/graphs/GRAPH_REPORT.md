# Graph Report - acai-project  (2026-06-25)

## Corpus Check
- 81 files · ~45,008 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 420 nodes · 681 edges · 24 communities (19 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ccd0ad81`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 58 edges
2. `compilerOptions` - 16 edges
3. `useCatalog()` - 15 edges
4. `useConfigDoc()` - 11 edges
5. `🚀 Próximos Passos - Setup Firebase` - 10 edges
6. `LayoutHeader()` - 9 edges
7. `Button()` - 9 edges
8. `CartItemType` - 7 edges
9. `tailwind` - 6 edges
10. `aliases` - 6 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogMedia()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dialog.tsx → lib/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- 1-file cycle: `lib/firebase/admin.ts -> lib/firebase/admin.ts`

## Communities (24 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (58): COLUMNS, INITIAL_ORDERS, Order, OrderItem, PAYMENT_LABELS, STATUS_MAP, ViewMode, cn() (+50 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (28): SessionResponse, AuthMode, PhoneLogin(), PhoneLoginResult, Step, CartProps, CartItem(), CartItemProps (+20 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (31): AdminLayout(), getAllowedAdminEmails(), metadata, DELETE(), getCookieOptions(), POST(), DELETE(), getCookieOptions() (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (23): BaseCardProps, BaseStep(), BaseStepProps, BoostStep(), BoostStepProps, CreamsStep(), CreamsStepProps, FruitsStep() (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (23): Admin, CatalogItem, CatalogPage(), SizeItem, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (24): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (11): PageProps, Cart(), CartModal(), CartModalProps, LayoutSelector(), LayoutSelectorProps, LayoutV1(), LayoutV1Skeleton() (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (20): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+12 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (16): 1️⃣ Criar Projeto Firebase, 2️⃣ Ativar Firestore Database, 3️⃣ Ativar Firebase Authentication, 4️⃣ Deploy das Firestore Rules, 5️⃣ Copiar Credenciais para `.env.local`, 6️⃣ Popular o Banco de Dados, 7️⃣ Testar Localmente, 8️⃣ Deploy na Vercel (Opcional) (+8 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (13): 1. Copie o arquivo de exemplo, 2. Adicione suas credenciais Firebase, 3. Popular o banco de dados, 4. Criar usuário Admin no Firebase Auth, 🌱 Database Seeding Guide, Erro: "Invalid private key", Erro: "Missing Firebase credentials in .env.local", Erro: "Permission denied" (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.23
Nodes (11): BuilderData, builderDataPath, CatalogItem, clearFirestoreDatabase(), db, deleteCollection(), envPath, privateKey (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (5): inter, metadata, RootLayout(), ScrollToTop(), JotaiProvider()

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (5): acai-project, acai-project, Deploy on Vercel, Getting Started, Learn More

### Community 15 - "Community 15"
Cohesion: 0.50
Nodes (3): app, { getFirestore }, { initializeApp, cert }

## Knowledge Gaps
- **177 isolated node(s):** `SessionResponse`, `Admin`, `SizeItem`, `CatalogItem`, `NAV_ITEMS` (+172 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 5` to `Community 8`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `firebase-admin` connect `Community 5` to `Community 2`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 0` to `Community 4`, `Community 13`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `SessionResponse`, `Admin`, `SizeItem` to the rest of the system?**
  _177 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0594679186228482 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05877551020408163 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07973421926910298 - nodes in this community are weakly interconnected._