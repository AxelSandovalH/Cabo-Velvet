import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { runConcierge, Message, LeadContext } from '@/lib/concierge/agent'

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()

    if (!message?.trim() || !sessionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const identifier = `web_${sessionId}`

    // Load or create conversation
    const { data: conv } = await supabase
      .from('conversations')
      .select('messages, name, group_size, travel_date, budget_range, interests')
      .eq('phone', identifier)
      .single()

    const history: Message[] = Array.isArray(conv?.messages) ? conv.messages : []

    if (!conv) {
      await supabase.from('conversations').insert({
        phone: identifier,
        messages: [],
        lead_status: 'new',
      })
    }

    const lead: LeadContext = {
      name: conv?.name,
      group_size: conv?.group_size,
      travel_date: conv?.travel_date,
      budget_range: conv?.budget_range,
      interests: conv?.interests,
    }

    const { reply, updatedHistory } = await runConcierge(history, message.trim(), identifier, lead)

    await supabase
      .from('conversations')
      .update({ messages: updatedHistory, updated_at: new Date().toISOString() })
      .eq('phone', identifier)

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[chat error]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
