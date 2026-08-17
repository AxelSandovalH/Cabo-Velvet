/**
 * Proveedores cuyas experiencias se muestran al público.
 *
 * Solo afecta a la categoría `experience`: yates, villas y servicios no se filtran.
 * El panel de admin sigue viendo todo el catálogo — este filtro es de cara al cliente
 * (web, chat y bot de WhatsApp).
 *
 * Para volver a mostrar todas las experiencias, deja el array vacío.
 */
export const EXPERIENCE_PROVIDER_IDS: string[] = [
  '47f81fb8-1428-4177-ab89-d51cd17a7b0b', // Cactus
]

/** Filtro activo solo si hay proveedores listados. */
export const experienceFilterEnabled = EXPERIENCE_PROVIDER_IDS.length > 0

/**
 * Filtro PostgREST para consultas que pueden traer varias categorías:
 * deja pasar todo lo que no sea experiencia, y de las experiencias solo
 * las de los proveedores permitidos.
 */
export const experienceProviderFilter = `category.neq.experience,provider_id.in.(${EXPERIENCE_PROVIDER_IDS.join(',')})`

/** ¿Este listing es visible para el público? */
export function isPublicListing(listing: {
  category?: string | null
  provider_id?: string | null
}): boolean {
  if (!experienceFilterEnabled) return true
  if (listing.category !== 'experience') return true
  return !!listing.provider_id && EXPERIENCE_PROVIDER_IDS.includes(listing.provider_id)
}
