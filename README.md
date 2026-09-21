# rose-web-public

Public site for **Rose** (Recursive Opinionated Search Engine).

Homepage: a [react-globe.gl](https://github.com/vasturiano/react-globe.gl) globe colored by Jev country sentiment, then a list of scraped titles with source, date, and a short excerpt. Clicks go to the original outlet. Full `body_text` is not republished here.

Search is later. Bot config lives in [rose-web-admin](https://github.com/ejqs/rose-web-admin). The scrape + Jev worker is [newsey](https://github.com/ejqs/newsey) (rose-bot).

## Run

Requires **Node 22+** and `DATABASE_URL` (same Railway Postgres as rose-bot).

```bash
cp .env.example .env
# set DATABASE_URL
npm install
npm run dev
```

| Path | What |
| --- | --- |
| `/` | Globe + latest articles |
| `/articles/[id]` | Excerpt + outbound link |
| `GET /health` | Railway probe |

```bash
npm start   # after npm run build
```

## Docs

Index: [docs/README.md](docs/README.md). Globe: [docs/news-globe.md](docs/news-globe.md). Rose map: [ejqs/newsey docs/web.md](https://github.com/ejqs/newsey/blob/main/docs/web.md).
