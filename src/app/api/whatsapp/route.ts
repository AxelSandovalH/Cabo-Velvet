import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runConcierge, Message, LeadContext } from '@/lib/concierge/agent'
import { sendWhatsApp } from '@/lib/concierge/ultramsg'

const ALLOWED_PHONES = (process.env.ALLOWED_WA_PHONES ?? '')
  .split(',').map((p) => p.trim().replace(/\D/g, '')).filter(Boolean)

function normalizePhone(raw: string): string {
  // Strip @c.us and non-digits, then keep last 10 digits (Mexican local number)
  const digits = raw.replace('@c.us', '').replace(/\D/g, '').trim()
  return digits.length > 10 ? digits.slice(-10) : digits
}

function isAllowed(phone: string): boolean {
  if (!ALLOWED_PHONES.length) return false
  // Normalize allowlist entries the same way
  const normalizedAllowed = ALLOWED_PHONES.map((p) => (p.length > 10 ? p.slice(-10) : p))
  return normalizedAllowed.includes(phone)
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

    // Load conversation (upsert guarantees row exists)
    const { data: conv } = await supabase
      .from('conversations')
      .select('messages, name, group_size, travel_date, budget_range, interests')
      .eq('phone', phone)
      .maybeSingle()

    const history: Message[] = Array.isArray(conv?.messages) ? conv.messages : []

    // Append user message immediately so concurrent calls see it
    const historyWithUser: Message[] = [...history, { role: 'user' as const, content: messageText }]

    await supabase.from('conversations').upsert(
      { phone, messages: historyWithUser, lead_status: conv ? undefined : 'new', updated_at: new Date().toISOString() },
      { onConflict: 'phone', ignoreDuplicates: false }
    )

    const lead: LeadContext = {
      name: conv?.name,
      group_size: conv?.group_size,
      travel_date: conv?.travel_date,
      budget_range: conv?.budget_range,
      interests: conv?.interests,
    }

    // Run agent with full history (already includes the new user message)
    const { reply, updatedHistory } = await runConcierge(history, messageText, phone, lead)

    // Save final history with assistant reply
    await supabase
      .from('conversations')
      .update({ messages: updatedHistory, updated_at: new Date().toISOString() })
      .eq('phone', phone)

    await sendWhatsApp(fromRaw, reply)
    console.log('[concierge] →', phone, reply.slice(0, 80))

  } catch (err) {
    console.error('[concierge error]', phone, err)
  }

  return NextResponse.json({ status: 'ok' })
}
