# News globe

**Updated:** 2026-09-21  
**Library:** [react-globe.gl](https://github.com/vasturiano/react-globe.gl)  
**Pipeline:** [newsey docs/globe-country-sentiment.md](https://github.com/ejqs/newsey/blob/main/docs/globe-country-sentiment.md)

The homepage globe is the public surface for Jev country + sentiment. No extra chrome beyond the globe, a three-color legend, and the existing article list under it.

## Where it lives

| Path | Role |
| --- | --- |
| `/` | Globe + latest articles |
| `components/NewsGlobe.tsx` | Client WebGL globe (`ssr: false` via `NewsGlobeClient`) |
| `public/data/ne_110m_admin_0_countries.geojson` | Natural Earth 110m polygons (ISO_A2; FRA/NOR fall back from ADM0_A3) |
| `public/data/earth-dark.jpg` | Local globe texture (avoids CDN CORS) |
| `GET /api/globe` | JSON of aggregated country tones |
| `lib/globe-data.ts` | Reads `article_geo_sentiment` |
| `lib/globe-tone.ts` | Aggregation + colors (same formula as rose-bot `globe-aggregate.js`) |

## Data

rose-bot writes one `article_geo_sentiment` row per article after Jev. This app only **reads** Postgres (`DATABASE_URL`). If the table is missing (bot not migrated yet), the globe renders with uncolored countries.

## Color rules

Per country, over eligible recent analyses:

- `net` = Σ (+confidence if Jev said positive, −confidence if negative, 0 if mixed)
- **Green** `rgba(46, 196, 92, α)` when `net > 0.35`
- **Red** `rgba(220, 50, 50, α)` when `net < -0.35`
- **Blue** `rgba(56, 120, 220, α)` otherwise (mixed / not enough signal)
- **α / height** scale with how many articles agree and their mean confidence: `(n / max_n) * (0.35 + 0.65 * mean_confidence)`, clamped 0.22–1. Display α is `0.55 + 0.4 * strength`.

Countries with no eligible article stay a faint gray.

Jev is conservative: datelines and bylines are not enough to assign a country. See the bot doc for question IDs and thresholds.

## New article path

1. rose-bot scrapes an article (unchanged).
2. After the tick, `jevGlobeTick` sends title+body to Jev (`jev-latest` / mock fixtures).
3. Gated country + sentiment is stored.
4. This page is `force-dynamic`; a refresh reads the new row and recolors the polygon.
