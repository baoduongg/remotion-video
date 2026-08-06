---
name: paper-cut-video-engine
description: Đi từ ý tưởng thô đến video Remotion phong cách paper-cut animation (cutout giấy nhiều lớp, texture giấy thật, mép cắt thô, nhân vật rig khớp nối kiểu con rối giấy, chuyển động stepped/frame-hold kiểu stop-motion, camera multiplane parallax) ĐÃ RENDER XONG VÀ QC. Tạo folder project Remotion NGAY TỪ ĐẦU, rồi làm mọi việc tiếp theo (script, beat, ảnh tách layer, voice, SFX, code rig, render, QC) bên trong folder đó. Hỗ trợ output đa dạng — định dạng 16:9, 9:16, hoặc cả hai (2 lượt render riêng), và ngôn ngữ Tiếng Anh hoặc Tiếng Việt cho script, voice, và mọi text trong ảnh/thumbnail. Sau khi đã có 1 bản hoàn chỉnh, có thể thêm bản ngôn ngữ khác cho cùng project mà không phải làm lại từ đầu. Điều phối skill `video-pipeline` cho phần scaffold/voice/SFX/QA/render/QC, tự lo phần đặc thù paper-cut (niche, script, tách layer ảnh, rig khớp, texture/shadow giấy, SFX giấy) gọi qua tính năng tạo ảnh có sẵn trong Antigravity IDE. LUÔN dùng skill này khi user nhắc "paper cut style", "paper-cut animation", "video cắt giấy", "cutout animation", "stop-motion giấy", "con rối giấy", hoặc yêu cầu video hoàn chỉnh theo phong cách này, kể cả khi không gõ đúng các từ trên.
compatibility: "Cần skill `video-pipeline` đã cài (điều phối scaffold/voice/SFX/QA/render/QC), và các skill nó phụ thuộc: remotion-best-practices, remotion-create, remotion-markup, video-qc (`/watch`), edge-tts (qua generate-voiceover.py), ffmpeg/ffprobe. Kỷ luật ảnh layer/rig/texture paper-cut do skill này tự định nghĩa (không phụ thuộc `imagegen-remotion`, dùng thêm nếu đã cài để tham khảo quy tắc plate chung). Cần chạy trong Antigravity IDE để dùng tính năng tạo ảnh có sẵn (Gemini/Nano Banana) sinh ảnh layer thật; nếu chạy ở harness khác không có tính năng này, cần kết nối Gemini/Google Flow tương đương hoặc làm thủ công (xem 7e). Cần thư mục cha `remotion-video/` đã có sẵn `WORKFLOW.md` + `scripts/generate-voiceover.py` + skill dùng chung (setup one-time theo `video-pipeline` Bước 0.5)."
---

# Paper-Cut Video Engine

LƯU Ý: BẤT KỲ CÂU HỎI NÀO TRONG CÁC STATE DƯỚI ĐÂY, KỂ CẢ CÂU ĐƠN GIẢN NHƯ XÁC NHẬN CHUYỂN SANG STATE TIẾP THEO, PHẢI DÙNG TOOL HỎI DẠNG NÚT BẤM (AskUserQuestion / `ask_user_input_v0`) THAY VÌ GÕ CÂU HỎI THUẦN TEXT — để user chỉ cần chạm chọn thay vì gõ tay. Mẫu chuẩn cho xác nhận chuyển state: 2 option ["Tiếp tục", "Dừng lại, tôi cần chỉnh trước"]. Nếu một câu hỏi có nhiều hơn 4 lựa chọn (vd chọn 1 trong 10 ý tưởng ở STATE 3, hoặc chọn redo state nào ở STATE 11), giữ dạng liệt kê + để user gõ, vì tool giới hạn tối đa 4 option mỗi câu.

Tool cũng yêu cầu TỐI THIỂU 2 option mỗi câu hỏi (mảng 1 phần tử bị tool reject thẳng). Với câu hỏi mà bản chất chỉ có ĐÚNG 1 giá trị hợp lý — free-text mở (vd đặt tên project ở STATE 0) hoặc lựa chọn duy nhất còn lại sau khi loại trừ (vd STATE 12 khi chỉ còn 1 ngôn ngữ chưa làm) — KHÔNG bỏ qua AskUserQuestion và KHÔNG tự ý quyết thay user. Luôn dựng đúng 2 option:
1. Giá trị gợi ý/mặc định cụ thể (slug đề xuất, hoặc tên lựa chọn duy nhất còn lại).
2. "Tự nhập giá trị khác" — để user gõ tay nếu không muốn dùng gợi ý mặc định.
Nếu user chọn option 2, hỏi tiếp bằng text thường để họ gõ giá trị cụ thể. Không tự bịa thêm option thứ 3 giả cho đủ số, và không dùng "Other" mặc định của tool thay cho option 2 này.

Có thể gộp tối đa 3 câu hỏi độc lập vào một lần gọi tool nếu chúng thuộc cùng một state (xem STATE 4). Không tự đoán câu trả lời thay user khi câu hỏi còn mơ hồ.

State machine tuyến tính, DỪNG và CHỜ user trả lời sau mỗi state — không tự nhảy cóc. Không dùng em dash (dùng dấu phẩy, hai chấm, ngoặc đơn, hoặc gạch ngang thường).

