"use client";

import React, { useState } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Star, MapPin, Shield, Users, Camera, Coffee,
    ChevronRight, X, Calendar, CheckCircle2, Circle, CreditCard,
    Smartphone, Globe, Lock
} from "lucide-react";

// --- Types ---
type Adventure = {
    id: number;
    title: string;
    image: string;
    rating: number;
    duration: string;
    price: number;
    unit: string;
    description: string;
    features: string[];
    badges: string[];
};

type BookingStep = 'view' | 'details' | 'payment';

// --- Attributes & Data ---
const ADVENTURES: Adventure[] = [
    {
        id: 1,
        title: "Kayak & Wildlife Tour",
        image: "/images/adventure/kayak.png",
        rating: 4.5,
        duration: "3 hours",
        price: 95,
        unit: "per_person",
        description: "Paddle through serene backwaters and dense mangroves. Spot exotic birds and local wildlife in their natural habitat.",
        features: ["Certified instructors", "Safety gear included", "Refreshments"],
        badges: ["Wildlife spotting", "Naturalist guide"]
    },
    {
        id: 2,
        title: "Mountain Trekking Adventure",
        image: "/images/adventure/trekking.png",
        rating: 4.5,
        duration: "6 hours",
        price: 120,
        unit: "per_person",
        description: "Explore scenic mountain trails with experienced guides. Suitable for all fitness levels. Witness breathtaking sunrises and untouched nature.",
        features: [
            "Experienced local guides",
            "Scenic viewpoints",
            "Wildlife spotting opportunities",
            "Traditional lunch included",
            "Photography stops"
        ],
        badges: ["Scenic viewpoints", "Lunch included"]
    },
    {
        id: 3,
        title: "Professional Surfing Lessons",
        image: "/images/adventure/surfing.png",
        rating: 4.8,
        duration: "2 hours",
        price: 150,
        unit: "per_session",
        description: "Catch your first wave with our expert instructors. Comprehensive lessons covering safety, paddling, and standing up.",
        features: ["Surfboard rental", "Wetsuit provided", "Video analysis"],
        badges: ["Certified instructors", "Small groups"]
    },
    {
        id: 4,
        title: "Scuba Diving Discovery",
        image: "/images/adventure/scuba.png",
        rating: 4.9,
        duration: "4 hours",
        price: 180,
        unit: "per_person",
        description: "Dive into the deep blue and discover vibrant coral reefs. No prior experience required for this introductory dive.",
        features: ["PADI certified instructors", "All equipment included", "Underwater photos"],
        badges: ["Training included", "Pro equipment"]
    },
    {
        id: 5,
        title: "Advanced Surfing Masterclass",
        image: "/images/adventure/adv_surfing.png",
        rating: 4.7,
        duration: "3 hours",
        price: 250,
        unit: "per_session",
        description: "Take your surfing to the next level. Focus on advanced maneuvers, reading waves, and competition tactics.",
        features: ["Elite coaching", "Performance boards", "Drone footage"],
        badges: ["Video analysis", "Personalized coaching"]
    },
    {
        id: 6,
        title: "Rock Climbing Experience",
        image: "/images/adventure/rock_climbing.png",
        rating: 4.6,
        duration: "5 hours",
        price: 300,
        unit: "per_person",
        description: "Challenge yourself on natural rock faces. Includes top-rope climbing and bouldering with safety as the priority.",
        features: ["Safety briefing", "Climbing shoes", "Harness & Helmet"],
        badges: ["Multiple routes", "Pro equipment"]
    }
];

// --- Components ---

