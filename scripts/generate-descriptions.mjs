import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env.local manually (handles CRLF and quoted values)
const envPath = resolve(__dirname, '../.env.local')
const envVars = {}
for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx < 0) continue
  const key = trimmed.slice(0, idx).trim()
  const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
  envVars[key] = val
}

const supabase = createClient(envVars.SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: envVars.ANTHROPIC_API_KEY })

const { data: listings, error } = await supabase
  .from('listings')
  .select('id, name, category, tagline, description')
  .order('name')

if (error) { console.error(error); process.exit(1) }

console.log(`Found ${listings.length} listings\n`)

for (const listing of listings) {
  if (listing.description && listing.description.trim().length > 40) {
    console.log(`⏭  ${listing.name} — ya tiene descripción`)
    continue
  }

  console.log(`✍  Generando: ${listing.name}`)

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Write a luxury travel description for a Cabo San Lucas experience called "${listing.name}" (category: ${listing.category}${listing.tagline ? `, tagline: "${listing.tagline}"` : ''}).

Requirements:
- 2-3 sentences, around 60-90 words
- Tone: premium, evocative, aspirational — like a luxury travel magazine
- Mention the specific experience, setting, and feeling it evokes
- Written in English
- No generic filler phrases like "unforgettable experience" or "memories that last a lifetime"
- No emojis, no bullet points

Return ONLY the description text, nothing else.`
    }],
  })

  const description = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
  if (!description) { console.log(`  ⚠ Vacío, saltando`); continue }

  const { error: updateError } = await supabase
    .from('listings')
    .update({ description })
    .eq('id', listing.id)

  if (updateError) {
    console.log(`  ✗ ${updateError.message}`)
  } else {
    console.log(`  ✓ ${description.slice(0, 80)}…`)
  }

  await new Promise(r => setTimeout(r, 300))
}

console.log('\n✅ Listo!')