**Vai trò của skill này**: tạo project Remotion trước tiên (STATE 0), sau đó mọi bước còn lại — hỏi style, chọn niche, viết script, tách beat, tách layer + sinh ảnh, sinh voice, SFX, code rig, render, QC, thumbnail — đều thực hiện BÊN TRONG folder project đó. Phần đặc thù paper-cut (niche, script, kỷ luật layer/rig/texture) do skill này tự làm; phần scaffold/voice-thật/SFX/QA/render/QC do `video-pipeline` điều phối, paper-cut-video-engine chỉ cấp đúng nội dung/asset tại đúng bước của nó. Nếu `video-pipeline` chưa cài, dừng lại và báo user cài trước khi vào STATE 0.

Kết quả cuối cùng là một file `.mp4` đã render và QC pass, kèm 3 thumbnail, tất cả nằm trong `<ten-video-moi>/`.

## Paper-Cut DNA (ghi nhớ xuyên suốt, không phải một state riêng)

**Chất liệu là nhân vật chính**: mọi cảnh trông như con rối giấy/diorama giấy thật đặt trước camera, không phải vector phẳng vô trùng. Có texture giấy (thớ giấy, hạt cardstock nhẹ), mép cắt hơi thô/không hoàn hảo (torn/cut edge), bóng đổ nhẹ giữa các lớp giấy chồng lên nhau để gợi độ sâu vật lý. Đây là điểm NGƯỢC với phong cách flat-vector-không-shadow: paper-cut CẦN shadow nhẹ giữa layer, KHÔNG cấm nó.

**Giọng văn**: giữ nguyên tinh thần explainer hội thoại, trực tiếp, dựa trên dữ kiện cụ thể, cấu trúc lập luận claim → bằng chứng → ý nghĩa (xem chi tiết STATE 5). Phong cách paper-cut không đổi giọng văn, chỉ đổi ngôn ngữ hình ảnh và chuyển động.

**Hình ảnh**: cutout giấy nhiều lớp (background/midground/nhân vật + từng bộ phận cơ thể tách rời), palette 3-4 màu cardstock cố định xuyên suốt video, KHÔNG gradient/gloss nhưng CÓ shadow đổ giữa lớp và texture giấy nhẹ. Nhân vật là con rối giấy rig khớp nối (đầu/thân/tay/chân tách file riêng, xoay quanh điểm pivot), không morph hình dạng liền mạch.

**Chuyển động**: KHÔNG mượt liên tục kiểu motion-graphics hiện đại. DNA là limited animation/stop-motion: giữ khung (frame-hold) 2-3 frame một nhịp trước khi nhảy sang vị trí tiếp theo, khớp xoay theo bước rời rạc (stepped rotation) chứ không tween liên tục, đôi khi rung/lắc nhẹ mô phỏng giấy thật đang được di chuyển bằng tay. Đây là điểm NGƯỢC trực tiếp với quy tắc "cấm frame-hold" của phong cách flat-vector: ở paper-cut, frame-hold là mục tiêu, không phải lỗi.

**Camera multiplane**: các lớp giấy ở độ sâu khác nhau di chuyển với tốc độ/biên độ khác nhau khi pan/zoom (lớp nền chậm nhất, lớp tiền cảnh nhanh nhất) để giả lập độ sâu 3D thật của một diorama giấy đặt trước camera.

**Phụ đề động (kinetic subtitle, bắt buộc)**: giữ nguyên nguyên tắc chung, chữ xuất hiện theo cụm 2-3 từ đồng bộ voiceover, từ khóa tô màu accent, hiển thị trực tiếp trên nền video (stroke/drop-shadow đủ tương phản), KHÔNG đặt trong khung nền trắng đặc. Có thể cho chữ trông như miếng giấy dán rời (die-cut letter) nếu muốn đẩy phong cách mạnh hơn, nhưng không bắt buộc.

**SFX giấy, không phải whoosh chung chung**: rustle/crinkle cho mọi chuyển động layer/khớp; scissor-snip cho khoảnh khắc cắt/reveal bất ngờ; page-flip cho chuyển cảnh lớn; paper-stamp/thump cho khoảnh khắc nhấn mạnh/quyết định. Chi tiết ở STATE 9.

## STATE 0, SCAFFOLD PROJECT TRƯỚC TIÊN (video-pipeline Bước 0.5)

Tự đề xuất một slug mặc định hợp lệ (không dấu, không khoảng trắng, vd `papercut-video-<yyyymmdd>`), rồi dùng AskUserQuestion: "Đặt tên ngắn cho project này (slug không dấu, không khoảng trắng)? Có thể đổi tên/nội dung cụ thể sau khi chọn niche/ý tưởng ở các bước tiếp theo, tên này chỉ để tạo folder ngay bây giờ." — options: ["Dùng `<slug đề xuất>`", "Tự nhập tên khác"]. Nếu chọn "Tự nhập tên khác", hỏi tiếp bằng text thường để user gõ slug.

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

Dùng AskUserQuestion: "Bạn có brand guide / màu sắc / font / video mẫu riêng muốn Claude bám theo không?" — options: ["Có, tôi sẽ đính kèm file/link khác", "Dùng mặc định kênh (BRAND-GUIDE.md nếu có, hoặc paper-cut gốc: kraft nâu, cream giấy, đỏ đô nhấn, xanh mòng két nhạt)"].

Nếu chọn "Có", chờ user đính kèm rồi đọc và ưu tiên nó hơn `BRAND-GUIDE.md`. Nếu chọn mặc định: có `BRAND-GUIDE.md` thì dùng nguyên palette/font/motion/SFX trong đó, không có thì dùng mặc định paper-cut gốc (kraft nâu, cream giấy, đỏ đô nhấn, xanh mòng két nhạt).

