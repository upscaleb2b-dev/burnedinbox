import { notFound } from "next/navigation";
import GuideArticle, { guideMetadata } from "@/components/GuideArticle";
import { GUIDES } from "@/lib/guides";

const ERROR_GUIDES = GUIDES.filter(g => g.kind === "error");

export const dynamicParams = false;

export function generateStaticParams() {
  return ERROR_GUIDES.map(g => ({ slug: g.path.slice("/errors/".length) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = ERROR_GUIDES.find(x => x.path === `/errors/${slug}`);
  return g ? guideMetadata(g) : {};
}

export default async function ErrorGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = ERROR_GUIDES.find(x => x.path === `/errors/${slug}`);
  if (!g) notFound();
  return <GuideArticle guide={g} />;
}
