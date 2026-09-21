import { loadGlobeTones } from "@/lib/globe-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const countries = await loadGlobeTones();
  return Response.json({ ok: true, countries });
}
