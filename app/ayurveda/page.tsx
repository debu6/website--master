"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Clock, X, ChevronRight, Loader2, AlertCircle, CheckCircle, Phone, Mail, Sparkles } from "lucide-react";
import {
    fetchTreatments,
    createAyurvedaBookingOrder,
    verifyAyurvedaBookingPayment,
    openAyurvedaPayment,
    AyurvedaTreatment
} from "../services/ayurvedaAPI";
import { useAuth } from "../hooks/useAuth";

const CATEGORIES = ['Ayurvedic Massage', 'Spa Massage', 'Special Treatment', 'Combo Packages'] as const;

const CATEGORY_IMAGES: Record<string, string> = {
    'Ayurvedic Massage': '/images/ayurveda/ayurvedic_massage.jpg',
    'Spa Massage': '/images/ayurveda/spa_massage.jpg',
    'Special Treatment': '/images/ayurveda/special_treatment.jpg',
    'Combo Packages': '/images/ayurveda/combo_packages.jpg',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    'Ayurvedic Massage': 'Traditional healing massages rooted in ancient Ayurvedic wisdom, designed to restore balance and vitality.',
    'Spa Massage': 'Premium spa experiences combining massage, scrubs, and therapeutic packs for complete rejuvenation.',
    'Special Treatment': 'Authentic Ayurvedic therapies including Shirodhara, Pizhichil, and specialized Vasti treatments.',
    'Combo Packages': 'Curated treatment combinations offering enhanced therapeutic benefits at special rates.',
};

