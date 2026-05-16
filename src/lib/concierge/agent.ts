import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompt'
import { tools, executeTool } from './tools'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type Message = { role: 'user' | 'assistant'; content: string }

export type LeadContext = {
  name?: string | null
  group_size?: number | null
  travel_date?: string | null
  budget_range?: string | null
  interests?: string[] | null
}

const MAX_HISTORY = 30
const MAX_ITERATIONS = 8

export async function runConcierge(
  history: Message[],
  userMessage: string,
  phone: string,
  lead: LeadContext = {}
): Promise<{ reply: string; updatedHistory: Message[] }> {
  const trimmedHistory = history.slice(-MAX_HISTORY)

  // Build context block from saved lead data so Claude never re-asks
  const knownFacts: string[] = []
  if (lead.name)        knownFacts.push(`- Nombre: ${lead.name}`)
  if (lead.group_size)  knownFacts.push(`- Grupo: ${lead.group_size} personas`)
  if (lead.travel_date) knownFacts.push(`- Fecha: ${lead.travel_date}`)
  if (lead.budget_range) knownFacts.push(`- Presupuesto: ${lead.budget_range}`)
  if (lead.interests?.length) knownFacts.push(`- Intereses: ${lead.interests.join(', ')}`)

  const contextBlock = knownFacts.length
    ? `\n\n## DATOS YA CAPTURADOS DE ESTE CLIENTE — NO LOS VUELVAS A PREGUNTAR\n${knownFacts.join('\n')}`
    : ''

  const systemText = `${SYSTEM_PROMPT}${contextBlock}\n\nIdentificador del cliente: ${phone}. Usa este valor en save_lead_info.`

  const messages: Anthropic.MessageParam[] = [
    ...trimmedHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  let lastResponse: Anthropic.Message | null = null

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
      tools,
      messages,
    })

    lastResponse = response
    messages.push({ role: 'assistant', content: response.content as Anthropic.MessageParam['content'] })

    if (response.stop_reason === 'end_turn') break

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          const result = await executeTool(block.name, block.input as Record<string, unknown>)
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
        }
      }
      messages.push({ role: 'user', content: toolResults })
    }
  }

  let reply = ''
  if (lastResponse) {
    for (const block of lastResponse.content) {
      if (block.type === 'text') reply += block.text
    }
  }
  if (!reply) reply = ''

  const updatedHistory: Message[] = ([
    ...trimmedHistory,
    { role: 'user' as const, content: userMessage },
    { role: 'assistant' as const, content: reply },
  ] as Message[]).slice(-MAX_HISTORY)

  return { reply, updatedHistory }
}
