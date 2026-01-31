import React from 'react';
import SectionWrapper from '@/app/components/ui/SectionWrapper';
import { RevealWrapper } from '@/app/components/ui/RevealWrapper';
import FeatureCard from '@/app/components/ui/FeatureCard';

const ExperienceSection = () => {
    return (
        <SectionWrapper id="experience">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 w-full">
                <RevealWrapper className="md:col-span-1" width="100%">
                    <FeatureCard
                        title="Beaches"
                        distance="Just 4 km near"
                        description="Varkala Beach, Odayam, Edava, Kappil, and Chilakoor are all within 5 km."
                        image="/images/home/beaches.png"
                    />
                </RevealWrapper>
                <RevealWrapper className="md:col-span-1" width="100%" delay={0.1}>
                    <FeatureCard
                        title="Backwaters & Houseboats (Kollam)"
                        distance="Just 20 km near"
                        description="Glide through palm-lined canals just 20 km away."
                        image="/images/home/backwaters.png"
                    />
                </RevealWrapper>
                <RevealWrapper className="md:col-span-1" width="100%" delay={0.2}>
                    <FeatureCard
                        title="Adventure & Surfing"
                        distance="Just 4 km near"
                        description="Surf the Arabian Sea, kayak the Varkala backwaters, or paraglide from the cliffs — all steps from Kshetra."
                        image="/images/home/surfing.png"
                    />
                </RevealWrapper>

                <RevealWrapper className="md:col-span-1" width="100%" delay={0.3}>
                    <FeatureCard
                        title="Jatayu Earth Center"
                        distance="Just 25 km near"
                        description="Explore the world's largest bird sculpture and zip-line through nature 25 km away."
                        image="/images/home/jatayu.png"
                    />
                </RevealWrapper>
                <RevealWrapper className="md:col-span-1" width="100%" delay={0.4}>
                    <FeatureCard
                        title="Ponmudi Hills & Tea Gardens"
                        distance="Just 50 km near"
                        description="A scenic 2-hour drive (50 km) through winding ghats and lush estates."
                        image="/images/home/ponmudi.png"
                    />
                </RevealWrapper>
                <RevealWrapper className="md:col-span-1" width="100%" delay={0.5}>
                    <FeatureCard
                        title="Thenmala Forest Trails"
                        distance="Just 4 km near"
                        description="Trek through biodiversity hotspots of the Western Ghats."
                        image="/images/home/thenmala.png"
                    />
                </RevealWrapper>

                <RevealWrapper className="md:col-span-1" width="100%" delay={0.6}>
                    <FeatureCard
                        title="Kathakali's Birthplace (Kottarakara)"
                        distance="Just 25 km near"
                        description="Witness Kerala's classical art where it began, just 25 km away."
                        image="/images/home/kathakali.png"
                    />
                </RevealWrapper>
                <RevealWrapper className="md:col-span-1" width="100%" delay={0.7}>
                    <FeatureCard
                        title="Raja Ravi Varma Palace & Museum"
                        distance="Just 19 km near"
                        description="Step into the legacy of India's greatest painter (19 km)."
                        image="/images/home/raja_ravi_varma_palace.png"
                    />
                </RevealWrapper>
                <RevealWrapper className="md:col-span-1" width="100%" delay={0.8}>
                    <FeatureCard
                        title="Trivandrum Palaces & Heritage Sites"
                        distance="Just 25 km near"
                        description="A royal journey within 25 km."
                        image="/images/home/trivandrum.png"
                    />
                </RevealWrapper>
            </div>
        </SectionWrapper>
    );
};

export default ExperienceSection;
