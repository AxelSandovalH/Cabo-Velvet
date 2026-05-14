import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import ImageManager from './ImageManager'

type Listing = {
  id: string
  name: string
  category: string
  images: string[] | null
}

const CATEGORY_LABEL: Record<string, string> = {
  villa: 'Villas',
  yacht: 'Yachts',
  experience: 'Experiencias',
  service: 'Servicios',
}

const CATEGORY_ORDER = ['experience', 'villa', 'yacht', 'service']

export default async function DashboardPage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const db = await createSupabaseAdmin()
  const { data: listings, error } = await db
    .from('listings')
    .select('id, name, category, images')
    .order('category')
    .order('name')

  if (error) console.error('[dashboard]', error.message)

  // Group by category
  const grouped: Record<string, Listing[]> = {}
  for (const l of (listings ?? []) as Listing[]) {
    const cat = l.category ?? 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(l)
  }

  const sortedCats = Object.keys(grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  )

  return (
    <div className="min-h-screen bg-[#080808] text-[#F2EDE4]">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#080808]/95 backdrop-blur px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <h1 className="text-base sm:text-xl font-semibold tracking-wide truncate">Cabo Rico — Imágenes</h1>
        <form action="/api/admin/logout" method="POST" className="flex-shrink-0">
          <button className="text-sm text-white/40 hover:text-white/80 transition-colors">Salir</button>
        </form>
      </header>

      <main className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-12">
        {sortedCats.length === 0 && (
          <p className="text-white/40 text-sm">
            {error ? `Error: ${error.message}` : 'No hay listings aún.'}
          </p>
        )}

        {sortedCats.map((cat) => (
          <div key={cat}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-px bg-[#C4A45A]" />
              <h2 className="text-[11px] tracking-[0.38em] text-[#C4A45A] uppercase font-medium">
                {CATEGORY_LABEL[cat] ?? cat}
              </h2>
              <span className="text-[9px] text-[#2A2018] ml-auto">{grouped[cat].length} listings</span>
            </div>
            <div className="space-y-3">
              {grouped[cat].map((listing) => (
                <ImageManager key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
