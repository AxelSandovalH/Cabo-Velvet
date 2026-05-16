export async function sendWhatsApp(to: string, body: string): Promise<void> {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID!
  const token = process.env.ULTRAMSG_TOKEN!
  const url = `https://api.ultramsg.com/${instanceId}/messages/chat`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token, to, body }).toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`UltraMsg ${res.status}: ${text}`)
  }
}
