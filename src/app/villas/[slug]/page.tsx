import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { villas, getVillaBySlug } from "@/data/villas";
import LuxuryDetailLayout from "@/components/LuxuryDetailLayout";

export function generateStaticParams() {
  return villas.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const villa = getVillaBySlug(slug);
  if (!villa) return { title: "Not Found" };
  return {
    title: `${villa.name} — Cabo Velvet`,
    description: villa.description[0].slice(0, 155),
  };
}

export default async function VillaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const villa = getVillaBySlug(slug);
  if (!villa) notFound();

  return (
    <LuxuryDetailLayout
      category="Villas"
      categoryHref="/#villas"
      name={villa.name}
      tagline={villa.tagline}
      location={villa.location}
      heroImage={villa.heroImage}
      gallery={villa.gallery}
      description={villa.description}
      specs={villa.specs}
      includes={villa.includes}
      price={villa.price}
      durationOrStay={villa.minimumStay}
      whatsappMsg={villa.whatsappMsg}
    />
  );
}
