import { geoEqualEarth, type GeoProjection } from "d3-geo";

export type ProjectionConfig = {
  width: number;
  height: number;
  /** [longitude, latitude] to place at the center of the canvas. Defaults to mid-Pacific. */
  center?: [number, number];
  /** d3-geo projection scale. Larger = more zoomed in. Defaults to a whole-Pacific-rim fit. */
  scale?: number;
};

const DEFAULT_CENTER: [number, number] = [-155, 15];
const DEFAULT_SCALE = 220;

export function createPacificProjection(config: ProjectionConfig): GeoProjection {
  const { width, height, center = DEFAULT_CENTER, scale = DEFAULT_SCALE } = config;
  const [lon, lat] = center;

  return geoEqualEarth()
    .rotate([-lon, 0])
    .center([0, lat])
    .scale(scale * (width / 960))
    .translate([width / 2, height / 2]);
}

export function projectPoint(
  projection: GeoProjection,
  lat: number,
  lon: number,
): [number, number] | null {
  return projection([lon, lat]);
}
