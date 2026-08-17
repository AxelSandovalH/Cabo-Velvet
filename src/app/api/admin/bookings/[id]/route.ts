import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase-server'
import { notifySupplier } from '@/lib/booking/notify'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status, action } = await req.json()

  // Re-send the confirmation request to the operator
  if (action === 'resend_supplier') {
    const ok = await notifySupplier(id)
    return NextResponse.json(
      ok ? { success: true } : { error: 'Could not email the operator — check their contact_email' },
      { status: ok ? 200 : 502 }
    )
  }

  if (!status) return NextResponse.json({ error: 'status or action required' }, { status: 400 })

  const update: Record<string, unknown> = { status }
  if (status === 'confirmed') update.confirmed_at = new Date().toISOString()
  // Cancelling a booking releases the seat on the operator's side too
  if (status === 'cancelled') update.supplier_status = 'cancelled'

  const { error } = await db.from('bookings').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
