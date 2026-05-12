"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const categories = [
  { id: "villas", label: "Villas", anchor: "#villas" },
  { id: "yachts", label: "Yachts", anchor: "#yachts" },
  { id: "nightlife", label: "Nightlife", anchor: "#nightlife" },
  { id: "experiences", label: "Experiences", anchor: "#experiences" },
  { id: "transport", label: "Transport", anchor: "#services" },
  { id: "concierge", label: "Concierge", anchor: "#services" },
];

export default function CategoryBar() {
  const [active, setActive] = useState("villas");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="explore"
      className="sticky top-16 md:top-20 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Scrollable category row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-0 overflow-x-auto scrollbar-none px-6 md:px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={cat.anchor}
              onClick={() => setActive(cat.id)}
              className="relative flex-shrink-0 group"
            >
              <div
                className={`px-5 py-4 text-[10px] tracking-[0.28em] uppercase font-medium transition-colors duration-300 whitespace-nowrap ${
                  active === cat.id
                    ? "text-[#C4A45A]"
                    : "text-[#4A4038] hover:text-[#9A9080]"
                }`}
              >
                {cat.label}
              </div>
              {/* Active indicator line */}
              {active === cat.id && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute bottom-0 left-4 right-4 h-px bg-[#C4A45A]"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
