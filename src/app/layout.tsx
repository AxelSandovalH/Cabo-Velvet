import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export const metadata: Metadata = {
  title: "Cabo Rico — Luxury Concierge Los Cabos",
  description:
    "Private yachts, villas, nightlife, and bespoke experiences in Los Cabos. The most exclusive concierge service in Baja.",
  keywords: [
    "cabo san lucas luxury",
    "los cabos concierge",
    "yacht rental cabo",
    "private villa cabo",
    "cabo nightlife vip",
    "luxury travel mexico",
  ],
  openGraph: {
    title: "Cabo Rico — Luxury Concierge Los Cabos",
    description: "Private yachts, villas, nightlife & bespoke experiences.",
    siteName: "Cabo Rico",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabo Rico — Luxury Concierge Los Cabos",
    description: "Private yachts, villas, nightlife & bespoke experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased bg-[#080808] text-[#F2EDE4] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
