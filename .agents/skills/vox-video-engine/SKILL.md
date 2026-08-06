---
name: vox-video-engine
description: Đi từ ý tưởng thô đến video Remotion phong cách Vox (flat 2D vector, kinetic typography, "animated opinion essay") ĐÃ RENDER XONG VÀ QC. Tạo folder project Remotion NGAY TỪ ĐẦU, rồi làm mọi việc tiếp theo (script, beat, ảnh, voice, SFX, code, render, QC) bên trong folder đó. Hỗ trợ output đa dạng — định dạng 16:9, 9:16, hoặc cả hai (2 lượt render riêng), và ngôn ngữ Tiếng Anh hoặc Tiếng Việt cho script, voice, và mọi text trong ảnh/thumbnail. Sau khi đã có 1 bản hoàn chỉnh, có thể thêm bản ngôn ngữ khác cho cùng project mà không phải làm lại từ đầu (chỉ dịch script, sinh voice/render/QC/thumbnail mới). Điều phối skill `video-pipeline` cho phần scaffold/voice/SFX/QA/render/QC, tự lo phần đặc thù Vox (niche, script giọng Vox, ảnh theo kỷ luật imagegen-remotion xuất sẵn `prompts_parsed.json`, user tự sinh ảnh). LUÔN dùng skill này khi user nhắc "Vox style", "video kiểu Vox", "video explainer", "animated opinion essay", hoặc yêu cầu làm video hoàn chỉnh theo phong cách này, kể cả khi không gõ đúng từ "Vox".
compatibility: "Cần skill `video-pipeline` đã cài (điều phối scaffold/voice/SFX/QA/render/QC), và các skill nó phụ thuộc: remotion-best-practices, remotion-create, remotion-markup, video-qc (`/watch`), edge-tts (qua generate-voiceover.py), ffmpeg/ffprobe. Cần skill `imagegen-remotion` cho kỷ luật ảnh. STATE 7 KHÔNG tự sinh ảnh, chỉ xuất `prompts_parsed.json` để user tự sinh ảnh bằng tool bất kỳ (không phụ thuộc Antigravity IDE hay bất kỳ image-gen tool nào có sẵn trong phiên). Cần thư mục cha `remotion-video/` đã có sẵn `WORKFLOW.md` + `scripts/generate-voiceover.py` + skill dùng chung (setup one-time theo `video-pipeline` Bước 0.5)."
---

# Vox Video Engine

LƯU Ý: BẤT KỲ CÂU HỎI NÀO TRONG CÁC STATE DƯỚI ĐÂY, KỂ CẢ CÂU ĐƠN GIẢN NHƯ XÁC NHẬN CHUYỂN SANG STATE TIẾP THEO (trước đây kiểu "gõ 'next'"), PHẢI DÙNG TOOL HỎI DẠNG NÚT BẤM (AskUserQuestion / `ask_user_input_v0`) THAY VÌ GÕ CÂU HỎI THUẦN TEXT — để user chỉ cần chạm chọn thay vì gõ tay. Mẫu chuẩn cho xác nhận chuyển state: 2 option ["Tiếp tục", "Dừng lại, tôi cần chỉnh trước"]. Nếu một câu hỏi có nhiều hơn 4 lựa chọn (vd chọn 1 trong 10 ý tưởng ở STATE 3, hoặc chọn redo state nào ở STATE 12), giữ dạng liệt kê + để user gõ, vì tool giới hạn tối đa 4 option mỗi câu. Có thể gộp tối đa 3 câu hỏi độc lập vào một lần gọi tool nếu chúng thuộc cùng một state (xem STATE 4). Không tự đoán câu trả lời thay user khi câu hỏi còn mơ hồ.

State machine tuyến tính, DỪNG và CHỜ user trả lời sau mỗi state — không tự nhảy cóc. Không dùng em dash (dùng dấu phẩy, hai chấm, ngoặc đơn, hoặc gạch ngang thường).

**Vai trò của skill này**: tạo project Remotion trước tiên (STATE 0), sau đó mọi bước còn lại — hỏi style, chọn niche, viết script, tách beat, sinh ảnh, sinh voice, SFX, code, render, QC, thumbnail — đều thực hiện BÊN TRONG folder project đó, không có bước nào tạo file rời ở ngoài. Phần đặc thù Vox (niche, giọng script, kỷ luật ảnh `imagegen-remotion`) do skill này tự làm; phần scaffold/voice-thật/SFX/QA/render/QC do `video-pipeline` điều phối, vox-video-engine chỉ cấp đúng nội dung/asset tại đúng bước của nó. Nếu `video-pipeline` chưa cài, dừng lại và báo user cài trước khi vào STATE 0.

Kết quả cuối cùng là một file `.mp4` đã render và QC pass, kèm 3 thumbnail, tất cả nằm trong `<ten-video-moi>/`.

## Vox DNA (ghi nhớ xuyên suốt, không phải một state riêng)

**Nguyên tắc Joe Posner (founding producer Vox)**: video là "animated opinion essay". Không có cảnh người ngồi bàn (no desks), không dùng phỏng vấn talking-head làm xương sống. Toàn bộ hình ảnh là motion graphics/minh họa, không phải cảnh quay thật.

**Giọng văn**: hội thoại, trực tiếp, có thể xưng "we"/đặt câu hỏi tu từ để mở hook, nhưng vẫn dựa trên dữ kiện cụ thể (số liệu, tên, năm). Ấm hơn, gần gũi hơn true-crime, nhưng vẫn có cấu trúc lập luận rõ (claim → bằng chứng → ý nghĩa).

**Hình ảnh**: flat 2D, không gradient, không đổ bóng, không gloss. Bảng màu giới hạn 3-4 màu cố định xuyên suốt cả video. Kinetic typography, highlighter/circle nhấn mạnh, bản đồ và biểu đồ đơn giản hóa, nhân vật minh họa hình học không chi tiết mặt trừ khi cần biểu cảm.

