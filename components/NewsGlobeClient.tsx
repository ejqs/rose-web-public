"use client";

import dynamic from "next/dynamic";
import type { CountryTone } from "@/lib/globe-tone";

const NewsGlobe = dynamic(() => import("@/components/NewsGlobe"), {
  ssr: false,
  loading: () => <div className="globe-wrap" aria-busy="true" />,
});

export default function NewsGlobeClient({ tones }: { tones: CountryTone[] }) {
  return <NewsGlobe tones={tones} />;
}
