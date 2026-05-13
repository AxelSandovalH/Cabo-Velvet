export async function sendWhatsAppMessage(to: string, body: string) {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID!
  const token = process.env.ULTRAMSG_TOKEN!
  const url = `https://api.ultramsg.com/${instanceId}/messages/chat`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, to, body }).toString(),
  })

  if (!response.ok) throw new Error(`UltraMsg error: ${response.status}`)
  return response.json()
}
