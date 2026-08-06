---
name: paper-cut-video-engine
description: Use when the user says "paper cut style", "paper-cut animation", "paper cutout video", "cutout animation", "paper stop-motion", "paper puppet", or asks for a complete rendered-and-QC'd video in this style, even if they never type those exact words. Takes a raw idea through to a rendered and QC'd Remotion video in paper-cut animation style (multi-layer paper cutouts, real paper texture, rough cut edges, jointed paper-puppet character rigs, stop-motion-style stepped/frame-hold motion, multiplane parallax camera). Scaffolds a fresh Remotion project folder FIRST, then does everything else (script, beats, layer-separated images, voice, SFX, rig code, render, QC) inside that folder. Supports 16:9, 9:16, or both (two separate render passes), and English or Vietnamese for script/voice/on-image text. Once one complete version exists, an additional language version can be added to the same project without starting over. Delegates scaffold/voice/SFX/QA/render/QC to the `video-pipeline` skill; handles paper-cut-specific parts itself (niche, script, image layer separation, joint rigging, paper texture/shadow, paper SFX) via Antigravity IDE's built-in image generation.
compatibility: "Requires the `video-pipeline` skill installed (coordinates scaffold/voice/SFX/QA/render/QC) plus its dependencies: remotion-best-practices, remotion-create, remotion-markup, video-qc (`/watch`), edge-tts (via generate-voiceover.py), ffmpeg/ffprobe. Paper-cut layer/rig/texture image discipline is self-defined by this skill (doesn't depend on `imagegen-remotion`, use it if installed for general plate-rule reference only). Requires running inside Antigravity IDE to use its built-in image generation (Gemini/Nano Banana) for real layer images; on another harness without this feature, connect an equivalent Gemini/Google Flow tool or do it manually (see 7e). Requires the parent `remotion-video/` directory to already have `WORKFLOW.md` + `scripts/generate-voiceover.py` + shared skills (one-time setup per `video-pipeline` Step 0.5)."
---

# Paper-Cut Video Engine

NOTE: ANY question in the states below, including simple ones like confirming a move to the next state, MUST use the button-style ask tool (AskUserQuestion / `ask_user_input_v0`) instead of plain text questions, so the user can tap instead of type. Standard pattern for a state-transition confirmation: 2 options ["Continue", "Stop, I need to adjust first"]. If a question has more than 4 choices (e.g. picking 1 of 10 ideas in STATE 3, or which state to redo in STATE 11), keep it as a plain numbered list for the user to type an answer to, since the tool caps at 4 options per question.