**Phụ đề động (kinetic subtitle, bắt buộc, không phải tùy chọn)**: chữ xuất hiện theo từng cụm 2-3 từ đồng bộ nhịp voiceover, KHÔNG phải cả câu bung ra cùng lúc trong một hộp trắng cố định. Từ khóa (số liệu, tên riêng, địa danh, kết luận) tô màu accent (vàng/đỏ) khác màu nền chữ thường. Chữ hiển thị tự do trực tiếp trên nền video (dùng stroke/drop-shadow đủ độ tương phản để đọc được), không đặt trong khung chữ nhật nền trắng đặc — khung nền trắng che đồ họa và đọc chậm hơn kinetic. Áp dụng ngay từ STATE 7c (animation spec) và code hóa ở STATE 10.

**SFX phong phú theo khoảnh khắc, không chỉ whoosh**: whoosh cho chuyển cảnh/pan/bay lướt; pop/click ngắn cho icon/số liệu/cờ/con dấu xuất hiện; gavel strike cho khoảnh khắc quyết định/bỏ phiếu/phán quyết; clock ticking tăng dần cho đoạn chờ đợi/xung đột/countdown. Với đồ họa phẳng 2D, SFX chiếm phần lớn cảm nhận mượt mà, đừng để mỗi video chỉ có một loại SFX. Chi tiết chọn/đặt SFX ở STATE 9.

## STATE 0, SCAFFOLD PROJECT TRƯỚC TIÊN (video-pipeline Bước 0.5)

Hỏi: "Đặt tên ngắn cho project này (slug không dấu, không khoảng trắng, vd `why-cities-trap-heat`)? Có thể đổi tên/nội dung cụ thể sau khi chọn niche/ý tưởng ở các bước tiếp theo, tên này chỉ để tạo folder ngay bây giờ."

Sau khi có tên, chạy ngay từ thư mục cha `remotion-video/` (mặc định fps 30, dùng xuyên suốt STATE 8 và STATE 10, không đổi giữa chừng):
```bash
npx create-video@latest --yes --blank <ten-video-moi>
cd <ten-video-moi>
npx skills add remotion-dev/skills -g -y   # cài remotion-best-practices, remotion-create, remotion-markup dùng ở STATE 10

mkdir -p .claude/skills .agents/skills scripts
cp ../WORKFLOW.md .
cp ../scripts/generate-voiceover.py scripts/
cp -r ../.claude/skills/video-pipeline ../.claude/skills/qc-video .claude/skills/
cp -r ../.agents/skills/video-pipeline ../.agents/skills/qc-video .agents/skills/
```

Nếu thư mục cha `remotion-video/` chưa có `WORKFLOW.md`/`scripts/generate-voiceover.py`/skill dùng chung, dừng lại và báo user cần setup one-time đó trước (xem `compatibility` trong `video-pipeline/SKILL.md`).

Từ đây, MỌI file của các state sau (script, ảnh, audio, code) đều nằm trong `<ten-video-moi>/`, không tạo ở ngoài.

Kết thúc bằng AskUserQuestion: "Đã tạo project tại `<ten-video-moi>/`. Tiếp tục?" — options: ["Tiếp tục", "Dừng lại, tôi cần kiểm tra project trước"].

DỪNG. CHỜ.

## STATE 1, TÀI LIỆU THAM CHIẾU PHONG CÁCH (tùy chọn)

Nếu thư mục cha `remotion-video/` đã có `BRAND-GUIDE.md`, đọc file này trước khi hỏi — nó chứa palette/font/motion/SFX/công thức thumbnail đã chốt từ video trước, dùng làm mặc định thay cho placeholder chung chung.

Dùng AskUserQuestion: "Bạn có brand guide / màu sắc / font / video mẫu riêng muốn Claude bám theo không?" — options: ["Có, tôi sẽ đính kèm file/link khác", "Dùng mặc định kênh (BRAND-GUIDE.md nếu có, hoặc Vox gốc: navy, cream, đỏ nhấn, teal nhạt)"].

Nếu chọn "Có", chờ user đính kèm rồi đọc và ưu tiên nó hơn `BRAND-GUIDE.md`. Nếu chọn mặc định: có `BRAND-GUIDE.md` thì dùng nguyên palette/font/motion/SFX trong đó (không hỏi lại từng mục), không có thì dùng mặc định Vox gốc (navy, cream, đỏ nhấn, teal nhạt).

DỪNG. CHỜ.

## STATE 2, NICHE

Dùng AskUserQuestion: "Chủ đề video hôm nay thuộc nhóm nào?" — options: ["Chính trị & xã hội", "Kinh tế & công nghệ", "Lịch sử & văn hóa", "Môi trường / tự nhập chủ đề khác"].

Nếu chọn "Môi trường / tự nhập chủ đề khác", để user gõ tự do tên niche/chủ đề rộng (không phải ý tưởng cụ thể — ý tưởng cụ thể sẽ sinh ở STATE 3).

State này CHỈ chốt niche/nhóm rộng, KHÔNG hỏi thêm chủ đề cụ thể ở đây (tránh trùng với STATE 3, nơi duy nhất sinh và chọn ý tưởng cụ thể).

DỪNG. CHỜ.

## STATE 3, 10 Ý TƯỞNG

Sinh đúng 10 ý tưởng video trong niche đã chọn ở STATE 2. Mỗi ý tưởng là MỘT câu hỏi cụ thể mà video sẽ trả lời (đúng tinh thần Vox: "Why do cities trap heat?", "Why are shipping containers all the same size?"). Không trùng chủ đề con. Mỗi ý tưởng phải có một hook cụ thể (số liệu, sự kiện, địa danh).

