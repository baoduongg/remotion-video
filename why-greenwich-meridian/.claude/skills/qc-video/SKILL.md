---
name: video-qc
description: "QA/QC video đã render trước khi public lên YouTube (long-form 16:9 hoặc Shorts 9:16) — dùng /watch (claude-video skill) để thực sự xem/nghe video, kiểm tra kỹ thuật, sync caption, pacing, tính nhất quán phong cách nhân vật/animation, audio, VÀ tính chính xác lịch sử (đối chiếu tên riêng/mốc thời gian/diễn biến sự kiện với nguồn đáng tin cậy qua web search). Luôn dùng skill này khi user nói: 'QC video', 'kiểm tra video trước khi đăng', 'review video này giúp tôi', 'preview video trước khi public', 'check video có lỗi gì không', 'fact-check video lịch sử', hoặc đưa một file .mp4/.mov vừa render xong và hỏi có ổn để đăng không — kể cả khi họ không dùng đúng từ 'QC' hay 'QA'."
compatibility: "Yêu cầu đã cài claude-video skill (/watch) — nếu chưa có, chạy: /plugin marketplace add bradautomates/claude-video && /plugin install watch@claude-video"
---

# Video QC — kiểm tra chất lượng trước khi public

Skill này KHÔNG tự đoán chất lượng video từ tên file hay mô tả. Mọi kết luận PASS/FAIL phải dựa trên việc thực sự dùng `/watch` để xem frame + nghe transcript của video. Nếu chưa gọi `/watch`, không được kết luận bất cứ mục nào là ✅.

## Bước 0 — Xác định input

Hỏi (nếu chưa rõ từ context):
- Đường dẫn file video đã render (local path, không phải link tham khảo)
- Định dạng: long-form 16:9 hay Shorts 9:16
- Có script/outline gốc để đối chiếu nội dung không (đường dẫn file, nếu có)
- Duration dự kiến (nếu có brief từ trước) để so sánh với duration thực tế

## Bước 1 — Watch pass

Dùng bảng frame budget để chọn cách gọi `/watch` theo duration, tránh "sparse scan":

| Duration video | Cách gọi |
|---|---|
| ≤ 3 phút (Shorts hoặc episode ngắn) | `/watch <path> --detail balanced` — 1 lần full |
| 3–10 phút | `/watch <path> --detail balanced --resolution 1024` (cần đọc chữ trên title card/bản đồ) |
| > 10 phút | KHÔNG watch 1 lần. Chia theo chapter/scene (dựa outline hoặc timestamp joke chính) và gọi `/watch <path> --start X --end Y` cho từng đoạn. Full-scan chỉ dùng `--detail token-burner` nếu thực sự cần review toàn bộ. |

Với mọi lần gọi, luôn hỏi Claude (trong câu hỏi kèm `/watch`) đúng các điểm ở Bước 2 — không hỏi chung chung "video có ổn không".

## Bước 2 — Checklist

Chỉ tick ✅ cho mục nào đã có bằng chứng cụ thể (frame nào, timestamp nào) từ kết quả `/watch`. Không rõ → ghi ⚠️ *cần xem lại thủ công*, không tự suy diễn thành ✅.

### A. Kỹ thuật (bắt buộc mọi video)
- Aspect ratio đúng định dạng khai báo (16:9 hay 9:16), không bị crop/letterbox sai
- Duration thực tế khớp brief (nếu có) — lệch quá 15% thì flag
- Không có frame đen, frame lỗi (glitch/artifact), hoặc animation bị đứng hình ngoài ý muốn
- Audio không bị clip, không có khoảng lặng chết (dead air) bất thường giữa các scene

### B. Đồng bộ audio–visual
- Narration khớp với hình đang chiếu (không bị lệch timing giữa lời kể và cảnh minh họa)
- Caption/joke text bật đúng nhịp câu thoại hài — không trễ/sớm so với beat
- Nếu có SFX nhấn (whoosh, ting, sweat-drop pop...): khớp đúng khung hình hành động, không rơi vào khoảng trống

### C. Phong cách hình ảnh (theo chuẩn OverSimplified-style đã định nghĩa cho kênh)
- Nhân vật giữ đúng flat-cutout, viền đen đồng nhất suốt video — không lệch style giữa các scene
- Idle bounce của nhân vật vẫn chạy ở các đoạn thoại dài (không bị "đứng chết" quá lâu)
- Bản đồ/scene chuyển màu lãnh thổ mượt, không giật khi transition
- Title card và caption giữ đúng font/outline/drop-shadow nhất quán

### D. Tính chính xác lịch sử (bắt buộc — kể cả khi không có script để đối chiếu)

Đây là nội dung giáo dục lịch sử, sai sự kiện/mốc thời gian ảnh hưởng trực tiếp đến uy tín kênh, nên mục này KHÔNG được bỏ qua hay hạ xuống "nice to have".

