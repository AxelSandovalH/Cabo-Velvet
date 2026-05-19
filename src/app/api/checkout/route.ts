import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { checkAvailability } from '@/lib/availability'

export async function POST(req: NextRequest) {
  try {
    const { listingId, bookingDate, peopleCount = 1, guestName, guestPhone, referrerCode } = await req.json()

    if (!listingId) {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .select('id, name, tagline, price, price_unit, images, capacity')
      .eq('id', listingId)
      .eq('active', true)
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (!listing.price) {
      return NextResponse.json({ error: 'Listing has no price' }, { status: 400 })
    }

    // Check availability if listing has capacity and a date was provided
    if (listing.capacity != null && bookingDate) {
      const avail = await checkAvailability(listingId, bookingDate, peopleCount)
      if (!avail.available) {
        const messages: Record<string, string> = {
          past_date: 'Cannot book a past date',
          closed_weekday: 'This experience is not available on that day',
          admin_override: 'This date is not available',
          full: `Only ${avail.remaining} spots remaining for that date`,
        }
        return NextResponse.json(
          { error: messages[avail.reason ?? ''] ?? 'Date not available' },
          { status: 409 }
        )
      }
    }

    const qty = Math.max(1, Math.round(peopleCount))
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        quantity: qty,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(listing.price * 100),
          product_data: {
            name: listing.name,
            ...(listing.tagline ? { description: listing.tagline } : {}),
          },
        },
      }],
      metadata: {
        listingId: listing.id,
        bookingDate: bookingDate ?? '',
        peopleCount: String(qty),
        guestName: guestName ?? '',
        guestPhone: guestPhone ?? '',
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    // Insert booking immediately to reserve capacity
    await supabase.from('bookings').insert({
      listing_id: listing.id,
      stripe_session_id: session.id,
      stripe_url: session.url,
      status: 'link_sent',
      phone: guestPhone ?? null,
      name: guestName ?? null,
      amount: Math.round(listing.price * 100) * qty,
      booking_date: bookingDate ?? null,
      people_count: qty,
      referrer_code: referrerCode ?? null,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout error]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
