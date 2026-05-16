import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import ConciergeClient from './ConciergeClient'

export const revalidate = 0

export default async function ConciergePage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const db = await createSupabaseAdmin()

  const [{ data: conversations }, { data: bookings }] = await Promise.all([
    db.from('conversations')
      .select('id, phone, name, lead_status, interests, budget_range, travel_date, group_size, messages, updated_at, created_at')
      .order('updated_at', { ascending: false })
      .limit(100),
    db.from('bookings')
      .select('id, listing_id, stripe_url, status, created_at, conversation_id')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  // Analytics
  const total = conversations?.length ?? 0
  const qualified = conversations?.filter((c) => ['qualified', 'booking', 'converted'].includes(c.lead_status)).length ?? 0
  const converted = conversations?.filter((c) => c.lead_status === 'converted').length ?? 0
  const linksSent = bookings?.filter((b) => b.status === 'link_sent' || b.status === 'confirmed').length ?? 0

  return (
    <ConciergeClient
      conversations={conversations ?? []}
      bookings={bookings ?? []}
      stats={{ total, qualified, converted, linksSent }}
    />
  )
}
