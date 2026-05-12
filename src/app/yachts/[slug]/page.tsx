import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { yachts, getYachtBySlug } from "@/data/yachts";
import LuxuryDetailLayout from "@/components/LuxuryDetailLayout";

export function generateStaticParams() {
  return yachts.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yacht = getYachtBySlug(slug);
  if (!yacht) return { title: "Not Found" };
  return {
    title: `${yacht.name} — Cabo Velvet`,
    description: yacht.description[0].slice(0, 155),
  };
}

export default async function YachtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yacht = getYachtBySlug(slug);
  if (!yacht) notFound();

  return (
    <LuxuryDetailLayout
      category="Yachts"
      categoryHref="/#yachts"
      model={yacht.model}
      name={yacht.name}
      tagline={yacht.tagline}
      heroImage={yacht.heroImage}
      gallery={yacht.gallery}
      description={yacht.description}
      specs={yacht.specs}
      includes={yacht.includes}
      price={yacht.price}
      durationOrStay={yacht.duration}
      whatsappMsg={yacht.whatsappMsg}
    />
  );
}