Xuất danh sách 1-10, mỗi dòng một ý, không thêm gì khác. Kết thúc đúng: "Chọn một số, hoặc mô tả chủ đề khác." (10 lựa chọn vượt giới hạn 4 option của AskUserQuestion, giữ dạng liệt kê để user gõ số thay vì tool nút bấm.)

DỪNG. CHỜ.

## STATE 4, ĐỘ DÀI + ĐỊNH DẠNG + NGÔN NGỮ

Dùng AskUserQuestion, gộp 3 câu trong MỘT lần gọi (đúng giới hạn tối đa 3 câu/lần của tool):
1. "Video dài bao lâu?" — options: ["1 phút", "3 phút", "5 phút", "8 phút hoặc dài hơn (ghi rõ ở tin nhắn sau)"]
2. "Định dạng đích?" — options: ["Horizontal 16:9", "Vertical 9:16", "Cả hai"] — quyết định aspect-ratio dùng ở STATE 7. **Chọn cả hai nghĩa là làm 2 lượt độc lập từ STATE 7 trở đi** (2 bộ ảnh, có thể 2 Composition khi render ở STATE 10), không phải 1 ảnh kéo giãn dùng chung cho cả hai tỉ lệ.
3. "Ngôn ngữ output?" — options: ["Tiếng Anh", "Tiếng Việt"] — áp dụng cho script (STATE 5), voice (STATE 8), mọi label/text xuất hiện trong ảnh và thumbnail (STATE 7, STATE 12). Giọng Vox (hội thoại, câu hỏi tu từ, cấu trúc claim → bằng chứng → ý nghĩa) giữ nguyên DNA ở cả hai ngôn ngữ, chỉ đổi ngôn ngữ viết.

Nếu tên project ở STATE 0 chỉ là tạm/generic so với ý tưởng vừa chọn, hỏi thêm (AskUserQuestion riêng, 2 options: ["Đổi tên folder cho khớp nội dung", "Giữ nguyên tên hiện tại"]) rồi `mv <ten-cu> <ten-moi>` trong `remotion-video/` nếu chọn đổi.

DỪNG. CHỜ.

## STATE 5, SCRIPT (VOX VOICE) + FACT-CHECK BẮT BUỘC

Tính từ theo 2.5 từ/giây: 1 phút khoảng 150 từ, 2 phút khoảng 300, 3 phút khoảng 450, 5 phút khoảng 750, 8 phút khoảng 1200. Sai số trong 5%.

Quy tắc kịch bản:
1. Narration liên tục, một khối văn xuôi. Không header, không chỉ dẫn hình ảnh.
2. **Cold open bắt buộc là nghịch lý/xung đột/tranh cãi, không phải bối cảnh an toàn kiểu giáo trình.** 3-10 giây đầu là nơi khán giả quốc tế quyết định bỏ đi hay ở lại — mở bằng cảnh minh họa trung tính rồi mới dẫn vào câu hỏi (kiểu "hãy tưởng tượng bạn...") là quá hiền, tụt view sớm. Thay vào đó mở thẳng bằng câu hỏi nghịch lý ("Why does a tiny town near London dictate the exact time for the entire planet?") hoặc hình ảnh đối đầu/tranh cãi ngay từ câu đầu tiên, rồi mới lùi lại giải thích bối cảnh.
3. Giọng hội thoại nhưng có cấu trúc lập luận: đặt vấn đề, dẫn chứng cụ thể (số liệu, sự kiện), rồi rút ra ý nghĩa rộng hơn.
4. Câu ngắn, một ý một câu (để cắt beat sau này dễ). Có thể xen câu hỏi tu từ.
5. Dữ kiện phải chính xác, không bịa số liệu/tên. Nếu không chắc, viết vòng qua.
6. Không quảng cáo, không kêu gọi subscribe.
7. Kết bằng một câu chốt mở rộng, câu hỏi để lại cho người xem hoặc một nhận định sắc.

Viết script bằng đúng ngôn ngữ đã chọn ở STATE 4 (Anh hoặc Việt). Web_search có thể trả kết quả bằng ngôn ngữ khác, luôn diễn giải lại claim sang ngôn ngữ script khi đưa vào bản viết.

**Bắt buộc trước khi coi script hoàn tất (khớp Bước 1 của `video-pipeline`, không lùi việc này tới QC)**: mọi claim kiểm chứng được (sự kiện, tên riêng, mốc thời gian, số liệu) phải `web_search` đối chiếu NGAY tại state này. Đánh dấu rõ trong script nếu có twist/kết cần giữ nguyên khi scaffold code sau. Chỉ qua STATE 6 khi không còn claim sai đã biết.

Lưu script trực tiếp vào `<ten-video-moi>/<ten-video>-script.md` (project đã có sẵn từ STATE 0), chia theo scene, có visual/audio/SFX/lời dẫn (khớp format Bước 1 của `video-pipeline`).

Format xuất:
```
TARGET: [N] từ / [độ dài]
[kịch bản, một khối liên tục]
FINAL: [N thực tế] từ
FACT-CHECK: [liệt kê claim đã đối chiếu + nguồn, hoặc "không có claim cần kiểm chứng"]
```
Kết thúc bằng AskUserQuestion: "Đã lưu script vào `<ten-video>-script.md`. Tách beat luôn?" — options: ["Tiếp tục tách beat", "Dừng lại, tôi muốn sửa script trước"].

DỪNG. CHỜ.

## STATE 6, TÁCH BEAT (ước lượng, sẽ ghi đè bằng số đo thật ở STATE 8)

Mỗi beat phủ khoảng 2-3 giây narration (~5-8 từ ở 2.5 từ/giây). Một câu ngắn = một beat, câu dài tách theo mệnh đề tự nhiên. Mỗi beat gán một `id` dạng `vo_01`, `vo_02`... để dùng xuyên suốt các state sau (ảnh, voice, SFX, Sequence).

