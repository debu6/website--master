"use client";

import React from 'react';
import SectionWrapper from '@/app/components/ui/SectionWrapper';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';

const TermsPage = () => {
    return (
        <main className="min-h-screen bg-bg-end">
            <Navbar />

            <section className="pt-32 pb-20 px-4 md:px-8">
                <SectionWrapper className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-urbanist font-bold text-white mb-2">Terms and Conditions</h1>
                        <p className="text-magenta-accent font-urbanist tracking-widest text-sm uppercase">Effective Date: 01 NOV 25</p>
                    </div>

                    <div className="space-y-12 text-gray-300 font-urbanist leading-relaxed">
                        {/* Introduction */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="mb-4">
                                <strong>Website:</strong> <span className="text-magenta-accent">www.kshetraretreat.com</span>
                            </p>
                            <p className="mb-4">
                                <strong>Owner:</strong> Kshetra Retreat LLP, Kshetra street, North cliff, Varkala, Kerala, India - 695141
                            </p>
                            <p>
                                Welcome to the official website of Kshetra Retreat ("we", "our", "us"). By accessing, browsing, or booking services through this website, you ("user", "guest", "you") agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully before using our website or services.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">1. General Information</h2>
                            <p className="mb-4">
                                Kshetra Retreat LLP operates a hospitality property located in Kshetra, Kshetra street, North cliff, Varkala, Kerala, offering accommodation, wellness programs, yoga retreats, vehicle hire & rentals and related services. Accessing or using this website signifies your agreement to these Terms. If you do not agree, please do not use this website.
                            </p>
                            <div className="pl-4 border-l-2 border-magenta-accent/30 italic text-gray-400">
                                Brands/Units: (A) Private rooms ("Kshetra Retreat"); (B) PinkroomsTM (ladies-only dorm, 12 beds, ground-floor front-side for access and safety); (C) Mixed Dorm (6 beds).
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">2. Eligibility</h2>
                            <p className="mb-4">
                                You must be 18 years or older to use our website and make bookings. By using our site, you confirm that you are an adult and legally allowed to enter into agreements under Indian law.
                            </p>
                            <p>
                                If you are under 18, you should only use the site with the permission and supervision of a parent or legal guardian.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">3. Booking and Payment Policy</h2>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>All reservations are subject to availability and confirmation.</li>
                                <li>Full or partial payment may be required to confirm a reservation depending on the rate plan selected.</li>
                                <li>We accept payment via credit cards, debit cards, UPI, net banking, PCI DSS or other payment methods specified on our website.</li>
                                <li>Prices are dynamic and may change without notice. However, the price confirmed at the time of booking payment done, will be applicable to your reservation.</li>
                            </ul>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="font-bold text-white mb-2">Advance Payment for Bookings via Booking.com and Other OTAs:</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                                    <li>For reservations made through Booking.com or similar online travel agents (OTAs), the entire booking amount is charged in advance at the time of reservation.</li>
                                    <li>The payment is processed through the secure payment gateway integrated with Booking.com, and the card details you provide on their platform are used to debit the total booking amount.</li>
                                    <li>This payment is collected and settled into our Indian business bank account through an authorized payment processing partner in compliance with Reserve Bank of India (RBI) and Payment Card Industry Data Security Standard (PCI DSS) regulations (pre-authorization debit).</li>
                                    <li>Advance payment ensures that your booking is guaranteed and confirmed instantly. Bookings without successful payment authorization will not be considered confirmed.</li>
                                    <li>In certain cases, Booking.com may temporarily pre-authorize (place a hold on) the booking amount on your credit or debit card before final settlement to verify card validity. This pre-authorization is automatically converted into a charge upon confirmation.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">4. Cancellation and Refund Policy</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Cancellations made 14 days before check-in are eligible for a full refund.</li>
                                <li>Cancellations made between 14th and 3rd day before the stay date are eligible for 60% refund.</li>
                                <li>Cancellations within 48 hours of stay date or no-shows may result in no refund.</li>
                                <li>Refunds will be processed within 7–14 working days from the cancellation date; to the original payment method.</li>
                            </ul>
                            <p className="mt-4 text-magenta-accent font-bold text-sm uppercase tracking-wide">
                                DECEMBER 22 - JAN 5 EVERY YEAR room bookings on full amount in advance, Special events, retreats, or packages have non-refundable policies.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">5. Check-In and Check-Out</h2>
                            <div className="flex gap-8 mb-4">
                                <div>
                                    <span className="block text-xs uppercase text-gray-500 tracking-widest">Check-in</span>
                                    <span className="text-xl text-white font-bold">2:00 PM (14:00 HRS) IST</span>
                                </div>
                                <div>
                                    <span className="block text-xs uppercase text-gray-500 tracking-widest">Check-out</span>
                                    <span className="text-xl text-white font-bold">11:00 AM IST</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 italic">Early check-in or late check-out is subject to availability and additional charges.</p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">6. Guest Responsibilities and House Rules</h2>
                            <p className="mb-4">Guests are required to maintain the peace, cleanliness, and decorum of the property and follow all house rules displayed on-site.</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h3 className="text-white font-bold mb-2">Safety & Authority</h3>
                                    <p className="text-sm text-gray-400">CCTV in common areas. Guests must follow safety instructions. The General Manager (GM) has final authority on operations, safety, and administrative decisions in line with policy and law.</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h3 className="text-white font-bold mb-2">AC & Energy</h3>
                                    <p className="text-sm text-gray-400">Keep windows/doors closed when AC is on. Misuse may incur extra charges or AC switch-off from the main source by the Hotel GM as per hotel policy.</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h3 className="text-white font-bold mb-2">Prohibited</h3>
                                    <p className="text-sm text-gray-400">Any damage to property, misuse of facilities, illegal activities, or possession of contraband strictly forbidden and reported to authorities.</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h3 className="text-white font-bold mb-2">Lost & Found</h3>
                                    <p className="text-sm text-gray-400">Left/Lost found Property: Logged and stored for a limited period; shipping at guest's risk/expense.</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">No-Smoking Policy</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                        <li>Smoking is strictly prohibited inside all guest rooms, bathrooms, indoor common areas, and the central courtyard, except in designated areas explicitly allotted by the General Manager.</li>
                                        <li>If cigarette smoke, tobacco residue, or any contraband substance smell is detected inside a room during checkout or inspection, a mandatory steam-cleaning and deodorization charge will be applied to cover the cost of deep cleaning mattresses, curtains, and furnishings.</li>
                                        <li>This charge is non-negotiable and will be added to the guest's final bill.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Noise and Conduct Policy</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                        <li>Shouting, loud singing, or disruptive behaviour is not permitted anywhere on the property.</li>
                                        <li>Guests must observe <strong>Silent Hours from 10:00 PM to 7:00 AM</strong>, during which all noise levels must be kept minimal to ensure a peaceful environment for all residents.</li>
                                        <li>Failure to comply with this policy may result in penalties, removal from the property without refund, or denial of future bookings.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Pet Policy</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                        <li>We understand that pets are part of many families; however, to maintain the cultural, hygiene, comfort, and wellness standards of our retreat — especially due to our yoga, wellness, and Ayurvedic treatment spaces — we are unable to accommodate pets on the property.</li>
                                        <li>Guests are kindly requested not to bring pets during their stay. This policy helps us ensure a safe, clean, and serene environment for all our guests.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Waste Disposal & Clean-Stay Rewards</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                                        <li>To keep Kshetra Retreat & Pinkrooms clean and eco-friendly, we provide clearly labelled bins: 1) Dry/Recyclable waste, 2) Food/Organic waste, and 3) Napkin/Sanitary waste (in Pinkrooms and private rooms).</li>
                                        <li>Guests are requested to sort waste into the correct bin and keep their area tidy. Our team may offer surprise rewards* (e.g., beverage vouchers, priority early check-in/late check-out, airport drop off, fee waivers, small merchandise) to guests who leave their area spotless, including after check-out.</li>
                                        <li>*Rewards are discretionary, subject to housekeeping verification and availability, non-cash, non-transferable, and cannot be guaranteed.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Section 7-9 */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">7. Intellectual Property</h2>
                                <p className="text-sm">All content on this website, including text, images, logos, and trademarks, is the property of Kshetra Retreat. You may not reproduce, distribute, or modify any material without prior written consent.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">8. Cookies</h2>
                                <p className="text-sm">Our website uses cookies to enhance user experience. By using our website, you consent to the use of cookies. You can manage or disable cookies through your browser settings.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">9. Third-Party Links</h2>
                                <p className="text-sm">Our website may contain links to external websites. We are not responsible for their content or privacy practices. Use them at your own discretion.</p>
                            </div>
                        </div>

                        {/* Section 10-13 */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">10. Limitation of Liability</h2>
                                <p>Kshetra Retreat shall not be liable for any direct, indirect, incidental, or consequential damages arising from:</p>
                                <ul className="list-disc pl-5 text-sm text-gray-400 mt-2">
                                    <li>Use or inability to use our website or services</li>
                                    <li>Acts or omissions of third-party service providers</li>
                                    <li>Force majeure events beyond our control</li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">11. Indemnity</h2>
                                <p>You agree to indemnify and hold harmless Kshetra Retreat, its owners, and staff from any claims, liabilities, or damages arising from your breach of these Terms or misuse of the website.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">12. Governing Law and Jurisdiction</h2>
                                <p>These Terms are governed by the laws of India. Any dispute shall be subject to the exclusive jurisdiction of the courts in Trivandrum, Kerala.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">13. Updates to Terms</h2>
                                <p>We reserve the right to modify or update these Terms at any time without prior notice. The updated Terms will be posted on this page with a revised "Effective Date."</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-magenta-accent/20 to-purple-900/20 text-center border border-magenta-accent/30">
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-white mb-6 uppercase">15. Contact Information</h2>
                            <div className="space-y-4 text-gray-300">
                                <p className="font-bold text-white text-lg">Kshetra Retreat LLP</p>
                                <p>
                                    Kshetra Street, North Cliff,<br />
                                    Varkala, Kerala, India - 695141
                                </p>
                                <div className="pt-2 flex flex-col items-center gap-1">
                                    <a href="mailto:booking@kshetraretreat.com" className="hover:text-magenta-accent transition-colors">booking@kshetraretreat.com</a>
                                    <a href="tel:+919447082345" className="hover:text-magenta-accent transition-colors">+91 9447082345</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </SectionWrapper>
            </section>

            <Footer />
        </main>
    );
};

export default TermsPage;
