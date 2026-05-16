import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/availability'

export async function POST(req: NextRequest) {
  const { listing_id, booking_date, people_count } = await req.json()

  if (!listing_id || !booking_date || !people_count) {
    return NextResponse.json({ error: 'listing_id, booking_date, people_count required' }, { status: 400 })
  }

  const result = await checkAvailability(listing_id, booking_date, people_count)
  return NextResponse.json(result, { status: result.available ? 200 : 409 })
}
