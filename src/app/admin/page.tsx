import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import AdminApp from './AdminApp'

const CATEGORY_LABEL: Record<string, string> = {
  experience: 'Experiencias',
  villa: 'Villas',
  yacht: 'Yachts',
  service: 'Servicios',
}
const CATEGORY_ORDER = ['experience', 'villa', 'yacht', 'service']

export default async function AdminPage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const db = await createSupabaseAdmin()

  const [
    { data: rawListings },
    { data: providers },
    { data: adminListings },
    { data: conversations },
    { data: bookings },
    { data: allMessages },
    { data: activeListings },
  ] = await Promise.all([
    db.from('listings').select('id, name, category, images, provider_id').order('name'),
    db.from('providers').select('id, name'),
    db.from('listings').select('id, name, category, price, capacity, closed_weekdays, active').order('name'),
    db.from('conversations')
      .select('id, phone, name, lead_status, interests, budget_range, travel_date, group_size, updated_at, created_at')
      .order('updated_at', { ascending: false }).limit(100),
    db.from('bookings')
      .select('id, listing_id, stripe_url, status, created_at, conversation_id, phone, name, amount, confirmed_at')
      .order('created_at', { ascending: false }).limit(100),
    db.from('messages').select('phone, role, content, created_at').order('created_at', { ascending: true }).limit(2000),
    db.from('listings').select('id, name').eq('active', true),
  ])

  // Build dashboard category tree
  const providerMap = Object.fromEntries((providers ?? []).map((p: { id: string; name: string }) => [p.id, p.name]))
  type DashboardListing = {
    id: string; name: string; category: string
    images: string[] | null; provider_id: string | null
  }
  const grouped: Record<string, Record<string, DashboardListing[]>> = {}
  for (const l of (rawListings ?? []) as DashboardListing[]) {
    const cat = l.category ?? 'other'
    const agency = l.provider_id ? (providerMap[l.provider_id] ?? 'Sin agencia') : 'Sin agencia'
    if (!grouped[cat]) grouped[cat] = {}
    if (!grouped[cat][agency]) grouped[cat][agency] = []
    grouped[cat][agency].push(l)
  }
  const categories = CATEGORY_ORDER
    .filter((cat) => grouped[cat])
    .map((cat) => ({
      cat,
      label: CATEGORY_LABEL[cat] ?? cat,
      agencies: Object.entries(grouped[cat])
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, listings]) => ({ name, listings })),
    }))

  // Build concierge data
  const messagesByPhone: Record<string, { role: string; content: string }[]> = {}
  for (const msg of (allMessages ?? [])) {
    if (!messagesByPhone[msg.phone]) messagesByPhone[msg.phone] = []
    messagesByPhone[msg.phone].push({ role: msg.role, content: msg.content })
  }
  const conversationsWithMessages = (conversations ?? []).map((c) => ({
    ...c,
    messages: messagesByPhone[c.phone] ?? [],
  }))

  const listingMap: Record<string, string> = {}
  for (const l of (activeListings ?? [])) listingMap[l.id] = l.name
  const bookingsWithListings = (bookings ?? []).map((b) => ({
    ...b,
    listing_name: b.listing_id ? (listingMap[b.listing_id] ?? null) : null,
  }))

  const total = conversations?.length ?? 0
  const qualified = conversations?.filter((c) => ['qualified', 'booking', 'converted'].includes(c.lead_status)).length ?? 0
  const converted = conversations?.filter((c) => c.lead_status === 'converted').length ?? 0
  const linksSent = bookings?.filter((b) => ['link_sent', 'confirmed', 'completed'].includes(b.status)).length ?? 0

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.caboricotours.com').trim().replace(/\/$/, '')

  return (
    <AdminApp
      categories={categories}
      listings={(adminListings ?? []) as { id: string; name: string; category: string; price: number | null; capacity: number | null; closed_weekdays: number[] | null; active: boolean }[]}
      siteUrl={siteUrl}
      conversations={conversationsWithMessages}
      bookings={bookingsWithListings}
      stats={{ total, qualified, converted, linksSent }}
    />
  )
}
