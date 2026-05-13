import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendWhatsAppMessage } from '@/lib/ultramsg'
import { runAgent, Message } from '@/lib/agent/runner'

function normalizePhone(raw: string): string {
  return raw.replace('@c.us', '').trim()
}

function isAdminPhone(phone: string): boolean {
  const admins = (process.env.ADMIN_PHONES ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return admins.includes(phone)
}

export async function POST(req: NextRequest) {
  let fromRaw = ''

  try {
    const body = await req.json()
    const data = body.data ?? body

    // Ignore non-chat messages, own messages, and group chats
    if (data.type !== 'chat') return NextResponse.json({ status: 'ok' })
    if (data.fromMe) return NextResponse.json({ status: 'ok' })
    if (String(data.from ?? '').includes('@g.us')) return NextResponse.json({ status: 'ok' })

    fromRaw = String(data.from ?? '')
    const phone = normalizePhone(fromRaw)
    const messageText = String(data.body ?? '').trim()

    if (!messageText) return NextResponse.json({ status: 'ok' })

    // Auth check
    if (!isAdminPhone(phone)) {
      await sendWhatsAppMessage(fromRaw, 'No tienes permiso para usar este asistente.')
      return NextResponse.json({ status: 'ok' })
    }

    // Load conversation history
    const { data: conv } = await supabase
      .from('conversations')
      .select('messages')
      .eq('phone', phone)
      .single()

    const history: Message[] = Array.isArray(conv?.messages) ? conv.messages : []

    // Run agent
    const { reply, updatedHistory } = await runAgent(history, messageText)

    // Persist conversation
    await supabase.from('conversations').upsert(
      { phone, messages: updatedHistory, updated_at: new Date().toISOString() },
      { onConflict: 'phone' }
    )

    // Send reply
    await sendWhatsAppMessage(fromRaw, reply)
  } catch (err) {
    console.error('[whatsapp webhook error]', err)
    // Attempt to send error notice if we have the sender
    if (fromRaw) {
      try {
        await sendWhatsAppMessage(fromRaw, 'Ocurrió un error. Por favor intenta de nuevo.')
      } catch {
        // ignore secondary failure
      }
    }
  }

  // Always return 200 to prevent UltraMsg retries
  return NextResponse.json({ status: 'ok' })
}
