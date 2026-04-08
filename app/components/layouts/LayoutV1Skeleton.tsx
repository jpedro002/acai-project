import LayoutHeader from "../shared/LayoutHeader";

export default function LayoutV1Skeleton() {
    return (
        <div className="bg-background text-on-background font-body organic-texture min-h-screen overflow-x-hidden w-full relative">
            <LayoutHeader />

            <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto w-full relative z-10 animate-pulse">
                {/* Hero Section Skeleton */}
                <section className="relative py-8 md:py-20 flex flex-col md:flex-row items-center justify-between min-h-[500px] w-full">
                    <div className="relative z-10 max-w-lg w-full text-center md:text-left flex flex-col items-center md:items-start">
                        {/* Title Skeleton */}
                        <div className="w-3/4 h-12 md:h-16 bg-surface-container-high rounded-xl mb-2"></div>
                        <div className="w-1/2 h-12 md:h-16 bg-surface-container-high rounded-xl mb-6"></div>
                        
                        {/* Paragraph Skeleton */}
                        <div className="w-full md:w-3/4 h-6 bg-surface-container-high rounded-lg mb-2"></div>
                        <div className="w-2/3 md:w-1/2 h-6 bg-surface-container-high rounded-lg mb-8"></div>
                        
                        {/* Button Skeleton */}
                        <div className="w-40 h-14 bg-surface-container-high rounded-full"></div>
                    </div>

                    {/* Hero Image Skeleton */}
                    <div className="mt-12 md:mt-0 relative w-72 h-72 sm:w-80 sm:h-80 md:w-[480px] md:h-[480px] mx-auto md:mx-0 rounded-full bg-surface-container-high"></div>
                </section>

                {/* Main Options Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 my-12">
                    {/* Option 1 Skeleton */}
                    <div className="w-full aspect-[4/5] rounded-2xl bg-surface-container-high flex flex-col items-start justify-end p-8">
                        <div className="w-1/2 h-12 bg-surface-container-highest rounded-xl mb-6"></div>
                        <div className="w-32 h-12 bg-surface-container-highest rounded-full"></div>
                    </div>

                    {/* Option 2 Skeleton */}
                    <div className="w-full aspect-[4/5] rounded-2xl bg-surface-container-high flex flex-col items-start justify-end p-8">
                        <div className="w-1/2 h-12 bg-surface-container-highest rounded-xl mb-6"></div>
                        <div className="w-32 h-12 bg-surface-container-highest rounded-full"></div>
                    </div>
                </div>

                {/* Secondary Info Section Skeleton */}
                <section className="mt-12 md:mt-24 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 p-6 md:p-12 bg-white rounded-2xl shadow-sm">
                    <div className="md:w-1/2 w-full">
                        <div className="w-1/4 h-4 bg-surface-container-high rounded mb-2"></div>
                        <div className="w-full h-8 md:h-12 bg-surface-container-high rounded-xl mb-4"></div>
                        <div className="w-3/4 h-6 bg-surface-container-high rounded mb-2"></div>
                        <div className="w-1/2 h-6 bg-surface-container-high rounded"></div>
                    </div>
                </section>
            </main>
        </div>
    );
}