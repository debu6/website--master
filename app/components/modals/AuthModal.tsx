"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { authAPI } from '@/app/services/authAPI';
import { setAuthToken } from '@/app/utils/cookies';

interface AuthModalProps {
    showAuthModal: boolean;
    authMode: 'login' | 'register';
    authFormData: {
        loginEmail: string;
        loginPassword: string;
        registerName: string;
        registerCountry: string;
        registerAddress: string;
        registerPhone: string;
        registerEmail: string;
        registerPassword: string;
        registerConfirmPassword: string;
    };
    onClose: () => void;
    onModeChange: (mode: 'login' | 'register') => void;
    onInputChange: (field: string, value: string) => void;
    onSubmit: () => void;
}

const BUTTON_PRIMARY = "px-8 py-3 bg-magenta-accent text-white font-bold font-urbanist rounded-xl shadow-[0_0_20px_var(--color-accent-pink)] hover:bg-white hover:text-magenta-accent transition-all duration-300 transform hover:scale-105";

export const AuthModal: React.FC<AuthModalProps> = ({
    showAuthModal,
    authMode,
    authFormData,
    onClose,
    onModeChange,
    onInputChange,
    onSubmit
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authAPI.login({
                email: authFormData.loginEmail,
                password: authFormData.loginPassword,
            });

            if (response.data.success) {
                // Store token in cookie
                setAuthToken(response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Call parent callback
                onSubmit();
                
                // Close modal and reset error
                handleClose();
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err: any) {
            let errorMessage = 'Login failed';
            
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Handle validation errors array
                errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate passwords match
        if (authFormData.registerPassword !== authFormData.registerConfirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authAPI.register({
                name: authFormData.registerName,
                email: authFormData.registerEmail,
                password: authFormData.registerPassword,
                phone: authFormData.registerPhone,
                address: authFormData.registerAddress,
                country: authFormData.registerCountry,
            });

            if (response.data.success) {
                // Store token in cookie
                setAuthToken(response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Call parent callback
                onSubmit();
                
                // Close modal and reset error
                handleClose();
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err: any) {
            let errorMessage = 'Registration failed';
            
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                // Handle validation errors array
                errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <AnimatePresence>
            {showAuthModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#050505] border border-white/10 rounded-3xl w-full max-w-md relative shadow-2xl max-h-[95vh] overflow-y-auto"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-6 pt-12">
                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs font-urbanist"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Tab Toggle */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => onModeChange('login')}
                                    className={`flex-1 py-2 font-urbanist font-bold uppercase tracking-wide rounded-lg transition-all ${
                                        authMode === 'login'
                                            ? 'bg-magenta-accent text-white'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => onModeChange('register')}
                                    className={`flex-1 py-2 font-urbanist font-bold uppercase tracking-wide rounded-lg transition-all ${
                                        authMode === 'register'
                                            ? 'bg-magenta-accent text-white'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Register
                                </button>
                            </div>

                            {/* Login Form */}
                            {authMode === 'login' && (
                                <form className="space-y-3" onSubmit={handleLoginSubmit}>
                                    <h3 className="text-xl font-urbanist font-bold text-white mb-4">Sign In</h3>
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={authFormData.loginEmail}
                                            onChange={(e) => onInputChange('loginEmail', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showLoginPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={authFormData.loginPassword}
                                                onChange={(e) => onInputChange('loginPassword', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full ${BUTTON_PRIMARY} mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2`}
                                    >
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </form>
                            )}

                            {/* Register Form */}
                            {authMode === 'register' && (
                                <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                                    <h3 className="text-xl font-urbanist font-bold text-white mb-4">Create Account</h3>
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={authFormData.registerName}
                                            onChange={(e) => onInputChange('registerName', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="India"
                                                value={authFormData.registerCountry}
                                                onChange={(e) => onInputChange('registerCountry', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={authFormData.registerPhone}
                                                onChange={(e) => onInputChange('registerPhone', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123 Main St, City"
                                            value={authFormData.registerAddress}
                                            onChange={(e) => onInputChange('registerAddress', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={authFormData.registerEmail}
                                            onChange={(e) => onInputChange('registerEmail', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showRegisterPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={authFormData.registerPassword}
                                                    onChange={(e) => onInputChange('registerPassword', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-urbanist font-bold uppercase tracking-widest text-gray-500">
                                                Confirm
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showRegisterConfirmPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={authFormData.registerConfirmPassword}
                                                    onChange={(e) => onInputChange('registerConfirmPassword', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white font-urbanist focus:outline-none focus:border-magenta-accent/50 transition-colors placeholder-gray-600"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full ${BUTTON_PRIMARY} mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2`}
                                    >
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
