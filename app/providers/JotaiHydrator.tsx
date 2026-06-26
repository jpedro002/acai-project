'use client';

import { ReactNode } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import { cartItemsAtom, CartItemType } from '@/app/state/cartAtoms';

interface JotaiHydratorProps {
    children: ReactNode;
    initialCartItems: CartItemType[];
}

export default function JotaiHydrator({ children, initialCartItems }: JotaiHydratorProps) {
    useHydrateAtoms([[cartItemsAtom, initialCartItems]]);

    return <>{children}</>;
}