DỪNG. CHỜ.

## STATE 2, NICHE

Dùng AskUserQuestion: "Chủ đề video hôm nay thuộc nhóm nào?" — options: ["Chính trị & xã hội", "Kinh tế & công nghệ", "Lịch sử & văn hóa", "Môi trường / tự nhập chủ đề khác"].

Nếu chọn "Môi trường / tự nhập chủ đề khác", để user gõ tự do tên niche/chủ đề rộng (không phải ý tưởng cụ thể — ý tưởng cụ thể sẽ sinh ở STATE 3).

State này CHỈ chốt niche/nhóm rộng, KHÔNG hỏi thêm chủ đề cụ thể ở đây.

DỪNG. CHỜ.

## STATE 3, 10 Ý TƯỞNG

Sinh đúng 10 ý tưởng video trong niche đã chọn ở STATE 2. Mỗi ý tưởng là MỘT câu hỏi cụ thể mà video sẽ trả lời. Không trùng chủ đề con. Mỗi ý tưởng phải có một hook cụ thể (số liệu, sự kiện, địa danh).

Xuất danh sách 1-10, mỗi dòng một ý, không thêm gì khác. Kết thúc đúng: "Chọn một số, hoặc mô tả chủ đề khác." (giữ dạng liệt kê để user gõ số, vì vượt giới hạn 4 option của AskUserQuestion.)

DỪNG. CHỜ.

## STATE 4, ĐỘ DÀI + ĐỊNH DẠNG + NGÔN NGỮ

Dùng AskUserQuestion, gộp 3 câu trong MỘT lần gọi:
1. "Video dài bao lâu?" — options: ["1 phút", "3 phút", "5 phút", "8 phút hoặc dài hơn (ghi rõ ở tin nhắn sau)"]
2. "Định dạng đích?" — options: ["Horizontal 16:9", "Vertical 9:16", "Cả hai"] — quyết định aspect-ratio dùng ở STATE 7. **Chọn cả hai nghĩa là làm 2 lượt độc lập từ STATE 7 trở đi**, không phải kéo giãn một bộ ảnh dùng chung.
3. "Ngôn ngữ output?" — options: ["Tiếng Anh", "Tiếng Việt"] — áp dụng cho script (STATE 5), voice (STATE 8), mọi label/text trong ảnh và thumbnail (STATE 7, STATE 11).

Nếu tên project ở STATE 0 chỉ là tạm/generic so với ý tưởng vừa chọn, hỏi thêm (AskUserQuestion riêng, 2 options: ["Đổi tên folder cho khớp nội dung", "Giữ nguyên tên hiện tại"]) rồi `mv <ten-cu> <ten-moi>` trong `remotion-video/` nếu chọn đổi.

DỪNG. CHỜ.

## STATE 5, SCRIPT (EXPLAINER VOICE) + FACT-CHECK BẮT BUỘC

Tính từ theo 2.5 từ/giây: 1 phút khoảng 150 từ, 2 phút khoảng 300, 3 phút khoảng 450, 5 phút khoảng 750, 8 phút khoảng 1200. Sai số trong 5%.

Quy tắc kịch bản:
1. Narration liên tục, một khối văn xuôi. Không header, không chỉ dẫn hình ảnh.
2. **Cold open bắt buộc là nghịch lý/xung đột/tranh cãi, không phải bối cảnh an toàn kiểu giáo trình.** 3-10 giây đầu là nơi khán giả quyết định bỏ đi hay ở lại — mở thẳng bằng câu hỏi nghịch lý hoặc hình ảnh đối đầu/tranh cãi ngay từ câu đầu tiên, rồi mới lùi lại giải thích bối cảnh.
3. Giọng hội thoại nhưng có cấu trúc lập luận: đặt vấn đề, dẫn chứng cụ thể (số liệu, sự kiện), rồi rút ra ý nghĩa rộng hơn.
4. Câu ngắn, một ý một câu (để cắt beat sau này dễ). Có thể xen câu hỏi tu từ.
5. Dữ kiện phải chính xác, không bịa số liệu/tên. Nếu không chắc, viết vòng qua.
6. Không quảng cáo, không kêu gọi subscribe.
7. Kết bằng một câu chốt mở rộng, câu hỏi để lại cho người xem hoặc một nhận định sắc.

Viết script bằng đúng ngôn ngữ đã chọn ở STATE 4. Web_search có thể trả kết quả bằng ngôn ngữ khác, luôn diễn giải lại claim sang ngôn ngữ script khi đưa vào bản viết.

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

Mỗi beat phủ khoảng 2-3 giây narration (~5-8 từ ở 2.5 từ/giây). Một câu ngắn = một beat, câu dài tách theo mệnh đề tự nhiên. Mỗi beat gán một `id` dạng `vo_01`, `vo_02`... để dùng xuyên suốt các state sau (layer ảnh, voice, SFX, Sequence).

Xuất bảng: `id`, timecode bắt đầu ƯỚC LƯỢNG (tích lũy theo 2.5 từ/giây, sẽ bị ghi đè ở STATE 8), nguyên văn từ ngữ của beat đó. Cập nhật bảng này vào `<ten-video>-script.md` (nối thêm, không ghi đè phần script gốc).

Kết thúc bằng AskUserQuestion: "Đã tách xong beat. Sinh ảnh paper-cut cho từng beat luôn?" — options: ["Tiếp tục sinh ảnh", "Dừng lại, tôi muốn sửa bảng beat trước"].

