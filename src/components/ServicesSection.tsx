"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DBListing } from "@/lib/listings";

const STATIC = [
  { id: "nightlife", href: "/services/nightlife", label: "VIP ACCESS", title: "Nightlife", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85&auto=format&fit=crop", size: "large" as const },
  { id: "transport", href: "/services/transport", label: "24 / 7 FLEET", title: "Transport", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop", size: "small" as const },
  { id: "atv", href: "/services/adventures", label: "BAJA DESERT", title: "Adventures", image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=85&auto=format&fit=crop", size: "small" as const },
  { id: "concierge", href: "/services/concierge", label: "FULLY BESPOKE", title: "Concierge", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85&auto=format&fit=crop", size: "large" as const },
];

type Card = { id: string; href: string; label: string; title: string; image: string; size: 'large' | 'small' }

const SIZES: ('large' | 'small')[] = ['large', 'small', 'small', 'large']

function fromDB(listings: DBListing[]): Card[] {
  return listings.slice(0, 4).map((l, i) => ({
    id: l.id,
    href: `/listing/${l.id}`,
    label: l.details?.label ?? l.tagline ?? 'Service',
    title: l.name,
    image: l.images?.[0] ?? 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85&auto=format&fit=crop',
    size: SIZES[i] ?? 'small',
  }))
}

export default function ServicesSection({ listings }: { listings?: DBListing[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });
  const cards = listings?.length ? fromDB(listings) : STATIC;

  const large = cards.filter((s) => s.size === "large");
  const small = cards.filter((s) => s.size === "small");

  return (
    <section id="services" className="pt-24 md:pt-32 pb-24 md:pb-32 bg-[#060606]">
      <div className="border-t border-white/[0.04]" />
      <div className="pt-24 md:pt-32 px-6 md:px-14 lg:px-20">
        <div ref={headerRef} className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-5 h-px bg-[#C4A45A]" />
              <span className="text-[9px] tracking-[0.4em] text-[#C4A45A] uppercase">More Services</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-light text-[#F2EDE4] leading-[0.92]"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
            >
              Everything<br /><span className="italic text-[#C4A45A]">arranged.</span>
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            href="https://wa.me/526241234567?text=Hi%2C%20I'd%20like%20to%20plan%20my%20full%20Cabo%20Velvet%20experience."
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-[9px] tracking-[0.28em] text-[#3A3028] uppercase hover:text-[#C4A45A] transition-colors duration-300 hover-line pb-0.5"
          >
            Plan everything →
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {large[0] && <ServiceCard card={large[0]} index={0} className="md:col-span-7" tall />}
          {(small[0] || small[1]) && (
            <div className="md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
              {small[0] && <ServiceCard card={small[0]} index={1} />}
              {small[1] && <ServiceCard card={small[1]} index={2} />}
            </div>
          )}
          {large[1] && <ServiceCard card={large[1]} index={3} className="md:col-span-7 md:col-start-6" tall />}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ card, index, className = "", tall = false }: { card: Card; index: number; className?: string; tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden ${className}`}
      style={{ height: tall ? "clamp(300px, 55vw, 480px)" : "clamp(180px, 30vw, 230px)" }}
    >
      <Link href={card.href} className="block h-full">
        <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" sizes="(max-width: 768px) 100vw, 60vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/90 via-[#060606]/30 to-[#060606]/10" />
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-7 pb-5 md:pb-7">
          <p className="text-[8px] tracking-[0.4em] text-[#C4A45A]/70 uppercase mb-1.5">{card.label}</p>
          <h3 className="font-display text-[#F2EDE4] font-light leading-none group-hover:text-[#C4A45A] transition-colors duration-300" style={{ fontFamily: "var(--font-cormorant)", fontSize: tall ? "clamp(1.6rem, 4vw, 2.4rem)" : "clamp(1.3rem, 3vw, 1.8rem)", letterSpacing: "0.03em" }}>
            {card.title}
          </h3>
        </div>
        <div className="absolute inset-0 bg-[#C4A45A]/0 group-hover:bg-[#C4A45A]/6 transition-colors duration-500" />
      </Link>
    </motion.div>
  );
}
