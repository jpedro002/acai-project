import Image from "next/image";

interface BaseCardProps {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    imageAlt: string;
    badge?: string;
    selected?: boolean;
    imageBgClass?: string;
    onClick?: () => void;
}

export default function BaseCard({
    title,
    description,
    price,
    imageUrl,
    imageAlt,
    badge,
    selected = false,
    imageBgClass = "bg-tertiary-container",
    onClick
}: BaseCardProps) {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-surface-container-lowest rounded-3xl p-6 shadow-[0_32px_48px_rgba(61,11,55,0.04)] hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 ${selected ? 'border-[#FFB800]' : 'border-transparent hover:border-[#FFB800]/20'}`}
        >
            <div className={`relative h-40 w-full mb-6 rounded-2xl overflow-hidden ${imageBgClass}`}>
                <Image
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                    alt={imageAlt}
                    src={imageUrl}
                    unoptimized
                />
                {badge && (
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-tertiary">{badge}</span>
                    </div>
                )}
            </div>
            <h3 className="text-xl font-headline font-bold text-tertiary mb-1">{title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{description}</p>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-tertiary">{price}</span>
                {selected ? (
                    <div className="bg-[#FFB800] text-[#3D0B37] p-1 rounded-full">
                        <span className="material-symbols-outlined" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                ) : (
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-[#FFB800] transition-colors" data-icon="add_circle">add_circle</span>
                )}
            </div>
        </div>
    );
}