The tool also requires a MINIMUM of 2 options per question (a 1-item array is rejected outright). For a question that genuinely has only ONE reasonable value — open free text (e.g. naming the project in STATE 0) or the single remaining choice after elimination (e.g. STATE 12 when only one language is left undone) — do NOT skip AskUserQuestion and do NOT decide for the user. Always build exactly 2 options:
1. The specific suggested/default value (proposed slug, or the single remaining choice's name).
2. "Enter a different value" — for the user to type something else if they don't want the suggested default.
If the user picks option 2, follow up with a plain-text question so they can type the specific value. Don't invent a fake third option just to pad the count, and don't rely on the tool's built-in "Other" in place of this explicit option 2.

Up to 3 independent questions can be merged into a single tool call if they belong to the same state (see STATE 4). Never guess an answer on the user's behalf when a question is still ambiguous.

Linear state machine: STOP and WAIT for the user's answer after every state, never skip ahead. Don't use em dashes (use commas, colons, parentheses, or a plain hyphen).

**This skill's role**: create the Remotion project first (STATE 0), then every remaining step — style questions, niche, script, beat splitting, layer separation + image generation, voice generation, SFX, rig code, render, QC, thumbnails — happens INSIDE that project folder. The paper-cut-specific parts (niche, script, layer/rig/texture discipline) are handled by this skill itself; the scaffold/real-voice/SFX/QA/render/QC parts are coordinated by `video-pipeline`, with paper-cut-video-engine only supplying the right content/asset at the right step. If `video-pipeline` isn't installed, stop and tell the user to install it before entering STATE 0.

The final output is a rendered, QC-passed `.mp4` file plus 3 thumbnails, all inside `<new-video-name>/`.

## Paper-Cut DNA (keep in mind throughout, not a separate state)

**The material itself is the main character**: every scene should look like a real paper puppet/paper diorama placed in front of a camera, not sterile flat vector. It has paper texture (grain, subtle cardstock speckle), slightly rough/imperfect cut edges (torn/cut edge), soft cast shadow between overlapping paper layers to suggest physical depth. This is the OPPOSITE of the flat-vector-no-shadow style: paper-cut NEEDS soft shadow between layers, it doesn't forbid it.

**Voice**: keeps the same conversational, direct explainer spirit, grounded in concrete facts, claim → evidence → significance argument structure (see STATE 5 for detail). The paper-cut style doesn't change the tone of voice, only the visual language and motion.

**Visuals**: multi-layer paper cutouts (background/midground/character + each body part as its own separate layer), a fixed 3-4 color cardstock palette held constant for the whole video, NO gradient/gloss but DOES have cast shadow between layers and light paper texture. Characters are jointed paper puppets (head/torso/arms/legs are separate files, rotating around a pivot point), never a seamlessly morphing shape.

**Motion**: NOT smooth and continuous like modern motion graphics. The DNA is limited animation/stop-motion: hold a frame (frame-hold) for 2-3 frames per beat before jumping to the next position, joints rotate in discrete steps (stepped rotation) rather than continuous tweening, occasionally a slight shake/wobble simulating real paper being moved by hand. This is the direct OPPOSITE of flat-vector's "no frame-hold" rule: in paper-cut, frame-hold is the goal, not a bug.

**Multiplane camera**: paper layers at different depths move at different speeds/amplitudes during pan/zoom (the background layer moves slowest, the foreground layer fastest) to simulate the real 3D depth of a paper diorama placed in front of a camera.

**Kinetic subtitles (mandatory)**: same general principle applies, text appears in 2-3 word clusters synced to the voiceover, keywords get an accent color, rendered directly over the video (stroke/drop-shadow for enough contrast), NEVER inside a solid white background box. Text can optionally look like a separately stuck-on paper piece (die-cut letter) to push the style further, but this isn't required.

**Paper SFX, not generic whoosh**: rustle/crinkle for any layer/joint movement; scissor-snip for a sudden cut/reveal moment; page-flip for a big scene transition; paper-stamp/thump for an emphasis/decision moment. Detail in STATE 9.

## STATE 0, SCAFFOLD THE PROJECT FIRST (video-pipeline Step 0.5)

Propose a valid default slug (no accents, no spaces, e.g. `papercut-video-<yyyymmdd>`), then use AskUserQuestion: "Short name for this project (slug, no accents, no spaces)? You can rename/refine the content later once niche/idea are chosen in the next steps — this name is just to create the folder now." — options: ["Use `<proposed slug>`", "Enter a different name"]. If "Enter a different name" is picked, follow up in plain text for the user to type a slug.

Once named, run from the parent `remotion-video/` directory (fps defaults to 30, used throughout STATE 8 and STATE 10, don't change mid-project):
```bash
npx create-video@latest --yes --blank <new-video-name>
cd <new-video-name>
npx skills add remotion-dev/skills -g -y   # installs remotion-best-practices, remotion-create, remotion-markup used in STATE 10

mkdir -p .claude/skills .agents/skills scripts
cp ../WORKFLOW.md .
cp ../scripts/generate-voiceover.py scripts/
cp -r ../.claude/skills/video-pipeline ../.claude/skills/qc-video .claude/skills/
cp -r ../.agents/skills/video-pipeline ../.agents/skills/qc-video .agents/skills/
```

If the parent `remotion-video/` directory doesn't yet have `WORKFLOW.md`/`scripts/generate-voiceover.py`/shared skills, stop and tell the user that one-time setup is needed first (see `compatibility` in `video-pipeline/SKILL.md`).

From here on, EVERY file from later states (script, images, audio, code) lives inside `<new-video-name>/`, never created outside it.

End with AskUserQuestion: "Project created at `<new-video-name>/`. Continue?" — options: ["Continue", "Stop, I need to check the project first"].

STOP. WAIT.

## STATE 1, STYLE REFERENCE MATERIAL (optional)

If the parent `remotion-video/` directory already has `BRAND-GUIDE.md`, read it before asking — it contains the palette/font/motion/SFX/thumbnail formula already locked in from a prior video, use it as the default instead of the generic placeholder.

Use AskUserQuestion: "Do you have a brand guide / colors / fonts / reference video you want Claude to follow?" — options: ["Yes, I'll attach a file/link separately", "Use the channel default (BRAND-GUIDE.md if present, else original paper-cut: kraft brown, paper cream, deep red accent, light teal)"].

If "Yes" is picked, wait for the user's attachment, then read it and prioritize it over `BRAND-GUIDE.md`. If the default is picked: use `BRAND-GUIDE.md`'s exact palette/font/motion/SFX as-is if it exists, otherwise use the original paper-cut default (kraft brown, paper cream, deep red accent, light teal).

STOP. WAIT.

## STATE 2, NICHE

Use AskUserQuestion: "What category does today's video topic fall under?" — options: ["Politics & society", "Economy & technology", "History & culture", "Other / type a different topic"].

If "Other / type a different topic" is picked, let the user type a broad niche/topic freely (not a specific idea — specific ideas are generated in STATE 3).

This state ONLY locks in the broad niche/category, do NOT ask for a specific topic here.

STOP. WAIT.

## STATE 3, 10 IDEAS

Generate exactly 10 video ideas within the niche chosen in STATE 2. Each idea is ONE specific question the video will answer. No overlapping subtopics. Each idea needs a concrete hook (a stat, event, or place).

Output a numbered list 1-10, one idea per line, nothing else. End exactly with: "Pick a number, or describe a different topic." (kept as a plain list for the user to type a number, since it exceeds AskUserQuestion's 4-option cap.)

STOP. WAIT.

## STATE 4, LENGTH + FORMAT + LANGUAGE

Use AskUserQuestion, bundling 3 questions in ONE call:
1. "How long should the video be?" — options: ["1 minute", "3 minutes", "5 minutes", "8 minutes or longer (specify in your next message)"]
2. "Target format?" — options: ["Horizontal 16:9", "Vertical 9:16", "Both"] — determines the aspect ratio used in STATE 7. **Choosing both means running two independent passes from STATE 7 onward**, not stretching one shared image set.
3. "Output language?" — options: ["English", "Vietnamese"] — applies to the script (STATE 5), voice (STATE 8), every label/text in images and thumbnails (STATE 7, STATE 11).

If the project name from STATE 0 is only a placeholder/generic compared to the idea just chosen, ask a follow-up (separate AskUserQuestion, 2 options: ["Rename the folder to match the content", "Keep the current name"]), then `mv <old-name> <new-name>` inside `remotion-video/` if renaming is chosen.

STOP. WAIT.

## STATE 5, SCRIPT (EXPLAINER VOICE) + MANDATORY FACT-CHECK

Estimate at 2.5 words/second: 1 minute ≈ 150 words, 2 minutes ≈ 300, 3 minutes ≈ 450, 5 minutes ≈ 750, 8 minutes ≈ 1200. Tolerance: 5%.

Script rules:
1. Continuous narration, one prose block. No headers, no visual directions.
2. **The cold open MUST be a paradox/conflict/controversy, not a safe textbook-style setup.** The first 3-10 seconds are where the audience decides to stay or leave — open directly with a paradoxical question or a confrontational/controversial image in the very first sentence, then step back to explain context.
3. Conversational tone but with clear argument structure: raise the issue, give concrete evidence (stats, events), then draw a broader conclusion.
4. Short sentences, one idea per sentence (makes later beat-splitting easier). Rhetorical questions are fine to weave in.
5. Facts must be accurate, never invent numbers/names. If unsure, phrase around it.
6. No ads, no subscribe calls-to-action.
7. End on an expansive closing line, either a question left for the viewer or a sharp final observation.

Write the script in the exact language chosen in STATE 4. Web_search may return results in a different language; always rephrase claims into the script's language before adding them to the draft.

**Required before the script is considered done (matches `video-pipeline` Step 1, don't defer this to QC)**: every checkable claim (facts, proper names, dates, numbers) must be cross-checked via `web_search` right in this state. Clearly flag in the script any twist/ending that must be preserved later during scaffolding. Only move to STATE 6 once no known-false claim remains.

Save the script directly to `<new-video-name>/<video-name>-script.md` (the project already exists from STATE 0), organized by scene, with visual/audio/SFX/narration (matching `video-pipeline` Step 1's format).

Output format:
```
TARGET: [N] words / [length]
[script, one continuous block]
FINAL: [actual N] words
FACT-CHECK: [list of cross-checked claims + sources, or "no claims requiring verification"]
```
End with AskUserQuestion: "Script saved to `<video-name>-script.md`. Split into beats now?" — options: ["Continue to beat splitting", "Stop, I want to edit the script first"].

STOP. WAIT.

## STATE 6, BEAT SPLITTING (estimate, overwritten with real measurements in STATE 8)

Each beat covers roughly 2-3 seconds of narration (~5-8 words at 2.5 words/second). One short sentence = one beat; long sentences split at natural clause boundaries. Assign each beat an `id` like `vo_01`, `vo_02`... used throughout the following states (image layers, voice, SFX, Sequence).

Output a table: `id`, ESTIMATED start timecode (cumulative at 2.5 words/second, to be overwritten in STATE 8), the beat's exact wording. Append this table to `<video-name>-script.md` (append, don't overwrite the original script section).

End with AskUserQuestion: "Beats are split. Generate paper-cut images for each beat now?" — options: ["Continue to image generation", "Stop, I want to edit the beat table first"].

STOP. WAIT.

## STATE 7, PAPER-CUT IMAGE GENERATION (layer separation, via Antigravity IDE's image generation feature)

Save every image directly to `<new-video-name>/public/images/` (this folder already exists from the Remotion scaffold in STATE 0) — this is exactly the asset STATE 10 (code scaffolding) will use.

**If STATE 4 chose both formats (16:9 + 9:16)**: run 7a-7f as two independent passes, each with its own safe zone matching its ratio. Never reuse one layer set for both ratios. Save into two subfolders: `public/images/16-9/scene-<id>/` and `public/images/9-16/scene-<id>/`, each with its own manifest.

Labels (if a prompt needs a short 1-4 word label on a paper piece/stamp) are written in the exact language chosen in STATE 4; the rest of the prompt (SCENE, STYLE BLOCK, CLOSER) stays in English since it's an instruction to the image model.

### 7a. Paper-cut asset discipline (self-defined, additionally reference `imagegen-remotion` if installed)

- If the `imagegen-remotion` skill is already in the available skills list, treat its GENERAL rules (raw plate, no baked captions, aspect-ratio discipline) as mandatory; the paper-cut-SPECIFIC rules below always win on conflict (e.g. it forbids shadow, here shadow between layers is mandatory).
- If not installed, just apply the paper-cut rules in 7b-7d below, don't block progress waiting to install it.

Core rules (mandatory):
- 1 beat (`id` from STATE 6) = exactly 1 LAYER SET (not a single image), layer count depends on scene complexity (minimum: 1 background + 1 foreground; with a character: add one separate layer per rig part that needs independent rotation, e.g. head/torso/left-arm/right-arm/legs).
- Every layer is a "raw plate" for code: never bake text/captions/lower-thirds/fake logos into the image, text gets coded on top later in STATE 10 by Remotion.
- Every layer exports as a PNG with a transparent background, clean cut edges, so layers can stack in Remotion without exposing a rectangular background frame.
- A clear text-safe zone matching the aspect ratio chosen in STATE 4, computed on the full composite layout after stacking all layers.
- Motion-readiness: each layer set picks exactly 1 motion intent for the whole scene (multiplane pan / multiplane zoom / static hold for a title card) PLUS its own per-layer rig motion if there's a character (joints rotate in discrete steps, see STATE 7e animation spec).
- **Motion pacing must not be monotonous throughout the video**: if 3+ consecutive beats all use the same gentle multiplane pan, the audience gets bored. For a beat carrying an important stat/place, push the camera into a wide shot then spiral in on the specific point. For a run of rapid-fire beats (vote counting, listing numbers), shorten the frame-hold gap between steps to create a fast, punchy rhythm matching the voiceover.
- Cross-scene consistency: write one "style bible" ONCE, paste it verbatim at the top of every beat's prompt, only change the action/setting and per-layer portion.
- Aspect-ratio discipline: the whole project uses exactly the one ratio chosen in STATE 4.

### 7b. Style bible (write once before the first beat)

Lock in: recurring subject/character description if the video has a fixed character (including rig description: how many separate parts, the geometric proportions of each part so layers align correctly when assembled), the 3-4 color cardstock palette from STATE 1, lighting direction/mood, render style = paper-cut cutout (matches STYLE BLOCK below). Paste this verbatim into every beat's prompt.

### 7c. Plan the layer split for each beat (before writing prompts)

For each beat, list the layers to generate separately and their depth (multiplane depth, higher number = closer to camera):
```
Scene <id> — <beat name>
  layers:
    - id: bg          depth: 0   (static background, no rig)
    - id: mid-<object> depth: 1  (midground, may have its own motion)
    - id: char-torso  depth: 2   (character rig root, no pivot)
    - id: char-head   depth: 3   parentLayer: char-torso   pivot: neck
    - id: char-arm-l  depth: 3   parentLayer: char-torso   pivot: left shoulder
    - id: char-arm-r  depth: 3   parentLayer: char-torso   pivot: right shoulder
```
Only split into layers/rig when the beat genuinely needs joint motion or clear parallax; a simple static beat (title card, plain background scene) only needs 1-2 layers.

### 7d. Write the prompt for each layer (exactly 1 prompt/layer)

Structure per prompt: [style bible] + [this layer's own description, one central visual idea, clearly stating which layer in the set this is] + STYLE BLOCK + CLOSER.

**STYLE BLOCK (insert verbatim into EVERY prompt):**
```
Paper-cut cutout animation illustration in the style of stop-motion paper puppet dioramas: layered die-cut paper shapes with visible cardstock paper grain texture, slightly rough or irregular cut edges, soft drop shadow cast by this layer onto the layer behind it to suggest physical depth. Bold but limited color palette of 3 to 4 flat cardstock colors held consistent across the whole project (state the exact palette once, e.g. kraft brown, cream paper, deep red accent, muted teal). This image is a SINGLE ISOLATED LAYER on a transparent background, meant to be composited with other layers, not a complete scene by itself. If this layer is a character body part (head, torso, arm, leg), draw only that part, cleanly cut out, with a clear pivot point implied at the joint edge. Simple geometric character shapes without facial detail unless the beat needs a specific expression. Clean modern bold sans-serif type only where a label is specified. Poster-like composition, crisp die-cut paper edges. No baked-in captions, no fake lower-thirds, no fake logos or UI elements.
```

**CLOSER (insert verbatim at the end of EVERY prompt):**
```
The layer stays a physically plausible cutout of paper with visible grain and a soft cast shadow, built for multiplane camera motion and stop-motion-style stepped animation. NOT flat vector with zero shadow, NOT photorealistic, NOT painterly, NOT 3D render, no clutter, no watermark, no logos, no text beyond the specified label, transparent background required. Premium paper-cut explainer-video aesthetic, matching the project's fixed aspect ratio, ultra-detailed paper texture, crisp cut edges.
```

Save each layer file to `public/images/scene-<id>/<layer-id>.png` (if only one format), or `public/images/<16-9|9-16>/scene-<id>/<layer-id>.png` (if STATE 4 chose both). Include a manifest table for STATE 10's handoff (a separate manifest per format if there are two):
```
Scene <id> — <beat name> (estimated timecode from STATE 6, overwritten in STATE 8)
  layers:
    - id: <layer-id>
      asset: public/images/scene-<id>/<layer-id>.png
      depth: <0..n>
      pivot: <% coordinates if this is a rig joint, blank if not>
      parentLayer: <parent layer-id if this is a rig joint, blank if not>
  motion: <multiplane pan / multiplane zoom / static hold>
  text-safe: <area reserved for caption/kinetic typography>
```

Animation spec JSON (kept as the basis for `remotion-best-practices`/`remotion-create`/`remotion-markup` in STATE 10, NOT a standalone deliverable):
```ts
interface BeatAnimation {
  beatId: string;           // matches STATE 6 id, e.g. "vo_03"
  startFrame: number;       // overwritten with real measurement in STATE 8 (manifest.json, fps from STATE 0)
  durationFrames: number;   // overwritten with real measurement in STATE 8
  layers: {
    id: string;              // matches layer-id in the manifest above
    asset: string;
    depth: number;           // 0 = farthest (background), increasing = closer to camera, used for multiplane parallax
    pivot?: { xPct: number; yPct: number }; // rotation center if this layer is a rig joint
    parentLayer?: string;    // parent layer in the rig hierarchy
  }[];
  elements: {
    type: 'title-text' | 'icon' | 'chart' | 'map' | 'highlight-circle' | 'arrow' | 'stat-counter' | 'joint-rotation';
    enterAtFrame: number;
    motion: 'slide-left' | 'slide-up' | 'fade-scale' | 'draw-on' | 'count-up' | 'stepped-rotate' | 'stepped-hold';
    easing: 'easeOutCubic' | 'spring' | 'step-2fps' | 'step-3fps';
    label?: string;
    targetLayer?: string;    // used with type 'joint-rotation', matches a layer id
  }[];
}
```
Use `interpolate()` with `step-2fps`/`step-3fps` (quantize the frame before interpolating, e.g. `Math.floor(frame / holdFrames) * holdFrames`) for all layer/rig motion, do NOT use `spring()`/continuous tweening for physical motion (that's flat-vector DNA, not paper-cut). Continuous `spring()`/`interpolate()` is STILL used normally for kinetic subtitles (text must always stay smooth to read easily, never apply stepped motion to text).

### 7e. Call the real image-generation tool via Antigravity IDE

- Running in Antigravity IDE: use the IDE's built-in image generation (Gemini/Nano Banana) directly, calling it for each layer in strict order Scene 1 → Scene N, background layer before rig layers, no batching, no reordering.
- If the user has already said they want a different tool for this pass, prioritize that over the default.
- If running on a different harness without this feature: try any connected Gemini or Google Flow tool/connector available in the session; if none is available, export all prompts in beat/layer order to `public/images/prompts.txt` (one block per layer, numbered by `id`/`layer-id`, separated by a blank line), tell the user to paste each prompt themselves, download the images, and name them exactly `scene-<id>/<layer-id>.png` into `public/images/`. Once the user confirms it's done, verify the file count matches the layer count in the manifest before moving to 7f.

### 7f. Clarity check before handoff

1. Layer count per scene exactly matches the 7c plan, none merged, none missing?
2. Character/palette/paper texture/lighting consistent across every layer (matches the style bible)?
3. Every layer is the exact aspect ratio chosen, transparent background?
4. Every layer set has a clear text-safe zone, and NO caption/logo/fake UI baked in?
5. Rig layers have clean cut edges at the pivot point for natural rotation once assembled in Remotion?

If any answer is "no", regenerate just that broken layer, don't hand off the whole batch while one link is still broken.

End with AskUserQuestion: "Images are ready in public/images/. Generate real voice now?" — options: ["Continue to voice generation", "Stop, I want to review the images first"].

STOP. WAIT.

## STATE 8, REAL VOICE (handed off to video-pipeline Step 3)

Build a JSON file matching `video-pipeline` Step 3's exact format, one object per beat (`id` matching STATE 6/7), saved to `<new-video-name>/`:
```json
[
  {"id": "vo_01", "text": "<beat 1 exact text>", "voice": "en-US-GuyNeural"},
  {"id": "vo_02", "text": "<beat 2 exact text>", "voice": "en-US-GuyNeural"}
]
```

The voice must match the language chosen in STATE 4 (must not diverge from the STATE 5 script language). Use AskUserQuestion: "Male or female voice?" — options: ["Male", "Female"], then map:
- English: `en-US-GuyNeural` (male) or `en-US-AriaNeural` (female)
- Vietnamese: `vi-VN-NamMinhNeural` (male) or `vi-VN-HoaiMyNeural` (female)

Don't use ElevenLabs or msedge-tts (npm) — per `video-pipeline` rules, the `edge-tts` CLI via pip is the proven path.

Run from `<new-video-name>/`: `python3 scripts/generate-voiceover.py <file>.json --fps 30` (fps matches the Remotion project created in STATE 0) → produces `public/audio/vo/<id>.mp3` + `public/audio/vo/manifest.json` containing real `durationSec`/`durationInFrames` measured via ffprobe.

**Overwrite the STATE 6 beat table and the STATE 7d animation spec with the real measurements from `manifest.json`** — stop using the 2.5 words/second estimate from here on.

**Cross-check the real total duration**: sum `durationSec` across all beats in `manifest.json` and compare to the target length chosen in STATE 4. If the real total duration is off by more than ~15% from the target, use AskUserQuestion: "The actual video is [X]s, off from the [Y]s target. How to handle it?" — options: ["Go back to STATE 5 to edit/trim the script", "Keep the actual duration, no edits"]. If the drift is within an acceptable range, skip this and continue.

End with AskUserQuestion: "Voice is done with real durations. Generate SFX now?" — options: ["Continue to SFX generation", "Stop, I want to listen to the voice first"].

STOP. WAIT.

## STATE 9, PAPER SFX (handed off to video-pipeline Step 4)

Paper-cut uses restrained SFX but always keeps a paper-texture feel underneath, unlike flat-vector's clean whoosh. Map by moment type:
- **rustle/crinkle** (light, short and continuous): any layer/joint moving or rotating (motion `stepped-rotate`, multiplane pan/zoom).
- **scissor-snip** (short, sharp): a sudden new detail reveal, fast cut-in, motion `fade-scale` on a beat with a twist/highlight.
- **page-flip** (paper whoosh): a big scene transition between two beats with very different settings, replaces a plain whoosh.
- **paper-stamp/thump** (weighty): decision/hearing/verdict/vote moments, use just 1-2 times at the climax, don't overuse, replaces a gavel strike.
- **rising paper flutter**: extended conflict/waiting/countdown beats, ramp tempo with the voiceover then cut abruptly when the tension resolves, replaces clock ticking (keeps the same suspense feel but with a paper texture instead of metal).
No SFX needed for a plain static hold, unless the beat opens or closes the video, or falls into one of the 4 types above.

The default library in `public/audio/sfx/` (whoosh, skedaddle, triggered, record-scratch, wilhelm-scream, bruh) is true-crime/dramatic-toned SFX, does NOT fit paper-cut, avoid it unless the user explicitly asks. rustle/crinkle/scissor-snip/page-flip/paper-stamp usually AREN'T in the default library, find/download free files (WebFetch a free-SFX source) and save them to `public/audio/sfx/` before use.

Place SFX at the exact frame based on the real `manifest.json` from STATE 8, never approximate. Trim/fade with `ffmpeg -af "afade=t=out:st=..:d=.."` if a file runs longer than the moment it should punctuate.

End with AskUserQuestion: "SFX placement is done. Build code and render now?" — options: ["Continue to code building", "Stop, I want to adjust SFX first"].

STOP. WAIT.

## STATE 10, BUILD CODE + QA + RENDER + QC (handed off to video-pipeline Steps 2, 5, 6, 7)

Call `remotion-best-practices` as the router (leads to the right `remotion-create` + `remotion-markup`). If clear aesthetic direction is needed, also call `frontend-design`. Inputs for this step: image layers in `public/images/` (STATE 7), the animation spec JSON (STATE 7d, timing overwritten with real values in STATE 8), audio in `public/audio/vo/` + manifest.json (STATE 8), SFX in `public/audio/sfx/` (STATE 9). All of it already sits inside `<new-video-name>/` from STATE 0.

Follow `video-pipeline`'s loop exactly:
1. **Step 2**: install missing packages via `npx remotion add <pkg>` before use, keep the color/font theme in one file. The Composition uses the exact fps=30 locked in STATE 0, and `durationInFrames` comes from the TOTAL real frame count in `manifest.json` (STATE 8).
   - **Layer/rig component**: render each layer with `<Img>`, `transform-origin` set to its `pivot` (if any), and `transform: rotate(...)` driven by a frame quantized via `step-2fps`/`step-3fps` (do NOT use continuous `spring()` for rig rotation). Child layers (`parentLayer`) nest inside their parent layer's wrapper so rotation compounds correctly like a real paper puppet's physics (rotating the shoulder carries the whole arm with it).
   - **Multiplane parallax**: each layer shifts according to its `depth` when the camera pans/zooms — higher `depth` shifts with a larger amplitude (`translateX = baseOffset * depth * parallaxFactor`), `depth: 0` stays nearly still.
   - **Paper texture + shadow**: overlay a light noise/grain layer (SVG `feTurbulence` or a pre-made PNG grain) with `multiply` blend-mode at low opacity on each layer, plus a light `filter: drop-shadow(...)` between layers to keep the real paper-on-paper feel, without heavy processing.
   - **Subtitle component must be kinetic**: split each beat's `text` into 2-3 word clusters, use continuous `interpolate()`/`spring()` (NOT stepped) keyed on `frame` to reveal each cluster in sequence within the beat's `durationInFrames`. Keywords get a distinct accent color within the same span. Render text directly over the video (text-shadow/stroke for enough contrast), NEVER wrapped in a fixed solid-background box.
   - **Motion pacing must not be monotonous**: for a scene with `type: 'map' | 'chart' | 'stat-counter'` carrying a key stat/place, use a camera zoom-out then zoom-in-on-the-specific-point pair. For a run of consecutive beats with the same rapid-fire data type, shorten `holdFrames` (frames held per stepped step) to create a fast, punchy rhythm matching the voiceover.
2. **Step 5 (visual QA)**: `npx remotion still <CompId> /tmp/check.png --frame=<n>` at several points, read the image with the Read tool against paper-cut expectations (visible paper texture, shadow between layers, cut edges, not sterile-flat), `npx tsc --noEmit && npx eslint src` after each batch of fixes.
3. **Step 6 (render)**: check sync on a short segment first (`npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>`), verify the rig rotates in a stepped rhythm rather than drifting smooth like flat-vector by mistake. If STATE 4 chose both formats, this means 2 separate Compositions → full render produces 2 files: `out/<Name>-16x9.mp4` and `out/<Name>-9x16.mp4`.
4. **Step 7 (QC)**: call `video-qc` (`/watch out/<file>.mp4`) for each rendered file, including both if there are two formats.

**If QC returns ⚠️/❌ related to visuals/paper-cut style** (wrong palette, missing texture/shadow, motion accidentally smooth like flat-vector, rig layers exposing their background frame): go back to STATE 7, regenerate just the broken layer via Antigravity IDE, don't redo the whole batch. **If it's something else** (animation code, audio sync, layout): follow `video-pipeline` Step 8 exactly (vague feedback → ask the user again via AskUserQuestion, multiple issues at once → call `superpowers:brainstorming` before batch-fixing), then loop back through Steps 5-7 until QC passes.

End with AskUserQuestion: "Video is rendered and QC-passed at out/<Name>.mp4 (or both files if STATE 4 chose two formats). Generate 3 thumbnails now?" — options: ["Continue to thumbnails", "Stop, I want to watch the video first"].

STOP. WAIT.

## STATE 11, THUMBNAILS

Generate 3 thumbnail prompts, each its own independent block, paper-cut style pushed louder for small sizes:
- One paper cutout subject filling most of the frame, clear cast shadow, paper texture visible even at small size.
- 1-2 blocks of text that look like stuck-on die-cut paper (torn/cut edge, clear drop-shadow), max 3 words per block, the video's hook keywords, written in the exact language chosen in STATE 4.
- One highlight device (circle/underline/arrow) cut from red or yellow paper from the project's palette.
- Flat cardstock background, one of the project's primary colors, high contrast, no small detail that dies at 200px size.
- Same STYLE BLOCK and CLOSER as STATE 7d, swapping "no text beyond the specified label" for "no text beyond the specified thumbnail words", and allow the thumbnail to be a full composite (no need for a separate transparent layer split like a regular plate).

If STATE 4 chose both formats, generate two separate sets of 3 thumbnails (one 16:9, one 9:16).

Generate via Antigravity IDE per the same mechanism as 7e, save to `<new-video-name>/public/thumbnails/` (or `public/thumbnails/16-9/` + `public/thumbnails/9-16/` for two formats). This is the final deliverable, alongside the `.mp4` from STATE 10.

End with AskUserQuestion: "Done: video rendered, QC-passed, with 3 thumbnails, all inside `<new-video-name>/`. What next?" — options: ["Start a new video", "Add another language version of this video", "Redo a step", "Finish here"].

If "Add another language version" is picked, move to STATE 12. If "Redo a step" is picked, follow up (plain text, since there are more than 4 states so it won't fit AskUserQuestion) asking which state to redo, then return to that exact state.

STOP. WAIT.

## STATE 12, ADD ANOTHER LANGUAGE VERSION (optional, runs after at least 1 complete version exists)

Only reuse the language-independent parts (chosen niche/idea, paper-cut image layers in `public/images/`, animation spec, rig, SFX types), do NOT redo States 1-4/7 from scratch — only translate content and regenerate the language-dependent parts.

If the project only supports 2 languages (English/Vietnamese) and STATE 4 already picked one, the remaining language is the only sensible default. Still use AskUserQuestion: "Add which language version?" — options: ["Use `<remaining language>`", "Enter a different language"]. If there genuinely are 2+ languages not yet done, the options are that full list.

### 12a. Translate the script (don't rewrite from scratch)

Translate `<video-name>-script.md` (STATE 5) verbatim into the new language, preserving meaning, preserving any flagged twist/ending, preserving the exact beat count and `id`s so the timing table still maps 1-1. Save as `<video-name>-script-<lang>.md` (a separate file, don't overwrite the original). No need to re-fact-check since content/claims don't change.

### 12b. Check layers for old-language baked labels

Since paper-cut discipline forbids baked captions, layers usually contain NO text besides a short 1-4 word label (if any). Check the STATE 7 manifest table: if any layer used a label in the old language, regenerate just that layer (via Antigravity IDE, per the 7e mechanism) with the new-language label, saved to `public/images/<lang>/scene-<id>/<layer-id>.png` (only labeled layers need a separate version, unlabeled layers and the entire geometric rig can be shared).

### 12c. Real voice for the new language (as in STATE 8)

Build a new JSON from the translated script (12a), voice mapped to the new language, ask voice gender via AskUserQuestion as in STATE 8. Run `generate-voiceover.py` with the same fps locked in STATE 0, output to `public/audio/vo/<lang>/` + its own `manifest.json`. Cross-check the real total duration against the target length as in STATE 8.

### 12d. SFX + Composition + render + QC for the new language

SFX follows the same STATE 9 logic, just retimed against the new `manifest.json` from 12c. In STATE 10: create one more Composition for the new language (reusing the original layers + any labeled layers from 12b, new audio from 12c), render to `out/<Name>-<lang>.mp4` (doubled if the project has both 16:9/9:16 formats), QC via `video-qc` as normal.

### 12e. Thumbnails for the new language

Regenerate the 3 thumbnails (STATE 11) with text in the new language, saved to `public/thumbnails/<lang>/`.

End with AskUserQuestion: "Added a `<lang>` version at out/<Name>-<lang>.mp4. What next?" — options: ["Add another language", "Start a new video", "Finish here"].

STOP. WAIT.
