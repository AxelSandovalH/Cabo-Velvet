import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { sendWhatsApp } from '@/lib/concierge/ultramsg'
import { notifyCustomerDeposit, notifySupplier, logEvent } from '@/lib/booking/notify'
import { formatUSD } from '@/lib/pricing'

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
    const meta = session.metadata ?? {}
    const customerEmail = session.customer_details?.email ?? null

    const { data: booking } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        stripe_payment_intent_id: String(session.payment_intent ?? ''),
        ...(customerEmail ? { email: customerEmail } : {}),
        ...(meta.bookingDate ? { booking_date: meta.bookingDate } : {}),
        ...(meta.startTime ? { start_time: meta.startTime } : {}),
        ...(meta.peopleCount ? { people_count: parseInt(meta.peopleCount) } : {}),
        ...(meta.guestName ? { name: meta.guestName } : {}),
        ...(meta.guestPhone ? { phone: meta.guestPhone } : {}),
      })
      .eq('stripe_session_id', session.id)
      .select('id, phone, name, booking_date, people_count, balance_due, supplier_status')
      .single()

    if (!booking) {
      console.error('[stripe webhook] no booking for session', session.id)
      return NextResponse.json({ received: true })
    }

    await logEvent(booking.id, 'payment_received', {
      session: session.id,
      amount_total: session.amount_total,
      email: customerEmail,
    })

    if (booking.phone) {
      await supabase
        .from('conversations')
        .update({ lead_status: 'converted', updated_at: new Date().toISOString() })
        .eq('phone', booking.phone)
    }

    // 1. Tell the client we have their deposit
    await notifyCustomerDeposit(booking.id)

    // 2. Ask the operator to confirm the seat
    if (booking.supplier_status === 'pending') {
      await notifySupplier(booking.id)
    }

    // 3. WhatsApp, when we have a number — same message, different channel
    if (booking.phone) {
      const nombre = booking.name ? `, ${booking.name}` : ''
      const dateStr = booking.booking_date
        ? ` para el ${new Date(booking.booking_date + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}`
        : ''
      const paxStr = booking.people_count && booking.people_count > 1 ? ` (${booking.people_count} personas)` : ''
      const saldo = booking.balance_due
        ? `\n\nSaldo a pagar en el lugar: ${formatUSD(booking.balance_due)}.`
        : ''
      await sendWhatsApp(
        `52${booking.phone}`,
        `Recibimos tu depósito${nombre}${dateStr}${paxStr}. 🌊\n\nEstamos confirmando tu lugar con el operador y te avisamos por correo en cuanto quede.${saldo}`
      )
    }

    console.log('[stripe webhook] processed session:', session.id)
  }

  return NextResponse.json({ received: true })
}
