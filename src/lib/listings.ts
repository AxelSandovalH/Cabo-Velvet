import { supabase } from './supabase'

export type DBListing = {
  id: string
  name: string
  tagline: string | null
  location: string | null
  description: string | null
  price: number | null
  price_unit: string | null
  images: string[] | null
  category: 'villa' | 'yacht' | 'experience' | 'service'
  capacity: number | null
  closed_weekdays: number[] | null
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
  const { data, error } = await supabase
    .from('listings')
    .select('id, name, tagline, location, description, price, price_unit, images, category, capacity, closed_weekdays, details')
    .eq('category', category)
    .eq('active', true)
    .order('name')

  if (error) {
    console.error(`[fetchListings] ${category}:`, error.message)
    return []
  }

  return data ?? []
}

export async function fetchListingById(id: string): Promise<DBListing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('id, name, tagline, location, description, price, price_unit, images, category, capacity, closed_weekdays, details')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error) return null
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
