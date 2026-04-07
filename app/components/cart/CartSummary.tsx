interface CartSummaryProps {
    subtotal: number;
    deliveryFee?: number;
    discount?: number;
}

export default function CartSummary({
    subtotal,
    deliveryFee = 0,
    discount = 0,
}: CartSummaryProps) {
    const total = subtotal + deliveryFee - discount;

    return (
        <section className="bg-surface-container-low rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-3 sm:space-y-4 mb-8 sm:mb-10 border border-outline-variant/10">
            <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-headline text-tertiary">
                    R$ {subtotal.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Taxa de Entrega</span>
                <span className="font-headline text-secondary italic">
                    {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}
                </span>
            </div>
            {discount > 0 && (
                <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="text-sm font-medium">Desconto</span>
                    <span className="font-headline text-secondary italic">
                        -R$ {discount.toFixed(2)}
                    </span>
                </div>
            )}
            <div className="pt-4 mt-4 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-headline text-xl text-tertiary">Total</span>
                <span className="font-headline text-2xl text-tertiary">
                    R$ {total.toFixed(2)}
                </span>
            </div>
        </section>
    );
}
