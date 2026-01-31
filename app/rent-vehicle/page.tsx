"use client";

import React, { useState } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Bike, Info, Calendar, Shield, CreditCard, X, ChevronLeft, ChevronRight, Fuel, Gauge, Users, Settings, MapPin, Phone, Mail } from "lucide-react";

// Types
type Vehicle = {
    id: string;
    name: string;
    subtitle: string;
    type: 'scooter' | 'bike' | 'car';
    price: number; // per day
    image: string;
    thumbnails: string[];
    desc: string;
    specs: {
        passengers: number;
        fuel: string;
        transmission: string;
        location: string;
        mileage: string;
        engine: string;
    };
    features: string[];
    deposit: number;
};

// Data
const vehicles: Vehicle[] = [
    {
        id: 'honda-activa',
        name: "Honda Activa 6G",
        subtitle: "Honda Activa 6G (2023)",
        type: 'scooter',
        price: 500,
        image: "/images/rent/activa_6g.png",
        thumbnails: ["/images/rent/activa_6g.png"],
        desc: "The most reliable scooter for city commutes and short trips around Varkala.",
        specs: { passengers: 2, fuel: "Petrol", transmission: "Automatic", location: "Kshetra Retreat", mileage: "45 kmpl", engine: "110cc" },
        features: ["Easy to ride", "Storage space", "reliable", "Lightweight"],
        deposit: 2000
    },
    {
        id: 'access-125',
        name: "Access 125",
        subtitle: "Suzuki Access 125 (2023)",
        type: 'scooter',
        price: 800,
        image: "/images/rent/access_125.png",
        thumbnails: ["/images/rent/access_125.png"],
        desc: "A powerful and comfortable scooter perfect for slightly longer rides with a pillion.",
        specs: { passengers: 2, fuel: "Petrol", transmission: "Automatic", location: "Kshetra Retreat", mileage: "40 kmpl", engine: "125cc" },
        features: ["Comfortable seating", "Good suspension", "Digital meter", "LED lights"],
        deposit: 2000
    },
    {
        id: 'royal-enfield',
        name: "Royal Enfield Classic 350",
        subtitle: "Royal Enfield Classic 350 (2023)",
        type: 'bike',
        price: 1200,
        image: "/images/rent/classic_350.png",
        thumbnails: ["/images/rent/classic_350.png"],
        desc: "Experience the thrill of riding a classic motorcycle through Kerala's scenic routes.",
        specs: { passengers: 2, fuel: "Petrol", transmission: "Manual", location: "Kshetra Retreat Resort", mileage: "35 kmpl", engine: "349cc" },
        features: ["Powerful engine", "Comfortable for long rides", "Classic styling", "Good ground clearance", "Reliable performance"],
        deposit: 5000
    },
    {
        id: 'swift',
        name: "Maruti Suzuki Swift",
        subtitle: "Maruti Suzuki Swift (2022)",
        type: 'car',
        price: 2000,
        image: "/images/rent/swift.png",
        thumbnails: ["/images/rent/swift.png"],
        desc: "A sporty hatchback that makes navigating Kerala's roads fun and easy.",
        specs: { passengers: 5, fuel: "Petrol/Diesel", transmission: "Manual/Auto", location: "Kshetra Retreat", mileage: "22 kmpl", engine: "1197cc" },
        features: ["AC", "Music System", "Power Windows", "Airbags"],
        deposit: 10000
    },
    {
        id: 'innova',
        name: "Toyota Innova Crysta",
        subtitle: "Toyota Innova Crysta (2022)",
        type: 'car',
        price: 3500,
        image: "/images/rent/innova.png",
        thumbnails: ["/images/rent/innova.png"],
        desc: "The ultimate family car for comfortable long-distance travel across Kerala.",
        specs: { passengers: 7, fuel: "Diesel", transmission: "Manual", location: "Kshetra Retreat", mileage: "14 kmpl", engine: "2393cc" },
        features: ["Captain Seats", "Dual AC", "Spacious Boot", "Premium Interiors"],
        deposit: 15000
    }
];

