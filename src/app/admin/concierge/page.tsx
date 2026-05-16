import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import ConciergeClient from './ConciergeClient'

export const revalidate = 0

export default async function ConciergePage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const db = await createSupabaseAdmin()

  const [{ data: conversations }, { data: bookings }, { data: allMessages }, { data: listings }] = await Promise.all([
    db.from('conversations')
      .select('id, phone, name, lead_status, interests, budget_range, travel_date, group_size, updated_at, created_at')
      .order('updated_at', { ascending: false })
      .limit(100),
    db.from('bookings')
      .select('id, listing_id, stripe_url, status, created_at, conversation_id, phone, name, amount, confirmed_at')
      .order('created_at', { ascending: false })
      .limit(100),
    db.from('messages')
      .select('phone, role, content, created_at')
      .order('created_at', { ascending: true })
      .limit(2000),
    db.from('listings')
      .select('id, name')
      .eq('active', true),
  ])

  // Group messages by phone
  const messagesByPhone: Record<string, { role: string; content: string }[]> = {}
  for (const msg of (allMessages ?? [])) {
    if (!messagesByPhone[msg.phone]) messagesByPhone[msg.phone] = []
    messagesByPhone[msg.phone].push({ role: msg.role, content: msg.content })
  }

  const conversationsWithMessages = (conversations ?? []).map((c) => ({
    ...c,
    messages: messagesByPhone[c.phone] ?? [],
  }))

  // Join listing names onto bookings
  const listingMap: Record<string, string> = {}
  for (const l of (listings ?? [])) listingMap[l.id] = l.name

  const bookingsWithListings = (bookings ?? []).map((b) => ({
    ...b,
    listing_name: b.listing_id ? (listingMap[b.listing_id] ?? null) : null,
  }))

  // Analytics
  const total = conversations?.length ?? 0
  const qualified = conversations?.filter((c) => ['qualified', 'booking', 'converted'].includes(c.lead_status)).length ?? 0
  const converted = conversations?.filter((c) => c.lead_status === 'converted').length ?? 0
  const linksSent = bookings?.filter((b) => ['link_sent', 'confirmed', 'completed'].includes(b.status)).length ?? 0

  return (
    <ConciergeClient
      conversations={conversationsWithMessages}
      bookings={bookingsWithListings}
      stats={{ total, qualified, converted, linksSent }}
    />
  )
}
