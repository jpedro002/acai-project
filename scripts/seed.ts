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
} catch {
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

type CatalogItem = {
    id: string;
    type: string;
    [key: string]: unknown;
};

type BuilderData = {
    builder: {
        limits: {
            creams: number;
            fruits: number;
            toppings: number;
            mix: number;
        };
        sizes: Array<{
            id: string;
            label: string;
            type: string;
            limits?: {
                creams: number;
                fruits: number;
                toppings: number;
                mix: number;
            };
        }>;
        bases: CatalogItem[];
        creams: CatalogItem[];
        fruits: CatalogItem[];
        toppings: CatalogItem[];
        mix: CatalogItem[];
        boosts: CatalogItem[];
    };
    gelatoBuilder: {
        sizes: Array<{
            value: string;
            title: string;
            price: string;
            descriptionLines: string[];
            type: string;
            limits?: {
                creams: number;
                fruits: number;
                toppings: number;
                mix: number;
            };
        }>;
    };
};

const builderDataPath = resolve(process.cwd(), 'app/data/builder-data.json');
const builderData = JSON.parse(readFileSync(builderDataPath, 'utf-8')) as BuilderData;

async function deleteCollection(collectionRef: FirebaseFirestore.CollectionReference, batchSize = 200): Promise<void> {
    while (true) {
        const snapshot = await collectionRef.limit(batchSize).get();
        if (snapshot.empty) {
            break;
        }

        const batch = db.batch();

        for (const doc of snapshot.docs) {
            const subcollections = await doc.ref.listCollections();
            for (const subcollection of subcollections) {
                await deleteCollection(subcollection, batchSize);
            }
            batch.delete(doc.ref);
        }

        await batch.commit();
    }
}

async function clearFirestoreDatabase() {
    const collections = await db.listCollections();
    for (const collection of collections) {
        console.log(`Cleaning collection: ${collection.id}`);
        await deleteCollection(collection);
    }
    console.log('Database cleaned successfully');
}

async function seedCatalog() {
    const catalogRef = db.collection('catalog');
    const catalogItems: CatalogItem[] = [
        ...builderData.builder.bases,
        ...builderData.builder.creams,
        ...builderData.builder.fruits,
        ...builderData.builder.toppings,
        ...builderData.builder.mix,
        ...builderData.builder.boosts,
    ];

    for (const item of catalogItems) {
        const docId = `${item.type}-${item.id}`;
        await catalogRef.doc(docId).set(item);
        console.log(`Added catalog item: ${docId}`);
    }
}

async function seedConfigs() {
    await db.collection('configs').doc('builder').set({
        sizes: builderData.builder.sizes,
        limits: builderData.builder.limits,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection('configs').doc('gelatoBuilder').set({
        sizes: builderData.gelatoBuilder.sizes,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Added config docs: builder and gelatoBuilder');
}

async function seedDatabase() {
    console.log('Starting database reset and seed...');
    
    try {
        await clearFirestoreDatabase();
        await seedCatalog();
        await seedConfigs();
        
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
        console.log(`Added admin user with uid: ${adminUid}`);

        console.log('\nDatabase seeded successfully');
        console.log('Next steps:');
        console.log('1. Create a user in Firebase Auth with email: admin@acai.com');
        console.log('2. The user can now log in with phone: 11999999999');
        console.log('3. Admin role is automatically set in Firestore');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
