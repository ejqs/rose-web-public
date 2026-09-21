export function backendUrl() {
  const url = process.env.ROSE_BACKEND_URL;
  if (!url) {
    throw new Error("ROSE_BACKEND_URL is required. This app no longer uses DATABASE_URL.");
  }
  return url.replace(/\/$/, "");
}

export async function backendJson<T = Record<string, unknown>>(path: string): Promise<T> {
  const res = await fetch(`${backendUrl()}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`rose-backend ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export type PublicArticle = {
  id: number;
  url: string;
  title: string;
  excerpt: string;
  published_at: string | null;
  scraped_at: string | null;
  jev_status: string;
  source: string;
};

export type GlobeCountry = {
  iso: string;
  name: string;
  tone: "positive" | "negative" | "neutral";
  net: number;
  articles: number;
  strength: number;
};
