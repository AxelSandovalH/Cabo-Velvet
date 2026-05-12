"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";
const WHATSAPP_MSG = encodeURIComponent(
  "Hi, I'd like to book a bespoke experience in Los Cabos."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

const experiences = [
  {
    id: "arch",
    label: "Iconic",
    title: "El Arco at Sunrise",
    description:
      "A private boat to Land's End before the crowds arrive. Just you, the arch, and the Pacific Ocean.",
    image:
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1200&q=85&auto=format&fit=crop",
    aspect: "portrait",
  },
  {
    id: "sunset",
    label: "Signature",
    title: "Sunset Yacht Cruise",
    description:
      "The gold hour on the Sea of Cortez. Chilled champagne, curated playlists, infinite horizon.",
    image:
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1200&q=85&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: "villa-dinner",
    label: "Exclusive",
    title: "Private Villa Dinner",
    description:
      "A personal chef, hand-set tablescape, and a view that makes every course unforgettable.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format&fit=crop",
    aspect: "landscape",
  },
  {
    id: "desert",
    label: "Adventure",
    title: "Desert & Stars",
    description:
      "ATV into Baja's wilderness at dusk. Gourmet dinner under a million stars. The rarest kind of evening.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&auto=format&fit=crop",
    aspect: "portrait",
  },
];

export default function ExperiencesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="experiences" className="py-24 md:py-36 bg-[#080808]">
      {/* Header */}
      <div
        ref={headerRef}
        className="px-6 md:px-10 max-w-7xl mx-auto mb-16 md:mb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-5 h-px bg-[#C4A45A]" />
          <span className="text-[10px] tracking-[0.35em] text-[#C4A45A] uppercase">
            Experiences
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-tight text-[#F2EDE4] max-w-xl"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Moments crafted{" "}
            <span className="italic text-[#C4A45A]">for memory</span>
          </motion.h2>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[10px] tracking-[0.2em] text-[#C4A45A] uppercase hover-line self-start md:self-auto pb-1"
          >
            Plan your trip →
          </motion.a>
        </div>
      </div>

      {/* Masonry-style grid */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <ExperienceCard experience={experiences[0]} index={0} tall />
            <ExperienceCard experience={experiences[1]} index={1} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <ExperienceCard experience={experiences[2]} index={2} />
            <ExperienceCard experience={experiences[3]} index={3} tall />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  experience,
  index,
  tall = false,
}: {
  experience: (typeof experiences)[0];
  index: number;
  tall?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm interested in the "${experience.title}" experience.`
  )}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: (index % 2) * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative overflow-hidden cursor-pointer ${
        tall ? "h-[500px] md:h-[600px]" : "h-[320px] md:h-[360px]"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {/* Image */}
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/20 to-transparent transition-opacity duration-300" />

        {/* Label badge */}
        <div className="absolute top-5 left-5">
          <span className="text-[8px] tracking-[0.35em] text-[#C4A45A] uppercase border border-[#C4A45A]/30 px-3 py-1.5 backdrop-blur-sm bg-[#080808]/40">
            {experience.label}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3
            className="font-display text-2xl md:text-3xl font-light text-[#F2EDE4] mb-2 group-hover:text-[#C4A45A] transition-colors duration-300"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {experience.title}
          </h3>
          <p className="text-[#7A7060] text-xs leading-relaxed font-light max-w-xs mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            {experience.description}
          </p>

          <div className="flex items-center gap-2 text-[#C4A45A] text-[10px] tracking-[0.2em] uppercase">
            <span>Book via WhatsApp</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