DỪNG. CHỜ.

## STATE 7, SINH ẢNH PAPER-CUT (tách layer, gọi qua tính năng tạo ảnh trong Antigravity IDE)

Mọi ảnh lưu trực tiếp vào `<ten-video-moi>/public/images/` (thư mục này đã có sẵn từ khung Remotion tạo ở STATE 0) — đây chính là asset mà STATE 10 (scaffold code) sẽ dùng.

**Nếu STATE 4 chọn cả hai định dạng (16:9 + 9:16)**: chạy 7a-7f hai lượt độc lập, mỗi lượt có safe-zone riêng theo đúng tỉ lệ. Không dùng lại một bộ layer cho cả hai tỉ lệ. Lưu vào hai thư mục con: `public/images/16-9/scene-<id>/` và `public/images/9-16/scene-<id>/`, mỗi thư mục có manifest riêng.

Label (nếu prompt cần 1 nhãn ngắn 1-4 từ trên miếng giấy/stamp) viết bằng đúng ngôn ngữ đã chọn ở STATE 4, phần còn lại của prompt (SCENE, STYLE BLOCK, CLOSER) vẫn giữ tiếng Anh vì đây là câu lệnh cho mô hình sinh ảnh.

### 7a. Kỷ luật asset paper-cut (tự định nghĩa, tham khảo thêm `imagegen-remotion` nếu đã cài)

- Nếu skill `imagegen-remotion` đã có trong danh sách skill khả dụng, coi quy tắc CHUNG của nó (plate thô, không baked caption, aspect-ratio discipline) là bắt buộc; quy tắc RIÊNG paper-cut dưới đây luôn ưu tiên khi hai bên xung đột (vd nó cấm shadow, ở đây shadow giữa layer là bắt buộc).
- Nếu chưa có, chỉ áp dụng quy tắc paper-cut ở 7b-7d bên dưới, không chặn tiến độ để chờ cài thêm.

Quy tắc lõi bắt buộc:
- 1 beat (`id` từ STATE 6) = đúng 1 BỘ LAYER (không phải 1 ảnh đơn), số layer tùy độ phức tạp cảnh (tối thiểu: 1 nền + 1 tiền cảnh; có nhân vật: cộng thêm mỗi bộ phận rig cần xoay độc lập là 1 layer riêng, vd đầu/thân/tay-trái/tay-phải/chân).
- Mỗi layer là "plate thô" cho code: không bao giờ vẽ chữ/caption/lower-third/logo giả vào ảnh, chữ do Remotion code đè lên sau ở STATE 10.
- Mỗi layer xuất PNG nền trong suốt (transparent background), viền cắt rõ, để chồng layer trong Remotion mà không lộ khung chữ nhật nền.
- Text-safe zone rõ ràng theo tỉ lệ khung hình đã chọn ở STATE 4, tính trên bố cục tổng của cả bộ layer sau khi chồng.
- Motion-readiness: mỗi bộ layer chọn đúng 1 motion intent cho toàn cảnh (multiplane pan / multiplane zoom / static hold cho title card) CỘNG thêm motion riêng cho từng layer rig nếu có nhân vật (joint xoay theo bước rời rạc, xem STATE 7e animation spec).
- **Nhịp chuyển động không được đều đều xuyên suốt video**: nếu 3+ beat liên tiếp đều dùng cùng một multiplane pan nhẹ, khán giả buồn ngủ. Với beat chứa số liệu/địa danh quan trọng, đẩy camera lùi toàn cảnh rồi xoáy sâu vào điểm cụ thể. Với chuỗi beat dồn dập (đếm phiếu, liệt kê số liệu), rút ngắn khoảng cách frame-hold giữa các bước để tạo nhịp giật nhanh khớp voiceover.
- Cross-scene consistency: viết 1 "style bible" MỘT LẦN, dán nguyên văn vào đầu mọi prompt beat, chỉ đổi phần hành động/bối cảnh và layer riêng.
- Aspect-ratio discipline: toàn bộ project dùng chung đúng 1 tỉ lệ đã chọn ở STATE 4.

### 7b. Style bible (viết 1 lần trước beat đầu tiên)

Chốt: mô tả chủ thể/nhân vật lặp lại nếu video có nhân vật cố định (kèm mô tả rig: bao nhiêu bộ phận tách rời, tỉ lệ hình học của từng bộ phận để các layer khớp nhau khi ghép lại), palette 3-4 màu cardstock từ STATE 1, hướng sáng/mood, render style = paper-cut cutout (khớp STYLE BLOCK bên dưới). Dán y nguyên vào đầu mọi prompt của mọi beat.

### 7c. Lên kế hoạch tách layer cho từng beat (trước khi viết prompt)

Với mỗi beat, liệt kê danh sách layer cần sinh riêng và depth (độ sâu multiplane, số càng lớn càng gần camera):
```
Scene <id> — <tên beat>
  layers:
    - id: bg          depth: 0   (nền tĩnh, không rig)
    - id: mid-<vật thể> depth: 1 (midground, có thể có motion riêng)
    - id: char-torso  depth: 2   (gốc rig nhân vật, không pivot)
    - id: char-head   depth: 3   parentLayer: char-torso   pivot: cổ
    - id: char-arm-l  depth: 3   parentLayer: char-torso   pivot: vai trái
    - id: char-arm-r  depth: 3   parentLayer: char-torso   pivot: vai phải
```
Chỉ tách layer/rig khi beat thực sự cần chuyển động khớp hoặc parallax rõ rệt; beat tĩnh đơn giản (title card, cảnh nền thuần) chỉ cần 1-2 layer.

