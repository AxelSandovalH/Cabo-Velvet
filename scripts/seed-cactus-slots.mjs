/**
 * Loads Cactus's contact email and departure times.
 *
 *   node --env-file=.env.local scripts/seed-cactus-slots.mjs
 *
 * Edit CONTACT and SCHEDULE below, then run. Safe to re-run: it upserts.
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CACTUS_ID = '47f81fb8-1428-4177-ab89-d51cd17a7b0b'

// ---------------------------------------------------------------------------
// 1. Where the confirmation emails go. Without this the flow cannot run.
// ---------------------------------------------------------------------------
const CONTACT = {
  contact_name: '',      // e.g. 'Reservaciones Cactus'
  contact_email: '',     // ← REQUIRED
  contact_phone: '',
  whatsapp: '',
}

// ---------------------------------------------------------------------------
// 2. Departure times.
//    `match`   — substring of the listing name (case-insensitive). '*' = all.
//    `times`   — [start_time, label, capacity]. capacity null = unlimited.
//    `weekdays`— [] every day, or e.g. [1,2,3,4,5] Mon–Fri (0 = Sunday).
// ---------------------------------------------------------------------------
const SCHEDULE = [
  {
    match: '*',
    weekdays: [],
    times: [
      ['09:00', 'Morning', null],
      ['12:00', 'Midday', null],
      ['15:00', 'Afternoon', null],
    ],
  },
  // Example of a product with its own times:
  // { match: 'Camel', weekdays: [], times: [['08:00', 'Sunrise', 12], ['16:00', 'Sunset', 12]] },
]

// ---------------------------------------------------------------------------

if (!CONTACT.contact_email) {
  console.error('✗ Fill CONTACT.contact_email first — the operator cannot be notified without it.')
  process.exit(1)
}

const { error: contactError } = await supabase
  .from('providers')
  .update(CONTACT)
  .eq('id', CACTUS_ID)

if (contactError) {
  console.error('✗ Provider update failed:', contactError.message)
  process.exit(1)
}
console.log('✓ Cactus contact saved:', CONTACT.contact_email)

const { data: listings, error: listError } = await supabase
  .from('listings')
  .select('id, name')
  .eq('provider_id', CACTUS_ID)
  .eq('active', true)

if (listError) {
  console.error('✗ Could not read listings:', listError.message)
  process.exit(1)
}

const rows = []
for (const listing of listings) {
  // Most specific rule wins; '*' is the fallback
  const rule =
    SCHEDULE.find(r => r.match !== '*' && listing.name.toLowerCase().includes(r.match.toLowerCase())) ??
    SCHEDULE.find(r => r.match === '*')
  if (!rule) continue

  rule.times.forEach(([start, label, capacity], i) => {
    rows.push({
      listing_id: listing.id,
      start_time: start,
      label: label ?? null,
      capacity: capacity ?? null,
      weekdays: rule.weekdays ?? [],
      sort_order: i,
      active: true,
    })
  })
}

const { error: slotError, count } = await supabase
  .from('listing_time_slots')
  .upsert(rows, { onConflict: 'listing_id,start_time', count: 'exact' })

if (slotError) {
  console.error('✗ Slot upsert failed:', slotError.message)
  process.exit(1)
}

console.log(`✓ ${count ?? rows.length} slots across ${listings.length} listings`)