Xuất bảng: `id`, timecode bắt đầu ƯỚC LƯỢNG (tích lũy theo 2.5 từ/giây, sẽ bị ghi đè ở STATE 8), nguyên văn từ ngữ của beat đó. Cập nhật bảng này vào `<ten-video>-script.md` (nối thêm, không ghi đè phần script gốc).

Kết thúc bằng AskUserQuestion: "Đã tách xong beat. Sinh ảnh Vox cho từng beat luôn?" — options: ["Tiếp tục sinh ảnh", "Dừng lại, tôi muốn sửa bảng beat trước"].

DỪNG. CHỜ.

## STATE 7, SINH ẢNH VOX (theo skill `imagegen-remotion`, xuất `prompts_parsed.json` cho user tự sinh ảnh)

Mọi ảnh lưu trực tiếp vào `<ten-video-moi>/public/images/` (thư mục này đã có sẵn từ khung Remotion tạo ở STATE 0) — đây chính là asset mà STATE 10 (scaffold code) sẽ dùng.

**Nếu STATE 4 chọn cả hai định dạng (16:9 + 9:16)**: chạy 7a-7e hai lượt độc lập, mỗi lượt có safe-zone riêng theo đúng tỉ lệ (16:9 chừa 1/3 dưới hoặc trên cho caption, margin ~6% mọi cạnh; 9:16 chừa top ~15% cho UI overlay, middle-to-lower third cho caption dạng TikTok-style). Không dùng lại một ảnh cho cả hai tỉ lệ. Lưu vào hai thư mục con: `public/images/16-9/scene-<id>.png` và `public/images/9-16/scene-<id>.png`, mỗi thư mục có manifest riêng.

Label (nếu prompt cần 1 nhãn ngắn 1-4 từ trên paper strip/stamp) viết bằng đúng ngôn ngữ đã chọn ở STATE 4, phần còn lại của prompt (SCENE, STYLE BLOCK, CLOSER) vẫn giữ tiếng Anh vì đây là câu lệnh cho mô hình sinh ảnh.

### 7a. Kiểm tra và áp dụng skill `imagegen-remotion`

- Nếu skill này đã có trong danh sách skill khả dụng, coi các quy tắc của nó là bắt buộc cho mọi ảnh sinh ra ở state này.
- Nếu chưa có, gọi `search_skills(["imagegen remotion", "video asset", "scene plate"])` rồi `suggest_skills` để user thêm; trong lúc chờ vẫn tự áp dụng thủ công các quy tắc tóm tắt ở 7b-7c bên dưới để không chặn tiến độ.

Quy tắc lõi bắt buộc lấy từ `imagegen-remotion` (không được bỏ qua):
- 1 beat (`id` từ STATE 6) = đúng 1 ảnh, không gộp nhiều beat vào một ảnh, không thiếu.
- Mỗi ảnh là "plate thô" cho code: không bao giờ vẽ chữ/caption/lower-third/logo giả vào ảnh, vì Remotion sẽ code chữ đè lên sau ở STATE 10.
- Text-safe zone rõ ràng theo tỉ lệ khung hình đã chọn ở STATE 4.
- Motion-readiness: mỗi ảnh chọn đúng 1 motion intent (slow zoom-in / pan trái-phải / parallax / static hold cho title card) và chừa khoảng thở quanh chủ thể phù hợp motion đó.
- **Nhịp chuyển động không được đều đều xuyên suốt video**: nếu 3+ beat liên tiếp đều dùng cùng một motion nhẹ (Ken Burns đều đều), khán giả buồn ngủ. Với beat chứa số liệu/địa danh quan trọng (bản đồ, biểu đồ, kết quả bỏ phiếu), dùng camera zoom-out toàn cảnh rồi zoom-in sâu vào điểm cụ thể trên đó thay vì pan/zoom chung chung. Với chuỗi beat cùng loại dữ kiện dồn dập (kết quả bỏ phiếu, đếm số liên tiếp), rút ngắn khoảng cách xuất hiện giữa các beat để tạo nhịp giật nhanh theo voiceover, tăng kịch tính thay vì để mỗi số liệu tự trôi ra đều nhau.
- Cross-scene consistency: viết 1 "style bible" MỘT LẦN, dán nguyên văn vào đầu mọi prompt beat, chỉ đổi phần hành động/bối cảnh riêng.
- Aspect-ratio discipline: toàn bộ project dùng chung đúng 1 tỉ lệ đã chọn ở STATE 4.

### 7b. Style bible (viết 1 lần trước beat đầu tiên)

Chốt: mô tả chủ thể/nhân vật lặp lại nếu video có nhân vật cố định, palette 3-4 màu từ STATE 1, hướng sáng/mood, render style = Vox flat 2D vector (khớp STYLE BLOCK bên dưới). Dán y nguyên vào đầu mọi prompt của mọi beat.

### 7c. Viết prompt cho từng beat (đúng 1 ảnh/beat)

Cấu trúc mỗi prompt: [style bible] + [hành động/bối cảnh riêng của beat, một ý tưởng hình ảnh trung tâm duy nhất] + STYLE BLOCK + CLOSER.

**STYLE BLOCK (chèn nguyên văn vào MỌI prompt):**
```
Flat 2D vector illustration in the style of Vox explainer videos: clean geometric shapes, no gradients, no drop shadows, no gloss, minimal thin outlines, generous negative space reserved for kinetic-typography overlay. Bold but limited color palette of 3 to 4 flat colors held consistent across the whole project (state the exact palette once, e.g. navy, cream, red accent, muted teal). Simple geometric character silhouettes without facial detail unless the beat needs a specific expression. Editorial infographic elements where relevant: simplified maps, bar or line charts, icons, timeline bars, arrows, circles used as highlight devices. Clean modern bold sans-serif type only where a label is specified. Clarity over realism, poster-like composition, crisp vector edges. No baked-in captions, no fake lower-thirds, no fake logos or UI elements.
```

