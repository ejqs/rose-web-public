import Link from "next/link";
import NewsGlobeClient from "@/components/NewsGlobeClient";
import { backendJson, type PublicArticle } from "@/lib/backend";
import { loadGlobeTones } from "@/lib/globe-data";
import { formatDate } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tones = await loadGlobeTones();
  const data = await backendJson<{ articles?: PublicArticle[] }>("/v1/articles?limit=50");
  const rows = data.articles || [];

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
                  {row.published_at || row.scraped_at
                    ? ` · ${formatDate(row.published_at || row.scraped_at)}`
                    : ""}
                </p>
                <p className="excerpt">{row.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
