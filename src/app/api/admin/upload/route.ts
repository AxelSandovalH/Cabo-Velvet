import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase as adminSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const authClient = await createSupabaseServer()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const listingId = formData.get('listingId') as string | null

  if (!file || !listingId) {
    return NextResponse.json({ error: 'Missing file or listingId' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  // Compress: max 1200px wide, JPEG 80%, strip metadata
  let compressed: Buffer
  try {
    compressed = await sharp(inputBuffer)
      .rotate()                          // auto-rotate from EXIF (fixes iPhone sideways photos)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer()
  } catch {
    // If sharp can't parse it (rare), fall back to original
    compressed = inputBuffer
  }

  const path = `${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`

  const { error: uploadError } = await adminSupabase.storage
    .from('listings')
    .upload(path, compressed, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = adminSupabase.storage.from('listings').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
