import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Carrega o .env.local (igual fazemos no seed de catálogo)
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
    console.warn('⚠️ Não foi possível ler .env.local, usando variáveis de ambiente do sistema.');
}

// Verifica e inicializa as credenciais
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Credenciais do Firebase ausentes no .env.local');
    process.exit(1);
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdminUser() {
    // Você pode alterar o email e a senha aqui ou passar via linha de comando
    const email = process.argv[2] || 'admin@acai.com';
    const password = process.argv[3] || 'senhaSecreta123';

    console.log(`\n⏳ Criando usuário admin: ${email}...`);

    try {
        let userRecord;
        try {
            // Tenta criar o usuário primeiro
            userRecord = await auth.createUser({
                email,
                password,
                emailVerified: true,
            });
            console.log(`✅ Usuário criado no Firebase Auth com UID: ${userRecord.uid}`);
        } catch (error: any) {
            // Se o e-mail já existe, vamos pegar o UID existente para transformá-lo em admin
            if (error.code === 'auth/email-already-exists') {
                console.log(`ℹ️ O e-mail ${email} já existe no Auth. Vamos atualizar suas permissões.`);
                userRecord = await auth.getUserByEmail(email);
            } else {
                throw error;
            }
        }

        // 1. Adiciona a Custom Claim (Poder principal no nível do Token)
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        console.log(`✅ Custom Claim 'admin: true' adicionada ao token.`);

        // 2. Salva o perfil no Firestore com a role admin
        await db.collection('users').doc(userRecord.uid).set({
            email,
            role: 'admin',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }); // Usamos merge para não apagar dados já existentes
        console.log(`✅ Documento no Firestore criado/atualizado em 'users/${userRecord.uid}' com role: 'admin'.`);

        console.log(`\n🎉 Usuário Admin configurado com sucesso!`);
        console.log(`👉 Email: ${email}`);
        console.log(`👉 Senha: ${password} (Se não tiver alterado anteriormente)`);
        
    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error);
    } finally {
        process.exit();
    }
}

createAdminUser();