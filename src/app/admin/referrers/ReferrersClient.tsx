'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

type Referrer = {
  id: string
  name: string
  role: string | null
  location: string | null
  phone: string | null
  code: string
  commission_pct: number
  active: boolean
  bookings: number
  revenue: number
  created_at: string
}

const ROLES = ['bartender', 'mesero', 'uber', 'hotel', 'marina', 'restaurante', 'otro']

function QRCanvas({ url, code }: { url: string; code: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 180,
      margin: 2,
      color: { dark: '#080808', light: '#F2EDE4' },
    })
  }, [url])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    // White background version for printing
    const out = document.createElement('canvas')
    out.width = 220
    out.height = 220
    const ctx = out.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 220, 220)
    ctx.drawImage(canvas, 20, 20)
    const a = document.createElement('a')
    a.download = `qr-${code}.png`
    a.href = out.toDataURL('image/png')
    a.click()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl p-2 bg-[#F2EDE4]">
        <canvas ref={canvasRef} className="block rounded-lg" />
      </div>
      <button
        onClick={download}
        className="text-[10px] tracking-[0.18em] uppercase text-[#C4A45A] hover:text-[#D4B468] transition-colors"
      >
        ↓ Descargar PNG
      </button>
    </div>
  )
}

function NewReferrerForm({ siteUrl, onCreated }: { siteUrl: string; onCreated: (r: Referrer) => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [commissionPct, setCommissionPct] = useState('10')
  const [code, setCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate code from name
  useEffect(() => {
    if (name) {
      setCode(name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }, [name])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !code.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/referrers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role: role || null, location: location || null, phone: phone || null, commission_pct: parseFloat(commissionPct) || 10, code }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Error'); return }
      onCreated({ ...json, bookings: 0, revenue: 0 })
      setName(''); setRole(''); setLocation(''); setPhone(''); setCommissionPct('10'); setCode('')
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = code ? `${siteUrl}?ref=${code}` : ''

  return (
    <form onSubmit={submit} className="rounded-xl border border-[#C4A45A]/20 bg-[#C4A45A]/[0.03] p-5 space-y-4">
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#C4A45A] font-medium">Nuevo referido</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[9px] tracking-[0.2em] uppercase text-white/30 block mb-1">Nombre *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Carlos López"
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15" />
        </div>
        <div>
          <label className="text-[9px] tracking-[0.2em] uppercase text-white/30 block mb-1">Rol</label>
          <select value={role} onChange={e => setRole(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors">
            <option value="">— elegir —</option>
            {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[9px] tracking-[0.2em] uppercase text-white/30 block mb-1">Lugar de trabajo</label>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Las Varitas Bar"
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15" />
        </div>
        <div>
          <label className="text-[9px] tracking-[0.2em] uppercase text-white/30 block mb-1">WhatsApp</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="521234567890"
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15" />
        </div>
        <div>
          <label className="text-[9px] tracking-[0.2em] uppercase text-white/30 block mb-1">Comisión %</label>
          <input type="number" min="0" max="50" value={commissionPct} onChange={e => setCommissionPct(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors" />
        </div>
        <div>
          <label className="text-[9px] tracking-[0.2em] uppercase text-white/30 block mb-1">Código único *</label>
          <input value={code} onChange={e => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="carlos-varitas"
            className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors placeholder-white/15 font-mono" />
        </div>
      </div>

      {previewUrl && (
        <p className="text-[10px] text-white/30 font-mono truncate">↗ {previewUrl}</p>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button type="submit" disabled={saving || !name || !code}
        className="px-5 py-2 bg-[#C4A45A] text-[#080808] text-[10px] tracking-[0.22em] uppercase font-semibold rounded-lg hover:bg-[#D4B468] disabled:opacity-40 transition-colors">
        {saving ? 'Creando…' : 'Crear referido'}
      </button>
    </form>
  )
}

export default function ReferrersClient({ siteUrl }: { siteUrl: string }) {
  const [referrers, setReferrers] = useState<Referrer[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editComm, setEditComm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/referrers')
      .then(r => r.json())
      .then(data => { setReferrers(data); setLoading(false) })
  }, [])

  function onCreated(r: Referrer) {
    setReferrers(prev => [r, ...prev])
  }

  async function toggleActive(r: Referrer) {
    setReferrers(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x))
    await fetch(`/api/admin/referrers/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !r.active }),
    })
  }

  async function saveComm(r: Referrer) {
    const pct = parseFloat(editComm[r.id] ?? String(r.commission_pct))
    if (isNaN(pct)) return
    setSaving(s => ({ ...s, [r.id]: true }))
    await fetch(`/api/admin/referrers/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commission_pct: pct }),
    })
    setReferrers(prev => prev.map(x => x.id === r.id ? { ...x, commission_pct: pct } : x))
    setSaving(s => ({ ...s, [r.id]: false }))
    setEditComm(e => { const n = { ...e }; delete n[r.id]; return n })
  }

  const totalRevenue = referrers.reduce((a, r) => a + r.revenue, 0)
  const totalBookings = referrers.reduce((a, r) => a + r.bookings, 0)

  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">

      {/* Stats bar */}
      <div className="flex-shrink-0 flex gap-6 px-6 py-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-white/25">Referidos activos</p>
          <p className="text-xl font-semibold text-[#F2EDE4] mt-0.5">{referrers.filter(r => r.active).length}</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-white/25">Reservas generadas</p>
          <p className="text-xl font-semibold text-[#F2EDE4] mt-0.5">{totalBookings}</p>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-white/25">Revenue total</p>
          <p className="text-xl font-semibold text-[#C4A45A] mt-0.5">${(totalRevenue / 100).toLocaleString()}</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

        <NewReferrerForm siteUrl={siteUrl} onCreated={onCreated} />

        {loading && <p className="text-white/25 text-sm text-center py-8">Cargando…</p>}

        {!loading && referrers.length === 0 && (
          <p className="text-white/20 text-sm text-center py-8">Aún no hay referidos</p>
        )}

        {referrers.map(r => {
          const commission = (r.revenue / 100) * (r.commission_pct / 100)
          const refUrl = `${siteUrl}?ref=${r.code}`
          const isOpen = expanded === r.id

          return (
            <div key={r.id} className={`rounded-xl border transition-colors ${r.active ? 'border-white/[0.07] bg-white/[0.02]' : 'border-white/[0.03] bg-transparent opacity-50'}`}>

              {/* Header row */}
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(isOpen ? null : r.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[#F2EDE4] truncate">{r.name}</p>
                    {r.role && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 uppercase tracking-wide flex-shrink-0">{r.role}</span>
                    )}
                  </div>
                  {r.location && <p className="text-[11px] text-white/30 truncate">{r.location}</p>}
                </div>

                {/* Mini stats */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-white/25">Reservas</p>
                    <p className="text-sm font-semibold text-[#F2EDE4]">{r.bookings}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-white/25">Revenue</p>
                    <p className="text-sm font-semibold text-[#C4A45A]">${(r.revenue / 100).toLocaleString()}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-white/25">Comisión</p>
                    <p className="text-sm font-semibold text-emerald-400">${commission.toFixed(0)}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleActive(r) }}
                    className={`text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full font-medium transition-colors flex-shrink-0 ${r.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.05] text-white/25'}`}
                  >
                    {r.active ? 'Activo' : 'Inactivo'}
                  </button>
                  <svg className={`text-white/20 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>

              {/* Expanded: QR + settings */}
              {isOpen && (
                <div className="border-t border-white/[0.05] px-4 py-4 grid sm:grid-cols-2 gap-6">
                  {/* QR code */}
                  <QRCanvas url={refUrl} code={r.code} />

                  {/* Settings */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1">Link</p>
                      <p className="text-[11px] font-mono text-white/50 break-all">{refUrl}</p>
                    </div>

                    {r.phone && (
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1">WhatsApp</p>
                        <p className="text-sm text-white/60">{r.phone}</p>
                      </div>
                    )}

                    <div className="sm:hidden grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[9px] text-white/25">Reservas</p>
                        <p className="text-sm font-semibold">{r.bookings}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/25">Revenue</p>
                        <p className="text-sm font-semibold text-[#C4A45A]">${(r.revenue / 100).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/25">Comisión</p>
                        <p className="text-sm font-semibold text-emerald-400">${commission.toFixed(0)}</p>
                      </div>
                    </div>

                    {/* Commission editor */}
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-1.5">Comisión %</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min="0" max="50" step="0.5"
                          value={editComm[r.id] ?? String(r.commission_pct)}
                          onChange={e => setEditComm(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="w-20 bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-sm px-3 py-1.5 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors"
                        />
                        {editComm[r.id] !== undefined && editComm[r.id] !== String(r.commission_pct) && (
                          <button
                            onClick={() => saveComm(r)}
                            disabled={saving[r.id]}
                            className="text-[10px] px-3 py-1.5 bg-[#C4A45A] text-[#080808] rounded-lg font-semibold tracking-wide disabled:opacity-50"
                          >
                            {saving[r.id] ? '…' : 'Guardar'}
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-white/20 mt-1">
                        Comisión pendiente: <span className="text-emerald-400 font-medium">${commission.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