### 7d. Viết prompt cho từng layer (đúng 1 prompt/layer)

Cấu trúc mỗi prompt: [style bible] + [mô tả riêng của layer này, một ý tưởng hình ảnh trung tâm duy nhất, ghi rõ đây là layer nào trong bộ] + STYLE BLOCK + CLOSER.

**STYLE BLOCK (chèn nguyên văn vào MỌI prompt):**
```
Paper-cut cutout animation illustration in the style of stop-motion paper puppet dioramas: layered die-cut paper shapes with visible cardstock paper grain texture, slightly rough or irregular cut edges, soft drop shadow cast by this layer onto the layer behind it to suggest physical depth. Bold but limited color palette of 3 to 4 flat cardstock colors held consistent across the whole project (state the exact palette once, e.g. kraft brown, cream paper, deep red accent, muted teal). This image is a SINGLE ISOLATED LAYER on a transparent background, meant to be composited with other layers, not a complete scene by itself. If this layer is a character body part (head, torso, arm, leg), draw only that part, cleanly cut out, with a clear pivot point implied at the joint edge. Simple geometric character shapes without facial detail unless the beat needs a specific expression. Clean modern bold sans-serif type only where a label is specified. Poster-like composition, crisp die-cut paper edges. No baked-in captions, no fake lower-thirds, no fake logos or UI elements.
```

**CLOSER (chèn nguyên văn cuối MỌI prompt):**
```
The layer stays a physically plausible cutout of paper with visible grain and a soft cast shadow, built for multiplane camera motion and stop-motion-style stepped animation. NOT flat vector with zero shadow, NOT photorealistic, NOT painterly, NOT 3D render, no clutter, no watermark, no logos, no text beyond the specified label, transparent background required. Premium paper-cut explainer-video aesthetic, matching the project's fixed aspect ratio, ultra-detailed paper texture, crisp cut edges.
```

Lưu file mỗi layer vào `public/images/scene-<id>/<layer-id>.png` (nếu chỉ 1 định dạng), hoặc `public/images/<16-9|9-16>/scene-<id>/<layer-id>.png` (nếu STATE 4 chọn cả hai). Kèm bảng manifest handoff cho STATE 10 (một manifest riêng mỗi định dạng nếu có 2):
```
Scene <id> — <tên beat> (timecode ước lượng từ STATE 6, sẽ ghi đè ở STATE 8)
  layers:
    - id: <layer-id>
      asset: public/images/scene-<id>/<layer-id>.png
      depth: <0..n>
      pivot: <toạ độ % nếu là khớp rig, bỏ trống nếu không>
      parentLayer: <layer-id cha nếu là khớp rig, bỏ trống nếu không>
  motion: <multiplane pan / multiplane zoom / static hold>
  text-safe: <vùng chừa trống cho caption/kinetic typography>
```

Animation spec JSON (giữ để làm căn cứ cho `remotion-best-practices`/`remotion-create`/`remotion-markup` ở STATE 10, KHÔNG phải deliverable độc lập):
```ts
interface BeatAnimation {
  beatId: string;           // khớp id STATE 6, vd "vo_03"
  startFrame: number;       // ghi đè bằng số đo thật ở STATE 8 (manifest.json, fps từ STATE 0)
  durationFrames: number;   // ghi đè bằng số đo thật ở STATE 8
  layers: {
    id: string;              // khớp layer-id ở manifest trên
    asset: string;
    depth: number;           // 0 = xa nhất (nền), tăng dần = gần camera hơn, dùng cho multiplane parallax
    pivot?: { xPct: number; yPct: number }; // tâm xoay nếu layer là khớp rig
    parentLayer?: string;    // layer cha trong hệ rig
  }[];
  elements: {
    type: 'title-text' | 'icon' | 'chart' | 'map' | 'highlight-circle' | 'arrow' | 'stat-counter' | 'joint-rotation';
    enterAtFrame: number;
    motion: 'slide-left' | 'slide-up' | 'fade-scale' | 'draw-on' | 'count-up' | 'stepped-rotate' | 'stepped-hold';
    easing: 'easeOutCubic' | 'spring' | 'step-2fps' | 'step-3fps';
    label?: string;
    targetLayer?: string;    // dùng với type 'joint-rotation', khớp layer id
  }[];
}
```
Dùng `interpolate()` với `step-2fps`/`step-3fps` (quantize frame trước khi nội suy, kiểu `Math.floor(frame / holdFrames) * holdFrames`) cho mọi motion của layer/rig, KHÔNG dùng `spring()`/tween liên tục cho chuyển động vật lý (đó là DNA flat-vector, không phải paper-cut). `spring()`/`interpolate()` liên tục VẪN dùng bình thường cho kinetic subtitle (chữ luôn phải mượt để dễ đọc, không áp stepped cho chữ).

### 7e. Gọi tool sinh ảnh thật qua Antigravity IDE

