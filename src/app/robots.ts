import type { MetadataRoute } from 'next'

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '') ||
  'https://www.caboricotours.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Admin, checkout returns and the operator's confirmation links — the
      // last ones carry a guest's name and phone behind a token.
      disallow: ['/admin', '/api/', '/reserva/', '/checkout/', '/pay/'],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
