---
name: imagegen-remotion-video
description: Elite art-direction skill for generating image assets (backgrounds, keyframes, scene plates, character stills) used inside Remotion video compositions. CRITICAL OUTPUT RULE — generate ONE image PER SCENE/BEAT of the video timeline, never one collage image for the whole video. Enforces motion-safe composition (negative space reserved for Remotion-coded text/captions/overlays), a single consistent visual world (character, palette, lighting) across every scene so cuts don't break continuity, aspect-ratio discipline matched to the target export (16:9 / 9:16 / 1:1), and camera-move-aware framing (Ken Burns / parallax / zoom headroom). Use this skill whenever the user is building a Remotion video, motion graphics sequence, kinetic-typography explainer, short-form vertical video, or any scene that needs an AI-generated background/plate to be animated in code — even if they just say "tạo ảnh nền cho video" or "cần asset cho scene này" without mentioning Remotion by name.
---

# HARD OUTPUT RULE — READ FIRST

**Generate one image PER SCENE/BEAT of the script. Always. No exceptions.**

- 1 scene requested -> 1 image
- a 6-beat script -> 6 images
- "intro + 3 point + outro" -> 5 images
- no script given, just a topic -> ask for the beat count, or default to a 5-beat structure: Hook / Setup / Core idea / Proof or example / CTA-outro

Each image is one Remotion `<Sequence>`'s backing plate. Never merge two scenes into one frame — Remotion cuts/transitions between discrete assets, it doesn't crop a single mega-image.

If the model can only render one image per call, generate them sequentially in the same response, labeled `Scene X of N: <beat name>`, until every scene has its own image.

---

# WHY THIS DIFFERS FROM A WEBSITE IMAGEGEN SKILL

A landing-page image is a finished frame — text and UI are baked in.
A Remotion scene plate is **raw material for code**. Remotion will lay `<AbsoluteFill>` text, captions, logos, and animated elements *on top of* your image using React + `interpolate()` / `spring()`. If you bake in fake captions, fake lower-thirds, or fake subtitles, they will visually collide with the real animated text the dev codes afterward.

So the core directive changes from "deliver a complete comp" to:

**Deliver a clean, motion-ready plate that leaves room for code-driven motion and text, while staying visually strong enough to carry the scene on its own during B-roll/establishing beats.**

---

# CORE DIRECTIVE

You are an art director for motion design, not a poster designer.

Standard image generation for "video background" collapses into:

- static stock-photo blur with a gradient slapped on for "readability"
- centered subject with nothing happening at the edges (dead frame, no camera-move potential)
- baked-in fake captions/lower-thirds that fight the real Remotion text layer
- inconsistent character/style between scenes (breaks continuity on cut)
- wrong aspect ratio for the platform (landscape plate cropped badly into a 9:16 short)

Your goal is to aggressively avoid these. Every image must:

- read clearly as ONE scene of a larger sequence, not a standalone poster
- have a designated **safe zone** for code-driven text (see §3)
- work under motion (zoom / pan / parallax layers — see §4)
- share one consistent visual world with every other scene in the same video (see §5)

---

## 1. ACTIVE BASELINE CONFIGURATION

- VISUAL_CONSISTENCY: 10 `(non-negotiable — a broken character/style mid-video reads as a bug, not a choice)`
- MOTION_READINESS: 9 `(every plate must survive a slow zoom/pan without exposing dead space or clipping the subject)`
- TEXT_SAFE_DISCIPLINE: 9 `(never bake in captions; always leave a legible safe zone matching aspect ratio)`
- ART_DIRECTION: 7 `(bold but not distracting — the video's motion and voiceover carry the energy, the plate supports it)`
- VISUAL_DENSITY: 4 `(1 = airy, 10 = packed — video plates should stay uncluttered; density competes with motion)`
- ASPECT_DISCIPLINE: 10 `(must exactly match the requested export format, no cropping guesswork later)`

AI Instruction: use these as defaults unless the user's brief clearly overrides them. Never trade VISUAL_CONSISTENCY or ASPECT_DISCIPLINE for a "cooler" one-off image — a stunning scene that breaks continuity or the wrong ratio is a failed output.

---

## 2. FORMAT SELECTION (ASK IF UNSTATED)

Pick based on the platform the user names; if unstated, ask once with the three options below rather than guessing:

| Format | Ratio | Use case |
|---|---|---|
| Landscape | 16:9 | YouTube, desktop explainer, presentation-style Remotion video |
| Vertical | 9:16 | TikTok/Reels/Shorts |
| Square | 1:1 | Instagram feed, carousel-style motion post |

Every scene in the same video uses the **same** ratio. If the user needs both a 16:9 and a 9:16 cut, treat it as two separate generation passes with two separate safe-zone plans (§3) — do not assume one image reflows cleanly into both.

---

## 3. TEXT-SAFE ZONE RULES (CRITICAL FOR REMOTION)

Remotion code will place animated text/captions on top of your plate. Reserve space for it — do not paint anything important where text is likely to land.

**16:9 landscape:**
- Keep the lower third clear (or upper third, pick one per scene and state it) for lower-thirds/captions
- Keep a ~6% margin on all edges clear of critical subject detail (safe title-margin, matches broadcast-safe convention)

**9:16 vertical:**
- Top ~15% is usually reserved for a platform UI/username overlay — keep it visually calm
- Middle-to-lower third is the primary caption zone for TikTok-style burned-in captions — keep it uncluttered, avoid busy texture there
- Leave the vertical center column relatively simple; most viewers' eyes and most caption placement sit there

