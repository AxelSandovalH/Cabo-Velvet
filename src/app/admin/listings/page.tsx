import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import ListingsClient from './ListingsClient'

type Listing = {
  id: string
  name: string
  category: string
  price: number | null
  capacity: number | null
  closed_weekdays: number[] | null
  active: boolean
}

export default async function ListingsPage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const db = await createSupabaseAdmin()
  const { data: listings, error } = await db
    .from('listings')
    .select('id, name, category, price, capacity, closed_weekdays, active')
    .order('name')

  if (error) console.error('[listings-admin]', error.message)

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-[#F2EDE4]">
      <header className="flex-shrink-0 border-b border-white/10 bg-[#080808]/95 backdrop-blur px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-base sm:text-xl font-semibold tracking-wide">Cabo Rico — Configuración</h1>
          <nav className="hidden sm:flex items-center gap-1">
            <a href="/admin/dashboard" className="text-xs px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-colors">Imágenes</a>
            <a href="/admin/listings" className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.08] text-white/80">Actividades</a>
            <a href="/admin/concierge" className="text-xs px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-colors">Concierge</a>
          </nav>
        </div>
        <form action="/api/admin/logout" method="POST" className="flex-shrink-0">
          <button className="text-sm text-white/40 hover:text-white/80 transition-colors">Salir</button>
        </form>
      </header>

      {(listings ?? []).length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/40 text-sm">
            {error ? `Error: ${error.message}` : 'No hay listings aún.'}
          </p>
        </div>
      ) : (
        <ListingsClient listings={(listings ?? []) as Listing[]} />
      )}
    </div>
  )
}
