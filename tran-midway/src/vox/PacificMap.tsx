import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import worldTopology from "world-atlas/countries-110m.json";
import { createPacificProjection, projectPoint } from "./projection";

// world-atlas ships plain JSON with no bundled/official types (see
// src/vox/topojson-shims.d.ts) — `any` is scoped to this one interop boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const world = worldTopology as any;

export type PacificMapProps = {
  center?: [number, number];
  scale?: number;
  landColor?: string;
  strokeColor?: string;
};

export const PacificMap: React.FC<PacificMapProps> = ({
  center,
  scale,
  landColor = "#1c2f45",
  strokeColor = "#3a5470",
}) => {
  const { width, height } = useVideoConfig();

  const landPath = useMemo(() => {
    const projection = createPacificProjection({ width, height, center, scale });
    const countries = feature(world, world.objects.countries);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return geoPath(projection)(countries as any) ?? "";
  }, [width, height, center, scale]);

  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      <path d={landPath} fill={landColor} stroke={strokeColor} strokeWidth={1.5} />
    </svg>
  );
};

export function usePacificProjection(
  center?: [number, number],
  scale?: number,
): (lat: number, lon: number) => [number, number] | null {
  const { width, height } = useVideoConfig();
  return useMemo(() => {
    const projection = createPacificProjection({ width, height, center, scale });
    return (lat: number, lon: number) => projectPoint(projection, lat, lon);
  }, [width, height, center, scale]);
}