- Đang chạy trong Antigravity IDE: dùng thẳng tính năng tạo ảnh có sẵn của IDE (Gemini/Nano Banana), gọi trực tiếp cho từng layer theo đúng thứ tự Scene 1 → Scene N, layer nền trước rồi tới layer rig, không gộp, không đảo thứ tự.
- Nếu user từng nói rõ muốn dùng tool khác ở lượt hiện tại, ưu tiên lựa chọn đó hơn mặc định.
- Nếu đang chạy ở harness khác không có tính năng này: thử tool/connector Gemini hoặc Google Flow đang kết nối trong phiên nếu có; nếu không có tool nào khả dụng, xuất toàn bộ prompt theo đúng thứ tự beat/layer vào `public/images/prompts.txt` (mỗi block một layer, đánh số `id`/`layer-id`, cách nhau dòng trống), báo user tự dán từng prompt, tải ảnh về đặt đúng tên `scene-<id>/<layer-id>.png` vào `public/images/`. Sau khi user báo đã xong, đếm lại số file khớp số layer trong manifest trước khi qua 7f.

### 7f. Clarity check trước khi giao

1. Số layer mỗi scene đúng theo kế hoạch 7c, không gộp không thiếu?
2. Nhân vật/palette/texture giấy/ánh sáng đồng nhất mọi layer (khớp style bible)?
3. Mọi layer đúng tỉ lệ khung hình đã chọn, nền trong suốt?
4. Mỗi bộ layer có safe-zone rõ cho text, và KHÔNG có caption/logo/UI giả bị vẽ vào?
5. Layer rig có mép cắt rõ tại điểm pivot để xoay tự nhiên khi ghép trong Remotion?

Nếu có câu trả lời "không", regenerate riêng layer lỗi đó, không giao cả bộ khi còn một mắt xích hỏng.

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

**Ghi đè bảng beat ở STATE 6 và animation spec ở STATE 7d bằng số đo thật trong `manifest.json`** — không dùng ước lượng 2.5 từ/giây nữa từ đây trở đi.

**Đối chiếu tổng thời lượng thật**: cộng `durationSec` toàn bộ beat trong `manifest.json`, so với độ dài mục tiêu đã chọn ở STATE 4. Nếu tổng thời lượng thật lệch quá ~15% so với mục tiêu, dùng AskUserQuestion: "Video thực tế dài [X]s, lệch so với mục tiêu [Y]s. Xử lý sao?" — options: ["Quay lại STATE 5 sửa/cắt script", "Giữ nguyên độ dài thực tế, không sửa"]. Nếu lệch trong khoảng chấp nhận được, bỏ qua bước này và tiếp tục.

Kết thúc bằng AskUserQuestion: "Voice đã có duration thật. Sinh SFX luôn?" — options: ["Tiếp tục sinh SFX", "Dừng lại, tôi muốn nghe thử voice trước"].

DỪNG. CHỜ.

## STATE 9, SFX GIẤY (bàn giao cho video-pipeline Bước 4)

Paper-cut dùng SFX tiết chế nhưng luôn có texture giấy làm nền cảm nhận, khác hẳn whoosh trơn của flat-vector. Map theo loại khoảnh khắc:
- **rustle/crinkle** (nhẹ, liên tục ngắn): bất kỳ layer/khớp nào di chuyển hoặc xoay (motion `stepped-rotate`, multiplane pan/zoom).
- **scissor-snip** (ngắn, sắc): reveal chi tiết mới bất ngờ, cut-in nhanh, motion `fade-scale` khi beat có twist/điểm nhấn.
- **page-flip** (whoosh giấy): chuyển cảnh lớn giữa hai beat khác bối cảnh hẳn, thay cho whoosh thường.
- **paper-stamp/thump** (uy nghiêm): khoảnh khắc quyết định/hội nghị/phán quyết/bỏ phiếu, dùng đúng 1-2 lần ở cao trào, không lạm dụng, thay cho gavel strike.
- **paper flutter tăng dần**: đoạn xung đột kéo dài/chờ đợi/countdown, tăng tempo dần theo voiceover rồi cắt đột ngột khi kết thúc căng thẳng, thay cho clock ticking (giữ đúng cảm giác hồi hộp nhưng chất liệu giấy chứ không phải kim loại).
Không cần SFX cho static hold thường, trừ khi beat là mở đầu/kết thúc video hoặc rơi vào 4 loại trên.

Thư viện mặc định trong `public/audio/sfx/` (whoosh, skedaddle, triggered, record-scratch, wilhelm-scream, bruh) là SFX tông true-crime/kịch tính, KHÔNG hợp paper-cut, tránh dùng trừ khi user yêu cầu rõ. rustle/crinkle/scissor-snip/page-flip/paper-stamp thường CHƯA có sẵn — cần tìm/tải file free (WebFetch nguồn free-SFX) rồi lưu vào `public/audio/sfx/` trước khi dùng.

Đặt SFX vào đúng frame dựa theo `manifest.json` thật ở STATE 8, không áng chừng. Trim/fade bằng `ffmpeg -af "afade=t=out:st=..:d=.."` nếu file dài hơn khoảnh khắc cần nhấn.

Kết thúc bằng AskUserQuestion: "SFX đã đặt xong. Dựng code và render luôn?" — options: ["Tiếp tục dựng code", "Dừng lại, tôi muốn chỉnh SFX trước"].

DỪNG. CHỜ.

## STATE 10, DỰNG CODE + QA + RENDER + QC (bàn giao cho video-pipeline Bước 2, 5, 6, 7)

Gọi `remotion-best-practices` làm router (dẫn tới `remotion-create` + `remotion-markup` phù hợp). Nếu cần định hướng thẩm mỹ rõ, gọi thêm `frontend-design`. Input cho bước này: layer ảnh ở `public/images/` (STATE 7), animation spec JSON (STATE 7d, đã ghi đè timing thật ở STATE 8), audio ở `public/audio/vo/` + manifest.json (STATE 8), SFX ở `public/audio/sfx/` (STATE 9). Toàn bộ đã nằm sẵn trong `<ten-video-moi>/` từ STATE 0.

