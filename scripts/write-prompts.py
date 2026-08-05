import json
from pathlib import Path

STYLE_BIBLE = (
    "Flat 2D vector illustration in the style of Vox explainer videos. Clean geometric shapes, "
    "no gradients, no drop shadows, no gloss, minimal thin outlines, generous negative space "
    "reserved for kinetic-typography overlay. Palette: Navy (#0f172a), Cream (#f8fafc), Accent Red (#ef4444), "
    "Muted Teal (#0d9488). Simple geometric character silhouettes without facial details."
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
    "vo_01": "A minimalist flat vector hand touching a glowing abstract computer screen showing tech networks.",
    "vo_02": "A clean geometric vector of a jean pocket with a modern smartphone sticking out slightly.",
    "vo_03": "An isometric flat schematic of large computer server racks with glowing connections in teal and red.",
    "vo_04": "A central glowing red connecting dot with multiple nodes radiating to various tech device icons.",
    "vo_05": "A simplified flat world map focusing on East Asia, highlighting a glowing red island representing Taiwan.",
    "vo_06": "A geometric vector graphic representing a silicon wafer or the high-tech TSMC headquarters silhouette.",
    "vo_07": "A minimalist silhouette portrait of Morris Chang with the year '1987' written in clean bold cream sans-serif text.",
    "vo_08": "A crossed-out technical blueprint of a microprocessor showing a completely blank canvas.",
    "vo_09": "A large single mechanical gear in accent red focusing on one task on a clean navy background.",
    "vo_10": "Icons of leading tech brands (like Apple, Nvidia, AMD) pointing to a central silicon wafer.",
    "vo_11": "A clean microchip sitting on a pedestal with a bright spotlight in red and cream.",
    "vo_12": "A simple flat infographic pie chart: 90 percent is a massive accent red slice, and 10 percent is cream.",
    "vo_13": "A high-tech flat vector microchip shining brightly with glowing teal patterns.",
    "vo_14": "A comparison chart showing a thick strand of hair next to an ultra-tiny chip labeled 3nm.",
    "vo_15": "A stylized flat vector human brain constructed from digital circuitry and logic gates in muted teal.",
    "vo_16": "A modern smartphone mockup floating in empty navy space surrounded by abstract tech waves.",
    "vo_17": "Silhouettes of two runners in teal lagging far behind a leading runner in red.",
    "vo_18": "An abstract calendar page peeling off or a clock with pages flying away to represent decades passing.",
    "vo_19": "An arrow moving forward with smaller broken arrows falling off the track.",
    "vo_20": "A conveyor belt showing a stack of perfect red chips next to a pile of broken grey chips.",
    "vo_21": "A warning triangle sign in bold red with an exclamation mark on a dark navy background.",
    "vo_22": "A seismograph showing a massive earthquake spike next to a shaking map of Taiwan.",
    "vo_23": "Two opposing sets of bold red and teal geometric arrowheads pointing directly at each other.",
    "vo_24": "A modern clean factory silhouette icon with a gear blocked by a red warning sign.",
    "vo_25": "A flat vector globe locked with a large cream-colored padlock.",
    "vo_26": "An empty slot on a dark navy motherboard where a microchip should be, highlighted in red.",
    "vo_27": "An empty store shelf showing a crossed-out silhouette of a smartphone.",
    "vo_28": "A sleek modern electric car silhouette with a battery icon showing zero charge.",
    "vo_29": "A terminal screen showing a 'System Offline' warning in bold red with disconnected nodes.",
    "vo_30": "Simplified shapes of the USA, Japan, and Europe highlighted on a flat globe map.",
    "vo_31": "Stacks of coins and dollar notes being poured into a large factory funnel.",
    "vo_32": "Construction cranes building a modern semi-conductor factory silhouette.",
    "vo_33": "A thick rope being cut with scissors, representing severing dependencies.",
    "vo_34": "A dense network diagram or maze of gears and logic gates in teal and red.",
    "vo_35": "A global logistics map showing ships and planes with cargo routes leading to Taiwan.",
    "vo_36": "A minimalist character trying to push a giant, heavy stone wall in a navy setting.",
    "vo_37": "A split sun and moon graphic, representing a long transition of day and night.",
    "vo_38": "A single independent gear spinning freely away from a larger machine.",
    "vo_39": "A clean room technician silhouette holding up a silicon wafer in front of a teal background.",
    "vo_40": "An hourglass with sand running out, showing a storm cloud symbol at the bottom.",
    "vo_41": "A magnifying glass focusing on a tiny, glowing golden chip.",
    "vo_42": "An interior of an ultra-clean semi-conductor fabrication room with yellow glowing light."
}

def main():
    out_dir = Path.cwd() / "public" / "audio" / "vo"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    prompts = []
    for id_ in sorted(BEAT_DESCRIPTIONS.keys()):
        desc = BEAT_DESCRIPTIONS[id_]
        prompt = f"{STYLE_BIBLE} {desc} {STYLE_BLOCK} {CLOSER}"
        prompts.append(prompt)
        
    prompt_file = out_dir / "prompts.txt"
    prompt_file.write_text("\n\n".join(prompts))
    print(f"Wrote {len(prompts)} prompts to {prompt_file}")

if __name__ == "__main__":
    main()
