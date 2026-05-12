"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const WHATSAPP_NUMBER = "526241234567";
const WHATSAPP_MSG = encodeURIComponent(
  "Hi, I'd like to inquire about a luxury experience in Los Cabos."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

const navLinks = [
  { label: "Yachts", href: "#services" },
  { label: "Villas", href: "#services" },
  { label: "Experiences", href: "#experiences" },
  { label: "Nightlife", href: "#services" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex flex-col leading-none group">
            <span
              className="font-display text-xl md:text-2xl font-light tracking-[0.2em] text-[#F2EDE4] uppercase"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Cabo Velvet
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#C4A45A] uppercase font-light mt-0.5">
              Los Cabos
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] tracking-[0.18em] uppercase text-[#9A9080] hover:text-[#F2EDE4] transition-colors duration-300 hover-line"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + mobile menu */}
          <div className="flex items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-[#C4A45A]/40 text-[#C4A45A] text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#C4A45A] hover:text-[#080808] transition-all duration-300"
            >
              <WhatsAppIcon />
              Book Now
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-[#9A9080] hover:text-[#F2EDE4] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#080808]"
          >
            <div className="flex flex-col h-full px-6 py-6">
              <div className="flex justify-between items-center">
                <span
                  className="font-display text-xl tracking-[0.2em] uppercase text-[#F2EDE4]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Cabo Velvet
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[#9A9080]"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col justify-center flex-1 gap-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 + 0.1 }}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-4xl font-light tracking-wide text-[#F2EDE4] border-b border-white/[0.06] pb-4"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {link.label}
                  </motion.a>
                ))}

                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex items-center justify-center gap-2 py-4 bg-[#C4A45A] text-[#080808] text-[11px] tracking-[0.25em] uppercase font-semibold"
                >
                  <WhatsAppIcon />
                  Book Your Experience
                </motion.a>
              </div>

              <div className="pb-4">
                <p className="text-[10px] tracking-[0.2em] text-[#4A4038] uppercase text-center">
                  Los Cabos · Baja California Sur
                </p>
              </div>
            </div>
          </motion.div>
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
