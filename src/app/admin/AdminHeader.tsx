'use client'

export const ADMIN_TABS = [
  { key: 'dashboard', label: 'Imágenes' },
  { key: 'listings',  label: 'Actividades' },
  { key: 'referrers', label: 'Referidos' },
  { key: 'concierge', label: 'Concierge' },
] as const

export type AdminTab = (typeof ADMIN_TABS)[number]['key']

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: 'Imágenes',
  listings:  'Actividades',
  referrers: 'Referidos',
  concierge: 'Concierge AI',
}

export default function AdminHeader({
  current,
  onTabChange,
}: {
  current: AdminTab
  onTabChange?: (tab: AdminTab) => void
}) {
  return (
    <header className="flex-shrink-0 border-b border-white/[0.07] bg-[#080808] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: wordmark + tabs */}
      <div className="flex items-center gap-4 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[#C4A45A] text-sm font-semibold tracking-widest uppercase">CR</span>
          <span className="text-white/20 text-sm hidden sm:block">·</span>
          <span className="text-white/60 text-sm font-medium tracking-wide hidden sm:block">{TAB_TITLES[current]}</span>
        </div>

        <nav className="flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {ADMIN_TABS.map(({ key, label }) => {
            const isActive = current === key
            if (isActive) {
              return (
                <span key={key} className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-lg bg-[#C4A45A]/10 text-[#C4A45A] font-medium tracking-wide whitespace-nowrap">
                  {label}
                </span>
              )
            }
            return onTabChange ? (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-lg text-white/35 hover:text-white/65 hover:bg-white/[0.04] transition-colors tracking-wide whitespace-nowrap"
              >
                {label}
              </button>
            ) : (
              <a
                key={key}
                href={`/admin/${key === 'dashboard' ? 'dashboard' : key}`}
                className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-lg text-white/35 hover:text-white/65 hover:bg-white/[0.04] transition-colors tracking-wide whitespace-nowrap"
              >
                {label}
              </a>
            )
          })}
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
