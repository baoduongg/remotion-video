# Workflow tạo video Remotion (đúc kết từ dự án "War of the Bucket", cập nhật theo skill `vox-video-engine`)

Tổng hợp từ toàn bộ lịch sử làm việc thực tế trên các project trong repo này. Mục tiêu: video sau làm nhanh hơn, ít vòng lặp thừa hơn video trước.

File này copy tự động vào từng project mới (`<ten-video-moi>/WORKFLOW.md`) ở bước scaffold — xem STATE 0 bên dưới.

## Video kiểu Vox (animated opinion essay) → dùng skill `vox-video-engine`

Nếu video cần làm là kiểu Vox: motion graphics thuần (không cảnh quay/talking-head), kinetic typography, giọng hội thoại nhưng có lập luận claim → bằng chứng → ý nghĩa — gọi thẳng skill `vox-video-engine` thay vì làm tay từng bước dưới đây. Skill này là state machine tuyến tính (STATE 0 → 12), mỗi state dừng chờ user xác nhận qua AskUserQuestion, và **tự động hoá toàn bộ workflow bên dưới**:

| State | Tương ứng bước workflow này |
|---|---|
| STATE 0 | Scaffold project (`npx create-video@latest --blank`, copy `WORKFLOW.md`/`scripts/`/skill dùng chung vào project mới) |
| STATE 1-4 | Style reference, niche, 10 ý tưởng, độ dài/định dạng/ngôn ngữ |
| STATE 5 | = Bước 1 (kịch bản + fact-check bắt buộc), theo giọng Vox có sẵn khung câu (cold open, claim → bằng chứng → ý nghĩa, kết mở) |
| STATE 6-7 | Tách beat + sinh ảnh Vox (flat 2D, style bible cố định, 1 beat = 1 ảnh) qua skill `imagegen-remotion` gọi bằng antigravity |
| STATE 8 | = Bước 3 (voice: `edge-tts` CLI + `scripts/generate-voiceover.py`, đo duration thật) |
| STATE 9 | = Bước 4 (SFX, tiết chế hơn true-crime — chủ yếu chỉ `whoosh` nhẹ) |
| STATE 10 | = Bước 2, 5, 6, 7 (scaffold code qua `remotion-best-practices`, QA `remotion still`, render, QC `qc-video`) |
| STATE 11 | Thumbnail (3 bản, chưa có ở workflow cũ) |
| STATE 12 | Thêm bản ngôn ngữ khác, tái dùng ảnh/asset không phụ thuộc ngôn ngữ |

Nếu `.claude/skills/video-pipeline` chưa có trong `remotion-video/` (thư mục cha), setup one-time (mục 0 dưới) trước khi vào STATE 0 của `vox-video-engine`.

Với video KHÔNG phải Vox-style (phỏng vấn, cảnh quay thật, phong cách khác), làm thủ công theo các bước 1-7 dưới đây — đây cũng là quy trình nền mà `video-pipeline`/`vox-video-engine` gọi vào ở STATE 10.

## 0. Setup một lần duy nhất (làm trước, đỡ tốn thời gian giữa chừng)

- Cài sẵn skill QC: `npx --yes skills add bradautomates/claude-video@watch -g -y` (cho lệnh `/watch`).
- Cấu hình `~/.config/watch/.env` với key Whisper/GROQ hoặc OpenAI (để có transcript khi QC video có thoại).
- Cài `edge-tts` qua pip: `pip3 install edge-tts` (dùng CLI trực tiếp, **không** dùng package npm `msedge-tts` — package đó rắc rối, tốn công debug output format mà không đáng).
- Đảm bảo `ffmpeg`/`ffprobe` có sẵn (dùng để đo duration audio, trim/fade sfx).
- Project là thư mục thường trong repo cha, không phải git repo lồng nhau riêng (submodule) — tránh lỗi "diff không thấy gì" khi check ở thư mục cha.
- Có sẵn `.claude/skills/video-pipeline` và `.claude/skills/qc-video` ở thư mục cha `remotion-video/` — `vox-video-engine` STATE 0 copy 2 skill này vào mọi project mới, thiếu thì chặn ngay từ đầu.

## 1. Ý tưởng & kịch bản (làm kỹ ở bước này, đỡ sửa lại sau)

