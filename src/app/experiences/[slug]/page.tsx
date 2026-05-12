import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experiences, getExperienceBySlug } from "@/data/experiences";
import LuxuryDetailLayout from "@/components/LuxuryDetailLayout";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return { title: "Not Found" };
  return {
    title: `${exp.name} — Cabo Velvet`,
    description: exp.description[0].slice(0, 155),
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) notFound();

  return (
    <LuxuryDetailLayout
      category="Experiences"
      categoryHref="/#experiences"
      label={exp.label}
      name={exp.name}
      tagline={exp.tagline}
      location={exp.tagline}
      heroImage={exp.heroImage}
      gallery={exp.gallery}
      description={exp.description}
      specs={exp.specs}
      includes={exp.includes}
      price={exp.price}
      durationOrStay={exp.duration}
      whatsappMsg={exp.whatsappMsg}
    />
  );
}
