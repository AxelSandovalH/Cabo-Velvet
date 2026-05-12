"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";

const experiences = [
  {
    id: "sailing",
    label: "Signature",
    title: "Sunset Sailing",
    subtitle: "El Arco · Sea of Cortez",
    description:
      "A private vessel to Land's End as the sky turns gold. Chilled champagne, curated playlist, infinite Pacific horizon. The defining Cabo moment.",
    image:
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1400&q=90&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd like to book a private sunset sailing experience.",
    align: "left",
  },
  {
    id: "dining",
    label: "Exclusive",
    title: "Beachside Dining",
    subtitle: "Private Beach · Sunset Hour",
    description:
      "A candlelit table set directly on the sand. Personal chef, sommelier, and a tablescape styled just for you. The most romantic dinner in Los Cabos.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90&auto=format&fit=crop",
    whatsappMsg: "Hi, I want to book a private beachside dinner in Los Cabos.",
    align: "right",
  },
  {
    id: "desert",
    label: "Adventure",
    title: "Desert & Stars",
    subtitle: "Baja Wilderness · Dusk",
    description:
      "ATV deep into the Baja desert at dusk. A gourmet dinner appears under a million stars. The most unexpected luxury in Mexico.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=90&auto=format&fit=crop",
    whatsappMsg: "Hi, I'd love to book the Desert & Stars experience.",
    align: "left",
  },
];

export default function ExperiencesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="experiences" className="bg-[#080808]">
      {/* Section header */}
      <div className="border-t border-white/[0.04]" />
      <div
        ref={headerRef}
        className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto pt-24 md:pt-32 pb-16 md:pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-5 h-px bg-[#C4A45A]" />
          <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">
            Curated Experiences
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="font-display font-light leading-tight text-[#F2EDE4] max-w-xl"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
          }}
        >
          Moments crafted{" "}
          <span className="italic text-[#C4A45A]">for memory.</span>
        </motion.h2>
      </div>

      {/* Alternating full-bleed experience panels */}
      {experiences.map((exp) => (
        <ExperiencePanel key={exp.id} exp={exp} />
      ))}
    </section>
  );
}

function ExperiencePanel({ exp }: { exp: (typeof experiences)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(exp.whatsappMsg)}`;
  const isRight = exp.align === "right";

  return (
    <div ref={ref} className="relative h-[80vh] min-h-[500px] md:h-[90vh] overflow-hidden">
      {/* Full-bleed image */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <Image
          src={exp.image}
          alt={exp.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark overlay — heavier on content side */}
      <div
        className={`absolute inset-0 ${
          isRight
            ? "bg-gradient-to-l from-[#080808]/95 via-[#080808]/50 to-[#080808]/10"
            : "bg-gradient-to-r from-[#080808]/95 via-[#080808]/50 to-[#080808]/10"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-[#080808]/30" />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, x: isRight ? 24 : -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-sm md:max-w-md ${isRight ? "ml-auto text-right" : ""}`}
          >
            {/* Label */}
            <div className={`flex items-center gap-2 mb-4 ${isRight ? "justify-end" : ""}`}>
              <div className={`h-px w-5 bg-[#C4A45A] ${isRight ? "order-last" : ""}`} />
              <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">
                {exp.label}
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-[9px] tracking-[0.3em] text-[#4A4038] uppercase mb-2">
              {exp.subtitle}
            </p>

            {/* Title */}
            <h3
              className="font-display font-light text-[#F2EDE4] leading-tight mb-4"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              {exp.title}
            </h3>

            {/* Description */}
            <p className="text-[#7A7060] text-sm leading-relaxed font-light mb-6">
              {exp.description}
            </p>

            {/* CTA */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2.5 px-6 py-3 border border-[#C4A45A]/30 text-[#C4A45A] text-[10px] tracking-[0.22em] uppercase hover:bg-[#C4A45A] hover:text-[#080808] transition-all duration-300 ${isRight ? "ml-auto" : ""}`}
            >
              <WhatsAppIcon />
              Book This Experience
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
