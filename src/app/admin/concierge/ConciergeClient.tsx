'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Conversation = {
  id: string
  phone: string
  name: string | null
  lead_status: string
  interests: string[] | null
  budget_range: string | null
  travel_date: string | null
  group_size: number | null
  messages: { role: string; content: string }[]
  updated_at: string
  created_at: string
}

type Booking = {
  id: string
  listing_id: string | null
  listing_name: string | null
  stripe_url: string | null
  status: string
  created_at: string
  conversation_id: string | null
  phone: string | null
  name: string | null
  amount: number | null
  confirmed_at: string | null
}

type Stats = { total: number; qualified: number; converted: number; linksSent: number }

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-white/10 text-white/50',
  qualified: 'bg-blue-500/20 text-blue-400',
  booking: 'bg-amber-500/20 text-amber-400',
  converted: 'bg-emerald-500/20 text-emerald-400',
  cold: 'bg-white/5 text-white/25',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  qualified: 'Qualified',
  booking: 'Booking',
  converted: 'Converted',
  cold: 'Cold',
}

const BOOKING_COLORS: Record<string, string> = {
  link_sent: 'bg-amber-500/20 text-amber-400',
  confirmed: 'bg-emerald-500/20 text-emerald-400',
  completed: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-white/5 text-white/25',
}

