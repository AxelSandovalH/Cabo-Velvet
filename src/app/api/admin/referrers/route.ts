import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = await createSupabaseAdmin()

  // Fetch referrers
  const { data: referrers, error } = await db
    .from('referrers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Aggregate booking stats per referrer code
  const { data: bookingStats } = await db
    .from('bookings')
    .select('referrer_code, amount, status')
    .not('referrer_code', 'is', null)
    .in('status', ['link_sent', 'confirmed', 'completed'])

  const statsMap: Record<string, { bookings: number; revenue: number }> = {}
  for (const b of bookingStats ?? []) {
    if (!b.referrer_code) continue
    if (!statsMap[b.referrer_code]) statsMap[b.referrer_code] = { bookings: 0, revenue: 0 }
    statsMap[b.referrer_code].bookings += 1
    statsMap[b.referrer_code].revenue += b.amount ?? 0
  }

  const result = (referrers ?? []).map(r => ({
    ...r,
    bookings: statsMap[r.code]?.bookings ?? 0,
    revenue: statsMap[r.code]?.revenue ?? 0,
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, role, location, phone, commission_pct, code } = body

  if (!name || !code) {
    return NextResponse.json({ error: 'name and code required' }, { status: 400 })
  }

  const db = await createSupabaseAdmin()
  const { data, error } = await db
    .from('referrers')
    .insert({
      name,
      role: role ?? null,
      location: location ?? null,
      phone: phone ?? null,
      commission_pct: commission_pct ?? 10,
      code: code.toLowerCase().replace(/\s+/g, '-'),
      active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
