import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logEvent, notifyCustomerConfirmed, notifyAdminRejected } from '@/lib/booking/notify'

/**
 * The operator answers from the emailed link. The token in the URL is the only
 * credential — it is a random uuid tied to a single booking, and it can only
 * move that booking between supplier states. Nothing else is reachable with it.
 */
export async function POST(req: NextRequest) {
  const { token, action, note, reference } = await req.json()

  if (!token || !['confirm', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'token and action required' }, { status: 400 })
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, supplier_status, status')
    .eq('confirm_token', token)
    .maybeSingle()

  if (!booking) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // Already answered — report the state instead of overwriting it
  if (['confirmed', 'rejected'].includes(booking.supplier_status)) {
    return NextResponse.json({ alreadyAnswered: true, supplierStatus: booking.supplier_status })
  }

  const supplierStatus = action === 'confirm' ? 'confirmed' : 'rejected'

  const { error } = await supabase
    .from('bookings')
    .update({
      supplier_status: supplierStatus,
      supplier_responded_at: new Date().toISOString(),
      ...(note ? { supplier_note: String(note).slice(0, 500) } : {}),
      ...(reference ? { supplier_ref: String(reference).slice(0, 100) } : {}),
    })
    .eq('id', booking.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logEvent(booking.id, action === 'confirm' ? 'supplier_confirmed' : 'supplier_rejected', {
    note: note ?? null,
    reference: reference ?? null,
  })

  if (action === 'confirm') {
    await notifyCustomerConfirmed(booking.id)
  } else {
    await notifyAdminRejected(booking.id)
  }

  return NextResponse.json({ ok: true, supplierStatus })
}
