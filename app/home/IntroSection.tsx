import React from 'react';
import { RevealWrapper } from '@/app/components/ui/RevealWrapper';

const IntroSection = () => {
    return (
        <section id="about" className="relative py-24 md:py-32 bg-black overflow-hidden group">
            {/* Background Placeholder - Ready for future image */}
            <div className="absolute inset-0 bg-[url('/images/home/surfer_background_mobile.png')] md:bg-[url('/images/home/surfer_background.png')] bg-cover bg-center"></div>


            <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8">
                <div className="max-w-4xl">
                    <RevealWrapper>
                        <h3 className="font-water-brush text-4xl sm:text-6xl md:text-8xl text-white mb-8 leading-tight drop-shadow-xl">
                            <span className="block whitespace-nowrap">Where Kerala's Spirit</span>
                            <span className="block whitespace-nowrap">
                                Meets <span className="text-magenta-accent text-shadow-glow">Coastal Serenity</span>
                            </span>
                        </h3>
                    </RevealWrapper>
                    <RevealWrapper delay={0.3}>
                        <div className="space-y-4 text-gray-200 font-urbanist text-lg md:text-xl leading-normal text-justify drop-shadow-md pr-0 md:pr-12">
                            <p>
                                Welcome to Kshetra Retreat, a boutique hideaway perched near the iconic North Cliff of Varkala Beach — Kerala's best-kept coastal secret. More than just a stay, Kshetra is a soulful experience crafted around nature, tradition, wellness, and exploration.
                            </p>
                            <p>
                                Here, your journey through Kerala begins at your doorstep. Step out to five stunning beaches within minutes, sail through tranquil backwaters and houseboats of Kollam just 20 km away, or trek through the misty Western Ghats and Ponmudi tea gardens about 50 km from us. From Kathakali's birthplace in Kottarakara (25 km) to the Raja Ravi Varma Palace (19 km) and royal palaces of Trivandrum (25 km) — every essence of Kerala lies within a short journey.
                            </p>
                            <p>
                                At Kshetra, we bring this all together — boutique comfort, heartfelt hospitality, and the unmatched advantage of staying in the true cross-section of Kerala tourism.
                            </p>
                        </div>
                    </RevealWrapper>
                </div>
            </div>
        </section>
    );
};

export default IntroSection;
