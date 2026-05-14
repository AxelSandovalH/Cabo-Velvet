'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

type Listing = {
  id: string
  name: string
  tagline: string | null
  location: string | null
  description: string | null
  price: number | null
  agency_price: number | null
  price_unit: string | null
  price_notes: string | null
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  whatsapp: string | null
  active: boolean
  category: string
  images: string[] | null
}

const CATEGORIES = ['villa', 'yacht', 'experience', 'service'] as const

const input = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F2EDE4] placeholder-white/25 focus:outline-none focus:border-white/30 text-sm'

export default function ImageManager({ listing }: { listing: Listing }) {
  const [images, setImages] = useState<string[]>(listing.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [imgError, setImgError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({
    name: listing.name,
    tagline: listing.tagline ?? '',
    location: listing.location ?? '',
    description: listing.description ?? '',
    price: listing.price?.toString() ?? '',
    agency_price: listing.agency_price?.toString() ?? '',
    price_unit: listing.price_unit ?? '',
    price_notes: listing.price_notes ?? '',
    contact_name: listing.contact_name ?? '',
    contact_phone: listing.contact_phone ?? '',
    contact_email: listing.contact_email ?? '',
    whatsapp: listing.whatsapp ?? '',
    active: listing.active,
    category: listing.category,
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function txt(key: keyof typeof form) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        set(key, e.target.value as never),
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    const supabase = createSupabaseBrowser()
    const { error } = await supabase
      .from('listings')
      .update({
        name: form.name,
        tagline: form.tagline || null,
        location: form.location || null,
        description: form.description || null,
        price: form.price ? Number(form.price) : null,
        agency_price: form.agency_price ? Number(form.agency_price) : null,
        price_unit: form.price_unit || null,
        price_notes: form.price_notes || null,
        contact_name: form.contact_name || null,
        contact_phone: form.contact_phone || null,
        contact_email: form.contact_email || null,
        whatsapp: form.whatsapp || null,
        active: form.active,
        category: form.category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listing.id)

    if (error) setSaveError('Error al guardar')
    else setEditing(false)
    setSaving(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setImgError('')
    const supabase = createSupabaseBrowser()
    const newUrls: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${listing.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(path, file, { upsert: false })
      if (uploadError) { setImgError(`Error subiendo ${file.name}`); continue }
      const { data } = supabase.storage.from('listings').getPublicUrl(path)
      newUrls.push(data.publicUrl)
    }

    if (newUrls.length) {
      const updated = [...images, ...newUrls]
      const { error: dbError } = await supabase
        .from('listings')
        .update({ images: updated, updated_at: new Date().toISOString() })
        .eq('id', listing.id)
      if (dbError) setImgError('Error guardando en base de datos')
      else setImages(updated)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(url: string) {
    const supabase = createSupabaseBrowser()
    const path = url.split('/listings/')[1]
    if (path) await supabase.storage.from('listings').remove([path])
    const updated = images.filter(img => img !== url)
    const { error } = await supabase
      .from('listings')
      .update({ images: updated, updated_at: new Date().toISOString() })
      .eq('id', listing.id)
    if (!error) setImages(updated)
  }

  return (
    <div className="bg-white/5 rounded-xl border border-white/10">
      {/* Row header */}
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">{form.name}</h2>
          {form.tagline && (
            <p className="text-xs text-white/40 truncate mt-0.5">{form.tagline}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${form.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
            {form.active ? 'Activo' : 'Inactivo'}
          </span>
          <button
            onClick={() => { setEditing(!editing); setSaveError('') }}
            className="text-xs px-3 py-1.5 border border-white/15 rounded-lg text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            {editing ? 'Cerrar' : 'Editar'}
          </button>
        </div>
      </div>

      {/* Thumbnail strip when collapsed */}
      {!editing && images.length > 0 && (
        <div className="px-4 sm:px-5 pb-4 flex gap-2 overflow-x-auto">
          {images.slice(0, 5).map(url => (
            <div key={url} className="flex-shrink-0 w-16 h-11 rounded-md overflow-hidden bg-white/5">
              <Image src={url} alt={form.name} width={64} height={44} className="object-cover w-full h-full" />
            </div>
          ))}
          {images.length > 5 && (
            <div className="flex-shrink-0 w-16 h-11 rounded-md bg-white/5 flex items-center justify-center text-xs text-white/40">
              +{images.length - 5}
            </div>
          )}
        </div>
      )}

      {/* Edit panel */}
      {editing && (
        <div className="border-t border-white/10 px-4 sm:px-5 pb-6 pt-5 space-y-6">

          {/* General */}
          <section className="space-y-3">
            <SectionLabel>General</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label>Nombre</Label>
                <input className={input} {...txt('name')} />
              </div>
              <div>
                <Label>Categoría</Label>
                <select className={input} {...txt('category')}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-[#111]">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Ubicación</Label>
                <input className={input} placeholder="Cabo San Lucas" {...txt('location')} />
              </div>
              <div className="sm:col-span-2">
                <Label>Tagline</Label>
                <input className={input} placeholder="Frase corta" {...txt('tagline')} />
              </div>
              <div className="sm:col-span-2">
                <Label>Descripción</Label>
                <textarea className={`${input} min-h-[96px] resize-y`} {...txt('description')} />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Label>Activo</Label>
                <button
                  type="button"
                  onClick={() => set('active', !form.active)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.active ? 'bg-emerald-500' : 'bg-white/15'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Precios */}
          <section className="space-y-3">
            <SectionLabel>Precios</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Precio cliente ($)</Label>
                <input type="number" className={input} placeholder="0" {...txt('price')} />
              </div>
              <div>
                <Label>Precio agencia ($)</Label>
                <input type="number" className={input} placeholder="0" {...txt('agency_price')} />
              </div>
              <div>
                <Label>Unidad</Label>
                <input className={input} placeholder="por noche, por día…" {...txt('price_unit')} />
              </div>
              <div>
                <Label>Notas de precio</Label>
                <input className={input} placeholder="+IVA, incluye…" {...txt('price_notes')} />
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="space-y-3">
            <SectionLabel>Contacto</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Nombre</Label>
                <input className={input} {...txt('contact_name')} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <input className={input} {...txt('contact_phone')} />
              </div>
              <div>
                <Label>Email</Label>
                <input type="email" className={input} {...txt('contact_email')} />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <input className={input} placeholder="+52..." {...txt('whatsapp')} />
              </div>
            </div>
          </section>

          {/* Guardar */}
          {saveError && (
            <p className="text-red-400 text-xs bg-red-400/10 rounded px-3 py-2">{saveError}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-[#C4A45A] text-[#080808] rounded-lg text-sm font-semibold disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              onClick={() => { setEditing(false); setSaveError('') }}
              className="px-4 py-2.5 border border-white/15 rounded-lg text-sm text-white/50 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Imágenes */}
          <section className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <SectionLabel>Imágenes</SectionLabel>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C4A45A] text-[#080808] rounded-lg text-xs font-semibold disabled:opacity-50 transition-opacity"
              >
                {uploading ? <><Spinner /> Subiendo…</> : <><PlusIcon /> Agregar</>}
              </button>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            </div>

            {imgError && (
              <p className="text-red-400 text-xs bg-red-400/10 rounded px-3 py-2">{imgError}</p>
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
                {images.map(url => (
                  <div key={url} className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                    <Image src={url} alt={form.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-4 pb-1.5 px-2 flex justify-end sm:opacity-0 sm:hover:opacity-100 sm:bg-black/60 sm:inset-0 sm:items-center sm:justify-center sm:pb-0 sm:pt-0 sm:transition-opacity">
                      <button onClick={() => handleDelete(url)} className="text-red-400 text-[11px] font-semibold tracking-wide sm:text-sm">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-video rounded-lg border border-dashed border-white/15 flex items-center justify-center text-white/30 active:bg-white/5 transition-colors disabled:opacity-40"
                >
                  <PlusIcon size={20} />
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] tracking-[0.38em] text-[#C4A45A] uppercase">{children}</p>
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-white/40 mb-1">{children}</label>
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
