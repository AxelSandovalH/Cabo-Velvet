'use client'

import { useState, useMemo } from 'react'
import ImageManager from './ImageManager'

type Listing = {
  id: string
  name: string
  category: string
  images: string[] | null
  provider_id: string | null
}

type CategoryGroup = {
  cat: string
  label: string
  agencies: { name: string; listings: Listing[] }[]
}

export default function DashboardClient({ categories }: { categories: CategoryGroup[] }) {
  const [activeCat, setActiveCat] = useState(categories[0]?.cat ?? '')
  const [activeAgency, setActiveAgency] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')

  const currentCat = categories.find((c) => c.cat === activeCat)

  function getAgencyIdx(cat: string) {
    return activeAgency[cat] ?? 0
  }

  function setAgencyIdx(cat: string, idx: number) {
    setActiveAgency((prev) => ({ ...prev, [cat]: idx }))
  }

  const allListings = useMemo(() =>
    categories.flatMap((c) => c.agencies.flatMap((a) => a.listings)),
    [categories]
  )

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return allListings.filter((l) => l.name.toLowerCase().includes(q))
  }, [search, allListings])

  const isSearching = search.trim().length > 0

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Search bar */}
      <div className="px-4 sm:px-8 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4038]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#4A4038] text-sm pl-9 pr-8 py-2.5 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4038] hover:text-[#9A9080] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      {isSearching ? (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 space-y-3">
          {searchResults.length === 0 ? (
            <p className="text-[#4A4038] text-sm text-center py-10">Sin resultados para &ldquo;{search}&rdquo;</p>
          ) : (
            <>
              <p className="text-[#4A4038] text-[10px] tracking-[0.25em] uppercase mb-4">
                {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
              </p>
              {searchResults.map((listing) => (
                <ImageManager key={listing.id} listing={listing} />
              ))}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Category tabs */}
          {categories.length > 1 && (
            <div className="flex overflow-x-auto border-b border-white/[0.06] px-4 sm:px-8" style={{ scrollbarWidth: 'none' }}>
              {categories.map((c) => (
                <button
                  key={c.cat}
                  onClick={() => setActiveCat(c.cat)}
                  className={`flex-shrink-0 px-5 py-4 text-[10px] tracking-[0.28em] uppercase font-medium transition-colors duration-200 border-b-2 -mb-px ${
                    activeCat === c.cat
                      ? 'text-[#C4A45A] border-[#C4A45A]'
                      : 'text-[#3A3028] border-transparent hover:text-[#7A7060]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Agency tabs + listings */}
          {currentCat && (
            <div className="flex-1 overflow-y-auto">
              {currentCat.agencies.length > 1 && (
                <div className="flex gap-2 px-4 sm:px-8 pt-5 pb-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {currentCat.agencies.map((a, idx) => (
                    <button
                      key={a.name}
                      onClick={() => setAgencyIdx(activeCat, idx)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 ${
                        getAgencyIdx(activeCat) === idx
                          ? 'bg-[#C4A45A] text-[#080808]'
                          : 'bg-white/5 text-[#4A4038] hover:bg-white/10 hover:text-[#9A9080]'
                      }`}
                    >
                      {a.name}
                      <span className={`ml-2 text-[9px] ${getAgencyIdx(activeCat) === idx ? 'opacity-60' : 'opacity-40'}`}>
                        {a.listings.length}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentCat.agencies[getAgencyIdx(activeCat)] && (
                <div className="px-4 sm:px-8 py-5 space-y-3">
                  {currentCat.agencies[getAgencyIdx(activeCat)].listings.map((listing) => (
                    <ImageManager key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
