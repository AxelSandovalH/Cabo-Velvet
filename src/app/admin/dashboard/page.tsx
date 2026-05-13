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

  return (
    <div className="min-h-screen bg-[#080808] text-[#F2EDE4]">
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wide">Cabo Rico — Imágenes</h1>
        <form action="/api/admin/logout" method="POST">
          <button className="text-sm text-white/40 hover:text-white/80 transition-colors">
            Cerrar sesión
          </button>
        </form>
      </header>

      <main className="px-8 py-8 max-w-5xl mx-auto">
        {!listings?.length ? (
          <p className="text-white/40">No hay listings aún. Agrégalos desde WhatsApp.</p>
        ) : (
          <div className="space-y-6">
            {listings.map((listing: Listing) => (
              <ImageManager key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
