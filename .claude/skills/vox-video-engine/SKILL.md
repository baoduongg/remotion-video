---
name: vox-video-engine
description: Use when the user says "Vox style", "Vox-style video", "explainer video", "animated opinion essay", or asks for a full rendered-and-QC'd video in this style, even if they never type the word "Vox". Takes a raw idea through to a rendered and QC'd Remotion video in the Vox style (flat 2D vector, kinetic typography, "animated opinion essay"). Scaffolds a fresh Remotion project folder FIRST, then does everything else (script, beats, images, voice, SFX, code, render, QC) inside that folder. Supports 16:9, 9:16, or both (two separate render passes), and English or Vietnamese for script/voice/on-image text. Once one complete version exists, an additional language version can be added to the same project without starting over. Delegates scaffold/voice/SFX/QA/render/QC to the `video-pipeline` skill; handles Vox-specific parts itself (niche, Vox-voiced script, images per imagegen-remotion discipline via Antigravity IDE's built-in image generation).
compatibility: "Requires the `video-pipeline` skill installed (coordinates scaffold/voice/SFX/QA/render/QC) plus its dependencies: remotion-best-practices, remotion-create, remotion-markup, video-qc (`/watch`), edge-tts (via generate-voiceover.py), ffmpeg/ffprobe. Requires the `imagegen-remotion` skill for image discipline. Requires running inside Antigravity IDE to use its built-in image generation (Gemini/Nano Banana) for real images; on another harness without this feature, connect an equivalent Gemini/Google Flow tool or do it manually (see 7d). Requires the parent `remotion-video/` directory to already have `WORKFLOW.md` + `scripts/generate-voiceover.py` + shared skills (one-time setup per `video-pipeline` Step 0.5)."
---

# Vox Video Engine

NOTE: ANY question in the states below, including simple ones like confirming a move to the next state (formerly "type 'next'"), MUST use the button-style ask tool (AskUserQuestion / `ask_user_input_v0`) instead of plain text questions, so the user can tap instead of type. Standard pattern for a state-transition confirmation: 2 options ["Continue", "Stop, I need to adjust first"]. If a question has more than 4 choices (e.g. picking 1 of 10 ideas in STATE 3, or which state to redo in STATE 11), keep it as a plain numbered list for the user to type an answer to, since the tool caps at 4 options per question.

The tool also requires a MINIMUM of 2 options per question (a 1-item array is rejected outright). For a question that genuinely has only ONE reasonable value — open free text (e.g. naming the project in STATE 0) or the single remaining choice after elimination (e.g. STATE 12 when only one language is left undone) — do NOT skip AskUserQuestion and do NOT decide for the user. Always build exactly 2 options:
1. The specific suggested/default value (proposed slug, or the single remaining choice's name).
2. "Enter a different value" — for the user to type something else if they don't want the suggested default.
If the user picks option 2, follow up with a plain-text question so they can type the specific value. Don't invent a fake third option just to pad the count, and don't rely on the tool's built-in "Other" in place of this explicit option 2.

Up to 3 independent questions can be merged into a single tool call if they belong to the same state (see STATE 4). Never guess an answer on the user's behalf when a question is still ambiguous.

Linear state machine: STOP and WAIT for the user's answer after every state, never skip ahead. Don't use em dashes (use commas, colons, parentheses, or a plain hyphen).

**This skill's role**: create the Remotion project first (STATE 0), then every remaining step — style questions, niche, script, beat splitting, image generation, voice generation, SFX, code, render, QC, thumbnails — happens INSIDE that project folder; no step creates a loose file outside it. The Vox-specific parts (niche, script voice, `imagegen-remotion` image discipline) are handled by this skill itself; the scaffold/real-voice/SFX/QA/render/QC parts are coordinated by `video-pipeline`, with vox-video-engine only supplying the right content/asset at the right step. If `video-pipeline` isn't installed, stop and tell the user to install it before entering STATE 0.

The final output is a rendered, QC-passed `.mp4` file plus 3 thumbnails, all inside `<new-video-name>/`.

## Vox DNA (keep in mind throughout, not a separate state)

**Joe Posner principle (Vox founding producer)**: the video is an "animated opinion essay". No desk shots, no talking-head interviews as the backbone. All visuals are motion graphics/illustration, never live-action footage.

**Voice**: conversational, direct, can say "we" or open with a rhetorical question as a hook, but still grounded in concrete facts (numbers, names, years). Warmer and closer than true-crime, but still has clear argument structure (claim → evidence → significance).

**Visuals**: flat 2D, no gradients, no drop shadows, no gloss. A fixed 3-4 color palette held constant for the whole video. Kinetic typography, highlighter/circle emphasis devices, simplified maps and charts, geometric illustrated characters without facial detail unless expression is needed.

**Kinetic subtitles (mandatory, not optional)**: text appears in 2-3 word clusters synced to the voiceover's rhythm, NEVER the whole sentence dumped at once inside a fixed white box. Keywords (numbers, proper names, places, conclusions) are colored with an accent (yellow/red) distinct from regular text. Text renders directly over the video (with enough stroke/drop-shadow contrast to stay readable), never inside a solid-background rectangle — a white background box hides the graphics and reads slower than kinetic type. Apply this from STATE 7c (animation spec) onward and code it in STATE 10.

**Rich, moment-specific SFX, not just whoosh**: whoosh for transitions/pans/flythroughs; short dry pop/click for icons/stats/flags/stamps appearing; gavel strike for decision/vote/verdict moments; rising clock ticking for waiting/conflict/countdown beats. With flat 2D graphics, SFX carries most of the perceived polish, don't let a video run on a single SFX type. Selection/placement detail in STATE 9.

## STATE 0, SCAFFOLD THE PROJECT FIRST (video-pipeline Step 0.5)

Propose a valid default slug (no accents, no spaces, e.g. `vox-video-<yyyymmdd>`), then use AskUserQuestion: "Short name for this project (slug, no accents, no spaces)? You can rename/refine the content later once niche/idea are chosen in the next steps — this name is just to create the folder now." — options: ["Use `<proposed slug>`", "Enter a different name"]. If "Enter a different name" is picked, follow up in plain text for the user to type a slug.

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

Use AskUserQuestion: "Do you have a brand guide / colors / fonts / reference video you want Claude to follow?" — options: ["Yes, I'll attach a file/link separately", "Use the channel default (BRAND-GUIDE.md if present, else original Vox: navy, cream, red accent, light teal)"].

If "Yes" is picked, wait for the user's attachment, then read it and prioritize it over `BRAND-GUIDE.md`. If the default is picked: use `BRAND-GUIDE.md`'s exact palette/font/motion/SFX as-is if it exists (don't ask item by item), otherwise use the original Vox default (navy, cream, red accent, light teal).

STOP. WAIT.

## STATE 2, NICHE

Use AskUserQuestion: "What category does today's video topic fall under?" — options: ["Politics & society", "Economy & technology", "History & culture", "Other / type a different topic"].

If "Other / type a different topic" is picked, let the user type a broad niche/topic freely (not a specific idea — specific ideas are generated in STATE 3).

This state ONLY locks in the broad niche/category, do NOT ask for a specific topic here (avoid overlap with STATE 3, the only place specific ideas are generated and chosen).

STOP. WAIT.

## STATE 3, 10 IDEAS

Generate exactly 10 video ideas within the niche chosen in STATE 2. Each idea is ONE specific question the video will answer (true to Vox's spirit: "Why do cities trap heat?", "Why are shipping containers all the same size?"). No overlapping subtopics. Each idea needs a concrete hook (a stat, event, or place).

Output a numbered list 1-10, one idea per line, nothing else. End exactly with: "Pick a number, or describe a different topic." (10 choices exceed AskUserQuestion's 4-option cap, so keep this as a plain list for the user to type a number instead of tapping a button.)

STOP. WAIT.

## STATE 4, LENGTH + FORMAT + LANGUAGE

Use AskUserQuestion, bundling 3 questions in ONE call (the tool's max is 3 per call):
1. "How long should the video be?" — options: ["1 minute", "3 minutes", "5 minutes", "8 minutes or longer (specify in your next message)"]
2. "Target format?" — options: ["Horizontal 16:9", "Vertical 9:16", "Both"] — determines the aspect ratio used in STATE 7. **Choosing both means running two independent passes from STATE 7 onward** (two image sets, potentially two Compositions at render in STATE 10), not one stretched image shared across both ratios.
3. "Output language?" — options: ["English", "Vietnamese"] — applies to the script (STATE 5), voice (STATE 8), and every label/text appearing in images and thumbnails (STATE 7, STATE 11). The Vox DNA (conversational tone, rhetorical questions, claim → evidence → significance structure) stays the same in both languages, only the written language changes.

If the project name from STATE 0 is only a placeholder/generic compared to the idea just chosen, ask a follow-up (separate AskUserQuestion, 2 options: ["Rename the folder to match the content", "Keep the current name"]), then `mv <old-name> <new-name>` inside `remotion-video/` if renaming is chosen.

STOP. WAIT.

## STATE 5, SCRIPT (VOX VOICE) + MANDATORY FACT-CHECK

Estimate at 2.5 words/second: 1 minute ≈ 150 words, 2 minutes ≈ 300, 3 minutes ≈ 450, 5 minutes ≈ 750, 8 minutes ≈ 1200. Tolerance: 5%.

Script rules:
1. Continuous narration, one prose block. No headers, no visual directions.
2. **The cold open MUST be a paradox/conflict/controversy, not a safe textbook-style setup.** The first 3-10 seconds are where an international audience decides to stay or leave — opening on a neutral illustrated scene before easing into a "imagine you..." question is too soft and loses viewers early. Instead, open directly with a paradoxical question ("Why does a tiny town near London dictate the exact time for the entire planet?") or a confrontational/controversial image in the very first sentence, then step back to explain context.
3. Conversational tone but with clear argument structure: raise the issue, give concrete evidence (stats, events), then draw a broader conclusion.
4. Short sentences, one idea per sentence (makes later beat-splitting easier). Rhetorical questions are fine to weave in.
5. Facts must be accurate, never invent numbers/names. If unsure, phrase around it.
6. No ads, no subscribe calls-to-action.
7. End on an expansive closing line, either a question left for the viewer or a sharp final observation.

Write the script in the exact language chosen in STATE 4 (English or Vietnamese). Web_search may return results in a different language; always rephrase claims into the script's language before adding them to the draft.

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

Each beat covers roughly 2-3 seconds of narration (~5-8 words at 2.5 words/second). One short sentence = one beat; long sentences split at natural clause boundaries. Assign each beat an `id` like `vo_01`, `vo_02`... used throughout the following states (images, voice, SFX, Sequence).

Output a table: `id`, ESTIMATED start timecode (cumulative at 2.5 words/second, to be overwritten in STATE 8), the beat's exact wording. Append this table to `<video-name>-script.md` (append, don't overwrite the original script section).

End with AskUserQuestion: "Beats are split. Generate Vox images for each beat now?" — options: ["Continue to image generation", "Stop, I want to edit the beat table first"].

STOP. WAIT.

## STATE 7, VOX IMAGE GENERATION (per the `imagegen-remotion` skill, called via Antigravity IDE's image generation feature)

Save every image directly to `<new-video-name>/public/images/` (this folder already exists from the Remotion scaffold in STATE 0) — this is exactly the asset STATE 10 (code scaffolding) will use.

**If STATE 4 chose both formats (16:9 + 9:16)**: run 7a-7e as two independent passes, each with its own safe zone matching its ratio (16:9 reserves the bottom or top third for captions, ~6% margin on all edges; 9:16 reserves the top ~15% for UI overlay, middle-to-lower third for TikTok-style captions). Never reuse one image for both ratios. Save into two subfolders: `public/images/16-9/scene-<id>.png` and `public/images/9-16/scene-<id>.png`, each with its own manifest.

Labels (if a prompt needs a short 1-4 word label on a paper strip/stamp) are written in the exact language chosen in STATE 4; the rest of the prompt (SCENE, STYLE BLOCK, CLOSER) stays in English since it's an instruction to the image model.

### 7a. Check for and apply the `imagegen-remotion` skill

- If this skill is already in the available skills list, treat its rules as mandatory for every image generated in this state.
- If not, call `search_skills(["imagegen remotion", "video asset", "scene plate"])` then `suggest_skills` so the user can add it; while waiting, manually apply the summarized rules in 7b-7c below so progress isn't blocked.

Core rules from `imagegen-remotion` (mandatory, can't skip):
- 1 beat (`id` from STATE 6) = exactly 1 image, never merge multiple beats into one image, never skip one.
- Every image is a "raw plate" for code: never bake text/captions/lower-thirds/fake logos into the image, Remotion will code text on top later in STATE 10.
- A clear text-safe zone matching the aspect ratio chosen in STATE 4.
- Motion-readiness: each image picks exactly 1 motion intent (slow zoom-in / pan left-right / parallax / static hold for a title card) and leaves breathing room around the subject to match.
- **Motion pacing must not be monotonous throughout the video**: if 3+ consecutive beats all use the same gentle motion (constant Ken Burns), the audience gets bored. For beats carrying an important stat/place (a map, chart, vote result), use a wide zoom-out followed by a deep zoom-in on the specific point rather than a generic pan/zoom. For a run of beats with the same rapid-fire data type (consecutive vote tallies, number counts), shorten the gap between beats to create a fast, punchy rhythm matching the voiceover, building tension instead of letting each number drift by at the same pace.
- Cross-scene consistency: write one "style bible" ONCE, paste it verbatim at the top of every beat's prompt, only change the action/setting portion.
- Aspect-ratio discipline: the whole project uses exactly the one ratio chosen in STATE 4.

### 7b. Style bible (write once before the first beat)

Lock in: recurring subject/character description if the video has a fixed character, the 3-4 color palette from STATE 1, lighting direction/mood, render style = Vox flat 2D vector (matches STYLE BLOCK below). Paste this verbatim into every beat's prompt.

### 7c. Write the prompt for each beat (exactly 1 image/beat)

Structure per prompt: [style bible] + [the beat's own action/setting, one central visual idea] + STYLE BLOCK + CLOSER.

**STYLE BLOCK (insert verbatim into EVERY prompt):**
```
Flat 2D vector illustration in the style of Vox explainer videos: clean geometric shapes, no gradients, no drop shadows, no gloss, minimal thin outlines, generous negative space reserved for kinetic-typography overlay. Bold but limited color palette of 3 to 4 flat colors held consistent across the whole project (state the exact palette once, e.g. navy, cream, red accent, muted teal). Simple geometric character silhouettes without facial detail unless the beat needs a specific expression. Editorial infographic elements where relevant: simplified maps, bar or line charts, icons, timeline bars, arrows, circles used as highlight devices. Clean modern bold sans-serif type only where a label is specified. Clarity over realism, poster-like composition, crisp vector edges. No baked-in captions, no fake lower-thirds, no fake logos or UI elements.
```

**CLOSER (insert verbatim at the end of EVERY prompt):**
```
The composition stays flat, clean, and editorial with generous negative space, built for smooth kinetic-typography motion. NOT photorealistic, NOT painterly, NOT paper collage, NOT 3D render, no clutter, no watermark, no logos, no text beyond the specified label. Premium explainer-video vector aesthetic, matching the project's fixed aspect ratio, ultra-detailed, crisp vector lines.
```

Save each image to `public/images/scene-<id>.png` (if only one format), or `public/images/<16-9|9-16>/scene-<id>.png` (if STATE 4 chose both, per the folder structure noted at the top of STATE 7). Include a manifest table for STATE 10's handoff (a separate manifest per format if there are two):
```
Scene <id> — <beat name> (estimated timecode from STATE 6, overwritten in STATE 8)
  asset: public/images/scene-<id>.png
  motion: <chosen motion intent>
  text-safe: <area reserved for caption/kinetic typography>
```

Animation spec JSON (kept as the basis for `remotion-best-practices`/`remotion-create`/`remotion-markup` in STATE 10, NOT a standalone deliverable):
```ts
interface BeatAnimation {
  beatId: string;           // matches STATE 6 id, e.g. "vo_03"
  startFrame: number;       // overwritten with real measurement in STATE 8 (manifest.json, fps from STATE 0)
  durationFrames: number;   // overwritten with real measurement in STATE 8
  elements: {
    type: 'title-text' | 'icon' | 'chart' | 'map' | 'character' | 'highlight-circle' | 'arrow' | 'stat-counter';
    enterAtFrame: number;
    motion: 'slide-left' | 'slide-up' | 'fade-scale' | 'draw-on' | 'count-up';
    easing: 'easeOutCubic' | 'spring';
    label?: string;
  }[];
}
```
Use Remotion's `interpolate()` and `spring()` when scaffolding, do NOT use stop-motion-style frame-hold (that's true-crime DNA, not Vox).

### 7d. Call the real image-generation tool via Antigravity IDE

- Running in Antigravity IDE: use the IDE's built-in image generation (Gemini/Nano Banana) directly, calling it for each beat in strict order Scene 1 → Scene N, no batching, no reordering.
- If the user has already said they want a different tool for this pass (e.g. a separate Google Flow for video keyframes), prioritize that over the default.
- If running on a different harness without this feature (not Antigravity IDE): try any connected Gemini or Google Flow tool/connector available in the session; if none is available, export all prompts in beat order to `public/images/prompts.txt` (one block per beat, numbered by `id`, separated by a blank line), tell the user to paste each prompt into Gemini or Flow themselves, download the images, and name them exactly `scene-<id>.png` (or `<16-9|9-16>/scene-<id>.png` for two formats) into `public/images/`. Once the user confirms it's done, verify the file count matches the beat count before moving to 7e.

### 7e. Clarity check before handoff (condensed from `imagegen-remotion` §9)

1. Image count exactly matches beat count, none merged, none missing?
2. Character/palette/lighting/render style consistent across every image (matches the style bible)?
3. Every image is the exact aspect ratio chosen?
4. Every image has a clear text-safe zone, and NO caption/logo/fake UI baked in?
5. Every image leaves enough breathing room for its chosen motion intent?

If any answer is "no", regenerate just that broken image, don't hand off the whole batch while one link is still broken.

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

**Overwrite the STATE 6 beat table and the STATE 7c animation spec with the real measurements from `manifest.json`** — stop using the 2.5 words/second estimate from here on.

**Cross-check the real total duration**: sum `durationSec` across all beats in `manifest.json` and compare to the target length chosen in STATE 4. The 2.5 words/second estimate in STATE 5 is calibrated for English and can drift noticeably for Vietnamese (different syllable pacing). If the real total duration is off by more than ~15% from the target, use AskUserQuestion: "The actual video is [X]s, off from the [Y]s target. How to handle it?" — options: ["Go back to STATE 5 to edit/trim the script", "Keep the actual duration, no edits"]. If the drift is within an acceptable range, skip this and continue.

End with AskUserQuestion: "Voice is done with real durations. Generate SFX now?" — options: ["Continue to SFX generation", "Stop, I want to listen to the voice first"].

STOP. WAIT.

## STATE 9, SFX (handed off to video-pipeline Step 4)

Vox uses restrained SFX (not heavy-handed, unlike true-crime's dramatic style) but NOT a single whoosh for the whole video — with flat 2D graphics, SFX carries most of the perceived polish. Map by moment type:
- **whoosh** (light): draw-on/slide-in/pan/map transitions, motion `draw-on` or `highlight-circle`.
- **pop/click** (short, dry): icon/stat/flag/stamp/stat-counter appearing, motion `fade-scale` or `count-up` on beats with a specific number.
- **gavel strike** (weighty): decision/hearing/verdict/vote moments, use just 1-2 times at the climax, don't overuse.
- **rising clock ticking**: extended conflict/waiting/countdown beats, or a character refusing to accept a result, ramp tempo with the voiceover then cut abruptly when the tension resolves.
No SFX needed for a plain fade-scale/static hold, unless the beat opens or closes the video, or falls into one of the 4 types above.

Prefer reusing existing files in `public/audio/sfx/` (whoosh, skedaddle, triggered, record-scratch, wilhelm-scream, bruh) before downloading new ones. `whoosh` is ready to use; `pop/click`, `gavel strike`, `clock ticking` usually AREN'T in the default library yet, find/download free files (WebFetch a free-SFX source) and save them to `public/audio/sfx/` before use. The other dramatic SFX (record-scratch, wilhelm-scream, bruh) DON'T fit the Vox tone, avoid them unless the user explicitly asks.

Place SFX at the exact frame based on the real `manifest.json` from STATE 8, never approximate. Trim/fade with `ffmpeg -af "afade=t=out:st=..:d=.."` if a file runs longer than the moment it should punctuate.

End with AskUserQuestion: "SFX placement is done. Build code and render now?" — options: ["Continue to code building", "Stop, I want to adjust SFX first"].

STOP. WAIT.

## STATE 10, BUILD CODE + QA + RENDER + QC (handed off to video-pipeline Steps 2, 5, 6, 7)

Call `remotion-best-practices` as the router (leads to the right `remotion-create` + `remotion-markup`). If clear aesthetic direction is needed, also call `frontend-design`. Inputs for this step: images in `public/images/` (STATE 7), the animation spec JSON (STATE 7c, timing overwritten with real values in STATE 8), audio in `public/audio/vo/` + manifest.json (STATE 8), SFX in `public/audio/sfx/` (STATE 9). All of it already sits inside `<new-video-name>/` from STATE 0.

Follow `video-pipeline`'s loop exactly:
1. **Step 2**: install missing packages via `npx remotion add <pkg>` before use, keep the color/font theme in one file. This is where the REAL Composition/Scene gets written (STATE 0 only created an empty project shell, no scene yet). The Composition uses the exact fps=30 locked in STATE 0 (matching `generate-voiceover.py --fps 30` from STATE 8), and the Composition's `durationInFrames` comes from the TOTAL real frame count in `manifest.json` (STATE 8), not the blank template's default.
   - **Subtitle component must be kinetic**: split each beat's `text` into 2-3 word clusters, use `interpolate()`/`spring()` keyed on `frame` to reveal each cluster in sequence within the beat's `durationInFrames` (never the whole sentence at once). Keywords (numbers/proper names/places/conclusions) get a distinct accent color within the same span. Render text directly over the video (text-shadow/stroke for enough contrast), NEVER wrapped in a `<div>`/`<span>` with a solid fixed background color like a dialogue box, avoid that pattern that hides the background graphics.
   - **Motion pacing must not be monotonous**: for a scene with `type: 'map' | 'chart' | 'stat-counter'` carrying a key stat/place, use a zoom-out then zoom-in-on-the-specific-point transform pair instead of a single linear zoom/pan for the whole beat. For a run of consecutive beats with the same rapid-fire data type (vote counting, listing numbers), shorten the `enterAtFrame` gap between elements to create a fast, punchy rhythm matching the voiceover.
2. **Step 5 (visual QA)**: `npx remotion still <CompId> /tmp/check.png --frame=<n>` at several points, read the image with the Read tool against Vox expectations (flat, no gloss, correct safe-zone), `npx tsc --noEmit && npx eslint src` after each batch of fixes.
3. **Step 6 (render)**: check sync on a short segment first (`npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>`). If STATE 4 chose both formats, this means 2 separate Compositions (each using the correct `public/images/16-9/` or `public/images/9-16/` set from STATE 7) → full render produces 2 files: `out/<Name>-16x9.mp4` and `out/<Name>-9x16.mp4`.
4. **Step 7 (QC)**: call `video-qc` (`/watch out/<file>.mp4`) for each rendered file, including both if there are two formats.

**If QC returns ⚠️/❌ related to visuals/Vox style** (wrong palette, missing safe-zone, mismatched motion): go back to STATE 7, regenerate just the broken image via Antigravity IDE, don't redo the whole batch. **If it's something else** (animation code, audio sync, layout): follow `video-pipeline` Step 8 exactly (vague feedback → ask the user again via AskUserQuestion, multiple issues at once → call `superpowers:brainstorming` before batch-fixing), then loop back through Steps 5-7 until QC passes.

End with AskUserQuestion: "Video is rendered and QC-passed at out/<Name>.mp4 (or both files if STATE 4 chose two formats). Generate 3 thumbnails now?" — options: ["Continue to thumbnails", "Stop, I want to watch the video first"].

STOP. WAIT.

## STATE 11, THUMBNAILS

Generate 3 thumbnail prompts, each its own independent block, Vox style pushed louder for small sizes:
- One flat 2D illustrated subject filling most of the frame.
- 1-2 blocks of condensed uppercase type, max 3 words per block, the video's hook keywords, written in the exact language chosen in STATE 4.
- One highlight device (circle/underline/arrow) in red or yellow from the project's palette.
- Flat background, one of the project's primary colors, high contrast, no small detail that dies at 200px size.
- Same STYLE BLOCK and CLOSER as STATE 7, swapping "no text beyond the specified label" for "no text beyond the specified thumbnail words".

If STATE 4 chose both formats, generate two separate sets of 3 thumbnails (one 16:9, one 9:16), since YouTube thumbnails (16:9) and Shorts/Reels covers (9:16) differ in ratio.

Generate via Antigravity IDE per the same mechanism as 7d, save to `<new-video-name>/public/thumbnails/` (or `public/thumbnails/16-9/` + `public/thumbnails/9-16/` for two formats). This is the final deliverable, alongside the `.mp4` from STATE 10.

End with AskUserQuestion: "Done: video rendered, QC-passed, with 3 thumbnails, all inside `<new-video-name>/`. What next?" — options: ["Start a new video", "Add another language version of this video", "Redo a step", "Finish here"].

If "Add another language version" is picked, move to STATE 12. If "Redo a step" is picked, follow up (plain text, since there are more than 4 states so it won't fit AskUserQuestion) asking which state to redo, then return to that exact state.

STOP. WAIT.

## STATE 12, ADD ANOTHER LANGUAGE VERSION (optional, runs after at least 1 complete version exists)

Only reuse the language-independent parts (chosen niche/idea, Vox images in `public/images/`, animation spec, SFX types), do NOT redo States 1-4/7 from scratch — only translate content and regenerate the language-dependent parts.

If the project only supports 2 languages (English/Vietnamese) and STATE 4 already picked one, the remaining language is the only sensible default. Still use AskUserQuestion: "Add which language version?" — options: ["Use `<remaining language>`", "Enter a different language"]. If "Enter a different language" is picked, follow up in plain text for the specific language name (e.g. a future project supporting languages beyond English/Vietnamese). If there genuinely are 2+ languages not yet done, the options are that full list (no need for an extra "enter different" option).

### 12a. Translate the script (don't rewrite from scratch)

Translate `<video-name>-script.md` (STATE 5) verbatim into the new language, preserving meaning, preserving any flagged twist/ending, preserving the exact beat count and `id`s (`vo_01, vo_02...`) so the timing table still maps 1-1. Save as `<video-name>-script-<lang>.md` (a separate file, don't overwrite the original). No need to re-fact-check since content/claims don't change, only the language of expression.

### 12b. Check images for old-language baked labels

Since `imagegen-remotion`/STYLE BLOCK discipline forbids baked captions, Vox images usually contain NO text besides a short 1-4 word label (if any). Check the STATE 7 manifest table: if any image used a label in the old language, regenerate just those images (via Antigravity IDE, per the 7d mechanism) with the new-language label, saved to `public/images/<lang>/scene-<id>.png` (only labeled images need a separate version, unlabeled images can be shared, no need to regenerate everything).

### 12c. Real voice for the new language (as in STATE 8)

Build a new JSON from the translated script (12a), voice mapped to the new language (`en-US-GuyNeural`/`en-US-AriaNeural` or `vi-VN-NamMinhNeural`/`vi-VN-HoaiMyNeural`, ask voice gender via AskUserQuestion as in STATE 8). Run `generate-voiceover.py` with the same fps locked in STATE 0, output to `public/audio/vo/<lang>/` + its own `manifest.json`. Cross-check the real total duration against the target length as in STATE 8 (a translated script can run longer/shorter than the original).

### 12d. SFX + Composition + render + QC for the new language

SFX (type/timing) follows the same STATE 9 logic, just retimed against the new `manifest.json` from 12c. In STATE 10: create one more Composition for the new language (reusing the original images + any labeled images from 12b, new audio from 12c), render to `out/<Name>-<lang>.mp4` (doubled if the project has both 16:9/9:16 formats), QC via `video-qc` as normal.

### 12e. Thumbnails for the new language

Regenerate the 3 thumbnails (STATE 11) with text in the new language, saved to `public/thumbnails/<lang>/`.

End with AskUserQuestion: "Added a `<lang>` version at out/<Name>-<lang>.mp4. What next?" — options: ["Add another language", "Start a new video", "Finish here"].

STOP. WAIT.
