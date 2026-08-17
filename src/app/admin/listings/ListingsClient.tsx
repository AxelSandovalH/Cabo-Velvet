'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import SlotEditor from './SlotEditor'

type Listing = {
  id: string
  name: string
  category: string
  price: number | null
  capacity: number | null
  closed_weekdays: number[] | null
  active: boolean
  images: string[] | null
  provider_id: string | null
}

type Provider = { id: string; name: string }

const NO_AGENCY = '__none__'

const WEEKDAYS = [
  { label: 'D', value: 0, full: 'Dom' },
  { label: 'L', value: 1, full: 'Lun' },
  { label: 'M', value: 2, full: 'Mar' },
  { label: 'X', value: 3, full: 'Mié' },
  { label: 'J', value: 4, full: 'Jue' },
  { label: 'V', value: 5, full: 'Vie' },
  { label: 'S', value: 6, full: 'Sáb' },
]

const CATEGORY_LABEL: Record<string, string> = {
  experience: 'Experiencia',
  villa: 'Villa',
  yacht: 'Yate',
  service: 'Servicio',
}

const CATEGORY_COLOR: Record<string, string> = {
  experience: 'bg-blue-500/15 text-blue-400',
  villa: 'bg-purple-500/15 text-purple-400',
  yacht: 'bg-cyan-500/15 text-cyan-400',
  service: 'bg-amber-500/15 text-amber-400',
}

type RowState = {
  capacity: string
  closedWeekdays: number[]
  price: string
  active: boolean
  saving: boolean
  saved: boolean
  error: string
}

