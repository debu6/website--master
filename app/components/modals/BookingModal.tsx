"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BUTTON_PRIMARY = "px-8 py-3 bg-magenta-accent text-white font-bold font-urbanist rounded-xl shadow-[0_0_20px_var(--color-accent-pink)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose
}) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'single',
        days: 7,
        startDate: '',
    });
    const [endDate, setEndDate] = useState('');
    const [price, setPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [pricingMatrix, setPricingMatrix] = useState<Record<string, Record<number, number>>>({});
    const [pricingLoaded, setPricingLoaded] = useState(false);

    // Fetch pricing matrix from backend
    useEffect(() => {
        if (isOpen && !pricingLoaded) {
            const fetchPricing = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing`);
                    const data = await res.json();
                    if (data.success && data.matrix) {
                        setPricingMatrix(data.matrix);
                    }
                } catch (err) {
                    console.error('Failed to fetch pricing:', err);
                } finally {
                    setPricingLoaded(true);
                }
            };
            fetchPricing();
        }
    }, [isOpen, pricingLoaded]);

    // Prefill name and email from auth context
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [user, isOpen]);

    // Calculate end date and price when dependencies change
    useEffect(() => {
        if (formData.startDate) {
            const start = new Date(formData.startDate);
            const end = new Date(start);
            end.setDate(end.getDate() + formData.days - 1);
            setEndDate(end.toISOString().split('T')[0]);
        }

        const calculatedPrice = pricingMatrix[formData.category]?.[formData.days] || 0;
        setPrice(calculatedPrice);
    }, [formData.startDate, formData.days, formData.category, pricingMatrix]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'days' ? parseInt(value, 10) : value,
        }));
        setError('');
    };

    const handlePayment = async () => {
        if (!formData.startDate || !formData.name || !formData.email) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            // Load Razorpay SDK
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                initiatePayment();
            };
            document.body.appendChild(script);
        } catch (err) {
            setError('Failed to load payment gateway');
            setIsLoading(false);
        }
    };

    const initiatePayment = async () => {
        try {
            // Call backend to create order
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: price,
                    currency: 'INR',
                    email: formData.email,
                    name: formData.name,
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: price * 100, // Amount in paise
                currency: 'INR',
                name: 'Yoga Retreat Varkala',
                description: `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} Room - ${formData.days} Days`,
                order_id: orderData.orderId,
                handler: async (response: any) => {
                    // Verify payment on backend
                    try {
                        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: orderData.orderId,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                bookingData: {
                                    name: formData.name,
                                    email: formData.email,
                                    category: formData.category,
                                    days: formData.days,
                                    startDate: formData.startDate,
                                    endDate: endDate,
                                    price: price,
                                },
                            }),
                        });

                        if (verifyResponse.ok) {
                            setIsSuccess(true);
                            // Close modal after 2 seconds
                            setTimeout(() => {
                                onClose();
                                setIsSuccess(false);
                            }, 2000);
                        } else {
                            setError('Payment verification failed');
                        }
                    } catch (err) {
                        setError('Verification error: ' + (err instanceof Error ? err.message : 'Unknown error'));
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                },
                theme: {
                    color: '#EC407A',
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.on('payment.failed', (response: any) => {
                setError('Payment failed: ' + response.error.description);
            });
            razorpay.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment initiation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#050505] border border-white/10 rounded-3xl w-full max-w-2xl relative shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Success Screen */}
                        {isSuccess ? (
                            <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-96">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 100 }}
                                    className="mb-6"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </motion.div>
                                <h3 className="text-3xl font-urbanist font-bold text-white mb-2 text-center">
                                    Booking Successful!
                                </h3>
                                <p className="text-gray-400 text-sm font-urbanist text-center">
                                    Your booking has been confirmed. Check your email for details.
                                </p>
                            </div>
                        ) : (
                            <>
                        <div className="p-6 md:p-10">
                            <h3 className="text-3xl font-urbanist font-bold text-white mb-2">
                                Book Your Session
                            </h3>
                            <p className="text-gray-400 text-sm font-urbanist mb-8">
                                For any queries feel free to reach out to us directly.
                            </p>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        readOnly
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors opacity-70 cursor-not-allowed"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors opacity-70 cursor-not-allowed"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Room Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors appearance-none"
                                    >
                                        <option className="bg-black" value="single">Single Room</option>
                                        <option className="bg-black" value="double">Double Room</option>
                                        <option className="bg-black" value="dormitory">Dormitory (Max 4 Person)</option>
                                    </select>
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Duration (Days)
                                    </label>
                                    <select
                                        name="days"
                                        value={formData.days}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors appearance-none"
                                    >
                                        <option className="bg-black" value="7">7 Days</option>
                                        <option className="bg-black" value="15">15 Days</option>
                                    </select>
                                </div>

                                {/* Start Date */}
                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors cursor-pointer"
                                        style={{
                                            colorScheme: 'dark',
                                            WebkitCalendarPickerIndicator: 'unset',
                                        } as any}
                                    />
                                </div>

                                {/* End Date (Read-only) */}
                                {endDate && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                            End Date
                                        </label>
                                        <input
                                            type="text"
                                            value={new Date(endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            readOnly
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none transition-colors opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                )}

                                {/* Price Summary */}
                                {price > 0 && (
                                    <div className="p-4 bg-magenta-accent/10 border border-magenta-accent/30 rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-urbanist">Total Price</span>
                                            <span className="text-2xl font-bold text-magenta-accent font-urbanist">₹{price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={isLoading || !formData.startDate}
                                    className={`w-full ${BUTTON_PRIMARY} mt-4`}
                                >
                                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </form>
                        </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
