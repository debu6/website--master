"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { setAuthToken } from '@/app/utils/cookies';
import { partnerAPI } from '@/app/services/partnerAPI';

const BUTTON_PRIMARY = "px-8 py-3 bg-magenta-accent text-white font-bold font-urbanist rounded-xl shadow-[0_0_20px_var(--color-accent-pink)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105";

export default function PartnerLoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hasGST, setHasGST] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        companyName: '',
        contactPersonName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        hasGST: false,
        gst: '',
    });

    const handleLoginChange = (field: string, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegisterChange = (field: string, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
    };

    const handleGSTCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setHasGST(checked);
        setRegisterData(prev => ({ ...prev, hasGST: checked }));
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await partnerAPI.login(loginData.email, loginData.password);

            if (result.success && result.data.success) {
                setAuthToken(result.data.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                window.location.href = '/';
            } else {
                setError(result.data?.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate GST if checkbox is checked
        if (hasGST && !registerData.gst.trim()) {
            setError('Please enter GST number');
            return;
        }

        setIsLoading(true);

        try {
            const result = await partnerAPI.register({
                companyName: registerData.companyName,
                contactPersonName: registerData.contactPersonName,
                email: registerData.email,
                phone: registerData.phone,
                address: registerData.address,
                password: registerData.password,
                hasGST: hasGST,
                gst: hasGST ? registerData.gst : null,
            });

            if (result.success && result.data.success) {
                setAuthToken(result.data.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                window.location.href = '/';
            } else {
                setError(result.data?.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-urbanist">Back to Home</span>
                    </Link>
                    <h1 className="text-3xl font-urbanist font-bold text-white mb-2">
                        Partner Portal
                    </h1>
                    <p className="text-gray-400 font-urbanist">Manage your bookings and business</p>
                </div>

                {/* Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm font-urbanist"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Tab Toggle */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-3 font-urbanist font-bold uppercase tracking-wide rounded-lg transition-all ${
                                mode === 'login'
                                    ? 'bg-magenta-accent text-white shadow-lg shadow-magenta-accent/50'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-3 font-urbanist font-bold uppercase tracking-wide rounded-lg transition-all ${
                                mode === 'register'
                                    ? 'bg-magenta-accent text-white shadow-lg shadow-magenta-accent/50'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Form */}
                    {mode === 'login' && (
                        <form className="space-y-4" onSubmit={handleLoginSubmit}>
                            <h3 className="text-xl font-urbanist font-bold text-white mb-6">Partner Sign In</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="partner@example.com"
                                    value={loginData.email}
                                    onChange={(e) => handleLoginChange('email', e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={(e) => handleLoginChange('password', e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full ${BUTTON_PRIMARY} mt-6 disabled:opacity-50 disabled:cursor-not-allowed py-3`}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {mode === 'register' && (
                        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                            <h3 className="text-xl font-urbanist font-bold text-white mb-6">Create Partner Account</h3>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your Company Name"
                                    value={registerData.companyName}
                                    onChange={(e) => handleRegisterChange('companyName', e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Contact Person Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your Full Name"
                                    value={registerData.contactPersonName}
                                    onChange={(e) => handleRegisterChange('contactPersonName', e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="partner@company.com"
                                    value={registerData.email}
                                    onChange={(e) => handleRegisterChange('email', e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={registerData.phone}
                                    onChange={(e) => handleRegisterChange('phone', e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Business Address"
                                    value={registerData.address}
                                    onChange={(e) => handleRegisterChange('address', e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={registerData.password}
                                        onChange={(e) => handleRegisterChange('password', e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* GST Checkbox */}
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="hasGST"
                                    checked={hasGST}
                                    onChange={handleGSTCheckbox}
                                    className="w-5 h-5 rounded border border-white/10 bg-white/5 cursor-pointer accent-magenta-accent"
                                />
                                <label
                                    htmlFor="hasGST"
                                    className="text-sm font-urbanist text-gray-300 cursor-pointer"
                                >
                                    I have a GST number
                                </label>
                            </div>

                            {/* GST Field - Conditional */}
                            {hasGST && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-400">
                                        GST Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="XX AAAA XXXX XXXX X"
                                        value={registerData.gst}
                                        onChange={(e) => handleRegisterChange('gst', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                    />
                                    <p className="text-xs text-gray-500">Format: XX AAAA XXXX XXXX X (15 characters)</p>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full ${BUTTON_PRIMARY} mt-6 disabled:opacity-50 disabled:cursor-not-allowed py-3`}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    {/* Footer Link */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-400 font-urbanist">
                            Need help?{' '}
                            <Link href="/contact" className="text-blue-400 hover:text-cyan-300 transition-colors">
                                Contact us
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
