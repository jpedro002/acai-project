import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useConfigDoc<T>(docId: string, fallbackData: T) {
    const [data, setData] = useState<T>(fallbackData);
    const [loading, setLoading] = useState<boolean>(Boolean(db));

    useEffect(() => {
        if (!db) {
            console.warn("Firestore db is null. Check Firebase config.");
            return;
        }

        const configRef = doc(db, 'configs', docId);
        const unsubscribe = onSnapshot(configRef, (snapshot) => {
            if (snapshot.exists()) {
                setData(snapshot.data() as T);
            } else {
                setData(fallbackData);
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching config doc ${docId}:`, error);
            setData(fallbackData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [docId, fallbackData]);

    return {
        data: db ? data : fallbackData,
        loading: db ? loading : false,
    };
}
