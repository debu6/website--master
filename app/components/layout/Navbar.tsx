"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { AuthModal } from '../modals/AuthModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const pathname = usePathname();
    const { isAuth, user, isLoading } = useAuth();

    // Auth modal state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [authFormData, setAuthFormData] = useState({
        loginEmail: '',
        loginPassword: '',
        registerName: '',
        registerCountry: '',
        registerAddress: '',
        registerPhone: '',
        registerEmail: '',
        registerPassword: '',
        registerConfirmPassword: '',
    });

    // Scroll handling for hide/show and transparency
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Transparency logic
            setScrolled(currentScrollY > 50);

            // Hide/Show logic
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN -> Hide
                setHidden(true);
            } else {
                // Scrolling UP -> Show
                setHidden(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        // Prevent scrolling when menu is open
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    const navLinks = [
        'Stay',
        'Yoga',
        'Airport Transfers',
        'Rent a Vehicle',
        'Adventure Sports',
        'Contact'
    ];

    const getHref = (item: string) => {
        if (item === 'Stay') return '/kshetra';
        if (item === 'Rent a Vehicle') return '/rent-vehicle';
        return `/${item.toLowerCase().replace(/\s+/g, '-')}`;
    };

    const handleAuthInputChange = (field: string, value: string) => {
        setAuthFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAuthSubmit = () => {
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
            registerConfirmPassword: '',
        });
        // Refresh page to update auth state
        window.location.reload();
    };

    const openLoginModal = () => {
        setAuthMode('login');
        setShowAuthModal(true);
        if (isOpen) toggleMenu();
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${hidden ? '-translate-y-full' : 'translate-y-0'
                    } ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-4 md:py-6'
                    }`}
            >
                {/* Shadow Gradient for Readability */}
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent -z-10 transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className="max-w-[1920px] mx-auto px-4 md:px-12 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex flex-col items-center group z-50 relative mr-8">
                        <div className="relative w-24 md:w-32 h-auto transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/images/Logos/logo_new.webp"
                                alt="Kshetra Logo"
                                width={180}
                                height={60}
                                className="w-full h-auto object-contain transition-all duration-300 animate-glow-loop"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Links - Centered */}
                    <div className="hidden xl:flex items-center justify-center flex-1 gap-10">
                        {navLinks.map((item) => {
                            const href = getHref(item);
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={item}
                                    href={href}
                                    className={`transition-colors font-urbanist text-base font-bold tracking-wide relative group text-shadow-sm ${isActive ? 'text-magenta-accent' : 'text-white hover:text-magenta-accent'}`}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-magenta-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side - Pinkrooms Branding + Login/Profile */}
                    <div className="hidden xl:flex items-center gap-4 z-50">
                        <Link href="/pinkrooms" className="relative w-56 h-auto block group">
                            <Image
                                src="/images/Logos/pinkroom.png"
                                alt="Pinkrooms Logo"
                                width={224}
                                height={80}
                                className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105 animate-glow-loop"
                            />
                        </Link>
                        
                        {/* Login/Profile Button */}
                        {!isLoading && (
                            isAuth ? (
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Profile'}</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={openLoginModal}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium hover:opacity-90 transition shadow-lg shadow-pink-500/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Login
                                </button>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Toggle (Modern Hamburger) */}
                    <button
                        onClick={toggleMenu}
                        className="xl:hidden z-50 relative w-10 h-10 flex flex-col items-center justify-center focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        <span className={`w-6 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[1px]' : '-translate-y-1.5'}`}></span>
                        <span className={`w-6 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`w-6 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[8px]' : 'translate-y-1.5'}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl xl:hidden transition-all duration-500 ease-out flex flex-col justify-center items-center ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
            >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-magenta-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="flex flex-col items-center space-y-6 text-center p-4 w-full max-w-sm">
                    {navLinks.map((item, idx) => {
                        const href = getHref(item);
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={item}
                                href={href}
                                onClick={toggleMenu}
                                className={`text-2xl font-urbanist font-bold transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isActive ? 'text-magenta-accent' : 'text-white hover:text-magenta-accent'}`}
                                style={{ transitionDelay: `${150 + idx * 100}ms` }}
                            >
                                {item}
                            </Link>
                        );
                    })}

                    <a
                        href="https://live.ipms247.com/booking/book-rooms-kshetraretreatvarkala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-8 px-8 py-3 rounded-xl bg-magenta-accent text-white font-bold font-urbanist text-lg shadow-[0_0_20px_var(--color-accent-pink)] transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        style={{ transitionDelay: '650ms' }}
                    >
                        Book Now
                    </a>

                    {/* Mobile Login/Profile Button */}
                    {!isLoading && (
                        isAuth ? (
                            <Link
                                href="/profile"
                                onClick={toggleMenu}
                                className={`mt-6 flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: '700ms' }}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span>My Profile</span>
                            </Link>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: '700ms' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Login / Register
                            </button>
                        )
                    )}

                    {/* Mobile Pinkrooms Logo */}
                    <Link
                        href="#"
                        className={`mt-12 flex flex-col items-center gap-2 group transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: '750ms' }}
                        onClick={toggleMenu}
                    >
                        <div className="relative w-40 h-auto">
                            <Image
                                src="/images/Logos/pinkroom.png"
                                alt="Pinkrooms Logo"
                                width={160}
                                height={60}
                                className="w-full h-auto object-contain animate-glow-loop"
                            />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                showAuthModal={showAuthModal}
                authMode={authMode}
                authFormData={authFormData}
                onClose={() => setShowAuthModal(false)}
                onModeChange={setAuthMode}
                onInputChange={handleAuthInputChange}
                onSubmit={handleAuthSubmit}
            />
        </>
    );
};

export default Navbar;
