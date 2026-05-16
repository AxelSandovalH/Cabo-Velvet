import { NextRequest, NextResponse } from 'next/server'
import { getMonthAvailability } from '@/lib/availability'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const listingId = searchParams.get('listing_id')
  const monthParam = searchParams.get('month') // YYYY-MM

  if (!listingId || !monthParam) {
    return NextResponse.json({ error: 'listing_id and month required' }, { status: 400 })
  }

  const [year, month] = monthParam.split('-').map(Number)
  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Invalid month format. Use YYYY-MM' }, { status: 400 })
  }

  const data = await getMonthAvailability(listingId, year, month)
  return NextResponse.json(data)
}
