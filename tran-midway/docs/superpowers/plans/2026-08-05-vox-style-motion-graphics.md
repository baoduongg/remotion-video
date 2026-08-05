# Vox-Style Motion Graphic Layer (Scene 2/4/7) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Vox-style motion graphic layer (real geographic map, draw-on paths, animated counters) on top of Scene2Context, Scene4FirstStrike, and Scene7Aftermath in the `tran-midway` Remotion project, without touching script/VO or the other five scenes.

**Architecture:** Three new pure/near-pure shared components under `tran-midway/src/vox/` (`projection.ts`, `PacificMap.tsx`, `DrawOnPath.tsx`, `AnimatedCounter.tsx`), each consumed by the three target scenes. Scene files are rewritten to source marker/ship positions from real lat/lon coordinates via the shared projection instead of hand-picked pixel offsets.

**Tech Stack:** Remotion 4.0.505, React 19, TypeScript (strict), `d3-geo` + `topojson-client` + `world-atlas` for the map, `@remotion/paths` for draw-on line animation.

## Global Constraints

- Spec: `tran-midway/docs/superpowers/specs/2026-08-04-vox-style-motion-graphics-design.md`.
- Scope is limited to `Scene2Context.tsx`, `Scene4FirstStrike.tsx`, `Scene7Aftermath.tsx`, and new files under `src/vox/`. Do not modify Scene1/3/5/6/8.
- Pin `@remotion/paths` to `4.0.505` to match the rest of the Remotion monorepo (already present in `node_modules` as a transitive dep at this version — confirm the pin during Task 1).
- No new test framework. Verification is: `npx tsc --noEmit` + `npx eslint src` after every code change (this project's established convention, see `WORKFLOW.md` step 4), `npx remotion still <CompId> out.png --frame=<n>` for visual spot-checks, and two small assert-based Node scripts for the two pieces of non-trivial pure logic (geo projection centering, path draw-on hide/reveal).
- All working commands below run from `tran-midway/` (the Remotion project root), not the repo root.

---

### Task 1: Dependencies and TypeScript config

**Files:**
- Modify: `tran-midway/package.json`
- Modify: `tran-midway/tsconfig.json`
- Create: `tran-midway/src/vox/topojson-shims.d.ts`

**Interfaces:**
- Produces: ambient module declarations so `import ... from "topojson-client"` and `import worldTopology from "world-atlas/countries-110m.json"` type-check under `strict` mode. Consumed by Task 3 (`PacificMap.tsx`).

- [ ] **Step 1: Install runtime dependencies**

```bash
cd tran-midway
npm install d3-geo topojson-client world-atlas @remotion/paths@4.0.505
```

- [ ] **Step 2: Install the type declarations that exist on npm**

```bash
npm install --save-dev @types/d3-geo
```

`topojson-client` and `world-atlas` have no usable published types (the latter is just JSON) — that's what Step 4's shim file is for. Do not install `@types/topojson-client`.

- [ ] **Step 3: Confirm the world-atlas data file path**

```bash
ls node_modules/world-atlas
```

Expected: a file named `countries-110m.json` in the listing. If the exact filename differs, use that real filename in every step below instead of `countries-110m.json`.

- [ ] **Step 4: Add the ambient module shim**

Create `tran-midway/src/vox/topojson-shims.d.ts`:

```ts
declare module "topojson-client";

declare module "world-atlas/countries-110m.json" {
  const data: unknown;
  export default data;
}
```

- [ ] **Step 5: Enable JSON module imports in tsconfig**

In `tran-midway/tsconfig.json`, add `"resolveJsonModule": true` to `compilerOptions`:

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "lib": ["es2015"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "resolveJsonModule": true
  },
  "exclude": ["remotion.config.ts"]
}
```

- [ ] **Step 6: Verify the pinned version and that nothing broke**

```bash
npm ls @remotion/paths
npx tsc --noEmit
npx eslint src
```

Expected: `@remotion/paths@4.0.505` in the `npm ls` output; both checks PASS with no errors (no application code changed yet, only config).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json src/vox/topojson-shims.d.ts
git commit -m "Add map/path animation dependencies for Vox-style scenes"
```

---

