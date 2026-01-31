"use client";

import React from 'react';
import SectionWrapper from '@/app/components/ui/SectionWrapper';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';

const PrivacyPage = () => {
    return (
        <main className="min-h-screen bg-bg-end">
            <Navbar />

            <section className="pt-32 pb-20 px-4 md:px-8">
                <SectionWrapper className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-urbanist font-bold text-white mb-2">Privacy Policy</h1>
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
                            <h3 className="text-xl font-bold text-white mb-2 mt-6">Data Collection and Use (DPDP Act Compliance)</h3>
                            <p>
                                Welcome to Kshetra Retreat. We are committed to protecting your privacy and ensuring the security of your personal data in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act). This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">1. Personal Data We Collect</h2>
                            <p className="mb-4">
                                We may collect the following categories of personal data when you use our website, services, walk-in booking, check-in time and staying:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                <li>Contact details (name, phone number, email address)</li>
                                <li>Coming from and proceeding to locations</li>
                                <li>Booking and transaction details</li>
                                <li>Government ID (for check-in as required by Indian law)</li>
                                <li>Preferences (dietary, room type, wellness program choices)</li>
                                <li>Device and browsing data (IP address, cookies, analytics)</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">2. Purpose of Data Collection</h2>
                            <p className="mb-4">We collect and process personal data for:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                <li>Providing accommodation and related services</li>
                                <li>Booking confirmation, payment processing, and communication</li>
                                <li>Legal compliance with government and tourism regulations</li>
                                <li>Marketing, offers, and newsletters</li>
                                <li>Security, analytics, and service improvement</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">3. Consent and User Rights</h2>
                            <p className="mb-4">
                                By submitting your data, you provide explicit, free, specific, and informed consent as per the Digital Personal Data Protection Act, 2023.
                            </p>
                            <p className="mb-4">
                                You have the right to access, correct, update, or request deletion of your data after staying.
                            </p>
                            <p className="mb-4">
                                You may withdraw your consent at any time after checkout by contacting us at <a href="mailto:booking@kshetraretreat.com" className="text-magenta-accent hover:underline">booking@kshetraretreat.com</a>.
                            </p>
                            <p>Upon withdrawal, we may be unable to provide certain services.</p>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">4. Data Storage and Retention</h2>
                            <p className="mb-4">
                                Your data is stored securely on servers located within India or jurisdictions compliant with Indian data transfer norms (as per third party server companies).
                            </p>
                            <p>
                                We retain data only as long as necessary for the purpose it was collected or as required by law.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">5. Data Sharing and Disclosure</h2>
                            <p className="mb-4">We do not sell your personal data.</p>
                            <p className="mb-4">Data may be shared with service partners (payment gateways, booking platforms, email service providers) strictly for service delivery.</p>
                            <p>We may disclose data if required by law, court order, or government authority.</p>
                        </div>

                        {/* Section 6 */}
                        <div>
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">6. Security Measures</h2>
                            <p>
                                We implement reasonable technical and organisational safeguards including encryption, access controls, and regular audits to protect your data from unauthorised access, loss, or misuse.
                            </p>
                        </div>

                        {/* Section 7-9 */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">7. Cookies and Tracking Technologies</h2>
                                <p className="text-sm">Our website uses cookies and similar technologies to enhance user experience and improve our services. By using our website, you consent to the use of cookies. You can manage or disable cookies through your browser settings.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">8. Third-Party Links</h2>
                                <p className="text-sm">Our website may contain links to external websites. We are not responsible for their content or privacy practices. Use them at your own discretion.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-urbanist font-bold tracking-widest text-magenta-accent mb-4 uppercase">9. Updates to Privacy Policy</h2>
                                <p className="text-sm">We reserve the right to modify or update this Privacy Policy at any time without prior notice. The updated policy will be posted on this page with a revised "Effective Date." We encourage you to review this page periodically to stay informed about how we protect your information.</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-magenta-accent/20 to-purple-900/20 text-center border border-magenta-accent/30">
                            <h2 className="text-xl font-urbanist font-bold tracking-widest text-white mb-6 uppercase">Contact Us for Privacy Concerns</h2>
                            <div className="space-y-4 text-gray-300">
                                <p>For queries, concerns, data-related requests, or to exercise your rights under the DPDP Act, please contact:</p>
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

export default PrivacyPage;
