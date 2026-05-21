import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { getStripe } from '@/lib/stripe'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '') || 'https://www.caboricotours.com'
  const keySnippet = process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.slice(0, 12) + '...'
    : 'NOT SET'

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ quantity: 1, price_data: { currency: 'usd', unit_amount: 100, product_data: { name: 'Test' } } }],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })
    return NextResponse.json({ ok: true, key: keySnippet, siteUrl, session_id: session.id, url: session.url })
  } catch (err) {
    return NextResponse.json({ ok: false, key: keySnippet, siteUrl, error: String(err) })
  }
}
