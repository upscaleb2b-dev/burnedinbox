import { notFound } from "next/navigation";
import GuideArticle, { guideMetadata } from "@/components/GuideArticle";
import { GUIDES } from "@/lib/guides";

const ROOT_GUIDES = GUIDES.filter(g => g.kind !== "error" && !g.path.startsWith("/blog/"));

export const dynamicParams = false;

export function generateStaticParams() {
  return ROOT_GUIDES.map(g => ({ guide: g.path.slice(1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ guide: string }> }) {
  const { guide } = await params;
  const g = ROOT_GUIDES.find(x => x.path === `/${guide}`);
  return g ? guideMetadata(g) : {};
}

export default async function GuidePage({ params }: { params: Promise<{ guide: string }> }) {
  const { guide } = await params;
  const g = ROOT_GUIDES.find(x => x.path === `/${guide}`);
  if (!g) notFound();
  return <GuideArticle guide={g} />;
}
