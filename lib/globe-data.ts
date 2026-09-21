import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { aggregateCountryTones, type CountryTone } from "@/lib/globe-tone";
import { articleGeoSentiment } from "@/lib/schema";

export async function loadGlobeTones(): Promise<CountryTone[]> {
  try {
    const rows = await getDb()
      .select({
        countryIso: articleGeoSentiment.countryIso,
        countryName: articleGeoSentiment.countryName,
        sentiment: articleGeoSentiment.sentiment,
        confidence: articleGeoSentiment.confidence,
        eligible: articleGeoSentiment.eligible,
      })
      .from(articleGeoSentiment)
      .where(eq(articleGeoSentiment.eligible, 1));
    return aggregateCountryTones(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/article_geo_sentiment/i.test(message) || /does not exist/i.test(message)) {
      return [];
    }
    throw err;
  }
}