export default function RentVehiclePage() {
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-magenta-accent font-urbanist">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative w-full h-screen min-h-screen flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/images/rent/Scooter.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>

                <div className="relative z-20 container mx-auto px-6 md:px-12 pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-urbanist text-white mb-2 uppercase tracking-wider">
                            Find Your
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-water-brush text-magenta-accent mb-6 transform -rotate-3">
                            Perfect Ride
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
                            Choose from a wide range of vehicles for any journey, anytime.
                        </p>
                        <button
                            onClick={() => document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group px-8 py-4 rounded-xl bg-magenta-accent text-white font-bold text-lg hover:bg-white hover:text-magenta-accent transition-all duration-300 shadow-[0_0_20px_rgba(178,48,146,0.5)] flex items-center gap-2"
                        >
                            View Details <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* --- Vehicle List Section --- */}
            <section id="vehicles" className="py-20 bg-black relative">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-4xl font-bold text-white uppercase tracking-wide">Vehicle</h3>
                                <h3 className="text-5xl font-water-brush text-magenta-accent">Rentals</h3>
                            </div>
                            <p className="text-gray-400 max-w-lg">
                                Explore Varkala and beyond with our premium vehicle rental service. From scooters to luxury cars.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                                <Car size={16} /> All Vehicle
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((vehicle) => (
                            <motion.div
                                key={vehicle.id}
                                whileHover={{ y: -10 }}
                                className="bg-[#111] rounded-3xl overflow-hidden border border-white/10 group cursor-pointer"
                                onClick={() => setSelectedVehicle(vehicle)}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${vehicle.image})` }}>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-4 z-10">
                                        <h4 className="text-xl font-bold text-white">{vehicle.name}</h4>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-magenta-accent font-bold text-lg">₹{vehicle.price}</span>
                                            <span className="text-gray-400 text-xs">/day</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-[#1a1a1a]">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{vehicle.type}</span>
                                    <button className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold hover:bg-magenta-accent transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Bottom CTA Section --- */}
            <section className="py-32 bg-[#050505] relative flex justify-center items-center">
                <div className="text-center max-w-2xl px-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-magenta-accent rounded-2xl flex items-center justify-center mb-6 text-white shadow-[0_0_30px_rgba(232,121,249,0.3)]">
                        <Fuel size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Select Your Perfect Experience</h3>
                    <p className="text-gray-400 mb-8">
                        Choose from our premium services and vehicle rentals above to create your personalized adventure package. Each option is designed to enhance your stay with unforgettable memories.
                    </p>
                </div>
            </section>

            <Footer />

            {/* --- Vehicle Detail Modal --- */}
            <AnimatePresence>
                {selectedVehicle && (
                    <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
                )}
            </AnimatePresence>
        </main>
    );
}

// Modal Component
function VehicleModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
    const [currentThumb, setCurrentThumb] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#050505] w-full max-w-6xl h-[90vh] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Mobile Only (Close Btn) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-magenta-accent transition-colors md:hidden"
                >
                    <X size={24} />
                </button>

                {/* Left: Images */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-full bg-[#050505] relative flex flex-col">
                    <div className="flex-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-500"
                            style={{ backgroundImage: `url(${vehicle.image})` }}>
                        </div>
                    </div>
                </div>

                {/* Right: Details Scrollable */}
                <div className="w-full md:w-1/2 h-full bg-[#050505] overflow-y-auto custom-scrollbar relative">
                    {/* Desktop Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors hidden md:flex"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Header */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{vehicle.name}</h2>
                            <p className="text-gray-400 font-urbanist">{vehicle.subtitle}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {vehicle.desc}
                            </p>
                        </div>

                        {/* Specifications Grid */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Object.entries(vehicle.specs).map(([key, value], idx) => (
                                    <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</div>
                                        <div className="text-sm text-white font-medium capitalize truncate" title={value as string}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features List */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {vehicle.features.map((feat, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-magenta-accent/10 text-magenta-accent text-xs font-bold border border-magenta-accent/20">
                                        {feat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Pricing & Booking Inputs */}
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h3 className="text-lg font-bold text-white">Pricing & Options</h3>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-magenta-accent">₹{vehicle.price}</div>
                                    <div className="text-xs text-gray-400">per day</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">Start Date</label>
                                    <div className="relative">
                                        <input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">End Date</label>
                                    <div className="relative">
                                        <input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Security deposit:</span>
                                <span className="text-white font-bold">₹{vehicle.deposit.toLocaleString()}</span>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="font-bold text-white">Total per unit:</span>
                                <span className="text-xl font-bold text-magenta-accent">₹{vehicle.price.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Terms */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Terms & Conditions</h3>
                            <ul className="space-y-2">
                                {[
                                    "Valid motorcycle license required",
                                    "Helmet and protective gear mandatory",
                                    "Experience with manual transmission required",
                                    "Fuel to be paid by renter"
                                ].map((term, idx) => (
                                    <li key={idx} className="flex gap-3 text-xs text-gray-400">
                                        <span className="text-magenta-accent">•</span>
                                        {term}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="bg-gradient-to-r from-magenta-accent/20 to-transparent p-6 rounded-2xl border border-magenta-accent/20">
                            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="p-2 rounded-full bg-magenta-accent/20 text-magenta-accent"><Phone size={16} /></div>
                                    +91 9876543210
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="p-2 rounded-full bg-magenta-accent/20 text-magenta-accent"><Mail size={16} /></div>
                                    vehicles@kshetraretreat.com
                                </div>
                            </div>
                        </div>

                        {/* Sticky Bottom Actions */}
                        <div className="sticky bottom-0 bg-[#050505] pt-4 pb-2 border-t border-white/10 flex gap-4">
                            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">
                                Close
                            </button>
                            <button className="flex-[2] py-3 rounded-xl bg-magenta-accent text-white font-bold hover:bg-white hover:text-magenta-accent transition-colors shadow-[0_0_20px_rgba(178,48,146,0.3)]">
                                Add to Booking
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
