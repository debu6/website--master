"use client";

import React from 'react';
import { motion } from "framer-motion";
import SectionWrapper from '@/app/components/ui/SectionWrapper';
import { RevealWrapper } from '@/app/components/ui/RevealWrapper';

const TestimonialsSection = () => {
    return (
        <section className="relative w-full py-24 bg-[#050505] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

            <SectionWrapper className="relative z-10">
                <RevealWrapper>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-annie text-gray-300 mb-4">Hear From Those</h2>
                        <h2 className="text-6xl md:text-7xl font-water-brush text-magenta-accent drop-shadow-lg text-shadow-glow">
                            Who Stayed With Us
                        </h2>
                        <p className="text-gray-300 font-urbanist text-lg leading-relaxed max-w-3xl mx-auto mt-6">
                            Our guests are at the heart of Kshetra. Discover the genuine experiences of travellers who found comfort, care, and connection in our coastal retreat.
                        </p>
                    </div>
                </RevealWrapper>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Sarah J.", role: "Yoga Instructor" },
                        { name: "Michael R.", role: "Travel Blogger" },
                        { name: "Elena V.", role: "Architect" }
                    ].map((p, i) => (
                        <RevealWrapper key={i} delay={i * 0.2} width="100%">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-magenta-accent/30 transition-colors duration-300 h-full"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-magenta-accent to-purple-deep flex items-center justify-center text-white font-bold text-xl font-urbanist shadow-lg">
                                        {p.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold font-urbanist">{p.name}</h4>
                                        <p className="text-xs text-gray-500 font-urbanist">{p.role}</p>
                                        <div className="text-magenta-accent text-sm mt-1">★★★★★</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 font-urbanist italic leading-relaxed text-sm">
                                    "The most serene experience of my life. Waking up to the sound of waves and the impeccable service made this trip unforgettable."
                                </p>
                            </motion.div>
                        </RevealWrapper>
                    ))}
                </div>
            </SectionWrapper>
        </section>
    );
};

export default TestimonialsSection;
