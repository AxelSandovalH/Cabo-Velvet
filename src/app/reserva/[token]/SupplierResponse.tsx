'use client'

import { useState } from 'react'

type Props = {
  token: string
  initialStatus: string
  initialNote: string | null
  initialRef: string | null
}

export default function SupplierResponse({ token, initialStatus, initialNote, initialRef }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [note, setNote] = useState(initialNote ?? '')
  const [reference, setReference] = useState(initialRef ?? '')
  const [sending, setSending] = useState<'confirm' | 'reject' | null>(null)
  const [error, setError] = useState('')

  const answered = status === 'confirmed' || status === 'rejected'

  async function respond(action: 'confirm' | 'reject') {
    if (action === 'reject' && !note.trim()) {
      setError('Escribe el motivo para poder reubicar al cliente')
      return
    }
    setSending(action)
    setError('')
    try {
      const res = await fetch('/api/supplier/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action, note: note.trim() || undefined, reference: reference.trim() || undefined }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error === 'not_found' ? 'Link inválido' : 'No se pudo guardar, intenta de nuevo')
        return
      }
      setStatus(json.supplierStatus)
    } catch {
      setError('Error de conexión, intenta de nuevo')
    } finally {
      setSending(null)
    }
  }

  if (answered) {
    const confirmed = status === 'confirmed'
    return (
      <div
        className={`mt-6 rounded-xl px-5 py-6 text-center border ${
          confirmed ? 'border-[#C4A45A]/40 bg-[#C4A45A]/[0.07]' : 'border-red-500/30 bg-red-500/[0.06]'
        }`}
      >
        <p className="text-sm">
          {confirmed ? 'Reserva confirmada. Gracias.' : 'Reserva rechazada.'}
        </p>
        <p className="text-[11px] text-[#6B6458] mt-2">
          {confirmed
            ? 'Ya le avisamos al cliente por correo.'
            : 'El equipo de Cabo Rico se hará cargo del cliente.'}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      <input
        type="text"
        value={reference}
        onChange={e => setReference(e.target.value)}
        placeholder="Tu folio interno (opcional)"
        className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#3A3028] text-[13px] px-3 py-2.5 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
        placeholder="Nota para el cliente, o motivo si rechazas"
        className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#3A3028] text-[13px] px-3 py-2.5 rounded-lg outline-none focus:border-[#C4A45A]/40 transition-colors resize-none"
      />

      {error && <p className="text-red-400 text-[12px]">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          onClick={() => respond('confirm')}
          disabled={sending !== null}
          className="flex-1 py-3.5 bg-[#C4A45A] text-[#0A0806] text-[11px] tracking-[0.2em] uppercase font-semibold rounded-lg hover:bg-[#D4B468] disabled:opacity-50 transition-colors"
        >
          {sending === 'confirm' ? 'Guardando…' : 'Confirmar'}
        </button>
        <button
          onClick={() => respond('reject')}
          disabled={sending !== null}
          className="flex-1 py-3.5 border border-white/15 text-[#9A9080] text-[11px] tracking-[0.2em] uppercase rounded-lg hover:border-red-500/40 hover:text-red-300 disabled:opacity-50 transition-colors"
        >
          {sending === 'reject' ? 'Guardando…' : 'Rechazar'}
        </button>
      </div>
    </div>
  )
}
