# Nhận Diện Thương Hiệu & Phong Cách Thiết Kế (Visual Branding)

Rút ra từ project **`why-greenwich-meridian`** (video đã render, dùng phong cách Vox — flat 2D vector, kinetic typography). Đây là bộ chuẩn tham chiếu để mọi video sau này giữ đồng bộ hình ảnh, không phải mô tả chung chung mà lấy nguyên giá trị thật đã chạy production (từ `src/Composition.tsx`, `public/images/prompts.json`, `public/thumbnails/prompts.json`).

`vox-video-engine` STATE 1 nên dùng file này làm mặc định thay vì hỏi lại brand mỗi video.

---

## 1. Color Palette

| Vai trò | Tên | Hex | Dùng cho |
|---|---|---|---|
| Nền chính | Navy | `#0b1b3d` | Nền video (`AbsoluteFill backgroundColor`), nền thumbnail, chữ trên card cream |
| Nền phụ / giấy | Cream | `#f9f6f0` | Caption box, "paper strip" chữ thumbnail, landmass trên bản đồ |
| Nhấn mạnh | Accent Red | `#e31b23` | Vòng tròn/mũi tên highlight, điểm nhấn số liệu, chi tiết cảnh báo |
| Phụ trợ | Muted Teal | `#31828f` | Nhân vật hình học, icon, chi tiết thứ cấp |

Quy tắc: **đúng 4 màu này xuyên suốt cả video**, không thêm màu ngoài palette. Đây là "style bible" — dán nguyên câu sau vào đầu mọi prompt sinh ảnh:

```
Palette: Navy (#0b1b3d), Cream (#f9f6f0), Accent Red (#e31b23), Muted Teal (#31828f).
```

## 2. Typography

- **Font**: Anton (Google Font, `@remotion/google-fonts/Anton`, subsets `latin` + `vietnamese` — bắt buộc có `vietnamese` để chữ có dấu hiển thị đúng).
- **Caption chữ trên video**: uppercase, bold, `letter-spacing: 0.5px`, `fontSize: 2rem` ở composition 1280×720 (scale tỷ lệ theo resolution nếu đổi độ phân giải).
- **Caption box** (component `Scene` trong `Composition.tsx`):
  - Nền cream, chữ navy
  - `border: 3px solid navy`
  - `border-radius: 0` — góc vuông, không bo tròn (giữ tinh thần "flat editorial")
  - `box-shadow: 8px 8px 0px rgba(navy, 0.8)` — đổ bóng cứng kiểu poster/letterpress, KHÔNG dùng shadow mềm/blur
  - Vị trí mặc định: lower-third (`bottom: 8%`), một số scene dùng upper-third (`top: 10%`), margin trái/phải 5%
- **Text entrance**: `spring({ damping: 14, mass: 0.8 })` → fade opacity 0→1 + translateY 20px→0px.

## 3. Ngôn ngữ hình ảnh (Image Style)

STYLE BLOCK đã dùng thật cho toàn bộ ảnh scene (giữ nguyên khi sinh ảnh mới):

```
Flat 2D vector illustration in the style of Vox explainer videos: clean geometric shapes,
no gradients, no drop shadows, no gloss, minimal thin outlines, generous negative space
reserved for kinetic-typography overlay. Bold but limited color palette of 3 to 4 flat colors
held consistent across the whole project (navy, cream, red accent, muted teal).
Simple geometric character silhouettes without facial detail unless the beat needs a specific
expression. Editorial infographic elements where relevant: simplified maps, bar or line charts,
icons, timeline bars, arrows, circles used as highlight devices. Clean modern bold sans-serif
type only where a label is specified. Clarity over realism, poster-like composition, crisp
vector edges. No baked-in captions, no fake lower-thirds, no fake logos or UI elements.
```

Quan sát từ ảnh thật đã render (`public/images/scene-vo_01.png`, `scene-vo_15.png`):
- Nhân vật là silhouette hình học, không chi tiết mặt, màu navy/teal.
- Bản đồ/biểu đồ dùng làm xương sống hình ảnh (dashed flight path, mũi tên, vòng tròn khoanh vùng).
- Nhãn địa danh ngắn (1-4 từ, vd "LONDON", "PARIS") được phép bake vào ảnh — đây là ngoại lệ hợp lệ của quy tắc "no baked-in captions" (quy tắc đó cấm caption/lower-third/logo giả, không cấm nhãn địa danh ngắn).
- Nền có thể đảo: navy chủ đạo (đa số scene) hoặc cream chủ đạo (scene có nhiều nhân vật, để tăng độ tương phản/dễ đọc silhouette).

