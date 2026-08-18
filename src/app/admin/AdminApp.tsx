'use client'

import { useState } from 'react'
import AdminHeader, { AdminTab } from './AdminHeader'
import DashboardClient from './dashboard/DashboardClient'
import ListingsClient from './listings/ListingsClient'
import ReferrersClient from './referrers/ReferrersClient'
import ConciergeInner from './concierge/ConciergeInner'
import ProvidersClient from './providers/ProvidersClient'

type Listing = {
  id: string; name: string; category: string
  price: number | null; capacity: number | null
  closed_weekdays: number[] | null; active: boolean
  images: string[] | null; provider_id: string | null
}
type Conversation = {
  id: string; phone: string; name: string | null; lead_status: string
  interests: string[] | null; budget_range: string | null
  travel_date: string | null; group_size: number | null
  messages: { role: string; content: string }[]
  updated_at: string; created_at: string
}
type Booking = {
  id: string; listing_id: string | null; listing_name: string | null
  stripe_url: string | null; status: string; created_at: string
  conversation_id: string | null; phone: string | null
  name: string | null; amount: number | null; confirmed_at: string | null
  email: string | null; booking_date: string | null; start_time: string | null
  supplier_status: string | null; deposit_amount: number | null; balance_due: number | null
}
type Stats = { total: number; qualified: number; converted: number; linksSent: number }

type Props = {
  categories: { cat: string; label: string; agencies: { name: string; listings: unknown[] }[] }[]
  listings: Listing[]
  providers: { id: string; name: string }[]
  siteUrl: string
  conversations: Conversation[]
  bookings: Booking[]
  stats: Stats
}

export default function AdminApp({ categories, listings, providers, siteUrl, conversations, bookings, stats }: Props) {
  const [tab, setTab] = useState<AdminTab>('concierge')

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-[#F2EDE4] overflow-hidden">
      <AdminHeader current={tab} onTabChange={setTab} />

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {tab === 'dashboard' && (
          <DashboardClient categories={categories as Parameters<typeof DashboardClient>[0]['categories']} />
        )}
        {tab === 'listings' && (
          <ListingsClient listings={listings} providers={providers} />
        )}
        {tab === 'providers' && (
          <ProvidersClient />
        )}
        {tab === 'referrers' && (
          <ReferrersClient siteUrl={siteUrl} />
        )}
        {tab === 'concierge' && (
          <ConciergeInner
            conversations={conversations}
            bookings={bookings}
            stats={stats}
          />
        )}
      </div>
    </div>
  )
}