// 1. Modal Component (Handles all logic internally for simplicity)
const AdventureModal = ({ adventure, onClose }: { adventure: Adventure, onClose: () => void }) => {
    const [step, setStep] = useState<BookingStep>('view');

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        specialRequest: '',
        coupon: '',
        paymentMethod: 'cards'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Render Steps
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#050505] w-full max-w-7xl min-h-[90vh] md:h-auto md:max-h-[90vh] rounded-none md:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border border-white/10 relative my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#050505] sticky top-0 z-20">
                    <h3 className="text-2xl font-urbanist font-bold text-white">
                        {step === 'view' ? adventure.title : step === 'details' ? 'Complete Booking' : 'Secure Payment'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Progress Stepper (Only visible in booking flows) */}
                {step !== 'view' && (
                    <div className="flex items-center justify-center py-4 bg-[#141416] border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-magenta-accent' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'details' || step === 'payment' ? 'border-magenta-accent bg-magenta-accent text-white' : 'border-gray-600'}`}>1</div>
                                <span className="font-bold">Details</span>
                            </div>
                            <div className="w-12 h-[1px] bg-gray-700"></div>
                            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-magenta-accent' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-magenta-accent bg-magenta-accent text-white' : 'border-gray-600'}`}>2</div>
                                <span className="font-bold">Payment</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">

                    {/* VIEW MODE */}
                    {step === 'view' && (
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/2">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                                    <img src={adventure.image} alt={adventure.title} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col gap-6">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold font-urbanist mb-4">{adventure.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                                        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                            <Clock size={16} className="text-magenta-accent" />
                                            {adventure.duration}
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                            {adventure.rating}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">Description</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg mb-8">{adventure.description}</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white">Features</h3>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {adventure.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-300">
                                                <div className="w-2 h-2 rounded-full bg-magenta-accent shadow-[0_0_10px_#B23092]"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/10">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Price</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-magenta-accent">₹{adventure.price}</span>
                                            <span className="text-gray-400">/ {adventure.unit.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={onClose} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-bold">
                                            Close
                                        </button>
                                        <button onClick={() => setStep('details')} className="px-8 py-3 rounded-xl bg-magenta-accent text-white font-bold hover:bg-white hover:text-magenta-accent transition-all shadow-[0_0_20px_rgba(178,48,146,0.5)]">
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DETAILS STEP (Form) */}
                    {step === 'details' && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Summary Card */}
                            <div className="w-full lg:w-1/3 order-1 lg:order-1">
                                <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/10 sticky top-0">
                                    <h4 className="text-xl font-urbanist font-bold mb-6">Your Services</h4>

                                    <div className="bg-[#242426] p-4 rounded-xl mb-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-magenta-accent mb-2">
                                            <Calendar size={18} />
                                            <span className="text-sm font-bold uppercase tracking-wider">Service Date</span>
                                        </div>
                                        <p className="text-xl font-bold">24 January 2026</p>
                                    </div>

                                    <div className="bg-[#242426] p-4 rounded-xl mb-6 border border-white/5">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-magenta-accent">
                                                <div className="w-6 h-6"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold mb-1">{adventure.title}</p>
                                                <p className="text-sm text-gray-400">Quantity: 1</p>
                                            </div>
                                            <p className="font-bold text-magenta-accent">₹{adventure.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-magenta-accent/10 rounded-xl border border-magenta-accent/20">
                                        <span className="font-bold text-lg">Total Amount</span>
                                        <span className="font-bold text-2xl text-magenta-accent">₹{adventure.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="w-full lg:w-2/3 order-2 lg:order-2">
                                <div className="bg-[#1a1a1c]/50 p-6 md:p-8 rounded-2xl border border-white/10">
                                    <div className="mb-8">
                                        <h4 className="text-xl font-urbanist font-bold mb-2">Contact Details</h4>
                                        <p className="text-gray-400">Please provide your information</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Full Name *</label>
                                            <input type="text" name="fullName" placeholder="Enter your full name" onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Email Address *</label>
                                            <input type="email" name="email" placeholder="your.email@example.com" onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Phone Number *</label>
                                            <input type="tel" name="phone" placeholder="+91 9999999999" onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Address *</label>
                                            <input type="text" name="address" placeholder="Enter your complete address" onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">City *</label>
                                            <input type="text" name="city" placeholder="Your city" onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">State *</label>
                                            <input type="text" name="state" placeholder="Your state" onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-bold text-gray-300 ml-1">Special Requests</label>
                                            <textarea name="specialRequest" placeholder="Any special requirements or requests..." onChange={handleInputChange} className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-magenta-accent transition-colors h-32 resize-none"></textarea>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex gap-4">
                                        <button onClick={() => setStep('view')} className="flex-1 px-8 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">
                                            Back to Adventure
                                        </button>
                                        <button onClick={() => setStep('payment')} className="flex-1 px-8 py-3 rounded-xl bg-magenta-accent text-white font-bold hover:bg-white hover:text-magenta-accent transition-all shadow-glow">
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAYMENT STEP */}
                    {step === 'payment' && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left: Summary */}
                            <div className="w-full lg:w-1/3 order-1 lg:order-1 space-y-6">
                                {/* Booking Summary */}
                                <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/10">
                                    <h4 className="text-xl font-urbanist font-bold mb-6">Booking Summary</h4>

                                    <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-magenta-accent" />
                                            <p className="font-bold">24 January 2026</p>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-white/90">{adventure.title}</p>
                                                <p className="text-sm text-gray-400">Quantity: 1</p>
                                            </div>
                                            <p className="font-bold">₹{adventure.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6 pb-6 border-b border-white/10">
                                        <h5 className="text-sm font-bold text-gray-400 uppercase mb-3">Your Details</h5>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-bold text-white">{formData.fullName || "Guest User"}</p>
                                            <p className="text-gray-400">{formData.email || "email@example.com"}</p>
                                            <p className="text-gray-400">{formData.phone || "+91 0000000000"}</p>
                                        </div>
                                    </div>

                                    {formData.specialRequest && (
                                        <div className="mb-6 pb-6 border-b border-white/10">
                                            <h5 className="text-sm font-bold text-gray-400 uppercase mb-2">Special Requests</h5>
                                            <p className="text-sm text-gray-300 italic">"{formData.specialRequest}"</p>
                                        </div>
                                    )}

                                    {/* Coupon */}
                                    <div className="mb-6">
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Enter coupon code" className="flex-1 bg-[#242426] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-magenta-accent" />
                                            <button className="px-4 py-2 bg-white/10 hover:bg-magenta-accent/20 text-white font-bold rounded-lg text-sm transition-colors">Apply</button>
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Subtotal</span>
                                            <span>₹{adventure.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                                            <span>Total Amount</span>
                                            <span className="text-magenta-accent">₹{adventure.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment Method */}
                            <div className="w-full lg:w-2/3 order-2 lg:order-2">
                                <div className="bg-[#1a1a1c]/50 p-6 md:p-8 rounded-2xl border border-white/10 h-full flex flex-col">
                                    <div className="mb-8">
                                        <h4 className="text-xl font-urbanist font-bold mb-2">Secure Payment</h4>
                                        <p className="text-gray-400">Complete your services booking</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <h5 className="font-bold text-magenta-accent flex items-center gap-2">
                                            <CreditCard size={18} /> Payment Method
                                        </h5>

                                        {/* Razorpay Option */}
                                        <div className="bg-[#242426] p-4 rounded-xl border-2 border-magenta-accent flex items-center justify-between cursor-pointer relative overflow-hidden">
                                            <div className="flex items-center gap-4 z-10">
                                                <div className="w-12 h-12 rounded-lg bg-[#0f0f10] flex items-center justify-center">
                                                    <span className="font-bold text-lg text-blue-500">R</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">Razorpay</p>
                                                    <p className="text-sm text-gray-400">Cards, UPI, Net Banking, Wallets</p>
                                                </div>
                                            </div>
                                            <div className="w-6 h-6 rounded-full border-2 border-magenta-accent flex items-center justify-center z-10">
                                                <div className="w-3 h-3 rounded-full bg-magenta-accent"></div>
                                            </div>
                                            <div className="absolute inset-0 bg-magenta-accent/5"></div>
                                        </div>
                                    </div>

                                    {/* Security Badges */}
                                    <div className="bg-[#141416] p-6 rounded-xl border border-white/5 mb-8">
                                        <div className="flex items-center gap-2 mb-4 text-green-400">
                                            <Shield size={20} />
                                            <span className="font-bold">Your Payment is Secure</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <CheckCircle2 size={16} className="text-green-400" /> SSL Encrypted
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <CheckCircle2 size={16} className="text-green-400" /> PCI DSS Compliant
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <CheckCircle2 size={16} className="text-green-400" /> Bank-grade Security
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <CheckCircle2 size={16} className="text-green-400" /> Trusted Platform
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer / Buttons */}
                                    <div className="mt-auto">
                                        <p className="text-xs text-center text-gray-500 mb-6">
                                            By proceeding with the payment, you agree to our Terms and Conditions, Privacy Policy, and Cancellation Policy.
                                        </p>
                                        <div className="flex gap-4">
                                            <button onClick={() => setStep('details')} className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">
                                                Back
                                            </button>
                                            <button className="flex-1 px-8 py-4 rounded-xl bg-magenta-accent text-white font-bold hover:bg-white hover:text-magenta-accent transition-all shadow-[0_0_30px_rgba(178,48,146,0.3)] text-lg">
                                                Pay ₹{adventure.price.toFixed(2)}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Page & Main Component ---
export default function AdventureSportsPage() {
    const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-magenta-accent font-urbanist">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative w-full h-screen min-h-screen flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 scale-105"
                    style={{ backgroundImage: "url('/images/adventure/wave.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

                <div className="relative z-20 container mx-auto px-6 md:px-12 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-light font-urbanist text-white mb-2 uppercase tracking-widest">
                            Where Every Moment
                        </h2>
                        <h1 className="text-7xl md:text-9xl font-water-brush text-magenta-accent mb-8 drop-shadow-lg">
                            Sparks Adventure
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-10 font-light leading-relaxed max-w-2xl shadow-black drop-shadow-md">
                            Dive into heart-racing experiences designed to push your limits and ignite your spirit. Our premium adventure sports combine excitement, safety, and world-class service to turn your getaway into a story worth telling.
                        </p>
                        <button
                            onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group px-8 py-4 rounded-xl bg-magenta-accent text-white font-bold text-lg hover:bg-white hover:text-magenta-accent transition-all duration-300 shadow-[0_0_20px_rgba(178,48,146,0.5)] flex items-center gap-2"
                        >
                            View Programs <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* --- Adventure Grid Section --- */}
            <section id="programs" className="py-24 bg-black relative">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-water-brush text-white"
                        >
                            Adventure <span className="text-magenta-accent">Sports</span>
                        </motion.h2>
                        <p className="text-gray-400 mt-4 tracking-wider">Experience thrilling adventures and premium services designed to create unforgettable memories.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ADVENTURES.map((adv, idx) => (
                            <motion.div
                                key={adv.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-[#141416] rounded-[2rem] overflow-hidden border border-white/5 hover:border-magenta-accent/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(178,48,146,0.15)] flex flex-col"
                            >
                                {/* Card Image */}
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-bold text-white">{adv.rating}</span>
                                    </div>
                                    <img
                                        src={adv.image}
                                        alt={adv.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-80"></div>

                                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-2xl font-bold font-urbanist text-white mb-1 drop-shadow-md">{adv.title}</h3>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                                            <Clock size={12} className="text-magenta-accent" />
                                            {adv.duration}
                                        </div>
                                        {adv.badges.map((badge, bIdx) => (
                                            <div key={bIdx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                                                <CheckCircle2 size={12} className="text-magenta-accent" />
                                                {badge}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-magenta-accent">₹{adv.price}</span>
                                            <span className="text-xs text-gray-500 italic">/ {adv.unit.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedAdventure(adv)}
                                                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-gray-300 transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => setSelectedAdventure({ ...adv })} // Just opens modal, default step is 'view' but user can click enroll inside
                                                className="px-4 py-2 rounded-xl bg-magenta-accent text-white text-xs font-bold hover:bg-white hover:text-magenta-accent transition-all shadow-[0_0_15px_rgba(178,48,146,0.3)]"
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

            <AnimatePresence>
                {selectedAdventure && (
                    <AdventureModal
                        adventure={selectedAdventure}
                        onClose={() => setSelectedAdventure(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
