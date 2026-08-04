// ponytail: manual sanity check (no test framework in this project).
// Run with: node src/vox/projection.check.ts
import { createPacificProjection, projectPoint } from "./projection.ts";

const width = 1920;
const height = 1080;
const MIDWAY: [number, number] = [28.2072, -177.3735]; // [lat, lon]

const projection = createPacificProjection({
  width,
  height,
  center: [MIDWAY[1], MIDWAY[0]], // ProjectionConfig.center is [lon, lat]
});

const projected = projectPoint(projection, MIDWAY[0], MIDWAY[1]);
if (!projected) {
  throw new Error("projectPoint returned null for a projection centered on the same point");
}
const [x, y] = projected;

const dx = Math.abs(x - width / 2);
const dy = Math.abs(y - height / 2);

if (dx > 2 || dy > 2) {
  throw new Error(
    `Midway should project to canvas center (${width / 2}, ${height / 2}) when the projection is centered on it. Got (${x}, ${y}), off by (${dx}, ${dy}).`,
  );
}

console.log(
  `OK: Midway projects to (${x.toFixed(2)}, ${y.toFixed(2)}), center is (${width / 2}, ${height / 2}).`,
);
