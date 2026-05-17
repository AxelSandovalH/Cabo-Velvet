import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'
import AdminHeader from '../AdminHeader'

type Listing = {
  id: string
  name: string
  category: string
  images: string[] | null
  provider_id: string | null
}

type Provider = { id: string; name: string }

const CATEGORY_LABEL: Record<string, string> = {
  experience: 'Experiencias',
  villa: 'Villas',
  yacht: 'Yachts',
  service: 'Servicios',
}

const CATEGORY_ORDER = ['experience', 'villa', 'yacht', 'service']

export default async function DashboardPage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const db = await createSupabaseAdmin()
  const [{ data: listings, error }, { data: providers }] = await Promise.all([
    db.from('listings').select('id, name, category, images, provider_id').order('name'),
    db.from('providers').select('id, name'),
  ])

  if (error) console.error('[dashboard]', error.message)

  const providerMap = Object.fromEntries(
    (providers ?? []).map((p: Provider) => [p.id, p.name])
  )

  // Build: category → agency → listings
  const grouped: Record<string, Record<string, Listing[]>> = {}
  for (const l of (listings ?? []) as Listing[]) {
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

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-[#F2EDE4]">
      <AdminHeader current="dashboard" />

      {categories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/40 text-sm">
            {error ? `Error: ${error.message}` : 'No hay listings aún.'}
          </p>
        </div>
      ) : (
        <DashboardClient categories={categories} />
      )}
    </div>
  )
}