**CLOSER (chèn nguyên văn cuối MỌI prompt):**
```
The composition stays flat, clean, and editorial with generous negative space, built for smooth kinetic-typography motion. NOT photorealistic, NOT painterly, NOT paper collage, NOT 3D render, no clutter, no watermark, no logos, no text beyond the specified label. Premium explainer-video vector aesthetic, matching the project's fixed aspect ratio, ultra-detailed, crisp vector lines.
```

Lưu file mỗi ảnh vào `public/images/scene-<id>.png` (nếu chỉ 1 định dạng), hoặc `public/images/<16-9|9-16>/scene-<id>.png` (nếu STATE 4 chọn cả hai, theo đúng cấu trúc thư mục đã nêu ở đầu STATE 7). Kèm bảng manifest handoff cho STATE 10 (một manifest riêng mỗi định dạng nếu có 2):
```
Scene <id> — <tên beat> (timecode ước lượng từ STATE 6, sẽ ghi đè ở STATE 8)
  asset: public/images/scene-<id>.png
  motion: <motion intent đã chọn>
  text-safe: <vùng chừa trống cho caption/kinetic typography>
```

Animation spec JSON (giữ để làm căn cứ cho `remotion-best-practices`/`remotion-create`/`remotion-markup` ở STATE 10, KHÔNG phải deliverable độc lập):
```ts
interface BeatAnimation {
  beatId: string;           // khớp id STATE 6, vd "vo_03"
  startFrame: number;       // ghi đè bằng số đo thật ở STATE 8 (manifest.json, fps từ STATE 0)
  durationFrames: number;   // ghi đè bằng số đo thật ở STATE 8
  elements: {
    type: 'title-text' | 'icon' | 'chart' | 'map' | 'character' | 'highlight-circle' | 'arrow' | 'stat-counter';
    enterAtFrame: number;
    motion: 'slide-left' | 'slide-up' | 'fade-scale' | 'draw-on' | 'count-up';
    easing: 'easeOutCubic' | 'spring';
    label?: string;
  }[];
}
```
Dùng `interpolate()` và `spring()` của Remotion khi scaffold, KHÔNG dùng frame-hold kiểu stop-motion (đó là DNA true-crime, không phải Vox).

### 7d. Xuất `prompts_parsed.json` cho user tự sinh ảnh

Không tự gọi tool sinh ảnh. Ráp prompt hoàn chỉnh của mọi beat (style bible + hành động/bối cảnh riêng + STYLE BLOCK + CLOSER, đúng thứ tự Scene 1 → Scene N, không gộp không đảo) rồi ghi vào `public/images/prompts_parsed.json` (hoặc `public/images/<16-9|9-16>/prompts_parsed.json`, một file riêng mỗi định dạng nếu STATE 4 chọn cả hai):
```json
[
  {
    "id": "vo_01",
    "output": "public/images/scene-vo_01.png",
    "motion": "slow-zoom-in",
    "textSafeZone": "bottom third, margin 6%",
    "prompt": "<toàn văn prompt ráp sẵn: style bible + hành động/bối cảnh riêng beat + STYLE BLOCK + CLOSER>"
  }
]
```
`output` phải khớp đúng đường dẫn `public/images/scene-<id>.png` (hoặc `public/images/<16-9|9-16>/scene-<id>.png`) mà STATE 10 sẽ dùng.

Báo user: "Đã xuất `prompts_parsed.json` ([N] prompt). Tự sinh ảnh bằng tool bất kỳ (Gemini/Nano Banana, Midjourney, v.v.) từ từng prompt trong file, lưu đúng tên/đường dẫn theo trường `output`." Dùng AskUserQuestion: "Đã tự sinh xong ảnh và lưu đúng đường dẫn `output` trong prompts_parsed.json chưa?" — options: ["Xong rồi, kiểm tra tiếp", "Chưa, tôi cần thêm thời gian"].

DỪNG. CHỜ user xác nhận đã sinh xong ảnh trước khi tiếp tục.

Sau khi user xác nhận, đếm lại số file thực tế trong `public/images/` khớp số entry trong `prompts_parsed.json` trước khi qua 7e; nếu thiếu, liệt kê rõ `id` còn thiếu và tiếp tục CHỜ.

### 7e. Clarity check trước khi giao (rút gọn từ `imagegen-remotion` §9)

1. Số ảnh đúng bằng số beat, không gộp không thiếu?
2. Nhân vật/palette/ánh sáng/render style đồng nhất mọi ảnh (khớp style bible)?
3. Mọi ảnh đúng tỉ lệ khung hình đã chọn?
4. Mỗi ảnh có safe-zone rõ cho text, và KHÔNG có caption/logo/UI giả bị vẽ vào?
5. Mỗi ảnh đủ khoảng thở cho motion intent đã chọn?

Nếu có câu trả lời "không", regenerate riêng ảnh lỗi đó, không giao cả bộ khi còn một mắt xích hỏng.

Kết thúc bằng AskUserQuestion: "Ảnh đã sẵn sàng trong public/images/. Sinh voice thật luôn?" — options: ["Tiếp tục sinh voice", "Dừng lại, tôi muốn duyệt lại ảnh trước"].

DỪNG. CHỜ.

## STATE 8, VOICE THẬT (bàn giao cho video-pipeline Bước 3)

Build file JSON theo đúng format Bước 3 của `video-pipeline`, một object mỗi beat (`id` khớp STATE 6/7), lưu vào `<ten-video-moi>/`:
```json
[
  {"id": "vo_01", "text": "<nguyên văn beat 1>", "voice": "en-US-GuyNeural"},
  {"id": "vo_02", "text": "<nguyên văn beat 2>", "voice": "en-US-GuyNeural"}
]
```

