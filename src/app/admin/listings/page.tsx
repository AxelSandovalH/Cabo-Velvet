import { redirect } from 'next/navigation'
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server'
import ListingsClient from './ListingsClient'
import AdminHeader from '../AdminHeader'

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
      <AdminHeader current="listings" />

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