1. Chốt chủ đề, gọi skill `remotion-best-practices` làm router → nó tự dẫn tới `remotion-create` (scaffold) + `remotion-markup` (nội dung/animation) phù hợp với dạng video (essay nhiều scene, hoặc kể chuyện có nhân vật).
2. Viết kịch bản ra file `.md` riêng (vd `new-script.md`) — chia theo scene, có: visual, audio/SFX, lời dẫn, hội thoại, timestamp ước lượng.
3. **Fact-check kịch bản bằng WebSearch NGAY tại bước này**, nhất là video dạng lịch sử/kiến thức — đừng để tới lúc QC cuối mới phát hiện sai sự kiện rồi phải sửa lại toàn bộ nội dung + animation đã dựng. (Bài học từ video này: phải sửa lại kịch bản "War of the Bucket" sau khi QC vì phần lịch sử ban đầu chưa chuẩn.)
4. Nếu kịch bản có "twist" (lật lại sự thật giữa video) — note rõ trong file script để không bị xóa nhầm khi refactor.

## 2. Scaffold code Remotion

1. Tạo `Root.tsx` + composition chính + các scene con tách file riêng (`src/remotion/*.tsx` hoặc `src/scenes/*.tsx`).
2. Cài thêm package cần thiết qua `npx remotion add <pkg>` trước (vd `@remotion/transitions`, `@remotion/google-fonts`, `@remotion/media`, `@remotion/sfx`) — check `node_modules/@remotion/<pkg>` tồn tại rồi mới code theo API của nó.
3. Định nghĩa theme dùng chung (màu, font) trong 1 file `theme.ts` — đỡ lặp lại giá trị rải rác nhiều scene khi cần đổi phong cách sau này.
4. Transition giữa scene: dùng `@remotion/transitions` với `fade()`/`slide()`. Nếu bị đè chữ giữa 2 scene → thêm delay để scene trước ẩn hết mới hiện scene sau, đừng chỉ đổi effect.
5. Chốt `fps` một lần (mặc định 30) ngay lúc scaffold — dùng xuyên suốt: `generate-voiceover.py --fps`, `durationInFrames` của Composition (lấy từ tổng frame thật trong `manifest.json`, không dùng giá trị mặc định của template blank).
6. Nếu video có 2 định dạng (16:9 + 9:16), tách 2 Composition riêng dùng đúng bộ ảnh `public/images/16-9/` hoặc `public/images/9-16/` — không dùng chung 1 ảnh kéo giãn cho cả hai tỉ lệ.

## 3. Assets: ảnh, giọng đọc (voice) + âm thanh (SFX)

**Ảnh (nếu dùng phong cách Vox)** — theo skill `imagegen-remotion`, gọi qua antigravity:
1. Đúng 1 beat = 1 ảnh, lưu `public/images/scene-<id>.png` (`<id>` khớp beat trong script/audio).
2. Ảnh là plate thô, không bao giờ vẽ chữ/caption/lower-third/logo giả — chữ đè lên sau bằng code Remotion.
3. Viết 1 "style bible" (nhân vật, palette 3-4 màu, mood) MỘT LẦN, dán nguyên văn vào đầu mọi prompt beat để giữ nhất quán xuyên suốt video.
4. Mỗi ảnh chọn đúng 1 motion intent (zoom-in chậm / pan / parallax / static hold) và chừa khoảng thở phù hợp.

**Voice — dùng Edge-TTS CLI trực tiếp (không qua npm package):**
1. Viết script Python nhỏ gọi `edge-tts --voice vi-VN-NamMinhNeural --text "..." --write-media out.mp3` cho từng dòng thoại, lưu vào `public/audio/vo/` (hoặc dùng thẳng `scripts/generate-voiceover.py <file>.json --fps <fps>` — sinh hàng loạt từ JSON `[{"id","text","voice"}]`, tự đo duration bằng ffprobe, xuất `manifest.json`).
2. Đo duration thật của từng file bằng `ffprobe` — dùng số đó để set `durationInFrames` / thời điểm bắt đầu Sequence, không đoán chừng. Ghi đè mọi timing ước lượng trước đó bằng số đo thật trong `manifest.json`.
3. Đối chiếu tổng thời lượng thật (cộng `durationSec` toàn bộ beat) với độ dài mục tiêu — ước lượng từ/giây lúc viết script (2.5 từ/giây tiếng Anh) có thể lệch nhiều với tiếng Việt. Lệch quá ~15% thì quay lại sửa/cắt script, đừng cố ép timing.
4. Test nhanh 1 câu bằng CLI trước khi viết script generate hàng loạt, tránh lỗi rate/format phát hiện muộn.

