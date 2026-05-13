import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-px bg-[#C4A45A]" />
          <span className="text-[9px] tracking-[0.4em] text-[#C4A45A] uppercase">Cancelled</span>
          <div className="w-8 h-px bg-[#C4A45A]" />
        </div>
        <h1
          className="font-light text-[#F2EDE4] mb-4 leading-none"
          style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}
        >
          Payment Cancelled
        </h1>
        <p className="text-[#7A7060] text-sm font-light tracking-wide mb-10">
          No charges were made. If you have any questions, reach out to us on WhatsApp.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#C4A45A] uppercase hover:text-[#F2EDE4] transition-colors"
        >
          ← Return to Cabo Velvet
        </Link>
      </div>
    </div>
  )
}
