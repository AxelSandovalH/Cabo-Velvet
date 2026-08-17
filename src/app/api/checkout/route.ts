import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { checkAvailability } from '@/lib/availability'
import { isPublicListing } from '@/lib/providers'
import { splitPrice, formatUSD } from '@/lib/pricing'
import { checkSlot, fetchSlots, formatTime } from '@/lib/slots'

export async function POST(req: NextRequest) {
  try {
    const {
      listingId,
      bookingDate,
      startTime,
      peopleCount = 1,
      guestName,
      guestPhone,
      referrerCode,
    } = await req.json()

    if (!listingId) {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .select('id, name, tagline, price, agency_price, price_unit, images, capacity, category, provider_id')
      .eq('id', listingId)
      .eq('active', true)
      .single()

    if (error || !listing || !isPublicListing(listing)) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (!listing.price) {
      return NextResponse.json({ error: 'Listing has no price' }, { status: 400 })
    }

    const qty = Math.max(1, Math.round(peopleCount))

    // Check availability if listing has capacity and a date was provided
    if (listing.capacity != null && bookingDate) {
      const avail = await checkAvailability(listingId, bookingDate, qty)
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

    // A listing with configured departure times requires picking one
    const slots = bookingDate ? await fetchSlots(listing.id) : []
    if (slots.length && !startTime) {
      return NextResponse.json({ error: 'Please select a departure time' }, { status: 400 })
    }

    if (bookingDate && startTime) {
      const slotCheck = await checkSlot(listing.id, bookingDate, startTime, qty)
      if (!slotCheck.ok) {
        const messages: Record<string, string> = {
          slot_not_available: 'That departure time is not available on this date',
          slot_full: `Only ${slotCheck.remaining} spots left at that time`,
        }
        return NextResponse.json(
          { error: messages[slotCheck.reason ?? ''] ?? 'Time not available' },
          { status: 409 }
        )
      }
    }

    // The client pays our margin now; the operator collects the rest on site
    const { totalCents, depositCents, balanceDueCents } = splitPrice(listing, qty)

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '') || 'https://www.caboricotours.com'
    const whenLabel = [
      bookingDate,
      startTime ? formatTime(startTime) : null,
    ].filter(Boolean).join(' · ')

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: depositCents,
          product_data: {
            name: `Reservation deposit — ${listing.name}`,
            description: `${qty} ${qty === 1 ? 'guest' : 'guests'}${whenLabel ? ` · ${whenLabel}` : ''} · ${formatUSD(balanceDueCents)} due on site`,
          },
        },
      }],
      metadata: {
        listingId: listing.id,
        bookingDate: bookingDate ?? '',
        startTime: startTime ?? '',
        peopleCount: String(qty),
        guestName: guestName ?? '',
        guestPhone: guestPhone ?? '',
        depositCents: String(depositCents),
        balanceDueCents: String(balanceDueCents),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    // Insert booking immediately to hold the seat
    await supabase.from('bookings').insert({
      listing_id: listing.id,
      stripe_session_id: session.id,
      stripe_url: session.url,
      status: 'link_sent',
      phone: guestPhone ?? null,
      name: guestName ?? null,
      amount: totalCents,
      deposit_amount: depositCents,
      balance_due: balanceDueCents,
      booking_date: bookingDate ?? null,
      start_time: startTime || null,
      people_count: qty,
      referrer_code: referrerCode ?? null,
      supplier_status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout error]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
