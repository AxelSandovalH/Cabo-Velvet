import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook signature error]', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const listingId = session.metadata?.listingId
    const customerEmail = session.customer_details?.email
    const amountPaid = session.amount_total ? session.amount_total / 100 : null

    console.log('[payment confirmed]', { listingId, customerEmail, amountPaid })

    // Log the sale to Supabase
    if (listingId) {
      await supabase.from('conversations').upsert(
        {
          phone: `stripe:${session.id}`,
          messages: [
            {
              role: 'assistant',
              content: `Pago confirmado: $${amountPaid} USD — listing ${listingId} — cliente ${customerEmail ?? 'unknown'}`,
            },
          ],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'phone' }
      )
    }
  }

  return NextResponse.json({ received: true })
}
