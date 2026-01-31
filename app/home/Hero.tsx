import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image - Anchored to Top for Moon Visibility */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/home/sunset_palms_illustration.png"
                    alt="Sunset Palms Hero"
                    fill
                    priority
                    className="object-cover object-[center_26%]"
                />
                {/* Shadow Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
            </div>

            <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto pt-20 flex flex-col justify-center h-full">
                <div className="max-w-7xl">
                    <h2 className="text-sm md:text-lg lg:text-2xl font-urbanist font-bold uppercase text-white mb-2 tracking-wide drop-shadow-md">
                        Book Rooms & Services
                    </h2>
                    <br />

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-water-brush text-white leading-tight mb-4 md:mb-6 text-shadow-glow-white whitespace-nowrap transform -rotate-1 origin-left">
                        All In <span className="text-magenta-accent text-shadow-glow">One</span> Place
                    </h1>

                    <p className="text-gray-200 font-urbanist text-base md:text-lg lg:text-xl max-w-xl mb-8 md:mb-12 leading-relaxed opacity-90">
                        Find the perfect stay and trusted services in seconds. Browse rooms, book instantly, and get reliable help at your fingertips.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
                        <a
                            href="https://live.ipms247.com/booking/book-rooms-kshetraretreatvarkala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 md:px-10 md:py-4 rounded-xl bg-magenta-accent text-white font-bold font-urbanist text-base md:text-lg tracking-wide hover:brightness-110 hover:shadow-[0_0_25px_rgba(178,48,146,0.6)] hover:-translate-y-1 transition-all duration-300 min-w-[160px] md:min-w-[200px] text-center flex items-center justify-center"
                        >
                            Start Your Booking
                        </a>
                        <Link
                            href="/track-booking"
                            className="px-8 py-3 md:px-10 md:py-4 rounded-xl border border-white/30 bg-transparent text-white font-urbanist text-base md:text-lg tracking-wide hover:bg-white/10 hover:border-white/60 transition-all duration-300 min-w-[160px] md:min-w-[200px] text-center flex items-center justify-center"
                        >
                            Track Your Booking
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Hero;
