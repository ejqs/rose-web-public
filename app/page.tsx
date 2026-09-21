import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { articles, newsSources } from "@/lib/schema";
import { excerpt, formatDate } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
    .orderBy(desc(articles.id))
    .limit(50);

  return (
    <main>
      <h1>Rose</h1>
      <p className="lede">
        Recursive Opinionated Search Engine. A paced, robots-respecting ingest of English news.
        Search comes later. Full article text stays on the original outlet.
      </p>
      {rows.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {rows.map((row) => (
            <li key={row.id}>
              <Link className="title" href={`/articles/${row.id}`}>
                {row.title}
              </Link>
              <p className="meta">
                {row.source}
                {row.publishedAt || row.scrapedAt
                  ? ` · ${formatDate(row.publishedAt || row.scrapedAt)}`
                  : ""}
              </p>
              <p className="excerpt">{excerpt(row.bodyText)}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
