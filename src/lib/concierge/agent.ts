import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompt'
import { tools, executeTool } from './tools'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type Message = { role: 'user' | 'assistant'; content: string }

const MAX_HISTORY = 30
const MAX_ITERATIONS = 8

export async function runConcierge(
  history: Message[],
  userMessage: string,
  phone: string
): Promise<{ reply: string; updatedHistory: Message[] }> {
  const trimmedHistory = history.slice(-MAX_HISTORY)

  const messages: Anthropic.MessageParam[] = [
    ...trimmedHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  let lastResponse: Anthropic.Message | null = null

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: `${SYSTEM_PROMPT}\n\nEl número de WhatsApp del cliente actual es: ${phone}. Usa este phone en save_lead_info.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
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

  // Extract text reply
  let reply = ''
  if (lastResponse) {
    for (const block of lastResponse.content) {
      if (block.type === 'text') reply += block.text
    }
  }
  if (!reply) reply = 'Un momento, estoy revisando las opciones para ti. 🙏'

  const updatedHistory: Message[] = [
    ...trimmedHistory,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: reply },
  ].slice(-MAX_HISTORY)

  return { reply, updatedHistory }
}
