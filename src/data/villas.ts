export interface Villa {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  heroImage: string;
  gallery: string[];
  description: string[];
  specs: { label: string; value: string }[];
  includes: string[];
  price: string;
  minimumStay: string;
  whatsappMsg: string;
}

export const villas: Villa[] = [
  {
    slug: "villa-solano",
    name: "Villa Solano",
    tagline: "Ultra-Private Oceanfront",
    location: "El Pedregal · Cabo San Lucas",
    heroImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Perched above the Pacific on the exclusive cliffs of El Pedregal, Villa Solano offers an experience so removed from the ordinary that guests rarely want to leave. Every room frames a different view of the ocean — from the master suite's floor-to-ceiling glass to the infinity pool that appears to dissolve into the horizon.",
      "Our dedicated concierge team curates every detail before you arrive: the champagne chilled to your preference, the playlist set for your first evening, the private chef's menu tailored to your group. Villa Solano is not a rental. It is a private residence that happens to be available to those who know where to look.",
    ],
    specs: [
      { label: "Bedrooms", value: "5 Suites" },
      { label: "Guests", value: "Up to 10" },
      { label: "Pool", value: "Infinity Edge" },
      { label: "View", value: "Pacific Ocean" },
      { label: "Style", value: "Contemporary" },
      { label: "Area", value: "8,200 sq ft" },
    ],
    includes: [
      "Private chef (breakfast & dinner daily)",
      "Full housekeeping twice daily",
      "Infinity pool & jacuzzi",
      "Airport transfers (both ways)",
      "Dedicated Cabo Velvet concierge",
      "Welcome champagne & curated pantry",
      "Luxury linens & bath amenities",
      "All utilities & WiFi",
    ],
    price: "From $5,500",
    minimumStay: "3-night minimum",
    whatsappMsg:
      "Hi, I'd like to book Villa Solano — the ultra-private oceanfront estate in El Pedregal. Can you share availability and details?",
  },
  {
    slug: "villa-obsidian",
    name: "Villa Obsidian",
    tagline: "Cliffside Panorama",
    location: "Pedregal Cliffs · Cabo San Lucas",
    heroImage:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Villa Obsidian sits at the highest point of the Pedregal cliffs, commanding a 270-degree panorama that takes in El Arco, the Pacific, and the lights of Cabo San Lucas below. The architecture is deliberately dramatic — dark volcanic stone, double-height living spaces, and a rooftop terrace that becomes the most sought-after vantage point in all of Baja.",
      "The estate accommodates seven bedroom suites across two wings, making it the ideal canvas for milestone celebrations, executive retreats, and extended family gatherings where everyone deserves their own sanctuary. Our team has pre-arranged everything from the wine cellar selection to the private cinema schedule before you land.",
    ],
    specs: [
      { label: "Bedrooms", value: "7 Suites" },
      { label: "Guests", value: "Up to 14" },
      { label: "Pool", value: "Two Infinity Pools" },
      { label: "View", value: "360° Panorama" },
      { label: "Style", value: "Contemporary Dark" },
      { label: "Area", value: "12,400 sq ft" },
    ],
    includes: [
      "Private chef team (all meals)",
      "Full-service bar & sommelier",
      "Two infinity pools + jacuzzi",
      "Home theater & game room",
      "Airport transfers via Sprinter",
      "Dedicated concierge on-site",
      "Private gym & wellness space",
      "All utilities, WiFi & streaming",
    ],
    price: "From $8,200",
    minimumStay: "4-night minimum",
    whatsappMsg:
      "Hi, I'm interested in Villa Obsidian — the 7-bedroom cliffside panorama estate. Can you send availability and pricing?",
  },
  {
    slug: "casa-petra",
    name: "Casa Petra",
    tagline: "Private Beach Access",
    location: "Cabo San Lucas · Beachfront",
    heroImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Casa Petra steps directly onto a private stretch of Medano Beach — the only truly swimmable beach in Cabo San Lucas. Four master suites open onto terraces that overlook the water, while the main living pavilion dissolves the boundary between inside and out through walls of retractable glass.",
      "For those who want the ocean within arm's reach at all hours, Casa Petra is without equal. Kayaks and paddleboards launch from your own sand. Sunsets are watched from a private palapa bar. The city's best restaurants and nightlife are five minutes away — but most guests find they rarely want to leave.",
    ],
    specs: [
      { label: "Bedrooms", value: "4 Suites" },
      { label: "Guests", value: "Up to 8" },
      { label: "Pool", value: "Oceanfront Plunge" },
      { label: "Beach", value: "Private 40m Strip" },
      { label: "Style", value: "Baja Modern" },
      { label: "Area", value: "5,800 sq ft" },
    ],
    includes: [
      "Private chef (breakfast daily)",
      "Beach butler & palapa service",
      "Kayaks, paddleboards & snorkel gear",
      "Airport transfers",
      "Cabo Velvet concierge",
      "Welcome provisions & beach bar setup",
      "Housekeeping daily",
      "All utilities & high-speed WiFi",
    ],
    price: "From $3,800",
    minimumStay: "3-night minimum",
    whatsappMsg:
      "Hi, I'd like to book Casa Petra — the beachfront villa with private beach access. Can you share availability?",
  },
  {
    slug: "villa-aurora",
    name: "Villa Aurora",
    tagline: "Three Pools · Sunset Views",
    location: "Hillside Reserve · San José del Cabo",
    heroImage:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Villa Aurora rises from a private hillside reserve between Cabo San Lucas and San José del Cabo, commanding an unobstructed sunset panorama over the Pacific. Three distinct infinity pools cascade across the terraced grounds — the upper pool is heated, the lower pool flows into a shallow beach entry, and the third is reserved for the master suite.",
      "With six bedrooms across a single-level footprint that sprawls across nearly an acre, Aurora offers a sense of space that is genuinely rare. There is a wine cellar with a curated collection, a screening room, a chef's kitchen, and an outdoor dining terrace designed for the kind of evenings that become stories told for years.",
    ],
    specs: [
      { label: "Bedrooms", value: "6 Suites" },
      { label: "Guests", value: "Up to 12" },
      { label: "Pools", value: "Three Infinity" },
      { label: "View", value: "Pacific Sunset" },
      { label: "Style", value: "Hacienda Modern" },
      { label: "Area", value: "10,000 sq ft" },
    ],
    includes: [
      "Private chef (all meals on request)",
      "Three infinity pools & jacuzzi",
      "Wine cellar access & sommelier",
      "Private screening room",
      "Airport transfers via luxury vehicle",
      "Full concierge team on call",
      "Daily housekeeping & turndown",
      "All utilities, WiFi & premium streaming",
    ],
    price: "From $6,900",
    minimumStay: "4-night minimum",
    whatsappMsg:
      "Hi, I'd like to inquire about Villa Aurora — the 6-bedroom hillside estate with three pools. What are the available dates?",
  },
];

export function getVillaBySlug(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug);
}
