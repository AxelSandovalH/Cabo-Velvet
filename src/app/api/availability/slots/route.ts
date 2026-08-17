import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSlotAvailability } from '@/lib/slots'
import { isPublicListing } from '@/lib/providers'
import { splitPrice } from '@/lib/pricing'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const listingId = searchParams.get('listing_id')
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!listingId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'listing_id and date (YYYY-MM-DD) required' }, { status: 400 })
  }

  // agency_price stays server-side — we only ever return the split, never the cost
  const { data: listing } = await supabase
    .from('listings')
    .select('id, price, agency_price, category, provider_id')
    .eq('id', listingId)
    .eq('active', true)
    .single()

  if (!listing || !isPublicListing(listing)) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const slots = await getSlotAvailability(listingId, date)
  const split = splitPrice(listing, 1)

  return NextResponse.json({
    slots,
    depositPerPerson: split.depositCents,
    balancePerPerson: split.balanceDueCents,
    totalPerPerson: split.totalCents,
  })
}
