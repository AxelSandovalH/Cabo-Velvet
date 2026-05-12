"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const villas = [
  {
    id: "solano",
    slug: "villa-solano",
    name: "VILLA SOLANO",
    tagline: "Ultra-Private Oceanfront",
    location: "El Pedregal · 5 BR",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90&auto=format&fit=crop",
    msg: "Hi, I'd like to inquire about Villa Solano — the ultra-private oceanfront villa.",
  },
  {
    id: "obsidian",
    slug: "villa-obsidian",
    name: "VILLA OBSIDIAN",
    tagline: "Cliffside Panorama",
    location: "Pedregal Cliffs · 7 BR",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=90&auto=format&fit=crop",
    msg: "",
  },
  {
    id: "petra",
    slug: "casa-petra",
    name: "CASA PETRA",
    tagline: "Private Beach Access",
    location: "Cabo San Lucas · 4 BR",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=90&auto=format&fit=crop",
    msg: "",
  },
  {
    id: "aurora",
    slug: "villa-aurora",
    name: "VILLA AURORA",
    tagline: "Three Pools · Sunset Views",
    location: "Hillside Reserve · 6 BR",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=90&auto=format&fit=crop",
    msg: "",
  },
];

export default function VillasSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="villas" className="pt-24 md:pt-32 pb-0 bg-[#060606]">
      {/* Section label + heading */}
      <div
        ref={headerRef}
        className="px-6 md:px-14 lg:px-20 mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-5 h-px bg-[#C4A45A]" />
            <span className="text-[9px] tracking-[0.4em] text-[#C4A45A] uppercase">
              Private Villas
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light text-[#F2EDE4] leading-[0.92]"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            }}
          >
            Curated
            <br />
            <span className="italic text-[#C4A45A]">Collections.</span>
          </motion.h2>
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          href="https://wa.me/526241234567?text=Hi%2C%20I'd%20like%20to%20see%20all%20available%20villas%20in%20Los%20Cabos."
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-[9px] tracking-[0.28em] text-[#3A3028] uppercase hover:text-[#C4A45A] transition-colors duration-300 hover-line pb-0.5"
        >
          All properties →
        </motion.a>
      </div>

      {/* Full-bleed horizontal scroll — cards peek from right */}
      <div className="relative">
        {/* Right fade — peek effect */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-[#060606] to-transparent pointer-events-none" />

        <div
          className="flex gap-3 md:gap-4 overflow-x-auto pb-10 md:pb-12 px-6 md:px-14 lg:px-20"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {villas.map((v, i) => (
            <VillaCard key={v.id} villa={v} index={i} />
          ))}
          <div className="flex-shrink-0 w-2 md:w-8" />
        </div>
      </div>

      {/* Swipe label — mobile only */}
      <div className="flex items-center justify-center gap-3 pb-8 md:hidden">
        <div className="w-10 h-px bg-[#C4A45A]/30" />
        <span className="text-[8px] tracking-[0.35em] text-[#2A2018] uppercase">Swipe</span>
        <div className="w-10 h-px bg-[#C4A45A]/30" />
      </div>
    </section>
  );
}

function VillaCard({ villa, index }: { villa: (typeof villas)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[82vw] md:w-[380px] lg:w-[420px] group"
    >
      <Link href={`/villas/${villa.slug}`} className="block">
        {/* Full-bleed image card */}
        <div className="relative overflow-hidden"
          style={{ height: "clamp(320px, 70vw, 520px)" }}
        >
          <Image
            src={villa.image}
            alt={villa.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 85vw, 420px"
          />

          {/* Soft gradient — not harsh, editorial */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/95 via-[#060606]/20 to-transparent" />

          {/* Location micro-label — top */}
          <div className="absolute top-5 left-5">
            <span className="text-[8px] tracking-[0.35em] text-[#C4A45A]/70 uppercase">
              {villa.location}
            </span>
          </div>

          {/* Title block — bottom, editorial large type */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
            <p
              className="font-display text-[#F2EDE4] font-light leading-[0.95] mb-1.5 transition-colors duration-300 group-hover:text-[#C4A45A]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                letterSpacing: "0.04em",
              }}
            >
              {villa.name}
            </p>
            <p className="text-[#7A7060] text-[10px] tracking-[0.2em] uppercase font-light">
              {villa.tagline}
            </p>
          </div>

          {/* WhatsApp hover overlay */}
          <div className="absolute inset-0 bg-[#C4A45A]/0 group-hover:bg-[#C4A45A]/5 transition-colors duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}
