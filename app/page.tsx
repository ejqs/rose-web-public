import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import NewsGlobeClient from "@/components/NewsGlobeClient";
import { getDb } from "@/lib/db";
import { loadGlobeTones } from "@/lib/globe-data";
import { articles, newsSources } from "@/lib/schema";
import { excerpt, formatDate } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tones = await loadGlobeTones();
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
    <>
      <NewsGlobeClient tones={tones} />
      <main>
        <h1>Rose</h1>
        <p className="lede">
          Countries color from Jev’s read of what each article is about, and whether it talks
          well or badly about that country. Green is net positive, red net negative, blue mixed
          or weak. The list below is the same ingest; full text stays on the original outlet.
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
    </>
  );
}
