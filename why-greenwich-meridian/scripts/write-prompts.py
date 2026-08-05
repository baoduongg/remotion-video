import json
from pathlib import Path

STYLE_BIBLE = (
    "Flat 2D vector illustration in the style of Vox explainer videos. Clean geometric shapes, "
    "no gradients, no drop shadows, no gloss, minimal thin outlines, generous negative space "
    "reserved for kinetic-typography overlay. Palette: Navy (#0b1b3d), Cream (#f9f6f0), Accent Red (#e31b23), "
    "Muted Teal (#31828f). Simple geometric character silhouettes without facial details."
)

STYLE_BLOCK = (
    "Flat 2D vector illustration in the style of Vox explainer videos: clean geometric shapes, "
    "no gradients, no drop shadows, no gloss, minimal thin outlines, generous negative space "
    "reserved for kinetic-typography overlay. Bold but limited color palette of 3 to 4 flat colors "
    "held consistent across the whole project (navy, cream, red accent, muted teal). "
    "Simple geometric character silhouettes without facial detail unless the beat needs a specific expression. "
    "Editorial infographic elements where relevant: simplified maps, bar or line charts, icons, "
    "timeline bars, arrows, circles used as highlight devices. Clean modern bold sans-serif type only where a label "
    "is specified. Clarity over realism, poster-like composition, crisp vector edges. "
    "No baked-in captions, no fake lower-thirds, no fake logos or UI elements."
)

CLOSER = (
    "The composition stays flat, clean, and editorial with generous negative space, "
    "built for smooth kinetic-typography motion. NOT photorealistic, NOT painterly, NOT paper collage, "
    "NOT 3D render, no clutter, no watermark, no logos, no text beyond the specified label. "
    "Premium explainer-video vector aesthetic, matching the project's fixed aspect ratio, ultra-detailed, crisp vector lines."
)

BEAT_DESCRIPTIONS = {
    "vo_01": "A minimalist commercial airplane flying across a stylized flat world map from London to Paris and New York, with clean dotted flight path lines.",
    "vo_02": "A simple wristwatch face with two hands pointing at a ticking clock, with a hand adjusting the watch crown on the side.",
    "vo_03": "A simple pocket watch face with two hands, resting against a dark navy background.",
    "vo_04": "A stylized flat vector map of the United Kingdom and Western Europe, highlighting the city of London.",
    "vo_05": "A simplified flat vector map highlighting the town of Greenwich, with a small classic observatory dome icon.",
    "vo_06": "Three paper stamps sliding in from the top: Eiffel Tower icon, US Capitol dome icon, and a blank blue ocean with a giant question mark.",
    "vo_07": "A stylized vertical timeline running backwards from the modern era to the 19th century, with old ticking clock gears in navy and cream.",
    "vo_08": "A clock tower displaying twelve o'clock, next to a sun shining directly overhead.",
    "vo_09": "A comparison diagram showing two 19th century towns with clock towers: Town A displays 12:00, Town B displays 12:05.",
    "vo_10": "A sun at the zenith position directly above a classic clock pointing at 12 o'clock.",
    "vo_11": "A map of the United States divided into dozens of chaotic, colorful timezone stripes in navy, cream, teal, and red.",
    "vo_12": "A flat vector illustration of a 19th-century steam train riding on a track, with clocks spinning rapidly in the background.",
    "vo_13": "A bold title card showing 'WASHINGTON D.C. OCTOBER 1884' in sans-serif cream text on a dark navy background.",
    "vo_14": "A stylized neoclassic dome hall interior representing the International Meridian Conference in Washington D.C.",
    "vo_15": "A round conference table surrounded by diverse national flags as icons, with arrows pointing inward to a single central line.",
    "vo_16": "A portrait of astronomer Jules Janssen in flat vector style with a speech bubble showing a crossed-out Greenwich observatory icon.",
    "vo_17": "A simple balance scale with 'British Empire' on one side and 'French Empire' on the other, tilting.",
    "vo_18": "A dotted meridian line passing through the ocean, far from any land, with a compass rose in muted teal.",
    "vo_19": "A map highlighting the Azores islands in the Atlantic Ocean next to a clean map of the Bering Strait.",
    "vo_20": "A classic meter rule next to a globe of the Earth, illustrating the measurement of the Earth's circumference.",
    "vo_21": "Two silhouettes of British and American delegates pointing at a ledger labeled 'Maritime Charts'.",
    "vo_22": "A pie chart showing 72 percent labeled 'Greenwich Charts' in muted teal and 28 percent labeled 'Others' in navy, with a cargo ship silhouette.",
    "vo_23": "A pile of golden coins and currency stacks with warning arrows pointing downwards, representing huge economic loss.",
    "vo_24": "A vote tally board showing 'GREENWICH MERIDIAN VOTE' with a score of 'YES: 22' and 'NO: 1' and 'ABSTAIN: 2'.",
    "vo_25": "A voting ballot box with 22 checkmark papers falling into it.",
    "vo_26": "A map highlighting San Domingo (Dominican Republic) with a bold red 'NO: 1' stamp.",
    "vo_27": "Flags of France and Brazil rendered in grayscale with a label stamp saying 'ABSTAIN'.",
    "vo_28": "A calendar page turning rapidly from 1884 to 1911 in front of a dark navy backdrop.",
    "vo_29": "A clock labeled 'Paris Time' ticking out of sync with a clock labeled 'London Time'.",
    "vo_30": "An old paper scroll with the French law handwritten: 'Heure de Paris - 9m 21s' with a yellow highlight.",
    "vo_31": "A French citizen character shrugging in front of a clock tower.",
    "vo_32": "A brass Prime Meridian line embedded in the pavement outside the historic Royal Observatory in Greenwich.",
    "vo_33": "Interlocking icons of a merchant ship wheel, mechanical gears, and a clock working in harmony.",
    "vo_34": "A clean world map with 24 standard timezone stripes under a dark navy starry sky."
}

def main():
    out_dir = Path.cwd() / "public" / "images"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    prompts = {}
    for id_ in sorted(BEAT_DESCRIPTIONS.keys()):
        desc = BEAT_DESCRIPTIONS[id_]
        prompt = f"{STYLE_BIBLE} {desc} {STYLE_BLOCK} {CLOSER}"
        prompts[id_] = prompt
        
    prompt_file = out_dir / "prompts.json"
    with open(prompt_file, "w", encoding="utf-8") as f:
        json.dump(prompts, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(prompts)} prompts to {prompt_file}")

if __name__ == "__main__":
    main()
