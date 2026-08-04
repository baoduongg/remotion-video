# Vox-style motion graphic layer — Scene 2, 4, 7

## Goal

Redesign `TranMidway.mp4`'s data/map scenes (Scene2 timeline, Scene4 fleet
positions, Scene7 casualty stats) to read like Vox-style explainer motion
graphics — real animated maps, draw-on lines, counting numbers — layered on
top of the existing painterly AI-gen background art. Script and VO are
unchanged; this is a visual-only pass.

## Scope

In scope: Scene2Context, Scene4FirstStrike, Scene7Aftermath, plus the shared
components they need.

Out of scope: Scene1, Scene3, Scene5, Scene6, Scene8 keep their current
painterly + Ken Burns treatment. Revisit after this batch is reviewed.

## Approach

Hybrid: keep the painterly background images as atmospheric backdrop, add a
Vox-style motion graphic layer on top (real geographic map, draw-on paths,
animated counters) rather than replacing all art with flat vector illustration.
Chosen over a full flat-vector rebuild (too much new asset work for one video)
and over a pure overlay-only approach with no real geography (loses the
biggest Vox signature: an accurate animated map).

## New shared components (`src/vox/`)

- **`PacificMap.tsx`** — real map via `d3-geo` + `world-atlas` topojson
  (110m resolution, imported at build time, no runtime fetch). Projection
  rotated so the antimeridian doesn't split the Pacific view. Exports
  `<PacificMap>` (renders landmass path, tinted to match the existing
  parchment/navy palette) and `useProjectPoint(lat, lon) -> [x, y]` for
  placing markers/icons at real coordinates within the SVG viewBox.
- **`DrawOnPath.tsx`** — wraps `@remotion/paths` to animate
  `stroke-dashoffset` over a given frame range, for timeline connector lines
  and attack-vector arrows.
- **`AnimatedCounter.tsx`** — interpolates a number from 0 to a target value
  over a frame range, formatted with `toLocaleString('vi-VN')`.
- Icons: reuse `ShipIcon` / `PlaneIcon` / `SubmarineIcon` from `icons.tsx`.
  Add new icons only if a scene turns out to need a shape that doesn't exist
  yet — not speculatively.

## Dependencies to add

`@remotion/paths` (pinned to `4.0.505` to match the rest of the Remotion
monorepo), `d3-geo`, `topojson-client`, `world-atlas`.

## Per-scene changes

### Scene7Aftermath (first — lowest risk)

Replace the static `japanText` / `usText` strings with `<AnimatedCounter>`,
driven by the `grow` frame values that already exist in `ROWS`. Bar-width
animation is unchanged. Purpose: validate the counter component in a real
render before touching the two map scenes.

### Scene2Context

Replace the static painterly map background with `<PacificMap>` (tinted to
the current sepia/parchment tone). Plot Pearl Harbor / Tokyo / Coral Sea /
Midway at their real coordinates via `useProjectPoint`. Replace the static
yellow timeline connector with `DrawOnPath` so it draws left-to-right in sync
with each date reveal (existing date/label fade-slide animation is kept as
is).

### Scene4FirstStrike

Replace the static fleet-position illustration with `<PacificMap>` zoomed to
the Midway sector. Place Japanese (Kido Butai, northwest of Midway) and US
(TF16/17, northeast) carriers at approximate historical coordinates using the
existing ship icons with a scale+fade entrance. Draw Torpedo Squadron 8's
attack vector with `DrawOnPath`. Decide during implementation whether the
current dogfight illustration stays as an inset "moment" cutaway or is
dropped — depends on how the map reads on its own.

## Verification

No test framework in this project, and none is being added for one video's
visuals. Verification is: render sample stills per touched scene with
`npx remotion still` at a few frames and check by eye that coastlines and
markers land in the right place before committing to a full render (same
approach as the prior QC pass).

One narrow exception: `useProjectPoint`'s lat/lon → x/y projection math is
pure and easy to get wrong (rotation/centering). Add one small assert-based
check (e.g. Midway at 28.2°N, 177.4°W should project near canvas center,
since the projection is centered there) — not a full test suite, just the one
runnable sanity check for the one piece of non-trivial logic.
