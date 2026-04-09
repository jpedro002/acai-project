const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp({ projectId: "demo-acai" }); // Wait, better to use process.env from seed.ts
