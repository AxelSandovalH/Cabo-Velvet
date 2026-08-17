'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Conversation = {
  id: string; phone: string; name: string | null; lead_status: string
  interests: string[] | null; budget_range: string | null
  travel_date: string | null; group_size: number | null
  messages: { role: string; content: string }[]
  updated_at: string; created_at: string
}
type Booking = {
  id: string; listing_id: string | null; listing_name: string | null
  stripe_url: string | null; status: string; created_at: string
  conversation_id: string | null; phone: string | null
  name: string | null; amount: number | null; confirmed_at: string | null
  email: string | null; booking_date: string | null; start_time: string | null
  supplier_status: string | null; deposit_amount: number | null; balance_due: number | null
}
type Stats = { total: number; qualified: number; converted: number; linksSent: number }

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-white/10 text-white/50', qualified: 'bg-blue-500/20 text-blue-400',
  booking: 'bg-amber-500/20 text-amber-400', converted: 'bg-emerald-500/20 text-emerald-400',
  cold: 'bg-white/5 text-white/25',
}
const STATUS_LABELS: Record<string, string> = {
  new: 'New', qualified: 'Qualified', booking: 'Booking', converted: 'Converted', cold: 'Cold',
}
const BOOKING_COLORS: Record<string, string> = {
  link_sent: 'bg-amber-500/20 text-amber-400', confirmed: 'bg-emerald-500/20 text-emerald-400',
  completed: 'bg-blue-500/20 text-blue-400', cancelled: 'bg-white/5 text-white/25',
}
const BOOKING_LABELS: Record<string, string> = {
  link_sent: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado',
}
const SUPPLIER_COLORS: Record<string, string> = {
  pending: 'bg-white/5 text-white/30', sent: 'bg-amber-500/15 text-amber-300',
  confirmed: 'bg-emerald-500/15 text-emerald-300', rejected: 'bg-red-500/15 text-red-300',
  cancelled: 'bg-white/5 text-white/25',
}
const SUPPLIER_LABELS: Record<string, string> = {
  pending: 'Operador: sin enviar', sent: 'Operador: esperando',
  confirmed: 'Operador: confirmó', rejected: 'Operador: rechazó', cancelled: 'Operador: cancelado',
}

