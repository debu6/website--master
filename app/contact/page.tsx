"use client";

import React, { useState } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp, Plus, Minus, Send, MessageSquare } from "lucide-react";

// --- Types ---
type FAQItem = {
    question: string;
    answer: string;
};

// --- Data ---
const FAQS: FAQItem[] = [
    {
        question: "What is the cancellation policy?",
        answer: "Free cancellation up to 24 hours before check-in. After that, one night's stay will be charged. For yoga programs and other services, please refer to the specific terms and conditions."
    },
    {
        question: "Do you provide airport transfers?",
        answer: "Yes, we offer pickup and drop services from Kochi and Trivandrum airports at ₹1,500 per trip. You can book this service during your reservation or contact us directly."
    },
    {
        question: "Are meals included in the room booking?",
        answer: "We offer various meal plans. Basic room bookings include breakfast. Lunch and dinner can be added as per your preference. Please check with our team for current packages and pricing."
    },
    {
        question: "What yoga programs do you offer?",
        answer: "We offer 200hr and 300hr yoga teacher training programs, daily yoga sessions, and personalized instruction. All programs are led by certified instructors and include accommodation options."
    }
];

export default function ContactPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null); // Default all closed

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-magenta-accent font-urbanist">
            <Navbar />

            {/* --- Hero / Header Section --- */}
            <section className="relative pt-48 pb-20 px-6 md:px-12 bg-[#050505] overflow-hidden min-h-[60vh] flex flex-col justify-center">
                {/* Placeholder BG Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/adventure/phone.png')" }}></div>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/80"></div>
                </div>

                {/* Ambient Background Glow */}


                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-urbanist font-bold uppercase tracking-widest text-white mb-2">
                            We'd Love To Hear
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-water-brush text-magenta-accent mb-8 drop-shadow-lg">
                            From You
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Whether you have a question about bookings, room or general requests— our team is here to help you anytime.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Main Content Grid --- */}
            <section className="py-12 md:py-20 px-6 md:px-12 bg-black relative">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* Left Column: Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12"
                        >
                            <div>
                                <h3 className="text-3xl font-bold font-urbanist mb-6">Contact Information</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Located in the serene coastal town of Varkala, Kshetra Retreat Resort offers you a perfect blend of spirituality, adventure and relaxation.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Address Card */}
                                <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-magenta-accent/30 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-magenta-accent mb-6 group-hover:bg-magenta-accent group-hover:text-white transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <h4 className="font-bold text-xl mb-3">Address</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        85, North Cliff, Varkala,<br />
                                        Kerala, 695141, India
                                    </p>
                                </div>

                                {/* Phone Card */}
                                <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-magenta-accent/30 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-magenta-accent mb-6 group-hover:bg-magenta-accent group-hover:text-white transition-colors">
                                        <Phone size={24} />
                                    </div>
                                    <h4 className="font-bold text-xl mb-3">Phone</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed space-y-1 block">
                                        <span className="block">+91 98470 12345</span>
                                        <span className="block">+91 94470 67890</span>
                                    </p>
                                </div>

                                {/* Email Card */}
                                <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-magenta-accent/30 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-magenta-accent mb-6 group-hover:bg-magenta-accent group-hover:text-white transition-colors">
                                        <Mail size={24} />
                                    </div>
                                    <h4 className="font-bold text-xl mb-3">Email</h4>
                                    <div className="text-gray-400 text-sm leading-relaxed space-y-1">
                                        <a href="mailto:info@kshetraretreat.com" className="block hover:text-white transition-colors">info@kshetraretreat.com</a>
                                        <a href="mailto:bookings@kshetraretreat.com" className="block hover:text-white transition-colors">bookings@kshetraretreat.com</a>
                                    </div>
                                </div>

                                {/* Opening Hours Card */}
                                <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-magenta-accent/30 transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-magenta-accent mb-6 group-hover:bg-magenta-accent group-hover:text-white transition-colors">
                                        <Clock size={24} />
                                    </div>
                                    <h4 className="font-bold text-xl mb-3">Opening Hours</h4>
                                    <div className="text-gray-400 text-sm leading-relaxed space-y-1">
                                        <p className="flex justify-between"><span className="text-gray-500">Reception:</span> <span>24/7</span></p>
                                        <p className="flex justify-between"><span className="text-gray-500">Check-in:</span> <span>2:00 PM</span></p>
                                        <p className="flex justify-between"><span className="text-gray-500">Check-out:</span> <span>11:00 AM</span></p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="bg-[#111] p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                {/* Form Top Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-magenta-accent/10 blur-[80px] rounded-full pointer-events-none"></div>

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold font-urbanist mb-2 text-white">Send us a Message</h3>
                                    <p className="text-gray-400 mb-8">We'll get back to you within 24 hours</p>

                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name *</label>
                                                <input type="text" placeholder="Enter your full name" className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address *</label>
                                                <input type="email" placeholder="Enter your email" className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone Number</label>
                                                <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-magenta-accent transition-colors" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Subject *</label>
                                                <div className="relative">
                                                    <select className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-5 py-4 text-white appearance-none focus:outline-none focus:border-magenta-accent transition-colors pr-10">
                                                        <option>Select a subject</option>
                                                        <option>Booking Inquiry</option>
                                                        <option>Yoga Programs</option>
                                                        <option>Events</option>
                                                        <option>Other</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Message *</label>
                                            <textarea placeholder="Please describe your inquiry or requirements..." rows={4} className="w-full bg-[#1a1a1c] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-magenta-accent transition-colors resize-none"></textarea>
                                        </div>

                                        <button className="w-full py-4 bg-magenta-accent text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(178,48,146,0.4)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:-translate-y-1 mt-4">
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section id="faq" className="py-24 bg-[#050505] relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-light font-urbanist text-white mb-2 uppercase tracking-wider">
                            Frequently Asked
                        </h2>
                        <h2 className="text-6xl md:text-8xl font-water-brush text-magenta-accent drop-shadow-lg">
                            Questions
                        </h2>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {FAQS.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="border border-white/10 rounded-2xl bg-[#0f0f10] overflow-hidden transition-all duration-300 hover:border-magenta-accent/30"
                            >
                                <button
                                    onClick={() => toggleAccordion(idx)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                                >
                                    <span className="text-lg md:text-xl font-bold font-urbanist text-white group-hover:text-magenta-accent transition-colors duration-300 flex gap-4">
                                        <span className="text-gray-500 group-hover:text-magenta-accent/50 transition-colors">{idx + 1}.</span>
                                        {faq.question}
                                    </span>
                                    <div className={`p-2 rounded-full border border-white/10 bg-white/5 transition-all duration-300 ${openIndex === idx ? 'bg-magenta-accent text-white border-magenta-accent rotate-180' : 'text-gray-400 group-hover:text-white'}`}>
                                        {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 md:p-8 pt-0 border-t border-white/5 mx-6 md:mx-8">
                                                <p className="text-gray-400 leading-relaxed pt-6">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
