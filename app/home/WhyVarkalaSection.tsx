import Image from 'next/image';
import { RevealWrapper } from '@/app/components/ui/RevealWrapper';

const WhyVarkalaSection = () => {
    return (
        <section id="why-varkala" className="relative w-full max-w-[1920px] mx-auto my-10 px-4 md:px-8">
            <div className="relative w-full h-[500px] md:h-[700px] rounded-[2rem] overflow-hidden shadow-2xl flex items-end justify-center pb-6 md:pb-10 group">
                {/* Background Image - Using bg-cover for immersive feel, centered */}
                <Image
                    src="/images/home/varkala_cliff_view.jpg"
                    alt="Varkala Cliff View"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 80vw"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10"></div>

                <div className="relative z-20 text-center max-w-4xl px-6">
                    <RevealWrapper>
                        <h2 className="text-4xl md:text-8xl font-water-brush text-white mb-2 drop-shadow-xl leading-normal py-2">
                            <span className="text-white">Why</span> <span className="text-magenta-accent text-shadow-glow">Varkala?</span>
                        </h2>
                    </RevealWrapper>
                    <RevealWrapper delay={0.3}>
                        <p className="text-lg md:text-2xl font-annie text-gray-200 tracking-wide mb-4">
                            It's Kerala in <span className="text-magenta-accent">One Place</span>
                        </p>
                    </RevealWrapper>
                    <RevealWrapper delay={0.5}>
                        <p className="text-gray-300 font-urbanist max-w-2xl mx-auto opacity-90 leading-relaxed text-sm md:text-lg line-clamp-3 md:line-clamp-none">
                            Varkala is more than a beach town — it's Kerala in miniature. In an average 25 km radius, you can experience every element that makes Kerala world-famous.
                        </p>
                    </RevealWrapper>
                </div>
            </div>
        </section>
    );
};

export default WhyVarkalaSection;
