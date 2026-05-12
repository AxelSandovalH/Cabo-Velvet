"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";

const villas = [
  {
    id: "sapphire",
    name: "The Sapphire Suite",
    tagline: "Beachfront · El Pedregal",
    specs: ["5 Bedrooms", "Infinity Pool", "Private Chef"],
    price: "From $5,500 / night",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'm interested in The Sapphire Suite villa.",
  },
  {
    id: "obsidian",
    name: "Villa Obsidian",
    tagline: "Panoramic · Pedregal Cliffs",
    specs: ["7 Bedrooms", "Rooftop Terrace", "Home Theater"],
    price: "From $8,200 / night",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd like to inquire about Villa Obsidian.",
  },
  {
    id: "petra",
    name: "Casa Petra",
    tagline: "Oceanfront · Cabo San Lucas",
    specs: ["4 Bedrooms", "Private Beach", "Spa Suite"],
    price: "From $3,800 / night",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd like to book Casa Petra.",
  },
  {
    id: "aurora",
    name: "Villa Aurora",
    tagline: "Hillside · Sunset Views",
    specs: ["6 Bedrooms", "3 Pools", "Wine Cellar"],
    price: "From $6,900 / night",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I want to inquire about Villa Aurora.",
  },
];

export default function VillasSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="villas" className="py-24 md:py-32 bg-[#080808]">
      {/* Header */}
      <div
        ref={headerRef}
        className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-5 h-px bg-[#C4A45A]" />
            <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">
              Private Villas
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="font-display font-light leading-tight text-[#F2EDE4]"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            }}
          >
            Private{" "}
            <span className="italic text-[#C4A45A]">Sanctuaries.</span>
          </motion.h2>
        </div>

        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to see all available villas in Los Cabos.")}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[10px] tracking-[0.22em] text-[#4A4038] uppercase hover:text-[#C4A45A] transition-colors duration-300 self-start md:self-auto hover-line pb-1"
        >
          View all properties →
        </motion.a>
      </div>

      {/* Horizontal scroll carousel — peeking on mobile */}
      <div className="relative">
        {/* Left/right fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-6 md:w-12 z-10 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none" />

        <div
          className="flex gap-4 overflow-x-auto scrollbar-none px-6 md:px-12 lg:px-16 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {villas.map((villa, i) => (
            <VillaCard key={villa.id} villa={villa} index={i} />
          ))}
          {/* End spacer */}
          <div className="flex-shrink-0 w-4 md:w-10" />
        </div>
      </div>

      {/* Swipe hint — mobile only */}
      <div className="flex items-center justify-center gap-2 mt-6 md:hidden">
        <div className="w-12 h-px bg-[#C4A45A]/40" />
        <span className="text-[9px] tracking-[0.3em] text-[#3A3028] uppercase">
          Swipe to explore
        </span>
        <div className="w-12 h-px bg-[#C4A45A]/40" />
      </div>
    </section>
  );
}

function VillaCard({
  villa,
  index,
}: {
  villa: (typeof villas)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(villa.whatsappMsg)}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[78vw] md:w-[360px] lg:w-[400px] group cursor-pointer"
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {/* Image */}
        <div className="relative h-[52vw] md:h-[260px] lg:h-[280px] overflow-hidden rounded-none">
          <Image
            src={villa.image}
            alt={villa.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 80vw, 400px"
          />
          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/15 to-transparent" />

          {/* Price badge — top right */}
          <div className="absolute top-4 right-4 bg-[#080808]/80 backdrop-blur-sm px-3 py-1.5 border border-[#C4A45A]/20">
            <span className="text-[9px] tracking-[0.2em] text-[#C4A45A] uppercase">
              {villa.price}
            </span>
          </div>
        </div>

        {/* Info below image */}
        <div className="pt-4 border-t border-white/[0.05]">
          <p className="text-[8px] tracking-[0.35em] text-[#3A3028] uppercase mb-1.5">
            {villa.tagline}
          </p>
          <h3
            className="font-display text-xl md:text-2xl font-light text-[#F2EDE4] mb-3 group-hover:text-[#C4A45A] transition-colors duration-300"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {villa.name}
          </h3>

          {/* Specs row */}
          <div className="flex items-center gap-3 flex-wrap">
            {villa.specs.map((spec, i) => (
              <span
                key={spec}
                className="flex items-center gap-3 text-[#4A4038] text-[10px] tracking-wide"
              >
                {spec}
                {i < villa.specs.length - 1 && (
                  <span className="text-[#2A2018]">·</span>
                )}
              </span>
            ))}
          </div>

          {/* Inquire CTA */}
          <div className="mt-4 flex items-center gap-1.5 text-[#C4A45A] text-[9px] tracking-[0.22em] uppercase group-hover:gap-2.5 transition-all duration-300">
            <WhatsAppIcon />
            <span>Inquire on WhatsApp</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