### Task 2: Pacific projection helper

**Files:**
- Create: `tran-midway/src/vox/projection.ts`
- Create: `tran-midway/src/vox/projection.check.ts`

**Interfaces:**
- Consumes: `geoEqualEarth`, `GeoProjection` from `d3-geo` (Task 1).
- Produces: `createPacificProjection(config: ProjectionConfig): GeoProjection`, `projectPoint(projection: GeoProjection, lat: number, lon: number): [number, number] | null`, `type ProjectionConfig = { width: number; height: number; center?: [number, number]; scale?: number }`. Consumed by Task 3 (`PacificMap.tsx`).

- [ ] **Step 1: Write `projection.ts`**

```ts
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
```

- [ ] **Step 2: Write the sanity check script**

Create `tran-midway/src/vox/projection.check.ts`:

```ts
// ponytail: manual sanity check (no test framework in this project).
// Run with: node src/vox/projection.check.ts
import { createPacificProjection, projectPoint } from "./projection";

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
```

- [ ] **Step 3: Run it**

```bash
node src/vox/projection.check.ts
```

Expected: prints the `OK: ...` line and exits 0. If it throws, the most likely bug is the `[lat, lon]` vs `[lon, lat]` argument order between `ProjectionConfig.center` and `projectPoint` — re-check Step 1's code against this script before changing the check itself.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/vox/projection.ts src/vox/projection.check.ts
git commit -m "Add Pacific-centered geo projection helper"
```

---

### Task 3: `PacificMap` component

**Files:**
- Create: `tran-midway/src/vox/PacificMap.tsx`

**Interfaces:**
- Consumes: `createPacificProjection`, `projectPoint` from `./projection` (Task 2).
- Produces: `<PacificMap center?: [number, number]; scale?: number; landColor?: string; strokeColor?: string />` component; `usePacificProjection(center?: [number, number], scale?: number): (lat: number, lon: number) => [number, number] | null` hook. Both consumed by Task 7 (`Scene2Context.tsx`) and Task 8 (`Scene4FirstStrike.tsx`).

- [ ] **Step 1: Write the component**

Create `tran-midway/src/vox/PacificMap.tsx`:

```tsx
import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import worldTopology from "world-atlas/countries-110m.json";
import { createPacificProjection, projectPoint } from "./projection";

// world-atlas ships plain JSON with no bundled/official types (see
// src/vox/topojson-shims.d.ts) — `any` is scoped to this one interop boundary.
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
```

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit
npx eslint src
```

Expected: PASS. `PacificMap` has no consumer yet, so this compile check is the task's test — it's exercised visually once Task 7 wires it in.

- [ ] **Step 3: Commit**

```bash
git add src/vox/PacificMap.tsx
git commit -m "Add PacificMap component and usePacificProjection hook"
```

---

### Task 4: `DrawOnPath` component

**Files:**
- Create: `tran-midway/src/vox/DrawOnPath.tsx`
- Create: `tran-midway/src/vox/drawOnPath.check.ts`

**Interfaces:**
- Consumes: `evolvePath`, `getLength` from `@remotion/paths` (Task 1; confirmed exports via `node_modules/@remotion/paths/dist/index.d.ts`).
- Produces: `<DrawOnPath d: string; from: number; to: number; stroke: string; strokeWidth?: number; fill?: string />`. Must be rendered inside a parent `<svg>`. Consumed by Task 7 and Task 8.

- [ ] **Step 1: Write the component**

Create `tran-midway/src/vox/DrawOnPath.tsx`:

```tsx
import { evolvePath } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";

export type DrawOnPathProps = {
  d: string;
  from: number;
  to: number;
  stroke: string;
  strokeWidth?: number;
  fill?: string;
};

export const DrawOnPath: React.FC<DrawOnPathProps> = ({
  d,
  from,
  to,
  stroke,
  strokeWidth = 4,
  fill = "none",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, d);

  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
    />
  );
};
```

- [ ] **Step 2: Write the sanity check script**

Create `tran-midway/src/vox/drawOnPath.check.ts`:

