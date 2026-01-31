"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Car, UtensilsCrossed, Flower, Palmtree, ShieldCheck, BellRing, Sparkles } from 'lucide-react';

const amenities = [
    {
        id: 1,
        title: "High-Speed WiFi",
        description: "Stay connected throughout your stay.",
        icon: Wifi
    },
    {
        id: 2,
        title: "Free Parking",
        description: "Secure parking for all guests.",
        icon: Car
    },
    {
        id: 3,
        title: "24/7 Room Service",
        description: "Round-the-clock dining service.",
        icon: UtensilsCrossed
    },
    {
        id: 4,
        title: "Spa & Wellness",
        description: "Rejuvenate with Ayurvedic treatments.",
        icon: Sparkles
    },
    {
        id: 5,
        title: "Yoga Shala",
        description: "Dedicated yoga and meditation space.",
        icon: Flower
    },
    {
        id: 6,
        title: "Beach Access",
        description: "Direct access to Varkala Beach.",
        icon: Palmtree
    },
    {
        id: 7,
        title: "24/7 Security",
        description: "Safe and secure environment.",
        icon: ShieldCheck
    },
    {
        id: 8,
        title: "Concierge Service",
        description: "Personal assistance for all needs.",
        icon: BellRing
    }
];

const AmenitiesSection = () => {
    return (
        <section className="relative w-full py-24 bg-[#050505] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-urbanist font-light text-white mb-2">
                        Where Comfort
                    </h2>
                    <h2 className="text-5xl md:text-7xl font-water-brush text-magenta-accent text-shadow-glow">
                        Meets Coastal Luxury
                    </h2>
                    <div className="mt-8 max-w-3xl mx-auto">
                        <p className="text-gray-300 font-urbanist text-lg leading-relaxed">
                            From high-speed WiFi and personalized concierge services to serene yoga spaces and
                            rejuvenating Ayurvedic therapies — every detail at Kshetra is designed to balance
                            luxury, comfort, and cultural harmony for a truly unforgettable stay.
                        </p>
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {amenities.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="group relative p-8 md:p-10 rounded-xl bg-[#0a0a0a] border border-white/5 hover:border-magenta-accent/30 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-magenta-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Icon */}
                            <div className="relative z-10 mb-6 text-gray-400 group-hover:text-magenta-accent transition-colors duration-500">
                                <item.icon strokeWidth={1} className="w-12 h-12 md:w-14 md:h-14 transform group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-lg md:text-xl font-urbanist text-white font-medium mb-2 tracking-wide">
                                    {item.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 font-urbanist uppercase tracking-widest group-hover:text-gray-300 transition-colors duration-300">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default AmenitiesSection;
