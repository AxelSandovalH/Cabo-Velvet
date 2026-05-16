import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const monthParam = searchParams.get('month') // YYYY-MM
  const listingId = searchParams.get('listing_id')

  if (!monthParam) return NextResponse.json({ error: 'month required' }, { status: 400 })

  const [year, month] = monthParam.split('-').map(Number)
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const lastDayStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  let q = supabase
    .from('bookings')
    .select('id, listing_id, name, phone, people_count, status, amount, booking_date')
    .gte('booking_date', firstDay)
    .lte('booking_date', lastDayStr)
    .in('status', ['link_sent', 'confirmed', 'completed'])
    .order('booking_date')

  if (listingId) q = q.eq('listing_id', listingId)

  const { data: bookings } = await q

  // Fetch listing names
  const listingIds = [...new Set((bookings ?? []).map(b => b.listing_id).filter(Boolean))]
  const { data: listings } = await supabase
    .from('listings')
    .select('id, name')
    .in('id', listingIds)

  const listingMap: Record<string, string> = {}
  for (const l of listings ?? []) listingMap[l.id] = l.name

  // Group by date
  const byDate: Record<string, unknown[]> = {}
  for (const b of bookings ?? []) {
    if (!b.booking_date) continue
    if (!byDate[b.booking_date]) byDate[b.booking_date] = []
    byDate[b.booking_date].push({
      ...b,
      listing_name: listingMap[b.listing_id] ?? '—',
    })
  }

  return NextResponse.json(byDate)
}
