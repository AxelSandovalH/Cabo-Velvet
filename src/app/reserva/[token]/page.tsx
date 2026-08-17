import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatUSD } from '@/lib/pricing'
import { formatTime } from '@/lib/slots'
import SupplierResponse from './SupplierResponse'

export const dynamic = 'force-dynamic'

export default async function SupplierConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, listing_id, booking_date, start_time, people_count, balance_due, name, phone, short_id, supplier_status, supplier_ref, supplier_note')
    .eq('confirm_token', token)
    .maybeSingle()

  if (!booking) notFound()

  const { data: listing } = await supabase
    .from('listings')
    .select('name, location')
    .eq('id', booking.listing_id)
    .single()

  const fecha = booking.booking_date
    ? new Date(booking.booking_date + 'T12:00:00').toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Por definir'

  const rows: [string, string][] = [
    ['Actividad', listing?.name ?? '—'],
    ['Fecha', fecha],
    ...(booking.start_time ? ([['Horario', formatTime(booking.start_time)]] as [string, string][]) : []),
    ['Personas', String(booking.people_count ?? 1)],
    ['Cliente', `${booking.name ?? 'Sin nombre'}${booking.phone ? ` · ${booking.phone}` : ''}`],
    ['Cobrar en sitio', formatUSD(booking.balance_due ?? 0)],
    ['Referencia', booking.short_id ?? booking.id.slice(0, 8).toUpperCase()],
  ]

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F2EDE4] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p style={{ fontFamily: 'var(--font-cormorant)' }} className="text-2xl tracking-[0.3em]">
            CABO RICO
          </p>
          <p className="text-[10px] tracking-[0.35em] text-[#C4A45A] mt-2">LOS CABOS</p>
        </div>

        <div className="border border-[#C4A45A]/25 rounded-2xl bg-[#100E0A] p-7">
          <h1
            style={{ fontFamily: 'var(--font-cormorant)' }}
            className="text-xl font-light mb-6"
          >
            Reserva por confirmar
          </h1>

          <dl className="border-t border-white/[0.08]">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5 border-b border-white/[0.06]">
                <dt className="text-[10px] tracking-[0.18em] uppercase text-[#6B6458] pt-1">{label}</dt>
                <dd className="text-sm text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <SupplierResponse
            token={token}
            initialStatus={booking.supplier_status}
            initialNote={booking.supplier_note}
            initialRef={booking.supplier_ref}
          />
        </div>

        <p className="text-center text-[11px] text-[#4A4038] mt-6">
          El cliente ya pagó su depósito. Confirma solo si tienes el cupo disponible.
        </p>
      </div>
    </main>
  )
}
