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

    const newUrls: string[] = []

    for (const file of files) {
      const form = new FormData()
      form.append('file', file)
      form.append('listingId', listing.id)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json()

      if (!res.ok || json.error) {
        setError(`Error subiendo ${file.name}: ${json.error ?? res.statusText}`)
        continue
      }

      newUrls.push(json.url)
    }

    if (newUrls.length) {
      const updated = [...images, ...newUrls]
      const supabase = createSupabaseBrowser()
      const { error: dbError } = await supabase
        .from('listings')
        .update({ images: updated, updated_at: new Date().toISOString() })
        .eq('id', listing.id)

      if (dbError) {
        setError('Error guardando en base de datos')
      } else {
        setImages(updated)
      }
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(url: string) {
    // Extract storage path from public URL
    const marker = '/object/public/listings/'
    const idx = url.indexOf(marker)
    const path = idx !== -1 ? url.slice(idx + marker.length) : null

    if (path) {
      const supabase = createSupabaseBrowser()
      await supabase.storage.from('listings').remove([path])
    }

    const updated = images.filter((img) => img !== url)
    const supabase = createSupabaseBrowser()
    const { error: dbError } = await supabase
      .from('listings')
      .update({ images: updated, updated_at: new Date().toISOString() })
      .eq('id', listing.id)

    if (!dbError) setImages(updated)
  }

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold leading-snug flex-1 min-w-0 pr-2">
          {listing.name}
        </h2>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-[#C4A45A] text-[#080808] rounded-lg text-xs font-semibold active:opacity-80 disabled:opacity-50 transition-opacity"
        >
          {uploading ? <><Spinner />Subiendo…</> : <><PlusIcon />Fotos</>}
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

      {error && (
        <p className="text-red-400 text-xs mb-3 bg-red-400/10 rounded px-3 py-2">{error}</p>
      )}

      {images.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed border-white/15 rounded-lg py-8 flex flex-col items-center gap-2 text-white/30 active:bg-white/5 transition-colors"
        >
          <UploadIcon />
          <span className="text-xs tracking-wide">Toca para agregar fotos</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
              <Image
                src={url}
                alt={listing.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {/* Always visible on mobile, hover on desktop */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-4 pb-1.5 px-2 flex justify-end sm:opacity-0 sm:hover:opacity-100 sm:bg-black/60 sm:inset-0 sm:items-center sm:justify-center sm:pb-0 sm:pt-0 sm:transition-opacity">
                <button
                  onClick={() => handleDelete(url)}
                  className="text-red-400 text-[11px] font-semibold tracking-wide sm:text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {/* Add more tile */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-video rounded-lg border border-dashed border-white/15 flex items-center justify-center text-white/30 active:bg-white/5 transition-colors disabled:opacity-40"
          >
            <PlusIcon size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin mr-1">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