Theo đúng vòng lặp của `video-pipeline`:
1. **Bước 2**: cài package thiếu qua `npx remotion add <pkg>` trước khi dùng, theme màu/font gom 1 file. Composition dùng đúng fps=30 đã chốt ở STATE 0, và `durationInFrames` lấy từ TỔNG frame thật trong `manifest.json` (STATE 8).
   - **Layer/rig component**: mỗi layer render bằng `<Img>` với `transform-origin` đặt tại `pivot` (nếu có) và `transform: rotate(...)` điều khiển bởi frame đã quantize theo `step-2fps`/`step-3fps` (KHÔNG dùng `spring()` liên tục cho rotation của rig). Layer con (`parentLayer`) lồng trong wrapper của layer cha để khớp xoay cộng dồn đúng vật lý con rối giấy (xoay vai kéo theo cả cánh tay).
   - **Multiplane parallax**: mỗi layer dịch chuyển theo `depth` khi camera pan/zoom — layer `depth` càng lớn dịch chuyển biên độ càng lớn (`translateX = baseOffset * depth * parallaxFactor`), layer `depth: 0` gần như đứng yên.
   - **Texture giấy + shadow**: overlay lớp noise/grain nhẹ (SVG `feTurbulence` hoặc PNG grain có sẵn) blend-mode `multiply` opacity thấp lên mỗi layer, cộng `filter: drop-shadow(...)` nhẹ giữa các layer để giữ cảm giác giấy chồng giấy thật, không phải import xử lý nặng.
   - **Subtitle component bắt buộc kinetic**: chia `text` của beat thành cụm 2-3 từ, dùng `interpolate()`/`spring()` liên tục (KHÔNG stepped) theo `frame` để lần lượt hiện từng cụm đúng nhịp trong `durationInFrames` của beat. Từ khóa tô màu accent riêng trong cùng span. Render chữ trực tiếp trên nền video (text-shadow/stroke để đủ tương phản), KHÔNG bọc trong khung nền màu đặc cố định.
   - **Motion pacing không đều đều**: với scene có `type: 'map' | 'chart' | 'stat-counter'` mang số liệu/địa danh trọng tâm, dùng cặp camera zoom-out rồi zoom-in vào điểm cụ thể. Với chuỗi beat liên tiếp cùng loại dữ kiện dồn dập, rút ngắn `holdFrames` (số frame giữ mỗi bước stepped) để tạo nhịp giật nhanh khớp voiceover.
2. **Bước 5 (QA hình ảnh)**: `npx remotion still <CompId> /tmp/check.png --frame=<n>` ở vài mốc, đọc ảnh bằng Read tool so kỳ vọng paper-cut (texture giấy rõ, shadow giữa layer, mép cắt, không phẳng vô trùng), `npx tsc --noEmit && npx eslint src` sau mỗi batch sửa.
3. **Bước 6 (render)**: check sync đoạn ngắn trước (`npx remotion render <CompId> /tmp/check.mp4 --frames=<a>-<b>`), xem rig xoay có giật đúng nhịp stepped chứ không mượt liên tục nhầm sang flat-vector. Nếu STATE 4 chọn cả hai định dạng, đây là 2 Composition riêng → render full ra 2 file: `out/<Ten>-16x9.mp4` và `out/<Ten>-9x16.mp4`.
4. **Bước 7 (QC)**: gọi `video-qc` (`/watch out/<file>.mp4`) cho từng file render ra, kể cả khi có 2 định dạng.

**Nếu QC ra ⚠️/❌ liên quan hình ảnh/phong cách paper-cut** (sai palette, thiếu texture/shadow, motion mượt nhầm sang flat-vector, layer/rig khớp lộ khung nền): quay lại STATE 7, regenerate riêng layer lỗi qua Antigravity IDE, không làm lại toàn bộ. **Nếu liên quan phần khác** (animation code, sync audio, layout): theo đúng Bước 8 của `video-pipeline` (feedback mơ hồ → hỏi lại user bằng AskUserQuestion, nhiều mảng cùng lúc → gọi `superpowers:brainstorming` trước khi sửa hàng loạt), rồi quay lại Bước 5-7 tới khi QC pass.

Kết thúc bằng AskUserQuestion: "Video đã render và QC pass tại out/<Ten>.mp4 (hoặc cả hai file nếu chọn 2 định dạng ở STATE 4). Sinh 3 thumbnail luôn?" — options: ["Tiếp tục sinh thumbnail", "Dừng lại, tôi muốn xem video trước"].

DỪNG. CHỜ.

## STATE 11, THUMBNAIL

Sinh 3 prompt thumbnail, mỗi prompt một block độc lập, phong cách paper-cut pushed louder cho size nhỏ:
- Một chủ thể cutout giấy chiếm phần lớn khung hình, shadow đổ rõ, texture giấy nhìn thấy được ở size nhỏ.
- 1-2 khối chữ trông như miếng giấy die-cut dán lên (torn/cut edge, drop-shadow rõ), tối đa 3 từ mỗi khối, từ khóa hook của video, viết bằng đúng ngôn ngữ đã chọn ở STATE 4.
- Một highlight device (circle/underline/arrow) cắt từ giấy màu đỏ hoặc vàng từ bảng màu dự án.
- Nền phẳng cardstock, một trong các màu chủ đạo của dự án, tương phản cao, không chi tiết nhỏ chết ở size 200px.
- Cùng STYLE BLOCK và CLOSER ở STATE 7d, đổi "no text beyond the specified label" thành "no text beyond the specified thumbnail words", và cho phép thumbnail là composite đầy đủ (không cần tách layer transparent riêng như plate thường).

