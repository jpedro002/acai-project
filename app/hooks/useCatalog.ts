import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useCatalog<T extends Record<string, unknown>>(type: string, fallbackItems: T[] = []) {
    const [items, setItems] = useState<T[]>(fallbackItems);
    const [loading, setLoading] = useState<boolean>(Boolean(db));

    useEffect(() => {
        if (!db) {
            console.warn("Firestore db is null. Check Firebase config.");
            return;
        }
        const q = query(collection(db, 'catalog'), where('type', '==', type));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data() as T);
            setItems(data.length ? data : fallbackItems);
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching catalog items of type ${type}:`, error);
            setItems(fallbackItems);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [type, fallbackItems]);

    return {
        items: db ? items : fallbackItems,
        loading: db ? loading : false,
    };
}