function slotLabel(time: string | null): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${period}`
}
const CAL_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const CAL_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

type CalBooking = {
  id: string; listing_id: string; listing_name: string; name: string | null
  phone: string | null; people_count: number | null; status: string
  amount: number | null; booking_date: string
}

function CalendarioTab() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [data, setData] = useState<Record<string, CalBooking[]>>({})
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const monthParam = `${year}-${String(month).padStart(2, '0')}`
  const fetchData = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch(`/api/admin/availability?month=${monthParam}`); setData(await res.json()) }
    finally { setLoading(false) }
  }, [monthParam])
  useEffect(() => { fetchData() }, [fetchData])
  function prevMonth() { if (month === 1) { setYear(y => y-1); setMonth(12) } else setMonth(m => m-1); setSelectedDay(null) }
  function nextMonth() { if (month === 12) { setYear(y => y+1); setMonth(1) } else setMonth(m => m+1); setSelectedDay(null) }
  const firstDow = new Date(year, month-1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number|null)[] = [...Array(firstDow).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)]
  while (cells.length % 7 !== 0) cells.push(null)
  const selectedBookings = selectedDay ? (data[selectedDay] ?? []) : []

  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="p-2 text-white/30 hover:text-white/70 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="text-[12px] tracking-[0.28em] uppercase text-[#F2EDE4]">{CAL_MONTHS[month-1]} {year}</span>
          <button onClick={nextMonth} className="p-2 text-white/30 hover:text-white/70 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {CAL_DAYS.map(d => <div key={d} className="text-center text-[9px] tracking-[0.2em] text-white/25 uppercase py-1">{d}</div>)}
        </div>
        <div className={`grid grid-cols-7 gap-1 transition-opacity ${loading ? 'opacity-40' : ''}`}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const dayBookings = data[dateStr] ?? []
            const isSelected = selectedDay === dateStr
            const hasBookings = dayBookings.length > 0
            const totalPax = dayBookings.reduce((s,b) => s+(b.people_count??1), 0)
            const isToday = dateStr === today.toISOString().slice(0,10)
            return (
              <button key={i} onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                className={`min-h-[48px] sm:min-h-[56px] rounded-lg p-1 sm:p-1.5 text-left transition-all border ${
                  isSelected ? 'bg-[#C4A45A]/20 border-[#C4A45A]/50'
                  : hasBookings ? 'bg-white/[0.04] border-white/[0.08] hover:border-white/20'
                  : 'border-transparent hover:bg-white/[0.03]'}`}
              >
                <span className={`text-[10px] sm:text-[11px] font-medium ${isToday ? 'text-[#C4A45A]' : 'text-white/50'}`}>{d}</span>
                {hasBookings && (
                  <div className="mt-0.5">
                    <span className="text-[8px] sm:text-[9px] text-emerald-400">{dayBookings.length}·{totalPax}p</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
      {selectedDay && (
        <div className="w-64 sm:w-72 flex-shrink-0 border-l border-white/[0.06] overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] tracking-[0.22em] text-[#C4A45A] uppercase">
              {new Date(selectedDay+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
            </p>
            <button onClick={() => setSelectedDay(null)} className="text-white/25 hover:text-white/60 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {selectedBookings.length === 0
            ? <p className="text-white/20 text-xs text-center py-8">Sin reservas</p>
            : <div className="space-y-3">
                {selectedBookings.map(b => (
                  <div key={b.id} className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                    <p className="text-[12px] font-medium text-[#F2EDE4]">{b.name ?? 'Sin nombre'}</p>
                    <p className="text-[10px] text-white/40 mt-0.5">{b.listing_name}</p>
                    <div className="flex gap-3 mt-2 text-[10px] text-white/30 flex-wrap">
                      {b.people_count && <span>{b.people_count} pax</span>}
                      {b.amount && <span>${(b.amount/100).toLocaleString()} USD</span>}
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  )
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
function formatUSD(cents: number) { return `$${(cents/100).toLocaleString('en-US')} USD` }

export default function ConciergeInner({ conversations, bookings, stats }: {
  conversations: Conversation[]; bookings: Booking[]; stats: Stats
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'chats'|'leads'|'reservas'|'calendario'|'analytics'>('reservas')
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookingFilter, setBookingFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const filteredLeads = statusFilter === 'all' ? conversations : conversations.filter(c => c.lead_status === statusFilter)
  const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter)

  async function updateBookingStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    router.refresh()
    setUpdating(null)
  }

  async function resendToSupplier(id: string) {
    setUpdating(id)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resend_supplier' }),
    })
    router.refresh()
    setUpdating(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sub-tab bar */}
      <div className="flex-shrink-0 border-b border-white/[0.06] px-2 sm:px-6 flex gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {(['chats','leads','reservas','calendario','analytics'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 sm:px-5 py-3.5 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.24em] uppercase font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab ? 'text-[#C4A45A] border-[#C4A45A]' : 'text-white/25 border-transparent hover:text-white/50'}`}
          >
            {tab === 'chats' ? `Chats (${conversations.length})`
              : tab === 'leads' ? 'Leads'
              : tab === 'reservas' ? `Reservas (${bookings.length})`
              : tab === 'calendario' ? 'Calendario'
              : 'Stats'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {/* CHATS */}
        {activeTab === 'chats' && (
          <div className="h-full flex">
            <div className={`${selectedConv ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 flex-shrink-0 flex-col border-r border-white/[0.06] overflow-y-auto`}>
              {conversations.length === 0
                ? <div className="p-8 text-center text-white/20 text-sm">Sin conversaciones</div>
                : conversations.map(conv => (
                    <button key={conv.id} onClick={() => setSelectedConv(conv)}
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
                      </div>
                      {conv.messages?.length > 0 && (
                        <p className="text-[11px] text-white/30 mt-1 truncate">
                          {conv.messages[conv.messages.length-1]?.content?.slice(0,55)}
                        </p>
                      )}
                    </button>
                  ))
              }
            </div>
            <div className={`${selectedConv ? 'flex' : 'hidden sm:flex'} flex-1 flex-col overflow-y-auto`}>
              {!selectedConv
                ? <div className="h-full flex items-center justify-center text-white/20 text-sm">Selecciona una conversación</div>
                : <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 w-full">
                    <button onClick={() => setSelectedConv(null)} className="sm:hidden flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 mb-4 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                      Volver
                    </button>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                        {selectedConv.group_size && <div><span className="text-white/30">Grupo</span><p className="text-white/70 mt-0.5">{selectedConv.group_size} personas</p></div>}
                        {selectedConv.travel_date && <div><span className="text-white/30">Fecha</span><p className="text-white/70 mt-0.5">{selectedConv.travel_date}</p></div>}
                        {selectedConv.budget_range && <div><span className="text-white/30">Budget</span><p className="text-white/70 mt-0.5">{selectedConv.budget_range}</p></div>}
                      </div>
                      {selectedConv.interests?.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {selectedConv.interests.map(i => <span key={i} className="text-[10px] px-2 py-0.5 bg-[#C4A45A]/10 text-[#C4A45A]/70 rounded-full">{i}</span>)}
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-3">
                      {(selectedConv.messages ?? []).map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user' ? 'bg-[#C4A45A]/15 text-[#F2EDE4] rounded-br-sm' : 'bg-white/[0.06] text-[#F2EDE4]/80 rounded-bl-sm'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              }
            </div>
          </div>
        )}

        {/* LEADS */}
        {activeTab === 'leads' && (
          <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">
            <div className="flex gap-2 mb-5 flex-wrap">
              {['all','new','qualified','booking','converted','cold'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-colors ${statusFilter === s ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/50'}`}>
                  {s === 'all' ? `All (${conversations.length})` : `${STATUS_LABELS[s]} (${conversations.filter(c => c.lead_status === s).length})`}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredLeads.map(conv => (
                <div key={conv.id} className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm font-medium truncate">{conv.name ?? `+${conv.phone}`}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[conv.lead_status]}`}>{STATUS_LABELS[conv.lead_status]}</span>
                    </div>
                    <div className="flex gap-3 mt-1 text-[11px] text-white/35 flex-wrap">
                      {conv.group_size && <span>{conv.group_size} pax</span>}
                      {conv.travel_date && <span>{conv.travel_date}</span>}
                      {conv.interests?.length ? <span>{conv.interests.slice(0,2).join(', ')}</span> : null}
                    </div>
                  </div>
                  <p className="text-[11px] text-white/25 flex-shrink-0">{timeAgo(conv.updated_at)}</p>
                </div>
              ))}
              {filteredLeads.length === 0 && <p className="text-center text-white/20 text-sm py-16">Sin leads</p>}
            </div>
          </div>
        )}

        {/* RESERVAS */}
        {activeTab === 'reservas' && (
          <div className="h-full overflow-y-auto px-4 sm:px-6 py-6">
            <div className="flex gap-2 mb-5 flex-wrap">
              {(['all','link_sent','confirmed','completed','cancelled'] as const).map(s => (
                <button key={s} onClick={() => setBookingFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-colors ${bookingFilter === s ? 'bg-[#C4A45A] text-[#080808]' : 'bg-white/[0.05] text-white/30 hover:text-white/50'}`}>
                  {s === 'all' ? `Todas (${bookings.length})` : `${BOOKING_LABELS[s]} (${bookings.filter(b => b.status === s).length})`}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredBookings.map(b => (
                <div key={b.id} className="px-4 py-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="text-sm font-medium">{b.name ?? 'Sin nombre'}</p>
                        {b.phone && <p className="text-[11px] text-white/30">+52{b.phone}</p>}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${BOOKING_COLORS[b.status] ?? 'bg-white/10 text-white/40'}`}>{BOOKING_LABELS[b.status] ?? b.status}</span>
                        {b.supplier_status && b.status !== 'link_sent' && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${SUPPLIER_COLORS[b.supplier_status] ?? 'bg-white/10 text-white/40'}`}>
                            {SUPPLIER_LABELS[b.supplier_status] ?? b.supplier_status}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-white/50 mb-1.5">{b.listing_name ?? 'Experiencia'}</p>
                      <div className="flex gap-3 text-[11px] text-white/30 flex-wrap">
                        {b.booking_date && (
                          <span className="text-white/45">
                            {b.booking_date}{b.start_time ? ` · ${slotLabel(b.start_time)}` : ''}
                          </span>
                        )}
                        {b.deposit_amount
                          ? <span>Depósito {formatUSD(b.deposit_amount)}{b.balance_due ? ` · saldo ${formatUSD(b.balance_due)}` : ''}</span>
                          : b.amount ? <span>{formatUSD(b.amount)}</span> : null}
                        {b.email && <span className="text-white/25">{b.email}</span>}
                        <span>{timeAgo(b.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {b.stripe_url && <a href={b.stripe_url} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2.5 py-1.5 bg-white/[0.05] text-white/40 rounded-lg hover:text-white/70 transition-colors">Ver pago</a>}
                      {b.status !== 'link_sent' && ['pending','sent','rejected'].includes(b.supplier_status ?? '') && (
                        <button onClick={() => resendToSupplier(b.id)} disabled={updating===b.id} className="text-[10px] px-2.5 py-1.5 bg-amber-500/10 text-amber-300 rounded-lg disabled:opacity-40">
                          {updating===b.id ? '...' : b.supplier_status === 'pending' ? 'Enviar a operador' : 'Reenviar'}
                        </button>
                      )}
                      {b.status === 'link_sent' && <button onClick={() => updateBookingStatus(b.id,'confirmed')} disabled={updating===b.id} className="text-[10px] px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg disabled:opacity-40">{updating===b.id?'...':'Confirmar'}</button>}
                      {b.status === 'confirmed' && <button onClick={() => updateBookingStatus(b.id,'completed')} disabled={updating===b.id} className="text-[10px] px-2.5 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg disabled:opacity-40">{updating===b.id?'...':'Completado'}</button>}
                      {(b.status==='link_sent'||b.status==='confirmed') && <button onClick={() => updateBookingStatus(b.id,'cancelled')} disabled={updating===b.id} className="text-[10px] px-2.5 py-1.5 bg-red-500/10 text-red-400 rounded-lg disabled:opacity-40">Cancelar</button>}
                    </div>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && <p className="text-center text-white/20 text-sm py-16">Sin reservas</p>}
            </div>
          </div>
        )}

        {activeTab === 'calendario' && <CalendarioTab />}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="h-full overflow-y-auto px-4 sm:px-6 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Chats', value: stats.total, color: 'text-white/70' },
                  { label: 'Qualified', value: stats.qualified, color: 'text-blue-400' },
                  { label: 'Links Sent', value: stats.linksSent, color: 'text-amber-400' },
                  { label: 'Converted', value: stats.converted, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className={`text-2xl font-light ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/30 mt-1 tracking-wider uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-4">Funnel</p>
                {[
                  {label:'Contactos',value:stats.total,color:'bg-white/20'},
                  {label:'Calificados',value:stats.qualified,color:'bg-blue-500/50'},
                  {label:'Links enviados',value:stats.linksSent,color:'bg-amber-500/50'},
                  {label:'Convertidos',value:stats.converted,color:'bg-emerald-500/50'},
                ].map(row => (
                  <div key={row.label} className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/40">{row.label}</span>
                      <span className="text-white/60">{row.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.color} transition-all duration-700`}
                        style={{width: stats.total>0 ? `${Math.round((row.value/stats.total)*100)}%` : '0%'}} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-2">Ingresos confirmados</p>
                <p className="text-3xl font-light text-emerald-400">
                  {formatUSD(bookings.filter(b=>['confirmed','completed'].includes(b.status)).reduce((s,b)=>s+(b.amount??0),0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
