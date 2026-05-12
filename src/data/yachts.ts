export interface Yacht {
  slug: string;
  name: string;
  tagline: string;
  model: string;
  heroImage: string;
  gallery: string[];
  description: string[];
  specs: { label: string; value: string }[];
  includes: string[];
  price: string;
  duration: string;
  whatsappMsg: string;
}

export const yachts: Yacht[] = [
  {
    slug: "velvet-yachts",
    name: "Velvet Yachts",
    tagline: "Unparalleled Charters",
    model: "120ft Benetti · Superyacht",
    heroImage:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "The flagship of the Cabo Velvet fleet — a 120-foot Benetti superyacht that redefines what a charter in the Sea of Cortez can be. Four cabin suites accommodate up to ten guests in the kind of space usually reserved for private ownership. The main deck salon is climate-controlled, the sundeck has a bar and jacuzzi, and the swim platform launches directly into some of the most biodiverse waters in the world.",
      "Every charter is staffed by a full professional crew: captain, first mate, chef, and two deckhands. Routes are custom-planned around your interests — whether that's diving the seamounts, anchoring in a hidden cove for lunch, arriving at El Arco at sunrise, or cruising slowly past the arch as the sun sets into the Pacific.",
    ],
    specs: [
      { label: "Length", value: "120 ft" },
      { label: "Guests", value: "Up to 10" },
      { label: "Cabins", value: "4 Suites" },
      { label: "Crew", value: "5 Professionals" },
      { label: "Jacuzzi", value: "Sundeck" },
      { label: "Range", value: "Full Baja Coast" },
    ],
    includes: [
      "Full professional crew (5)",
      "Private onboard chef & full galley",
      "Open bar & premium spirits",
      "Snorkel & diving equipment",
      "Tender & jet ski",
      "Bluetooth sound system",
      "Custom route planning",
      "Marina transfer service",
    ],
    price: "From $4,200",
    duration: "Per day · 8-hour minimum",
    whatsappMsg:
      "Hi, I'd like to charter the 120ft Benetti superyacht. Can you share availability and pricing for my dates?",
  },
  {
    slug: "horizon-85",
    name: "Horizon 85",
    tagline: "Sunset · Sea of Cortez",
    model: "85ft Horizon · Motor Yacht",
    heroImage:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "The Horizon 85 is the most versatile vessel in the fleet — equally suited to a private sunset cruise for two as it is to a full-day adventure for eight. Three cabin suites and a full-beam master make it a genuine overnight option, while the expansive flybridge is the best seat in the Sea of Cortez for watching the sun drop below the Pacific.",
      "Day charters on the Horizon 85 are a Cabo Velvet signature experience. The crew knows every anchorage, every fishing spot, every secret cove between the marina and Land's End. Lunch is served on the swim platform. The bar never closes. And the route is always, entirely, yours to decide.",
    ],
    specs: [
      { label: "Length", value: "85 ft" },
      { label: "Guests", value: "Up to 8" },
      { label: "Cabins", value: "3 Suites" },
      { label: "Crew", value: "3 Professionals" },
      { label: "Jet Ski", value: "Included" },
      { label: "Range", value: "Los Cabos Coast" },
    ],
    includes: [
      "Captain & 2 crew members",
      "Chef-prepared lunch & snacks",
      "Open bar & premium beverages",
      "Jet ski (1 hour)",
      "Snorkel equipment",
      "Fishing gear (on request)",
      "Bluetooth & surround sound",
      "Marina pickup & return",
    ],
    price: "From $2,800",
    duration: "Per day · 6-hour minimum",
    whatsappMsg:
      "Hi, I'm interested in chartering the Horizon 85. Can you let me know availability for my dates?",
  },
  {
    slug: "azure-60",
    name: "Azure 60",
    tagline: "Day Charter · Open Bar",
    model: "60ft Azimut · Sport Yacht",
    heroImage:
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "The Azure 60 is the sport yacht of choice for groups who want speed, style, and a boat that turns heads in the marina. Italian-built by Azimut, she combines performance cruising with the onboard comfort of a much larger vessel — a wide beam, a generous cockpit, and a sun deck that seats twelve in the kind of comfort that makes a day on the water feel like a day at a private resort.",
      "Perfect for bachelorette groups, birthday charters, and anyone who wants the Sea of Cortez experience without the formality of a superyacht. The Azure 60 is fun, fast, and completely yours from the moment you step aboard.",
    ],
    specs: [
      { label: "Length", value: "60 ft" },
      { label: "Guests", value: "Up to 12" },
      { label: "Cabins", value: "2 Staterooms" },
      { label: "Crew", value: "2 Professionals" },
      { label: "Speed", value: "32 knots" },
      { label: "Route", value: "Cabo & Beyond" },
    ],
    includes: [
      "Captain & first mate",
      "Full open bar (spirits, wine, beer)",
      "Snacks & fresh fruit spread",
      "Snorkel equipment",
      "Bluetooth sound system",
      "Swimming platform",
      "Towels & sunscreen",
      "Marina transfer",
    ],
    price: "From $1,600",
    duration: "Per day · 5-hour minimum",
    whatsappMsg:
      "Hi, I'd like to book the Azure 60 sport yacht for a day charter. Can you confirm availability?",
  },
  {
    slug: "deep-blue",
    name: "Deep Blue",
    tagline: "Catamaran · Full Day",
    model: "48ft Leopard · Sailing Catamaran",
    heroImage:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "The Deep Blue is Cabo Velvet's sailing catamaran — the widest, most stable platform in the fleet, and the best choice for larger groups who want to feel the wind rather than the engine. At 48 feet with twin hulls, the beam is nearly as wide as many yachts are long. The result is a deck space that genuinely allows fourteen people to spread out and claim their own corner of the boat.",
      "Catamarans are the preferred vessel for snorkeling excursions, sunset sails, and birthday charters where everyone wants to be on deck at the same time. The twin hulls create a shaded hammock net at the bow — the most coveted spot on any catamaran in the Sea of Cortez — while the stern platform is perfect for those who want to be in the water at every opportunity.",
    ],
    specs: [
      { label: "Length", value: "48 ft" },
      { label: "Guests", value: "Up to 14" },
      { label: "Hulls", value: "Twin (Catamaran)" },
      { label: "Crew", value: "2 Professionals" },
      { label: "Net", value: "Bow Hammock" },
      { label: "Route", value: "Snorkel & Sail" },
    ],
    includes: [
      "Captain & first mate",
      "Snorkel equipment for all guests",
      "Full open bar",
      "BBQ lunch on board",
      "Fishing gear (on request)",
      "Hammock bow net",
      "Bluetooth sound system",
      "Marina pickup & return",
    ],
    price: "From $1,200",
    duration: "Per day · Full day only",
    whatsappMsg:
      "Hi, I'd like info on the Deep Blue catamaran for a group charter. Can you confirm availability?",
  },
];

export function getYachtBySlug(slug: string): Yacht | undefined {
  return yachts.find((y) => y.slug === slug);
}
