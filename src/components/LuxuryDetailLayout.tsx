"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

interface Spec { label: string; value: string }

interface Props {
  category: string;
  categoryHref: string;
  label?: string;
  name: string;
  tagline: string;
  location?: string;
  model?: string;
  heroImage: string;
  gallery: string[];
  description: string[];
  specs: Spec[];
  includes: string[];
  price: string;
  durationOrStay: string;
  whatsappMsg: string;
  listingId?: string;
}

const WHATSAPP_NUMBER = "523141222146";

export default function LuxuryDetailLayout({
  category,
  categoryHref,
  label,
  name,
  tagline,
  location,
  model,
  heroImage,
  gallery,
  description,
  specs,
  includes,
  price,
  durationOrStay,
  whatsappMsg,
  listingId,
}: Props) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;
  const sub = location ?? model ?? "";

  return (
    <div className="bg-[#060606] min-h-screen">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <Image
          src={heroImage}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/25 to-[#060606]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/30 via-transparent to-transparent" />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.032] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "300px",
          }}
        />

        {/* Back nav */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6 md:px-14 pt-6 flex items-center justify-between">
          <Link
            href={categoryHref}
            className="group inline-flex items-center gap-2 text-[9px] tracking-[0.3em] text-[#9A9080] uppercase hover:text-[#F2EDE4] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:-translate-x-0.5">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {category}
          </Link>

          {/* Label badge */}
          {label && (
            <span className="text-[8px] tracking-[0.38em] text-[#C4A45A] uppercase border border-[#C4A45A]/30 px-3 py-1.5">
              {label}
            </span>
          )}
        </div>

        {/* Hero text — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-14 md:pb-20 z-10">
          {sub && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase mb-3"
            >
              {sub}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light text-[#F2EDE4] leading-[0.9] mb-4"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 9vw, 7rem)",
            }}
          >
            {name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="text-[#7A7060] text-sm tracking-wide font-light"
          >
            {tagline}
          </motion.p>
        </div>
      </section>

      {/* ── SPECS ROW ────────────────────────────────────── */}
      <section className="border-y border-white/[0.05] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1">
              <span className="text-[8px] tracking-[0.35em] text-[#3A3028] uppercase">
                {spec.label}
              </span>
              <span
                className="font-display text-lg font-light text-[#F2EDE4]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-14 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#C4A45A]" />
            <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">
              The Experience
            </span>
          </div>
          {description.map((para, i) => (
            <p
              key={i}
              className="font-display text-xl md:text-2xl font-light text-[#C8BFB0] leading-relaxed"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {para}
            </p>
          ))}
        </motion.div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="px-6 md:px-14 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden ${
                  i === 0 ? "md:col-span-2 h-[50vw] md:h-[420px]" : "h-[50vw] md:h-[420px]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${name} gallery ${i + 1}`}
                  fill
                  className="object-cover hover:scale-[1.04] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUDES ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-white/[0.04] bg-[#080808]">
        <div className="px-6 md:px-14 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-px bg-[#C4A45A]" />
              <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">
                What's Included
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              {includes.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex items-center gap-3 py-3 border-b border-white/[0.05]"
                >
                  <div className="w-1 h-1 rounded-full bg-[#C4A45A] flex-shrink-0" />
                  <span className="text-[#8A8070] text-sm font-light tracking-wide">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING + CTA ────────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-white/[0.04] bg-[#060606]">
        <div className="px-6 md:px-14 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C4A45A]" />
              <span className="text-[9px] tracking-[0.4em] text-[#C4A45A] uppercase">
                Reserve
              </span>
              <div className="w-8 h-px bg-[#C4A45A]" />
            </div>

            <h2
              className="font-display font-light text-[#F2EDE4] mb-2 leading-none"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
              }}
            >
              {price}
            </h2>
            <p className="text-[#4A4038] text-[10px] tracking-[0.25em] uppercase mb-10">
              {durationOrStay}
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-stretch sm:flex-row sm:items-center justify-center gap-3 mb-5 max-w-md mx-auto sm:max-w-none">
              {listingId && <CheckoutButton listingId={listingId} />}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#C4A45A] text-[#060606] text-[11px] tracking-[0.28em] uppercase font-semibold overflow-hidden hover:bg-[#D4B468] active:opacity-90 transition-colors duration-300 w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 skew-x-12" />
                <WhatsAppIcon />
                <span className="relative">Inquire on WhatsApp</span>
                <ArrowIcon />
              </a>
            </div>

            <p className="text-[8.5px] tracking-[0.22em] text-[#2A2018] uppercase">
              Instant response · No booking fees · 100% private
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER STRIP ─────────────────────────────────── */}
      <div className="border-t border-white/[0.04] py-8 px-6 md:px-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.2em] text-[#3A3028] uppercase hover:text-[#C4A45A] transition-colors"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          ← Cabo Rico
        </Link>
        <span className="text-[8px] tracking-[0.25em] text-[#2A2018] uppercase">
          Los Cabos · BCS · México
        </span>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:translate-x-1">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
