"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";

const yachts = [
  {
    id: "benetti",
    name: "VELVET YACHTS",
    tagline: "Unparalleled Charters",
    detail: "120ft Benetti · 10 guests",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=900&q=90&auto=format&fit=crop",
    msg: "Hi, I'd like to charter the 120ft Benetti superyacht.",
  },
  {
    id: "horizon",
    name: "HORIZON 85",
    tagline: "Sunset · Sea of Cortez",
    detail: "85ft Horizon · 8 guests",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=900&q=90&auto=format&fit=crop",
    msg: "Hi, I'm interested in chartering the Horizon 85.",
  },
  {
    id: "azimut",
    name: "AZURE 60",
    tagline: "Day Charter · Open Bar",
    detail: "60ft Azimut · 12 guests",
    image: "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=900&q=90&auto=format&fit=crop",
    msg: "Hi, I'd like to book the Azure 60 for a day charter.",
  },
  {
    id: "cat",
    name: "DEEP BLUE",
    tagline: "Catamaran · Full Day",
    detail: "48ft Leopard · 14 guests",
    image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=900&q=90&auto=format&fit=crop",
    msg: "Hi, I'd like info on the Deep Blue catamaran.",
  },
];

export default function YachtsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="yachts" className="pt-24 md:pt-32 pb-0 bg-[#080808]">
      <div className="border-t border-white/[0.04]" />
      <div className="pt-24 md:pt-32">
        {/* Header */}
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
                Yacht Fleet
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
              Velvet
              <br />
              <span className="italic text-[#C4A45A]">Yachts.</span>
            </motion.h2>
          </div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to see the full yacht charter fleet in Los Cabos.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-[9px] tracking-[0.28em] text-[#3A3028] uppercase hover:text-[#C4A45A] transition-colors duration-300 hover-line pb-0.5"
          >
            Full fleet →
          </motion.a>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none" />
          <div
            className="flex gap-3 md:gap-4 overflow-x-auto pb-10 md:pb-12 px-6 md:px-14 lg:px-20"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {yachts.map((y, i) => (
              <YachtCard key={y.id} yacht={y} index={i} />
            ))}
            <div className="flex-shrink-0 w-2 md:w-8" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pb-8 md:hidden">
          <div className="w-10 h-px bg-[#C4A45A]/30" />
          <span className="text-[8px] tracking-[0.35em] text-[#2A2018] uppercase">Swipe</span>
          <div className="w-10 h-px bg-[#C4A45A]/30" />
        </div>
      </div>
    </section>
  );
}

function YachtCard({ yacht, index }: { yacht: (typeof yachts)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(yacht.msg)}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[82vw] md:w-[360px] lg:w-[400px] group"
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div
          className="relative overflow-hidden"
          style={{ height: "clamp(280px, 60vw, 460px)" }}
        >
          <Image
            src={yacht.image}
            alt={yacht.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 85vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/15 to-transparent" />

          {/* Detail — top */}
          <div className="absolute top-5 left-5">
            <span className="text-[8px] tracking-[0.35em] text-[#C4A45A]/60 uppercase">
              {yacht.detail}
            </span>
          </div>

          {/* Title block — bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
            <p
              className="font-display text-[#F2EDE4] font-light leading-[0.95] mb-1.5 transition-colors duration-300 group-hover:text-[#C4A45A]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.4rem, 4.5vw, 2rem)",
                letterSpacing: "0.04em",
              }}
            >
              {yacht.name}
            </p>
            <p className="text-[#7A7060] text-[10px] tracking-[0.2em] uppercase font-light">
              {yacht.tagline}
            </p>
          </div>

          <div className="absolute inset-0 bg-[#C4A45A]/0 group-hover:bg-[#C4A45A]/5 transition-colors duration-500" />
        </div>
      </a>
    </motion.div>
  );
}
