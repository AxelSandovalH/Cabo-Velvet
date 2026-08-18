import { formatUSD } from '@/lib/pricing'
import { formatTime } from '@/lib/slots'

const GOLD = '#C4A45A'
const DARK = '#0A0806'
const CREAM = '#F2EDE4'

export type BookingEmailData = {
  reference: string
  listingName: string
  location: string | null
  date: string | null          // YYYY-MM-DD
  startTime: string | null     // HH:MM:SS
  people: number
  totalCents: number
  depositCents: number
  balanceDueCents: number
  guestName: string | null
  guestPhone: string | null
  guestEmail: string | null
  priceNotes?: string | null
  supplierNote?: string | null
}

function longDate(date: string | null, locale: string): string {
  if (!date) return locale === 'es' ? 'Por definir' : 'To be confirmed'
  return new Date(date + 'T12:00:00').toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function shell(title: string, body: string, footer: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${DARK};font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${DARK};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#100E0A;border:1px solid rgba(196,164,90,0.25);border-radius:14px;overflow:hidden;">
        <tr><td style="padding:32px 32px 20px;text-align:center;border-bottom:1px solid rgba(196,164,90,0.2);">
          <div style="font-family:Georgia,serif;font-size:26px;letter-spacing:6px;color:${CREAM};">CABO RICO</div>
          <div style="font-size:10px;letter-spacing:4px;color:${GOLD};margin-top:8px;">LOS CABOS</div>
        </td></tr>
        <tr><td style="padding:32px;color:${CREAM};font-size:15px;line-height:1.65;">
          <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;color:${CREAM};margin:0 0 20px;">${title}</h1>
          ${body}
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);color:#6B6458;font-size:12px;line-height:1.6;">
          ${footer}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function detailRows(d: BookingEmailData, locale: 'es' | 'en'): string {
  const t = locale === 'es'
    ? { act: 'Actividad', date: 'Fecha', time: 'Horario', pax: 'Personas', ref: 'Referencia', loc: 'Ubicación' }
    : { act: 'Activity', date: 'Date', time: 'Time', pax: 'Guests', ref: 'Reference', loc: 'Location' }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#6B6458;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">${label}</td>
      <td style="padding:8px 0;color:${CREAM};font-size:14px;text-align:right;">${value}</td>
    </tr>`

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="margin:20px 0;border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);">
    ${row(t.act, d.listingName)}
    ${row(t.date, longDate(d.date, locale))}
    ${d.startTime ? row(t.time, formatTime(d.startTime)) : ''}
    ${row(t.pax, String(d.people))}
    ${d.location ? row(t.loc, d.location) : ''}
    ${row(t.ref, `<code style="color:${GOLD};">${d.reference}</code>`)}
  </table>`
}

function moneyBlock(d: BookingEmailData, locale: 'es' | 'en'): string {
  const t = locale === 'es'
    ? { paid: 'Pagado hoy (depósito)', due: 'Saldo a pagar en el lugar', total: 'Total' }
    : { paid: 'Paid today (deposit)', due: 'Balance due on site', total: 'Total' }

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
    <tr>
      <td style="padding:6px 0;color:#6B6458;font-size:13px;">${t.paid}</td>
      <td style="padding:6px 0;color:${GOLD};font-size:15px;text-align:right;font-weight:bold;">${formatUSD(d.depositCents)}</td>
    </tr>
    <tr>
      <td style="padding:6px 0;color:#6B6458;font-size:13px;">${t.due}</td>
      <td style="padding:6px 0;color:${CREAM};font-size:15px;text-align:right;">${formatUSD(d.balanceDueCents)}</td>
    </tr>
    <tr>
      <td style="padding:10px 0 0;border-top:1px solid rgba(255,255,255,0.08);color:${CREAM};font-size:13px;">${t.total}</td>
      <td style="padding:10px 0 0;border-top:1px solid rgba(255,255,255,0.08);color:${CREAM};font-size:15px;text-align:right;">${formatUSD(d.totalCents)}</td>
    </tr>
  </table>`
}

/** 1. Client — deposit received, we are confirming with the operator. */
export function customerDepositEmail(d: BookingEmailData) {
  return {
    subject: `We received your deposit — ${d.listingName}`,
    html: shell(
      `Thank you${d.guestName ? `, ${d.guestName}` : ''}.`,
      `<p style="margin:0 0 4px;">Your deposit is in and we are confirming your spot with the operator.
       You will get a second email with the final confirmation, usually within a few hours.</p>
       ${detailRows(d, 'en')}
       ${moneyBlock(d, 'en')}
       <p style="margin:0;color:#6B6458;font-size:13px;">The balance is paid directly to the operator on the day of your activity.</p>
       ${d.priceNotes ? `<p style="margin:12px 0 0;color:#6B6458;font-size:13px;">${d.priceNotes}.</p>` : ''}`,
      `Questions? Just reply to this email.<br/>Cabo Rico · Los Cabos, BCS, México`
    ),
  }
}

/** 2. Client — the operator confirmed. */
export function customerConfirmedEmail(d: BookingEmailData) {
  return {
    subject: `Confirmed — ${d.listingName}`,
    html: shell(
      'Your reservation is confirmed.',
      `<p style="margin:0 0 4px;">The operator has your spot reserved${d.guestName ? `, ${d.guestName}` : ''}. Everything below is set.</p>
       ${detailRows(d, 'en')}
       ${moneyBlock(d, 'en')}
       ${d.supplierNote ? `<p style="margin:0 0 16px;padding:14px;background:rgba(196,164,90,0.08);border-left:2px solid ${GOLD};font-size:13px;">${d.supplierNote}</p>` : ''}
       <p style="margin:0;color:#6B6458;font-size:13px;">Please arrive 15 minutes early and bring the balance shown above.</p>
       ${d.priceNotes ? `<p style="margin:12px 0 0;color:#6B6458;font-size:13px;">${d.priceNotes}.</p>` : ''}`,
      `Need to change something? Reply to this email.<br/>Cabo Rico · Los Cabos, BCS, México`
    ),
  }
}

/** 3. Operator — new booking with confirm / reject links. */
export function supplierRequestEmail(d: BookingEmailData, confirmUrl: string) {
  return {
    subject: `Nueva reserva — ${d.listingName} · ${longDate(d.date, 'es')}`,
    html: shell(
      'Nueva reserva por confirmar',
      `<p style="margin:0 0 4px;">Recibimos un pago de reservación. Confirma disponibilidad para:</p>
       ${detailRows(d, 'es')}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
         <tr>
           <td style="padding:6px 0;color:#6B6458;font-size:13px;">Cobrar al cliente en sitio</td>
           <td style="padding:6px 0;color:${GOLD};font-size:16px;text-align:right;font-weight:bold;">${formatUSD(d.balanceDueCents)}</td>
         </tr>
       </table>
       <p style="margin:0 0 6px;font-size:13px;color:#6B6458;">Cliente:</p>
       <p style="margin:0 0 24px;font-size:14px;">${d.guestName ?? 'Sin nombre'}${d.guestPhone ? ` · ${d.guestPhone}` : ''}</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
         <tr><td align="center">
           <a href="${confirmUrl}" style="display:inline-block;padding:14px 34px;background:${GOLD};color:${DARK};
              font-size:12px;letter-spacing:2.5px;text-transform:uppercase;font-weight:bold;text-decoration:none;border-radius:4px;">
             Responder reserva
           </a>
         </td></tr>
       </table>
       <p style="margin:18px 0 0;text-align:center;font-size:11px;color:#6B6458;">
         El botón abre una página para confirmar o rechazar. No requiere cuenta.
       </p>`,
      `Cabo Rico · Si algo no cuadra, responde este correo.`
    ),
  }
}

/** 4. Us — the operator said no. Needs a human. */
export function adminRejectedEmail(d: BookingEmailData) {
  return {
    subject: `⚠️ Operador rechazó una reserva pagada — ${d.listingName}`,
    html: shell(
      'Reserva rechazada por el operador',
      `<p style="margin:0 0 4px;">El cliente ya pagó el depósito y el operador no puede tomarla. Hay que reubicar o reembolsar.</p>
       ${detailRows(d, 'es')}
       ${d.supplierNote ? `<p style="margin:0 0 16px;padding:14px;background:rgba(255,80,80,0.08);border-left:2px solid #E06C6C;font-size:13px;">Motivo: ${d.supplierNote}</p>` : ''}
       <p style="margin:0;font-size:13px;">Contacto del cliente: ${d.guestName ?? 'Sin nombre'}${d.guestPhone ? ` · ${d.guestPhone}` : ''}${d.guestEmail ? ` · ${d.guestEmail}` : ''}</p>
       <p style="margin:12px 0 0;font-size:13px;">Depósito cobrado: <strong style="color:${GOLD};">${formatUSD(d.depositCents)}</strong></p>`,
      `Cabo Rico · Alerta automática`
    ),
  }
}
