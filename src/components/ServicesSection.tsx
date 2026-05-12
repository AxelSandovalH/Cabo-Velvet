"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";

const services = [
  {
    id: "nightlife",
    label: "VIP ACCESS",
    title: "Nightlife",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85&auto=format&fit=crop",
    msg: "Hi, I need VIP nightlife access in Los Cabos.",
    size: "large",
  },
  {
    id: "transport",
    label: "24 / 7 FLEET",
    title: "Transport",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&auto=format&fit=crop",
    msg: "Hi, I need luxury ground transportation in Los Cabos.",
    size: "small",
  },
  {
    id: "atv",
    label: "BAJA DESERT",
    title: "Adventures",
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=85&auto=format&fit=crop",
    msg: "Hi, I'm interested in ATV and adventure experiences in Los Cabos.",
    size: "small",
  },
  {
    id: "concierge",
    label: "FULLY BESPOKE",
    title: "Concierge",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85&auto=format&fit=crop",
    msg: "Hi, I have a special request for a bespoke concierge experience in Los Cabos.",
    size: "large",
  },
];

export default function ServicesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  const large = services.filter((s) => s.size === "large");
  const small = services.filter((s) => s.size === "small");

  return (
    <section id="services" className="pt-24 md:pt-32 pb-24 md:pb-32 bg-[#060606]">
      <div className="border-t border-white/[0.04]" />
      <div className="pt-24 md:pt-32 px-6 md:px-14 lg:px-20">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
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
                More Services
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
              Everything
              <br />
              <span className="italic text-[#C4A45A]">arranged.</span>
            </motion.h2>
          </div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to plan my full Cabo Velvet experience.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-[9px] tracking-[0.28em] text-[#3A3028] uppercase hover:text-[#C4A45A] transition-colors duration-300 hover-line pb-0.5"
          >
            Plan everything →
          </motion.a>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* Row 1: Large left + 2 small stacked right */}
          <ServiceCard service={large[0]} index={0} className="md:col-span-7" tall />
          <div className="md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
            <ServiceCard service={small[0]} index={1} />
            <ServiceCard service={small[1]} index={2} />
          </div>

          {/* Row 2: 2 small stacked left + Large right */}
          <ServiceCard service={large[1]} index={3} className="md:col-span-7 md:col-start-6" tall />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  className = "",
  tall = false,
}: {
  service: (typeof services)[0];
  index: number;
  className?: string;
  tall?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.msg)}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden ${className}`}
      style={{ height: tall ? "clamp(300px, 55vw, 480px)" : "clamp(180px, 30vw, 230px)" }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {/* Overlay — softer, more atmospheric */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/90 via-[#060606]/30 to-[#060606]/10" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-7 pb-5 md:pb-7">
          <p className="text-[8px] tracking-[0.4em] text-[#C4A45A]/70 uppercase mb-1.5">
            {service.label}
          </p>
          <h3
            className="font-display text-[#F2EDE4] font-light leading-none group-hover:text-[#C4A45A] transition-colors duration-300"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: tall ? "clamp(1.6rem, 4vw, 2.4rem)" : "clamp(1.3rem, 3vw, 1.8rem)",
              letterSpacing: "0.03em",
            }}
          >
            {service.title}
          </h3>
        </div>

        {/* Gold tint on hover */}
        <div className="absolute inset-0 bg-[#C4A45A]/0 group-hover:bg-[#C4A45A]/6 transition-colors duration-500" />
      </a>
    </motion.div>
  );
}