export default function ListingsClient({
  listings,
  providers,
}: {
  listings: Listing[]
  providers: Provider[]
}) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [agencyFilter, setAgencyFilter] = useState('all')
  const [photosFirst, setPhotosFirst] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({})

  // Un vistazo de cuántos horarios tiene cada actividad, sin abrirlas una por una
  useEffect(() => {
    fetch('/api/admin/slots')
      .then(r => r.json())
      .then(d => { if (d?.counts) setSlotCounts(d.counts) })
      .catch(() => {})
  }, [])

  const [rows, setRows] = useState<Record<string, RowState>>(() => {
    const init: Record<string, RowState> = {}
    for (const l of listings) {
      init[l.id] = {
        capacity: l.capacity != null ? String(l.capacity) : '',
        closedWeekdays: l.closed_weekdays ?? [],
        price: l.price != null ? String(l.price) : '',
        active: l.active,
        saving: false,
        saved: false,
        error: '',
      }
    }
    return init
  })

  function update(id: string, patch: Partial<RowState>) {
    setRows(r => ({ ...r, [id]: { ...r[id], ...patch, saved: false } }))
  }

  function toggleWeekday(id: string, day: number) {
    const current = rows[id].closedWeekdays
    const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day]
    update(id, { closedWeekdays: next })
  }

  async function save(id: string) {
    const row = rows[id]
    update(id, { saving: true, error: '' })

    const body: Record<string, unknown> = {
      closed_weekdays: row.closedWeekdays,
      active: row.active,
    }
    if (row.capacity !== '') body.capacity = parseInt(row.capacity) || null
    else body.capacity = null
    if (row.price !== '') body.price = parseFloat(row.price) || null

    const res = await fetch(`/api/admin/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()

    if (!res.ok) {
      update(id, { saving: false, error: json.error ?? 'Error guardando' })
    } else {
      update(id, { saving: false, saved: true, error: '' })
      setTimeout(() => update(id, { saved: false }), 2000)
    }
  }

  const providerName = (id: string | null) =>
    (id && providers.find(p => p.id === id)?.name) || 'Sin agencia'

  const hasPhoto = (l: Listing) => !!l.images?.length

  const filtered = listings
    .filter(l => {
      const matchesCat = catFilter === 'all' || l.category === catFilter
      const matchesAgency =
        agencyFilter === 'all' ||
        (agencyFilter === NO_AGENCY ? !l.provider_id : l.provider_id === agencyFilter)
      const matchesSearch = !search.trim() || l.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCat && matchesAgency && matchesSearch
    })
    .sort((a, b) => {
      const diff = Number(hasPhoto(b)) - Number(hasPhoto(a))
      if (diff !== 0) return photosFirst ? diff : -diff
      return a.name.localeCompare(b.name)
    })

  const cats = ['all', ...Array.from(new Set(listings.map(l => l.category)))]

  // Solo las agencias que realmente tienen actividades, con su conteo de fotos
  const agencyOptions = [
    ...providers
      .map(p => ({
        id: p.id,
        name: p.name,
        items: listings.filter(l => l.provider_id === p.id),
      }))
      .filter(a => a.items.length),
    ...(listings.some(l => !l.provider_id)
      ? [{ id: NO_AGENCY, name: 'Sin agencia', items: listings.filter(l => !l.provider_id) }]
      : []),
  ]

  const conFoto = filtered.filter(hasPhoto).length

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">

      {/* Toolbar */}
      <div className="flex-shrink-0 flex flex-wrap items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4038]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar actividad…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#4A4038] text-sm pl-8 pr-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-colors ${
                catFilter === cat ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/60'
              }`}
            >
              {cat === 'all' ? `Todos (${listings.length})` : CATEGORY_LABEL[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agencias + orden por foto */}
      <div className="flex-shrink-0 flex flex-wrap items-center gap-2 px-6 py-3 border-b border-white/[0.06]">
        <span className="text-[9px] tracking-[0.22em] text-white/25 uppercase mr-1">Agencia</span>

        <button
          onClick={() => setAgencyFilter('all')}
          className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.14em] uppercase font-medium transition-colors ${
            agencyFilter === 'all' ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/60'
          }`}
        >
          Todas
        </button>

        {agencyOptions.map(a => {
          const withPhoto = a.items.filter(hasPhoto).length
          return (
            <button
              key={a.id}
              onClick={() => setAgencyFilter(a.id)}
              title={`${withPhoto} de ${a.items.length} con foto`}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.14em] uppercase font-medium transition-colors ${
                agencyFilter === a.id ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/60'
              }`}
            >
              {a.name} <span className="opacity-60">{withPhoto}/{a.items.length}</span>
            </button>
          )
        })}

        <button
          onClick={() => setPhotosFirst(v => !v)}
          className="ml-auto px-3 py-1.5 rounded-full text-[10px] tracking-[0.14em] uppercase font-medium bg-white/[0.05] text-white/40 hover:text-white/75 transition-colors"
        >
          {photosFirst ? 'Con foto primero' : 'Sin foto primero'}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {filtered.length > 0 && (
          <p className="text-[10px] tracking-[0.18em] text-white/25 uppercase pb-1">
            {filtered.length} {filtered.length === 1 ? 'actividad' : 'actividades'} · {conFoto} con foto · {filtered.length - conFoto} sin foto
          </p>
        )}
        {filtered.length === 0 && (
          <p className="text-white/20 text-sm text-center py-16">Sin resultados</p>
        )}

        {filtered.map(listing => {
          const row = rows[listing.id]
          if (!row) return null

          return (
            <div
              key={listing.id}
              className={`rounded-xl border transition-colors ${
                row.saved ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-white/[0.07] bg-white/[0.02]'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                {listing.images?.length ? (
                  <Image
                    src={listing.images[0]}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <span
                    title="Sin foto"
                    className="w-10 h-10 rounded-lg flex-shrink-0 border border-dashed border-white/15 flex items-center justify-center text-[8px] tracking-[0.1em] uppercase text-white/25"
                  >
                    Foto
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F2EDE4] truncate">{listing.name}</p>
                  <p className="text-[10px] text-white/25 truncate">
                    <span className={`inline-block px-1.5 rounded-full mr-1.5 ${CATEGORY_COLOR[listing.category] ?? 'bg-white/10 text-white/40'}`}>
                      {CATEGORY_LABEL[listing.category] ?? listing.category}
                    </span>
                    {providerName(listing.provider_id)}
                  </p>
                </div>

                <button
                  onClick={() => setExpanded(expanded === listing.id ? null : listing.id)}
                  className={`text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full font-medium transition-colors ${
                    slotCounts[listing.id]
                      ? 'bg-[#C4A45A]/15 text-[#C4A45A] hover:bg-[#C4A45A]/25'
                      : 'bg-white/[0.05] text-white/30 hover:text-white/60'
                  }`}
                >
                  {slotCounts[listing.id] ? `${slotCounts[listing.id]} horarios` : 'Sin horarios'}
                </button>

                {/* Active toggle */}
                <button
                  onClick={() => update(listing.id, { active: !row.active })}
                  className={`text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full font-medium transition-colors ${
                    row.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.05] text-white/25'
                  }`}
                >
                  {row.active ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 pb-4">
                {/* Price */}
                <div>
                  <label className="text-[9px] tracking-[0.22em] text-white/30 uppercase block mb-1.5">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="—"
                    value={row.price}
                    onChange={e => update(listing.id, { price: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="text-[9px] tracking-[0.22em] text-white/30 uppercase block mb-1.5">
                    Cupo / día
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Sin límite"
                    value={row.capacity}
                    onChange={e => update(listing.id, { capacity: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15"
                  />
                  <p className="text-[9px] text-white/20 mt-1">Límite por día, sobre todos los horarios</p>
                </div>

                {/* Closed weekdays */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[9px] tracking-[0.22em] text-white/30 uppercase block mb-1.5">
                    Días de descanso
                  </label>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map(day => (
                      <button
                        key={day.value}
                        onClick={() => toggleWeekday(listing.id, day.value)}
                        title={day.full}
                        className={`w-8 h-8 rounded-full text-[11px] font-medium transition-colors ${
                          row.closedWeekdays.includes(day.value)
                            ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
                            : 'bg-white/[0.05] text-white/30 hover:text-white/60'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {expanded === listing.id && (
                <div className="border-t border-white/[0.05] pt-3">
                  <p className="text-[9px] tracking-[0.22em] text-white/30 uppercase px-4 pb-2">
                    Horarios de salida
                  </p>
                  <SlotEditor
                    listingId={listing.id}
                    onCountChange={(n) => setSlotCounts(c => ({ ...c, [listing.id]: n }))}
                  />
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
                {row.error ? (
                  <p className="text-red-400 text-[11px]">{row.error}</p>
                ) : row.saved ? (
                  <p className="text-emerald-400 text-[11px]">✓ Guardado</p>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => save(listing.id)}
                  disabled={row.saving}
                  className="px-5 py-2 bg-[#C4A45A] text-[#080808] text-[10px] tracking-[0.22em] uppercase font-semibold rounded-lg hover:bg-[#D4B468] disabled:opacity-50 transition-colors"
                >
                  {row.saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
