export interface Experience {
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
  duration: string;
  whatsappMsg: string;
}

export const experiences: Experience[] = [
  {
    slug: "sunset-sailing",
    label: "Signature",
    name: "Sunset Sailing",
    tagline: "El Arco · Sea of Cortez",
    heroImage:
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "A private vessel departs the marina two hours before sunset and makes its way to Land's End — the dramatic meeting point of the Pacific Ocean and the Sea of Cortez where El Arco rises from the water. From the deck, you watch Cabo San Lucas transform from a busy port into a glittering coastal city as the light changes from gold to amber to deep rose.",
      "Champagne is poured. A curated playlist sets the mood. Your captain knows exactly where to anchor for the most private view of the arch and the most dramatic angle as the sun drops below the Pacific. This is the experience guests return to Cabo to repeat — and the one they talk about long after they're home.",
    ],
    specs: [
      { label: "Departure", value: "2 hrs before sunset" },
      { label: "Duration", value: "3 hours" },
      { label: "Guests", value: "2–12" },
      { label: "Vessel", value: "Private yacht" },
      { label: "Route", value: "Marina → El Arco" },
      { label: "Season", value: "Year-round" },
    ],
    includes: [
      "Private yacht with captain",
      "Champagne & premium beverages",
      "Artisan canapés & fresh fruit",
      "Curated sunset playlist",
      "Photography guidance",
      "Marina transfer",
    ],
    price: "From $650",
    duration: "3-hour experience",
    whatsappMsg:
      "Hi, I'd like to book the Sunset Sailing experience. Can you share dates and group size options?",
  },
  {
    slug: "beachside-dining",
    label: "Exclusive",
    name: "Beachside Dining",
    tagline: "Private Beach · Sunset Hour",
    heroImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "Our team arrives at the beach three hours before you do. By the time you walk across the sand, a table has been hand-set with linen, candles, and florals. A private chef is already working at a mobile kitchen hidden from view, preparing a four-course dinner designed entirely around your preferences and dietary needs.",
      "The Sea of Cortez at dusk is the backdrop. A sommelier pairs each course with wines selected for the specific light and temperature of the evening. When dinner ends, the table remains for as long as you want it — there is no rush, no neighboring table, no check to request. This is dinner in Los Cabos as it should always have been.",
    ],
    specs: [
      { label: "Setting", value: "Private beach" },
      { label: "Duration", value: "3–4 hours" },
      { label: "Guests", value: "2–8" },
      { label: "Courses", value: "4-course tasting menu" },
      { label: "Sommelier", value: "Included" },
      { label: "Setup", value: "Full tablescape" },
    ],
    includes: [
      "Private chef & sommelier",
      "4-course custom tasting menu",
      "Wine & cocktail pairing",
      "Full tablescape & florals",
      "Candlelit ambient lighting",
      "Discrete service team",
      "Transportation to/from",
    ],
    price: "From $450 per person",
    duration: "3–4 hour experience",
    whatsappMsg:
      "Hi, I'd like to book the private Beachside Dining experience. Can you share menu options and availability?",
  },
  {
    slug: "desert-and-stars",
    label: "Adventure",
    name: "Desert & Stars",
    tagline: "Baja Wilderness · Dusk",
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=90&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543158266-0066955a5f89?w=1200&q=85&auto=format&fit=crop",
    ],
    description: [
      "As the sun descends, a convoy of private ATVs departs into the Baja desert — past cardon cacti that are older than the colonial era, through washes and ridgelines that most visitors to Los Cabos never see. The route leads to a plateau with an unobstructed view of the sky in all directions, positioned well clear of city light pollution.",
      "When the group arrives, the dinner is already there. A chef has made the journey by 4x4 earlier in the day, setting a table under the open sky and preparing a meal over fire. By the time the stars appear — and in Baja, they appear in their millions — your group is seated, the mezcal is poured, and the Milky Way is visible overhead. There is no experience in Los Cabos quite like it.",
    ],
    specs: [
      { label: "Departure", value: "3 hrs before sunset" },
      { label: "Duration", value: "4–5 hours" },
      { label: "Guests", value: "2–10" },
      { label: "Transport", value: "Private ATVs" },
      { label: "Dinner", value: "Fire-cooked" },
      { label: "Setting", value: "Baja desert plateau" },
    ],
    includes: [
      "Private ATV for each guest",
      "Professional guide",
      "3-course fire-cooked dinner",
      "Mezcal & cocktail service",
      "Safety equipment & briefing",
      "Stargazing guide",
      "Hotel transfer both ways",
    ],
    price: "From $350 per person",
    duration: "4–5 hour experience",
    whatsappMsg:
      "Hi, I'd like to book the Desert & Stars experience. Can you share the next available dates?",
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}
