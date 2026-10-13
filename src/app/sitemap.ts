import type { MetadataRoute } from 'next'
import { fetchListingsByCategory, type DBListing } from '@/lib/listings'

// The catalog changes from the admin panel, so the sitemap is rebuilt hourly
export const revalidate = 3600

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '') ||
  'https://www.caboricotours.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Same source the pages use, so the sitemap can never list a URL that 404s
  const groups = await Promise.all(
    (['experience', 'yacht', 'villa', 'service'] as const).map(fetchListingsByCategory)
  )
  const listings = groups.flat()

  const newest = listings
    .map((l) => l.updated_at)
    .filter(Boolean)
    .sort()
    .pop()

  const listingUrl = (l: DBListing) => ({
    url: `${SITE}/listing/${l.id}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    ...(l.images?.length ? { images: [l.images[0]] } : {}),
  })

  return [
    {
      url: SITE,
      lastModified: newest ? new Date(newest) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...listings.map(listingUrl),
  ]
}
