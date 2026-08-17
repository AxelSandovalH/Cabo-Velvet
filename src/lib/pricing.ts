/**
 * Money split for a booking.
 *
 * The client pays our margin online (public price − what the operator charges us);
 * the rest is settled with the operator on site. Everything is in cents so it can
 * go straight to Stripe without float drift.
 */

/** Used when a listing has no agency_price, so there is no margin to compute. */
const FALLBACK_DEPOSIT_PCT = 0.3

/** Stripe rejects charges under $0.50 USD. */
const STRIPE_MIN_CENTS = 50

export type PriceSplit = {
  totalCents: number
  depositCents: number
  balanceDueCents: number
  /** True when we fell back to a flat percentage instead of the real margin. */
  usedFallback: boolean
}

export function splitPrice(
  listing: { price: number | null; agency_price?: number | null },
  quantity: number
): PriceSplit {
  const qty = Math.max(1, Math.round(quantity))
  const totalCents = Math.round((listing.price ?? 0) * 100) * qty
  const supplierCents = Math.round((listing.agency_price ?? 0) * 100) * qty

  const margin = totalCents - supplierCents
  const hasMargin = listing.agency_price != null && margin > 0

  let depositCents = hasMargin ? margin : Math.round(totalCents * FALLBACK_DEPOSIT_PCT)

  // Never charge less than Stripe accepts, never more than the full price
  depositCents = Math.min(Math.max(depositCents, STRIPE_MIN_CENTS), totalCents)

  return {
    totalCents,
    depositCents,
    balanceDueCents: totalCents - depositCents,
    usedFallback: !hasMargin,
  }
}

export function formatUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
