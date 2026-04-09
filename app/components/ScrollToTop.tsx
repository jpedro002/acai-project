'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollToTop() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Faz scroll para topo imediatamente
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

        // E também tenta depois de um pequeno delay para garantir
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return null;
}
