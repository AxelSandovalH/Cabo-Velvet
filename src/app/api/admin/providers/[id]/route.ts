import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase as db } from '@/lib/supabase'

const EDITABLE = [
  'name', 'category', 'contact_name', 'contact_email',
  'contact_phone', 'whatsapp', 'instagram', 'website', 'notes', 'active',
] as const

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const update: Record<string, unknown> = {}
  for (const key of EDITABLE) {
    if (key in body) update[key] = typeof body[key] === 'string' ? body[key].trim() : body[key]
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
  }

  // The operator's email is what the booking flow depends on — reject typos early
  const email = update.contact_email as string | undefined
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Ese correo no parece válido' }, { status: 400 })
  }

  const { error } = await db.from('providers').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
