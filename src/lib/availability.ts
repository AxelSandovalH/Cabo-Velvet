import { supabase } from './supabase'

export type DayStatus = {
  booked: number
  available: number
  closed: boolean
  reason?: string
}

export type AvailabilityMap = Record<string, DayStatus>

export async function getMonthAvailability(
  listingId: string,
  year: number,
  month: number // 1-12
): Promise<{ capacity: number | null; closedWeekdays: number[]; days: AvailabilityMap }> {
  const { data: listing } = await supabase
    .from('listings')
    .select('capacity, closed_weekdays')
    .eq('id', listingId)
    .single()

  const capacity: number | null = listing?.capacity ?? null
  const closedWeekdays: number[] = listing?.closed_weekdays ?? []

  // Date range for the month
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0) // last day of month
  const lastDayStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`

  // Fetch admin overrides for this month
  const { data: overrides } = await supabase
    .from('listing_date_overrides')
    .select('override_date, is_closed, reason')
    .eq('listing_id', listingId)
    .gte('override_date', firstDay)
    .lte('override_date', lastDayStr)

  const overrideMap: Record<string, { is_closed: boolean; reason?: string }> = {}
  for (const o of overrides ?? []) {
    overrideMap[o.override_date] = { is_closed: o.is_closed, reason: o.reason }
  }

  // Fetch bookings aggregated by day
  const { data: bookings } = await supabase
    .from('bookings')
    .select('booking_date, people_count')
    .eq('listing_id', listingId)
    .in('status', ['link_sent', 'confirmed', 'completed'])
    .gte('booking_date', firstDay)
    .lte('booking_date', lastDayStr)
    .not('booking_date', 'is', null)

  const bookedByDay: Record<string, number> = {}
  for (const b of bookings ?? []) {
    if (!b.booking_date) continue
    bookedByDay[b.booking_date] = (bookedByDay[b.booking_date] ?? 0) + (b.people_count ?? 1)
  }

  // Build day map
  const days: AvailabilityMap = {}
  const totalDays = lastDay.getDate()

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dow = new Date(year, month - 1, d).getDay() // 0=Sun

    const override = overrideMap[dateStr]
    const isAdminClosed = override?.is_closed === true
    const isWeekdayClosed = closedWeekdays.includes(dow)
    const closed = isAdminClosed || isWeekdayClosed

    const booked = bookedByDay[dateStr] ?? 0
    const available = capacity == null ? (closed ? 0 : 999) : Math.max(0, capacity - booked)

    days[dateStr] = {
      booked,
      available: closed ? 0 : available,
      closed,
      ...(override?.reason ? { reason: override.reason } : {}),
    }
  }

  return { capacity, closedWeekdays, days }
}

export async function checkAvailability(
  listingId: string,
  bookingDate: string, // YYYY-MM-DD
  peopleCount: number
): Promise<{ available: boolean; remaining: number; reason?: string }> {
  const [year, month] = bookingDate.split('-').map(Number)
  const { capacity, closedWeekdays, days } = await getMonthAvailability(listingId, year, month)

  // Past date check
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (new Date(bookingDate) < today) {
    return { available: false, remaining: 0, reason: 'past_date' }
  }

  const day = days[bookingDate]
  if (!day) return { available: false, remaining: 0, reason: 'not_found' }

  const dow = new Date(bookingDate + 'T12:00:00').getDay()
  if (closedWeekdays.includes(dow)) {
    return { available: false, remaining: 0, reason: 'closed_weekday' }
  }
  if (day.closed) {
    return { available: false, remaining: 0, reason: 'admin_override' }
  }

  if (capacity != null && day.available < peopleCount) {
    return { available: false, remaining: day.available, reason: 'full' }
  }

  return { available: true, remaining: day.available }
}