Voice bắt buộc khớp ngôn ngữ đã chọn ở STATE 4 (không được lệch với ngôn ngữ script STATE 5). Dùng AskUserQuestion: "Giọng nam hay nữ?" — options: ["Nam", "Nữ"], rồi map:
- Tiếng Anh: `en-US-GuyNeural` (nam) hoặc `en-US-AriaNeural` (nữ)
- Tiếng Việt: `vi-VN-NamMinhNeural` (nam) hoặc `vi-VN-HoaiMyNeural` (nữ)

Không dùng ElevenLabs hay msedge-tts (npm) — đúng quy tắc `video-pipeline`, `edge-tts` CLI qua pip là đường đã kiểm chứng.

Chạy trong `<ten-video-moi>/`: `python3 scripts/generate-voiceover.py <file>.json --fps 30` (fps khớp project Remotion tạo ở STATE 0) → sinh `public/audio/vo/<id>.mp3` + `public/audio/vo/manifest.json` chứa `durationSec`/`durationInFrames` đo thật bằng ffprobe.

**Ghi đè bảng beat ở STATE 6 và animation spec ở STATE 7c bằng số đo thật trong `manifest.json`** — không dùng ước lượng 2.5 từ/giây nữa từ đây trở đi.

**Đối chiếu tổng thời lượng thật**: cộng `durationSec` toàn bộ beat trong `manifest.json`, so với độ dài mục tiêu đã chọn ở STATE 4. Ước lượng 2.5 từ/giây ở STATE 5 là chuẩn tiếng Anh và có thể lệch đáng kể với tiếng Việt (tốc độ âm tiết khác). Nếu tổng thời lượng thật lệch quá ~15% so với mục tiêu, dùng AskUserQuestion: "Video thực tế dài [X]s, lệch so với mục tiêu [Y]s. Xử lý sao?" — options: ["Quay lại STATE 5 sửa/cắt script", "Giữ nguyên độ dài thực tế, không sửa"]. Nếu lệch trong khoảng chấp nhận được, bỏ qua bước này và tiếp tục.

Kết thúc bằng AskUserQuestion: "Voice đã có duration thật. Sinh SFX luôn?" — options: ["Tiếp tục sinh SFX", "Dừng lại, tôi muốn nghe thử voice trước"].

DỪNG. CHỜ.

## STATE 9, SFX (bàn giao cho video-pipeline Bước 4)

Vox dùng SFX tiết chế (không lạm dụng, khác hẳn kiểu SFX kịch tính true-crime) nhưng KHÔNG chỉ một loại whoosh cho cả video — với đồ họa phẳng 2D, SFX chiếm phần lớn cảm nhận mượt mà. Map theo loại khoảnh khắc:
- **whoosh** (nhẹ): draw-on/slide-in/pan/chuyển cảnh bản đồ, motion `draw-on` hoặc `highlight-circle`.
- **pop/click** (ngắn, khô): icon/số liệu/cờ/con dấu/stat-counter xuất hiện — motion `fade-scale` hoặc `count-up` ở beat có số liệu cụ thể.
- **gavel strike** (uy nghiêm): khoảnh khắc quyết định/hội nghị/phán quyết/bỏ phiếu — dùng đúng 1-2 lần ở cao trào, không lạm dụng.
- **clock ticking tăng dần**: đoạn xung đột kéo dài/chờ đợi/countdown/nhân vật từ chối chấp nhận kết quả — tăng tempo dần theo voiceover rồi cắt đột ngột khi kết thúc căng thẳng.
Không cần SFX cho fade-scale/static hold thường, trừ khi beat là mở đầu/kết thúc video hoặc rơi vào 4 loại trên.

Ưu tiên tái dùng file có sẵn trong `public/audio/sfx/` (whoosh, skedaddle, triggered, record-scratch, wilhelm-scream, bruh) trước khi tải mới. `whoosh` dùng được ngay; `pop/click`, `gavel strike`, `clock ticking` thường CHƯA có sẵn trong thư viện mặc định — cần tìm/tải file free (WebFetch nguồn free-SFX) rồi lưu vào `public/audio/sfx/` trước khi dùng. Các SFX kịch tính khác (record-scratch, wilhelm-scream, bruh) KHÔNG hợp tông Vox, tránh dùng trừ khi user yêu cầu rõ.

Đặt SFX vào đúng frame dựa theo `manifest.json` thật ở STATE 8, không áng chừng. Trim/fade bằng `ffmpeg -af "afade=t=out:st=..:d=.."` nếu file dài hơn khoảnh khắc cần nhấn.

Kết thúc bằng AskUserQuestion: "SFX đã đặt xong. Dựng code và render luôn?" — options: ["Tiếp tục dựng code", "Dừng lại, tôi muốn chỉnh SFX trước"].

DỪNG. CHỜ.

## STATE 10, DỰNG CODE + QA + RENDER + QC (bàn giao cho video-pipeline Bước 2, 5, 6, 7)

Gọi `remotion-best-practices` làm router (dẫn tới `remotion-create` + `remotion-markup` phù hợp). Nếu cần định hướng thẩm mỹ rõ, gọi thêm `frontend-design`. Input cho bước này: ảnh ở `public/images/` (STATE 7), animation spec JSON (STATE 7c, đã ghi đè timing thật ở STATE 8), audio ở `public/audio/vo/` + manifest.json (STATE 8), SFX ở `public/audio/sfx/` (STATE 9). Toàn bộ đã nằm sẵn trong `<ten-video-moi>/` từ STATE 0.

