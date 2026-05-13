import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../supabase'

export const tools: Anthropic.Tool[] = [
  {
    name: 'search_listings',
    description: 'Search listings by text query and/or category. Returns id, name, category, tagline, location, price, active.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Text to search in name, tagline, description' },
        category: { type: 'string', enum: ['villa', 'yacht', 'experience', 'service'], description: 'Filter by category' },
        active: { type: 'boolean', description: 'Filter by active status. Defaults to true.' },
      },
    },
  },
  {
    name: 'get_listing',
    description: 'Get full details of a single listing by ID.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'Listing UUID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_listing',
    description: 'Create a new listing in the database.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: { type: 'string', enum: ['villa', 'yacht', 'experience', 'service'] },
        name: { type: 'string' },
        tagline: { type: 'string' },
        location: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        price_unit: { type: 'string', description: 'e.g. per night, per day, per person' },
        price_notes: { type: 'string' },
        contact_name: { type: 'string' },
        contact_phone: { type: 'string' },
        contact_email: { type: 'string' },
        whatsapp: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['category', 'name'],
    },
  },
  {
    name: 'update_listing',
    description: 'Update fields of an existing listing.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'Listing UUID' },
        category: { type: 'string', enum: ['villa', 'yacht', 'experience', 'service'] },
        name: { type: 'string' },
        tagline: { type: 'string' },
        location: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        price_unit: { type: 'string' },
        price_notes: { type: 'string' },
        contact_name: { type: 'string' },
        contact_phone: { type: 'string' },
        contact_email: { type: 'string' },
        whatsapp: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['id'],
    },
  },
  {
    name: 'search_providers',
    description: 'Search providers by text query and/or category.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Text to search in name, contact_name, notes' },
        category: { type: 'string', description: 'Filter by provider category' },
      },
    },
  },
  {
    name: 'create_provider',
    description: 'Create a new provider.',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string' },
        category: { type: 'string' },
        contact_name: { type: 'string' },
        contact_phone: { type: 'string' },
        contact_email: { type: 'string' },
        whatsapp: { type: 'string' },
        instagram: { type: 'string' },
        website: { type: 'string' },
        notes: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_provider',
    description: 'Update fields of an existing provider.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'Provider UUID' },
        name: { type: 'string' },
        category: { type: 'string' },
        contact_name: { type: 'string' },
        contact_phone: { type: 'string' },
        contact_email: { type: 'string' },
        whatsapp: { type: 'string' },
        instagram: { type: 'string' },
        website: { type: 'string' },
        notes: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_offering',
    description: 'Create a new offering linked to a listing and/or provider.',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string' },
        listing_id: { type: 'string' },
        provider_id: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        price_unit: { type: 'string' },
        price_notes: { type: 'string' },
        duration: { type: 'string' },
        capacity: { type: 'integer' },
        notes: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_offering',
    description: 'Update fields of an existing offering.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: 'Offering UUID' },
        name: { type: 'string' },
        listing_id: { type: 'string' },
        provider_id: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        price_unit: { type: 'string' },
        price_notes: { type: 'string' },
        duration: { type: 'string' },
        capacity: { type: 'integer' },
        notes: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['id'],
    },
  },
]

type ToolInput = Record<string, unknown>

export async function executeTool(name: string, input: ToolInput): Promise<string> {
  try {
    switch (name) {
      case 'search_listings': {
        const { query, category, active = true } = input as {
          query?: string; category?: string; active?: boolean
        }
        let q = supabase
          .from('listings')
          .select('id, name, category, tagline, location, price, price_unit, active')
          .eq('active', active)
        if (category) q = q.eq('category', category)
        if (query) q = q.or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
        const { data, error } = await q.order('name')
        if (error) throw error
        return JSON.stringify(data)
      }

      case 'get_listing': {
        const { id } = input as { id: string }
        const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
        if (error) throw error
        return JSON.stringify(data)
      }

      case 'create_listing': {
        const { data, error } = await supabase
          .from('listings')
          .insert(input)
          .select()
          .single()
        if (error) throw error
        return JSON.stringify({ success: true, listing: data })
      }

      case 'update_listing': {
        const { id, ...fields } = input as { id: string; [k: string]: unknown }
        const { data, error } = await supabase
          .from('listings')
          .update({ ...fields, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return JSON.stringify({ success: true, listing: data })
      }

      case 'search_providers': {
        const { query, category } = input as { query?: string; category?: string }
        let q = supabase
          .from('providers')
          .select('id, name, category, contact_name, contact_phone, whatsapp, active')
        if (category) q = q.eq('category', category)
        if (query) q = q.or(`name.ilike.%${query}%,contact_name.ilike.%${query}%,notes.ilike.%${query}%`)
        const { data, error } = await q.order('name')
        if (error) throw error
        return JSON.stringify(data)
      }

      case 'create_provider': {
        const { data, error } = await supabase
          .from('providers')
          .insert(input)
          .select()
          .single()
        if (error) throw error
        return JSON.stringify({ success: true, provider: data })
      }

      case 'update_provider': {
        const { id, ...fields } = input as { id: string; [k: string]: unknown }
        const { data, error } = await supabase
          .from('providers')
          .update(fields)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return JSON.stringify({ success: true, provider: data })
      }

      case 'create_offering': {
        const { data, error } = await supabase
          .from('offerings')
          .insert(input)
          .select()
          .single()
        if (error) throw error
        return JSON.stringify({ success: true, offering: data })
      }

      case 'update_offering': {
        const { id, ...fields } = input as { id: string; [k: string]: unknown }
        const { data, error } = await supabase
          .from('offerings')
          .update(fields)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return JSON.stringify({ success: true, offering: data })
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` })
    }
  } catch (err) {
    return JSON.stringify({ error: String(err) })
  }
}
