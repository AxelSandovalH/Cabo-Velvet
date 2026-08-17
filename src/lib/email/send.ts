/**
 * Resend over plain fetch — no extra dependency.
 * Never throws: a failed email must not roll back a paid booking.
 */

type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export type SendResult = { ok: boolean; id?: string; error?: string }

const FROM = process.env.EMAIL_FROM ?? 'Cabo Rico <reservas@caboricotours.com>'

// The sending domain has no inbox of its own, so replies are routed to a
// mailbox that is actually read. Falls back to the From address.
const REPLY_TO = process.env.EMAIL_REPLY_TO?.trim()

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY not set — skipping:', subject)
    return { ok: false, error: 'missing_api_key' }
  }

  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean)
  if (!recipients.length) return { ok: false, error: 'no_recipient' }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: recipients,
        subject,
        html,
        ...((replyTo ?? REPLY_TO) ? { reply_to: replyTo ?? REPLY_TO } : {}),
      }),
    })

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[email] Resend', res.status, body)
      return { ok: false, error: body?.message ?? `HTTP ${res.status}` }
    }
    return { ok: true, id: body?.id }
  } catch (err) {
    console.error('[email] network error', err)
    return { ok: false, error: String(err) }
  }
}