Theo đúng vòng lặp của `video-pipeline`:
1. **Bước 2**: cài package thiếu qua `npx remotion add <pkg>` trước khi dùng, theme màu/font gom 1 file. Đây là lúc viết Composition/Scene THẬT (STATE 0 chỉ tạo khung project rỗng, chưa có scene nào). Composition dùng đúng fps=30 đã chốt ở STATE 0 (khớp `generate-voiceover.py --fps 30` ở STATE 8), và `durationInFrames` của Composition lấy từ TỔNG frame thật trong `manifest.json` (STATE 8), không dùng giá trị mặc định của template blank.
   - **Subtitle component bắt buộc kinetic**: chia `text` của beat thành cụm 2-3 từ, dùng `interpolate()`/`spring()` theo `frame` để lần lượt hiện từng cụm đúng nhịp trong `durationInFrames` của beat (không hiện cả câu cùng lúc). Từ khóa (số/tên riêng/địa danh/kết luận) tô màu accent riêng trong cùng span. Render chữ trực tiếp trên nền video (text-shadow/stroke để đủ tương phản), KHÔNG bọc trong `<div>`/`<span>` nền màu đặc cố định kiểu hộp thoại — tránh pattern che đồ họa nền.
   - **Motion pacing không đều đều**: với scene có `type: 'map' | 'chart' | 'stat-counter'` mang số liệu/địa danh trọng tâm, dùng cặp transform zoom-out rồi zoom-in vào điểm cụ thể thay vì một phép zoom/pan tuyến tính duy nhất suốt beat. Với chuỗi beat liên tiếp cùng loại dữ kiện dồn dập (đếm phiếu, liệt kê số liệu), rút ngắn khoảng cách `enterAtFrame` giữa các phần tử để tạo nhịp giật nhanh khớp voiceover.
2. **Bước 5 (QA hình ảnh)**: `npx remotion still <CompId> /tmp/check.png --frame=<n>` ở vài mốc, đọc ảnh bằng Read tool so kỳ vọng Vox (flat, không gloss, safe-zone đúng), `npx tsc --noEmit && npx eslint src` sau mỗi batch sửa.
3. **Bước 6 (render)**: check sync đoạn ngắn trước (`npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>`). Nếu STATE 4 chọn cả hai định dạng, đây là 2 Composition riêng (mỗi cái dùng đúng bộ ảnh `public/images/16-9/` hoặc `public/images/9-16/` từ STATE 7) → render full ra 2 file: `out/<Ten>-16x9.mp4` và `out/<Ten>-9x16.mp4`.
4. **Bước 7 (QC)**: gọi `video-qc` (`/watch out/<file>.mp4`) cho từng file render ra, kể cả khi có 2 định dạng.

**Nếu QC ra ⚠️/❌ liên quan hình ảnh/phong cách Vox** (sai palette, thiếu safe-zone, motion không khớp): quay lại STATE 7d, xuất riêng entry ảnh lỗi vào `prompts_parsed.json`, báo user tự sinh lại đúng ảnh đó, không làm lại toàn bộ. **Nếu liên quan phần khác** (animation code, sync audio, layout): theo đúng Bước 8 của `video-pipeline` (feedback mơ hồ → hỏi lại user bằng AskUserQuestion, nhiều mảng cùng lúc → gọi `superpowers:brainstorming` trước khi sửa hàng loạt), rồi quay lại Bước 5–7 tới khi QC pass.

Kết thúc bằng AskUserQuestion: "Video đã render và QC pass tại out/<Ten>.mp4 (hoặc cả hai file nếu chọn 2 định dạng ở STATE 4). Tạo nội dung SEO tối ưu luôn?" — options: ["Tiếp tục tạo SEO", "Dừng lại, tôi muốn xem video trước"].

DỪNG. CHỜ.

## STATE 11, TẠO NỘI DUNG TỐI ƯU SEO

Sinh các phần siêu dữ liệu (metadata) phục vụ cho việc upload lên YouTube:
- **Tiêu đề (Title)**: Cung cấp ít nhất 3 lựa chọn tiêu đề tối ưu hóa công cụ tìm kiếm (SEO), kích thích tò mò (clickbaity) nhưng vẫn bám sát câu hỏi nghịch lý/chủ đề lõi của video.
- **Mô tả (Description)**: Viết đoạn mô tả tóm tắt nội dung video, lời kêu gọi hành động (CTA), danh sách hashtags, và bắt buộc kèm theo **bảng Timestamps (Chapters)** chi tiết cho các phân cảnh (scene). Tính toán mốc thời gian (timestamps) thực tế bằng cách cộng dồn các giá trị `durationSec` đo thật từ `manifest.json` thu được ở STATE 8.
- **Thẻ từ khóa (Tags)**: Tạo danh sách các từ khóa SEO có lượng tìm kiếm cao và liên quan trực tiếp đến chủ đề/niche của video.

Nếu video hỗ trợ cả hai định dạng (16:9 + 9:16) hoặc có nhiều phiên bản ngôn ngữ khác nhau (Tiếng Việt và Tiếng Anh), tạo riêng nội dung SEO chi tiết cho từng phiên bản tương ứng.

Kết thúc bằng AskUserQuestion: "Đã hoàn thành nội dung tối ưu SEO. Sinh 3 thumbnail luôn?" — options: ["Tiếp tục sinh thumbnail", "Dừng lại để chỉnh sửa nội dung SEO"].

DỪNG. CHỜ.

## STATE 12, THUMBNAIL

Sinh 3 prompt thumbnail, mỗi prompt một block độc lập, phong cách Vox pushed louder cho size nhỏ:
- Một chủ thể minh họa flat 2D chiếm phần lớn khung hình.
- 1-2 khối chữ in hoa condensed, tối đa 3 từ mỗi khối, từ khóa hook của video, viết bằng đúng ngôn ngữ đã chọn ở STATE 4.
- Một highlight device (circle/underline/arrow) màu đỏ hoặc vàng từ bảng màu dự án.
- Nền phẳng, một trong các màu chủ đạo của dự án, tương phản cao, không chi tiết nhỏ chết ở size 200px.
- Cùng STYLE BLOCK và CLOSER ở STATE 7, đổi "no text beyond the specified label" thành "no text beyond the specified thumbnail words".

