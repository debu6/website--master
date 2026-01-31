"use client";

import React, { useState } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import { Plane, User, Car, Check, Clock, Shield, MapPin, Phone } from "lucide-react";

export default function AirportTransfersPage() {
    const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const toggleService = (service: string) => {
        setSelectedServices(prev =>
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-magenta-accent font-urbanist">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative w-full h-screen min-h-[600px] flex items-center justify-start overflow-hidden">
                {/* Background Image Placeholder */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
                    style={{ backgroundImage: "url('/images/airport/airport_hero.png')" }}
                ></div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>

                <div className="relative z-20 container mx-auto px-6 md:px-12 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-wide">
                            SMOOTH RIDES
                        </h1>
                        <h2 className="text-5xl md:text-7xl font-water-brush text-magenta-accent mb-6 transform -rotate-2">
                            to Every Terminal
                        </h2>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
                            Experience comfort and punctuality with our dedicated airport transport service.
                        </p>
                        <button className="px-8 py-3 rounded-xl bg-magenta-accent text-white font-bold shadow-[0_4px_20px_rgba(178,48,146,0.4)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105">
                            View Options →
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* --- Features & Vehicle Info Section --- */}
            <section className="py-20 relative overflow-hidden bg-[url('/images/airport/taxi.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Left: Features List */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">WHY TRAVELERS</h3>
                            <h3 className="text-5xl md:text-6xl font-water-brush text-magenta-accent mb-4">Trust Us</h3>
                            <p className="text-gray-300 text-lg">
                                Safe, punctual, and hassle-free rides designed for your comfort and peace of mind.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-magenta-accent text-xl font-bold mb-4">Service Features</h4>
                            <ul className="space-y-3">
                                {[
                                    "Professional drivers with airport experience",
                                    "Real-time flight tracking and delay notifications",
                                    "Meet and greet service at arrivals",
                                    "Comfortable air-conditioned vehicles",
                                    "24/7 customer support",
                                    "Fixed pricing with no hidden charges"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-magenta-accent"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Vehicle Information Card */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-magenta-accent/20 to-transparent rounded-3xl blur-md"></div>
                        <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10">
                            <h4 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Vehicle Information</h4>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-magenta-accent/10 rounded-xl text-magenta-accent">
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold text-white">Sedan (1-4 passengers)</h5>
                                        <p className="text-gray-400 text-sm">Comfortable sedan with AC and luggage space</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-magenta-accent/10 rounded-xl text-magenta-accent">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h5 className="text-lg font-bold text-white">SUV (5-7 passengers)</h5>
                                        <p className="text-gray-400 text-sm">Spacious SUV for larger groups and extra luggage</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-xs text-magenta-accent leading-relaxed">
                                    <span className="font-bold">Note:</span> Vehicle will be assigned based on group size and availability. All vehicles are sanitized and well-maintained.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Booking Section --- */}
            <section className="py-20 relative overflow-hidden bg-[url('/images/airport/bag.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/70 z-0"></div>
                <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">
                            BOOK YOUR <span className="font-water-brush text-5xl md:text-7xl text-magenta-accent ml-2">Transfer</span>
                        </h3>
                        <p className="text-gray-400">Select your services and provide flight details for seamless transfers</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm shadow-2xl">

                        {/* Select Airport */}
                        <div className="mb-10">
                            <h4 className="text-xl font-bold text-white mb-6">Select Airport</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setSelectedAirport('COK')}
                                    className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${selectedAirport === 'COK' ? 'bg-magenta-accent/10 border-magenta-accent' : 'bg-white/5 border-white/10 hover:border-gray-500'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${selectedAirport === 'COK' ? 'bg-magenta-accent text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'}`}>
                                            <Plane size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Kochi Airport (COK)</div>
                                            <div className="text-xs text-gray-400">Cochin International Airport</div>
                                            <div className="text-[10px] text-gray-500 mt-1">Distance: ~4.5 hrs from resort</div>
                                        </div>
                                    </div>
                                    {selectedAirport === 'COK' && <div className="text-magenta-accent"><Check size={20} /></div>}
                                </div>

                                <div
                                    onClick={() => setSelectedAirport('TRV')}
                                    className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${selectedAirport === 'TRV' ? 'bg-magenta-accent/10 border-magenta-accent' : 'bg-white/5 border-white/10 hover:border-gray-500'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${selectedAirport === 'TRV' ? 'bg-magenta-accent text-white' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'}`}>
                                            <Plane size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Trivandrum Airport (TRV)</div>
                                            <div className="text-xs text-gray-400">Thiruvananthapuram International Airport</div>
                                            <div className="text-[10px] text-gray-500 mt-1">Distance: ~1.5 hrs from resort</div>
                                        </div>
                                    </div>
                                    {selectedAirport === 'TRV' && <div className="text-magenta-accent"><Check size={20} /></div>}
                                </div>
                            </div>
                        </div>

                        {/* Select Services */}
                        <div>
                            <h4 className="text-xl font-bold text-white mb-6">Select Services</h4>
                            <div className="flex flex-col gap-4">
                                {[
                                    { id: 'pickup', title: 'Airport Pickup Service', price: 'Rs.1500', desc: 'Professional pickup service from airport to resort' },
                                    { id: 'drop', title: 'Airport Drop Service', price: 'Rs.1500', desc: 'Safe drop service from resort to airport' }
                                ].map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${selectedServices.includes(service.id) ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:border-gray-500'}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedServices.includes(service.id) ? 'bg-magenta-accent border-magenta-accent' : 'border-gray-500'}`}>
                                            {selectedServices.includes(service.id) && <Check size={12} className="text-white" />}
                                        </div>
                                        <div className={`p-2 rounded-lg ${selectedServices.includes(service.id) ? 'bg-magenta-accent text-white' : 'bg-white/10 text-gray-400'}`}>
                                            <Car size={20} />
                                        </div>
                                        <div>
                                            <div className="flex gap-2 items-center">
                                                <span className="font-bold text-white">{service.title}</span>
                                                <span className="text-magenta-accent font-bold text-sm">{service.price}</span>
                                            </div>
                                            <div className="text-xs text-gray-400">{service.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- Bottom Benefits Grid --- */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">
                            Reliable Airport Transfers <span className="font-water-brush text-5xl md:text-7xl text-magenta-accent">Every Time</span>
                        </h3>
                        <p className="text-gray-400">Expert drivers, live tracking, and on-time pickups for your peace of mind.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: User, title: "Professional Drivers", desc: "Licensed, experienced drivers with airport pickup expertise." },
                            { icon: Plane, title: "Flight Tracking", desc: "Real-time flight monitoring and delay notifications." },
                            { icon: Shield, title: "Meet & Greet", desc: "Personal assistance at arrivals with name board." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center group hover:bg-white/10 transition-all duration-300">
                                <div className="w-16 h-16 mx-auto bg-magenta-accent rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(178,48,146,0.5)] group-hover:scale-110 transition-transform">
                                    <item.icon size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