Nếu STATE 4 chọn cả hai định dạng, sinh riêng 2 bộ 3 thumbnail (một bộ 16:9, một bộ 9:16).

Sinh qua Antigravity IDE theo đúng cơ chế 7e, lưu vào `<ten-video-moi>/public/thumbnails/` (hoặc `public/thumbnails/16-9/` + `public/thumbnails/9-16/` nếu 2 định dạng). Đây là deliverable cuối cùng, đi kèm file `.mp4` từ STATE 10.

Kết thúc bằng AskUserQuestion: "Hoàn tất: video đã render, QC pass, kèm 3 thumbnail, tất cả trong `<ten-video-moi>/`. Bạn muốn làm gì tiếp?" — options: ["Làm video mới", "Thêm phiên bản ngôn ngữ khác cho video này", "Làm lại một bước (redo)", "Kết thúc ở đây"].

Nếu chọn "Thêm phiên bản ngôn ngữ khác", chuyển sang STATE 12. Nếu chọn "Làm lại một bước", hỏi tiếp (text, vì có hơn 4 state nên không vừa AskUserQuestion) muốn redo state nào, rồi quay lại đúng state đó.

DỪNG. CHỜ.

## STATE 12, THÊM PHIÊN BẢN NGÔN NGỮ KHÁC (tùy chọn, chạy sau khi đã có ít nhất 1 bản hoàn chỉnh)

Chỉ tái sử dụng phần KHÔNG phụ thuộc ngôn ngữ (niche/ý tưởng đã chọn, layer ảnh paper-cut ở `public/images/`, animation spec, rig, SFX loại), KHÔNG chạy lại State 1-4/7 từ đầu — chỉ dịch nội dung và sinh lại phần phụ thuộc ngôn ngữ.

Nếu dự án chỉ hỗ trợ 2 ngôn ngữ (Anh/Việt) và STATE 4 đã chọn 1 trong 2, ngôn ngữ còn lại là lựa chọn mặc định duy nhất khả dĩ. Vẫn dùng AskUserQuestion: "Thêm phiên bản ngôn ngữ nào?" — options: ["Dùng `<ngôn ngữ còn lại>`", "Tự nhập ngôn ngữ khác"]. Nếu thực sự có từ 2 ngôn ngữ CHƯA làm trở lên, options là toàn bộ danh sách đó.

### 12a. Dịch script (không viết lại từ đầu)

Dịch nguyên văn `<ten-video>-script.md` (STATE 5) sang ngôn ngữ mới, giữ đúng ý, giữ đúng twist/kết đã đánh dấu, giữ đúng số beat và `id` để bảng động timing vẫn map 1-1. Lưu thành `<ten-video>-script-<lang>.md` (file riêng, không ghi đè bản gốc). Không cần fact-check lại vì nội dung/claim không đổi.

### 12b. Kiểm tra layer có label baked ngôn ngữ cũ không

Vì kỷ luật paper-cut không cho phép baked caption, layer thường KHÔNG chứa text ngoài nhãn ngắn 1-4 từ (nếu có). Kiểm tra bảng manifest ở STATE 7: nếu có layer nào từng dùng label bằng ngôn ngữ cũ, regenerate riêng đúng layer đó (qua Antigravity IDE, theo cơ chế 7e) bằng label ngôn ngữ mới, lưu vào `public/images/<lang>/scene-<id>/<layer-id>.png` (chỉ layer có label mới cần bản riêng, layer không label và toàn bộ rig hình học dùng chung được).

### 12c. Voice thật cho ngôn ngữ mới (như STATE 8)

Build JSON mới từ script đã dịch (12a), voice map theo ngôn ngữ mới, hỏi giới tính giọng qua AskUserQuestion như STATE 8. Chạy `generate-voiceover.py` với cùng fps đã chốt ở STATE 0, output vào `public/audio/vo/<lang>/` + `manifest.json` riêng. Đối chiếu tổng thời lượng thật với độ dài mục tiêu như STATE 8.

### 12d. SFX + Composition + render + QC riêng cho ngôn ngữ mới

SFX giữ nguyên logic STATE 9, chỉ đổi frame theo `manifest.json` mới của 12c. Ở STATE 10: tạo thêm 1 Composition riêng cho ngôn ngữ mới (dùng lại layer gốc + layer label riêng nếu có ở 12b, audio mới ở 12c), render ra `out/<Ten>-<lang>.mp4` (nhân đôi nếu dự án có cả 2 định dạng 16:9/9:16), QC qua `video-qc` như bình thường.

### 12e. Thumbnail riêng cho ngôn ngữ mới

Sinh lại 3 thumbnail (STATE 11) với chữ bằng ngôn ngữ mới, lưu vào `public/thumbnails/<lang>/`.

Kết thúc bằng AskUserQuestion: "Đã có thêm bản `<lang>` tại out/<Ten>-<lang>.mp4. Bạn muốn làm gì tiếp?" — options: ["Thêm ngôn ngữ khác nữa", "Làm video mới", "Kết thúc ở đây"].

DỪNG. CHỜ.
