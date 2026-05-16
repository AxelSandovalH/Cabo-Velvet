import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runConcierge, Message, LeadContext } from '@/lib/concierge/agent'

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
  try {
    const { message, sessionId } = await req.json()
    if (!message?.trim() || !sessionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const identifier = `web_${sessionId}`

    // Save user message immediately (atomic INSERT)
    await saveMessage(identifier, 'user', message.trim())

    // Load lead context
    const { data: conv } = await supabase
      .from('conversations')
      .select('name, group_size, travel_date, budget_range, interests')
      .eq('phone', identifier)
      .maybeSingle()

    if (!conv) {
      await supabase.from('conversations').upsert(
        { phone: identifier, messages: [], lead_status: 'new', updated_at: new Date().toISOString() },
        { onConflict: 'phone' }
      )
    }

    // Load full history (includes message just saved)
    const history = await loadHistory(identifier)
    const historyWithoutLast = history.slice(0, -1)

    const lead: LeadContext = {
      name: conv?.name,
      group_size: conv?.group_size,
      travel_date: conv?.travel_date,
      budget_range: conv?.budget_range,
      interests: conv?.interests,
    }

    const { reply } = await runConcierge(historyWithoutLast, message.trim(), identifier, lead)

    // Save assistant reply (atomic INSERT)
    await saveMessage(identifier, 'assistant', reply)

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('phone', identifier)

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[chat error]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
