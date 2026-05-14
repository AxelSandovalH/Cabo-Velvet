import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase as adminSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const serverClient = await createSupabaseServer()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const listingId = formData.get('listingId') as string | null

  if (!file || !listingId) {
    return NextResponse.json({ error: 'Missing file or listingId' }, { status: 400 })
  }

  // Normalize extension — iPhones sometimes send .jpeg, .HEIC, etc.
  const originalName = file.name ?? 'photo'
  const ext = originalName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif'].includes(ext) ? ext : 'jpg'

  const path = `${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await adminSupabase.storage
    .from('listings')
    .upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = adminSupabase.storage.from('listings').getPublicUrl(path)

  return NextResponse.json({ url: data.publicUrl })
}
