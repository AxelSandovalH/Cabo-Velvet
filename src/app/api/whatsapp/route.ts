import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runConcierge, Message, LeadContext } from '@/lib/concierge/agent'
import { sendWhatsApp } from '@/lib/concierge/ultramsg'

const ALLOWED_PHONES = (process.env.ALLOWED_WA_PHONES ?? '')
  .split(',').map((p) => p.trim().replace(/\D/g, '')).filter(Boolean)

function normalizePhone(raw: string): string {
  const digits = raw.replace('@c.us', '').replace(/\D/g, '').trim()
  return digits.length > 10 ? digits.slice(-10) : digits
}

function isAllowed(phone: string): boolean {
  if (!ALLOWED_PHONES.length) return false
  const normalizedAllowed = ALLOWED_PHONES.map((p) => (p.length > 10 ? p.slice(-10) : p))
  return normalizedAllowed.includes(phone)
}

async function loadHistory(phone: string): Promise<Message[]> {
  const { data } = await supabase
    .from('messages')
    .select('role, content')
    .eq('phone', phone)
    .order('created_at', { ascending: true })
    .limit(30)
  return (data ?? []) as Message[]
}

async function saveMessage(phone: string, role: 'user' | 'assistant', content: string) {
  await supabase.from('messages').insert({ phone, role, content })
}

export async function POST(req: NextRequest) {
  let phone = ''

  try {
    const body = await req.json()
    const data = body.data ?? body

    if (data.type !== 'chat') return NextResponse.json({ status: 'ok' })
    if (data.fromMe) return NextResponse.json({ status: 'ok' })
    if (String(data.from ?? '').includes('@g.us')) return NextResponse.json({ status: 'ok' })

    const fromRaw = String(data.from ?? '')
    phone = normalizePhone(fromRaw)
    const messageText = String(data.body ?? '').trim()
    if (!messageText) return NextResponse.json({ status: 'ok' })

    if (!isAllowed(phone)) {
      console.log('[concierge] blocked:', phone)
      return NextResponse.json({ status: 'ok' })
    }

    // Save user message immediately (atomic INSERT — no race condition)
    await saveMessage(phone, 'user', messageText)

    // Ensure conversation row exists for lead tracking
    const { data: conv } = await supabase
      .from('conversations')
      .select('name, group_size, travel_date, budget_range, interests')
      .eq('phone', phone)
      .maybeSingle()

    if (!conv) {
      await supabase.from('conversations').upsert(
        { phone, messages: [], lead_status: 'new', updated_at: new Date().toISOString() },
        { onConflict: 'phone' }
      )
    }

    // Load full history (includes the message we just saved)
    const history = await loadHistory(phone)

    const lead: LeadContext = {
      name: conv?.name,
      group_size: conv?.group_size,
      travel_date: conv?.travel_date,
      budget_range: conv?.budget_range,
      interests: conv?.interests,
    }

    // Pass history WITHOUT the last user message (agent appends it internally)
    const historyWithoutLast = history.slice(0, -1)
    const { reply } = await runConcierge(historyWithoutLast, messageText, phone, lead)

    // Save assistant reply (atomic INSERT)
    await saveMessage(phone, 'assistant', reply)

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('phone', phone)

    await sendWhatsApp(fromRaw, reply)
    console.log('[concierge] →', phone, reply.slice(0, 80))

  } catch (err) {
    console.error('[concierge error]', phone, err)
  }

  return NextResponse.json({ status: 'ok' })
}
