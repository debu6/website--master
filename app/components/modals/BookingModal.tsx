"use client";

import React from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BUTTON_PRIMARY = "px-8 py-3 bg-magenta-accent text-white font-bold font-urbanist rounded-xl shadow-[0_0_20px_var(--color-accent-pink)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105";

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose
}) => {
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

                        <div className="p-6 md:p-10">
                            <h3 className="text-3xl font-urbanist font-bold text-white mb-2">
                                Book Your Session
                            </h3>
                            <p className="text-gray-400 text-sm font-urbanist mb-8">
                                For any queries feel free to reach out to us directly.
                            </p>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors bg-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                        Session Type
                                    </label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors appearance-none">
                                        <option className="bg-black">Yoga Therapy Session</option>
                                        <option className="bg-black">Private Meditation</option>
                                        <option className="bg-black">Consultation</option>
                                    </select>
                                </div>

                                <button type="button" className={`w-full ${BUTTON_PRIMARY} mt-4`}>
                                    Book Your Session
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
