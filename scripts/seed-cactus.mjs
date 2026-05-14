import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://crhkpvjycknljqffravv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyaGtwdmp5Y2tubGpxZmZyYXZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYyMDUxNiwiZXhwIjoyMDk0MTk2NTE2fQ.F9aPMeDd7UiFmGo4TXf1cYsp6txeuaRUMWJxN6ztU_I'
)

// 1. Create provider
const { data: provider, error: providerError } = await supabase
  .from('providers')
  .insert({ name: 'Cactus', category: 'tours', active: true })
  .select()
  .single()

if (providerError) {
  console.error('Provider error:', providerError.message)
  process.exit(1)
}
console.log('✓ Provider created:', provider.id)

// 2. Listings data
const listings = [
  // COMBO
  { name: 'Combo — Person (2 activities)', price: 125, agency_price: 75,  price_unit: 'per person', price_notes: '2 activities included' },
  { name: 'Combo — Person (3 activities)', price: 175, agency_price: 100, price_unit: 'per person', price_notes: '3 activities included' },
  { name: 'Combo — Person (all activities 1-2 days)', price: 200, agency_price: 100, price_unit: 'per person', price_notes: 'All activities, 1-2 days' },
  // COMBO PREMIUM
  { name: 'Combo Premium — Person', price: 175, agency_price: 100, price_unit: 'per person', price_notes: 'Premium combo package' },
  // MIGRIÑO ATV TOUR
  { name: 'Migriño ATV Tour — Single ATV', price: 120, agency_price: 100, price_unit: 'per person', price_notes: 'Single ATV' },
  { name: 'Migriño ATV Tour — Double ATV', price: 200, agency_price: 155, price_unit: 'per vehicle', price_notes: 'Double ATV (2 riders)' },
  // BEACH & DUNES ATV ADVENTURE
  { name: 'Beach & Dunes ATV — Single', price: 170, agency_price: 140, price_unit: 'per person', price_notes: 'Single ATV' },
  { name: 'Beach & Dunes ATV — Double', price: 250, agency_price: 205, price_unit: 'per vehicle', price_notes: 'Double ATV (2 riders)' },
  // SIDE BY SIDE
  { name: 'Side by Side Sport — 1 pax', price: 205, agency_price: 135, price_unit: 'per vehicle', price_notes: '1 passenger' },
  { name: 'Side by Side Sport — 2 pax', price: 290, agency_price: 210, price_unit: 'per vehicle', price_notes: '2 passengers' },
  { name: 'Side by Side Sport — 3 pax', price: 350, agency_price: 260, price_unit: 'per vehicle', price_notes: '3 passengers' },
  { name: 'Side by Side Sport — 4 pax', price: 405, agency_price: 305, price_unit: 'per vehicle', price_notes: '4 passengers' },
  // CAN AM X3 TURBO
  { name: 'Can Am X3 Turbo Adventure — 1 pax', price: 300, agency_price: 210, price_unit: 'per vehicle', price_notes: '1 passenger' },
  { name: 'Can Am X3 Turbo Adventure — 2 pax', price: 400, agency_price: 300, price_unit: 'per vehicle', price_notes: '2 passengers' },
  { name: 'Can Am X3 Turbo Adventure — 3 pax', price: 450, agency_price: 340, price_unit: 'per vehicle', price_notes: '3 passengers' },
  { name: 'Can Am X3 Turbo Adventure — 4 pax', price: 500, agency_price: 380, price_unit: 'per vehicle', price_notes: '4 passengers' },
  // MAVERICK RC TURBO
  { name: 'Maverick RC Turbo Adventure', price: 600, agency_price: 450, price_unit: 'per vehicle', price_notes: 'Sencillo y doble' },
  // SIDE BY SIDE KID
  { name: 'Side by Side Kid Adventure — 1 Driver', price: 140, agency_price: 75, price_unit: 'per vehicle', price_notes: 'Mini Razor 170, 1 driver' },
  { name: 'Side by Side Kid Adventure — Driver + Passenger', price: 175, agency_price: 100, price_unit: 'per vehicle', price_notes: 'Mini Razor 170, driver + passenger' },
  // HORSEBACK RIDING
  { name: 'Horseback Riding Tour — Adults', price: 120, agency_price: 100, price_unit: 'per person', price_notes: 'Adults' },
  { name: 'Horseback Riding Tour — Children', price: 60,  agency_price: 40,  price_unit: 'per person', price_notes: 'Children' },
  // CAMEL RIDE
  { name: 'Camel Ride & Encounter — Adults', price: 120,  agency_price: 72.5, price_unit: 'per person', price_notes: 'Adults. Precio pareja nacional: $1170 MXN + extras' },
  { name: 'Camel Ride & Encounter — Children', price: 60,  agency_price: 30,  price_unit: 'per person', price_notes: 'Children' },
  // SKY BIKE
  { name: 'Sky Bike — Adult',    price: 120, agency_price: 85, price_unit: 'per person', price_notes: 'Adults' },
  { name: 'Sky Bike — Children', price: 60,  agency_price: 35, price_unit: 'per person', price_notes: 'Children' },
  // CAMEL + ARCH CLEAR BOAT + LUNCH
  { name: 'Camel + Arch Clear Boat + Lunch — Adult',    price: 135,  agency_price: 95,   price_unit: 'per person', price_notes: 'Adults. Transporte +$10 USD p/p' },
  { name: 'Camel + Arch Clear Boat + Lunch — Children', price: 67.5, agency_price: 47.5, price_unit: 'per person', price_notes: 'Children. Transporte +$10 USD p/p' },
]

const rows = listings.map(l => ({
  ...l,
  category: 'experience',
  active: true,
  location: 'Los Cabos, BCS',
}))

const { data: inserted, error: insertError } = await supabase
  .from('listings')
  .insert(rows)
  .select('id, name')

if (insertError) {
  console.error('Listings error:', insertError.message)
  process.exit(1)
}

console.log(`✓ ${inserted.length} listings created`)
inserted.forEach(l => console.log(`  - ${l.name}`))
