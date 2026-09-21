import Link from "next/link";
import { notFound } from "next/navigation";
import { backendJson, type PublicArticle } from "@/lib/backend";
import { formatDate } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) notFound();

  let row: PublicArticle | undefined;
  try {
    const data = await backendJson<{ article?: PublicArticle }>(`/v1/articles/${num}`);
    row = data.article;
  } catch {
    notFound();
  }
  if (!row) notFound();

  return (
    <main>
      <p className="meta">
        <Link href="/">← Rose</Link>
      </p>
      <h1>{row.title}</h1>
      <p className="meta">
        {row.source}
        {row.published_at || row.scraped_at
          ? ` · ${formatDate(row.published_at || row.scraped_at)}`
          : ""}
      </p>
      <p className="excerpt">{row.excerpt}</p>
      <p>
        <a href={row.url} rel="noopener noreferrer">
          Read on {row.source} ↗
        </a>
      </p>
    </main>
  );
}