```ts
// ponytail: manual sanity check (no test framework in this project).
// Run with: node src/vox/drawOnPath.check.ts
import { evolvePath, getLength } from "@remotion/paths";

const d = "M0,0 L100,0";
const length = getLength(d);

const start = evolvePath(0, d);
const end = evolvePath(1, d);

if (Math.round(start.strokeDashoffset) !== Math.round(length)) {
  throw new Error(
    `Expected progress=0 to fully hide the path (dashoffset === length ${length}), got ${start.strokeDashoffset}`,
  );
}
if (Math.round(end.strokeDashoffset) !== 0) {
  throw new Error(
    `Expected progress=1 to fully reveal the path (dashoffset === 0), got ${end.strokeDashoffset}`,
  );
}

console.log(
  `OK: evolvePath hides at progress=0 (offset ${start.strokeDashoffset}) and reveals at progress=1 (offset ${end.strokeDashoffset}), length=${length}.`,
);
```

- [ ] **Step 3: Run it**

```bash
node src/vox/drawOnPath.check.ts
```

Expected: prints the `OK: ...` line and exits 0.

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
npx eslint src
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/vox/DrawOnPath.tsx src/vox/drawOnPath.check.ts
git commit -m "Add DrawOnPath component for animated line/path draw-on"
```

---

### Task 5: `AnimatedCounter` component

**Files:**
- Create: `tran-midway/src/vox/AnimatedCounter.tsx`

**Interfaces:**
- Produces: `<AnimatedCounter from: number; to: number; target: number; prefix?: string; style?: React.CSSProperties />`. Consumed by Task 6 (`Scene7Aftermath.tsx`).

No dedicated check script — this wraps a single `interpolate` + `toLocaleString` call with no branch/loop, so per this project's own bar for "non-trivial logic," it doesn't need one; it's exercised visually in Task 6.

- [ ] **Step 1: Write the component**

Create `tran-midway/src/vox/AnimatedCounter.tsx`:

```tsx
import { interpolate, useCurrentFrame } from "remotion";

export type AnimatedCounterProps = {
  from: number;
  to: number;
  target: number;
  prefix?: string;
  style?: React.CSSProperties;
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  target,
  prefix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [from, to], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span style={style}>
      {prefix}
      {Math.round(value).toLocaleString("vi-VN")}
    </span>
  );
};
```

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit
npx eslint src
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/vox/AnimatedCounter.tsx
git commit -m "Add AnimatedCounter component"
```

---

### Task 6: Wire `AnimatedCounter` into Scene7Aftermath

**Files:**
- Modify: `tran-midway/src/scenes/Scene7Aftermath.tsx`

**Interfaces:**
- Consumes: `<AnimatedCounter>` from `../vox/AnimatedCounter` (Task 5).

- [ ] **Step 1: Add the import**

In `tran-midway/src/scenes/Scene7Aftermath.tsx`, after the existing `Caption, SectionTitle` import (currently line 12):

```ts
import { Caption, SectionTitle } from "../TextOverlay";
import { AnimatedCounter } from "../vox/AnimatedCounter";
```

- [ ] **Step 2: Replace the pre-formatted number strings with a `prefix` field**

Replace the `ROWS` array (currently lines 16-44):

```ts
const ROWS = [
  {
    label: "Tàu sân bay",
    japan: 4,
    us: 1,
    max: 4,
    prefix: "",
    grow: 70,
  },
  {
    label: "Người thiệt mạng",
    japan: 3057,
    us: 307,
    max: 3057,
    prefix: "~",
    grow: 170,
  },
  {
    label: "Máy bay",
    japan: 248,
    us: 150,
    max: 248,
    prefix: "~",
    grow: 270,
  },
] as const;
```

- [ ] **Step 3: Render counters instead of static text**

Replace the Japan-side number `<div>` (currently):

```tsx
                <div
                  style={{
                    marginLeft: 12,
                    color: "#e6b3ae",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                  }}
                >
                  {row.japanText}
                </div>
```

with:

```tsx
                <div
                  style={{
                    marginLeft: 12,
                    color: "#e6b3ae",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                  }}
                >
                  <AnimatedCounter
                    from={row.grow}
                    to={row.grow + 40}
                    target={row.japan}
                    prefix={row.prefix}
                  />
                </div>
```

