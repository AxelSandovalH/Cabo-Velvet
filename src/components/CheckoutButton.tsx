'use client'

import { useState } from 'react'

export default function CheckoutButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#F2EDE4] text-[#060606] text-[11px] tracking-[0.28em] uppercase font-semibold overflow-hidden hover:bg-white active:opacity-90 transition-colors duration-300 disabled:opacity-60 w-full sm:w-auto"
    >
      <span className="absolute inset-0 bg-white/20 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 skew-x-12" />
      <span className="relative">{loading ? 'Redirecting...' : 'Book Now'}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-300 group-hover:translate-x-1 relative">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
