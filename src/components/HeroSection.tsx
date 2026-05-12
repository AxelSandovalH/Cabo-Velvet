"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";
const WHATSAPP_MSG = encodeURIComponent(
  "Hi, I'd like to book a luxury experience in Los Cabos."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[700px] flex items-end overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85&auto=format&fit=crop"
          alt="Los Cabos luxury yacht"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/30 via-transparent to-[#080808]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/40 via-transparent to-transparent" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-28"
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-6 h-px bg-[#C4A45A]" />
          <span className="text-[10px] tracking-[0.35em] text-[#C4A45A] uppercase font-medium">
            Los Cabos · Private Concierge
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light leading-[0.9] mb-6 max-w-3xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          <span className="block text-[clamp(3.5rem,10vw,7.5rem)] text-[#F2EDE4] tracking-tight">
            Los Cabos.
          </span>
          <span className="block text-[clamp(3.5rem,10vw,7.5rem)] text-[#C4A45A] italic tracking-tight">
            Elevated.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#9A9080] text-sm md:text-base tracking-wide leading-relaxed max-w-sm mb-10 font-light"
        >
          Private yachts. Exclusive villas. Nightlife access.
          <br />
          Crafted for those who expect the extraordinary.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C4A45A] text-[#080808] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[#D4B468] transition-all duration-300"
          >
            <WhatsAppIcon />
            Book Your Experience
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/[0.12] text-[#F2EDE4] text-[11px] tracking-[0.25em] uppercase font-light hover:border-[#C4A45A]/40 hover:text-[#C4A45A] transition-all duration-300"
          >
            Explore Services
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 right-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] text-[#4A4038] uppercase rotate-90 origin-center mb-4">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#C4A45A] to-transparent"
        />
      </motion.div>

      {/* Bottom edge fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-10" />
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
