import React from 'react';
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Track Booking | Coming Soon - Kshetra Retreat Resort",
    description: "Track your booking feature is coming soon to Kshetra Retreat Resort.",
};

export default function TrackBookingPage() {
    return (
        <main className="min-h-screen bg-black flex flex-col relative overflow-hidden selection:bg-magenta-accent selection:text-white">
            {/* Background Gradients to match theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-accent/10 blur-[120px] rounded-full"></div>
            </div>

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-48 pb-20">
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-3xl max-w-lg w-full text-center shadow-2xl transform hover:scale-[1.01] transition-all duration-500">
                    {/* Icon */}
                    <div className="w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner group">
                        <Clock className="w-10 h-10 text-magenta-accent drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] animate-pulse" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-water-brush text-white mb-6 leading-tight">
                        Feature <span className="text-magenta-accent text-shadow-glow">Coming Soon</span>
                    </h1>

                    <p className="text-gray-300 font-urbanist text-lg mb-10 leading-relaxed font-light">
                        We are currently building a seamless way for you to track your bookings directly from our website. Stay tuned!
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-magenta-accent text-white font-bold font-urbanist tracking-wide hover:brightness-110 hover:shadow-[0_0_20px_rgba(178,48,146,0.5)] active:scale-95 transition-all duration-300"
                    >
                        Return Home
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
