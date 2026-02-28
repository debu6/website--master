"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Car, X, ChevronRight, Fuel, Phone, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { 
    fetchVehicles, 
    createVehicleBookingOrder, 
    verifyVehicleBookingPayment, 
    openVehiclePayment,
    Vehicle 
} from "../services/vehicleAPI";

export default function RentVehiclePage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchVehicles();
            setVehicles(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

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
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-magenta-accent" />
                            </div>
                        ) : error ? (
                            <div className="col-span-full flex flex-col items-center py-20 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <p className="text-gray-400">{error}</p>
                                <button onClick={loadVehicles} className="mt-4 px-6 py-2 bg-magenta-accent rounded-lg text-white">
                                    Retry
                                </button>
                            </div>
                        ) : vehicles.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                No vehicles available at the moment.
                            </div>
                        ) : (
                            vehicles.map((vehicle) => (
                                <motion.div
                                    key={vehicle._id}
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
                                                <span className="text-magenta-accent font-bold text-lg">₹{vehicle.pricePerDay}</span>
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
                            ))
                        )}
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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    // Calculate total days and price
    const calculateTotalDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const totalDays = calculateTotalDays();
    const totalPrice = totalDays * vehicle.pricePerDay;

    // Handle booking with payment
    const handleBooking = async () => {
        // Validation
        if (!startDate || !endDate) {
            setBookingError('Please select start and end dates');
            return;
        }
        if (totalDays <= 0) {
            setBookingError('End date must be after start date');
            return;
        }
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

        setIsProcessing(true);
        setBookingError(null);

        try {
            // Create Razorpay order
            const orderData = await createVehicleBookingOrder({
                vehicleId: vehicle._id,
                totalPrice: totalPrice,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim()
            });

            // Open payment modal
            await openVehiclePayment({
                orderId: orderData.orderId,
                amount: orderData.amount,
                currency: orderData.currency,
                keyId: orderData.keyId,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                customerPhone: customerPhone.trim(),
                vehicleName: vehicle.name,
                onSuccess: async (response) => {
                    try {
                        // Verify payment and create booking
                        await verifyVehicleBookingPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            bookingData: {
                                vehicleId: vehicle._id,
                                customerName: customerName.trim(),
                                customerEmail: customerEmail.trim(),
                                customerPhone: customerPhone.trim(),
                                startDate: startDate,
                                endDate: endDate,
                                totalDays: totalDays,
                                totalPrice: totalPrice
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
                    <p className="text-gray-400 mb-4">
                        Your {vehicle.name} has been booked from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}.
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
                                {vehicle.description}
                            </p>
                        </div>

                        {/* Specifications Grid */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Object.entries(vehicle.specs).map(([key, value], idx) => (
                                    <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</div>
                                        <div className="text-sm text-white font-medium capitalize truncate" title={String(value)}>{value}</div>
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
                                    <div className="text-2xl font-bold text-magenta-accent">₹{vehicle.pricePerDay}</div>
                                    <div className="text-xs text-gray-400">per day</div>
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
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" 
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
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-2 block">Phone *</label>
                                        <input 
                                            type="tel" 
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="+91 9876543210"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">Start Date *</label>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">End Date *</label>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-magenta-accent outline-none" 
                                    />
                                </div>
                            </div>

                            {totalDays > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="text-white font-bold">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Security deposit (refundable):</span>
                                <span className="text-white font-bold">₹{vehicle.deposit.toLocaleString()}</span>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="font-bold text-white">Total Price:</span>
                                <span className="text-xl font-bold text-magenta-accent">
                                    {totalDays > 0 ? `₹${totalPrice.toLocaleString()}` : '₹0'}
                                </span>
                            </div>

                            {bookingError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                                    {bookingError}
                                </div>
                            )}
                        </div>

                        {/* Terms */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Terms & Conditions</h3>
                            <ul className="space-y-2">
                                {[
                                    "Valid driving license required",
                                    "Helmet and protective gear mandatory for two-wheelers",
                                    "Fuel to be paid by renter",
                                    "Security deposit is fully refundable"
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
                            <button 
                                onClick={onClose} 
                                disabled={isProcessing}
                                className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleBooking}
                                disabled={isProcessing || totalDays <= 0}
                                className="flex-[2] py-3 rounded-xl bg-magenta-accent text-white font-bold hover:bg-white hover:text-magenta-accent transition-colors shadow-[0_0_20px_rgba(178,48,146,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Book Now${totalDays > 0 ? ` - ₹${totalPrice.toLocaleString()}` : ''}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
