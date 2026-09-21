# rose-web-public

Plain public site for **Rose** (Recursive Opinionated Search Engine).

Homepage globe (country sentiment) plus article titles with source, date, and a short excerpt. Clicks go to the original outlet. Full `body_text` is not republished here.

Search is later. Bot config lives in [rose-web-admin](https://github.com/ejqs/rose-web-admin). The scrape worker is [newsey](https://github.com/ejqs/newsey) (rose-bot). Data API: [rose-backend](https://github.com/ejqs/rose-backend).

## Run

Requires **Node 22+** and `ROSE_BACKEND_URL`.

```bash
cp .env.example .env
# set ROSE_BACKEND_URL
npm install
npm run dev
```

| Path | What |
| --- | --- |
| `/` | Globe + latest articles |
| `/articles/[id]` | Excerpt + outbound link |
| `GET /health` | Railway probe |
| `GET /api/globe` | Proxied country tones |

```bash
npm start   # after npm run build
```

## Docs

Index: [docs/README.md](docs/README.md). Rose map: [ejqs/newsey docs/web.md](https://github.com/ejqs/newsey/blob/main/docs/web.md).