**SFX:**
1. Tra cứu cách dùng qua `WebFetch` docs `remotion.dev/docs/sfx` + npm package trước khi code.
2. Tải file free sfx (whoosh, tiếng chạy, tiếng "yoink"...) vào `public/audio/sfx/`. Với video Vox-style, tiết chế hơn hẳn true-crime — chủ yếu chỉ `whoosh` nhẹ cho draw-on/slide-in, tránh SFX kịch tính (record-scratch, wilhelm-scream, bruh) trừ khi user yêu cầu rõ.
3. Trim/fade bằng `ffmpeg -af "afade=t=out:st=..:d=.."` để khớp đúng khoảnh khắc trong scene, không để SFX dài lê thê.
4. Đặt SFX/voice vào đúng Sequence dựa trên frame đã tính từ bước đo duration ở trên.

## 4. Vòng lặp QA hình ảnh khi code animation

Vòng lặp nhanh nhất đã dùng — ưu tiên cách này trước khi mở devtools:
1. `npx remotion still <CompId> out.png --frame=<n>` render vài frame mốc (đầu scene, giữa, cuối, giữa 2 transition).
2. Đọc ảnh bằng Read tool để xem trực tiếp, so sánh với kỳ vọng.
3. Lặp: sửa code → render still → xem lại. Không cần mở trình duyệt cho hầu hết lỗi layout/animation.

Chỉ dùng Chrome DevTools MCP (`new_page`, `navigate_page`, `evaluate_script`, `take_screenshot`) khi:
- Cần debug tương tác thật (click, hover, đo toạ độ phần tử).
- Nghi ngờ cache stale (sửa code nhưng still không đổi) — thử: xoá `node_modules/.cache`, hoặc chỉnh 1 file CSS/tsx làm dummy để trigger rebuild, rồi mới nghi code sai.

Sau mỗi batch Edit: chạy `npx tsc --noEmit` + `npx eslint src` (+ `npx prettier --write` nếu format lệch) trước khi render thử — bắt lỗi type/lint sớm, đỡ phải quay lại nhiều file cùng lúc.

## 5. Render

1. Render thử một đoạn ngắn để kiểm tra sync audio/SFX: `npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>`, rồi `ffprobe`/nghe thử — rẻ hơn nhiều so với render full mỗi lần chỉnh audio timing.
2. Khi ổn, render full: `npx remotion render <CompId> out/<Ten>.mp4` — render cả bản Horizontal và Vertical nếu cần đa định dạng (2 Composition riêng, xem mục 2.6).
3. Xoá file test tạm trong `/tmp` sau khi xong, giữ `out/` sạch chỉ chứa bản final.

## 6. QC trước khi public

1. Gọi skill `qc-video` (hoặc lệnh `/watch out/<file>.mp4 --detail balanced`).
2. Skill tự trích frame + transcript, đối chiếu review: pacing, animation nhân vật, sync caption, âm thanh, tính nhất quán phong cách.
3. Nếu video có yếu tố lịch sử/sự kiện thật — luôn WebSearch đối chiếu tên riêng, mốc thời gian, diễn biến với nguồn đáng tin cậy (đừng chỉ tin trí nhớ mô hình).
4. Ghi lại feedback thành danh sách điểm cần sửa, ưu tiên theo mức ảnh hưởng (nội dung sai > animation cứng > pacing > polish nhỏ).

## 7. Áp dụng feedback

1. Nếu feedback lớn, nhiều mảng (animation, layout, âm thanh, style) → gọi `superpowers:brainstorming` trước khi sửa hàng loạt, để chốt hướng sửa thay vì sửa lan man từng cái một.
2. Hỏi lại user (AskUserQuestion) khi feedback mơ hồ hoặc có nhiều hướng xử lý khác nhau (vd: "giữ nguyên art, chỉ chỉnh code animation" vs "vẽ lại art mới").
3. Feedback về ảnh/phong cách (sai palette, thiếu safe-zone, motion không khớp) → quay lại bước 3 (ảnh), regenerate riêng ảnh lỗi qua antigravity, không làm lại toàn bộ.
4. Sửa theo từng file component liên quan, lặp lại vòng QA hình ảnh (bước 4) sau mỗi thay đổi lớn.
5. Render lại, QC lại (bước 5–6) cho tới khi pass.

