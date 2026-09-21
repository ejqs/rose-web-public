"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { capColor, featureIso, type CountryTone } from "@/lib/globe-tone";

type GeoFeature = {
  type: string;
  properties: {
    ADMIN?: string;
    NAME?: string;
    ISO_A2?: string;
    ISO_A3?: string;
    ADM0_A3?: string;
  };
  geometry: { type: string; coordinates: unknown };
};

type GeoCollection = { features: GeoFeature[] };

type Props = {
  tones: CountryTone[];
};

export default function NewsGlobe({ tones }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [countries, setCountries] = useState<GeoFeature[]>([]);
  const [hover, setHover] = useState<GeoFeature | null>(null);

  const byIso = useMemo(() => new Map(tones.map((t) => [t.iso, t])), [tones]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetch("/data/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((geo: GeoCollection) => setCountries(geo.features || []));
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = true;
    g.controls().autoRotateSpeed = 0.6;
    g.pointOfView({ lat: 48, lng: 32, altitude: 2.2 }, 0);
  }, [size.w, countries.length]);

  const polygons = useMemo(
    () => countries.filter((f) => featureIso(f.properties) !== "AQ"),
    [countries],
  );

  const cap = useCallback(
    (obj: object) => {
      const feat = obj as GeoFeature;
      const iso = featureIso(feat.properties);
      const row = iso ? byIso.get(iso) : undefined;
      if (!row) return "rgba(120, 120, 120, 0.35)";
      return capColor(row.tone, row.strength);
    },
    [byIso],
  );

  const altitude = useCallback(
    (obj: object) => {
      const feat = obj as GeoFeature;
      if (feat === hover) return 0.08;
      const iso = featureIso(feat.properties);
      const row = iso ? byIso.get(iso) : undefined;
      if (!row) return 0.006;
      return 0.03 + 0.08 * row.strength;
    },
    [byIso, hover],
  );

  const label = useCallback(
    (obj: object) => {
      const feat = obj as GeoFeature;
      const iso = featureIso(feat.properties) || "";
      const name = feat.properties.ADMIN || feat.properties.NAME || iso;
      const row = byIso.get(iso);
      if (!row) return `${name}`;
      const tone =
        row.tone === "positive" ? "positive" : row.tone === "negative" ? "negative" : "mixed / weak";
      return `${name}\n${tone} · ${row.articles} article${row.articles === 1 ? "" : "s"}`;
    },
    [byIso],
  );

  return (
    <div className="globe-wrap" ref={wrapRef}>
      {size.w > 0 && size.h > 0 ? (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="#111111"
          globeImageUrl="/data/earth-dark.jpg"
          polygonsData={polygons}
          polygonCapColor={cap}
          polygonSideColor={() => "rgba(0, 0, 0, 0.12)"}
          polygonStrokeColor={() => "#1a1a1a"}
          polygonAltitude={altitude}
          polygonLabel={label}
          onPolygonHover={(d: object | null) => setHover(d as GeoFeature | null)}
          polygonsTransitionDuration={200}
        />
      ) : null}
      <p className="globe-legend">
        <span>
          <i className="swatch swatch-pos" /> positive
        </span>
        <span>
          <i className="swatch swatch-neg" /> negative
        </span>
        <span>
          <i className="swatch swatch-neu" /> mixed / weak
        </span>
        <span>opacity scales with agreeing articles</span>
      </p>
    </div>
  );
}
