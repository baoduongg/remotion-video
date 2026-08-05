import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene4Competitors: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // vo_17 timing (0 - 95)
  const opacityVo17 = interpolate(frame, [0, 10, 85, 95], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const runnerX1 = interpolate(frame, [0, 95], [width * 0.4, width * 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const runnerX2 = interpolate(frame, [0, 95], [width * 0.45, width * 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_18 timing (95 - 168)
  const opacityVo18 = interpolate(frame, [95, 105, 158, 168], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clockSpin = interpolate(frame, [95, 168], [0, 720], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_19 timing (168 - 249)
  const opacityVo19 = interpolate(frame, [168, 178, 239, 249], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gapWidth = interpolate(frame, [168, 220], [50, 200], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_20 timing (249 - 354)
  const opacityVo20 = interpolate(frame, [249, 259, 344, 354], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridScale = interpolate(frame, [249, 279], [0.8, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_17.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_18.mp3")} from={95} />
      <Audio src={staticFile("audio/vo/vo_19.mp3")} from={168} />
      <Audio src={staticFile("audio/vo/vo_20.mp3")} from={249} />

      {/* vo_17: Runners lagging behind */}
      {frame >= 0 && frame < 95 && (
        <AbsoluteFill style={{ opacity: opacityVo17 }}>
          <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
            {/* Tracks */}
            <line x1={0} y1={height * 0.4} x2={width} y2={height * 0.4} stroke="#334155" strokeWidth={4} />
            <line x1={0} y1={height * 0.6} x2={width} y2={height * 0.6} stroke="#334155" strokeWidth={4} />

            {/* Runner Lead (TSMC) */}
            <circle cx={width * 0.75} cy={height * 0.4} r={30} fill="#ef4444" />
            <text x={width * 0.75} y={height * 0.4 + 10} fill="#f8fafc" fontWeight={900} fontSize={20} textAnchor="middle">TSMC</text>

            {/* Runner 2 (Intel) */}
            <circle cx={runnerX1} cy={height * 0.5} r={30} fill="#0d9488" />
            <text x={runnerX1} y={height * 0.5 + 10} fill="#f8fafc" fontWeight={700} fontSize={18} textAnchor="middle">INTEL</text>

            {/* Runner 3 (Samsung) */}
            <circle cx={runnerX2} cy={height * 0.6} r={30} fill="#0d9488" />
            <text x={runnerX2} y={height * 0.6 + 10} fill="#f8fafc" fontWeight={700} fontSize={18} textAnchor="middle">SAMSUNG</text>
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 100,
              right: 100,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: headingFont,
                color: "#f8fafc",
                fontSize: 48,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              Các đối thủ lớn như Intel hay Samsung
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_18: Clock spinning (decades) */}
      {frame >= 95 && frame < 168 && (
        <AbsoluteFill style={{ opacity: opacityVo18 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={200}
              height={200}
              viewBox="0 0 100 100"
              style={{
                transform: `rotate(${clockSpin}deg)`,
                marginBottom: 20,
              }}
            >
              <circle cx={50} cy={50} r={45} fill="none" stroke="#f8fafc" strokeWidth={5} />
              <line x1={50} y1={50} x2={50} y2={15} stroke="#ef4444" strokeWidth={4} strokeLinecap="round" />
              <line x1={50} y1={50} x2={75} y2={50} stroke="#f8fafc" strokeWidth={3} strokeLinecap="round" />
            </svg>
            <div
              style={{
                fontSize: 48,
                fontFamily: headingFont,
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: 2,
              }}
            >
              HÀNG THẬP KỶ
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 100,
              right: 100,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: headingFont,
                color: "#f8fafc",
                fontSize: 48,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              đã đuổi theo hàng thập kỷ
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_19: Widening gap */}
      {frame >= 168 && frame < 249 && (
        <AbsoluteFill style={{ opacity: opacityVo19 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={600} height={300} viewBox="0 0 600 300">
              {/* Leader node */}
              <circle cx={150} cy={150} r={24} fill="#ef4444" />
              <text x={150} y={110} fill="#ef4444" fontWeight={900} fontSize={20} textAnchor="middle">TSMC</text>

              {/* Competitor node */}
              <circle cx={150 + gapWidth} cy={150} r={24} fill="#0d9488" />
              <text x={150 + gapWidth} y={110} fill="#0d9488" fontWeight={700} fontSize={20} textAnchor="middle">ĐỐI THỦ</text>

              {/* Connecting arrow representing distance */}
              <line x1={180} y1={150} x2={120 + gapWidth} y2={150} stroke="#ef4444" strokeWidth={4} />
              {/* Yield gap label */}
              <text x={150 + gapWidth / 2} y={190} fill="#ef4444" fontWeight={800} fontSize={24} textAnchor="middle">KHOẢNG CÁCH</text>
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 100,
              right: 100,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: headingFont,
                color: "#f8fafc",
                fontSize: 48,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              nhưng vẫn bị tụt lại phía sau
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_20: Yield rate grid */}
      {frame >= 249 && frame < 354 && (
        <AbsoluteFill style={{ opacity: opacityVo20 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "0 100px",
              transform: `scale(${gridScale})`,
            }}
          >
            {/* TSMC Yield (High) */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ef4444", marginBottom: 20, fontFamily: headingFont }}>TSMC (80%+ YIELD)</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 10,
                  width: 200,
                  height: 200,
                  padding: 10,
                  backgroundColor: "#1e293b",
                  borderRadius: 12,
                }}
              >
                {Array.from({ length: 25 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: idx < 21 ? "#0d9488" : "#ef4444", // 21/25 = 84% yield
                      borderRadius: 999,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Competitors Yield (Low) */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#94a3b8", marginBottom: 20, fontFamily: headingFont }}>ĐỐI THỦ (50%- YIELD)</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 10,
                  width: 200,
                  height: 200,
                  padding: 10,
                  backgroundColor: "#1e293b",
                  borderRadius: 12,
                }}
              >
                {Array.from({ length: 25 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: idx < 12 ? "#0d9488" : "#ef4444", // 12/25 = 48% yield
                      borderRadius: 999,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 100,
              right: 100,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: headingFont,
                color: "#f8fafc",
                fontSize: 40,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              cả về hiệu suất lẫn tỷ lệ sản lượng thành phẩm.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
