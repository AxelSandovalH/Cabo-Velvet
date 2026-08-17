-- Booking flow: time slots, deposit split, supplier confirmation, status trail.
-- Safe to re-run.

-- 1. Departure times per listing
create table if not exists listing_time_slots (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  start_time  time not null,
  label       text,                                  -- "Morning", "Sunset"
  capacity    integer,                               -- null → falls back to listings.capacity
  weekdays    smallint[] not null default '{}',      -- empty → every day
  active      boolean not null default true,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  unique (listing_id, start_time)
);

create index if not exists listing_time_slots_listing_idx
  on listing_time_slots (listing_id, sort_order);

-- 2. Booking: slot, contact email, money split, supplier state
alter table bookings
  add column if not exists start_time            time,
  add column if not exists email                 text,
  add column if not exists deposit_amount        integer,   -- cents charged online (our margin)
  add column if not exists balance_due           integer,   -- cents paid to the operator on site
  add column if not exists supplier_status       text not null default 'pending',
  add column if not exists supplier_sent_at      timestamptz,
  add column if not exists supplier_responded_at timestamptz,
  add column if not exists supplier_ref          text,      -- operator's own booking reference
  add column if not exists supplier_note         text,
  add column if not exists confirm_token         uuid not null default gen_random_uuid(),
  add column if not exists customer_emailed_at   timestamptz;

alter table bookings drop constraint if exists bookings_supplier_status_check;
alter table bookings add  constraint bookings_supplier_status_check
  check (supplier_status in ('pending', 'sent', 'confirmed', 'rejected', 'cancelled'));

create unique index if not exists bookings_confirm_token_idx on bookings (confirm_token);
create index if not exists bookings_slot_idx on bookings (listing_id, booking_date, start_time);

-- 3. Status trail — every state change lands here
create table if not exists booking_events (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  type       text not null,       -- payment_received | supplier_notified | supplier_confirmed | ...
  detail     jsonb,
  created_at timestamptz not null default now()
);

create index if not exists booking_events_booking_idx
  on booking_events (booking_id, created_at desc);

-- 4. Lock down the new tables: only the service role touches them
alter table listing_time_slots enable row level security;
alter table booking_events     enable row level security;

drop policy if exists "public reads active slots" on listing_time_slots;
create policy "public reads active slots" on listing_time_slots
  for select using (active = true);
