import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import ImageManager from './ImageManager'

type Listing = {
  id: string
  name: string
  category: string
  images: string[] | null
  provider: { id: string; name: string } | null
}

const CATEGORY_LABEL: Record<string, string> = {
  villa: 'Villas',
  yacht: 'Yachts',
  experience: 'Experiencias',
  service: 'Servicios',
}

const CATEGORY_ORDER = ['experience', 'villa', 'yacht', 'service']

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: listings } = await supabase
    .from('listings')
    .select('id, name, category, images, providers(id, name)')
    .order('category')
    .order('name')

  // Normalize the join (Supabase returns providers as object or null)
  const rows: Listing[] = (listings ?? []).map((l: Record<string, unknown>) => ({
    id: l.id as string,
    name: l.name as string,
    category: l.category as string,
    images: l.images as string[] | null,
    provider: l.providers as { id: string; name: string } | null,
  }))

  // Group: category → provider name → listings
  const grouped: Record<string, Record<string, Listing[]>> = {}

  for (const listing of rows) {
    const cat = listing.category ?? 'other'
    const agency = listing.provider?.name ?? 'Sin agencia'
    if (!grouped[cat]) grouped[cat] = {}
    if (!grouped[cat][agency]) grouped[cat][agency] = []
    grouped[cat][agency].push(listing)
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

      <main className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-14">
        {sortedCats.length === 0 && (
          <p className="text-white/40">No hay listings. Agrégalos desde WhatsApp.</p>
        )}

        {sortedCats.map((cat) => (
          <div key={cat}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-px bg-[#C4A45A]" />
              <h2 className="text-[11px] tracking-[0.38em] text-[#C4A45A] uppercase font-medium">
                {CATEGORY_LABEL[cat] ?? cat}
              </h2>
            </div>

            {/* Agencies within category */}
            <div className="space-y-8">
              {Object.entries(grouped[cat]).sort(([a], [b]) => a.localeCompare(b)).map(([agency, items]) => (
                <div key={agency}>
                  {/* Agency subheader */}
                  <div className="flex items-center gap-2 mb-3 pl-1">
                    <span className="text-[9px] tracking-[0.3em] text-[#3A3028] uppercase">Agencia</span>
                    <span className="text-xs text-[#7A7060] font-medium">{agency}</span>
                    <span className="text-[9px] text-[#2A2018] ml-auto">{items.length} listings</span>
                  </div>

                  <div className="space-y-3">
                    {items.map((listing) => (
                      <ImageManager key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
