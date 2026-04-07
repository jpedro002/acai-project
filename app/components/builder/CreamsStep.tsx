"use client";

import Image from "next/image";

interface CreamsStepProps {
    selectedCreams: string[];
    setSelectedCreams: (creams: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function CreamsStep({ selectedCreams, setSelectedCreams, onNext, onBack }: CreamsStepProps) {
    const maxCreams = 3;

    const creams = [
        {
            id: "cupuacu",
            title: "CREME CUPUAÇU",
            description: "Tropical e refrescante",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW4c2Mhn6b7zmVckeQViBkqnPqJJrW8a51ZI35jfNywMJ3oTJQ36Y-RQHezLHSYIMs_M8NR8tgAb4Jxk6fB4EMawjApJuhXSvoTq3wmR5H6AOk98LcjROcNFfdW1Ypv6s7EB5UZt5x7ShMvz2-EiOkWHMCIlvAivrmkuU1FzmQqioEsZDGt1MjnDl1ogb4_7N2cHoDGMB-tm6LIcaZukdFP15MK_EjhpXu7puvVf4A67iyLBwb-UpMzxFi4VM9DD5o8psPamMMYnTJ",
            imageAlt: "thick velvety white cupuacu cream in a glass bowl"
        },
        {
            id: "ninho",
            title: "CREME DE NINHO",
            description: "O clássico que amamos",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnUB5fX7EjxxdbCT66OYbUZ0I0C221A0yf8X-qOE3tbkaUWp2dDa6sr-q87i4iLr8-Bb01uWcxw8OgLiImyJKr1Gm5oLa0OwhZPUPOA-h6fquIjeAgZahC_sdt1DPwd1uojMxJzNibF3J1HongMx_mfAAMRxcyE6CBK_HSGGkd0250W9uWiRjQHh3uulc3hnYjgW4HhnZSSfARrT46SAIYNzOEJgwDndqcfPJiZsqOOfMRuLe0eAFWs4eP-88Bd51ZtdEtoz7B9KUn",
            imageAlt: "rich creamy yellowish milk powder spread"
        },
        {
            id: "maracuja",
            title: "CREME MARACUJÁ",
            description: "Azedinho equilibrado",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8O5MkrAZPIklG65Q03PwSaPlRH86dHlBgATYPLgoQshoTx9xori20Zc0_NVcxxyY1SxY4-WR8yKGcTa1PFFVVnTKHjbYfqrzVzLR5L6mGn62_cT6TMNiZjDVuEWjKxJhFy67PsMhA_DrPhcgCl6DrTdo-Lyyg8lU-KShz0E8t00uGvX-fp2EQpb_ayB-HkXgn6gvY8B1St_OFQ_A482g6Kni_3jNtmAAWZlgTGtbewoI7RJZU7nOViZOaLf2DURX13ZMdEM_1d7cR",
            imageAlt: "vibrant yellow passion fruit mousse"
        },
        {
            id: "morango",
            title: "CREME MORANGO",
            description: "Frescor da fruta",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClqyB5mwWbjtiXXGAZwoWILBZrPpWHovgDHRJQ7QKL0zmSRlURtuksZpC9trylg0GfZWTK7SYUz02BUY-ZU3hIJha3YUcTWd6JR3DRI1kYjPiAf0JFbJhxqmVXL8aDn48e74R7R0rKKnIKr2Cj4KT5epdIcCx77JqWCtmjLLH5EI4SAfkXPgIqixAT-MoLP7KJXa-SG4nM-eKcPZJmK2rgBPvpmDfwF9bY9puAJIIli2eMbneOGVLRZiXTFQ_WPm9WblALzMAllNAT",
            imageAlt: "soft pink strawberry cream with visible fruit chunks"
        },
        {
            id: "oreo",
            title: "CREME OREO",
            description: "Crocante e cremoso",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqm9SNniKHXQt_qzCpekrqHmUm_8oToB2Hf0ikflJnqqJWy8-Zgt8U2UxpsBI0VexHQyFRV2Tx0wrP5PfeJYI1TrKDgFCb9NMGUpiK-rqSg6vbYGI6_sn93M4paPlMTFafOUopyLvxPJ_CdTrvuHFrZP_kuRciNtooj1rQtQb0iH8gkcMCKGLmRZgyPkfcD6toDbVduF8YI5CuwcHIzf471kFK84mJlhNbyPjw8_eRJcB8eqPveEKvMJRUx2ZaobcCeLtW_xNlb9bl",
            imageAlt: "white vanilla cream mixed with dark chocolate cookie crumbles"
        },
        {
            id: "pacoquita",
            title: "CREME PAÇOQUITA",
            description: "Sabor intenso de amendoim",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6TQM3_jx1-DRLAbBR0hlqX_XXir3OSiG-pWdcVbiHoQ0_MMQpbjbB-IlKCa-oNXWhvfru80anO0ZUcDCI0n2iA1NbvyR7IFPPEVxMUsbiYz0TNINIFYb_dRYSodZ7y_T3whvynIoorbS35-Mu7u4UOSzM6pLyrdS_gwItGOio2K_lrNWeUiDOxd-n5hWQ957r-rexSBsaOG3IPw4OkW6mrC8MAzJuPCPNu-GxbeLIacWsgPO8bQvUcuGHmTCvKtpciybJljnHXD4e",
            imageAlt: "warm beige peanut cream with visible ground nuts"
        },
        {
            id: "tapioca",
            title: "TAPIOCA CREMOSA",
            description: "Textura única e sabor autêntico da Amazônia",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlLjmk6LYbgppJcCnXMb-aYlNLlQYWK1wCsbeO4-3vp7hHxwRXS3C4iP9vkjDKOgvSSGC_jCoSTqZGXGZfQc6JusZsyw3JkMl7GvQB7KYyciiNXkzMtvrkS2DVWbnrEXns7IfS4b1nVLASgqrBsUvzB1uylp-GMhwJWIPA5fe8mjvqA3O5iF-xfUtFn3E8si4ljsaB_T27huXJauyRuzyeQc69NzrrclOInfJJYesOJawfb0Q-VOoJEOLkBYq9IpbMYme3xqLoup47",
            imageAlt: "traditional brazilian tapioca cream with visible small translucent pearls",
            isFeatured: true
        }
    ];

    const toggleCream = (creamId: string) => {
        if (selectedCreams.includes(creamId)) {
            setSelectedCreams(selectedCreams.filter(id => id !== creamId));
        } else {
            if (selectedCreams.length < maxCreams) {
                setSelectedCreams([...selectedCreams, creamId]);
            }
        }
    };

    return (
        <div className="w-full">
            {/* Title Section */}
            <div className="mt-8 mb-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-black text-tertiary tracking-tight">Escolha seus Cremes</h2>
                    </div>
                    <div className="text-on-surface-variant font-body text-sm font-medium">Até {maxCreams} opções ({selectedCreams.length}/{maxCreams})</div>
                </div>
            </div>

            {/* Asymmetric Hero Accent (Organic Texture) */}
            <div className="absolute -z-10 top-40 right-0 opacity-[0.04] pointer-events-none">
                <svg fill="none" height="400" viewBox="0 0 200 200" width="400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="#3D0B37"></path>
                </svg>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {creams.map((cream) => {
                    const isSelected = selectedCreams.includes(cream.id);
                    return (
                        <div
                            key={cream.id}
                            onClick={() => toggleCream(cream.id)}
                            className={`group relative bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_32px_rgba(61,11,55,0.04)] border-2 transition-all cursor-pointer ${cream.isFeatured ? 'md:col-span-2' : ''} ${isSelected ? 'border-[#FFB800]' : 'border-transparent hover:border-[#FFB800]/20'}`}
                        >
                            <div className={`flex ${cream.isFeatured ? 'flex-col md:flex-row gap-6' : 'flex-col'}`}>
                                <div className={`${cream.isFeatured ? 'aspect-[16/9] md:w-1/2' : 'aspect-[4/3]'} rounded-xl overflow-hidden mb-4 relative`}>
                                    <Image
                                        fill
                                        src={cream.imageUrl}
                                        alt={cream.imageAlt}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>
                                <div className={`flex justify-between items-center ${cream.isFeatured ? 'flex-col justify-center flex-1 pr-4' : ''}`}>
                                    <div className={cream.isFeatured ? 'flex justify-between items-start w-full' : ''}>
                                        <div>
                                            <h3 className={`${cream.isFeatured ? 'text-xl' : ''} font-bold text-tertiary tracking-tight`}>{cream.title}</h3>
                                            <p className={`text-xs text-on-surface-variant font-medium ${cream.isFeatured ? 'mt-1' : ''}`}>{cream.description}</p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[#FFB800]' : 'border-2 border-surface-container group-hover:border-[#FFB800]'}`}>
                                            <span className={`material-symbols-outlined transition-transform ${isSelected ? 'text-[#271900] scale-100' : 'text-[#FFB800] scale-0 group-hover:scale-100'}`} style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>check</span>
                                        </div>
                                    </div>
                                    {cream.isFeatured && (
                                        <div className="mt-4 flex gap-2">
                                            <span className="text-[10px] bg-secondary-container text-on-secondary-container font-bold px-2 py-1 rounded uppercase tracking-wider">Favorito da Casa</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isSelected && !cream.isFeatured && (
                                <div className="absolute top-6 right-6 bg-[#FFB800] text-[#271900] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Selecionado</div>
                            )}
                            {isSelected && cream.isFeatured && (
                                <div className="absolute top-6 right-6 bg-[#FFB800] text-[#271900] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Selecionado</div>
                            )}
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
                    VOLTAR
                </button>
                <button
                    onClick={onNext}
                    className="w-full md:w-auto bg-inverse-primary text-on-primary-fixed px-10 py-4 rounded-full font-headline font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-xl shadow-[#FFB800]/20"
                >
                    PRÓXIMO PASSO
                </button>
            </div>
        </div>
    );
}