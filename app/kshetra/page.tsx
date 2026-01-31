"use client";

import React from 'react';
import SectionWrapper from '@/app/components/ui/SectionWrapper';
import { RevealWrapper } from '@/app/components/ui/RevealWrapper';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Wifi, Home, Coffee, Wind } from 'lucide-react';

const KshetraPage = () => {
    return (
        <main className="min-h-screen bg-bg-end">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center overflow-hidden">
                {/* Background Image with Premium Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* Desktop Image */}
                    <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            src="/images/kshetra/room.png"
                            alt="Luxury Room Ambience"
                            fill
                            quality={100}
                            priority
                            className="object-cover object-center transition-transform duration-[20s] hover:scale-105"
                        />
                    </div>
                    {/* Mobile Image */}
                    <div className="md:hidden absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            src="/images/kshetra/luxury_room_ambience_mobile.png"
                            alt="Luxury Room Ambience Mobile"
                            fill
                            quality={100}
                            priority
                            className="object-cover object-center transition-transform duration-[20s] hover:scale-105"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30 z-10"></div>
                </div>

                <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 pt-20 flex flex-col justify-center h-full">
                    <RevealWrapper>
                        <div className="max-w-4xl">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-urbanist font-bold text-white mb-2 tracking-tight leading-none drop-shadow-2xl">
                                EXPERIENCE COMFORT
                            </h1>
                            <h2 className="text-4xl sm:text-6xl md:text-8xl font-water-brush text-magenta-accent mb-6 leading-none text-shadow-glow drop-shadow-[0_0_15px_rgba(178,48,146,0.3)] transform -rotate-1 origin-left">
                                in Every Corner
                            </h2>
                            <p className="text-gray-200 font-urbanist text-base md:text-lg max-w-2xl leading-relaxed mb-8 opacity-90 drop-shadow-md border-l-4 border-magenta-accent pl-6">
                                Indulge in comfort and charm — from our grand King Rooms to the cozy Queen stays, every space is thoughtfully designed to make your experience memorable, peaceful, and perfectly tailored to your style.
                            </p>

                            <a
                                href="https://live.ipms247.com/booking/book-rooms-kshetraretreatvarkala"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl bg-magenta-accent text-white font-bold font-urbanist text-base md:text-lg tracking-wider uppercase hover:brightness-110 hover:shadow-[0_0_20px_rgba(178,48,146,0.5)] hover:-translate-y-1 transition-all duration-300 inline-block text-center"
                            >
                                Start Your Booking
                            </a>
                        </div>
                    </RevealWrapper>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50 hidden md:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-4 md:px-8 bg-bg-end">
                <SectionWrapper className="max-w-7xl mx-auto space-y-32">

                    {/* King Sized Rooms */}
                    <RevealWrapper>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* Mobile Header (Shown only on mobile) */}
                            <div className="lg:hidden mb-6">
                                <h3 className="text-magenta-accent font-urbanist tracking-[0.2em] uppercase text-sm font-bold mb-2">Luxury and space redefined</h3>
                                <h2 className="text-4xl font-urbanist font-bold text-white">KING ROOM</h2>
                            </div>

                            {/* Images Grid */}
                            <div className="grid grid-cols-2 gap-4 h-full min-h-[400px] md:min-h-[500px]">
                                <div className="col-span-2 row-span-2 h-[250px] md:h-[350px] relative rounded-2xl overflow-hidden group">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: "url('/images/kshetra/king_room_main.png')" }}
                                    ></div>
                                </div>
                                <div className="h-[150px] md:h-[180px] relative rounded-2xl overflow-hidden group">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: "url('/images/kshetra/king_detail_1.png')" }}
                                    ></div>
                                </div>
                                <div className="h-[150px] md:h-[180px] relative rounded-2xl overflow-hidden group">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: "url('/images/kshetra/king_detail_2.png')" }}
                                    ></div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-8">
                                {/* Desktop Header (Hidden on mobile) */}
                                <div className="hidden lg:block">
                                    <h3 className="text-magenta-accent font-urbanist tracking-[0.2em] uppercase text-sm font-bold mb-2">Luxury and space redefined</h3>
                                    <h2 className="text-5xl font-urbanist font-bold text-white mb-6">KING ROOM</h2>
                                </div>

                                <p className="text-gray-400 font-urbanist text-lg leading-relaxed">
                                    Spacious room with king-size bed and premium amenities. Experience the pinnacle of relaxation where modern luxury meets traditional charm. Perfect for couples seeking a romantic getaway or travelers desiring extra comfort.
                                </p>

                                <a
                                    href="https://live.ipms247.com/booking/book-rooms-kshetraretreatvarkala"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 bg-white/5 border border-white/20 text-white font-urbanist font-bold rounded-xl hover:bg-magenta-accent hover:border-magenta-accent transition-all duration-300 inline-block text-center"
                                >
                                    Book Now
                                </a>

                                {/* Features List */}
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                    {[
                                        { icon: Home, label: "PREMIUM INTERIORS" },
                                        { icon: Coffee, label: "LARGE BED" },
                                        { icon: Wind, label: "BALCONY VIEW" },
                                        { icon: Wifi, label: "WI-FI" }
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-300">
                                            <feature.icon size={20} className="text-magenta-accent" />
                                            <span className="font-urbanist text-sm font-bold tracking-wider">{feature.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </RevealWrapper>
                    {/* Mobile Divider */}
                    <div className="lg:hidden w-full h-[1px] bg-white/10 my-16"></div>

                    {/* Dormitory Rooms (Reversed Layout) */}
                    <RevealWrapper>
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">

                            {/* Mobile Header (Shown only on mobile) */}
                            <div className="lg:hidden mb-6 w-full">
                                <h3 className="text-magenta-accent font-urbanist tracking-[0.2em] uppercase text-sm font-bold mb-2">Compact luxury and comfort</h3>
                                <h2 className="text-4xl font-urbanist font-bold text-white">QUEEN ROOM</h2>
                            </div>

                            {/* Text Content (Left on Desktop) */}
                            <div className="order-2 lg:order-1 space-y-8 w-full">
                                {/* Desktop Header (Hidden on mobile) */}
                                <div className="hidden lg:block">
                                    <h3 className="text-magenta-accent font-urbanist tracking-[0.2em] uppercase text-sm font-bold mb-2">Compact luxury and comfort</h3>
                                    <h2 className="text-5xl font-urbanist font-bold text-white mb-6">QUEEN ROOM</h2>
                                </div>

                                <p className="text-gray-400 font-urbanist text-lg leading-relaxed">
                                    A cozy yet elegant sanctuary featuring a plush queen-size bed. Ideal for solo travelers or couples, offering an intimate blend of modern amenities and serene design for a restful retreat.
                                </p>

                                <a
                                    href="https://live.ipms247.com/booking/book-rooms-kshetraretreatvarkala"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 bg-white/5 border border-white/20 text-white font-urbanist font-bold rounded-xl hover:bg-magenta-accent hover:border-magenta-accent transition-all duration-300 inline-block text-center"
                                >
                                    Book Now
                                </a>

                                {/* Features List */}
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                    {[
                                        { icon: Home, label: "PREMIUM INTERIORS" },
                                        { icon: Coffee, label: "LARGE BED" },
                                        { icon: Wind, label: "BALCONY VIEW" },
                                        { icon: Wifi, label: "WI-FI" }
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-300">
                                            <feature.icon size={20} className="text-magenta-accent" />
                                            <span className="font-urbanist text-sm font-bold tracking-wider">{feature.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Images Grid (Right on Desktop) */}
                            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-full min-h-[400px] md:min-h-[500px] w-full">
                                <div className="col-span-2 row-span-2 h-[250px] md:h-[350px] relative rounded-2xl overflow-hidden group">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: "url('/images/kshetra/queen_room_main.png')" }}
                                    ></div>
                                </div>
                                <div className="h-[150px] md:h-[180px] relative rounded-2xl overflow-hidden group">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: "url('/images/kshetra/queen_detail_1.png')" }}
                                    ></div>
                                </div>
                                <div className="h-[150px] md:h-[180px] relative rounded-2xl overflow-hidden group">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: "url('/images/kshetra/queen_detail_2.png')" }}
                                    ></div>
                                </div>
                            </div>

                        </div>
                    </RevealWrapper>



                </SectionWrapper>
            </section>

            <Footer />
        </main>
    );
};

export default KshetraPage;
