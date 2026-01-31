import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#050505] pt-20 pb-8 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

                {/* 1. Brand & Socials */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Logo Placeholder */}
                    <Link href="/" className="mb-6 group inline-block">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="relative w-40 h-auto mb-4">
                                <Image
                                    src="/images/Logos/logo_new.webp"
                                    alt="Kshetra Logo"
                                    width={200}
                                    height={80}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </Link>

                    {/* Tagline */}
                    <div className="mb-8">
                        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-urbanist">
                            Where Modern Comfort
                        </p>
                        <p className="text-xl font-water-brush text-magenta-accent text-shadow-glow mt-1 transform -rotate-2">
                            meets soulful wellness
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/919447082345"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                            </svg>
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/share/1FgdAC9Pqq/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] transition-all duration-300"
                        >
                            <Facebook size={18} />
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/kshetra_retreats?igsh=b3NiM3YweXVnNTdp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-magenta-accent hover:border-magenta-accent hover:shadow-[0_0_15px_rgba(178,48,146,0.5)] transition-all duration-300"
                        >
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>

                {/* 2. STAY */}
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-annie tracking-widest text-magenta-accent mb-6 uppercase">Stay</h4>
                    <ul className="space-y-4 text-gray-400 font-urbanist text-sm font-light">
                        <li><Link href="/kshetra" className="hover:text-magenta-accent transition-colors">Rooms & Suites</Link></li>
                        <li>
                            <a
                                href="https://live.ipms247.com/booking/book-rooms-kshetraretreatvarkala"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-magenta-accent transition-colors"
                            >
                                Book Your Stay
                            </a>
                        </li>
                    </ul>
                </div>

                {/* 3. EXPERIENCE */}
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-annie tracking-widest text-magenta-accent mb-6 uppercase">Experience</h4>
                    <ul className="space-y-4 text-gray-400 font-urbanist text-sm font-light">
                        <li><Link href="/yoga" className="hover:text-magenta-accent transition-colors">Yoga Sessions</Link></li>
                        <li><Link href="/dining" className="hover:text-magenta-accent transition-colors">Dining & Cuisine</Link></li>
                        <li><Link href="/adventure-sports" className="hover:text-magenta-accent transition-colors">Adventure Sports</Link></li>
                        <li><Link href="/rent-vehicle" className="hover:text-magenta-accent transition-colors">Rent a Vehicle</Link></li>
                        <li><Link href="/airport-transfers" className="hover:text-magenta-accent transition-colors">Airport Transfers</Link></li>
                    </ul>
                </div>

                {/* 4. SUPPORT */}
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-annie tracking-widest text-magenta-accent mb-6 uppercase">Support</h4>
                    <ul className="space-y-4 text-gray-400 font-urbanist text-sm font-light">
                        <li><Link href="/terms" className="hover:text-magenta-accent transition-colors">Terms & Conditions</Link></li>
                        <li><Link href="/privacy" className="hover:text-magenta-accent transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/contact#faq" className="hover:text-magenta-accent transition-colors">FAQs</Link></li>
                    </ul>
                </div>

                {/* 5. CONTACT */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-lg font-annie tracking-widest text-magenta-accent mb-6 uppercase">Contact</h4>
                    <ul className="space-y-6 text-gray-400 font-urbanist text-sm font-light w-full">
                        <li className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 group">
                            <MapPin size={18} className="text-magenta-accent mt-0.5 group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] transition-all shrink-0" />
                            <a
                                href="https://maps.app.goo.gl/3HJzPNvFqf3cGBJF9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                <span className="font-bold block mb-1">Kshetra Retreat LLP</span>
                                Kshetra Street, North Cliff, Varkala,<br />
                                Kerala, India - 695141
                            </a>
                        </li>
                        <li className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 group">
                            <Mail size={18} className="text-magenta-accent group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] transition-all" />
                            <a href="mailto:booking@kshetraretreat.com" className="hover:text-white transition-colors">booking@kshetraretreat.com</a>
                        </li>
                        <li className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 group">
                            <Phone size={18} className="text-magenta-accent group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] transition-all" />
                            <a href="tel:+919447082345" className="hover:text-white transition-colors">+91 9447082345</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 text-center">
                <p className="text-gray-500 font-urbanist text-sm">
                    &copy; 2026 Kshetra Retreat. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
