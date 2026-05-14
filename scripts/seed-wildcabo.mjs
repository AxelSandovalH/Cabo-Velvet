import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://crhkpvjycknljqffravv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyaGtwdmp5Y2tubGpxZmZyYXZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYyMDUxNiwiZXhwIjoyMDk0MTk2NTE2fQ.F9aPMeDd7UiFmGo4TXf1cYsp6txeuaRUMWJxN6ztU_I'
)

const { data: provider, error: providerError } = await supabase
  .from('providers')
  .insert({ name: 'Wild Cabo Tours / Cabo Expeditions', category: 'tours', active: true })
  .select()
  .single()

if (providerError) { console.error(providerError.message); process.exit(1) }
console.log('✓ Provider:', provider.id)

const listings = [
  // BEACH HOPPER
  { name: 'Beach Hopper Snorkel — Adulto con Lunch', price: 99,  agency_price: 55,  price_unit: 'per person', price_notes: 'Con transporte: $115 público / $70 neto. +$5 USD port fee en check-in.' },
  { name: 'Beach Hopper Snorkel — Menor con Lunch',  price: 79,  agency_price: 44,  price_unit: 'per person', price_notes: 'Con transporte: $99 público / $59 neto. +$5 USD port fee en check-in.' },
  { name: 'Privado: Beach Hopper Snorkel con Lunch (6 pax)', price: 890, agency_price: 450, price_unit: 'per group', price_notes: 'Hasta 6 pax. Pax extra: $75 público / $35 neto.' },

  // LANDS END
  { name: 'Lands End Snorkel — Adulto y Menor 1.5 hrs', price: 52, agency_price: 30, price_unit: 'per person', price_notes: 'Con transporte: $72 / $45. Infantes <5 años solo pagan $3 Natural Reserve Access. +$5 port fee.' },
  { name: 'Privado: Lands End Snorkel 1.5 hrs (12 pax)', price: 520, agency_price: 300, price_unit: 'per group', price_notes: 'Hasta 12 pax.' },

  // KAYAK Y SNORKEL
  { name: 'Kayak y Snorkel — Adulto', price: 99, agency_price: 50, price_unit: 'per person', price_notes: 'Con transporte: $119 / $65. +$5 port fee.' },
  { name: 'Kayak y Snorkel — Menor',  price: 79, agency_price: 45, price_unit: 'per person', price_notes: 'Con transporte: $99 / $60. +$5 port fee.' },
  { name: 'Privado: Kayak y Snorkel (4 pax)', price: 396, agency_price: 215, price_unit: 'per group', price_notes: 'Base 4 pax. Pax extra máx 6: $60 / $40.' },

  // STAND UP PADDLE BOARD
  { name: 'Stand Up Paddle Board — Adulto', price: 95, agency_price: 50, price_unit: 'per person', price_notes: 'Con transporte: $115 / $65. +$5 port fee.' },
  { name: 'Stand Up Paddle Board — Menor',  price: 75, agency_price: 45, price_unit: 'per person', price_notes: 'Con transporte: $95 / $60. +$5 port fee.' },

  // ZODIAC VISITA AL ARCO
  { name: 'Zodiac Visita al Arco 45min', price: 30, agency_price: 15, price_unit: 'per person', price_notes: 'Con transporte: $50 / $30. +$5 port fee.' },
  { name: 'Privado: Zodiac Visita al Arco 45min', price: 350, agency_price: 199, price_unit: 'per group', price_notes: 'Precio privado todo el zodiac.' },

  // UP CLOSE WHALE WATCHING
  { name: 'Up Close Whale Watching by Zodiac — Adulto', price: 99, agency_price: 55, price_unit: 'per person', price_notes: 'Con transporte: $115 / $70. +$5 port fee. Infantes <5 años solo $3 Natural Reserve.' },
  { name: 'Up Close Whale Watching by Zodiac — Menor',  price: 60, agency_price: 36, price_unit: 'per person', price_notes: 'Con transporte: $80 / $51.' },
  { name: 'Privado: Up Close Whale Watching (1-8 pax, 2-2.5 hrs)', price: 750, agency_price: 499, price_unit: 'per group', price_notes: 'Pax extra máx 5: $65 / $40.' },

  // WHALE CONCERT
  { name: 'Whale Concert — Adulto 2.5 hrs', price: 110, agency_price: 66, price_unit: 'per person', price_notes: 'Con transporte: $130 / $81. +$5 port fee.' },
  { name: 'Whale Concert — Menor 2.5 hrs',  price: 89,  agency_price: 45, price_unit: 'per person', price_notes: 'Con transporte: $109 / $60.' },
  { name: 'Privado: Whale Concert (1-8 pax, 2.5 hrs)', price: 950, agency_price: 650, price_unit: 'per group', price_notes: 'Pax extra máx 4: $70 / $50.' },

  // WHALE WATCHING AND SNORKEL
  { name: 'Whale Watching & Snorkel by Zodiac — Adulto', price: 110, agency_price: 69, price_unit: 'per person', price_notes: 'Con transporte: $135 / $84. +$5 port fee.' },
  { name: 'Whale Watching & Snorkel by Zodiac — Menor',  price: 99,  agency_price: 55, price_unit: 'per person', price_notes: 'Con transporte: $119 / $70.' },
  { name: 'Privado: Whale Watching & Snorkel (1-8 pax, 3.5 hrs)', price: 1100, agency_price: 690, price_unit: 'per group', price_notes: 'Pax extra: $85 / $60.' },

  // PARASAILING
  { name: 'Parasailing Doble',    price: 120, agency_price: 80, price_unit: 'per ride', price_notes: 'Con transporte: $160 / $110. +$5 port fee.' },
  { name: 'Parasailing Sencillo', price: 79,  agency_price: 43, price_unit: 'per person', price_notes: 'Con transporte: $99 / $58.' },
  { name: 'Privado: Parasailing 1 hora (hasta 6 pax)',  price: 780, agency_price: 450, price_unit: 'per group', price_notes: 'Hasta 6 pax.' },
  { name: 'Privado: Parasailing 1 hora (hasta 10 pax)', price: 850, agency_price: 550, price_unit: 'per group', price_notes: 'Hasta 10 pax.' },

  // BEACH DAY
  { name: 'Beach Day — Adulto', price: 125, agency_price: 75, price_unit: 'per person', price_notes: 'Incluye transportación.' },
  { name: 'Beach Day — Menor',  price: 70,  agency_price: 42, price_unit: 'per person', price_notes: 'Incluye transportación.' },
  { name: 'Privado: Beach Day (1-6 pax)', price: 650, agency_price: 420, price_unit: 'per group', price_notes: 'Pax extra hasta 15: $75 / $39.' },

  // SUNRISE WITH WHALES AND BUBBLE BREAKFAST
  { name: 'Sunrise with Whales & Bubble Breakfast — Adulto', price: 145, agency_price: 85, price_unit: 'per person', price_notes: 'Incluye transportación. +$5 port fee.' },
  { name: 'Sunrise with Whales & Bubble Breakfast — Menor',  price: 99,  agency_price: 60, price_unit: 'per person', price_notes: 'Incluye transportación.' },
  { name: 'Privado: Sunrise with Whales (1-8 pax)', price: 1100, agency_price: 660, price_unit: 'per group', price_notes: 'Pax extra máx 5: $99 / $70.' },

  // SWIMMING WITH WHALE SHARKS
  { name: 'Swimming with Whale Sharks — Adulto', price: 240, agency_price: 170, price_unit: 'per person', price_notes: 'Con transporte: $349 / $230. +$5 port fee.' },
  { name: 'Privado: Swimming with Whale Sharks (hasta 6 pax)', price: 2890, agency_price: 1900, price_unit: 'per group', price_notes: 'Pax extra máx 4: $220 / $150.' },

  // ESPIRITU SANTO
  { name: 'Espíritu Santo Island Expedition — Adulto', price: 249, agency_price: 160, price_unit: 'per person', price_notes: 'Con transporte: $370 / $241. +$5 port fee.' },
  { name: 'Privado: Espíritu Santo Island Expedition (hasta 6 pax)', price: 2960, agency_price: 2070, price_unit: 'per group', price_notes: 'Pax extra hasta 4: $234 / $165.' },
]

const rows = listings.map(l => ({
  ...l,
  category: 'experience',
  active: true,
  location: 'Los Cabos, BCS',
}))

const { data: inserted, error } = await supabase.from('listings').insert(rows).select('id, name')
if (error) { console.error(error.message); process.exit(1) }

console.log(`✓ ${inserted.length} listings created`)
inserted.forEach(l => console.log(`  - ${l.name}`))
