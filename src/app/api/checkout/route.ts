import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { listingId } = await req.json()

    if (!listingId) {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .select('id, name, tagline, price, price_unit, images')
      .eq('id', listingId)
      .eq('active', true)
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (!listing.price) {
      return NextResponse.json({ error: 'Listing has no price' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(listing.price * 100),
            product_data: {
              name: listing.name,
              description: listing.tagline ?? undefined,
            },
          },
        },
      ],
      metadata: { listingId: listing.id },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout error]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
