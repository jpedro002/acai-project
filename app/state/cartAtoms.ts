import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type BuilderKind = 'acai' | 'gelato';

export interface CartSelections {
    baseId?: string;
    baseTitle?: string;
    creams: string[];
    fruits: string[];
    toppings: string[];
    mix: string[];
    boosts: Record<string, number>;
    observations?: string;
}

export interface CartItemType {
    id: string;
    kind: BuilderKind;
    name: string;
    flavor: string;
    size: string;
    price: number;
    image: string;
    quantity: number;
    selections: CartSelections;
    createdAt: string;
}

export interface AddCartItemInput {
    kind: BuilderKind;
    name: string;
    flavor: string;
    size: string;
    price: number;
    image: string;
    selections: CartSelections;
    quantity?: number;
}

const getCartId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const cartItemsAtom = atomWithStorage<CartItemType[]>(
    'acai-project-cart-v1',
    []
);

export const cartCountAtom = atom((get) => {
    return get(cartItemsAtom).reduce((count, item) => count + item.quantity, 0);
});

export const cartSubtotalAtom = atom((get) => {
    return get(cartItemsAtom).reduce((sum, item) => sum + item.price * item.quantity, 0);
});

export const addCartItemAtom = atom(null, (get, set, input: AddCartItemInput) => {
    const currentItems = get(cartItemsAtom);

    const newItem: CartItemType = {
        id: getCartId(),
        kind: input.kind,
        name: input.name,
        flavor: input.flavor,
        size: input.size,
        price: input.price,
        image: input.image,
        quantity: input.quantity ?? 1,
        selections: input.selections,
        createdAt: new Date().toISOString(),
    };

    set(cartItemsAtom, [...currentItems, newItem]);
});

export const updateCartItemQuantityAtom = atom(
    null,
    (get, set, payload: { id: string; quantity: number }) => {
        const nextItems = get(cartItemsAtom)
            .map((item) =>
                item.id === payload.id
                    ? { ...item, quantity: payload.quantity }
                    : item
            )
            .filter((item) => item.quantity > 0);

        set(cartItemsAtom, nextItems);
    }
);

export const removeCartItemAtom = atom(null, (get, set, itemId: string) => {
    set(
        cartItemsAtom,
        get(cartItemsAtom).filter((item) => item.id !== itemId)
    );
});

export const clearCartAtom = atom(null, (_get, set) => {
    set(cartItemsAtom, []);
});
