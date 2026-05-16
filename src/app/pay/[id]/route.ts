import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data } = await db
    .from('bookings')
    .select('stripe_url')
    .eq('short_id', id)
    .maybeSingle()

  if (!data?.stripe_url) {
    return new NextResponse('Link no encontrado', { status: 404 })
  }

  return NextResponse.redirect(data.stripe_url, { status: 302 })
}
