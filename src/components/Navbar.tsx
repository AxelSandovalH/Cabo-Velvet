"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n/translations";

const WHATSAPP_NUMBER = "526241234567";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggle } = useLanguage();
  const tx = t[lang];

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(tx.nav.waMessage)}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navItems = [
    { label: tx.nav.villas,       sub: tx.nav.villas_sub,       anchor: "#villas" },
    { label: tx.nav.yachts,       sub: tx.nav.yachts_sub,       anchor: "#yachts" },
    { label: tx.nav.experiences,  sub: tx.nav.experiences_sub,  anchor: "#experiences" },
    { label: tx.nav.nightlife,    sub: tx.nav.nightlife_sub,    anchor: "#services" },
    { label: tx.nav.transport,    sub: tx.nav.transport_sub,    anchor: "#services" },
    { label: tx.nav.concierge,    sub: tx.nav.concierge_sub,    anchor: "#services" },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/92 backdrop-blur-xl border-b border-white/[0.05]"
            : "bg-transparent"
        }`}
      >
        <div className="h-16 md:h-20 flex items-center justify-between px-5 md:px-12 lg:px-16">
          {/* Hamburger — left */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-[5px] p-2 group"
            aria-label="Menu"
          >
            <span className="block w-5 h-px bg-[#F2EDE4]/70 group-hover:bg-[#C4A45A] transition-colors duration-300" />
            <span className="block w-3.5 h-px bg-[#F2EDE4]/50 group-hover:bg-[#C4A45A] transition-colors duration-300" />
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="text-[10px] tracking-[0.22em] text-[#8A8070] hover:text-[#C4A45A] transition-colors duration-300 uppercase px-2 py-1 border border-transparent hover:border-[#C4A45A]/30"
              aria-label="Toggle language"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>

            {/* Book CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0 border border-[#F2EDE4]/25 hover:border-[#C4A45A]/60 transition-colors duration-300 group"
            >
              <span className="px-5 py-2.5 text-[10px] tracking-[0.28em] text-[#F2EDE4]/80 group-hover:text-[#C4A45A] uppercase transition-colors duration-300">
                {tx.nav.book}
              </span>
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-[#080808]/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[85vw] max-w-sm bg-[#080808] flex flex-col border-r border-white/[0.05]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.05]">
                <div>
                  <p
                    className="font-display text-lg tracking-[0.12em] text-[#F2EDE4] uppercase font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Cabo Rico
                  </p>
                  <p className="text-[8px] tracking-[0.38em] text-[#C4A45A] uppercase mt-0.5">
                    Los Cabos
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Language toggle in drawer */}
                  <button
                    onClick={toggle}
                    className="text-[10px] tracking-[0.22em] text-[#8A8070] hover:text-[#C4A45A] transition-colors uppercase border border-white/[0.08] hover:border-[#C4A45A]/30 px-2.5 py-1.5"
                  >
                    {lang === "en" ? "ES" : "EN"}
                  </button>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-[#8A8070] hover:text-[#F2EDE4] transition-colors"
                    aria-label="Close"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center px-6 gap-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.anchor}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-between py-4 border-b border-white/[0.04] hover:border-[#C4A45A]/20 transition-colors"
                  >
                    <div>
                      <p
                        className="font-display text-2xl font-light text-[#F2EDE4] group-hover:text-[#C4A45A] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {item.label}
                      </p>
                      <p className="text-[9px] tracking-[0.22em] text-[#6A6050] uppercase mt-0.5">
                        {item.sub}
                      </p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A3028" strokeWidth="1" className="group-hover:stroke-[#C4A45A] transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="px-6 py-8 border-t border-white/[0.05]">
                <motion.a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-center justify-center gap-2.5 py-4 bg-[#C4A45A] text-[#080808] text-[10px] tracking-[0.28em] uppercase font-semibold hover:bg-[#D4B468] transition-colors"
                >
                  <WhatsAppIcon />
                  {tx.mobile.wa_cta}
                </motion.a>
                <p className="text-[9px] tracking-[0.2em] text-[#5A5040] uppercase text-center mt-4">
                  Los Cabos · BCS · México
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