1. Từ transcript lấy được qua `/watch`, liệt kê toàn bộ **claim có thể kiểm chứng**: tên nhân vật lịch sử, mốc thời gian (năm/ngày), địa danh, số liệu (quân số, thương vong...), quan hệ nhân quả giữa các sự kiện ("A dẫn đến B").
2. Với mỗi claim, `web_search` đối chiếu với nguồn đáng tin cậy (ưu tiên: sách/bài viết học thuật, Encyclopaedia Britannica, bảo tàng/viện lịch sử, tránh dựa vào wiki không rõ nguồn nếu claim gây tranh cãi). Không tự tin dùng kiến thức có sẵn nếu claim là số liệu cụ thể hoặc mốc thời gian chính xác — luôn search để xác nhận.
3. Nếu script/outline gốc có sẵn: đối chiếu thêm — tên riêng/mốc thời gian xuất hiện trên chữ/caption có khớp script không (lỗi chính tả tên nhân vật/địa danh), không thiếu/lặp đoạn nào so với outline.
4. Phân loại từng claim:
   - ✅ **Đúng** — khớp nguồn đối chiếu
   - ❌ **Sai** — nêu rõ claim sai, timestamp xuất hiện trong video, và thông tin đúng kèm nguồn
   - ⚠️ **Gây tranh cãi/chưa thống nhất giữa các nguồn sử học** — nêu rõ, không tự chọn phe, gợi ý cách diễn đạt trung lập hơn nếu cần
   - ⚠️ **Đơn giản hóa quá mức gây hiểu sai bản chất** (khác với "đơn giản hóa hợp lý" đúng tinh thần OverSimplified-style) — chỉ flag khi việc lược bỏ làm sai lệch nguyên nhân/kết quả, không flag việc lược bỏ chi tiết phụ
5. Video càng dài, càng nhiều claim — nếu không đủ thời gian fact-check hết, ưu tiên check các claim có **số liệu cụ thể** và **mốc thời gian chính xác** trước (rủi ro sai cao nhất), rồi nói rõ phần nào chưa kịp kiểm chứng thay vì bỏ qua im lặng.

### E. Pacing
- Không có đoạn tĩnh (static) quá dài không có lý do kịch bản (ví dụ bản đồ đứng yên >4-5s không có narration mới)
- Nhịp chuyển cảnh phù hợp: nhanh ở đoạn hài, chậm lại ở đoạn cảm xúc/climax

### F. Riêng cho Shorts (9:16)
- Hook 3 giây đầu phải có hình động/joke ngay, không mở đầu bằng title card tĩnh
- Không có nội dung quan trọng bị crop mất khi convert từ layout 16:9 gốc (nếu Shorts là bản cắt từ video dài)
- Caption đủ lớn để đọc được trên màn hình điện thoại (không cần đọc chữ nhỏ trên bản đồ)

### G. Riêng cho long-form (16:9)
- Có đủ intro hook trong 15-30s đầu trước khi vào nội dung chính
- Outro/CTA (nếu kênh có chuẩn outro) xuất hiện đúng vị trí cuối video

## Bước 3 — Output report

Luôn xuất báo cáo dạng bảng, KHÔNG viết văn xuôi dài dòng:

```
| Hạng mục | Kết quả | Ghi chú (timestamp nếu có lỗi) |
|---|---|---|
| A. Kỹ thuật | ✅/⚠️/❌ | ... |
| B. Sync audio-visual | ✅/⚠️/❌ | ... |
| C. Phong cách hình ảnh | ✅/⚠️/❌ | ... |
| D. Chính xác lịch sử | ✅/⚠️/❌ | liệt kê từng claim sai kèm timestamp + nguồn đúng |
| E. Pacing | ✅/⚠️/❌ | ... |
| F/G. Riêng định dạng | ✅/⚠️/❌ | ... |
```

Kết luận cuối 1 dòng: **SẴN SÀNG PUBLISH** / **CẦN SỬA TRƯỚC KHI ĐĂNG** (liệt kê rõ mục nào chặn) / **CẦN XEM LẠI THỦ CÔNG** (nếu có mục ⚠️ do giới hạn frame budget, ví dụ video quá dài chưa scan hết).

## Ghi chú

- Nếu video > 10 phút và chỉ đủ thời gian scan sparse, PHẢI nói rõ phần nào chưa được xem kỹ thay vì áp kết luận PASS cho toàn bộ video.
- Mục D (chính xác lịch sử) luôn phải chạy fact-check qua web search, kể cả khi không có outline/script — thiếu script chỉ bỏ qua phần đối chiếu chính tả tên riêng với script gốc, không được bỏ qua toàn bộ việc fact-check.
- Nếu video có claim sai lịch sử (❌ ở mục D), tự động kết luận **CẦN SỬA TRƯỚC KHI ĐĂNG** bất kể các mục khác đều ✅ — sai sự kiện không thể bù bằng chất lượng animation tốt.