import Anthropic from '@anthropic-ai/sdk'
import { tools, executeTool } from './tools'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Eres el asistente administrativo de Cabo Velvet, un directorio de lujo en Los Cabos, México.

Tu función es ayudar al administrador a gestionar la base de datos a través de WhatsApp. Puedes:
- Buscar, crear y actualizar listings (villas, yates, experiencias, servicios)
- Buscar, crear y actualizar providers (proveedores de servicios)
- Crear y actualizar offerings (ofertas específicas de un proveedor para un listing)

Sistema de precios (listings):
- "agency_price" = lo que el administrador le paga a la agencia (precio de costo, interno)
- "price" = precio publicado al cliente final
- Cuando el administrador dé dos precios, el primero es agency_price y el segundo es price.
- Siempre guarda ambos si se proporcionan.
- Nunca muestres agency_price al cliente; es información interna.

Reglas importantes:
- Responde siempre en español, de forma concisa y directa.
- Antes de crear un registro, confirma los datos clave con el usuario.
- Antes de actualizar un registro, búscalo primero para confirmar que existe.
- Cuando crees o actualices algo, confirma el resultado con un resumen breve.
- Si falta información requerida, pregunta específicamente qué necesitas.
- Para precios, asume USD a menos que el usuario indique otra moneda.
- Los campos "active" son true por defecto al crear.`

export type Message = { role: 'user' | 'assistant'; content: string }

const MAX_HISTORY = 40

export async function runAgent(
  conversationHistory: Message[],
  newUserMessage: string
): Promise<{ reply: string; updatedHistory: Message[] }> {
  const history = conversationHistory.slice(-MAX_HISTORY)

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: newUserMessage },
  ]

  let lastResponse: Anthropic.Message | null = null

  // Agentic loop
  for (let i = 0; i < 10; i++) {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools,
      messages,
    })

    lastResponse = response

    // Collect assistant content blocks
    const assistantContent: Anthropic.ContentBlock[] = response.content
    messages.push({ role: 'assistant', content: assistantContent as Anthropic.MessageParam['content'] })

    if (response.stop_reason === 'end_turn') break

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of assistantContent) {
        if (block.type === 'tool_use') {
          const result = await executeTool(block.name, block.input as Record<string, unknown>)
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: result,
          })
        }
      }

      messages.push({ role: 'user', content: toolResults })
    }
  }

  // Extract final text reply
  let reply = ''
  if (lastResponse) {
    for (const block of lastResponse.content) {
      if (block.type === 'text') {
        reply += block.text
      }
    }
  }
  if (!reply) reply = 'Lo siento, no pude generar una respuesta.'

  // Build updated history (text-only pairs)
  const updatedHistory: Message[] = ([
    ...history,
    { role: 'user' as const, content: newUserMessage },
    { role: 'assistant' as const, content: reply },
  ] as Message[]).slice(-MAX_HISTORY)

  return { reply, updatedHistory }
}
