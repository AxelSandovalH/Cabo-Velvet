'use client'

import { useEffect, useState } from 'react'

type Slot = {
  id: string
  start_time: string
  label: string | null
  capacity: number | null
  weekdays: number[]
  active: boolean
}

const WEEKDAYS = [
  { label: 'D', value: 0 }, { label: 'L', value: 1 }, { label: 'M', value: 2 },
  { label: 'X', value: 3 }, { label: 'J', value: 4 }, { label: 'V', value: 5 },
  { label: 'S', value: 6 },
]

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${period}`
}

export default function SlotEditor({
  listingId,
  onCountChange,
}: {
  listingId: string
  onCountChange?: (count: number) => void
}) {
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [time, setTime] = useState('')
  const [label, setLabel] = useState('')
  const [capacity, setCapacity] = useState('')
  const [applyToProvider, setApplyToProvider] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  async function load() {
    const res = await fetch(`/api/admin/slots?listing_id=${listingId}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      setSlots(data)
      onCountChange?.(data.filter((s: Slot) => s.active).length)
    }
  }

  useEffect(() => { load() }, [listingId])

  async function add() {
    if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(time)) {
      setError('Usa formato de 24 horas, por ejemplo 09:00 o 15:30')
      return
    }
    setBusy(true); setError(''); setNote('')
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        start_time: time.padStart(5, '0'),
        label, capacity, applyToProvider,
      }),
    })
    const json = await res.json()
    setBusy(false)
    if (!res.ok) { setError(json.error ?? 'No se pudo agregar'); return }
    if (applyToProvider) setNote(`Agregado a ${json.applied} actividades de la agencia`)
    setTime(''); setLabel(''); setCapacity('')
    load()
  }

  async function patch(id: string, patchBody: Record<string, unknown>) {
    await fetch('/api/admin/slots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patchBody }),
    })
    load()
  }

  async function remove(id: string) {
    setError('')
    const res = await fetch(`/api/admin/slots?id=${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'No se pudo borrar')
      return
    }
    load()
  }

  if (!slots) return <p className="text-[11px] text-white/20 px-4 pb-4">Cargando horarios…</p>

  return (
    <div className="px-4 pb-4 space-y-2.5">
      {slots.length === 0 && (
        <p className="text-[11px] text-white/25">
          Sin horarios. Se reserva solo por fecha; el cliente no elige hora de salida.
        </p>
      )}

      {slots.map(slot => (
        <div
          key={slot.id}
          className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 ${
            slot.active ? 'border-white/[0.07] bg-white/[0.02]' : 'border-white/[0.04] bg-transparent opacity-50'
          }`}
        >
          <span className="text-sm text-[#F2EDE4] tabular-nums w-[74px]">{formatTime(slot.start_time)}</span>

          <input
            defaultValue={slot.label ?? ''}
            placeholder="Etiqueta"
            onBlur={e => { if (e.target.value !== (slot.label ?? '')) patch(slot.id, { label: e.target.value }) }}
            className="w-24 bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-[12px] px-2 py-1 rounded outline-none focus:border-[#C4A45A]/40 placeholder-white/15"
          />

          <input
            type="number"
            min="1"
            defaultValue={slot.capacity ?? ''}
            placeholder="Cupo"
            onBlur={e => {
              const v = e.target.value
              if (v !== String(slot.capacity ?? '')) patch(slot.id, { capacity: v })
            }}
            className="w-16 bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-[12px] px-2 py-1 rounded outline-none focus:border-[#C4A45A]/40 placeholder-white/15"
          />

          <div className="flex gap-1">
            {WEEKDAYS.map(d => {
              const runs = !slot.weekdays?.length || slot.weekdays.includes(d.value)
              return (
                <button
                  key={d.value}
                  title={runs ? 'Opera este día' : 'No opera'}
                  onClick={() => {
                    const current = slot.weekdays?.length ? slot.weekdays : [0, 1, 2, 3, 4, 5, 6]
                    const next = current.includes(d.value)
                      ? current.filter(x => x !== d.value)
                      : [...current, d.value].sort()
                    patch(slot.id, { weekdays: next.length === 7 ? [] : next })
                  }}
                  className={`w-6 h-6 rounded text-[10px] font-medium transition-colors ${
                    runs ? 'bg-[#C4A45A]/15 text-[#C4A45A]' : 'bg-white/[0.04] text-white/20'
                  }`}
                >
                  {d.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => patch(slot.id, { active: !slot.active })}
              className="text-[10px] px-2 py-1 rounded text-white/35 hover:text-white/70 transition-colors"
            >
              {slot.active ? 'Desactivar' : 'Activar'}
            </button>
            <button
              onClick={() => remove(slot.id)}
              className="text-[10px] px-2 py-1 rounded text-white/25 hover:text-red-400 transition-colors"
            >
              Borrar
            </button>
          </div>
        </div>
      ))}

      {/* Add a departure time */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <input
          value={time}
          onChange={e => setTime(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add() }}
          placeholder="09:00"
          className="w-[74px] bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-[12px] px-2 py-1.5 rounded outline-none focus:border-[#C4A45A]/40 placeholder-white/15 tabular-nums"
        />
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Etiqueta"
          className="w-24 bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-[12px] px-2 py-1.5 rounded outline-none focus:border-[#C4A45A]/40 placeholder-white/15"
        />
        <input
          type="number"
          min="1"
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="Cupo"
          className="w-16 bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] text-[12px] px-2 py-1.5 rounded outline-none focus:border-[#C4A45A]/40 placeholder-white/15"
        />
        <label className="flex items-center gap-1.5 text-[11px] text-white/35 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={applyToProvider}
            onChange={e => setApplyToProvider(e.target.checked)}
            className="accent-[#C4A45A]"
          />
          Toda la agencia
        </label>
        <button
          onClick={add}
          disabled={busy || !time}
          className="px-4 py-1.5 bg-white/[0.06] text-white/70 text-[10px] tracking-[0.18em] uppercase font-semibold rounded hover:bg-white/[0.1] disabled:opacity-30 transition-colors"
        >
          {busy ? '…' : 'Agregar'}
        </button>
      </div>

      {error && <p className="text-red-400 text-[11px]">{error}</p>}
      {note && <p className="text-emerald-400 text-[11px]">{note}</p>}
    </div>
  )
}
