import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually for Bun
const envPath = resolve(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.warn('⚠️ Could not read .env.local, using system environment variables');
}

// Load environment variables
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Missing Firebase credentials in .env.local');
    console.error('Please set: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    process.exit(1);
}

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}

const db = admin.firestore();

const bases = [
    {
        id: "especial",
        title: "Açaí Especial",
        description: "A receita original do Pará. Intenso, cremoso e pura energia.",
        prices: { "300": 15.90, "500": 22.90, "700": 28.90, "1000": 38.90 },
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNEP2OH8aL6R3rOfF3krYmZL0v0tUXwChoJmA7tM5rAuAALnLHfQfBpCjH8GPJGkZds6GNgn3QGo3h-R8IiTGjEeqz3X9y1pUmpclWtrjbDzZZH8SlIZ09SCXcdfuTFzSwGDOxpIGltwNYijwIN_2BFHA0egWbM6FLPX-YjYFVbcYkJu6nZMTqCogGzogIVh5syCGFJhXlDDI-bPKW7cL-4OQL7jvTlJloG5oLTP5uc5VGHXNjI81s44Y93Fu7NC6A_gyuEOMYp2RQ",
        imageAlt: "rich deep purple acai berry cream texture in a bowl",
        badge: "CLÁSSICO",
        imageBgClass: "bg-tertiary-container",
        type: "base"
    },
    {
        id: "fit",
        title: "Açaí Fit",
        description: "Todo o sabor e benefícios do açaí, sem açúcar (adoçado com stevia).",
        prices: { "300": 18.90, "500": 25.90, "700": 31.90, "1000": 42.90 },
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNTqFCC_OasS6uxCGXPPVX8u7e-AiKEcTUtTAtgN5w1D5ORk4EFnCHe4Q5gR4sp_TKEfikhBiXyiGOTv0V8wpeq4ivxjzOpGSx4XYDyZxigvC-oOgwvty4xujLVp0tx-ui0MuhzLJ0_hMFdySpI63JIMUgg2YjXvOBZiQ0w6wnot5ujU2_-KveAXIwXmH9bgZ_x1wi9-vtTtgO4qc4fGHdjeOPNvGUvNmhlgP42zm5lUjpyFuiW-8sDN_Lm110lEw0d0TIfcZI0NOC",
        imageAlt: "vibrant deep purple acai blend in a glass bowl",
        badge: "ZERO AÇÚCAR",
        imageBgClass: "bg-surface-container-high",
        type: "base"
    },
    {
        id: "sem-acai",
        title: "Sem Açaí",
        description: "Explore outras opções incríveis de cremes como sua base.",
        prices: { "300": 16.90, "500": 23.90, "700": 29.90, "1000": 39.90 },
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJfyZ9tNfdFW8d3llc_kOFdyck2JzFJvCbECWRGIPEHeFMWgziAX8rYvinPSLcoCnhBKrjYSJ20F2G7_t4kHD-D6RO0FyET6m85onROFc8v2O2MAmAqzpJaOErbsBK4uQorVPb6WZt63ynE4fMIyx_5CVm60DiIQogsr7RsRmG8XNrHKoZzUXYD5i2ukbsbw0cRWUSw5CLrwbXZXSqvFkzNf2XOA1XaoGP-mD9c3qoCV6Y4ZnOBT-n29bP4dojJvUOlKAGmmfgAG7n",
        imageAlt: "pale yellow creamy cupuacu fruit pulp texture",
        badge: "DIFERENCIADO",
        imageBgClass: "bg-secondary-container",
        type: "base"
    }
];

