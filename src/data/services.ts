export interface Service {
  slug: string;
  label: string;
  name: string;
  tagline: string;
  heroImage: string;
  gallery: string[];
  description: string[];
  specs: { label: string; value: string }[];
  includes: string[];
  price: string;
  availability: string;
  whatsappMsg: string;
}

export const services: Service[] = [
  {
    slug: "nightlife",
    label: "VIP Access",
    name: "VIP Nightlife",
    tagline: "Tables. Access. Presence.",
    heroImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Cabo San Lucas has a nightlife culture unlike anywhere else in Mexico — a confluence of world-class DJs, open-air venues, and a clientele that has come to spend. But the experience is entirely different when you arrive as a Cabo Rico guest. No lines. No waiting on the host. No table in the corner. You are expected, and your evening is prepared.",
      "We maintain relationships with every premier venue in the corridor — Taboo, Bagatelle, Omnia, Pink Kitty, and the private members clubs that don't appear on any map. Tell us your group size, your preferred vibe, your budget, and the date. We handle the table, the reservation, the bottle service, and the arrival.",
    ],
    specs: [
      { label: "Venues", value: "All premier clubs" },
      { label: "Service", value: "VIP table & entry" },
      { label: "Bottles", value: "Premium selection" },
      { label: "Arrival", value: "Private transfer" },
      { label: "Contact", value: "Direct host line" },
      { label: "Notice", value: "48hr minimum" },
    ],
    includes: [
      "VIP table reservation (any venue)",
      "Priority entry — no lines",
      "Dedicated bottle service host",
      "Private ground transport to/from",
      "Direct concierge contact all night",
      "Multi-venue routing on request",
    ],
    price: "Custom pricing",
    availability: "Any night, 48hr notice",
    whatsappMsg:
      "Hi, I need VIP nightlife access in Los Cabos. Can you help with a table reservation and entry?",
  },
  {
    slug: "transport",
    label: "24 / 7 Fleet",
    name: "Ground Transport",
    tagline: "Luxury Fleet · Always Ready",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "The Cabo Rico ground fleet is available around the clock — airport transfers, hotel runs, sunset drives down the corridor, and all-day chauffeur service for groups of any size. Every vehicle is late-model, climate-controlled, and driven by a professional who knows Los Cabos intimately and treats discretion as standard.",
      "For large groups arriving together, our Mercedes Sprinter vans accommodate up to 14 passengers with luggage — the same vehicles used for celebrity and executive transport throughout Baja. For couples and small groups, our Escalade and Suburban fleet arrives polished and on time, without exception.",
    ],
    specs: [
      { label: "Fleet", value: "Sprinter, Escalade, Suburban" },
      { label: "Availability", value: "24 hours / 7 days" },
      { label: "Capacity", value: "1–14 passengers" },
      { label: "Chauffeur", value: "Professional & bilingual" },
      { label: "Route", value: "Airport & all Cabo" },
      { label: "Notice", value: "2hr minimum" },
    ],
    includes: [
      "Professional bilingual chauffeur",
      "Late-model luxury vehicles",
      "Complimentary water & refreshments",
      "Flight monitoring (airport pickups)",
      "Child seats on request",
      "Meet & greet at arrivals",
    ],
    price: "From $85 per transfer",
    availability: "24 / 7 · All year",
    whatsappMsg:
      "Hi, I need luxury ground transportation in Los Cabos. Can you help with airport transfers and daily transport?",
  },
  {
    slug: "adventures",
    label: "Baja Desert",
    name: "ATV Adventures",
    tagline: "Off-Road · Baja Wilderness",
    heroImage:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "The Baja peninsula has a landscape that most visitors to Los Cabos never see: ancient desert, volcanic formations, and ridgelines with views that stretch to both coastlines. Our ATV excursions take small private groups into this terrain with an expert guide who grew up in Baja and knows routes that don't appear on any tour operator's map.",
      "Every excursion is fully private — no joining a larger group, no waiting for stragglers, no one else's itinerary to follow. We offer morning runs that begin before the heat and end at a deserted beach, afternoon excursions timed to arrive at a viewpoint for golden hour, and full-day expeditions that include a remote lunch and optional stargazing return.",
    ],
    specs: [
      { label: "Vehicles", value: "Private ATV each" },
      { label: "Group Size", value: "2–10 guests" },
      { label: "Duration", value: "2–8 hours" },
      { label: "Guide", value: "Expert local" },
      { label: "Terrain", value: "Desert & coastal" },
      { label: "Difficulty", value: "All levels" },
    ],
    includes: [
      "Private ATV per guest",
      "Expert local guide",
      "Safety equipment & briefing",
      "Water & snacks throughout",
      "Cooler with beverages",
      "Hotel transfer both ways",
      "GoPro mount on request",
    ],
    price: "From $180 per person",
    availability: "Daily · Morning & afternoon",
    whatsappMsg:
      "Hi, I'm interested in a private ATV adventure in Los Cabos. Can you share available routes and dates?",
  },
  {
    slug: "concierge",
    label: "Fully Bespoke",
    name: "Private Concierge",
    tagline: "Whatever You Need",
    heroImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Every Cabo Rico booking comes with a dedicated concierge. But this service goes further. For guests who want every detail of their stay arranged before they arrive — restaurant reservations, in-villa spa treatments, surprise proposal setups, baby shower florals, custom excursion itineraries, musician bookings, and anything else that can be imagined — our bespoke concierge team is the answer.",
      "We have spent years building relationships with the best chefs, the most talented florists, the most discreet security services, and the most capable private event producers in Los Cabos. If it can be done in Baja, we can arrange it. If it has never been done before in Baja, we will figure out how.",
    ],
    specs: [
      { label: "Service", value: "Fully bespoke" },
      { label: "Response", value: "Under 1 hour" },
      { label: "Scope", value: "Unlimited" },
      { label: "Languages", value: "English & Spanish" },
      { label: "Access", value: "24 / 7 via WhatsApp" },
      { label: "Notice", value: "24hr preferred" },
    ],
    includes: [
      "Dedicated personal concierge",
      "Restaurant reservations (any venue)",
      "In-villa spa & wellness services",
      "Event design & production",
      "Surprise & proposal planning",
      "Local expert referral network",
      "Pre-arrival setup & coordination",
      "24/7 WhatsApp support during stay",
    ],
    price: "Complimentary with villa booking",
    availability: "Available to all guests",
    whatsappMsg:
      "Hi, I'd like to discuss bespoke concierge services for my trip to Los Cabos. Can we chat about what you can arrange?",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
