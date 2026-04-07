import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useCatalog(type: string) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            console.warn("Firestore db is null. Check Firebase config.");
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'catalog'), where('type', '==', type));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(data);
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching catalog items of type ${type}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [type]);

    return { items, loading };
}
