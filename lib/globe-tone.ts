/** Keep in sync with newsey globe-aggregate.js. */

export const NET_TONE_THRESHOLD = 0.35;

export type Tone = "positive" | "negative" | "neutral";

export type ArticleToneRow = {
  countryIso: string | null;
  countryName: string | null;
  sentiment: string;
  confidence: number | null;
  eligible: number;
};

export type CountryTone = {
  iso: string;
  name: string;
  tone: Tone;
  net: number;
  articles: number;
  strength: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function signedSentiment(sentiment: string, confidence: number) {
  if (sentiment === "positive") return confidence;
  if (sentiment === "negative") return -confidence;
  return 0;
}

export function aggregateCountryTones(rows: ArticleToneRow[]): CountryTone[] {
  const map = new Map<string, { name: string; n: number; confSum: number; net: number }>();
  for (const row of rows) {
    if (!row.countryIso || Number(row.eligible) !== 1) continue;
    const iso = row.countryIso.toUpperCase();
    const conf = Number(row.confidence) || 0;
    const cur = map.get(iso) || {
      name: row.countryName || iso,
      n: 0,
      confSum: 0,
      net: 0,
    };
    cur.n += 1;
    cur.confSum += conf;
    cur.net += signedSentiment(row.sentiment, conf);
    map.set(iso, cur);
  }
  const maxN = Math.max(1, ...[...map.values()].map((v) => v.n));
  return [...map.entries()]
    .map(([iso, v]) => {
      const avgConf = v.n ? v.confSum / v.n : 0;
      const tone: Tone =
        v.net > NET_TONE_THRESHOLD ? "positive" : v.net < -NET_TONE_THRESHOLD ? "negative" : "neutral";
      const strength = clamp((v.n / maxN) * (0.35 + 0.65 * avgConf), 0.22, 1);
      return {
        iso,
        name: v.name,
        tone,
        net: Math.round(v.net * 1000) / 1000,
        articles: v.n,
        strength: Math.round(strength * 1000) / 1000,
      };
    })
    .sort((a, b) => b.articles - a.articles || a.iso.localeCompare(b.iso));
}

export function capColor(tone: Tone, strength: number) {
  const a = 0.55 + 0.4 * (Number(strength) || 0);
  if (tone === "positive") return `rgba(46, 196, 92, ${a})`;
  if (tone === "negative") return `rgba(220, 50, 50, ${a})`;
  return `rgba(56, 120, 220, ${a})`;
}

export function featureIso(properties: {
  ISO_A2?: string;
  ISO_A3?: string;
  ADM0_A3?: string;
}): string | null {
  const a2 = properties.ISO_A2;
  if (a2 && a2 !== "-99") return a2.toUpperCase();
  const a3 = (properties.ADM0_A3 || properties.ISO_A3 || "").toUpperCase();
  if (a3 === "FRA") return "FR";
  if (a3 === "NOR") return "NO";
  return null;
}
