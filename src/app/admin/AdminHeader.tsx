'use client'

const PAGES = [
  { key: 'dashboard', label: 'Imágenes', href: '/admin/dashboard' },
  { key: 'listings', label: 'Actividades', href: '/admin/listings' },
  { key: 'concierge', label: 'Concierge', href: '/admin/concierge' },
] as const

type Page = (typeof PAGES)[number]['key']

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Imágenes',
  listings: 'Actividades',
  concierge: 'Concierge AI',
}

export default function AdminHeader({ current }: { current: Page }) {
  return (
    <header className="flex-shrink-0 border-b border-white/[0.07] bg-[#080808] px-6 py-4 flex items-center justify-between gap-6">
      {/* Left: wordmark + nav */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[#C4A45A] text-sm font-semibold tracking-widest uppercase">CR</span>
          <span className="text-white/20 text-sm">·</span>
          <span className="text-white/60 text-sm font-medium tracking-wide">{PAGE_TITLES[current]}</span>
        </div>

        <nav className="hidden sm:flex items-center gap-0.5">
          {PAGES.map(({ key, label, href }) =>
            current === key ? (
              <span
                key={key}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-[#C4A45A]/10 text-[#C4A45A] font-medium tracking-wide"
              >
                {label}
              </span>
            ) : (
              <a
                key={key}
                href={href}
                className="text-[11px] px-3 py-1.5 rounded-lg text-white/35 hover:text-white/65 hover:bg-white/[0.04] transition-colors tracking-wide"
              >
                {label}
              </a>
            )
          )}
        </nav>
      </div>

      {/* Right: logout */}
      <form action="/api/admin/logout" method="POST" className="flex-shrink-0">
        <button className="text-[11px] tracking-[0.12em] uppercase text-white/25 hover:text-white/55 transition-colors">
          Salir
        </button>
      </form>
    </header>
  )
}
