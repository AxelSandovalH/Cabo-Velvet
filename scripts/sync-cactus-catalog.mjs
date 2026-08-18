/**
 * Syncs the Cactus catalog with their August 2026 rate sheet and flyers:
 * prices, margins, descriptions, what each tour includes, and hourly departures.
 *
 *   node --env-file=.env.local scripts/sync-cactus-catalog.mjs [--dry]
 *
 * Idempotent: matches listings by name inside the Cactus provider.
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CACTUS_ID = '47f81fb8-1428-4177-ab89-d51cd17a7b0b'
const DRY = process.argv.includes('--dry')

const PARK_FEE = '+$25 USD park entrance fee per person, paid on arrival'
const INSURANCE = 'Optional collision insurance offered at check-in'

// Perks every Cactus tour carries, straight from the flyer
const ALWAYS = [
  'Round-trip transportation',
  'Tequila museum & tasting',
  'Beach club stop (oceanfront)',
  'Kids Club access (6 months–12 years, free)',
]

const OFFROAD = ['Water', 'Safety equipment', ...ALWAYS]

/** name → { price, balance (our margin), tagline, description, duration, includes, specs } */
const CATALOG = {
  // ── Park passes ────────────────────────────────────────────────────────────
  'Full Park Pass (Día completo)': {
    price: 299, balance: 150, duration: 'Full day — no limits',
    tagline: 'One park. Every adventure. No limits.',
    description: `The only oceanfront adventure park in Los Cabos, where the desert meets the Pacific.\n\nOne pass, every experience: ATV and UTV off-road in Migriño, Mini RZR for kids, the Guinness World Record Sky Bikes, the camel ride and interactive encounter, horseback riding by the Pacific, and the tequila museum and tasting.\n\nStay as long as you want. Open daily from 8:00 a.m., hourly departures.`,
    includes: ['Park entrance fee included', 'Collision insurance included', 'All you can eat & drink à la carte (non-alcoholic)', 'Nature hike in the ecological reserve', ...ALWAYS],
    notes: 'All-inclusive — park entrance already covered',
  },
  'Full Park Pass (Medio día Extendido)': {
    price: 249, balance: 125, duration: 'Up to 6 hours',
    tagline: 'Every adventure, six hours to live it.',
    description: `All-access pass to the only oceanfront adventure park in Los Cabos, for up to six hours.\n\nPick your experiences freely: off-road in ATV or UTV, Sky Bikes, camels, horseback riding, the tequila museum, and the beach club by the Pacific.`,
    includes: ['Park entrance fee included', 'Collision insurance included', 'All you can eat & drink à la carte (non-alcoholic)', 'Nature hike in the ecological reserve', ...ALWAYS],
    notes: 'All-inclusive — park entrance already covered',
  },
  'Full Park Pass (Medio día)': {
    price: 199, balance: 100, duration: 'Up to 4 hours',
    tagline: 'The whole park, in one morning.',
    description: `All-access pass to the only oceanfront adventure park in Los Cabos, for up to four hours.\n\nEverything is included: off-road adventures, Sky Bikes, camels, horseback riding, tequila museum and beach club.`,
    includes: ['Park entrance fee included', 'Collision insurance included', 'All you can eat & drink à la carte (non-alcoholic)', 'Nature hike in the ecological reserve', ...ALWAYS],
    notes: 'All-inclusive — park entrance already covered',
  },

  // ── Combos ─────────────────────────────────────────────────────────────────
  'Combo — Person (2 activities)': {
    price: 125, balance: 50, duration: '1 hour per activity',
    tagline: 'Build your combo, save up to 60%.',
    description: `Choose any two experiences and live them the same day: camel ride and interaction, ATV or UTV through the desert and Pacific beaches, horseback riding between the desert and the sea, or the world's longest Sky Bike.`,
    includes: ['Two experiences of your choice', ...ALWAYS], notes: PARK_FEE,
  },
  'Combo — Person (3 activities)': {
    price: 175, balance: 75, duration: '1 hour per activity',
    tagline: 'Three adventures, one day.',
    description: `Choose any three experiences and live them the same day: camel ride and interaction, ATV or UTV through the desert and Pacific beaches, horseback riding between the desert and the sea, or the world's longest Sky Bike.`,
    includes: ['Three experiences of your choice', ...ALWAYS], notes: PARK_FEE,
  },
  'Combo Premium — Person': {
    price: 175, balance: 75, duration: '1 hour per tour',
    tagline: 'Our most exclusive vehicles.',
    description: `Two experiences aboard the most exclusive vehicles in the park — fully equipped, high performance and built for a superior adventure.`,
    includes: ['Two premium experiences', 'Water', ...ALWAYS], notes: PARK_FEE,
  },

  // ── Balandra ───────────────────────────────────────────────────────────────
  'Solo Balandra Beach — Person': {
    price: 150, balance: 75, duration: '8–9 hours',
    tagline: 'The most beautiful beach in Mexico.',
    description: `Balandra is a protected natural paradise, famous for its crystal-clear turquoise water, white sand and scenery where the desert meets the sea.\n\nRelax in its calm, shallow water, explore its iconic landscapes and experience a place unlike any other in the country.\n\nPick-up: San José del Cabo 8:00 a.m. · Tourist corridor 8:15 a.m. · Cabo San Lucas 8:30 a.m.`,
    includes: ['Breakfast & lunch', 'Soft drinks', 'Water', 'Tequila tasting', 'Round-trip transportation'],
    notes: 'Taxes included. Departs early morning by pick-up zone',
  },

  // ── Camel ──────────────────────────────────────────────────────────────────
  'Camel Ride & Encounter — Adults': {
    price: 125, balance: 47.5, duration: '2 hours',
    tagline: 'Ride a camel along the Pacific.',
    description: `A spectacular camel ride along the Pacific Ocean, surrounded by landscapes where the desert meets the sea.\n\nDiscover the fascinating world of camels through a guided, educational experience: get close, feed them and connect with these extraordinary animals.\n\nOur sanctuary is home to more than 80 camels, and thanks to our conservation work there is a good chance you will meet the baby camels during your visit.`,
    includes: ['Tacos & quesadillas (pastor, chicken or beef)', 'Fresh flavored water', 'Experienced camel handler and bilingual guides', 'Desert safari ride', 'Nature hike in the ecological reserve', ...ALWAYS],
    notes: PARK_FEE,
  },
  'Camel Ride & Encounter — Children': {
    price: 60, balance: 30, duration: '2 hours',
    tagline: 'Meet the camels of the Pacific.',
    description: `The camel experience for kids: a guided ride along the Pacific and a close encounter where they can feed and connect with the animals, with bilingual guides and expert handlers.`,
    includes: ['Tacos & quesadillas (pastor, chicken or beef)', 'Fresh flavored water', 'Experienced camel handler and bilingual guides', 'Desert safari ride', ...ALWAYS],
    notes: PARK_FEE,
  },

  // ── Sky Bikes ──────────────────────────────────────────────────────────────
  'Sky Bike — Adult': {
    price: 125, balance: 35, duration: '2 hours',
    tagline: "Pedal the world's longest sky bike.",
    description: `Pedal high above the ground on the world's longest sky bike, officially recognized by GUINNESS WORLD RECORDS®, spanning over 2,800 feet suspended above the desert and the Pacific Ocean.\n\nUp to four bikes ride simultaneously, so you share the height with family or friends. Designed for all ages and fitness levels.`,
    includes: ['Water', 'Safety equipment', 'Nature hike in the ecological reserve', 'Desert safari ride', ...ALWAYS],
    notes: PARK_FEE,
  },
  'Sky Bike — Children': {
    price: 60, balance: 25, duration: '2 hours',
    tagline: 'Ride in the sky, for young explorers.',
    description: `The Guinness World Record sky bike for kids: over 2,800 feet suspended above the desert and the Pacific, with up to four bikes riding at the same time so the whole family shares it.`,
    includes: ['Water', 'Safety equipment', 'Nature hike in the ecological reserve', 'Desert safari ride', ...ALWAYS],
    notes: PARK_FEE,
  },

  // ── Horseback ──────────────────────────────────────────────────────────────
  'Horseback Riding Tour — Adults': {
    price: 125, balance: 20, duration: '2 hours',
    tagline: 'Between the desert and the sea.',
    description: `Discover the beauty of the desert on horseback as you make your way toward the Pacific Ocean, surrounded by open landscapes and fresh ocean air.\n\nA relaxing, memorable ride, suited to every skill level.`,
    includes: OFFROAD, notes: PARK_FEE,
  },
  'Horseback Riding Tour — Children': {
    price: 60, balance: 20, duration: '2 hours',
    tagline: 'A gentle ride toward the Pacific.',
    description: `A calm horseback ride through the desert toward the Pacific, guided and suited to riders of any level — first-timers included.`,
    includes: OFFROAD, notes: PARK_FEE,
  },

  // ── Migriño ATV ────────────────────────────────────────────────────────────
  'Migriño ATV Tour — Single ATV': {
    price: 125, balance: 20, duration: '2 hours',
    tagline: 'Desert, arroyos and Pacific dunes.',
    description: `Feel the energy and freedom of every kind of terrain on an ATV.\n\nRide through spectacular landscapes where desert, mountains and natural trails come together, crossing arroyos and sand dunes all the way to the Pacific Ocean.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Migriño ATV Tour — Double ATV': {
    price: 200, balance: 45, duration: '2 hours',
    tagline: 'Two riders, one ATV, one coastline.',
    description: `The Migriño ATV adventure for two: desert, mountain trails, arroyos and sand dunes all the way to the beaches of the Pacific Ocean, sharing a single automatic ATV.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },

  // ── Beach & Dunes ──────────────────────────────────────────────────────────
  'Beach & Dunes ATV — Single': {
    price: 170, balance: 30, duration: '2 hours',
    tagline: 'Ride where others cannot.',
    description: `The ultimate ATV experience: the only ATV tour in the world where you truly ride over 20 miles along the untouched beaches of the Pacific Ocean and across its dunes.\n\nTake full control of a powerful automatic ATV with intelligent braking, electronic steering and independent suspension. Go further and ride longer, with 50% more driving time than any other tour.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Beach & Dunes ATV — Double': {
    price: 250, balance: 45, duration: '2 hours',
    tagline: '20 miles of untouched beach, for two.',
    description: `The ultimate ATV experience, shared: over 20 miles along the untouched beaches of the Pacific and across its dunes, on a powerful automatic ATV with intelligent braking and independent suspension — 50% more driving time than any other tour.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },

  // ── Side by Side (Migriño UTV) ─────────────────────────────────────────────
  'Side by Side Sport — 1 pax': {
    price: 205, balance: 70, duration: '2 hours',
    tagline: 'UTV through desert and Pacific beaches.',
    description: `Drive your UTV through dramatic desert landscapes, navigate mountain trails, cross natural arroyos and conquer rolling sand dunes, all the way to the beaches of the Pacific Ocean.\n\nPerfect for every experience level — an immersive way to explore the wild side of Los Cabos.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Side by Side Sport — 2 pax': {
    price: 290, balance: 80, duration: '2 hours',
    tagline: 'Two seats, every terrain.',
    description: `The Migriño UTV adventure for two: desert landscapes, mountain trails, natural arroyos and sand dunes all the way to the Pacific Ocean, in a vehicle built for total control.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Side by Side Sport — 3 pax': {
    price: 350, balance: 90, duration: '2 hours',
    tagline: 'Three seats through the desert.',
    description: `A three-seat UTV through dramatic desert landscapes, mountain trails, arroyos and dunes, all the way to the beaches of the Pacific Ocean.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Side by Side Sport — 4 pax': {
    price: 405, balance: 100, duration: '2 hours',
    tagline: 'The whole group, one vehicle.',
    description: `A four-seat UTV so the group rides together: desert, mountain trails, natural arroyos and sand dunes, all the way to the Pacific Ocean.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },

  // ── Kids ───────────────────────────────────────────────────────────────────
  'Side by Side Kid Adventure — 1 Driver': {
    price: 140, balance: 65, duration: '2 hours',
    tagline: 'Their first off-road drive.',
    description: `The perfect adventure for young explorers. Our Mini RZR vehicles are built for maximum stability — only 6 inches of ground clearance, making them extremely hard to tip over — and are speed-governed for a controlled, safe ride.\n\nKids drive on their own, without their parents, in a fully supervised environment.`,
    includes: OFFROAD, notes: `${PARK_FEE}. Mini RZR 170, speed-governed`,
  },
  'Side by Side Kid Adventure — Driver + Passenger': {
    price: 175, balance: 75, duration: '2 hours',
    tagline: 'One drives, one rides along.',
    description: `The Mini RZR adventure for two kids: one drives, one rides along. Built for maximum stability, speed-governed and fully supervised, so their first off-road experience is all thrill and no risk.`,
    includes: OFFROAD, notes: `${PARK_FEE}. Mini RZR 170, speed-governed`,
  },

  // ── Can-Am X3 ──────────────────────────────────────────────────────────────
  'Can Am X3 Turbo Adventure — 1 pax': {
    price: 300, balance: 90, duration: '2 hours',
    tagline: 'Best ride ever.',
    description: `Step into a premium off-road experience. Drive the Can-Am Maverick X3 Turbo and explore Cabo's wild beauty in style — powerful performance, unmatched comfort and breathtaking views at every turn.\n\nFor those who demand the best, this is the ultimate ride.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Can Am X3 Turbo Adventure — 2 pax': {
    price: 400, balance: 100, duration: '2 hours',
    tagline: 'Premium off-road, for two.',
    description: `The Can-Am Maverick X3 Turbo for two: dunes, mountains and ocean views with the power and comfort of the king of off-road vehicles.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Can Am X3 Turbo Adventure — 3 pax': {
    price: 450, balance: 110, duration: '2 hours',
    tagline: 'Three seats of raw power.',
    description: `A three-seat Can-Am Maverick X3 Turbo across dunes, mountains and ocean views — premium performance with room for the group.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },
  'Can Am X3 Turbo Adventure — 4 pax': {
    price: 500, balance: 120, duration: '2 hours',
    tagline: 'The king of off-road, for four.',
    description: `A four-seat Can-Am Maverick X3 Turbo: dunes, mountain trails and Pacific views, with the whole group in one vehicle.`,
    includes: OFFROAD, notes: `${PARK_FEE}. ${INSURANCE}`,
  },

  // ── Maverick ───────────────────────────────────────────────────────────────
  'Maverick RC Turbo Adventure': {
    price: 600, balance: 150, duration: '2 hours',
    tagline: 'Dare to handle the beast.',
    description: `This is not just a tour — it's an elite off-road experience. Command the most powerful all-terrain vehicle in the park and explore Cabo's landscapes with raw power, speed and total control.\n\nOnly a few dare. Are you one of them?`,
    includes: OFFROAD,
    specs: [
      { label: 'Engine', value: '200 hp turbocharged triple-cylinder' },
      { label: 'Width', value: '72 in' },
      { label: 'Ground clearance', value: '16 in' },
      { label: 'Tires', value: '32 in' },
      { label: 'Safety', value: '4-point harness belts' },
      { label: 'Steering', value: 'Dynamic power steering' },
    ],
    notes: `${PARK_FEE}. ${INSURANCE}. Single or double`,
  },
}

// Hourly departures, 8 a.m. to 5 p.m. Balandra leaves once, early.
const HOURLY = Array.from({ length: 10 }, (_, i) => `${String(8 + i).padStart(2, '0')}:00`)
const SLOTS = { 'Solo Balandra Beach — Person': ['08:00'] }

// ── Run ──────────────────────────────────────────────────────────────────────
const { data: existing, error: readErr } = await supabase
  .from('listings').select('id, name, price, agency_price').eq('provider_id', CACTUS_ID)

if (readErr) { console.error('✗', readErr.message); process.exit(1) }
const byName = Object.fromEntries(existing.map(l => [l.name, l]))

let updated = 0, created = 0, slotRows = []
for (const [name, c] of Object.entries(CATALOG)) {
  const agency = +(c.price - c.balance).toFixed(2)
  const payload = {
    price: c.price,
    agency_price: agency,
    tagline: c.tagline,
    description: c.description,
    price_unit: name.includes('pax') || name.includes('Double') || name.includes('Passenger') || name.includes('Vehicle')
      ? 'per vehicle' : 'per person',
    price_notes: c.notes,
    details: {
      duration: c.duration,
      includes: c.includes,
      ...(c.specs ? { specs: c.specs } : {}),
    },
    updated_at: new Date().toISOString(),
  }

  const row = byName[name]
  if (row) {
    if (!DRY) {
      const { error } = await supabase.from('listings').update(payload).eq('id', row.id)
      if (error) { console.error('✗', name, error.message); continue }
    }
    const priceMoved = row.price !== c.price
    console.log(`~ ${name}${priceMoved ? `  $${row.price} → $${c.price}` : ''}`)
    updated++
    slotRows.push({ id: row.id, name })
  } else {
    if (!DRY) {
      const { data, error } = await supabase.from('listings')
        .insert({ ...payload, name, category: 'experience', location: 'Los Cabos, BCS', active: true, provider_id: CACTUS_ID, images: [] })
        .select('id').single()
      if (error) { console.error('✗', name, error.message); continue }
      slotRows.push({ id: data.id, name })
    }
    console.log(`+ ${name}  $${c.price}`)
    created++
  }
}

// Departure times
let slotCount = 0
for (const { id, name } of slotRows) {
  const times = SLOTS[name] ?? HOURLY
  const rows = times.map((t, i) => ({
    listing_id: id, start_time: t, label: null, capacity: null, weekdays: [], sort_order: i, active: true,
  }))
  if (!DRY) {
    const { error } = await supabase.from('listing_time_slots').upsert(rows, { onConflict: 'listing_id,start_time' })
    if (error) { console.error('✗ horarios', name, error.message); continue }
  }
  slotCount += rows.length
}

// Operator contact from the flyer's back cover
if (!DRY) {
  await supabase.from('providers').update({
    contact_phone: '624 146 4650',
    whatsapp: '52 624 130 6864',
    website: 'cactustours.com',
    notes: 'Reservas 7 a.m.–10 p.m. Salidas cada hora 8 a.m.–5 p.m. Entrada al parque $25 USD por persona.',
  }).eq('id', CACTUS_ID)
}

console.log(`\n${DRY ? '[simulación] ' : ''}${updated} actualizados · ${created} creados · ${slotCount} horarios`)
