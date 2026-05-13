'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Listing = {
  id: string
  name: string
  category: string
  images: string[] | null
}

export default function ImageManager({ listing }: { listing: Listing }) {
  const [images, setImages] = useState<string[]>(listing.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    setError('')

    const supabase = createSupabaseBrowser()
    const newUrls: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${listing.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        setError(`Error subiendo ${file.name}`)
        continue
      }

      const { data } = supabase.storage.from('listings').getPublicUrl(path)
      newUrls.push(data.publicUrl)
    }

    if (newUrls.length) {
      const updated = [...images, ...newUrls]
      const { error: dbError } = await supabase
        .from('listings')
        .update({ images: updated, updated_at: new Date().toISOString() })
        .eq('id', listing.id)

      if (dbError) {
        setError('Error guardando en la base de datos')
      } else {
        setImages(updated)
      }
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(url: string) {
    const supabase = createSupabaseBrowser()

    // Extract storage path from URL
    const parts = url.split('/listings/')
    const path = parts[1]

    if (path) {
      await supabase.storage.from('listings').remove([path])
    }

    const updated = images.filter((img) => img !== url)
    const { error: dbError } = await supabase
      .from('listings')
      .update({ images: updated, updated_at: new Date().toISOString() })
      .eq('id', listing.id)

    if (!dbError) setImages(updated)
  }

  const categoryLabel: Record<string, string> = {
    villa: 'Villa',
    yacht: 'Yacht',
    experience: 'Experiencia',
    service: 'Servicio',
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-white/40 uppercase tracking-widest">
            {categoryLabel[listing.category] ?? listing.category}
          </span>
          <h2 className="text-lg font-semibold">{listing.name}</h2>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-[#F2EDE4] text-[#080808] rounded-lg text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50"
        >
          {uploading ? 'Subiendo...' : '+ Subir imágenes'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {images.length === 0 ? (
        <p className="text-white/30 text-sm">Sin imágenes aún.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url) => (
            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden bg-white/5">
              <Image
                src={url}
                alt={listing.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <button
                onClick={() => handleDelete(url)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-sm font-semibold"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
