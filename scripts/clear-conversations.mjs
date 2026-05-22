import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envVars = {}
for (const line of readFileSync(resolve(__dirname, '../.env.local'), 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx < 0) continue
  envVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
}

const supabase = createClient(envVars.SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY)

const { error: e1 } = await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
const { error: e2 } = await supabase.from('conversations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
const { error: e3 } = await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000')

if (e1) console.error('messages:', e1.message)
else console.log('✓ messages borrados')
if (e2) console.error('conversations:', e2.message)
else console.log('✓ conversations borradas')
if (e3) console.error('bookings:', e3.message)
else console.log('✓ bookings borrados')
