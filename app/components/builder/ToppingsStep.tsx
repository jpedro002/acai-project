"use client";

import Image from "next/image";

interface ToppingsStepProps {
    selectedTopping: string | null;
    setSelectedTopping: (topping: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function ToppingsStep({ selectedTopping, setSelectedTopping, onNext, onBack }: ToppingsStepProps) {
    const toppings = [
        {
            id: "caramelo",
            title: "COB. CARAMELO",
            description: "Doçura envolvente com um toque amanteigado.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuByswgQPb82McXAoURSfpGwmCLI5RtEJDiyyHRhti6KKLgzj0j6uCmiZxVtX-teNNO-fTFczU8W7WSGgCg8aFm6j-YoDUecT6jShvcN-GHr_955yqydut9GkOZbrqZcCGC-K_5i8ds70qA57zrBmid3bHa0BRmsqja4cr8IAwIo2FLXoDxmyNZhzyCKCkBTIgiyQyjxvBjcaViE2Wby5E9di1jChoQ91rb3GEY8AkULIxMfO_664vKYEr6x-htAU3KwzYApf8Q4z3hm",
            imageAlt: "Top-down macro shot of thick golden caramel sauce drizzled in artistic swirls on a clean cream surface"
        },
        {
            id: "chocolate",
            title: "COB. CHOCOLATE",
            description: "O clássico irresistível feito com cacau selecionado.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCezopo02yEcZypT0D_2QKQgUAvUcEuVJfjEtomwXI6KLKEPvMFHyRA9L96LppeitB7zcB6f4xwUe75WGujYfYlTivT6xojWc4Fx4fQp854mwrDyUHmA8Z3Icsxk5VLpSeLbh8swj6CFWpgNWMDWlcNLGVY-PkwlX6Frbls9QyzEj1KWW1GGjO6r4i1FvLgI1ZHzxf0vbfNeYK23JKe1ttFDeS1ZLWubuUIh-a-CIkO4eBrkne5uyG4GBi5qMi_OWTqI1PsHCFFm-qj",
            imageAlt: "Overhead view of rich glossy dark chocolate ganache spreading smooth across a marble background"
        },
        {
            id: "kiwi",
            title: "COB. KIWI",
            description: "Toque cítrico e refrescante para seu mix.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gJTZdcKB3h6jHsYKt0e1KVDvR36155coac_rLoYl1mkyU4YGRnC7K6sySEEubcB_0d0LQ0adXf9D3cgBVQj_wnq-KJ_K8PudQATvxq_C8QidQaA80PXmDPSwx2W9bbu7vNv7x2BxWGBMiyIECCfBDooPwWXwsS0e2pEo4bb6oTrFVJuGk5dFDYIsSQnMMQBo0vum-2mnzCSYTUTRmAacveVrn-UKb5I4WY2cgpgx62ARmqkF-two5FOG7wcF8qdWzUZPUxJL0THs",
            imageAlt: "Vibrant green kiwi fruit syrup with visible seeds in a top-down view reflecting freshness"
        },
        {
            id: "leite-condensado",
            title: "COB. LEITE CONDENSADO",
            description: "A cremosidade doce que é paixão nacional.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnUB5fX7EjxxdbCT66OYbUZ0I0C221A0yf8X-qOE3tbkaUWp2dDa6sr-q87i4iLr8-Bb01uWcxw8OgLiImyJKr1Gm5oLa0OwhZPUPOA-h6fquIjeAgZahC_sdt1DPwd1uojMxJzNibF3J1HongMx_mfAAMRxcyE6CBK_HSGGkd0250W9uWiRjQHh3uulc3hnYjgW4HhnZSSfARrT46SAIYNzOEJgwDndqcfPJiZsqOOfMRuLe0eAFWs4eP-88Bd51ZtdEtoz7B9KUn",
            imageAlt: "Top-down shot of silky thick condensed milk being poured in a circular pattern on a light surface"
        },
        {
            id: "limao",
            title: "COB. LIMÃO",
            description: "Acidez vibrante e aroma cítrico marcante.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8O5MkrAZPIklG65Q03PwSaPlRH86dHlBgATYPLgoQshoTx9xori20Zc0_NVcxxyY1SxY4-WR8yKGcTa1PFFVVnTKHjbYfqrzVzLR5L6mGn62_cT6TMNiZjDVuEWjKxJhFy67PsMhA_DrPhcgCl6DrTdo-Lyyg8lU-KShz0E8t00uGvX-fp2EQpb_ayB-HkXgn6gvY8B1St_OFQ_A482g6Kni_3jNtmAAWZlgTGtbewoI7RJZU7nOViZOaLf2DURX13ZMdEM_1d7cR",
            imageAlt: "Zesty green lime syrup with fine zest particles top view under bright studio lighting"
        },
        {
            id: "morango",
            title: "COB. MORANGO",
            description: "Sabor intenso de frutas vermelhas frescas.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEdX7EyJW0o3Pl0TRjXpI0BMv7V9-6BPgSSkQpS0awLEivedQ6Wgs8RR6oUVAi44vWyAerWWGx1gpGpXQVTYiDRSX0PcslTAkFYlOnHg1BKtJ3KOPhH2QaKduFVV3Qb4Rv119enP_Fbuv2RKThj4ufp_D9OLV7F4EtB4eOyRC26M7kxn8ZRaVDtMWMQY8jRYJ9XTpEnHP71KZy1DI4swAfGuRstfI3sSBUVf-wyaAUiVKROB_i_elusYmJhiRaOXqLdXeT47x5OEkw",
            imageAlt: "Glossy red strawberry sauce with small fruit pieces top view for food photography"
        }
    ];

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-2">Passo 4 de 7</p>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha sua Cobertura</h2>
                    </div>
                    <div className="text-on-surface-variant font-body text-sm font-medium">Escolha até 1 item</div>
                </div>
            </div>

            {/* Options List */}
            <div className="space-y-6 mb-12">
                {toppings.map((topping) => {
                    const isSelected = selectedTopping === topping.id;
                    return (
                        <label
                            key={topping.id}
                            className={`relative group block cursor-pointer active:scale-[0.98] transition-transform duration-200 editorial-shadow rounded-2xl overflow-hidden bg-surface-container-lowest border-2 ${isSelected ? 'border-[#FFB800]' : 'border-transparent'}`}
                        >
                            <input
                                type="radio"
                                name="topping"
                                value={topping.id}
                                checked={isSelected}
                                onChange={() => setSelectedTopping(topping.id)}
                                className="sr-only"
                            />
                            <div className="aspect-[16/7] w-full overflow-hidden relative">
                                <Image
                                    fill
                                    src={topping.imageUrl}
                                    alt={topping.imageAlt}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? '' : 'opacity-90 group-hover:scale-105'}`}
                                    unoptimized
                                />
                                {isSelected && (
                                    <div className="absolute top-4 right-4 bg-[#FFB800] text-primary p-1.5 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="font-headline font-bold text-xl text-tertiary-container tracking-tight">{topping.title}</h3>
                                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{topping.description}</p>
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-tertiary p-8 rounded-[32px] text-white">
                <button
                    onClick={onBack}
                    className="w-full md:w-auto bg-transparent border-2 border-white/20 text-white px-10 py-4 rounded-full font-headline font-bold text-lg hover:bg-white/10 transition-colors duration-200"
                >
                    Voltar
                </button>

                <div className="flex flex-col md:items-end text-center md:text-right w-full md:w-auto">
                    <button
                        onClick={onNext}
                        className="w-full md:w-auto bg-[#FFB800] text-[#3D0B37] px-12 py-4 rounded-full font-headline font-black text-xl hover:bg-[#FFD15C] transition-colors duration-200 shadow-[0_8px_24px_rgba(255,184,0,0.4)] hover:shadow-[0_12px_32px_rgba(255,184,0,0.6)]"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}
