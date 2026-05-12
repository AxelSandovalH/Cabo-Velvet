"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const WHATSAPP_NUMBER = "526241234567";

const services = [
  {
    id: "yachts",
    title: "Private Yachts",
    subtitle: "From 40ft to Superyacht",
    description:
      "Curated fleet of luxury vessels. Full-day charters, sunset cruises, and multi-day adventures along the Sea of Cortez.",
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80&auto=format&fit=crop",
    tag: "From $1,200 / day",
    whatsappMsg: "Hi, I'd like to charter a private yacht in Los Cabos.",
  },
  {
    id: "villas",
    title: "Private Villas",
    subtitle: "Exclusive Properties",
    description:
      "Handpicked residences with private pools, chef service, and breathtaking Pacific views. Fully staffed and styled for you.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop",
    tag: "From $800 / night",
    whatsappMsg: "Hi, I'm interested in booking a private villa in Los Cabos.",
  },
  {
    id: "nightlife",
    title: "VIP Nightlife",
    subtitle: "Access. Tables. Presence.",
    description:
      "Priority access to Cabo's most exclusive venues. VIP tables, bottle service, and seamless entry — no lines, no waiting.",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop",
    tag: "Nightly Access",
    whatsappMsg: "Hi, I need VIP nightlife access in Los Cabos.",
  },
  {
    id: "transport",
    title: "Ground Transport",
    subtitle: "Luxury Fleet",
    description:
      "Sprinter vans, Escalades, and private sedans. Airport transfers, hotel runs, and all-day chauffeur service available.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
    tag: "Available 24 / 7",
    whatsappMsg: "Hi, I need luxury transportation in Los Cabos.",
  },
  {
    id: "atv",
    title: "ATV & Adventures",
    subtitle: "Off-Road Expeditions",
    description:
      "Private guided ATV tours through Baja's desert landscape. Curated for groups — sunset runs, desert dining, and more.",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80&auto=format&fit=crop",
    tag: "Group Experiences",
    whatsappMsg: "Hi, I'm interested in ATV or adventure experiences in Los Cabos.",
  },
  {
    id: "concierge",
    title: "Bespoke Concierge",
    subtitle: "Whatever You Need",
    description:
      "Private chefs, spa at home, floral arrangements, surprise events, and custom experiences crafted entirely around you.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    tag: "Fully Bespoke",
    whatsappMsg: "Hi, I have a special request for a bespoke concierge experience.",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 md:py-36 px-6 md:px-10 bg-[#080808]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={ref} className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-5 h-px bg-[#C4A45A]" />
            <span className="text-[10px] tracking-[0.35em] text-[#C4A45A] uppercase">
              Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-tight text-[#F2EDE4] max-w-xl"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Curated for the{" "}
            <span className="italic text-[#C4A45A]">discerning</span>
          </motion.h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.whatsappMsg)}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative bg-[#080808] overflow-hidden cursor-pointer"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />

          {/* Tag */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#080808]/70 backdrop-blur-sm border border-[#C4A45A]/20">
            <span className="text-[9px] tracking-[0.25em] text-[#C4A45A] uppercase">
              {service.tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 border-t border-white/[0.04]">
          <p className="text-[9px] tracking-[0.3em] text-[#4A4038] uppercase mb-2">
            {service.subtitle}
          </p>
          <h3
            className="font-display text-2xl font-light text-[#F2EDE4] mb-3 group-hover:text-[#C4A45A] transition-colors duration-300"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {service.title}
          </h3>
          <p className="text-[#6B6458] text-sm leading-relaxed font-light mb-5">
            {service.description}
          </p>

          {/* Inline CTA */}
          <div className="flex items-center gap-2 text-[#C4A45A] text-[10px] tracking-[0.2em] uppercase group-hover:gap-3 transition-all duration-300">
            <span>Inquire</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
