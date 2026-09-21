import { backendJson } from "@/lib/backend";
import type { CountryTone } from "@/lib/globe-tone";

export async function loadGlobeTones(): Promise<CountryTone[]> {
  try {
    const data = await backendJson<{ countries?: CountryTone[] }>("/v1/globe");
    return data.countries || [];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/404|ECONNREFUSED|fetch failed/i.test(message)) return [];
    throw err;
  }
}
