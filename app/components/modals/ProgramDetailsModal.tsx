"use client";

import React from 'react';
import { X, BookOpen, Calendar, Clock, Users, User, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProgramDetails {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    schedule: string;
    spots: number;
    totalCapacity: number;
    image: string;
    badge: string;
    rating: string;
    instructor: string;
    instructorBio: string;
    description: string;
    price: string;
    duration: string;
    prerequisites: string[];
}

interface ProgramDetailsModalProps {
    selectedProgram: ProgramDetails | null;
    onClose: () => void;
    onBookClick: () => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
    selectedProgram,
    onClose,
    onBookClick
}) => {
    return (
        <AnimatePresence>
            {selectedProgram && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#050505] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-6 md:p-10">
                            <h2 className="text-2xl md:text-4xl font-urbanist font-bold text-white mb-8 pr-8 font-water-brush-alt">
                                {selectedProgram.title}
                            </h2>

                            <div className="grid lg:grid-cols-2 gap-10">
                                {/* Left Column: Details */}
                                <div className="space-y-8">

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-urbanist font-bold text-white mb-4">Program Details</h3>

                                        <div className="space-y-3 text-gray-300 font-urbanist text-sm">
                                            <div className="flex items-start gap-3">
                                                <BookOpen size={18} className="text-magenta-accent mt-0.5 shrink-0" />
                                                <span>{selectedProgram.subtitle}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar size={18} className="text-magenta-accent mt-0.5 shrink-0" />
                                                <span>{selectedProgram.date}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock size={18} className="text-magenta-accent mt-0.5 shrink-0" />
                                                <span>{selectedProgram.schedule}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Users size={18} className="text-magenta-accent mt-0.5 shrink-0" />
                                                <span>{selectedProgram.spots} spots available (out of {selectedProgram.totalCapacity})</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <User size={18} className="text-magenta-accent mt-0.5 shrink-0" />
                                                <span>Instructor: {selectedProgram.instructor}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-urbanist font-bold text-white mb-3">Description</h3>
                                        <p className="text-gray-400 font-urbanist text-sm leading-relaxed">
                                            {selectedProgram.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-urbanist font-bold text-white mb-3">Prerequisites</h3>
                                        <ul className="space-y-2">
                                            {selectedProgram.prerequisites.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-gray-400 font-urbanist text-sm">
                                                    <CheckCircle size={16} className="text-magenta-accent shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>

                                {/* Right Column: Pricing & Bio */}
                                <div className="space-y-8">

                                    {/* Pricing Card */}
                                    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
                                        <div className="mb-6">
                                            {/* <p className="text-3xl font-bold text-magenta-accent font-urbanist mb-1">{selectedProgram.price}</p> */}
                                            <p className="text-gray-400 text-sm font-urbanist">{selectedProgram.duration}</p>
                                        </div>

                                        <div className="flex justify-between items-center mb-2 text-sm font-urbanist text-gray-300">
                                            <span>Available spots:</span>
                                            <span className="font-bold text-white">{selectedProgram.spots}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-6 text-sm font-urbanist text-gray-300">
                                            <span>Total capacity:</span>
                                            <span className="font-bold text-white">{selectedProgram.totalCapacity}</span>
                                        </div>

                                        <button 
                                            onClick={onBookClick}
                                            className="w-full py-3 bg-magenta-accent text-white font-bold font-urbanist rounded-lg hover:brightness-110 shadow-[0_0_15px_rgba(178,48,146,0.3)] transition-all">
                                            Book This Program
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-urbanist font-bold text-white mb-3 font-water-brush-alt">About Your Instructor</h3>
                                        <p className="text-gray-400 font-urbanist text-sm leading-relaxed">
                                            {selectedProgram.instructorBio}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
