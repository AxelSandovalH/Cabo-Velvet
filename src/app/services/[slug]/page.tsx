import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getServiceBySlug } from "@/data/services";
import LuxuryDetailLayout from "@/components/LuxuryDetailLayout";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) return { title: "Not Found" };
  return {
    title: `${svc.name} — Cabo Velvet`,
    description: svc.description[0].slice(0, 155),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) notFound();

  return (
    <LuxuryDetailLayout
      category="Services"
      categoryHref="/#services"
      label={svc.label}
      name={svc.name}
      tagline={svc.tagline}
      heroImage={svc.heroImage}
      gallery={svc.gallery}
      description={svc.description}
      specs={svc.specs}
      includes={svc.includes}
      price={svc.price}
      durationOrStay={svc.availability}
      whatsappMsg={svc.whatsappMsg}
    />
  );
}
