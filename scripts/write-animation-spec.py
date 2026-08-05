import json
from pathlib import Path

MANIFEST_DATA = {
  "vo_01": {"startFrame": 0, "durationFrames": 100},
  "vo_02": {"startFrame": 100, "durationFrames": 76},
  "vo_03": {"startFrame": 176, "durationFrames": 114},
  "vo_04": {"startFrame": 290, "durationFrames": 66},
  "vo_05": {"startFrame": 356, "durationFrames": 95},
  "vo_06": {"startFrame": 451, "durationFrames": 102},
  "vo_07": {"startFrame": 553, "durationFrames": 123},
  "vo_08": {"startFrame": 676, "durationFrames": 94},
  "vo_09": {"startFrame": 770, "durationFrames": 76},
  "vo_10": {"startFrame": 846, "durationFrames": 78},
  "vo_11": {"startFrame": 924, "durationFrames": 84},
  "vo_12": {"startFrame": 1008, "durationFrames": 139},
  "vo_13": {"startFrame": 1147, "durationFrames": 89},
  "vo_14": {"startFrame": 1236, "durationFrames": 70},
  "vo_15": {"startFrame": 1306, "durationFrames": 89},
  "vo_16": {"startFrame": 1395, "durationFrames": 84},
  "vo_17": {"startFrame": 1479, "durationFrames": 95},
  "vo_18": {"startFrame": 1574, "durationFrames": 73},
  "vo_19": {"startFrame": 1647, "durationFrames": 81},
  "vo_20": {"startFrame": 1728, "durationFrames": 105},
  "vo_21": {"startFrame": 1833, "durationFrames": 90},
  "vo_22": {"startFrame": 1923, "durationFrames": 107},
  "vo_23": {"startFrame": 2030, "durationFrames": 80},
  "vo_24": {"startFrame": 2110, "durationFrames": 71},
  "vo_25": {"startFrame": 2181, "durationFrames": 109},
  "vo_26": {"startFrame": 2290, "durationFrames": 81},
  "vo_27": {"startFrame": 2371, "durationFrames": 84},
  "vo_28": {"startFrame": 2455, "durationFrames": 60},
  "vo_29": {"startFrame": 2515, "durationFrames": 100},
  "vo_30": {"startFrame": 2615, "durationFrames": 93},
  "vo_31": {"startFrame": 2708, "durationFrames": 80},
  "vo_32": {"startFrame": 2788, "durationFrames": 71},
  "vo_33": {"startFrame": 2859, "durationFrames": 81},
  "vo_34": {"startFrame": 2940, "durationFrames": 99},
  "vo_35": {"startFrame": 3039, "durationFrames": 118},
  "vo_36": {"startFrame": 3157, "durationFrames": 68},
  "vo_37": {"startFrame": 3225, "durationFrames": 69},
  "vo_38": {"startFrame": 3294, "durationFrames": 80},
  "vo_39": {"startFrame": 3374, "durationFrames": 78},
  "vo_40": {"startFrame": 3452, "durationFrames": 91},
  "vo_41": {"startFrame": 3543, "durationFrames": 81},
  "vo_42": {"startFrame": 3624, "durationFrames": 99}
}

