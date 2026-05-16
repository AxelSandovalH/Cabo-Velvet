import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

export const tools: Anthropic.Tool[] = [
  {
    name: 'search_listings',
    description: 'Search the Cabo Rico catalog. Use this before recommending anything. Filter by category and keywords.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          enum: ['yacht', 'villa', 'experience', 'service'],
          description: 'Category to filter by',
        },
        keywords: {
          type: 'string',
          description: 'Keywords to search in name and tagline (e.g. "snorkeling", "catamaran", "private")',
        },
        max_price: { type: 'number', description: 'Maximum price in USD' },
        min_price: { type: 'number', description: 'Minimum price in USD' },
      },
    },
  },
  {
    name: 'get_listing_details',
    description: 'Get full details of a specific listing including price, description, and what is included.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'Listing UUID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_payment_link',
    description: 'Generate a Stripe payment link. Call when client is ready to book. Always pass phone and name (if you have it). Pass quantity = number of people so the total is correct.',
    input_schema: {
      type: 'object' as const,
      properties: {
        listing_id: { type: 'string', description: 'Listing UUID to create payment for' },
        phone: { type: 'string', description: 'Client phone identifier from system prompt' },
        name: { type: 'string', description: 'Client name for the booking record' },
        quantity: { type: 'number', description: 'Number of people / units. Defaults to 1 if not provided. Always set this based on what the client told you.' },
      },
      required: ['listing_id', 'phone'],
    },
  },
  {
    name: 'save_lead_info',
    description: 'Save or update lead information captured during the conversation.',
    input_schema: {
      type: 'object' as const,
      properties: {
        phone: { type: 'string', description: 'Client phone number' },
        name: { type: 'string', description: 'Client name if provided' },
        group_size: { type: 'number', description: 'Number of people in the group' },
        travel_date: { type: 'string', description: 'Travel date or date range mentioned' },
        budget_range: { type: 'string', description: 'Budget range e.g. "$500-1000" or "high-end"' },
        interests: {
          type: 'array',
          items: { type: 'string' },
          description: 'Interests mentioned e.g. ["snorkeling", "sunset", "private yacht"]',
        },
        lead_status: {
          type: 'string',
          enum: ['new', 'qualified', 'booking', 'converted', 'cold'],
          description: 'Update lead status based on conversation progress',
        },
      },
      required: ['phone'],
    },
  },
]

type ToolInput = Record<string, unknown>

export async function executeTool(name: string, input: ToolInput): Promise<string> {
  try {
    switch (name) {
      case 'search_listings': {
        const { category, keywords, max_price, min_price } = input as {
          category?: string
          keywords?: string
          max_price?: number
          min_price?: number
        }

        let q = supabase
          .from('listings')
          .select('id, name, tagline, category, price, price_unit, location, images')
          .eq('active', true)
          .order('price', { ascending: true })

        if (category) q = q.eq('category', category)
        if (keywords) q = q.or(`name.ilike.%${keywords}%,tagline.ilike.%${keywords}%`)
        if (max_price) q = q.lte('price', max_price)
        if (min_price) q = q.gte('price', min_price)

        const { data, error } = await q.limit(6)
        if (error) throw error
        if (!data?.length) return JSON.stringify({ results: [], message: 'No listings found for this criteria' })
        return JSON.stringify({ results: data })
      }

      case 'get_listing_details': {
        const { id } = input as { id: string }
        const { data, error } = await supabase
          .from('listings')
          .select('id, name, tagline, description, category, price, price_unit, price_notes, location, details, images')
          .eq('id', id)
          .eq('active', true)
          .single()
        if (error) throw error
        return JSON.stringify(data)
      }

      case 'create_payment_link': {
        const { listing_id, phone: clientPhone, name: clientName, quantity: rawQty } = input as { listing_id: string; phone?: string; name?: string; quantity?: number }
        const quantity = Math.max(1, Math.round(rawQty ?? 1))

        if (!process.env.STRIPE_SECRET_KEY) {
          return JSON.stringify({ error: 'Stripe not configured — tell the user to contact us via WhatsApp to book' })
        }

        const { data: listing, error } = await supabase
          .from('listings')
          .select('id, name, tagline, price')
          .eq('id', listing_id)
          .eq('active', true)
          .single()
        if (error || !listing) return JSON.stringify({ error: 'Listing not found — search again and use the correct id' })
        if (!listing.price) return JSON.stringify({ error: 'This listing has no price — tell user to contact via WhatsApp' })

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '') || 'https://cabo-velvet.vercel.app'

        let session
        try {
          session = await getStripe().checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
              quantity,
              price_data: {
                currency: 'usd',
                unit_amount: Math.round(listing.price * 100),
                product_data: {
                  name: listing.name,
                  ...(listing.tagline ? { description: listing.tagline } : {}),
                },
              },
            }],
            metadata: { listingId: listing.id, quantity: String(quantity) },
            success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/checkout/cancel`,
          })
        } catch (stripeErr) {
          console.error('[stripe error]', stripeErr)
          return JSON.stringify({ error: `Stripe error: ${String(stripeErr)} — tell user to contact via WhatsApp` })
        }

        if (!session?.url) {
          return JSON.stringify({ error: 'Stripe did not return a URL — tell user to contact via WhatsApp' })
        }

        await supabase.from('bookings').insert({
          listing_id: listing.id,
          stripe_session_id: session.id,
          stripe_url: session.url,
          status: 'link_sent',
          phone: clientPhone ?? null,
          name: clientName ?? null,
          amount: Math.round(listing.price * 100) * quantity,
        })

        const total = listing.price * quantity
        return JSON.stringify({ payment_url: session.url, listing_name: listing.name, price_per_person: listing.price, quantity, total })
      }

      case 'save_lead_info': {
        const { phone, ...leadData } = input as { phone: string; [k: string]: unknown }
        const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() }
        if (leadData.name) updatePayload.name = leadData.name
        if (leadData.group_size) updatePayload.group_size = leadData.group_size
        if (leadData.travel_date) updatePayload.travel_date = leadData.travel_date
        if (leadData.budget_range) updatePayload.budget_range = leadData.budget_range
        if (leadData.interests) updatePayload.interests = leadData.interests
        if (leadData.lead_status) updatePayload.lead_status = leadData.lead_status

        await supabase
          .from('conversations')
          .update(updatePayload)
          .eq('phone', phone)

        return JSON.stringify({ success: true })
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` })
    }
  } catch (err) {
    return JSON.stringify({ error: String(err) })
  }
}
