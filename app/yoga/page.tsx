"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '@/app/components/ui/SectionWrapper';
import { RevealWrapper } from '@/app/components/ui/RevealWrapper';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { AuthModal } from '@/app/components/modals/AuthModal';
import { ProgramDetailsModal } from '@/app/components/modals/ProgramDetailsModal';
import { BookingModal } from '@/app/components/modals/BookingModal';
import { useAuth } from '@/app/hooks/useAuth';
import { getAuthToken } from '@/app/utils/cookies';
import { Medal, MapPin, Heart, Star, Calendar, Clock, ChevronRight, CheckCircle, Smartphone, X, User, Users, BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Reuse existing styles
const BUTTON_PRIMARY = "px-8 py-3 bg-magenta-accent text-white font-bold font-urbanist rounded-xl shadow-[0_0_20px_var(--color-accent-pink)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105";
const BUTTON_OUTLINE = "px-8 py-3 bg-transparent border border-white/30 text-white font-bold font-urbanist rounded-xl hover:bg-white/10 transition-all duration-300";
const CARD_BASE = "bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-magenta-accent/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.1)] group relative overflow-hidden";

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

const programsData: ProgramDetails[] = [
    {
        id: 1,
        title: "Therapeutic Yoga Mastery - February 2026",
        subtitle: "300hr Training Program",
        date: "February 20, 2026 - March 26, 2026",
        schedule: "Monday, Tuesday, Wednesday, Thursday, Friday at 07:00",
        spots: 9,
        totalCapacity: 10,
        image: "/images/yoga/therapeutic_mastery.png",
        badge: "9 Seats Available",
        rating: "4.5",
        instructor: "Maya Krishnan",
        instructorBio: "Maya brings a modern approach to traditional yoga practices, specializing in dynamic Vinyasa flows and advanced breathing techniques. Her classes are known for their creativity and therapeutic benefits.",
        description: "Specialized 300-hour training focusing on therapeutic applications of yoga. Learn to work with various health conditions using yoga as a healing modality.",
        price: "₹240,000",
        duration: "300hr • 34 days",
        prerequisites: ["Must hold 200hr YTT certification", "Healthcare background preferred", "Must have accommodation booking"]
    },
    {
        id: 2,
        title: "Spring Awakening Training - March 2026",
        subtitle: "200hr Training Program",
        date: "March 15, 2026 - April 12, 2026",
        schedule: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday at 06:00",
        spots: 10,
        totalCapacity: 15,
        image: "/images/yoga/spring_training.png",
        badge: "10 Seats Available",
        rating: "4.5",
        instructor: "Acharya Vishnu Da",
        instructorBio: "A dedicated practitioner and teacher of Ashtanga Yoga with deep knowledge of yoga philosophy and Sanskrit texts. Known for his precise alignment and spiritual teachings.",
        description: "Experience the beautiful spring season in Kerala while deepening your yoga practice. Traditional Hatha Yoga with emphasis on meditation and spiritual growth.",
        price: "₹155,000",
        duration: "200hr • 28 days",
        prerequisites: ["Must have accommodation booking", "Willingness to follow ashram lifestyle", "Basic yoga experience"]
    }
];

const YogaPage = () => {
    const { isAuth, user, isLoading } = useAuth();
    const [selectedProgram, setSelectedProgram] = useState<ProgramDetails | null>(null);
    const [bookingProgram, setBookingProgram] = useState<ProgramDetails | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [bookingFormData, setBookingFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        date: '',
        sessionType: 'Yoga Therapy Session'
    });
    const [authFormData, setAuthFormData] = useState({
        // Login fields
        loginEmail: '',
        loginPassword: '',
        // Register fields
        registerName: '',
        registerCountry: '',
        registerAddress: '',
        registerPhone: '',
        registerEmail: '',
        registerPassword: '',
        registerConfirmPassword: ''
    });

    // Check authentication status using cookie verification
    React.useEffect(() => {
        const verifyAuth = () => {
            const token = getAuthToken();
            setIsAuthenticated(!!token);
        };
        
        verifyAuth();
    }, [isAuth]);

    const handleBookingInputChange = (field: string, value: string) => {
        setBookingFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAuthInputChange = (field: string, value: string) => {
        setAuthFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEnrollClick = (program: ProgramDetails) => {
        if (isAuthenticated) {
            setBookingProgram(program);
        } else {
            setBookingProgram(program);
            setShowAuthModal(true);
            setAuthMode('login');
        }
    };

    const handleAuthSubmit = () => {
        if (authMode === 'login') {
            // Login validation
            if (authFormData.loginEmail && authFormData.loginPassword) {
                setIsAuthenticated(true);
                setShowAuthModal(false);
                // Reset form
                setAuthFormData({
                    loginEmail: '',
                    loginPassword: '',
                    registerName: '',
                    registerCountry: '',
                    registerAddress: '',
                    registerPhone: '',
                    registerEmail: '',
                    registerPassword: '',
                    registerConfirmPassword: ''
                });
            } else {
                alert('Please fill in all fields');
            }
        } else {
            // Register validation
            if (
                authFormData.registerName &&
                authFormData.registerCountry &&
                authFormData.registerAddress &&
                authFormData.registerPhone &&
                authFormData.registerEmail &&
                authFormData.registerPassword &&
                authFormData.registerConfirmPassword
            ) {
                if (authFormData.registerPassword !== authFormData.registerConfirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                setIsAuthenticated(true);
                setShowAuthModal(false);
                // Reset form
                setAuthFormData({
                    loginEmail: '',
                    loginPassword: '',
                    registerName: '',
                    registerCountry: '',
                    registerAddress: '',
                    registerPhone: '',
                    registerEmail: '',
                    registerPassword: '',
                    registerConfirmPassword: ''
                });
            } else {
                alert('Please fill in all fields');
            }
        }
    };

    return (
        <main className="min-h-screen bg-bg-end">
            <Navbar />

            {/* 1. Yoga Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Desktop Image */}
                    <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            src="/images/yoga/yoga_hero.png"
                            alt="Yoga Hero Background"
                            fill
                            quality={100}
                            priority
                            className="object-cover object-center"
                        />
                    </div>
                    {/* Mobile Image */}
                    <div className="md:hidden absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            src="/images/yoga/yoga_hero_mobile.png"
                            alt="Yoga Hero Background Mobile"
                            fill
                            quality={100}
                            priority
                            className="object-cover object-center"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#050505] z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
                </div>

                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 mt-20 flex flex-col justify-center h-full pt-12 pb-12">
                    <RevealWrapper>
                        <div className="max-w-4xl text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-urbanist font-bold uppercase text-white mb-4 tracking-tight leading-none drop-shadow-2xl">
                                WE OFFER MORE THAN YOGA
                            </h1>
                            <br />
                            <br />
                            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-water-brush text-magenta-accent mb-8 leading-none text-shadow-glow transform -rotate-1 origin-left">
                                We Offer Renewal.
                            </h2>
                            <p className="text-gray-200 font-urbanist text-lg md:text-xl max-w-2xl leading-relaxed mb-10 opacity-90 drop-shadow-md border-l-4 border-magenta-accent pl-6">
                                At Kshetra, yoga is a journey of strength, serenity, and self-discovery. <br className="hidden md:block" />
                                Each session is designed to align your body, refresh your mind, <br className="hidden md:block" />
                                and help you live with balance and grace every single day.
                            </p>

                            <button className={BUTTON_PRIMARY}>
                                View Programs
                            </button>
                        </div>
                    </RevealWrapper>
                </div>
            </section>

            {/* 2. Why Choose Kshetra */}
            <section className="relative py-24 px-6 bg-[#050505] overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <RevealWrapper>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-urbanist font-bold text-white mb-2 leading-normal">
                                Why Choose <span className="font-water-brush text-5xl md:text-6xl text-magenta-accent ml-2 inline-block pt-2">Kshetra</span>
                            </h2>
                            <p className="text-gray-400 font-urbanist tracking-widest text-sm uppercase mt-4">
                                Discover a sanctuary where ancient wisdom meets modern comfort, designed to nurture your physical and spiritual growth
                            </p>
                        </div>
                    </RevealWrapper>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Medal,
                                title: "Certified Instructors",
                                desc: "Learn from experienced internationally certified yoga teachers with deep knowledge of traditional practices"
                            },
                            {
                                icon: MapPin,
                                title: "Perfect Location",
                                desc: "Practice yoga steps away from Varkala Beach, surrounded by the natural beauty and spiritual energy of Kerala"
                            },
                            {
                                icon: Heart,
                                title: "Holistic Approach",
                                desc: "Our programs integrate asanas, pranayama, meditation, philosophy, and Ayurvedic principles for complete wellness"
                            }
                        ].map((item, idx) => (
                            <RevealWrapper key={idx} className="h-full">
                                <div className={`${CARD_BASE} text-center h-full min-h-[320px] flex flex-col items-center justify-center`}>
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-magenta-accent shrink-0">
                                        <item.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-urbanist font-bold text-white mb-4 group-hover:text-magenta-accent transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 font-urbanist leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Yoga Programs */}
            <section className="relative py-24 px-6 overflow-hidden text-center md:text-left">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/50 to-transparent z-10"></div>
                    <Image
                        src="/images/yoga/yoga_practice_bg.jpg"
                        alt="Yoga Practice Background"
                        fill
                        className="object-cover object-center"
                        quality={100}
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto">
                    <RevealWrapper>
                        <div className="text-center mb-16">
                            <span className="text-xs font-urbanist tracking-[0.3em] text-gray-500 uppercase block mb-2">
                                YOGA PROGRAMS
                            </span>
                            <br />
                            <div className="flex flex-col items-center justify-center leading-none">
                                <h2 className="text-5xl md:text-7xl font-water-brush text-white mb-2">
                                    Transform Through Practice,
                                </h2>
                                <h2 className="text-5xl md:text-7xl font-water-brush text-magenta-accent text-shadow-glow">
                                    Teach Through Purpose
                                </h2>
                            </div>
                            <p className="text-gray-400 font-urbanist text-center max-w-2xl mx-auto mt-8 text-lg">
                                Deepen your understanding of yoga, strengthen your inner discipline, and become a guide who inspires others on their journey of wellness and balance
                            </p>
                        </div>
                    </RevealWrapper>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {programsData.map((prog) => (
                            <RevealWrapper key={prog.id}>
                                <div className="group bg-[#111] rounded-3xl overflow-hidden border border-white/5 hover:border-magenta-accent/30 transition-all duration-300">
                                    {/* Image Area */}
                                    <div className="relative h-64 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${prog.image}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex gap-3">
                                            <span className="px-3 py-1 bg-magenta-accent text-white text-xs font-urbanist font-bold uppercase tracking-wider rounded-lg shadow-lg">
                                                {prog.badge}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold font-urbanist">{prog.rating}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <h3 className="text-2xl font-urbanist font-bold text-white mb-2 group-hover:text-magenta-accent transition-colors">
                                            {prog.title}
                                        </h3>

                                        <div className="flex flex-col gap-2 mb-6 text-gray-400 text-sm font-urbanist">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-magenta-accent" />
                                                <span>{prog.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-magenta-accent" />
                                                <span>{prog.subtitle}</span>  {/* Using subtitle here, maybe duration is better but keeping as per previous code */}
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setSelectedProgram(prog)}
                                                className="flex-1 py-3 border border-white/20 rounded-xl text-white font-urbanist font-bold text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-all"
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                onClick={() => handleEnrollClick(prog)}
                                                className="flex-1 py-3 bg-magenta-accent rounded-xl text-white font-urbanist font-bold text-sm uppercase tracking-wide hover:brightness-110 shadow-[0_0_15px_rgba(178,48,146,0.3)] transition-all">
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </RevealWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* Authentication Modal */}
            <AuthModal
                showAuthModal={showAuthModal}
                authMode={authMode}
                authFormData={authFormData}
                onClose={() => setShowAuthModal(false)}
                onModeChange={setAuthMode}
                onInputChange={handleAuthInputChange}
                onSubmit={handleAuthSubmit}
            />

            {/* Program Details Modal */}
            <ProgramDetailsModal
                selectedProgram={selectedProgram}
                onClose={() => setSelectedProgram(null)}
                onBookClick={() => {
                    if (selectedProgram) {
                        setSelectedProgram(null);
                        handleEnrollClick(selectedProgram);
                    }
                }}
            />

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingProgram !== null && isAuthenticated}
                onClose={() => setBookingProgram(null)}
            />



            {/* 6. Meet Our Teachers */}
            <section className="relative py-24 px-6 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/80 to-transparent z-10"></div>
                    <Image
                        src="/images/yoga/teachers_bg.png"
                        alt="Teachers Background"
                        fill
                        className="object-cover object-center"
                        quality={100}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <RevealWrapper>
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-urbanist font-bold text-white leading-normal">
                                Meet Our <span className="font-water-brush text-5xl md:text-6xl text-magenta-accent ml-2 inline-block pt-2">Teachers</span>
                            </h2>
                            <p className="text-gray-400 font-urbanist tracking-widest text-sm uppercase mt-4 max-w-xl mx-auto">
                                From your first stretch to deep mastery, our teachers are here to support your growth every step of the way.
                            </p>
                        </div>
                    </RevealWrapper>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Teacher Cards */}
                        {[
                            {
                                initial: "A",
                                name: "Acharya Vishnu Da",
                                cert: "RYT-500",
                                exp: "15 years experience",
                                role: "Ashtanga Yoga",
                                bio: "A dedicated practitioner and teacher of Ashtanga Yoga with deep knowledge of yoga philosophy and Sanskrit texts. Known for his precise alignment and spiritual teachings."
                            },
                            {
                                initial: "D",
                                name: "Dr. Amit Sharma",
                                cert: "MBBS",
                                exp: "12 years experience",
                                role: "Yoga Therapy",
                                bio: "A medical doctor turned yoga therapist, Dr. Amit combines his medical knowledge with ancient yoga practices to create healing-focused sessions. Specializes in yoga for chronic conditions."
                            },
                            {
                                initial: "F",
                                name: "Farhan",
                                cert: "RIT3566",
                                exp: "2 years experience",
                                role: "Yoga General",
                                bio: "Yoga expert , 2 years of experience international"
                            },
                            {
                                initial: "G",
                                name: "Guru Rajeesh Kumar",
                                cert: "RYT-500",
                                exp: "20 years experience",
                                role: "Hatha Yoga",
                                bio: "A traditional yoga master from Rishikesh with over two decades of teaching experience. Guru Rajeesh specializes in classical Hatha Yoga and Vedic meditation, bringing ancient wisdom to modern practitioners."
                            },
                            {
                                initial: "M",
                                name: "Maya Krishnan",
                                cert: "RYT-500",
                                exp: "8 years experience",
                                role: "Vinyasa Flow",
                                bio: "Maya brings a modern approach to traditional yoga practices, specializing in dynamic Vinyasa flows and advanced breathing techniques. Her classes are known for their creativity and therapeutic benefits."
                            },
                            {
                                initial: "T",
                                name: "Test",
                                cert: "Testcertification",
                                exp: "10 years experience",
                                role: "Hatha Yoga",
                                bio: "Testuser"
                            }
                        ].map((teacher, idx) => (
                            <RevealWrapper key={idx} className="h-full">
                                <div className="bg-[#111] p-8 rounded-2xl border border-white/5 hover:border-magenta-accent/30 transition-all duration-300 group flex flex-col items-center text-center h-full min-h-[420px]">
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-urbanist font-bold text-magenta-accent group-hover:scale-110 transition-transform mb-6 shadow-lg shadow-black/50 shrink-0">
                                        {teacher.initial}
                                    </div>
                                    <div className="flex flex-col flex-grow w-full">
                                        <h3 className="text-2xl font-urbanist font-bold text-white mb-1 group-hover:text-magenta-accent transition-colors">
                                            {teacher.name}
                                        </h3>
                                        <p className="text-magenta-accent font-urbanist text-sm font-bold uppercase tracking-wider mb-1">
                                            {teacher.role}
                                        </p>
                                        <p className="text-xs text-gray-500 font-urbanist mb-4 uppercase tracking-widest">
                                            {teacher.cert}
                                        </p>
                                        <p className="text-gray-400/80 text-sm font-urbanist leading-relaxed mb-6 font-light line-clamp-4">
                                            {teacher.bio}
                                        </p>
                                        <div className="mt-auto pt-2">
                                            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full font-bold uppercase tracking-wide">
                                                {teacher.exp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </RevealWrapper>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default YogaPage;