ELEMENT_TEMPLATES = {
  "vo_01": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "PHỤ THUỘC BÁN DẪN"},
    {"type": "character", "enterAtFrame": 30, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_02": [
    {"type": "icon", "enterAtFrame": 10, "motion": "slide-left", "easing": "spring"}
  ],
  "vo_03": [
    {"type": "icon", "enterAtFrame": 15, "motion": "slide-up", "easing": "spring"}
  ],
  "vo_04": [
    {"type": "highlight-circle", "enterAtFrame": 10, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_05": [
    {"type": "map", "enterAtFrame": 10, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_06": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "TSMC"},
    {"type": "highlight-circle", "enterAtFrame": 30, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_07": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "1987 - MORRIS CHANG"}
  ],
  "vo_08": [
    {"type": "icon", "enterAtFrame": 15, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_09": [
    {"type": "icon", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring"}
  ],
  "vo_10": [
    {"type": "icon", "enterAtFrame": 15, "motion": "slide-left", "easing": "spring"}
  ],
  "vo_11": [
    {"type": "highlight-circle", "enterAtFrame": 15, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_12": [
    {"type": "chart", "enterAtFrame": 10, "motion": "draw-on", "easing": "easeOutCubic"},
    {"type": "stat-counter", "enterAtFrame": 30, "motion": "count-up", "easing": "spring", "label": "90%"}
  ],
  "vo_13": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "TIÊN TIẾN NHẤT"}
  ],
  "vo_14": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "< 3 NANOMET"}
  ],
  "vo_15": [
    {"type": "icon", "enterAtFrame": 15, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_16": [
    {"type": "icon", "enterAtFrame": 10, "motion": "slide-left", "easing": "spring"}
  ],
  "vo_17": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "INTEL & SAMSUNG"}
  ],
  "vo_18": [
    {"type": "icon", "enterAtFrame": 15, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_19": [
    {"type": "arrow", "enterAtFrame": 10, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_20": [
    {"type": "icon", "enterAtFrame": 15, "motion": "slide-up", "easing": "spring"}
  ],
  "vo_21": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "CỰC KỲ NGUY HIỂM?"}
  ],
  "vo_22": [
    {"type": "map", "enterAtFrame": 10, "motion": "fade-scale", "easing": "easeOutCubic"},
    {"type": "arrow", "enterAtFrame": 30, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_23": [
    {"type": "arrow", "enterAtFrame": 15, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_24": [
    {"type": "icon", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring"}
  ],
  "vo_25": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "ĐÓNG BĂNG"}
  ],
  "vo_26": [
    {"type": "icon", "enterAtFrame": 15, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_27": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "KHÔNG ĐIỆN THOẠI MỚI"}
  ],
  "vo_28": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "KHÔNG XE ĐIỆN"}
  ],
  "vo_29": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "AI NGỪNG HOẠT ĐỘNG"}
  ],
  "vo_30": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "MỸ - NHẬT - CHÂU ÂU"}
  ],
  "vo_31": [
    {"type": "stat-counter", "enterAtFrame": 15, "motion": "count-up", "easing": "spring", "label": "HÀNG CHỤC TỶ USD"}
  ],
  "vo_32": [
    {"type": "icon", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring"}
  ],
  "vo_33": [
    {"type": "arrow", "enterAtFrame": 15, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_34": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "CỰC KỲ PHỨC TẠP"}
  ],
  "vo_35": [
    {"type": "map", "enterAtFrame": 15, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_36": [
    {"type": "character", "enterAtFrame": 10, "motion": "slide-left", "easing": "spring"}
  ],
  "vo_37": [
    {"type": "icon", "enterAtFrame": 15, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_38": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "TỰ CHỦ?"}
  ],
  "vo_39": [
    {"type": "icon", "enterAtFrame": 15, "motion": "slide-up", "easing": "spring"}
  ],
  "vo_40": [
    {"type": "icon", "enterAtFrame": 10, "motion": "fade-scale", "easing": "easeOutCubic"}
  ],
  "vo_41": [
    {"type": "highlight-circle", "enterAtFrame": 15, "motion": "draw-on", "easing": "easeOutCubic"}
  ],
  "vo_42": [
    {"type": "title-text", "enterAtFrame": 10, "motion": "slide-up", "easing": "spring", "label": "PHÒNG SẠCH TSMC"}
  ]
}

def main():
    out_dir = Path.cwd() / "public" / "audio" / "vo"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    spec = []
    for id_ in sorted(MANIFEST_DATA.keys()):
        m_info = MANIFEST_DATA[id_]
        elements = ELEMENT_TEMPLATES.get(id_, [])
        spec.append({
            "beatId": id_,
            "startFrame": m_info["startFrame"],
            "durationFrames": m_info["durationFrames"],
            "elements": elements
        })
        
    spec_file = out_dir / "animation_spec.json"
    spec_file.write_text(json.dumps(spec, indent=2, ensure_ascii=False))
    print(f"Wrote animation spec for {len(spec)} beats -> {spec_file}")

if __name__ == "__main__":
    main()
