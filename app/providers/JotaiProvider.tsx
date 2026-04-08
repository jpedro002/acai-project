'use client';

import { Provider } from 'jotai';
import { ReactNode } from 'react';
import { CartItemType } from '@/app/state/cartAtoms';
import JotaiHydrator from './JotaiHydrator';

interface JotaiProviderProps {
    children: ReactNode;
    initialCartItems?: CartItemType[];
}

export default function JotaiProvider({ children, initialCartItems = [] }: JotaiProviderProps) {
    return (
        <Provider>
            <JotaiHydrator initialCartItems={initialCartItems}>
                {children}
            </JotaiHydrator>
        </Provider>
    );
}
