"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi, I'd like to book a luxury experience in Los Cabos."
)}`;

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[700px] overflow-hidden">
      {/* Image — slight Ken Burns scale on scroll */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: imgScale }}>
        <Image
          src="https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1920&q=92&auto=format&fit=crop"
          alt="Los Cabos"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Cinematic atmosphere layers */}
      {/* Deep top gradient — for logo legibility */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050505]/75 via-transparent to-transparent" />
      {/* Bottom vignette — pulls eye to headline */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />
      {/* Left edge — editorial asymmetry */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#060606]/40 via-transparent to-transparent" />
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 h-full flex flex-col justify-between px-6 md:px-14 lg:px-20 pt-8 pb-10 md:pb-14"
      >
        {/* Logo — top left, stacked, large */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="self-start pt-2"
        >
          <h1
            className="font-display font-light text-[#F2EDE4] tracking-[0.04em] leading-[0.85]"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3.2rem, 11vw, 7.5rem)",
            }}
          >
            CABO
            <br />
            VELVET
          </h1>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="w-7 h-px bg-[#C4A45A]" />
            <span className="text-[8.5px] tracking-[0.45em] text-[#C4A45A] uppercase font-medium">
              Los Cabos · México
            </span>
          </div>
        </motion.div>

        {/* Bottom content — minimal, punchy */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Tagline — single powerful line */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg"
          >
            <p
              className="font-display font-light italic text-[#F2EDE4] leading-[1.05]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.9rem, 5.5vw, 3.8rem)",
              }}
            >
              Your Private Peninsula.
            </p>
            <p className="mt-4 text-[#8A8070] text-[11px] tracking-[0.18em] uppercase font-light">
              Yachts · Villas · Nightlife · Concierge
            </p>
          </motion.div>

          {/* Single CTA — gold, no second button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#C4A45A] text-[#060606] text-[10px] tracking-[0.3em] uppercase font-semibold overflow-hidden"
            >
              {/* Hover shimmer */}
              <span className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 skew-x-12" />
              <WhatsAppIcon />
              <span className="relative">Begin Your Experience</span>
              <ArrowIcon />
            </a>

            {/* Trust micro-copy */}
            <p className="text-[8.5px] tracking-[0.22em] text-[#3A3028] uppercase">
              Instant response · No booking fees
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-[3] bg-gradient-to-t from-[#060606] to-transparent" />
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:translate-x-1">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