## 8. Thumbnail

1. Sinh 3 prompt thumbnail độc lập: chủ thể minh họa chiếm phần lớn khung, 1-2 khối chữ in hoa tối đa 3 từ (đúng ngôn ngữ video), một highlight device (circle/underline/arrow), nền phẳng tương phản cao, đọc được ở size 200px.
2. Nếu video có 2 định dạng, sinh riêng 2 bộ 3 thumbnail (16:9 cho YouTube, 9:16 cho Shorts/Reels) — khác tỉ lệ khung nên không dùng chung.
3. Sinh qua antigravity như bước sinh ảnh scene, lưu vào `public/thumbnails/` (hoặc `public/thumbnails/16-9/` + `public/thumbnails/9-16/`).

## 9. Thêm bản ngôn ngữ khác (khi đã có ít nhất 1 bản hoàn chỉnh)

1. Chỉ tái dùng phần không phụ thuộc ngôn ngữ: ý tưởng/niche, ảnh scene (trừ ảnh có label chữ ngôn ngữ cũ → regenerate riêng), animation spec, loại SFX. Không làm lại từ đầu.
2. Dịch nguyên văn script sang ngôn ngữ mới, giữ đúng số beat/`id` để timing vẫn map 1-1. Không cần fact-check lại (nội dung/claim không đổi).
3. Sinh voice thật cho ngôn ngữ mới (bước 3), giọng theo ngôn ngữ (`en-US-GuyNeural`/`AriaNeural` hoặc `vi-VN-NamMinhNeural`/`HoaiMyNeural`), duration/manifest riêng.
4. Composition + render + QC riêng cho ngôn ngữ mới, output `out/<Ten>-<lang>.mp4`. Thumbnail chữ ngôn ngữ mới lưu `public/thumbnails/<lang>/`.

## Checklist tối ưu — điều nên làm ngay từ đầu (rút ra từ những lần làm chậm/đi vòng)

- [ ] Video kiểu Vox (animated opinion essay) → dùng thẳng skill `vox-video-engine` thay vì làm tay, nó đã có state machine + checkpoint hỏi user cho toàn bộ quy trình dưới đây.
- [ ] Fact-check nội dung kịch bản bằng WebSearch **trước khi** dựng animation, không phải sau QC.
- [ ] Dùng Edge-TTS CLI (`edge-tts` qua pip, hoặc `scripts/generate-voiceover.py`) thẳng từ đầu, bỏ qua thử ElevenLabs/msedge-tts npm nếu không có sẵn API key.
- [ ] Đo duration audio thật bằng ffprobe rồi mới set timing Sequence, không đoán. Đối chiếu tổng thời lượng thật với mục tiêu — tiếng Việt tốc độ âm tiết khác tiếng Anh, ước lượng 2.5 từ/giây có thể lệch nhiều.
- [ ] Chốt `fps` một lần lúc scaffold, dùng xuyên suốt render/voiceover, đừng đổi giữa chừng.
- [ ] Ảnh scene: 1 beat = 1 ảnh, không baked caption/logo, giữ 1 style bible xuyên suốt toàn bộ prompt.
- [ ] Làm 2 định dạng (16:9 + 9:16) → tách thư mục ảnh/audio/Composition riêng ngay từ đầu, không kéo giãn 1 ảnh dùng chung.
- [ ] `npx remotion still` + đọc ảnh là vòng lặp QA chính; DevTools MCP chỉ dùng khi cần tương tác/debug cache.
- [ ] tsc + eslint sau mỗi batch edit, trước khi render.
- [ ] Render đoạn ngắn (`--frames`) để check sync audio trước khi render full.
- [ ] Cài `/watch` + config API key QC **một lần** lúc setup project, không phải mỗi lần QC mới đi tìm cài.
- [ ] Giữ project là thư mục thường trong repo cha ngay từ đầu, tránh nested git repo gây lẫn lộn khi commit/diff.