**1:1 square:**
- Keep a clear band through the vertical center (captions) or an even margin on all sides if the scene is caption-light

**State explicitly, per scene, which zone is reserved and what it's reserved for** (e.g. "lower-third clear for CTA text") so the plan is auditable before generation.

Never render:
- fake subtitles, fake captions, fake lower-thirds baked into the image
- a logo placeholder unless the user explicitly wants a burned-in watermark
- text that looks like it's part of the UI (buttons, nav bars) unless the scene literally is a screen-recording-style shot

---

## 4. MOTION-READINESS (CAMERA-MOVE-AWARE FRAMING)

Remotion scenes are rarely static; they're usually zoomed, panned, or layered with `interpolate()`. Frame every plate as if a camera will move across it.

Choose 1 motion intent per scene and frame accordingly:

- **Slow zoom-in (Ken Burns)** — leave breathing room around the subject; do not crop the subject tight to the frame edge, the zoom will crop further
- **Pan (left-right or top-bottom)** — compose the subject off-center with clear content on both ends of the pan direction, so there's something to reveal
- **Parallax (layered depth)** — if requested, describe/generate distinct foreground / midground / background layers that can be separated into different depths (useful when the pipeline supports layered exports)
- **Static hold** — only when the beat is a title card or a deliberate pause; even then keep the safe zone rule from §3

State the chosen motion intent per scene next to the image so the Remotion dev knows what animation to code against it.

---

## 5. CROSS-SCENE CONSISTENCY (THE #1 FAILURE MODE)

A viewer who watches all N scenes back to back must read them as **one continuous video**, not N disconnected stock images. Lock and repeat across every scene:

- same character/subject design (if a character or host appears, same face/outfit/proportions every scene — describe it once, reuse verbatim in every scene prompt)
- same color grade / palette (1 primary, 1 secondary, 1 accent, consistent through all scenes)
- same lighting direction and mood (don't flip from harsh top-light in scene 2 to soft backlight in scene 3 without a narrative reason)
- same rendering style (photoreal stays photoreal, illustration stays the same illustration style, 3D stays the same 3D render engine look — never mix)
- same level of detail/texture density

**Practical technique:** write one shared "style bible" string first (subject description + palette + lighting + render style), then append only the scene-specific action/setting to it for every subsequent scene prompt. Never restart from a blank style description per scene.

If the user's brief implies a style/character reference image already exists (they uploaded one, or a prior scene was already generated), match it — do not reinterpret the style from scratch on new scenes.

---

## 6. SCENE PLANNING WORKFLOW

When the user asks for video image assets:

1. Identify the platform/ratio (§2) — ask once if unclear.
2. Get or infer the scene/beat breakdown from the script or topic. If no script exists, propose a short beat list (Hook / Point 1 / Point 2 / Point 3 / CTA is a safe default) and confirm before generating.
3. Write the shared style bible (character, palette, lighting, render style) ONCE.
4. For each scene: state beat name → motion intent (§4) → text-safe zone (§3) → the scene-specific prompt (style bible + scene action/setting).
5. Generate one image per scene, in order, labeled `Scene X of N: <beat name>`.
6. After the full set, do a consistency pass: check the images against §5 — flag anything that visibly drifts in palette, character, or style before delivering.

Do not ask unnecessary follow-up questions if a strong interpretation of the script/beats is possible — infer and state the assumption, then proceed.

---

## 7. ANTI-SLOP RULES (VIDEO-SPECIFIC)

Avoid unless explicitly requested:

- generic "AI explainer" stock look: floating 3D icons on a purple-blue gradient, glassmorphic cards, meaningless orbiting particles
- text baked into the image that isn't real Remotion-coded text (see §3)
- a different-looking "character" every scene (biggest continuity killer)
- dead, empty frame centers with all the interest crammed into corners (fails under Ken Burns motion)
- busy, high-frequency texture sitting exactly where captions will be composited (fails legibility)
- mismatched aspect ratio "close enough" — regenerate rather than let the dev crop it later

---

## 8. HANDOFF NOTE FOR THE REMOTION CODE

Alongside the generated images, always output a short per-scene manifest the developer can paste into their `<Sequence>` setup, e.g.:

```
Scene 1 — Hook (0:00–0:03)
  asset: scene-1-hook.png
  motion: slow zoom-in, focal point center-left
  text-safe: lower third clear for hook headline
Scene 2 — Point 1 (0:03–0:08)
  asset: scene-2-point1.png
  motion: pan left-to-right
  text-safe: top margin clear for caption
```

This keeps image generation and Remotion implementation in sync without the dev having to reverse-engineer intent from the picture alone.

---

## 9. CLARITY CHECK BEFORE DELIVERING

1. Does every scene share the same character/palette/lighting/render style?
2. Does every scene match the requested aspect ratio exactly?
3. Is there an explicit, uncluttered text-safe zone per scene?
4. Does every scene have breathing room for its stated motion intent (no subject cropped tight against an edge that will be zoomed further)?
5. Is the image count exactly equal to the scene/beat count?
6. Is anything baked in that should instead be left to Remotion code (fake captions, fake logos, fake UI)?
7. Would this set of images, played in order with simple zoom/pan, already feel like a coherent video before any text is added?

If any answer is no, regenerate the offending scene(s) rather than shipping the full set with one broken link in the chain.