And replace the US-side number `<div>` (currently):

```tsx
                <div
                  style={{
                    marginRight: 12,
                    color: "#bcd9ff",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                    textAlign: "right",
                  }}
                >
                  {row.usText}
                </div>
```

with:

```tsx
                <div
                  style={{
                    marginRight: 12,
                    color: "#bcd9ff",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                    textAlign: "right",
                  }}
                >
                  <AnimatedCounter
                    from={row.grow}
                    to={row.grow + 40}
                    target={row.us}
                    prefix={row.prefix}
                  />
                </div>
```

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
npx eslint src
```

Expected: PASS.

- [ ] **Step 5: Render sample stills and inspect**

```bash
npx remotion still Scene7Aftermath out/check-scene7-mid.png --frame=110
npx remotion still Scene7Aftermath out/check-scene7-end.png --frame=619
```

Read both PNGs. At frame 110 (mid-way through the first row's `grow` window of 70-110), the "Tàu sân bay" row should show a number between 0 and 4 on each side, still counting up. At frame 619 (last frame), all three rows should read the same final values as before this change: `4` / `1`, `~3.057` / `~307`, `~248` / `~150`.

- [ ] **Step 6: Commit**

```bash
git add src/scenes/Scene7Aftermath.tsx
git commit -m "Animate Scene7 casualty numbers with AnimatedCounter"
```

---

### Task 7: Rewrite Scene2Context with a real Pacific map

**Files:**
- Modify (full rewrite): `tran-midway/src/scenes/Scene2Context.tsx`

**Interfaces:**
- Consumes: `<PacificMap>`, `usePacificProjection` from `../vox/PacificMap` (Task 3); `<DrawOnPath>` from `../vox/DrawOnPath` (Task 4).

- [ ] **Step 1: Replace the full file content**

Replace all of `tran-midway/src/scenes/Scene2Context.tsx` with:

```tsx
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";
import { shotTransform } from "../kenBurns";
import { Caption, SectionTitle } from "../TextOverlay";
import { PacificMap, usePacificProjection } from "../vox/PacificMap";
import { DrawOnPath } from "../vox/DrawOnPath";

const MAP_CENTER: [number, number] = [-170, 10];

const NODES = [
  {
    lat: 21.3469,
    lon: -157.8583,
    date: "07/12/1941",
    label: "Trân Châu Cảng",
    pop: 40,
    gold: false,
    image: "scene_2_pearl.png",
  },
  {
    lat: 35.6762,
    lon: 139.6503,
    date: "04/1942",
    label: "Không kích Doolittle",
    pop: 200,
    gold: false,
    image: "scene_2_doolittle.png",
  },
  {
    lat: -15,
    lon: 155,
    date: "05/1942",
    label: "Trận biển Coral",
    pop: 320,
    gold: false,
    image: "scene_2_coral.png",
  },
  {
    lat: 28.2072,
    lon: -177.3735,
    date: "06/1942",
    label: "Midway?",
    pop: 430,
    gold: true,
    image: "scene_2_midway.png",
  },
] as const;

