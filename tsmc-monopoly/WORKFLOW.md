# Workflow tạo video Remotion (đúc kết từ dự án "War of the Bucket")

Tổng hợp từ toàn bộ lịch sử làm việc thực tế trên dự án này (từ video "essay" đầu tiên đến "War of the Bucket"). Mục tiêu: video sau làm nhanh hơn, ít vòng lặp thừa hơn video trước.

## 0. Setup một lần duy nhất (làm trước, đỡ tốn thời gian giữa chừng)

- Cài sẵn skill QC: `npx --yes skills add bradautomates/claude-video@watch -g -y` (cho lệnh `/watch`).
- Cấu hình `~/.config/watch/.env` với key Whisper/GROQ hoặc OpenAI (để có transcript khi QC video có thoại).
- Cài `edge-tts` qua pip: `pip3 install edge-tts` (dùng CLI trực tiếp, **không** dùng package npm `msedge-tts` — package đó rắc rối, tốn công debug output format mà không đáng).
- Đảm bảo `ffmpeg`/`ffprobe` có sẵn (dùng để đo duration audio, trim/fade sfx).
- Project là thư mục thường trong repo cha, không phải git repo lồng nhau riêng (submodule) — tránh lỗi "diff không thấy gì" khi check ở thư mục cha.

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

## 3. Assets: giọng đọc (voice) + âm thanh (SFX)

**Voice — dùng Edge-TTS CLI trực tiếp (không qua npm package):**
1. Viết script Python nhỏ gọi `edge-tts --voice vi-VN-NamMinhNeural --text "..." --write-media out.mp3` cho từng dòng thoại, lưu vào `public/audio/vo/`.
2. Đo duration thật của từng file bằng `ffprobe` — dùng số đó để set `durationInFrames` / thời điểm bắt đầu Sequence, không đoán chừng.
3. Test nhanh 1 câu bằng CLI trước khi viết script generate hàng loạt, tránh lỗi rate/format phát hiện muộn.

**SFX:**
1. Tra cứu cách dùng qua `WebFetch` docs `remotion.dev/docs/sfx` + npm package trước khi code.
2. Tải file free sfx (whoosh, tiếng chạy, tiếng "yoink"...) vào `public/audio/sfx/`.
3. Trim/fade bằng `ffmpeg -af "afade=t=out:st=..:d=.."` để khớp đúng khoảnh khắc hài hước trong scene, không để SFX dài lê thê.
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
2. Khi ổn, render full: `npx remotion render <CompId> out/<Ten>.mp4` — render cả bản Horizontal và Vertical nếu cần đa định dạng.
3. Xoá file test tạm trong `/tmp` sau khi xong, giữ `out/` sạch chỉ chứa bản final.

## 6. QC trước khi public

1. Gọi skill `qc-video` (hoặc lệnh `/watch out/<file>.mp4 --detail balanced`).
2. Skill tự trích frame + transcript, đối chiếu review: pacing, animation nhân vật, sync caption, âm thanh, tính nhất quán phong cách.
3. Nếu video có yếu tố lịch sử/sự kiện thật — luôn WebSearch đối chiếu tên riêng, mốc thời gian, diễn biến với nguồn đáng tin cậy (đừng chỉ tin trí nhớ mô hình).
4. Ghi lại feedback thành danh sách điểm cần sửa, ưu tiên theo mức ảnh hưởng (nội dung sai > animation cứng > pacing > polish nhỏ).

## 7. Áp dụng feedback

1. Nếu feedback lớn, nhiều mảng (animation, layout, âm thanh, style) → gọi `superpowers:brainstorming` trước khi sửa hàng loạt, để chốt hướng sửa thay vì sửa lan man từng cái một.
2. Hỏi lại user (AskUserQuestion) khi feedback mơ hồ hoặc có nhiều hướng xử lý khác nhau (vd: "giữ nguyên art, chỉ chỉnh code animation" vs "vẽ lại art mới").
3. Sửa theo từng file component liên quan, lặp lại vòng QA hình ảnh (bước 4) sau mỗi thay đổi lớn.
4. Render lại, QC lại (bước 5–6) cho tới khi pass.

## Checklist tối ưu — điều nên làm ngay từ đầu (rút ra từ những lần làm chậm/đi vòng)

- [ ] Fact-check nội dung kịch bản bằng WebSearch **trước khi** dựng animation, không phải sau QC.
- [ ] Dùng Edge-TTS CLI (`edge-tts` qua pip) thẳng từ đầu, bỏ qua thử ElevenLabs/msedge-tts npm nếu không có sẵn API key.
- [ ] Đo duration audio thật bằng ffprobe rồi mới set timing Sequence, không đoán.
- [ ] `npx remotion still` + đọc ảnh là vòng lặp QA chính; DevTools MCP chỉ dùng khi cần tương tác/debug cache.
- [ ] tsc + eslint sau mỗi batch edit, trước khi render.
- [ ] Render đoạn ngắn (`--frames`) để check sync audio trước khi render full.
- [ ] Cài `/watch` + config API key QC **một lần** lúc setup project, không phải mỗi lần QC mới đi tìm cài.
- [ ] Giữ project là thư mục thường trong repo cha ngay từ đầu, tránh nested git repo gây lẫn lộn khi commit/diff.
