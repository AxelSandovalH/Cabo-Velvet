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

const { error } = await supabase
  .from('listings')
  .update({
    description: `Journey two hours south to Cabo Pulmo, a UNESCO World Heritage reef and one of the most biodiverse marine sanctuaries in the Americas. Two guided dives reveal bull sharks gliding through crystal-clear water, whale sharks drifting overhead, and massive schools of bigeye trevally swirling like living tornadoes around ancient coral formations. All equipment, air fills, and park fees included.`,
    details: {
      includes: [
        'Round-trip transportation from Cabo San Lucas',
        '2 guided dives with certified divemaster',
        'All scuba equipment (BCD, regulator, wetsuit, fins, mask)',
        '2 tanks of air',
        'Cabo Pulmo National Park entrance fee',
        'Snacks and water on board',
        'Bilingual dive guide',
      ]
    }
  })
  .eq('id', '8db035ee-683d-406d-ad70-d5eaa266f25f')

if (error) console.error('Error:', error.message)
else console.log('✓ Done')
