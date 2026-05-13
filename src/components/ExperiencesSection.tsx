"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DBListing } from "@/lib/listings";

const STATIC = [
  { id: "sailing", href: "/experiences/sunset-sailing", label: "Signature", title: "Sunset Sailing", subtitle: "El Arco · Sea of Cortez", description: "A private vessel to Land's End as the sky turns gold. Chilled champagne, curated playlist, infinite Pacific horizon. The defining Cabo moment.", image: "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1400&q=90&auto=format&fit=crop", align: "left" },
  { id: "dining", href: "/experiences/beachside-dining", label: "Exclusive", title: "Beachside Dining", subtitle: "Private Beach · Sunset Hour", description: "A candlelit table set directly on the sand. Personal chef, sommelier, and a tablescape styled just for you. The most romantic dinner in Los Cabos.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90&auto=format&fit=crop", align: "right" },
  { id: "desert", href: "/experiences/desert-and-stars", label: "Adventure", title: "Desert & Stars", subtitle: "Baja Wilderness · Dusk", description: "ATV deep into the Baja desert at dusk. A gourmet dinner appears under a million stars. The most unexpected luxury in Mexico.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=90&auto=format&fit=crop", align: "left" },
];

type Panel = { id: string; href: string; label: string; title: string; subtitle: string; description: string; image: string; align: string }

function fromDB(listings: DBListing[]): Panel[] {
  return listings.map((l, i) => ({
    id: l.id,
    href: `/listing/${l.id}`,
    label: l.details?.label ?? 'Exclusive',
    title: l.name,
    subtitle: l.location ?? l.tagline ?? '',
    description: l.description ?? '',
    image: l.images?.[0] ?? 'https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1400&q=90&auto=format&fit=crop',
    align: i % 2 === 0 ? 'left' : 'right',
  }))
}

export default function ExperiencesSection({ listings }: { listings?: DBListing[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });
  const panels = listings?.length ? fromDB(listings) : STATIC;

  return (
    <section id="experiences" className="bg-[#080808]">
      <div className="border-t border-white/[0.04]" />
      <div ref={headerRef} className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto pt-24 md:pt-32 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-5 h-px bg-[#C4A45A]" />
          <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">Curated Experiences</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="font-display font-light leading-tight text-[#F2EDE4] max-w-xl"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
        >
          Moments crafted <span className="italic text-[#C4A45A]">for memory.</span>
        </motion.h2>
      </div>

      {panels.map((panel) => (
        <ExperiencePanel key={panel.id} panel={panel} />
      ))}
    </section>
  );
}

function ExperiencePanel({ panel }: { panel: Panel }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const isRight = panel.align === "right";

  return (
    <div ref={ref} className="relative h-[80vh] min-h-[500px] md:h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <Image src={panel.image} alt={panel.title} fill className="object-cover" sizes="100vw" />
      </motion.div>
      <div className={`absolute inset-0 ${isRight ? "bg-gradient-to-l from-[#080808]/95 via-[#080808]/50 to-[#080808]/10" : "bg-gradient-to-r from-[#080808]/95 via-[#080808]/50 to-[#080808]/10"}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-[#080808]/30" />
      <div className="relative h-full flex items-end">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, x: isRight ? 24 : -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-sm md:max-w-md ${isRight ? "ml-auto text-right" : ""}`}
          >
            <div className={`flex items-center gap-2 mb-4 ${isRight ? "justify-end" : ""}`}>
              <div className={`h-px w-5 bg-[#C4A45A] ${isRight ? "order-last" : ""}`} />
              <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">{panel.label}</span>
            </div>
            <p className="text-[9px] tracking-[0.3em] text-[#4A4038] uppercase mb-2">{panel.subtitle}</p>
            <h3 className="font-display font-light text-[#F2EDE4] leading-tight mb-4" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {panel.title}
            </h3>
            <p className="text-[#7A7060] text-sm leading-relaxed font-light mb-6 line-clamp-3">{panel.description}</p>
            <Link
              href={panel.href}
              className={`inline-flex items-center gap-2.5 px-6 py-3 border border-[#C4A45A]/30 text-[#C4A45A] text-[10px] tracking-[0.22em] uppercase hover:bg-[#C4A45A] hover:text-[#080808] transition-all duration-300 ${isRight ? "ml-auto" : ""}`}
            >
              View Experience →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
