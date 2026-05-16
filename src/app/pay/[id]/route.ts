import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data } = await supabase
    .from('bookings')
    .select('stripe_url')
    .eq('short_id', id)
    .maybeSingle()

  if (!data?.stripe_url) {
    return new NextResponse('Link no encontrado', { status: 404 })
  }

  return NextResponse.redirect(data.stripe_url, { status: 302 })
}
