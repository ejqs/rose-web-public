# Backend HTTP

**Updated:** 2026-09-21

This app is a public HTTP client of [rose-backend](https://github.com/ejqs/rose-backend). It does not connect to Postgres. No Drizzle.

| Env | Required | What |
| --- | --- | --- |
| `ROSE_BACKEND_URL` | yes | Base URL, no trailing slash |

Server components fetch:

- `GET /v1/articles` — list with `excerpt`, never `body_text`
- `GET /v1/articles/:id` — same
- `GET /v1/globe` — aggregated country tones

`GET /api/globe` on this app proxies `/v1/globe` so the client globe can refresh without a full navigation.

Remove `DATABASE_URL` from Railway after this deploys.
