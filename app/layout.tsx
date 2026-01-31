import type { Metadata } from "next";
import { Water_Brush, Annie_Use_Your_Telescope, Urbanist } from "next/font/google";
import "./globals.css";

const waterBrush = Water_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-water-brush",
});

const annieUseYourTelescope = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Kshetra Retreat Resort",
  description: "Where Kerala's Spirit Meets Coastal Serenity",
  icons: {
    icon: "/images/Logos/logo_new.webp",
    shortcut: "/images/Logos/logo_new.webp",
    apple: "/images/Logos/logo_new.webp",
  },
};

import WhatsAppButton from "./components/ui/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${urbanist.variable} ${waterBrush.variable} ${annieUseYourTelescope.variable} antialiased bg-black text-white font-urbanist`}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
