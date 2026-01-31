import React from 'react';
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Hero from "@/app/home/Hero";
import IntroSection from "@/app/home/IntroSection";
import WhyVarkalaSection from "@/app/home/WhyVarkalaSection";
import ExperienceSection from "@/app/home/ExperienceSection";
import CarouselSection from "@/app/home/CarouselSection";
import AmenitiesSection from "@/app/home/AmenitiesSection";
import TestimonialsSection from "@/app/home/TestimonialsSection";

export const metadata = {
  title: "Kshetra Retreat Resort",
  description: "Experience the soul of Kerala at Kshetra Retreat. Luxury rooms, Ayurveda, Yoga, and Adventure near Varkala North Cliff. Book your stay today.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-end overflow-x-hidden selection:bg-magenta-accent selection:text-white">
      <Navbar />
      <Hero />
      <IntroSection />
      <WhyVarkalaSection />
      <ExperienceSection />
      <CarouselSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
