import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { articles, newsSources } from "@/lib/schema";
import { excerpt, formatDate } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) notFound();

  const rows = await getDb()
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      publishedAt: articles.publishedAt,
      scrapedAt: articles.scrapedAt,
      bodyText: articles.bodyText,
      source: newsSources.name,
    })
    .from(articles)
    .innerJoin(newsSources, eq(articles.sourceId, newsSources.id))
    .where(eq(articles.id, num))
    .limit(1);

  const row = rows[0];
  if (!row) notFound();

  return (
    <main>
      <p className="meta">
        <Link href="/">← Rose</Link>
      </p>
      <h1>{row.title}</h1>
      <p className="meta">
        {row.source}
        {row.publishedAt || row.scrapedAt
          ? ` · ${formatDate(row.publishedAt || row.scrapedAt)}`
          : ""}
      </p>
      <p className="excerpt">{excerpt(row.bodyText, 400)}</p>
      <p>
        <a href={row.url} rel="noopener noreferrer">
          Read on {row.source} ↗
        </a>
      </p>
    </main>
  );
}
