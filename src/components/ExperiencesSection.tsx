"use client";

import { useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DBListing } from "@/lib/listings";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n/translations";
import { expandQuery } from "@/lib/i18n/search";

function deriveCat(name: string): string {
  const n = name.toLowerCase()
  if (n.includes("privado"))                                      return "privado"
  if (n.includes("dolphin") || n.includes("delfin"))             return "delfines"
  if (n.includes("scuba") || n.includes("dive") || n.includes("padi") || n.includes("certification") || n.includes("referral")) return "buceo"
  if (n.includes("whale") || n.includes("ballena"))              return "ballenas"
  if (n.includes("atv") || n.includes("off-road") || n.includes("off road") ||
      n.includes("can-am") || n.includes("can am") || n.includes("maverick") ||
      n.includes("side by side") || n.includes("e-bike") || n.includes("zip") ||
      n.includes("camel") || n.includes("horseback") || n.includes("horse") ||
      n.includes("outback") || n.includes("sky bike"))           return "aventura"
  if (n.includes("tour") || n.includes("todos santos") || n.includes("triunfo") ||
      n.includes("arte") || n.includes("vino") || n.includes("city"))  return "tours"
  return "mar"
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=800&q=80&auto=format&fit=crop"

export default function ExperiencesSection({ listings }: { listings?: DBListing[] }) {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true, margin: "-80px" })
  const { lang } = useLanguage()
  const tx = t[lang]

  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState("all")

  const CATS = [
    { id: "all",      label: tx.experiences.cat_all },
    { id: "mar",      label: tx.experiences.cat_mar },
    { id: "ballenas", label: tx.experiences.cat_ballenas },
    { id: "aventura", label: tx.experiences.cat_aventura },
    { id: "buceo",    label: tx.experiences.cat_buceo },
    { id: "delfines", label: tx.experiences.cat_delfines },
    { id: "tours",    label: tx.experiences.cat_tours },
    { id: "privado",  label: tx.experiences.cat_privado },
  ]

  const filtered = useMemo(() => {
    if (!listings?.length) return []
    const terms = query ? expandQuery(query) : []
    return listings.filter((l) => {
      const matchesCat = activeCat === "all" || deriveCat(l.name) === activeCat
      const matchesQ = !query || terms.some((term) =>
        l.name.toLowerCase().includes(term) ||
        l.tagline?.toLowerCase().includes(term) ||
        l.location?.toLowerCase().includes(term)
      )
      return matchesCat && matchesQ
    })
  }, [listings, activeCat, query])

  const resultCount = filtered.length
  const resultLabel = resultCount === 1 ? tx.experiences.experience : tx.experiences.experiences

  return (
    <section id="experiences" className="bg-[#080808]">
      <div className="border-t border-white/[0.04]" />

      {/* Header */}
      <div ref={headerRef} className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto pt-24 md:pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-5 h-px bg-[#C4A45A]" />
          <span className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">{tx.experiences.label}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="font-display font-light leading-tight text-[#F2EDE4] mb-8"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
        >
          {tx.experiences.heading} <span className="italic text-[#C4A45A]">{tx.experiences.heading_italic}</span>
        </motion.h2>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="relative mb-5"
        >
          <SearchIcon />
          <input
            type="text"
            placeholder={tx.experiences.search_placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#5A5040] text-sm pl-10 pr-4 py-3 outline-none focus:border-[#C4A45A]/40 transition-colors duration-200"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6050] hover:text-[#9A9080]"
            >
              ✕
            </button>
          )}
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {CATS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-200 rounded-full border ${
                activeCat === cat.id
                  ? "bg-[#C4A45A] border-[#C4A45A] text-[#080808]"
                  : "border-white/[0.08] text-[#8A8070] hover:border-[#C4A45A]/30 hover:text-[#9A9080]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto pb-24 md:pb-32">
        {filtered.length === 0 ? (
          <p className="text-[#6A6050] text-sm py-16 text-center">
            {listings?.length ? tx.experiences.no_results : tx.experiences.loading}
          </p>
        ) : (
          <>
            <p className="text-[9px] tracking-[0.25em] text-[#5A5040] uppercase mb-6">
              {resultCount} {resultLabel}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map((listing, i) => (
                <ExperienceCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function ExperienceCard({ listing, index }: { listing: DBListing; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  const img = listing.images?.[0] ?? FALLBACK_IMG
  const price = listing.price
    ? `$${Math.round(listing.price)}`
    : null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index % 8, 7) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/listing/${listing.id}`} className="group block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] mb-3">
          <Image
            src={img}
            alt={listing.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent" />
          {price && (
            <span className="absolute bottom-2 right-2 text-[10px] tracking-wide text-[#F2EDE4] bg-[#080808]/70 px-2 py-0.5">
              {price}
            </span>
          )}
        </div>

        {/* Text */}
        <p
          className="text-[#F2EDE4] font-light leading-snug group-hover:text-[#C4A45A] transition-colors duration-300 line-clamp-2"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}
        >
          {listing.name}
        </p>
        {listing.location && (
          <p className="text-[#6A6050] text-[9px] tracking-[0.2em] uppercase mt-0.5">
            {listing.location}
          </p>
        )}
      </Link>
    </motion.div>
  )
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6050]"
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}
