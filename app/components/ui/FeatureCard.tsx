"use client";

import { motion } from 'framer-motion';

import Image from 'next/image';

interface FeatureCardProps {
    title: string;
    category?: string;
    description?: string;
    distance?: string;
    image: string;
    className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, category, description, distance, image, className = "" }) => {
    return (
        <div className={`group relative overflow-hidden rounded-2xl h-80 cursor-pointer border border-white/5 hover:border-magenta-accent/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] ${className}`}>
            {/* Image Placeholder */}
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay - Dark gradient from bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

            {/* Distance Badge (Top Left) */}
            {(distance || category) && (
                <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase bg-magenta-accent/95 backdrop-blur-sm border border-white/10 rounded-xl font-urbanist shadow-[0_4px_20px_rgba(178,48,146,0.5)] pr-5 hover:bg-magenta-accent transition-colors duration-300">
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="flex items-center justify-center"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-white drop-shadow-md"
                            >
                                <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                            </svg>
                        </motion.div>
                        {distance || category}
                    </span>
                </div>
            )}

            {/* Content (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white font-urbanist leading-tight mb-2 group-hover:text-magenta-accent transition-colors drop-shadow-md">
                    {title}
                </h3>
                {description && (
                    <p className="text-gray-300 text-sm font-urbanist leading-relaxed drop-shadow-sm opacity-90">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FeatureCard;
