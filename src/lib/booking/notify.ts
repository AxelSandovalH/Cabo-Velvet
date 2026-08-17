import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email/send'
import {
  BookingEmailData,
  customerDepositEmail,
  customerConfirmedEmail,
  supplierRequestEmail,
  adminRejectedEmail,
} from '@/lib/email/templates'

export type LoadedBooking = {
  data: BookingEmailData
  confirmToken: string
  supplierEmail: string | null
  supplierName: string | null
}

function siteUrl(): string {
  return (
    (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '') ||
    'https://www.caboricotours.com'
  )
}

async function logEvent(bookingId: string, type: string, detail?: unknown) {
  await supabase.from('booking_events').insert({
    booking_id: bookingId,
    type,
    detail: detail ?? null,
  })
}

/** Everything the templates need, in one query. */
export async function loadBooking(bookingId: string): Promise<LoadedBooking | null> {
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      'id, short_id, listing_id, booking_date, start_time, people_count, amount, deposit_amount, balance_due, name, phone, email, supplier_note, confirm_token'
    )
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    console.error('[notify] booking not found', bookingId, error?.message)
    return null
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('name, location, provider_id')
    .eq('id', booking.listing_id)
    .single()

  let supplierEmail: string | null = null
  let supplierName: string | null = null
  if (listing?.provider_id) {
    const { data: provider } = await supabase
      .from('providers')
      .select('name, contact_email')
      .eq('id', listing.provider_id)
      .single()
    supplierEmail = provider?.contact_email?.trim() || null
    supplierName = provider?.name ?? null
  }

  const total = booking.amount ?? 0
  const deposit = booking.deposit_amount ?? total
  return {
    confirmToken: booking.confirm_token,
    supplierEmail,
    supplierName,
    data: {
      reference: booking.short_id ?? booking.id.slice(0, 8).toUpperCase(),
      listingName: listing?.name ?? 'Experience',
      location: listing?.location ?? null,
      date: booking.booking_date,
      startTime: booking.start_time,
      people: booking.people_count ?? 1,
      totalCents: total,
      depositCents: deposit,
      balanceDueCents: booking.balance_due ?? Math.max(0, total - deposit),
      guestName: booking.name,
      guestPhone: booking.phone,
      guestEmail: booking.email,
      supplierNote: booking.supplier_note,
    },
  }
}

/** Email the operator with confirm/reject links. Flips supplier_status to `sent`. */
export async function notifySupplier(bookingId: string): Promise<boolean> {
  const loaded = await loadBooking(bookingId)
  if (!loaded) return false

  if (!loaded.supplierEmail) {
    console.error('[notify] provider has no contact_email — booking', bookingId)
    await logEvent(bookingId, 'supplier_notify_failed', { reason: 'no_contact_email' })
    return false
  }

  const url = `${siteUrl()}/reserva/${loaded.confirmToken}`
  const { subject, html } = supplierRequestEmail(loaded.data, url)
  const res = await sendEmail({ to: loaded.supplierEmail, subject, html })

  if (!res.ok) {
    await logEvent(bookingId, 'supplier_notify_failed', { error: res.error })
    return false
  }

  await supabase
    .from('bookings')
    .update({ supplier_status: 'sent', supplier_sent_at: new Date().toISOString() })
    .eq('id', bookingId)

  await logEvent(bookingId, 'supplier_notified', { to: loaded.supplierEmail, email_id: res.id })
  return true
}

/** Email the client that we took the deposit and are confirming. */
export async function notifyCustomerDeposit(bookingId: string): Promise<boolean> {
  const loaded = await loadBooking(bookingId)
  if (!loaded?.data.guestEmail) return false

  const { subject, html } = customerDepositEmail(loaded.data)
  const res = await sendEmail({ to: loaded.data.guestEmail, subject, html })
  if (!res.ok) {
    await logEvent(bookingId, 'customer_email_failed', { stage: 'deposit', error: res.error })
    return false
  }

  await supabase
    .from('bookings')
    .update({ customer_emailed_at: new Date().toISOString() })
    .eq('id', bookingId)

  await logEvent(bookingId, 'customer_deposit_email_sent', { to: loaded.data.guestEmail })
  return true
}

/** Email the client the final confirmation. */
export async function notifyCustomerConfirmed(bookingId: string): Promise<boolean> {
  const loaded = await loadBooking(bookingId)
  if (!loaded?.data.guestEmail) return false

  const { subject, html } = customerConfirmedEmail(loaded.data)
  const res = await sendEmail({ to: loaded.data.guestEmail, subject, html })
  if (!res.ok) {
    await logEvent(bookingId, 'customer_email_failed', { stage: 'confirmed', error: res.error })
    return false
  }

  await logEvent(bookingId, 'customer_confirmed_email_sent', { to: loaded.data.guestEmail })
  return true
}

/** A rejection means someone already paid for something we cannot deliver. */
export async function notifyAdminRejected(bookingId: string): Promise<boolean> {
  const admin = process.env.ADMIN_EMAIL?.trim()
  const loaded = await loadBooking(bookingId)
  if (!loaded || !admin) {
    if (!admin) console.error('[notify] ADMIN_EMAIL not set — rejection went unannounced')
    return false
  }

  const { subject, html } = adminRejectedEmail(loaded.data)
  const res = await sendEmail({ to: admin, subject, html })
  await logEvent(bookingId, res.ok ? 'admin_alerted' : 'admin_alert_failed', { error: res.error })
  return res.ok
}

export { logEvent }