const BOOKING_LABELS: Record<string, string> = {
  link_sent: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function formatUSD(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US')} USD`
}

export default function ConciergeClient({
  conversations,
  bookings,
  stats,
}: {
  conversations: Conversation[]
  bookings: Booking[]
  stats: Stats
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'chats' | 'leads' | 'reservas' | 'analytics'>('chats')
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [bookingFilter, setBookingFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  const filteredLeads = statusFilter === 'all'
    ? conversations
    : conversations.filter((c) => c.lead_status === statusFilter)

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === bookingFilter)

  async function updateBookingStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setUpdating(null)
  }

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-[#F2EDE4]">
      <header className="flex-shrink-0 border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin/dashboard" className="text-white/30 hover:text-white/60 transition-colors text-sm">← Imágenes</a>
          <span className="text-white/20">|</span>
          <h1 className="text-sm font-medium tracking-wide">Cabo Rico — Concierge AI</h1>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button className="text-sm text-white/30 hover:text-white/60 transition-colors">Salir</button>
        </form>
      </header>

      <div className="flex-shrink-0 border-b border-white/[0.06] px-6 flex gap-0">
        {(['chats', 'leads', 'reservas', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3.5 text-[11px] tracking-[0.24em] uppercase font-medium border-b-2 -mb-px transition-colors duration-200 ${
              activeTab === tab
                ? 'text-[#C4A45A] border-[#C4A45A]'
                : 'text-white/25 border-transparent hover:text-white/50'
            }`}
          >
            {tab === 'chats' ? `Chats (${conversations.length})`
              : tab === 'leads' ? 'Leads'
              : tab === 'reservas' ? `Reservas (${bookings.length})`
              : 'Analytics'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">

        {/* CHATS */}
        {activeTab === 'chats' && (
          <div className="h-full flex">
            <div className="w-80 flex-shrink-0 border-r border-white/[0.06] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-white/20 text-sm">Sin conversaciones aún</div>
              ) : conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${selectedConv?.id === conv.id ? 'bg-white/[0.05]' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium truncate">{conv.name ?? `+${conv.phone}`}</span>
                    <span className="text-[10px] text-white/25 flex-shrink-0 ml-2">{timeAgo(conv.updated_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[conv.lead_status] ?? STATUS_COLORS.new}`}>
                      {STATUS_LABELS[conv.lead_status] ?? conv.lead_status}
                    </span>
                    {conv.group_size && <span className="text-[10px] text-white/25">{conv.group_size} pax</span>}
                    {conv.travel_date && <span className="text-[10px] text-white/25 truncate">{conv.travel_date}</span>}
                  </div>
                  {conv.messages?.length > 0 && (
                    <p className="text-[11px] text-white/30 mt-1 truncate">
                      {conv.messages[conv.messages.length - 1]?.content?.slice(0, 60)}
                    </p>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {!selectedConv ? (
                <div className="h-full flex items-center justify-center text-white/20 text-sm">Selecciona una conversación</div>
              ) : (
                <div className="max-w-2xl mx-auto px-6 py-6">
                  <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium">{selectedConv.name ?? 'Sin nombre'}</p>
                        <p className="text-[11px] text-white/40">+{selectedConv.phone}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${STATUS_COLORS[selectedConv.lead_status]}`}>
                        {STATUS_LABELS[selectedConv.lead_status]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-[11px]">
                      {selectedConv.group_size && <div><span className="text-white/30">Grupo</span><p className="text-white/70 mt-0.5">{selectedConv.group_size} personas</p></div>}
                      {selectedConv.travel_date && <div><span className="text-white/30">Fecha</span><p className="text-white/70 mt-0.5">{selectedConv.travel_date}</p></div>}
                      {selectedConv.budget_range && <div><span className="text-white/30">Budget</span><p className="text-white/70 mt-0.5">{selectedConv.budget_range}</p></div>}
                    </div>
                    {selectedConv.interests?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedConv.interests.map((i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-[#C4A45A]/10 text-[#C4A45A]/70 rounded-full">{i}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-3">
                    {(selectedConv.messages ?? []).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#C4A45A]/15 text-[#F2EDE4] rounded-br-sm'
                            : 'bg-white/[0.06] text-[#F2EDE4]/80 rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEADS */}
        {activeTab === 'leads' && (
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'new', 'qualified', 'booking', 'converted', 'cold'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-colors ${statusFilter === s ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/50'}`}
                >
                  {s === 'all' ? `All (${conversations.length})` : `${STATUS_LABELS[s]} (${conversations.filter((c) => c.lead_status === s).length})`}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredLeads.map((conv) => (
                <div key={conv.id} className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.04] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium truncate">{conv.name ?? `+${conv.phone}`}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[conv.lead_status]}`}>{STATUS_LABELS[conv.lead_status]}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-[11px] text-white/35">
                      {conv.group_size && <span>{conv.group_size} pax</span>}
                      {conv.travel_date && <span>{conv.travel_date}</span>}
                      {conv.budget_range && <span>{conv.budget_range}</span>}
                      {conv.interests?.length ? <span>{conv.interests.slice(0, 2).join(', ')}</span> : null}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-white/25">{timeAgo(conv.updated_at)}</p>
                    <p className="text-[10px] text-white/20">{conv.messages?.length ?? 0} msgs</p>
                  </div>
                </div>
              ))}
              {filteredLeads.length === 0 && <p className="text-center text-white/20 text-sm py-16">Sin leads en esta categoría</p>}
            </div>
          </div>
        )}

        {/* RESERVAS */}
        {activeTab === 'reservas' && (
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="flex gap-2 mb-6 flex-wrap">
              {(['all', 'link_sent', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setBookingFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-colors ${bookingFilter === s ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/50'}`}
                >
                  {s === 'all' ? `Todas (${bookings.length})` : `${BOOKING_LABELS[s]} (${bookings.filter((b) => b.status === s).length})`}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredBookings.map((b) => (
                <div key={b.id} className="px-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="text-sm font-medium">{b.name ?? 'Sin nombre'}</p>
                        {b.phone && <p className="text-[11px] text-white/30">+52{b.phone}</p>}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${BOOKING_COLORS[b.status] ?? 'bg-white/10 text-white/40'}`}>
                          {BOOKING_LABELS[b.status] ?? b.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-white/50 mb-1.5">{b.listing_name ?? 'Experiencia'}</p>
                      <div className="flex gap-3 text-[11px] text-white/30 flex-wrap">
                        {b.amount ? <span>{formatUSD(b.amount)}</span> : null}
                        <span>Creado {timeAgo(b.created_at)}</span>
                        {b.confirmed_at && <span>· Pagado {timeAgo(b.confirmed_at)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      {b.stripe_url && (
                        <a href={b.stripe_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] px-2.5 py-1.5 bg-white/[0.05] text-white/40 rounded-lg hover:text-white/70 transition-colors">
                          Ver pago
                        </a>
                      )}
                      {b.status === 'link_sent' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          disabled={updating === b.id}
                          className="text-[10px] px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
                        >
                          {updating === b.id ? '...' : 'Confirmar'}
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'completed')}
                          disabled={updating === b.id}
                          className="text-[10px] px-2.5 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-40"
                        >
                          {updating === b.id ? '...' : 'Completado'}
                        </button>
                      )}
                      {(b.status === 'link_sent' || b.status === 'confirmed') && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          disabled={updating === b.id}
                          className="text-[10px] px-2.5 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-40"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && (
                <p className="text-center text-white/20 text-sm py-16">Sin reservas en esta categoría</p>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="h-full overflow-y-auto px-6 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Chats', value: stats.total, color: 'text-white/70' },
                  { label: 'Qualified', value: stats.qualified, color: 'text-blue-400' },
                  { label: 'Links Sent', value: stats.linksSent, color: 'text-amber-400' },
                  { label: 'Converted', value: stats.converted, color: 'text-emerald-400' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className={`text-2xl font-light ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/30 mt-1 tracking-wider uppercase">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-4">Funnel de Conversión</p>
                {[
                  { label: 'Contactos totales', value: stats.total, color: 'bg-white/20' },
                  { label: 'Calificados', value: stats.qualified, color: 'bg-blue-500/50' },
                  { label: 'Links enviados', value: stats.linksSent, color: 'bg-amber-500/50' },
                  { label: 'Convertidos', value: stats.converted, color: 'bg-emerald-500/50' },
                ].map((row) => (
                  <div key={row.label} className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/40">{row.label}</span>
                      <span className="text-white/60">{row.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${row.color} transition-all duration-700`}
                        style={{ width: stats.total > 0 ? `${Math.round((row.value / stats.total) * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-2">Ingresos confirmados</p>
                <p className="text-3xl font-light text-emerald-400">
                  {formatUSD(bookings.filter((b) => ['confirmed', 'completed'].includes(b.status)).reduce((sum, b) => sum + (b.amount ?? 0), 0))}
                </p>
                <p className="text-[11px] text-white/30 mt-1">
                  {bookings.filter((b) => ['confirmed', 'completed'].includes(b.status)).length} reservas pagadas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
