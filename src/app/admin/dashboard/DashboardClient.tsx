'use client'

import { useState } from 'react'
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

  const currentCat = categories.find((c) => c.cat === activeCat)

  function getAgencyIdx(cat: string) {
    return activeAgency[cat] ?? 0
  }

  function setAgencyIdx(cat: string, idx: number) {
    setActiveAgency((prev) => ({ ...prev, [cat]: idx }))
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
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

      {/* Agency tabs */}
      {currentCat && (
        <div className="flex-1 overflow-y-auto">
          {currentCat.agencies.length > 1 && (
            <div
              className="flex gap-2 px-4 sm:px-8 pt-5 pb-1 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
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

          {/* Listings for selected agency */}
          {currentCat.agencies[getAgencyIdx(activeCat)] && (
            <div className="px-4 sm:px-8 py-5 space-y-3">
              {currentCat.agencies[getAgencyIdx(activeCat)].listings.map((listing) => (
                <ImageManager key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
