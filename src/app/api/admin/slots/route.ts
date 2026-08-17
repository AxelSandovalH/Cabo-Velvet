import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase as db } from '@/lib/supabase'

async function requireUser() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  return user
}

/** All departure times for a listing, or a count per listing when no id is given. */
export async function GET(req: NextRequest) {
  if (!await requireUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listingId = new URL(req.url).searchParams.get('listing_id')

  if (!listingId) {
    const { data, error } = await db.from('listing_time_slots').select('listing_id').eq('active', true)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const counts: Record<string, number> = {}
    for (const s of data ?? []) counts[s.listing_id] = (counts[s.listing_id] ?? 0) + 1
    return NextResponse.json({ counts })
  }

  const { data, error } = await db
    .from('listing_time_slots')
    .select('*')
    .eq('listing_id', listingId)
    .order('sort_order')
    .order('start_time')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  if (!await requireUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listing_id, start_time, label, capacity, weekdays, applyToProvider } = await req.json()

  if (!listing_id || !start_time) {
    return NextResponse.json({ error: 'listing_id y start_time son obligatorios' }, { status: 400 })
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(start_time)) {
    return NextResponse.json({ error: 'La hora debe tener formato HH:MM' }, { status: 400 })
  }

  // Copying a departure time across a whole agency beats typing it 27 times
  let targets = [listing_id]
  if (applyToProvider) {
    const { data: source } = await db
      .from('listings').select('provider_id, category').eq('id', listing_id).single()
    if (source?.provider_id) {
      const { data: siblings } = await db
        .from('listings').select('id')
        .eq('provider_id', source.provider_id)
        .eq('category', source.category)
        .eq('active', true)
      targets = (siblings ?? []).map(s => s.id)
    }
  }

  const rows = targets.map(id => ({
    listing_id: id,
    start_time,
    label: label?.trim() || null,
    capacity: capacity === '' || capacity == null ? null : Number(capacity),
    weekdays: Array.isArray(weekdays) ? weekdays : [],
    active: true,
  }))

  const { error } = await db
    .from('listing_time_slots')
    .upsert(rows, { onConflict: 'listing_id,start_time' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, applied: rows.length })
}

export async function PATCH(req: NextRequest) {
  if (!await requireUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, label, capacity, weekdays, active } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const update: Record<string, unknown> = {}
  if (label !== undefined) update.label = label?.trim() || null
  if (capacity !== undefined) update.capacity = capacity === '' || capacity == null ? null : Number(capacity)
  if (weekdays !== undefined) update.weekdays = Array.isArray(weekdays) ? weekdays : []
  if (active !== undefined) update.active = active

  const { error } = await db.from('listing_time_slots').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!await requireUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Refuse to delete a time that future guests already booked
  const { data: slot } = await db
    .from('listing_time_slots').select('listing_id, start_time').eq('id', id).single()

  if (slot) {
    const today = new Date().toISOString().slice(0, 10)
    const { count } = await db
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('listing_id', slot.listing_id)
      .eq('start_time', slot.start_time)
      .gte('booking_date', today)
      .in('status', ['link_sent', 'confirmed', 'completed'])

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Hay ${count} reserva(s) futura(s) en ese horario. Desactívalo en lugar de borrarlo.` },
        { status: 409 }
      )
    }
  }

  const { error } = await db.from('listing_time_slots').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
