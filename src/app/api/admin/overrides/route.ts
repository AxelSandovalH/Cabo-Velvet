import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listing_id, override_date, is_closed, reason } = await req.json()
  if (!listing_id || !override_date) {
    return NextResponse.json({ error: 'listing_id and override_date required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('listing_date_overrides')
    .upsert({ listing_id, override_date, is_closed: is_closed ?? true, reason: reason ?? null },
      { onConflict: 'listing_id,override_date' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const listing_id = searchParams.get('listing_id')
  const override_date = searchParams.get('override_date')

  if (!listing_id || !override_date) {
    return NextResponse.json({ error: 'listing_id and override_date required' }, { status: 400 })
  }

  await supabase
    .from('listing_date_overrides')
    .delete()
    .eq('listing_id', listing_id)
    .eq('override_date', override_date)

  return NextResponse.json({ success: true })
}
