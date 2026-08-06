// ponytail: one-off generator, run manually to (re)produce public/images/layers/prompts.json from public/images/prompts.json
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const source = JSON.parse(readFileSync("public/images/prompts.json", "utf-8"));

const PREAMBLE =
  "Paper cut-out animation illustration in the style of layered handcrafted paper art: multiple layers of cut paper stacked to create depth, soft directional drop shadows between layers (simulating light through real paper), slightly imperfect torn or cut edges with visible paper grain texture, generous negative space reserved for kinetic-typography overlay. Bold but limited color palette held consistent across the whole project: kraft brown (#c8a876), cream (#f5ecd9), terracotta red (#c0453a), deep navy (#1b2a4a), mustard yellow (#e0a831) accent. Simple geometric character silhouettes cut from paper, without facial detail unless the beat needs a specific expression. Editorial infographic elements built from paper layers where relevant: simplified maps, bar or line charts, icons, timeline bars, arrows, circles used as highlight devices. Clean modern bold sans-serif type only where a label is specified. Poster-like layered composition, tactile handcrafted feel. No baked-in captions, no fake lower-thirds, no fake logos or UI elements. Format: horizontal 16:9 composition.";

const CLOSER =
  "The composition stays layered, tactile, and editorial with generous negative space, built for smooth kinetic-typography motion. NOT photorealistic, NOT flat vector, NOT 3D render, NOT gradient-heavy digital illustration, no clutter, no watermark, no logos, no text beyond the specified label. Premium paper-cut stop-motion-inspired explainer aesthetic, matching horizontal 16:9 aspect ratio, ultra-detailed paper texture and layered shadow depth.";

function extractSubject(prompt) {
  const start = "Format: vertical 9:16 composition. ";
  const end = " The composition stays layered";
  const i = prompt.indexOf(start);
  const j = prompt.indexOf(end);
  if (i === -1 || j === -1) throw new Error("prompt shape mismatch, cannot extract subject");
  return prompt.slice(i + start.length, j);
}

const out = {};
for (const [id, { prompt }] of Object.entries(source)) {
  const subject = extractSubject(prompt);

  out[`scene-${id}-bg`] = {
    prompt: `${PREAMBLE} BACKGROUND LAYER ONLY. Scene context: ${subject} Render ONLY the environment and setting implied by that scene (sky, ground, gradient paper panels, secondary scenery, ambient layered paper texture) — do NOT include the main subject, characters, maps, icons, or foreground objects described above, leave that space as clean negative space for a separate cutout layer to be composited on top. ${CLOSER}`,
  };

  out[`scene-${id}-fg`] = {
    prompt: `${PREAMBLE} FOREGROUND CUTOUT LAYER ONLY. Subject: ${subject} Render ONLY these subject/foreground paper-cutout elements, isolated on a fully transparent background (alpha channel PNG, no scene, no ground, no sky, no texture or color behind them), positioned and scaled as they would sit in the original composition, casting only their own internal layered paper drop shadow. ${CLOSER}`,
  };
}

mkdirSync("public/images/layers", { recursive: true });
writeFileSync("public/images/layers/prompts.json", JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${Object.keys(out).length} layer prompts (${Object.keys(source).length} scenes x 2)`);
