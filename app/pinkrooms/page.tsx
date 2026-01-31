"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export default function PinkroomsPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-magenta-accent font-urbanist overflow-hidden">
            <Navbar />

            {/* --- Full Screen Hero --- */}
            <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden pt-48 pb-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/kshetra/room.png')" }}
                    ></div>
                    {/* Heavy Magenta Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-magenta-accent/60 to-black/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">

                    {/* Logo Area */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="relative w-64 md:w-80 h-auto mx-auto mb-6">
                            <Image
                                src="/images/Logos/pinkroom.png"
                                alt="Pinkrooms Logo"
                                width={320}
                                height={120}
                                className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            />
                        </div>
                    </motion.div>

                    {/* Badge */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-magenta-accent to-purple-600 px-6 py-2 rounded-xl mb-8 shadow-[0_0_30px_rgba(217,70,239,0.4)]"
                    >
                        <Sparkles size={18} className="text-white animate-pulse" />
                        <span className="font-bold text-white uppercase tracking-wider text-sm">Coming Soon</span>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2 className="text-xl md:text-2xl font-urbanist font-bold uppercase tracking-[0.3em] text-white/80 mb-2">
                            Something Extraordinary
                        </h2>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-water-brush text-white mb-8 drop-shadow-xl">
                            is on the <span className="text-magenta-accent text-shadow-glow">Way</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
                            We're crafting an extraordinary experience that will redefine luxury and comfort. Stay tuned for something truly special that will make your stay unforgettable.
                        </p>
                    </motion.div>

                    {/* Hearts Decoration */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="flex justify-center gap-6 mb-12"
                    >
                        {[1, 2, 3].map((_, i) => (
                            <Heart key={i} size={32} className="text-white/20 fill-transparent stroke-[1.5px]" />
                        ))}
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 w-full justify-center"
                    >
                        <Link href="/kshetra" className="px-8 py-4 rounded-xl bg-magenta-accent text-white font-bold text-lg hover:bg-white hover:text-magenta-accent transition-all duration-300 shadow-[0_0_20px_rgba(178,48,146,0.5)] min-w-[200px]">
                            Explore Our Rooms
                        </Link>
                        <Link href="/contact" className="px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 min-w-[200px]">
                            Contact Us
                        </Link>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
