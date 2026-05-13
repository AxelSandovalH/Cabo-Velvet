"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Experiences Delivered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 7, suffix: " years", label: "In Los Cabos" },
  { value: 24, suffix: "/7", label: "Concierge Access" },
];

const testimonials = [
  {
    quote:
      "Cabo Rico turned our bachelorette into a once-in-a-lifetime journey. Every detail — the yacht, the villa, the table at Taboo — was flawless.",
    author: "Ashley M.",
    origin: "Los Angeles, CA",
    tag: "Bachelorette Group · 12 guests",
  },
  {
    quote:
      "I've used concierge services in Monaco and Mykonos. Cabo Rico is in that league. Fast, discreet, and genuinely luxurious.",
    author: "James R.",
    origin: "New York, NY",
    tag: "Yacht Charter · 5 days",
  },
  {
    quote:
      "The ATV desert dinner was the highlight of our entire trip. No app or website could have planned this — only Cabo Rico.",
    author: "Sofia & Luca",
    origin: "Miami, FL",
    tag: "Couples Experience",
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, motionVal, value]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      <span className="text-[#C4A45A]">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tRef = useRef<HTMLDivElement>(null);
  const tInView = useInView(tRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Stats band */}
      <section className="py-16 md:py-20 border-y border-white/[0.04] bg-[#0A0A0A]">
        <div
          ref={ref}
          className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center md:text-left"
            >
              <div
                className="font-display text-4xl md:text-5xl font-light text-[#F2EDE4] mb-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#4A4038] uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-36 px-6 md:px-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div ref={tRef} className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={tInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-5 h-px bg-[#C4A45A]" />
              <span className="text-[10px] tracking-[0.35em] text-[#C4A45A] uppercase">
                Testimonials
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={tInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-tight text-[#F2EDE4]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Guests who lived it
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 24 }}
                animate={tInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
                className="bg-[#080808] p-8 md:p-10 flex flex-col gap-6"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="#C4A45A"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote
                  className="font-display text-xl md:text-2xl font-light text-[#F2EDE4] leading-relaxed italic flex-1"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="border-t border-white/[0.06] pt-6">
                  <p className="text-[#F2EDE4] text-sm font-medium tracking-wide">
                    {t.author}
                  </p>
                  <p className="text-[#4A4038] text-[10px] tracking-[0.15em] uppercase mt-1">
                    {t.origin}
                  </p>
                  <p className="text-[#C4A45A] text-[9px] tracking-[0.2em] uppercase mt-2">
                    {t.tag}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
