import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchListingById, formatPrice } from '@/lib/listings'
import LuxuryDetailLayout from '@/components/LuxuryDetailLayout'

const WHATSAPP = '523141222146'
const CATEGORY_LABEL: Record<string, string> = {
  villa: 'Villas',
  yacht: 'Yachts',
  experience: 'Experiences',
  service: 'Services',
}
const CATEGORY_HREF: Record<string, string> = {
  villa: '/#villas',
  yacht: '/#yachts',
  experience: '/#experiences',
  service: '/#services',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const listing = await fetchListingById(id)
  if (!listing) return { title: 'Not Found' }
  return {
    title: `${listing.name} — Cabo Rico`,
    description: listing.tagline ?? listing.description?.slice(0, 155) ?? '',
  }
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await fetchListingById(id)
  if (!listing) notFound()

  const heroImage =
    listing.images?.[0] ??
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=90&auto=format&fit=crop'
  const gallery = listing.images?.slice(1) ?? []
  const description = listing.description
    ? listing.description.split('\n\n').filter(Boolean)
    : ['Contact us for more details about this experience.']

  const whatsappMsg = `Hi, I'm interested in ${listing.name}. Can you share availability and pricing?`

  return (
    <LuxuryDetailLayout
      category={CATEGORY_LABEL[listing.category] ?? listing.category}
      categoryHref={CATEGORY_HREF[listing.category] ?? '/'}
      name={listing.name}
      tagline={listing.tagline ?? ''}
      location={listing.location ?? undefined}
      model={listing.details?.model ?? undefined}
      label={listing.details?.label ?? undefined}
      heroImage={heroImage}
      gallery={gallery}
      description={description}
      specs={listing.details?.specs ?? []}
      includes={listing.details?.includes ?? []}
      price={formatPrice(listing)}
      durationOrStay={
        listing.details?.duration ??
        (listing.price_unit ? `Per ${listing.price_unit}` : 'Contact for pricing')
      }
      whatsappMsg={whatsappMsg}
      listingId={listing.id}
    />
  )
}
