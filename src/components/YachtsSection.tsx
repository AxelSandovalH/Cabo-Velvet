"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";

const yachts = [
  {
    id: "y1",
    name: "Yacht Charters",
    model: "120ft Benetti",
    specs: ["Sleeps 10", "Full Crew", "Open Bar"],
    price: "From $4,200 / day",
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd like to charter the 120ft Benetti yacht.",
  },
  {
    id: "y2",
    name: "Horizon 85",
    model: "85ft Horizon",
    specs: ["Sleeps 6", "Jet Ski", "Snorkel Kit"],
    price: "From $2,800 / day",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'm interested in chartering the Horizon 85.",
  },
  {
    id: "y3",
    name: "Sunset Cruiser",
    model: "60ft Azimut",
    specs: ["Sleeps 8", "Sunset Route", "Champagne"],
    price: "From $1,600 / day",
    image:
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd like to book the Sunset Cruiser yacht.",
  },
  {
    id: "y4",
    name: "Deep Blue",
    model: "48ft Catamaran",
    specs: ["Sleeps 12", "Fishing Gear", "Full Day"],
    price: "From $1,200 / day",
    image:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=900&q=85&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd like information on the Deep Blue catamaran.",
  },
];

export default function YachtsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="yachts" className="py-24 md:py-32 bg-[#060606]">
      {/* Thin top border */}
      <div className="border-t border-white/[0.04] mb-24 md:mb-32" />

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
              Yacht Fleet
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
            Yacht{" "}
            <span className="italic text-[#C4A45A]">Charters.</span>
          </motion.h2>
        </div>

        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to see the full yacht charter fleet.")}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[10px] tracking-[0.22em] text-[#4A4038] uppercase hover:text-[#C4A45A] transition-colors duration-300 self-start md:self-auto hover-line pb-1"
        >
          View full fleet →
        </motion.a>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-6 md:w-12 z-10 bg-gradient-to-r from-[#060606] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-l from-[#060606] to-transparent pointer-events-none" />

        <div
          className="flex gap-4 overflow-x-auto scrollbar-none px-6 md:px-12 lg:px-16 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {yachts.map((yacht, i) => (
            <YachtCard key={yacht.id} yacht={yacht} index={i} />
          ))}
          <div className="flex-shrink-0 w-4 md:w-10" />
        </div>
      </div>

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

function YachtCard({
  yacht,
  index,
}: {
  yacht: (typeof yachts)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(yacht.whatsappMsg)}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[78vw] md:w-[340px] lg:w-[380px] group cursor-pointer"
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="relative h-[50vw] md:h-[240px] overflow-hidden">
          <Image
            src={yacht.image}
            alt={yacht.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 80vw, 380px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/10 to-transparent" />

          {/* Price */}
          <div className="absolute bottom-4 left-4">
            <span className="text-[9px] tracking-[0.2em] text-[#C4A45A] uppercase">
              {yacht.price}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.05]">
          <p className="text-[8px] tracking-[0.35em] text-[#3A3028] uppercase mb-1.5">
            {yacht.model}
          </p>
          <h3
            className="font-display text-xl md:text-2xl font-light text-[#F2EDE4] mb-3 group-hover:text-[#C4A45A] transition-colors duration-300"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {yacht.name}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {yacht.specs.map((spec, i) => (
              <span
                key={spec}
                className="flex items-center gap-3 text-[#4A4038] text-[10px]"
              >
                {spec}
                {i < yacht.specs.length - 1 && (
                  <span className="text-[#2A2018]">·</span>
                )}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[#C4A45A] text-[9px] tracking-[0.22em] uppercase">
            <WhatsAppMini />
            <span>Charter Now</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

function WhatsAppMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