export default function AyurvedaPage() {
    const [treatments, setTreatments] = useState<Record<string, AyurvedaTreatment[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
    const [selectedTreatment, setSelectedTreatment] = useState<AyurvedaTreatment | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        loadTreatments();
    }, []);

    const loadTreatments = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchTreatments();
            setTreatments(result.grouped);
        } catch (err: any) {
            setError(err.message || 'Failed to load treatments');
        } finally {
            setLoading(false);
        }
    };

    const currentTreatments = treatments[activeCategory] || [];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-magenta-accent font-urbanist">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full h-screen min-h-screen flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/images/ayurveda/ayurveda_hero.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

                <div className="relative z-20 container mx-auto px-6 md:px-12 pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-urbanist text-white mb-2 uppercase tracking-wider">
                            Discover Ancient
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-water-brush text-magenta-accent mb-6 transform -rotate-3">
                            Ayurveda
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
                            Experience the timeless healing traditions of Kerala Ayurveda at Kshetra Retreat.
                            Restore, rejuvenate, and renew your body, mind, and spirit.
                        </p>
                        <button
                            onClick={() => document.getElementById('treatments')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group px-8 py-4 rounded-xl bg-magenta-accent text-white font-bold text-lg hover:bg-white hover:text-magenta-accent transition-all duration-300 shadow-[0_0_20px_rgba(178,48,146,0.5)] flex items-center gap-2"
                        >
                            View Treatments <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs + Treatments */}
            <section id="treatments" className="py-20 bg-black relative">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <h3 className="text-4xl font-bold text-white uppercase tracking-wide">Our</h3>
                            <h3 className="text-5xl font-water-brush text-magenta-accent">Treatments</h3>
                        </div>
                        <p className="text-gray-400 max-w-2xl mx-auto mt-4">
                            Choose from our authentic Ayurvedic therapies, each crafted to address specific wellness needs with traditional Kerala healing methods.
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                                    activeCategory === cat
                                        ? 'bg-magenta-accent text-white border-magenta-accent shadow-[0_0_15px_rgba(178,48,146,0.4)]'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Category Description Card */}
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-10 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
                    >
                        <div className="w-full md:w-48 h-32 rounded-xl bg-cover bg-center shrink-0 border border-white/10"
                            style={{ backgroundImage: `url('${CATEGORY_IMAGES[activeCategory]}')` }}
                        ></div>
                        <div>
                            <h4 className="text-2xl font-bold text-white mb-2">{activeCategory}</h4>
                            <p className="text-gray-400 leading-relaxed">{CATEGORY_DESCRIPTIONS[activeCategory]}</p>
                            <p className="text-magenta-accent text-sm font-semibold mt-2">
                                {currentTreatments.length} treatment{currentTreatments.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </motion.div>

                    {/* Treatment Cards */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-magenta-accent" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center py-20 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <p className="text-gray-400">{error}</p>
                            <button onClick={loadTreatments} className="mt-4 px-6 py-2 bg-magenta-accent rounded-lg text-white">
                                Retry
                            </button>
                        </div>
                    ) : currentTreatments.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            No treatments available in this category.
                        </div>
                    ) : (
                        <motion.div
                            key={activeCategory + '-list'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {currentTreatments.map((treatment, idx) => (
                                <motion.div
                                    key={treatment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-magenta-accent/30 transition-all duration-300"
                                    onClick={() => setSelectedTreatment(treatment)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h5 className="text-lg font-bold text-white group-hover:text-magenta-accent transition-colors leading-tight">
                                                    {treatment.name}
                                                </h5>
                                            </div>
                                            <div className="shrink-0 ml-4 w-10 h-10 rounded-full bg-magenta-accent/10 flex items-center justify-center text-magenta-accent">
                                                <Leaf size={18} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-5">
                                            <span className="flex items-center gap-1 text-sm text-gray-400">
                                                <Clock size={14} className="text-magenta-accent" />
                                                {treatment.duration}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div>
                                                <span className="text-2xl font-bold text-magenta-accent">₹{treatment.price.toLocaleString()}</span>
                                            </div>
                                            <button className="px-4 py-2 rounded-xl bg-white/5 text-sm font-bold text-white hover:bg-magenta-accent transition-colors border border-white/10 hover:border-magenta-accent">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Why Ayurveda Section */}
            <section className="py-24 bg-[#050505] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-white uppercase tracking-wide">Why Choose</h3>
                        <h3 className="text-5xl font-water-brush text-magenta-accent mt-1">Kshetra Ayurveda</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Leaf, title: 'Authentic Kerala Tradition', desc: 'Our therapies follow centuries-old Kerala Ayurvedic practices passed down through generations of traditional healers.' },
                            { icon: Sparkles, title: 'Premium Herbal Oils', desc: 'We use only the finest hand-prepared herbal oils and natural ingredients sourced directly from Kerala.' },
                            { icon: CheckCircle, title: 'Certified Therapists', desc: 'All our therapists are professionally trained and certified in traditional Ayurvedic treatment methods.' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 text-center hover:border-magenta-accent/30 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 text-magenta-accent">
                                    <item.icon size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-magenta-accent transition-colors">{item.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-[#050505] relative flex justify-center items-center">
                <div className="text-center max-w-2xl px-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-600 to-magenta-accent rounded-2xl flex items-center justify-center mb-6 text-white shadow-[0_0_30px_rgba(232,121,249,0.3)]">
                        <Leaf size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Begin Your Healing Journey</h3>
                    <p className="text-gray-400 mb-8">
                        Select a treatment that resonates with your wellness goals. Our expert therapists will guide you through
                        an authentic Ayurvedic experience tailored to your needs.
                    </p>
                </div>
            </section>

            <Footer />

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedTreatment && (
                    <BookingModal
                        treatment={selectedTreatment}
                        onClose={() => setSelectedTreatment(null)}
                        userId={user?.id}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}

// Booking Modal Component
function BookingModal({ treatment, onClose, userId }: { treatment: AyurvedaTreatment; onClose: () => void; userId?: string }) {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const handleBooking = async () => {
        if (!customerName.trim()) {
            setBookingError('Please enter your name');
            return;
        }
        if (!customerEmail.trim() || !customerEmail.includes('@')) {
            setBookingError('Please enter a valid email');
            return;
        }
        if (!customerPhone.trim() || customerPhone.length < 10) {
            setBookingError('Please enter a valid phone number');
            return;
        }
        if (!appointmentDate) {
            setBookingError('Please select an appointment date');
            return;
        }

        setIsProcessing(true);
        setBookingError(null);

        try {
            const orderData = await createAyurvedaBookingOrder({
                treatmentId: treatment._id,
                price: treatment.price,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim()
            });

            await openAyurvedaPayment({
                orderId: orderData.orderId,
                amount: orderData.amount,
                currency: orderData.currency,
                keyId: orderData.keyId,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                customerPhone: customerPhone.trim(),
                treatmentName: treatment.name,
                onSuccess: async (response) => {
                    try {
                        await verifyAyurvedaBookingPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            bookingData: {
                                userId: userId,
                                treatmentId: treatment._id,
                                customerName: customerName.trim(),
                                customerEmail: customerEmail.trim(),
                                customerPhone: customerPhone.trim(),
                                appointmentDate: appointmentDate,
                                price: treatment.price
                            }
                        });
                        setBookingSuccess(true);
                        setIsProcessing(false);
                    } catch (err: any) {
                        setBookingError(err.message || 'Failed to confirm booking');
                        setIsProcessing(false);
                    }
                },
                onError: (error) => {
                    setBookingError(error.message || 'Payment failed');
                    setIsProcessing(false);
                }
            });
        } catch (err: any) {
            setBookingError(err.message || 'Failed to create order');
            setIsProcessing(false);
        }
    };

    // Success screen
    if (bookingSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#050505] w-full max-w-md p-8 rounded-3xl border border-white/10 text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-400 mb-2">
                        Your <span className="text-white font-semibold">{treatment.name}</span> appointment has been booked.
                    </p>
                    <p className="text-gray-400 mb-2">
                        Date: <span className="text-white">{new Date(appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </p>
                    <p className="text-gray-400 mb-6">
                        A confirmation email has been sent to {customerEmail}.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-magenta-accent text-white font-bold hover:bg-white hover:text-magenta-accent transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        );
    }

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
                className="bg-[#050505] w-full max-w-lg max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl border border-white/10 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#050505] border-b border-white/10 p-6 flex items-start justify-between z-10">
                    <div>
                        <p className="text-xs text-magenta-accent font-bold uppercase tracking-wider mb-1">{treatment.category}</p>
                        <h2 className="text-2xl font-bold text-white">{treatment.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Treatment Info */}
                    <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-magenta-accent">₹{treatment.price.toLocaleString()}</div>
                            <div className="text-xs text-gray-400 mt-1">per session</div>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-white font-semibold">
                                <Clock size={16} className="text-magenta-accent" />
                                {treatment.duration}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">duration</div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Your Name *</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none transition"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block">Email *</label>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block">Phone *</label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="+91 9876543210"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Appointment Date *</label>
                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {bookingError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                            <AlertCircle size={16} />
                            {bookingError}
                        </div>
                    )}

                    {/* Book Button */}
                    <button
                        onClick={handleBooking}
                        disabled={isProcessing}
                        className="w-full py-4 rounded-xl bg-magenta-accent text-white font-bold text-lg hover:brightness-110 shadow-[0_0_20px_rgba(178,48,146,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay ₹{treatment.price.toLocaleString()} & Book
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
