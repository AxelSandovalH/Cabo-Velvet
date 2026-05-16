import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { sendWhatsApp } from '@/lib/concierge/ultramsg'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing config' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe webhook] signature error:', err)
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const { data: booking } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        stripe_payment_intent_id: String(session.payment_intent ?? ''),
      })
      .eq('stripe_session_id', session.id)
      .select('phone, name')
      .single()

    if (booking?.phone) {
      await supabase
        .from('conversations')
        .update({ lead_status: 'converted', updated_at: new Date().toISOString() })
        .eq('phone', booking.phone)

      const nombre = booking.name ? `, ${booking.name}` : ''
      await sendWhatsApp(
        `52${booking.phone}`,
        `✅ ¡Reserva confirmada${nombre}! Tu experiencia está apartada. Te contactamos 24h antes con todos los detalles. ¡Gracias por elegir Cabo Rico! 🌊`
      )
    }

    console.log('[stripe webhook] confirmed session:', session.id)
  }

  return NextResponse.json({ received: true })
}
