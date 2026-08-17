import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase as db } from '@/lib/supabase'

const EDITABLE = [
  'name', 'category', 'contact_name', 'contact_email',
  'contact_phone', 'whatsapp', 'instagram', 'website', 'notes', 'active',
] as const

async function requireUser() {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  return user
}

export async function GET() {
  if (!await requireUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: providers, error }, { data: listings }] = await Promise.all([
    db.from('providers').select('*').order('name'),
    db.from('listings').select('provider_id, active'),
  ])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const counts: Record<string, { total: number; active: number }> = {}
  for (const l of listings ?? []) {
    if (!l.provider_id) continue
    counts[l.provider_id] ??= { total: 0, active: 0 }
    counts[l.provider_id].total += 1
    if (l.active) counts[l.provider_id].active += 1
  }

  return NextResponse.json(
    (providers ?? []).map(p => ({
      ...p,
      listings_total: counts[p.id]?.total ?? 0,
      listings_active: counts[p.id]?.active ?? 0,
    }))
  )
}

export async function POST(req: NextRequest) {
  if (!await requireUser()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  const insert: Record<string, unknown> = { active: true }
  for (const key of EDITABLE) {
    if (key in body) insert[key] = typeof body[key] === 'string' ? body[key].trim() : body[key]
  }

  const { data, error } = await db.from('providers').insert(insert).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