export const Scene2Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const project = usePacificProjection(MAP_CENTER);

  const transformBg = shotTransform(frame, [
    { from: 0, to: durationInFrames, scale: [1.05, 1.15], x: [-2, 2] },
  ]);

  const points = NODES.map((node) => project(node.lat, node.lon) ?? [0, 0]);
  const trackPath = `M${points.map(([x, y]) => `${x},${y}`).join(" L")}`;
  const lastPop = NODES[NODES.length - 1].pop;

  return (
    <AbsoluteFill
      name="Scene 2 - Context"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_02.mp3")} from={20} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: transformBg,
          transformOrigin: "center",
          opacity: 0.8,
        }}
      >
        <PacificMap center={MAP_CENTER} landColor="#1c2f45" strokeColor="#3a5470" />
      </div>
      <SectionTitle name="Section title">Sáu tháng trước Midway</SectionTitle>
      {/* Timeline connector following the real map route between events */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={trackPath} stroke="#16283d" strokeWidth={3} fill="none" />
        <DrawOnPath d={trackPath} from={0} to={lastPop + 20} stroke="#d4af37" strokeWidth={3} />
      </svg>
      {/* Circular Vignette Cards */}
      {NODES.map((node, i) => {
        const [x, y] = points[i];
        const scaleNode = interpolate(frame, [node.pop, node.pop + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.5)),
          output: "perceptual-scale",
        });

        return (
          <div
            key={node.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              scale: scaleNode,
            }}
          >
            <div
              style={{
                width: node.gold ? 160 : 220,
                height: node.gold ? 160 : 220,
                borderRadius: 999,
                border: `4px solid ${node.gold ? "#d4af37" : "#4ea1ff"}`,
                boxShadow: node.gold
                  ? "0 0 35px 12px rgba(212,175,55,0.45)"
                  : "0 0 20px 4px rgba(78,161,255,0.25)",
                overflow: "hidden",
                backgroundColor: "#070d16",
              }}
            >
              <Img
                src={staticFile(`images/${node.image}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        );
      })}
      {/* Labels */}
      {NODES.map((node, i) => {
        const [x, y] = points[i];
        return (
          <div
            key={`label-${node.label}`}
            style={{
              position: "absolute",
              left: x,
              top: y - 170,
              translate: "-50% 0%",
              textAlign: "center",
              width: 340,
            }}
          >
            <Interactive.Div
              name={`Date ${node.label}`}
              style={{
                color: node.gold ? "#d4af37" : "#f3f1e7",
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: 34,
                opacity: interpolate(frame, [node.pop, node.pop + 15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: "0px -53.1px",
              }}
            >
              {node.date}
            </Interactive.Div>
            <div
              style={{
                translate: "0px -53.1px",
                color: "#c7d2e0",
                fontFamily: bodyFont,
                fontSize: 26,
                opacity: interpolate(frame, [node.pop + 5, node.pop + 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}
      <Caption name="Context caption" from={480}>
        Sau đòn tập kích Trân Châu Cảng, Đô đốc Yamamoto quyết tâm nhử hạm đội
        tàu sân bay Mỹ ra khỏi nơi ẩn náu — và tiêu diệt nó tại Midway.
      </Caption>
    </AbsoluteFill>
  );
};
```

This drops the old fixed-fraction `NODES[].x` / `lineY` pixel layout in favor of real lat/lon projected through `usePacificProjection`, and replaces the static dasharray line with `<DrawOnPath>` following the actual polyline between the four projected points, timed to finish drawing shortly after the last node pops in (`lastPop + 20`) instead of finishing at a fixed frame 90 regardless of when nodes appear.

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit
npx eslint src
```

Expected: PASS. If `noUnusedLocals` flags anything, it means a variable from the old version (e.g. `width`, `height`, `lineY`) is still referenced somewhere — remove it; the version above uses none of them.

- [ ] **Step 3: Render sample stills and inspect**

```bash
npx remotion still Scene2Context out/check-scene2-early.png --frame=45
npx remotion still Scene2Context out/check-scene2-late.png --frame=450
```

Read both PNGs. At frame 45, the gold connector line should be partway drawn from the Pearl Harbor marker. At frame 450, all four markers (Pearl Harbor, Tokyo, Coral Sea, Midway) should be visible with labels, roughly spread across the map in a way that's recognizably the Pacific rim (Tokyo west, Pearl Harbor east, Coral Sea south, Midway centered), and the gold line should be fully drawn.

If the map is barely visible or markers cluster too tightly/spill off-canvas, adjust `MAP_CENTER` and/or add a `scale` value to both the `<PacificMap>` and `usePacificProjection` calls (keep them identical) and re-render.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene2Context.tsx
git commit -m "Rewrite Scene2 timeline with a real Pacific map and draw-on connector"
```

---

### Task 8: Rewrite Scene4FirstStrike with a real Pacific map

**Files:**
- Modify (full rewrite): `tran-midway/src/scenes/Scene4FirstStrike.tsx`

**Interfaces:**
- Consumes: `<PacificMap>`, `usePacificProjection` from `../vox/PacificMap` (Task 3); `<DrawOnPath>` from `../vox/DrawOnPath` (Task 4); `ShipIcon` from `../icons` (already exists).

- [ ] **Step 1: Replace the full file content**

Replace all of `tran-midway/src/scenes/Scene4FirstStrike.tsx` with:

```tsx
import {
  AbsoluteFill,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";
import { shotTransform } from "../kenBurns";
import { Caption, SectionTitle } from "../TextOverlay";
import { PacificMap, usePacificProjection } from "../vox/PacificMap";
import { DrawOnPath } from "../vox/DrawOnPath";
import { ShipIcon } from "../icons";

// Approximate positions for the morning of June 4, 1942 — illustrative, not
// navigational. Kido Butai northwest of Midway, US TF16/17 at "Point Luck"
// northeast of Midway. Midway itself: 28.2072, -177.3735.
const MAP_CENTER: [number, number] = [-177, 30];
const MAP_SCALE = 2600;

const US_SHIPS = [
  { lat: 32.3, lon: -173.4, label: "Yorktown" },
  { lat: 32.0, lon: -172.9, label: "Enterprise" },
  { lat: 31.7, lon: -173.3, label: "Hornet" },
];

const JAPAN_SHIPS = [
  { lat: 31.3, lon: -179.6, label: "Akagi" },
  { lat: 31.1, lon: -179.1, label: "Kaga" },
  { lat: 30.7, lon: -179.5, label: "Soryu" },
  { lat: 30.5, lon: -179.0, label: "Hiryu" },
];

const PLANES = [
  { launch: 150, destroy: 260, y: 640, survivor: false },
  { launch: 185, destroy: 300, y: 600, survivor: false },
  { launch: 220, destroy: 340, y: 660, survivor: false },
  { launch: 255, destroy: 380, y: 610, survivor: false },
  { launch: 290, destroy: 400, y: 650, survivor: true },
] as const;

const PLANE_X_START = 300;
const PLANE_X_END = 1350;
const PLANE_TRAVEL = 150;

export const Scene4FirstStrike: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const project = usePacificProjection(MAP_CENTER, MAP_SCALE);

  const transformBg = shotTransform(frame, [
    { from: 0, to: durationInFrames, scale: [1.02, 1.1], x: [-1, 1] },
  ]);

  const usPoints = US_SHIPS.map((ship) => project(ship.lat, ship.lon) ?? [0, 0]);
  const japanPoints = JAPAN_SHIPS.map((ship) => project(ship.lat, ship.lon) ?? [0, 0]);

  return (
    <AbsoluteFill
      name="Scene 4 - First Strike"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_04.mp3")} from={20} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: transformBg,
          transformOrigin: "center",
        }}
      >
        <PacificMap center={MAP_CENTER} scale={MAP_SCALE} landColor="#1c2f45" strokeColor="#3a5470" />
      </div>

      <SectionTitle name="Section title">4 tháng 6, 1942 — Đợt tấn công đầu tiên</SectionTitle>

      {/* US Ships */}
      {US_SHIPS.map((ship, i) => {
        const [x, y] = usPoints[i];
        return (
          <div
            key={ship.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              opacity: interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ShipIcon color="#4ea1ff" width={90} />
            <div
              style={{
                marginTop: 6,
                color: "#c7d2e0",
                fontFamily: bodyFont,
                fontSize: 22,
                textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              {ship.label}
            </div>
          </div>
        );
      })}

      {/* Japan Ships */}
      {JAPAN_SHIPS.map((ship, i) => {
        const [x, y] = japanPoints[i];
        return (
          <div
            key={ship.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              opacity: interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ShipIcon color="#e0483e" width={90} />
            <div
              style={{
                marginTop: 6,
                color: "#e6b3ae",
                fontFamily: bodyFont,
                fontSize: 22,
                textAlign: "right",
                textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              {ship.label}
            </div>
          </div>
        );
      })}

      {/* Attack vector: Torpedo Squadron 8's run from Hornet toward the Japanese formation */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <DrawOnPath
          d={`M${usPoints[2][0]},${usPoints[2][1]} L${japanPoints[1][0]},${japanPoints[1][1]}`}
          from={140}
          to={290}
          stroke="#ffd700"
          strokeWidth={2}
        />
      </svg>

      {/* Anti-aircraft tracer fire (Lưới lửa phòng không Nhật Bản từ biên phải sang biên trái) */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.7 }}
      >
        {Array.from({ length: 14 }).map((_, i) => {
          // Tracers shoot during the air attack (frames 100 to 450)
          const startFrame = 90 + i * 25;
          const duration = 20;
          if (frame < startFrame || frame > startFrame + duration) return null;

          const age = frame - startFrame;
          const tProgress = age / duration;

          // Japanese carriers coordinates on the right side
          const shooterY = 250 + (i % 4) * 150;
          const startX = width - 380;
          const startY = shooterY + 50;

          // Shoots towards the left (where the planes are flying)
          const lineLength = 220;
          const angle = Math.PI - 0.2 + (i % 3) * 0.1 - (i % 2) * 0.15; // angle pointing left-ish

          const curDist = tProgress * 1100;
          const endX = startX + Math.cos(angle) * curDist;
          const endY = startY + Math.sin(angle) * curDist;

          const startTracerX = endX - Math.cos(angle) * lineLength;
          const startTracerY = endY - Math.sin(angle) * lineLength;

          return (
            <line
              key={i}
              x1={startTracerX}
              y1={startTracerY}
              x2={endX}
              y2={endY}
              stroke={i % 2 === 0 ? "#00ffcc" : "#ffd700"} // green and yellow tracers
              strokeWidth={3}
              opacity={interpolate(tProgress, [0.7, 1.0], [0.95, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          );
        })}
      </svg>

      {/* Moving Planes */}
      {PLANES.map((plane, i) => {
        const isDestroyable = (plane.destroy as number | null) !== null;
        const endFrame = isDestroyable
          ? (plane.destroy as number)
          : plane.launch + PLANE_TRAVEL + 60;
        const inFlight = frame >= plane.launch && frame < endFrame + 30;
        if (!inFlight) return null;

        const progress = Math.min(
          1,
          Math.max(0, (frame - plane.launch) / PLANE_TRAVEL),
        );
        const x = PLANE_X_START + (PLANE_X_END - PLANE_X_START) * progress;

        // Let them dive slightly as they fly to make it more dynamic!
        const y = plane.y + progress * 40 - (plane.survivor && frame > plane.launch + PLANE_TRAVEL ? (frame - (plane.launch + PLANE_TRAVEL)) * 2 : 0);

        const destroyed = isDestroyable && frame >= (plane.destroy as number);
        const burstAge = destroyed ? frame - (plane.destroy as number) : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
            }}
          >
            {!destroyed && (
              <div
                style={{
                  opacity: plane.survivor
                    ? interpolate(
                      frame,
                      [
                        plane.launch + PLANE_TRAVEL + 30,
                        plane.launch + PLANE_TRAVEL + 60,
                      ],
                      [1, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    )
                    : 1,
                  transform: `rotate(${plane.survivor && frame > plane.launch + PLANE_TRAVEL ? -15 : 5}deg)`,
                }}
              >
                <Img
                  src={staticFile("images/devastator_plane.png")}
                  style={{
                    width: 130,
                    height: 130,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.65))",
                    scale: "-1 1",
                  }}
                />
              </div>
            )}

            {/* Dynamic explosion and falling smoke trail */}
            {destroyed && burstAge < 30 && (
              <>
                {/* Explosion flash */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    translate: "-50% -50%",
                    width: 90,
                    height: 90,
                    borderRadius: 999,
                    backgroundColor: "#ffb347",
                    boxShadow: "0 0 35px 10px #ff4500, 0 0 70px 20px #e0483e",
                    scale: interpolate(burstAge, [0, 20], [0.3, 1.8], { extrapolateRight: "clamp" }),
                    opacity: interpolate(burstAge, [0, 20], [1, 0], { extrapolateRight: "clamp" }),
                  }}
                />

                {/* Spiral falling smoke */}
                <div
                  style={{
                    position: "absolute",
                    left: interpolate(burstAge, [0, 30], [0, 60], { extrapolateRight: "clamp" }),
                    top: interpolate(burstAge, [0, 30], [0, 110], { extrapolateRight: "clamp" }),
                    translate: "-50% -50%",
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: "#1c1c1c",
                    boxShadow: "0 0 15px #111",
                    opacity: interpolate(burstAge, [0, 30], [0.8, 0], { extrapolateRight: "clamp" }),
                    scale: interpolate(burstAge, [0, 30], [0.8, 3.0], { extrapolateRight: "clamp" }),
                  }}
                />
              </>
            )}
          </div>
        );
      })}

      {/* Stat Callout */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 210,
          translate: "-50% 0%",
          textAlign: "center",
          backgroundColor: "rgba(5,9,15,0.65)",
          padding: "16px 36px",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: interpolate(
            frame,
            [520, 560, durationInFrames - 60, durationInFrames - 20],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <Interactive.Div
          name="Stat callout"
          style={{
            color: "#d4af37",
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: 2,
          }}
        >
          15 máy bay ngư lôi &mdash; chỉ 1 người sống sót
        </Interactive.Div>
      </div>

      <Caption name="First strike caption" from={40}>
        Phi đội Ngư lôi 8 từ tàu Hornet lao vào tấn công không có tiêm kích hộ tống. Toàn bộ 15 máy bay bị bắn hạ — chỉ Ensign George Gay sống sót.
      </Caption>
    </AbsoluteFill>
  );
};
```

This replaces the painterly `us_carrier.png` / `japan_carrier.png` images and fixed pixel positions with `ShipIcon` (flat vector, from the existing `icons.tsx`) placed via real projected coordinates, and adds the Torpedo Squadron 8 attack vector as a `<DrawOnPath>` from Hornet toward the Japanese formation. The tracer fire, plane flight/explosion choreography, and stat callout are unchanged — they're independent of ship positioning and already worked correctly in the prior QC pass.

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit
npx eslint src
```

Expected: PASS.

- [ ] **Step 3: Render sample stills and inspect**

```bash
npx remotion still Scene4FirstStrike out/check-scene4-ships.png --frame=100
npx remotion still Scene4FirstStrike out/check-scene4-attack.png --frame=200
```

Read both PNGs.

At frame 100: all 7 ship icons (3 blue US, 4 red Japanese) should be visible on the map, roughly matching the old layout's left/right split (US on the left side of frame, Japan on the right), not overlapping each other or running off-canvas. If they're too clustered or off-screen, increase or decrease `MAP_SCALE` (keep the `<PacificMap>` and `usePacificProjection` calls in sync) and re-render.

At frame 200: the gold attack-vector line should be partway drawn from the Hornet icon toward the Japanese carrier cluster, and the plane/tracer choreography should still look correct relative to the new ship positions. If the planes now visually launch from empty space instead of the Hornet icon, or fly toward empty space instead of the Japanese carriers, adjust `PLANE_X_START`, `PLANE_X_END`, and the per-plane `y` values in the `PLANES` array to match the new ship icon positions from this render, then re-check.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Scene4FirstStrike.tsx
git commit -m "Rewrite Scene4 fleet positions with a real Pacific map and attack vector"
```

---

### Task 9: Full render and QC

**Files:** none (render + review only).

- [ ] **Step 1: Full render**

```bash
npx remotion render TranMidway out/TranMidway.mp4
```

- [ ] **Step 2: Run the QC pass**

Invoke the `tran-midway:qc-video` skill on `tran-midway/out/TranMidway.mp4` (same checklist as the prior QC pass: technical, audio-visual sync, visual style consistency, historical accuracy, pacing). Historical accuracy claims and VO are unchanged from the prior pass, so that section should not need re-fact-checking — focus the review on sections A/B/C/E (technical, sync, visual style, pacing) for the three rewritten scenes.

- [ ] **Step 3: Clean up temporary still-check images**

```bash
rm -f out/check-scene2-early.png out/check-scene2-late.png out/check-scene4-ships.png out/check-scene4-attack.png out/check-scene7-mid.png out/check-scene7-end.png
```

- [ ] **Step 4: Commit if the QC pass required no further fixes**

```bash
git add -A
git commit -m "Render Vox-style Scene2/4/7 update"
```

If the QC pass surfaces issues, fix them in the relevant scene file, re-render (Step 1), and re-run QC (Step 2) before this final commit.
