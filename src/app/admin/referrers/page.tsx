import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import AdminHeader from '../AdminHeader'
import ReferrersClient from './ReferrersClient'

export default async function ReferrersPage() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/admin/login')

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cabo-velvet.vercel.app').replace(/\/$/, '')

  return (
    <div className="h-screen flex flex-col bg-[#080808] text-[#F2EDE4]">
      <AdminHeader current="referrers" />
      <ReferrersClient siteUrl={siteUrl} />
    </div>
  )
}
