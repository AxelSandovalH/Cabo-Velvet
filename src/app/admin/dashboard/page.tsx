import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import ImageManager from './ImageManager'

type Listing = {
  id: string
  name: string
  category: string
  images: string[] | null
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: listings } = await supabase
    .from('listings')
    .select('id, name, category, images')
    .order('category')
    .order('name')

  const byCategory: Record<string, Listing[]> = {}
  for (const l of listings ?? []) {
    const cat = l.category ?? 'other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(l as Listing)
  }

  const categoryLabel: Record<string, string> = {
    villa: 'Villas',
    yacht: 'Yachts',
    experience: 'Experiencias',
    service: 'Servicios',
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F2EDE4]">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#080808]/95 backdrop-blur px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <h1 className="text-base sm:text-xl font-semibold tracking-wide truncate">Cabo Rico — Imágenes</h1>
        <form action="/api/admin/logout" method="POST" className="flex-shrink-0">
          <button className="text-sm text-white/40 hover:text-white/80 transition-colors">
            Salir
          </button>
        </form>
      </header>

      <main className="px-4 sm:px-8 py-6 max-w-5xl mx-auto">
        {!listings?.length ? (
          <p className="text-white/40">No hay listings. Agrégalos desde WhatsApp.</p>
        ) : (
          <div className="space-y-10">
            {Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase mb-4">
                  {categoryLabel[cat] ?? cat}
                </h2>
                <div className="space-y-4">
                  {items.map((listing) => (
                    <ImageManager key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
