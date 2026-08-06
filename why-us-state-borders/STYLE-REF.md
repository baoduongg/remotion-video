# Style Reference (project-specific override, thay cho BRAND-GUIDE.md mặc định)

## Hình ảnh: Paper Cut Animation (không phải Vox flat 2D no-shadow gốc)

- Layered paper cutout: các lớp giấy chồng lên nhau tạo chiều sâu (character/background/foreground tách lớp rõ).
- Drop shadow giữa các lớp giấy (soft/hard shadow ngắn, mô phỏng ánh sáng chiếu qua giấy thật) — khác biệt có chủ đích so với quy tắc "no drop shadow" của Vox flat gốc.
- Texture giấy nhẹ (grain/fiber), mép cắt hơi răng cưa/imperfect thay vì vector cạnh sắc tuyệt đối.
- Vẫn giữ tinh thần Vox: không cảnh quay thật, không photoreal, bố cục editorial, generous negative space cho kinetic typography.
- **Override quy tắc "no baked-in captions" mặc định của imagegen-remotion**: dự án này CHẤP NHẬN chữ/label bake sẵn trong ảnh (như "PAPER LEGACY", "EXPLORATION UNVEILED"...), quyết định của user ngày 2026-08-06. Không cần loại bỏ chữ khi generate/regenerate ảnh còn lại.

## Palette (paper cut, thay 4 màu BRAND-GUIDE)

| Vai trò | Tên | Hex |
|---|---|---|
| Nền/giấy chính | Kraft brown | `#c8a876` |
| Nền phụ / giấy sáng | Cream | `#f5ecd9` |
| Nhấn mạnh | Terracotta (đỏ đất) | `#c0453a` |
| Nền tối / chữ | Deep navy | `#1b2a4a` |
| Điểm nhấn phụ | Mustard | `#e0a831` |

Đúng 5 màu này xuyên suốt cả video, không thêm màu ngoài palette.

## Còn giữ nguyên từ BRAND-GUIDE.md (chưa bị override)

- Font: Anton (`@remotion/google-fonts/Anton`, subset latin + vietnamese).
- fps: 30.
- Timing điều khiển bởi manifest.json (duration thật, không đoán).
- Quy ước đặt tên file (scene-<id>.png, vo/<id>.mp3, prompts.json...).
- SFX: whoosh chủ đạo cho chuyển cảnh, mở rộng thêm pop/click, gavel, clock tick theo Vox DNA của skill.

Style bible đầy đủ (dán vào đầu mọi prompt sinh ảnh) sẽ viết chi tiết ở STATE 7b, dựa trên palette + paper-cut description ở trên.
