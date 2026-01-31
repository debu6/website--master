"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const slides = [
    {
        id: 1,
        headline: "Wellness That",
        script: "Touches the Soul",
        scriptClass: "text-magenta-accent",
        shadowClass: "text-shadow-glow",
        description: "Find inner balance with daily yoga sessions, guided meditation, and Ayurveda therapies designed to heal body and mind. Whether you're here for a rejuvenating break or a certified yoga teacher training, Kshetra's serene setting and experienced instructors make it effortless to reconnect with yourself.",
        label: "WELLNESS & EXPERIENCES HIGHLIGHT",
        bg: "/images/home/meditation.png",
        thumb: "/images/home/wellness_background.png",
        link: "/yoga"
    },
    {
        id: 2,
        headline: "Adventure Awaits",
        script: "Beyond the Waves",
        scriptClass: "text-magenta-accent",
        shadowClass: "text-shadow-glow",
        description: "Step out of your room and into adventure. Learn to surf the rolling Arabian Sea, kayak through serene lagoons, paraglide above dramatic cliffs, or trek through lush forest trails. Our team curates unforgettable experiences — from sunrise beach walks to sunset houseboat cruises — so you make the most of every moment in Varkala.",
        label: "ADVENTURE & THRILLS",
        bg: "/images/home/adventure_bg.jpg",
        thumb: "/images/home/adventure_surfing_thumb.png",
        link: "/adventure-sports"
    },
    {
        id: 3,
        headline: "Taste Kerala's Flavours at",
        script: "Our Courtyard Restaurant",
        scriptClass: "text-[#f97316]",
        shadowClass: "text-shadow-glow-orange",
        description: "Savour Kerala's heritage and global cuisines in our open-air courtyard restaurant. From traditional Kerala sadhya and seafood grills to fresh juices and international favourites, our kitchen celebrates seasonal produce and local flavours, creating meals that are as memorable as the sunsets.",
        label: "CULINARY DELIGHTS",
        bg: "/images/home/dining_bg.jpg",
        thumb: "/images/home/kerala_food_thumb.png",
        link: "/dining"
    },
    {
        id: 4,
        headline: "Explore More,",
        script: "Every Day",
        scriptClass: "text-[#22D3EE]",
        shadowClass: "text-shadow-glow-cyan",
        description: "Varkala's unique location makes day trips effortless. Visit Ponmudi tea estates, marvel at Trivandrum's palaces, explore the Thenmala eco-forest, or watch a Kathakali performance in its birthplace — all while returning to the comfort of your seaside retreat by nightfall.",
        label: "NEARBY ATTRACTIONS",
        bg: "/images/home/explore_background.png",
        thumb: "/images/home/nature_thumb.png",
        link: "/#why-varkala"
    }
];

const CarouselSection = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    const nextSlide = () => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Framer Motion Variants
    const slideVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.6, ease: "easeIn" }
        })
    };

    const contentVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.3, duration: 0.8, ease: "easeOut" }
        }
    };

    const thumbVariants: Variants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8 } }
    };

    return (
        <section className="relative w-full min-h-screen bg-black overflow-hidden flex items-center py-12 md:py-0">

            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={slides[current].bg}
                            alt="Background"
                            fill
                            className="object-cover object-center"
                            priority={true}
                        />
                        {/* Dark Overlays */}
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40 md:from-black md:via-black/60"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Global UI Elements */}

            {/* Main Content Layout */}
            <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 h-full items-center lg:items-end pb-12 lg:pb-0">

                {/* Left Content Area - Text */}
                <div className="lg:max-w-2xl pt-24 lg:pt-0 lg:pb-32 order-1 lg:order-1 flex flex-col justify-center h-auto lg:h-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                            className="text-left"
                        >
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-urbanist font-bold text-white mb-2 leading-tight">
                                {slides[current].headline}
                            </h2>
                            <h2 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-water-brush ${slides[current].scriptClass} ${slides[current].shadowClass} mb-6 md:mb-8 leading-none`}>
                                {slides[current].script}
                            </h2>
                            <p className="text-gray-200 text-base md:text-lg lg:text-xl font-urbanist leading-relaxed max-w-xl drop-shadow-md pr-4">
                                {slides[current].description}
                            </p>

                            {/* Mobile Explore Button (In-Flow) */}
                            <button
                                onClick={() => router.push(slides[current].link)}
                                className="md:hidden mt-6 px-8 py-3 rounded-xl bg-magenta-accent text-white font-bold font-urbanist shadow-[0_0_20px_rgba(178,48,146,0.6)]"
                            >
                                Explore Now
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Content Area - Thumbnail & Nav */}
                <div className="order-2 lg:order-2 flex flex-col justify-center items-center lg:items-end h-auto lg:h-full pb-8 lg:pb-0 w-full mt-8 lg:mt-0">

                    {/* Desktop Explore Button - Aligned with Thumbnail */}
                    <button
                        onClick={() => router.push(slides[current].link)}
                        className="hidden lg:block mb-8 px-8 py-3 lg:px-10 lg:py-4 rounded-xl bg-magenta-accent text-white font-bold font-urbanist shadow-[0_4px_20px_rgba(178,48,146,0.4)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105 z-30 tracking-wide"
                    >
                        Explore Now
                    </button>

                    {/* Wrapper for Image and Nav to center them relative to each other */}
                    <div className="flex flex-col items-center">
                        {/* Thumbnail Image */}
                        <div className="w-full max-w-sm md:max-w-md lg:w-[400px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    variants={thumbVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, y: 50 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={slides[current].thumb}
                                        alt="Thumbnail"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-8">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-magenta-accent hover:border-magenta-accent transition-all duration-300 group"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                </button>

                                <div className="flex gap-3">
                                    {slides.map((_, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                setDirection(idx > current ? 1 : -1);
                                                setCurrent(idx);
                                            }}
                                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition-all duration-300 ${idx === current ? 'bg-magenta-accent w-6 md:w-8' : 'bg-white/50 hover:bg-white'}`}
                                        ></div>
                                    ))}
                                </div>

                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-magenta-accent hover:border-magenta-accent transition-all duration-300 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={current}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] tracking-[0.3em] font-urbanist text-gray-400 uppercase font-bold text-center"
                                >
                                    {slides[current].label}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CarouselSection;
