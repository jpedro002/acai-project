"use client";

import Image from "next/image";

interface FruitsStepProps {
    selectedFruits: string[];
    setSelectedFruits: (fruits: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function FruitsStep({ selectedFruits, setSelectedFruits, onNext, onBack }: FruitsStepProps) {
    const maxFruits = 3;

    const fruits = [
        {
            id: "morango",
            title: "Morango",
            description: "Docinho, suculento e colhido no ponto perfeito para o seu bowl.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEdX7EyJW0o3Pl0TRjXpI0BMv7V9-6BPgSSkQpS0awLEivedQ6Wgs8RR6oUVAi44vWyAerWWGx1gpGpXQVTYiDRSX0PcslTAkFYlOnHg1BKtJ3KOPhH2QaKduFVV3Qb4Rv119enP_Fbuv2RKThj4ufp_D9OLV7F4EtB4eOyRC26M7kxn8ZRaVDtMWMQY8jRYJ9XTpEnHP71KZy1DI4swAfGuRstfI3sSBUVf-wyaAUiVKROB_i_elusYmJhiRaOXqLdXeT47x5OEkw",
            imageAlt: "top-down macro shot of vibrant red sliced strawberries on a clean white surface with natural morning light"
        },
        {
            id: "banana",
            title: "Banana",
            description: "A cremosidade clássica que todo açaí de respeito exige.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeQBDyBGGrkJebCu7m15L1yCEvwJW2PpTX1XPcyme6i4rkTnd0r6-uGqu5ow4irS-_6CvHyA9VyET1DND5UrGNzxg9NBLm__u3OAwYVJEzU_tfIvISVe_Okekk0iz_v_yVruuNvJTXBlnD8uPABW4t2PcNd_6EixAjbBoIA8V6P9ntyIL-WZV_XMePQXkSglcASB1IcUFTOzHJq_wBk4P44lXylXWFeGFWcpFOevXVmw0VUczhvovKpXV55tFhNn0BXHIyNiaW0Ce3",
            imageAlt: "close-up of perfectly ripe yellow banana slices arranged symmetrically on a minimalist dark background"
        },
        {
            id: "kiwi",
            title: "Kiwi",
            description: "Um toque cítrico e refrescante para equilibrar o sabor.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gJTZdcKB3h6jHsYKt0e1KVDvR36155coac_rLoYl1mkyU4YGRnC7K6sySEEubcB_0d0LQ0adXf9D3cgBVQj_wnq-KJ_K8PudQATvxq_C8QidQaA80PXmDPSwx2W9bbu7vNv7x2BxWGBMiyIECCfBDooPwWXwsS0e2pEo4bb6oTrFVJuGk5dFDYIsSQnMMQBo0vum-2mnzCSYTUTRmAacveVrn-UKb5I4WY2cgpgx62ARmqkF-two5FOG7wcF8qdWzUZPUxJL0THs",
            imageAlt: "refreshing top-down view of vibrant green kiwi slices showing intricate seed patterns and glistening texture"
        },
        {
            id: "manga",
            title: "Manga",
            description: "Explosão tropical de doçura e textura aveludada.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtXCdbZIo3Y_HkD5qkRm7ykpPhKWxORN0N_Vrc3I1hADpVrPzXZgLm3KjmdCz0UHs6iSkonoHMEO5eZe0Utugxyu-LNDzWSgtTTPdO4_N8UQr83khv0ZAW2AZFEjke0NcEGbGuJTKOCWdKt7MRaXmvi8pn7Sj-80RHYri3tlwgLT4AWJr7U8z45ev-kpAplbiBqm4qewIB35wNUweFAfSnloyJYkMzJ7nVLFMZnhPLY-2_sKRRZCrJeYHwwcgrIpJ1YY2-cJ5ktZn0",
            imageAlt: "vibrant orange mango cubes in a high-key professional food photography style with soft shadows"
        },
        {
            id: "abacaxi",
            title: "Abacaxi",
            description: "Acidez vibrante para quem ama um contraste intenso.",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHFy1yRRIYQ-IeZy2NdcCgazbpmsb-UcNpr8A5XFgrmuIicj-I5LFBM9ZDpwyICJBzD2Sejl6W5sfYGUf2xsy9Ye58Fq3TTRxmtFge5Acdwco4ScK3qbDyYUeoHDIIKodhjljW8qJmjKbgH0bM0MhNywLRg1BodTtF6mLphJfABG_pwyfpNHdD9f1XpeGmdJ0AvFvUNobDHcMAtAXv01umSG_cSD3WEh7vQEailZFb8I_McjU3Hu1K-fJh8iSVXX9QymXLcP_WX3g5",
            imageAlt: "fresh golden pineapple chunks with water droplets on a neutral surface, bright tropical aesthetic"
        }
    ];

    const toggleFruit = (fruitId: string) => {
        if (selectedFruits.includes(fruitId)) {
            setSelectedFruits(selectedFruits.filter(id => id !== fruitId));
        } else {
            if (selectedFruits.length < maxFruits) {
                setSelectedFruits([...selectedFruits, fruitId]);
            }
        }
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha suas Frutas</h2>
                    </div>
                    <div className="text-on-surface-variant font-body text-sm font-medium">Até {maxFruits} opções ({selectedFruits.length}/{maxFruits})</div>
                </div>
            </div>

            {/* Options List */}
            <div className="space-y-6 mb-12">
                {fruits.map((fruit) => {
                    const isSelected = selectedFruits.includes(fruit.id);
                    return (
                        <div
                            key={fruit.id}
                            onClick={() => toggleFruit(fruit.id)}
                            className={`relative group cursor-pointer active:scale-95 transition-transform duration-200 editorial-shadow rounded-xl overflow-hidden bg-surface-container-lowest ${isSelected ? 'ring-2 ring-inverse-primary' : ''}`}
                        >
                            <div className="aspect-[16/7] w-full overflow-hidden relative">
                                <Image
                                    fill
                                    src={fruit.imageUrl}
                                    alt={fruit.imageAlt}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? '' : 'opacity-90 group-hover:scale-105'}`}
                                    unoptimized
                                />
                                {isSelected && (
                                    <div className="absolute top-4 right-4 bg-inverse-primary text-on-primary-fixed p-1.5 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="font-headline font-bold text-xl text-tertiary-container tracking-tight">{fruit.title}</h3>
                                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{fruit.description}</p>
                            </div>
                        </div>
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