## 4. Chuyển động (Motion Identity)

Bộ motion intent đã dùng (từ `sceneConfig` trong `Composition.tsx`), theo đúng tỉ lệ sử dụng thật:

| Motion | Công thức | Tần suất |
|---|---|---|
| `static hold` | không transform | **Đa số scene** — nhịp điệu chủ đạo, editorial điềm tĩnh |
| `slow zoom-in` | `scale 1 → 1.08` toàn bộ duration | phổ biến thứ 2 |
| `pan left-to-right` | `translateX -30px → 30px` + `scale(1.06)` | dùng khi ảnh có chiều ngang (bản đồ, timeline) |
| `pan down-to-up` | `translateY 30px → -30px` + `scale(1.06)` | dùng khi ảnh có chiều dọc |
| `slide-up` | caption/card `translateY height→0` trong 15 frame | mở đầu card |
| `fade-scale` | `scale 0.8 → 1` trong 15 frame | chuyển cảnh nhẹ |

Nguyên tắc: KHÔNG dùng frame-hold kiểu stop-motion, dùng `interpolate()`/`spring()` mượt. `static hold` chiếm đa số — tránh lạm dụng zoom/pan liên tục, giữ nhịp Vox điềm tĩnh chứ không dồn dập.

## 5. SFX

Chỉ dùng `whoosh.wav`, `volume: 0.25`, gắn vào scene có `slow zoom-in`/`pan`/`slide-up` (cảnh có chuyển động máy quay). Scene `static hold`/`fade-scale` không có SFX trừ khi là mở đầu/kết. Không dùng SFX kịch tính (record-scratch, wilhelm-scream...).

## 6. Công thức Thumbnail

Từ `public/thumbnails/prompts.json` (3 thumbnail/video):
- Một chủ thể minh họa flat-vector chiếm phần lớn khung, độ tương phản cao trên nền navy.
- Chữ tiêu đề (tối đa 2-3 từ, IN HOA) đặt trong "paper strip" — dải nền cream bo góc vuông, font condensed bold sans-serif.
- Một highlight device màu đỏ (vòng tròn tay vẽ, mũi tên, tia sét) chỉ thẳng vào chủ thể hoặc chữ.
- Không chi tiết nhỏ chết ở size 200px (test hiển thị nhỏ trước khi chốt).

## 7. Thông số kỹ thuật nền

- `fps`: 30
- Resolution hiện tại: **1280×720** (16:9) — thấp hơn chuẩn Full HD. Cân nhắc nâng lên **1920×1080** cho các video sau để đạt chất lượng "chuyên nghiệp, chỉnh chu" hơn, giữ nguyên tỉ lệ font/spacing (scale theo % đã dùng, không hardcode px tuyệt đối).
- Timing: điều khiển hoàn toàn bởi `manifest.json` (duration đo thật bằng ffprobe), không đoán chừng.
- Đa ngôn ngữ: mỗi asset ngôn ngữ tách riêng — `script.md`/`script-en.md`, `voiceover.json`/`voiceover-en.json`, `public/audio/vo/`/`public/audio/vo/en/`, Composition riêng mỗi ngôn ngữ (`MyComp` / `WhyGreenwichMeridian-EN`), cần đổi tên cho đúng chuẩn `<video-name>-<lang>.mp4` (VD: `WhyGreenwichMeridian-vi.mp4`, `WhyGreenwichMeridian-en.mp4`).

## 8. Quy ước đặt tên

- Ảnh scene: `public/images/scene-<id>.png`, `id` dạng `vo_01`, `vo_02`...
- Voice: `public/audio/vo/<id>.mp3` (+ `/en/` cho bản tiếng Anh), kèm `manifest.json` (`durationSec`, `durationInFrames`).
- Prompt lưu lại để tái sử dụng/audit: `public/images/prompts.json`, `public/thumbnails/prompts.json`.

---

**Áp dụng cho video mới**: copy palette/font/motion/SFX ở trên nguyên xi, chỉ đổi resolution lên 1920×1080 nếu quyết định nâng cấp. Nếu một video cần lệch khỏi bộ nhận diện này (ví dụ palette khác cho series con), ghi rõ lý do trong `<ten-video>-script.md` để không lẫn với chuẩn chung.
