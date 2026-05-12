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

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[680px] overflow-hidden"
    >
      {/* Full-bleed background image */}
      <motion.div className="absolute inset-0 z-0 scale-[1.08]" style={{ y: imgY }}>
        <Image
          src="https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1920&q=90&auto=format&fit=crop"
          alt="Los Cabos"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Layered overlays for cinematic depth */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#080808]/60 via-[#080808]/10 to-[#080808]" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#080808]/50 via-transparent to-transparent" />
      {/* Subtle top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 z-[1] bg-gradient-to-b from-[#080808]/80 to-transparent" />

      {/* Hero content — left-aligned, editorial */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-16 pt-32 pb-12 md:pb-16 max-w-7xl mx-auto w-full"
      >
        {/* Stacked logo — top left */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="self-start"
        >
          <p
            className="font-display font-light leading-[0.88] tracking-[0.06em] text-[#F2EDE4]"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.8rem, 9vw, 6rem)",
            }}
          >
            CABO
            <br />
            VELVET
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-8 h-px bg-[#C4A45A]" />
            <span className="text-[9px] tracking-[0.4em] text-[#C4A45A] uppercase">
              Los Cabos · Private Concierge
            </span>
          </div>
        </motion.div>

        {/* Bottom content — headline + CTA */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Editorial headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display font-light leading-[1.0] text-[#F2EDE4] max-w-md"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
              }}
            >
              Your Private
              <br />
              <span className="italic text-[#C4A45A]">Peninsula.</span>
            </h1>
            <p className="mt-4 text-[#9A9080] text-sm font-light tracking-wide max-w-xs leading-relaxed">
              Yachts. Villas. Nightlife. Adventures.
              <br />
              All of Cabo — exclusively yours.
            </p>
          </motion.div>

          {/* CTA stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 md:items-end"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#C4A45A] text-[#080808] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[#D4B468] transition-colors duration-300 whitespace-nowrap"
            >
              <WhatsAppIcon />
              Book Your Experience
            </a>
            <a
              href="#explore"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/[0.14] text-[#F2EDE4] text-[10px] tracking-[0.25em] uppercase font-light hover:border-[#C4A45A]/50 transition-colors duration-300 whitespace-nowrap"
            >
              Explore Services
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#C4A45A]/60 to-[#C4A45A]" />
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
            <path d="M1 1l3 3 3-3" stroke="#C4A45A" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
