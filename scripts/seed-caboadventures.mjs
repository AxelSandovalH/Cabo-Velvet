import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://crhkpvjycknljqffravv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyaGtwdmp5Y2tubGpxZmZyYXZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYyMDUxNiwiZXhwIjoyMDk0MTk2NTE2fQ.F9aPMeDd7UiFmGo4TXf1cYsp6txeuaRUMWJxN6ztU_I'
)

const { data: provider, error: providerError } = await supabase
  .from('providers')
  .insert({ name: 'Cabo Adventures', category: 'tours', active: true })
  .select().single()

if (providerError) { console.error(providerError.message); process.exit(1) }
console.log('✓ Provider:', provider.id)

// USD prices (foreigners). price=adult público, agency_price=adult neto. Minor in price_notes.
const listings = [
  // SEA ADVENTURES
  { name: 'Snorkel and Sea Adventure',            price: 99,   agency_price: 70,   price_notes: 'Menor: $79 / $56. Preguntar cargos extras, políticas y edades.' },
  { name: 'Snorkel Adventure Cabo Pulmo',         price: 279,  agency_price: 210,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Whale Shark Encounter',                price: 259,  agency_price: 195,  price_notes: 'Menor: $219 / $165. Preguntar cargos extras, políticas y edades.' },
  { name: 'Whale Photo Safari — Speed Boat',      price: 99,   agency_price: 70,   price_notes: 'Menor: $79 / $56. Preguntar cargos extras, políticas y edades.' },
  { name: 'Whale Photo Safari — Catamaran',       price: 129,  agency_price: 91,   price_notes: 'Menor: $109 / $77. Preguntar cargos extras, políticas y edades.' },
  { name: 'Luxury Day Sailing',                   price: 149,  agency_price: 105,  price_notes: 'Menor: $129 / $91. Preguntar cargos extras, políticas y edades.' },
  { name: 'Luxury Sunset Sailing',                price: 109,  agency_price: 77,   price_notes: 'Menor: $89 / $63. Preguntar cargos extras, políticas y edades.' },
  { name: 'Two Bay Snorkel — Catamaran',          price: 149,  agency_price: 105,  price_notes: 'Menor: $129 / $91. Preguntar cargos extras, políticas y edades.' },
  { name: 'Balandra and Hidden Beaches',          price: 219,  agency_price: 165,  price_notes: 'Menor: $179 / $135. Preguntar cargos extras, políticas y edades.' },
  { name: 'Jet Ski',                              price: 179,  agency_price: 126,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Ocean Safari',                         price: 289,  agency_price: 232,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Twentyfive Catamaran Day',             price: 169,  agency_price: 119,  price_notes: 'Menor: $139 / $98. Preguntar cargos extras, políticas y edades.' },
  { name: 'Twentyfive Catamaran Sunset',          price: 139,  agency_price: 98,   price_notes: 'Menor: $109 / $77. Preguntar cargos extras, políticas y edades.' },

  // EARTH ADVENTURES
  { name: 'Combo ATV and Camel',                  price: 149,  agency_price: 105,  price_notes: 'Menor: $99 / $70. Preguntar cargos extras, políticas y edades.' },
  { name: 'Combo E-Bike and Camel',               price: 129,  agency_price: 91,   price_notes: 'Menor: $99 / $70. Preguntar cargos extras, políticas y edades.' },
  { name: 'Combo Off Road and Camel — Single',    price: 249,  agency_price: 175,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Combo Off Road and Camel — Double',    price: 349,  agency_price: 245,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Combo Off Road and Camel — Triple',    price: 399,  agency_price: 280,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Combo Off Road and Camel — Family',    price: 449,  agency_price: 315,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Combo Arch and Camel',                 price: 149,  agency_price: 74,   price_notes: 'Menor: $119 / $49. Preguntar cargos extras, políticas y edades.' },
  { name: 'Outdoor Adventure — Zip-line & Razors',price: 139,  agency_price: 98,   price_notes: 'Menor: $109 / $77. Preguntar cargos extras, políticas y edades.' },
  { name: 'Outback Camel Safari',                 price: 119,  agency_price: 42,   price_notes: 'Menor: $89 / $36. Preguntar cargos extras, políticas y edades.' },
  { name: 'E-Bike',                               price: 109,  agency_price: 77,   price_notes: 'Menor: $79 / $56. Preguntar cargos extras, políticas y edades.' },
  { name: 'El Triunfo Tour',                      price: 119,  agency_price: 84,   price_notes: 'Menor: $89 / $63. Preguntar cargos extras, políticas y edades.' },
  { name: 'Arte y Vino',                          price: 119,  agency_price: 84,   price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Magical Todos Santos / City Tour',     price: 119,  agency_price: 84,   price_notes: 'Menor: $89 / $63. Preguntar cargos extras, políticas y edades.' },
  { name: 'Park Pass',                            price: 299,  agency_price: 210,  price_notes: 'Menor: $249 / $175. Preguntar cargos extras, políticas y edades.' },
  { name: 'Beach Club',                           price: 149,  agency_price: 105,  price_notes: 'Menor: $129 / $90. Preguntar cargos extras, políticas y edades.' },

  // OFF-ROAD ADVENTURE
  { name: 'Off-Road Adventure — Single (1 pax)',  price: 199,  agency_price: null, price_notes: 'Balance especial — consultar.' },
  { name: 'Off-Road Adventure — Double (2 pax)',  price: 299,  agency_price: null, price_notes: 'Balance especial — consultar.' },
  { name: 'Off-Road Adventure — Triple (3 pax)',  price: 349,  agency_price: null, price_notes: 'Balance especial — consultar.' },
  { name: 'Off-Road Adventure — Family (4 pax)',  price: 399,  agency_price: null, price_notes: 'Balance especial — consultar.' },
  { name: 'Can-Am Maverick X3 — Single',          price: 299,  agency_price: 210,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Can-Am Maverick X3 — Double',          price: 399,  agency_price: 280,  price_notes: 'Solo adultos.' },
  { name: 'Can-Am Maverick X3 — Triple',          price: 449,  agency_price: 315,  price_notes: 'Solo adultos.' },
  { name: 'Can-Am Maverick X3 — Family',          price: 499,  agency_price: 350,  price_notes: 'Solo adultos.' },

  // ATV ADVENTURES
  { name: 'ATV Adventures — Single (1 pax)',      price: 130,  agency_price: null, price_notes: 'Balance especial — consultar.' },
  { name: 'ATV Adventures — Double (2 pax)',      price: 210,  agency_price: null, price_notes: 'Balance especial — consultar.' },

  // DOLPHINS
  { name: 'Dolphin Family Encounter',             price: 129,  agency_price: 91,   price_notes: 'Menor: $109 / $77. Preguntar cargos extras, políticas y edades.' },
  { name: 'Dolphin Swim & Ride Experience',       price: 169,  agency_price: 120,  price_notes: 'Menor: $119 / $84. Preguntar cargos extras, políticas y edades.' },
  { name: 'Dolphin Signature Swim',               price: 199,  agency_price: 140,  price_notes: 'Menor: $129 / $91. Preguntar cargos extras, políticas y edades.' },
  { name: 'Dolphin Premium Swim',                 price: 229,  agency_price: 161,  price_notes: 'Menor: $189 / $133. Preguntar cargos extras, políticas y edades.' },

  // SCUBA DIVE
  { name: 'Beginner Scuba 1 Tank',                price: 129,  agency_price: 97,   price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Certified Scuba 2 Tanks',              price: 129,  agency_price: 97,   price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Certified Scuba 2 Tanks — Cabo Pulmo', price: 279,  agency_price: 210,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Referral Dive',                        price: 469,  agency_price: 446,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'PADI Open Water Certification',        price: 519,  agency_price: 493,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },
  { name: 'Advanced Open Water Certification',    price: 399,  agency_price: 379,  price_notes: 'Solo adultos. Preguntar cargos extras, políticas y edades.' },

  // PRIVATE
  { name: 'Private Yacht 3 hrs — Sinaia',         price: 1499, agency_price: 1200, price_notes: 'Yate privado 3 horas. Preguntar cargos extras, políticas y edades.' },
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