Nếu STATE 4 chọn cả hai định dạng, sinh riêng 2 bộ 3 thumbnail (một bộ 16:9, một bộ 9:16), vì thumbnail YouTube (16:9) và cover Shorts/Reels (9:16) khác tỉ lệ khung.

Xuất theo đúng cơ chế 7d: ghi 3 prompt vào `public/thumbnails/prompts_parsed.json` (hoặc `public/thumbnails/<16-9|9-16>/prompts_parsed.json` nếu 2 định dạng), mỗi entry có `id` (`thumb_1`, `thumb_2`, `thumb_3`), `output` (`public/thumbnails/thumb_<n>.png`), `prompt`. Báo user tự sinh ảnh và lưu đúng `output`, dùng AskUserQuestion xác nhận đã xong như 7d trước khi coi là hoàn tất. Đây là deliverable cuối cùng, đi kèm file `.mp4` từ STATE 10 và nội dung SEO từ STATE 11.

Kết thúc bằng AskUserQuestion: "Hoàn tất: video đã render, QC pass, có nội dung SEO, kèm 3 thumbnail, tất cả trong `<ten-video-moi>/`. Bạn muốn làm gì tiếp?" — options: ["Làm video mới", "Thêm phiên bản ngôn ngữ khác cho video này", "Làm lại một bước (redo)", "Kết thúc ở đây"].

Nếu chọn "Thêm phiên bản ngôn ngữ khác", chuyển sang STATE 13. Nếu chọn "Làm lại một bước", hỏi tiếp (text, vì có hơn 4 state nên không vừa AskUserQuestion) muốn redo state nào, rồi quay lại đúng state đó.

DỪNG. CHỜ.

## STATE 13, THÊM PHIÊN BẢN NGÔN NGỮ KHÁC (tùy chọn, chạy sau khi đã có ít nhất 1 bản hoàn chỉnh)

Chỉ tái sử dụng phần KHÔNG phụ thuộc ngôn ngữ (niche/ý tưởng đã chọn, ảnh Vox ở `public/images/`, animation spec, SFX loại), KHÔNG chạy lại State 1-4/7 từ đầu — chỉ dịch nội dung và sinh lại phần phụ thuộc ngôn ngữ.

Dùng AskUserQuestion: "Thêm phiên bản ngôn ngữ nào?" — options: ["Tiếng Anh", "Tiếng Việt"] (loại bỏ ngôn ngữ đã làm ở STATE 4 khỏi danh sách nếu chỉ còn 1 lựa chọn thì bỏ qua câu hỏi, dùng luôn ngôn ngữ còn lại).

### 13a. Dịch script (không viết lại từ đầu)

Dịch nguyên văn `<ten-video>-script.md` (STATE 5) sang ngôn ngữ mới, giữ đúng ý, giữ đúng twist/kết đã đánh dấu, giữ đúng số beat và `id` (`vo_01, vo_02...`) để bảng động timing vẫn map 1-1. Lưu thành `<ten-video>-script-<lang>.md` (file riêng, không ghi đè bản gốc). Không cần fact-check lại vì nội dung/claim không đổi, chỉ đổi ngôn ngữ diễn đạt.

### 13b. Kiểm tra ảnh có label baked ngôn ngữ cũ không

Vì kỷ luật `imagegen-remotion`/STYLE BLOCK không cho phép baked caption, ảnh Vox thường KHÔNG chứa text ngoài nhãn ngắn 1-4 từ (nếu có). Kiểm tra bảng manifest ở STATE 7: nếu có ảnh nào từng dùng label bằng ngôn ngữ cũ, xuất riêng đúng những entry đó vào `prompts_parsed.json` mới (theo cơ chế 7d) bằng label ngôn ngữ mới, báo user tự sinh lại và lưu vào `public/images/<lang>/scene-<id>.png` (chỉ ảnh có label mới cần bản riêng, ảnh không label dùng chung được, không cần sinh lại toàn bộ).

### 13c. Voice thật cho ngôn ngữ mới (như STATE 8)

Build JSON mới từ script đã dịch (12a), voice map theo ngôn ngữ mới (`en-US-GuyNeural`/`en-US-AriaNeural` hoặc `vi-VN-NamMinhNeural`/`vi-VN-HoaiMyNeural`, hỏi giới tính giọng qua AskUserQuestion như STATE 8). Chạy `generate-voiceover.py` với cùng fps đã chốt ở STATE 0, output vào `public/audio/vo/<lang>/` + `manifest.json` riêng. Đối chiếu tổng thời lượng thật với độ dài mục tiêu như STATE 8 (script dịch có thể dài/ngắn hơn bản gốc).

### 13d. SFX + Composition + render + QC riêng cho ngôn ngữ mới

SFX (loại/thời điểm) giữ nguyên logic STATE 9, chỉ đổi frame theo `manifest.json` mới của 12c. Ở STATE 10: tạo thêm 1 Composition riêng cho ngôn ngữ mới (dùng lại ảnh gốc + ảnh label riêng nếu có ở 12b, audio mới ở 12c), render ra `out/<Ten>-<lang>.mp4` (nhân đôi nếu dự án có cả 2 định dạng 16:9/9:16), QC qua `video-qc` như bình thường.

### 13e. Thumbnail riêng cho ngôn ngữ mới

Sinh lại 3 thumbnail (STATE 12) với chữ bằng ngôn ngữ mới, lưu vào `public/thumbnails/<lang>/`.

Kết thúc bằng AskUserQuestion: "Đã có thêm bản `<lang>` tại out/<Ten>-<lang>.mp4. Bạn muốn làm gì tiếp?" — options: ["Thêm ngôn ngữ khác nữa", "Làm video mới", "Kết thúc ở đây"].

DỪNG. CHỜ.