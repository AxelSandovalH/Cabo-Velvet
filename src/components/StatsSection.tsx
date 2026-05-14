"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const pillars = [
  { label: "Respuesta inmediata", sub: "WhatsApp · 24 / 7" },
  { label: "Sin comisiones ocultas", sub: "Precio transparente" },
  { label: "100% privado", sub: "Experiencia exclusiva" },
  { label: "Los Cabos expertos", sub: "Locales de confianza" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-20 border-y border-white/[0.04] bg-[#0A0A0A]">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {pillars.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center md:text-left"
          >
            <p
              className="font-display text-2xl md:text-3xl font-light text-[#F2EDE4] mb-1 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {p.label}
            </p>
            <p className="text-[10px] tracking-[0.2em] text-[#4A4038] uppercase">
              {p.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
