import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load .env.local
const env = readFileSync('.env.local', 'utf8')
for (const line of env.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUCKET = 'listing-images'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function run() {
  // 1. Fetch all yacht listings
  const { data: yachts, error } = await supabase
    .from('listings')
    .select('id, name, images')
    .eq('category', 'yacht')
    .order('created_at', { ascending: true })

  if (error) { console.error('Error fetching listings:', error); process.exit(1) }
  console.log(`Found ${yachts.length} yacht listings`)

  // 2. List all images in storage (root + subfolders)
  const allFiles = []
  const { data: rootFiles } = await supabase.storage.from(BUCKET).list('', { limit: 200 })
  for (const f of (rootFiles ?? [])) {
    if (f.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      allFiles.push(supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl)
    } else if (!f.name.includes('.')) {
      // It's a folder — list its contents
      const { data: subFiles } = await supabase.storage.from(BUCKET).list(f.name, { limit: 100 })
      for (const sf of (subFiles ?? [])) {
        if (sf.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
          allFiles.push(supabase.storage.from(BUCKET).getPublicUrl(`${f.name}/${sf.name}`).data.publicUrl)
        }
      }
    }
  }

  const imageUrls = allFiles

  console.log(`Found ${imageUrls.length} images in storage`)

  if (imageUrls.length === 0) {
    console.log('No images found — only cleaning names')
  }

  // 3. Shuffle images and distribute 2-4 per listing
  const shuffled = shuffle(imageUrls)
  let imgIndex = 0

  for (const yacht of yachts) {
    // Clean name — remove "Papillon" and trailing "— N" number
    const cleanName = yacht.name
      .replace(/\bpapillon\b/i, '')
      .replace(/—\s*\d+\s*$/i, '')
      .replace(/\s*—\s*$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim()

    // Assign 2-3 images cycling through all available
    let newImages = yacht.images ?? []
    if (shuffled.length > 0) {
      const count = 2 + (imgIndex % 2) // alternates 2 and 3 images
      newImages = []
      for (let i = 0; i < count; i++) {
        newImages.push(shuffled[(imgIndex + i) % shuffled.length])
      }
      imgIndex = (imgIndex + count) % shuffled.length
    }

    const { error: updateErr } = await supabase
      .from('listings')
      .update({ name: cleanName, images: newImages })
      .eq('id', yacht.id)

    if (updateErr) {
      console.error(`Error updating ${yacht.name}:`, updateErr)
    } else {
      console.log(`✓ "${yacht.name}" → "${cleanName}" (${newImages.length} images)`)
    }
  }

  console.log('\nDone!')
}

run()
