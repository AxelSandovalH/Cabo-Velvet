'use client'

import { useEffect, useState } from 'react'

type Provider = {
  id: string
  name: string
  category: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  whatsapp: string | null
  website: string | null
  notes: string | null
  active: boolean
  listings_total: number
  listings_active: number
}

type Field = {
  key: 'contact_email' | 'contact_name' | 'contact_phone' | 'whatsapp' | 'website'
  label: string
  type: string
  placeholder: string
  required?: boolean
}

const FIELDS: Field[] = [
  { key: 'contact_email', label: 'Correo de reservaciones', type: 'email', placeholder: 'reservaciones@operador.com', required: true },
  { key: 'contact_name',  label: 'Persona de contacto',     type: 'text',  placeholder: 'Nombre de quien atiende' },
  { key: 'contact_phone', label: 'Teléfono',                type: 'tel',   placeholder: '624 123 4567' },
  { key: 'whatsapp',      label: 'WhatsApp',                type: 'tel',   placeholder: '52 624 123 4567' },
  { key: 'website',       label: 'Sitio web',               type: 'text',  placeholder: 'operador.com' },
]

type Draft = Record<string, string>

export default function ProvidersClient() {
  const [providers, setProviders] = useState<Provider[] | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({})

  async function load() {
    const res = await fetch('/api/admin/providers')
    const data = await res.json()
    if (Array.isArray(data)) {
      setProviders(data)
      setDrafts(Object.fromEntries(data.map((p: Provider) => [
        p.id,
        Object.fromEntries(FIELDS.map(f => [f.key, p[f.key] ?? ''])) as Draft,
      ])))
    }
  }

  useEffect(() => { load() }, [])

  function edit(id: string, key: string, value: string) {
    setDrafts(d => ({ ...d, [id]: { ...d[id], [key]: value } }))
    setSavedId(null)
    setError(e => ({ ...e, [id]: '' }))
  }

  async function save(p: Provider) {
    setSavingId(p.id)
    setError(e => ({ ...e, [p.id]: '' }))
    const res = await fetch(`/api/admin/providers/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drafts[p.id]),
    })
    const json = await res.json()
    setSavingId(null)
    if (!res.ok) {
      setError(e => ({ ...e, [p.id]: json.error ?? 'No se pudo guardar' }))
      return
    }
    setSavedId(p.id)
    setTimeout(() => setSavedId(null), 2500)
    load()
  }

  async function toggleActive(p: Provider) {
    await fetch(`/api/admin/providers/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    })
    load()
  }

  async function create() {
    if (!newName.trim()) return
    setCreating(true)
    await fetch('/api/admin/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), category: 'tours' }),
    })
    setNewName('')
    setCreating(false)
    load()
  }

  if (!providers) {
    return <p className="text-center text-white/20 text-sm py-20">Cargando proveedores…</p>
  }

  const sinCorreo = providers.filter(p => p.active && !p.contact_email?.trim())

  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-4">

        {sinCorreo.length > 0 && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3">
            <p className="text-[13px] text-amber-200">
              {sinCorreo.length === 1
                ? `${sinCorreo[0].name} no tiene correo de reservaciones.`
                : `${sinCorreo.length} operadores no tienen correo de reservaciones.`}
            </p>
            <p className="text-[11px] text-amber-200/50 mt-1">
              Sin ese dato no podemos avisarles de las reservas pagadas y se quedan esperando en el panel.
            </p>
          </div>
        )}

        {providers.map(p => {
          const draft = drafts[p.id] ?? {}
          const isSaved = savedId === p.id
          const missingEmail = !draft.contact_email?.trim()

          return (
            <section
              key={p.id}
              className={`rounded-xl border transition-colors ${
                isSaved ? 'border-emerald-500/40 bg-emerald-500/[0.03]'
                : missingEmail && p.active ? 'border-amber-500/25 bg-white/[0.02]'
                : 'border-white/[0.07] bg-white/[0.02]'
              }`}
            >
              <header className="flex items-center gap-3 px-4 pt-4 pb-3 flex-wrap">
                <h2 className="text-sm font-medium text-[#F2EDE4] flex-1 min-w-0 truncate">{p.name}</h2>
                <span className="text-[11px] text-white/25">
                  {p.listings_active} de {p.listings_total} activos
                </span>
                <button
                  onClick={() => toggleActive(p)}
                  className={`text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full font-medium transition-colors ${
                    p.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.05] text-white/25'
                  }`}
                >
                  {p.active ? 'Activo' : 'Inactivo'}
                </button>
              </header>

              <div className="grid sm:grid-cols-2 gap-3 px-4 pb-4">
                {FIELDS.filter(f => f.required || openDetails[p.id]).map(f => (
                  <div key={f.key} className={f.key === 'contact_email' ? 'sm:col-span-2' : ''}>
                    <label className="text-[9px] tracking-[0.22em] text-white/30 uppercase block mb-1.5">
                      {f.label}
                      {f.required && <span className="text-amber-400/70 ml-1">·  requerido</span>}
                    </label>
                    <input
                      type={f.type}
                      value={draft[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={e => edit(p.id, f.key, e.target.value)}
                      className={`w-full bg-white/[0.04] border text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none transition-colors placeholder-white/15 ${
                        f.required && !draft[f.key]?.trim()
                          ? 'border-amber-500/30 focus:border-amber-500/60'
                          : 'border-white/[0.08] focus:border-[#C4A45A]/40'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="px-4 pb-3 -mt-1">
                <button
                  onClick={() => setOpenDetails(o => ({ ...o, [p.id]: !o[p.id] }))}
                  className="text-[10px] tracking-[0.15em] uppercase text-white/25 hover:text-white/55 transition-colors"
                >
                  {openDetails[p.id] ? '− Menos datos' : '+ Teléfono, WhatsApp, sitio'}
                </button>
              </div>

              <footer className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.05]">
                <p className="text-[11px] min-w-0 truncate">
                  {error[p.id]
                    ? <span className="text-red-400">{error[p.id]}</span>
                    : isSaved
                      ? <span className="text-emerald-400">✓ Guardado</span>
                      : <span className="text-white/20">Aquí llegan las solicitudes de reserva</span>}
                </p>
                <button
                  onClick={() => save(p)}
                  disabled={savingId === p.id}
                  className="flex-shrink-0 px-5 py-2 bg-[#C4A45A] text-[#080808] text-[10px] tracking-[0.22em] uppercase font-semibold rounded-lg hover:bg-[#D4B468] disabled:opacity-50 transition-colors"
                >
                  {savingId === p.id ? 'Guardando…' : 'Guardar'}
                </button>
              </footer>
            </section>
          )
        })}

        <div className="rounded-xl border border-dashed border-white/[0.1] px-4 py-4 flex flex-wrap items-center gap-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') create() }}
            placeholder="Nombre del nuevo operador"
            className="flex-1 min-w-[180px] bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15"
          />
          <button
            onClick={create}
            disabled={creating || !newName.trim()}
            className="px-5 py-2 bg-white/[0.06] text-white/60 text-[10px] tracking-[0.22em] uppercase font-semibold rounded-lg hover:bg-white/[0.1] hover:text-white/90 disabled:opacity-30 transition-colors"
          >
            {creating ? 'Creando…' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
