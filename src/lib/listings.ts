import { supabase } from './supabase'
import { EXPERIENCE_PROVIDER_IDS, experienceFilterEnabled, isPublicListing } from './providers'

/**
 * Temporary: a listing with no photo falls back to a generic stock image on
 * every card, so the public catalog hides them until they have their own.
 * Set to false to show everything again.
 *
 * Only affects the website — the admin panel still lists them, and the
 * concierge bot can still quote and charge them, so payment links already
 * sent keep working.
 */
export const REQUIRE_PHOTO = true

export function hasPhoto(listing: { images?: string[] | null }): boolean {
  return (listing.images?.length ?? 0) > 0
}

export type DBListing = {
  id: string
  name: string
  tagline: string | null
  location: string | null
  description: string | null
  price: number | null
  price_unit: string | null
  price_notes: string | null
  images: string[] | null
  category: 'villa' | 'yacht' | 'experience' | 'service'
  capacity: number | null
  closed_weekdays: number[] | null
  updated_at?: string | null
  details: {
    specs?: { label: string; value: string }[]
    includes?: string[]
    model?: string
    duration?: string
    label?: string
  } | null
}

export async function fetchListingsByCategory(
  category: DBListing['category']
): Promise<DBListing[]> {
  let query = supabase
    .from('listings')
    .select('id, name, tagline, location, description, price, price_unit, price_notes, images, category, capacity, closed_weekdays, updated_at, details')
    .eq('category', category)
    .eq('active', true)
    .order('name')

  // Solo mostramos experiencias de los proveedores autorizados
  if (category === 'experience' && experienceFilterEnabled) {
    query = query.in('provider_id', EXPERIENCE_PROVIDER_IDS)
  }

  const { data, error } = await query

  if (error) {
    console.error(`[fetchListings] ${category}:`, error.message)
    return []
  }

  return REQUIRE_PHOTO ? (data ?? []).filter(hasPhoto) : (data ?? [])
}

export async function fetchListingById(id: string): Promise<DBListing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('id, name, tagline, location, description, price, price_unit, price_notes, images, category, capacity, closed_weekdays, details, provider_id')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error || !data) return null
  // Una experiencia oculta tampoco es accesible por URL directa
  if (!isPublicListing(data)) return null
  if (REQUIRE_PHOTO && !hasPhoto(data)) return null
  return data
}

export function formatPrice(listing: DBListing): string {
  if (!listing.price) return 'Contact us'
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.price)
  return `From ${formatted}`
}