const fruits = [
    {
        id: "morango",
        title: "Morango",
        description: "Docinho, suculento e colhido no ponto perfeito para o seu bowl.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEdX7EyJW0o3Pl0TRjXpI0BMv7V9-6BPgSSkQpS0awLEivedQ6Wgs8RR6oUVAi44vWyAerWWGx1gpGpXQVTYiDRSX0PcslTAkFYlOnHg1BKtJ3KOPhH2QaKduFVV3Qb4Rv119enP_Fbuv2RKThj4ufp_D9OLV7F4EtB4eOyRC26M7kxn8ZRaVDtMWMQY8jRYJ9XTpEnHP71KZy1DI4swAfGuRstfI3sSBUVf-wyaAUiVKROB_i_elusYmJhiRaOXqLdXeT47x5OEkw",
        imageAlt: "top-down macro shot of vibrant red sliced strawberries on a clean white surface with natural morning light",
        type: "fruit"
    },
    {
        id: "banana",
        title: "Banana",
        description: "A cremosidade clássica que todo açaí de respeito exige.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeQBDyBGGrkJebCu7m15L1yCEvwJW2PpTX1XPcyme6i4rkTnd0r6-uGqu5ow4irS-_6CvHyA9VyET1DND5UrGNzxg9NBLm__u3OAwYVJEzU_tfIvISVe_Okekk0iz_v_yVruuNvJTXBlnD8uPABW4t2PcNd_6EixAjbBoIA8V6P9ntyIL-WZV_XMePQXkSglcASB1IcUFTOzHJq_wBk4P44lXylXWFeGFWcpFOevXVmw0VUczhvovKpXV55tFhNn0BXHIyNiaW0Ce3",
        imageAlt: "close-up of perfectly ripe yellow banana slices arranged symmetrically on a minimalist dark background",
        type: "fruit"
    },
    {
        id: "kiwi",
        title: "Kiwi",
        description: "Um toque cítrico e refrescante para equilibrar o sabor.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gJTZdcKB3h6jHsYKt0e1KVDvR36155coac_rLoYl1mkyU4YGRnC7K6sySEEubcB_0d0LQ0adXf9D3cgBVQj_wnq-KJ_K8PudQATvxq_C8QidQaA80PXmDPSwx2W9bbu7vNv7x2BxWGBMiyIECCfBDooPwWXwsS0e2pEo4bb6oTrFVJuGk5dFDYIsSQnMMQBo0vum-2mnzCSYTUTRmAacveVrn-UKb5I4WY2cgpgx62ARmqkF-two5FOG7wcF8qdWzUZPUxJL0THs",
        imageAlt: "refreshing top-down view of vibrant green kiwi slices showing intricate seed patterns and glistening texture",
        type: "fruit"
    },
    {
        id: "manga",
        title: "Manga",
        description: "Explosão tropical de doçura e textura aveludada.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtXCdbZIo3Y_HkD5qkRm7ykpPhKWxORN0N_Vrc3I1hADpVrPzXZgLm3KjmdCz0UHs6iSkonoHMEO5eZe0Utugxyu-LNDzWSgtTTPdO4_N8UQr83khv0ZAW2AZFEjke0NcEGbGuJTKOCWdKt7MRaXmvi8pn7Sj-80RHYri3tlwgLT4AWJr7U8z45ev-kpAplbiBqm4qewIB35wNUweFAfSnloyJYkMzJ7nVLFMZnhPLY-2_sKRRZCrJeYHwwcgrIpJ1YY2-cJ5ktZn0",
        imageAlt: "vibrant orange mango cubes in a high-key professional food photography style with soft shadows",
        type: "fruit"
    },
    {
        id: "abacaxi",
        title: "Abacaxi",
        description: "Acidez vibrante para quem ama um contraste intenso.",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHFy1yRRIYQ-IeZy2NdcCgazbpmsb-UcNpr8A5XFgrmuIicj-I5LFBM9ZDpwyICJBzD2Sejl6W5sfYGUf2xsy9Ye58Fq3TTRxmtFge5Acdwco4ScK3qbDyYUeoHDIIKodhjljW8qJmjKbgH0bM0MhNywLRg1BodTtF6mLphJfABG_pwyfpNHdD9f1XpeGmdJ0AvFvUNobDHcMAtAXv01umSG_cSD3WEh7vQEailZFb8I_McjU3Hu1K-fJh8iSVXX9QymXLcP_WX3g5",
        imageAlt: "fresh golden pineapple chunks with water droplets on a neutral surface, bright tropical aesthetic",
        type: "fruit"
    }
];

async function seedDatabase() {
    console.log('🌱 Seeding database...');
    
    try {
        // Seed Catalog Items
        const catalogRef = db.collection('catalog');
        
        for (const base of bases) {
            await catalogRef.doc(base.id).set(base);
            console.log(`✅ Added base: ${base.id} (${base.title})`);
        }
        
        for (const fruit of fruits) {
            await catalogRef.doc(fruit.id).set(fruit);
            console.log(`✅ Added fruit: ${fruit.id} (${fruit.title})`);
        }
        
        // Create Initial Admin User
        // Note: In real app, create user in Auth first, then set role in Firestore
        // Using a placeholder UID for example admin
        const adminUid = "admin_user_seed_uid";
        await db.collection('users').doc(adminUid).set({
            email: "admin@acai.com",
            role: "admin",
            phone: "11999999999",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Added admin user with uid: ${adminUid}`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('📝 Next steps:');
        console.log('1. Create a user in Firebase Auth with email: admin@acai.com');
        console.log('2. The user can now log in with phone: 11999999999');
        console.log('3. Admin role is automatically set in Firestore');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
