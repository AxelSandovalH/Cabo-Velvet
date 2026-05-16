import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runConcierge, Message } from '@/lib/concierge/agent'
import { sendWhatsApp } from '@/lib/concierge/ultramsg'

// Only these numbers can chat with the concierge (allowlist)
const ALLOWED_PHONES = (process.env.ALLOWED_WA_PHONES ?? '')
  .split(',').map((p) => p.trim().replace(/\D/g, '')).filter(Boolean)

function normalizePhone(raw: string): string {
  return raw.replace('@c.us', '').replace(/\D/g, '').trim()
}

function isAllowed(phone: string): boolean {
  if (!ALLOWED_PHONES.length) return false
  return ALLOWED_PHONES.some((p) => phone.endsWith(p) || p.endsWith(phone))
}

export async function POST(req: NextRequest) {
  let phone = ''

  try {
    const body = await req.json()
    const data = body.data ?? body

    // Ignore non-chat, own messages, and group chats
    if (data.type !== 'chat') return NextResponse.json({ status: 'ok' })
    if (data.fromMe) return NextResponse.json({ status: 'ok' })
    if (String(data.from ?? '').includes('@g.us')) return NextResponse.json({ status: 'ok' })

    const fromRaw = String(data.from ?? '')
    phone = normalizePhone(fromRaw)
    const messageText = String(data.body ?? '').trim()
    if (!messageText) return NextResponse.json({ status: 'ok' })

    // Allowlist check
    if (!isAllowed(phone)) {
      console.log('[concierge] blocked phone:', phone)
      return NextResponse.json({ status: 'ok' })
    }

    // Load or create conversation
    const { data: conv } = await supabase
      .from('conversations')
      .select('messages, name')
      .eq('phone', phone)
      .single()

    const history: Message[] = Array.isArray(conv?.messages) ? conv.messages : []

    // Ensure conversation row exists
    if (!conv) {
      await supabase.from('conversations').insert({
        phone,
        messages: [],
        lead_status: 'new',
      })
    }

    // Run concierge agent
    const { reply, updatedHistory } = await runConcierge(history, messageText, phone)

    // Persist updated history
    await supabase
      .from('conversations')
      .update({ messages: updatedHistory, updated_at: new Date().toISOString() })
      .eq('phone', phone)

    // Send reply via WhatsApp
    await sendWhatsApp(fromRaw, reply)

    console.log('[concierge] replied to', phone, '→', reply.slice(0, 60))
  } catch (err) {
    console.error('[concierge error]', phone, err)
    // Don't send error message to user — just log
  }

  // Always 200 to prevent UltraMsg retries
  return NextResponse.json({ status: 'ok' })
}
