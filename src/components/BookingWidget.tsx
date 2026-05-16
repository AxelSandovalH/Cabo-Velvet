'use client'

import { useState, useEffect, useCallback } from 'react'

type DayStatus = {
  booked: number
  available: number
  closed: boolean
  reason?: string
}

type AvailabilityData = {
  capacity: number | null
  closedWeekdays: number[]
  days: Record<string, DayStatus>
}

interface Props {
  listingId: string
  price: number
  priceUnit: string | null
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function toMonthParam(y: number, m: number) {
  return `${y}-${String(m).padStart(2, '0')}`
}

export default function BookingWidget({ listingId, price, priceUnit }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [avail, setAvail] = useState<AvailabilityData | null>(null)
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [people, setPeople] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  const fetchAvail = useCallback(async (y: number, m: number) => {
    setLoadingAvail(true)
    try {
      const res = await fetch(`/api/availability?listing_id=${listingId}&month=${toMonthParam(y, m)}`)
      const data = await res.json()
      setAvail(data)
    } finally {
      setLoadingAvail(false)
    }
  }, [listingId])

  useEffect(() => {
    fetchAvail(viewYear, viewMonth)
  }, [fetchAvail, viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
    setSelectedDate(null)
  }

  function isBeforeToday(y: number, m: number, d: number) {
    const date = new Date(y, m - 1, d)
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return date < t
  }

  // Build calendar grid
  const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function getDayInfo(d: number) {
    const dateStr = toYMD(viewYear, viewMonth, d)
    const past = isBeforeToday(viewYear, viewMonth, d)
    const status = avail?.days[dateStr]
    return { dateStr, past, status }
  }

  function dayClass(d: number): string {
    const { past, status } = getDayInfo(d)
    const dateStr = toYMD(viewYear, viewMonth, d)
    const isSelected = selectedDate === dateStr

    if (isSelected) return 'bg-[#C4A45A] text-[#080808] font-semibold cursor-pointer'
    if (past) return 'text-white/15 cursor-not-allowed'
    if (!status) return 'text-[#9A9080] hover:bg-white/[0.06] cursor-pointer'
    if (status.closed) return 'text-white/15 cursor-not-allowed line-through'
    if (status.available === 0) return 'text-white/15 cursor-not-allowed'
    if (avail?.capacity && status.booked > 0) return 'text-[#F2EDE4] hover:bg-white/[0.06] cursor-pointer ring-1 ring-[#C4A45A]/40'
    return 'text-[#F2EDE4] hover:bg-white/[0.06] cursor-pointer'
  }

  function handleDayClick(d: number) {
    const { dateStr, past, status } = getDayInfo(d)
    if (past) return
    if (status?.closed || status?.available === 0) return
    setSelectedDate(dateStr === selectedDate ? null : dateStr)
    setError('')
    // Clamp people to available spots
    if (status?.available && people > status.available) setPeople(status.available)
  }

  const selectedStatus = selectedDate ? avail?.days[selectedDate] : null
  const maxPeople = selectedStatus?.available ?? (avail?.capacity ?? 20)
  const total = price * people

  async function handleBook() {
    if (!selectedDate) { setError('Please select a date'); return }
    setBooking(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          bookingDate: selectedDate,
          peopleCount: people,
          guestName: guestName || undefined,
          guestPhone: guestPhone || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error ?? 'Could not process booking')
        if (res.status === 409) fetchAvail(viewYear, viewMonth)
      } else {
        window.location.href = json.url
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  const isPrevDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          className="p-2 text-[#6A6050] hover:text-[#C4A45A] disabled:opacity-20 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-[11px] tracking-[0.28em] text-[#F2EDE4] uppercase">
          {MONTHS[viewMonth - 1]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 text-[#6A6050] hover:text-[#C4A45A] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[9px] tracking-[0.2em] text-[#4A4038] uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-y-1 mb-6 transition-opacity duration-200 ${loadingAvail ? 'opacity-40' : 'opacity-100'}`}>
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <button
                onClick={() => handleDayClick(d)}
                className={`w-9 h-9 rounded-full text-[12px] transition-all duration-150 ${dayClass(d)}`}
              >
                {d}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 text-[9px] tracking-[0.15em] text-[#4A4038] uppercase">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C4A45A]/40 ring-1 ring-[#C4A45A]/60 inline-block" />
          Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10 inline-block" />
          Full / Closed
        </span>
      </div>

      {/* Booking form — shown after date selected */}
      {selectedDate && (
        <div className="border-t border-white/[0.06] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] text-[#C4A45A] uppercase">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </span>
            {selectedStatus?.available != null && avail?.capacity && (
              <span className="text-[9px] text-[#6A6050]">
                {selectedStatus.available} spots left
              </span>
            )}
          </div>

          {/* People stepper */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[0.2em] text-[#8A8070] uppercase">Guests</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPeople(p => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center border border-white/[0.08] text-[#8A8070] hover:border-[#C4A45A]/40 hover:text-[#C4A45A] transition-colors"
              >
                −
              </button>
              <span className="text-[#F2EDE4] text-sm w-4 text-center">{people}</span>
              <button
                onClick={() => setPeople(p => Math.min(maxPeople, p + 1))}
                disabled={people >= maxPeople}
                className="w-8 h-8 flex items-center justify-center border border-white/[0.08] text-[#8A8070] hover:border-[#C4A45A]/40 hover:text-[#C4A45A] transition-colors disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* Optional guest info */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#3A3028] text-[12px] px-3 py-2.5 outline-none focus:border-[#C4A45A]/40 transition-colors"
            />
            <input
              type="tel"
              placeholder="WhatsApp number (optional)"
              value={guestPhone}
              onChange={e => setGuestPhone(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F2EDE4] placeholder-[#3A3028] text-[12px] px-3 py-2.5 outline-none focus:border-[#C4A45A]/40 transition-colors"
            />
          </div>

          {/* Total + CTA */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-[#4A4038] uppercase">Total</p>
              <p className="font-display text-2xl font-light text-[#F2EDE4]"
                style={{ fontFamily: 'var(--font-cormorant)' }}>
                ${total.toLocaleString()} USD
              </p>
              {people > 1 && (
                <p className="text-[9px] text-[#4A4038]">${price} × {people} guests</p>
              )}
            </div>
            <button
              onClick={handleBook}
              disabled={booking}
              className="px-7 py-3.5 bg-[#C4A45A] text-[#080808] text-[10px] tracking-[0.28em] uppercase font-semibold hover:bg-[#D4B468] disabled:opacity-60 transition-colors"
            >
              {booking ? 'Processing…' : 'Reserve'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-[11px] text-center">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}
