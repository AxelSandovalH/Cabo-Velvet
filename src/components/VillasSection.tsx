"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DBListing } from "@/lib/listings";

type Card = { id: string; href: string; name: string; tagline: string; location: string; image: string }

function fromDB(listings: DBListing[]): Card[] {
  return listings.map((l) => ({
    id: l.id,
    href: `/listing/${l.id}`,
    name: l.name.toUpperCase(),
    tagline: l.tagline ?? '',
    location: l.location ?? '',
    image: l.images?.[0] ?? 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=90&auto=format&fit=crop',
  }))
}

const WA_VILLAS = `https://wa.me/523141222146?text=${encodeURIComponent("Hi, I'd like to see available villas in Los Cabos.")}`

export default function VillasSection({ listings }: { listings?: DBListing[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });
  const cards = listings?.length ? fromDB(listings) : [];

  return (
    <section id="villas" className="pt-24 md:pt-32 pb-0 bg-[#060606]">
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
            <span className="text-[9px] tracking-[0.4em] text-[#C4A45A] uppercase">Private Villas</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light text-[#F2EDE4] leading-[0.92]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            Curated<br /><span className="italic text-[#C4A45A]">Collections.</span>
          </motion.h2>
        </div>
        <motion.a
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          href={WA_VILLAS}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-[9px] tracking-[0.28em] text-[#3A3028] uppercase hover:text-[#C4A45A] transition-colors duration-300 pb-0.5"
        >
          Consultar disponibilidad →
        </motion.a>
      </div>

      {cards.length > 0 ? (
        <>
          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-[#060606] to-transparent pointer-events-none" />
            <div
              className="flex gap-3 md:gap-4 overflow-x-auto pb-10 md:pb-12 px-6 md:px-14 lg:px-20"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            >
              {cards.map((c, i) => (
                <VillaCard key={c.id} card={c} index={i} />
              ))}
              <div className="flex-shrink-0 w-2 md:w-8" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 pb-8 md:hidden">
            <div className="w-10 h-px bg-[#C4A45A]/30" />
            <span className="text-[8px] tracking-[0.35em] text-[#2A2018] uppercase">Swipe</span>
            <div className="w-10 h-px bg-[#C4A45A]/30" />
          </div>
        </>
      ) : (
        <ComingSoon waUrl={WA_VILLAS} label="villas" />
      )}
    </section>
  );
}

function VillaCard({ card, index }: { card: Card; index: number }) {
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
      <Link href={card.href} className="block">
        <div className="relative overflow-hidden" style={{ height: "clamp(320px, 70vw, 520px)" }}>
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 85vw, 420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/95 via-[#060606]/20 to-transparent" />
          <div className="absolute top-5 left-5">
            <span className="text-[8px] tracking-[0.35em] text-[#C4A45A]/70 uppercase">{card.location}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
            <p
              className="font-display text-[#F2EDE4] font-light leading-[0.95] mb-1.5 transition-colors duration-300 group-hover:text-[#C4A45A]"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 5vw, 2.2rem)", letterSpacing: "0.04em" }}
            >
              {card.name}
            </p>
            <p className="text-[#7A7060] text-[10px] tracking-[0.2em] uppercase font-light">{card.tagline}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ComingSoon({ waUrl, label }: { waUrl: string; label: string }) {
  return (
    <div className="px-6 md:px-14 lg:px-20 pb-20 md:pb-28">
      <div className="border border-white/[0.06] py-16 flex flex-col items-center gap-5 text-center">
        <span className="text-[9px] tracking-[0.35em] text-[#3A3028] uppercase">Próximamente</span>
        <p className="font-display font-light text-[#4A4038] text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>
          Catálogo de {label} en camino
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 px-7 py-3 border border-[#C4A45A]/30 text-[#C4A45A] text-[10px] tracking-[0.22em] uppercase hover:bg-[#C4A45A] hover:text-[#080808] transition-all duration-300"
        >
          Consultar por WhatsApp →
        </a>
      </div>
    </div>
  );
}
