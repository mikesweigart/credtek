// Provider detail route. Statically generated for every seeded
// provider. The interactive 5-tab view is the AvelProviderDetail
// client component.

import { notFound } from "next/navigation";
import { AvelTopbar } from "../../_components/AvelNav";
import { AvelProviderDetail } from "../../_components/AvelProviderDetail";
import { PROVIDERS, getProvider } from "../../_data/seed";

export function generateStaticParams() {
  return PROVIDERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const p = getProvider(slug);
  return { title: p ? `${p.name}, ${p.credentials}` : "Provider" };
}

export default async function AvelProviderDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const provider = getProvider(slug);
  if (!provider) return notFound();

  return (
    <>
      <AvelTopbar
        title={`${provider.name}, ${provider.credentials}`}
        subtitle={`${provider.specialty} · ${provider.role}`}
      />
      <AvelProviderDetail provider={provider} />
    </>
  );
}
