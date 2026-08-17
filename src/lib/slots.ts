import { supabase } from './supabase'

export type TimeSlot = {
  id: string
  start_time: string      // "09:00:00"
  label: string | null
  capacity: number | null
  weekdays: number[]
  sort_order: number
}

export type SlotAvailability = TimeSlot & {
  booked: number
  available: number | null  // null → no capacity limit configured
  soldOut: boolean
}

/** Booking states that hold a seat. A rejected supplier response releases it. */
const HOLDING_STATUSES = ['link_sent', 'confirmed', 'completed']
const RELEASED_SUPPLIER_STATUSES = ['rejected', 'cancelled']

export async function fetchSlots(listingId: string): Promise<TimeSlot[]> {
  const { data, error } = await supabase
    .from('listing_time_slots')
    .select('id, start_time, label, capacity, weekdays, sort_order')
    .eq('listing_id', listingId)
    .eq('active', true)
    .order('sort_order')
    .order('start_time')

  if (error) {
    console.error('[fetchSlots]', error.message)
    return []
  }
  return (data ?? []) as TimeSlot[]
}

/** Slots that run on a given date, with how many seats are left on each. */
export async function getSlotAvailability(
  listingId: string,
  date: string // YYYY-MM-DD
): Promise<SlotAvailability[]> {
  const [{ data: listing }, slots] = await Promise.all([
    supabase.from('listings').select('capacity').eq('id', listingId).single(),
    fetchSlots(listingId),
  ])

  if (!slots.length) return []

  const dow = new Date(date + 'T12:00:00').getDay()
  const running = slots.filter(s => !s.weekdays?.length || s.weekdays.includes(dow))

  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time, people_count, supplier_status')
    .eq('listing_id', listingId)
    .eq('booking_date', date)
    .in('status', HOLDING_STATUSES)

  const bookedBySlot: Record<string, number> = {}
  for (const b of bookings ?? []) {
    if (!b.start_time) continue
    if (RELEASED_SUPPLIER_STATUSES.includes(b.supplier_status)) continue
    bookedBySlot[b.start_time] = (bookedBySlot[b.start_time] ?? 0) + (b.people_count ?? 1)
  }

  return running.map(slot => {
    const capacity = slot.capacity ?? listing?.capacity ?? null
    const booked = bookedBySlot[slot.start_time] ?? 0
    const available = capacity == null ? null : Math.max(0, capacity - booked)
    return { ...slot, booked, available, soldOut: available !== null && available === 0 }
  })
}

/** Guard used before creating a Stripe session. */
export async function checkSlot(
  listingId: string,
  date: string,
  startTime: string,
  peopleCount: number
): Promise<{ ok: boolean; reason?: string; remaining?: number }> {
  const slots = await getSlotAvailability(listingId, date)

  // A listing with no configured slots books by date only
  if (!slots.length) return { ok: true }

  const slot = slots.find(s => s.start_time === startTime)
  if (!slot) return { ok: false, reason: 'slot_not_available' }
  if (slot.available !== null && slot.available < peopleCount) {
    return { ok: false, reason: 'slot_full', remaining: slot.available }
  }
  return { ok: true, remaining: slot.available ?? undefined }
}

/** "09:00:00" → "9:00 AM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
