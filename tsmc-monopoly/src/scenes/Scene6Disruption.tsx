import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene6Disruption: React.FC = () => {
  const frame = useCurrentFrame();

  // vo_26 timing (0 - 81)
  const opacityVo26 = interpolate(frame, [0, 10, 71, 81], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boardScale = interpolate(frame, [0, 30], [0.9, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_27 timing (81 - 165)
  const opacityVo27 = interpolate(frame, [81, 91, 155, 165], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shelfTranslateY = interpolate(frame, [81, 110], [20, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_28 timing (165 - 225)
  const opacityVo28 = interpolate(frame, [165, 175, 215, 225], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const carSlideX = interpolate(frame, [165, 195], [-50, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_29 timing (225 - 325)
  const opacityVo29 = interpolate(frame, [225, 235, 315, 325], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const errorScale = interpolate(frame, [225, 250], [0.8, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_26.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_27.mp3")} from={81} />
      <Audio src={staticFile("audio/vo/vo_28.mp3")} from={165} />
      <Audio src={staticFile("audio/vo/vo_29.mp3")} from={225} />

      {/* vo_26: Empty motherboard socket */}
      {frame >= 0 && frame < 81 && (
        <AbsoluteFill style={{ opacity: opacityVo26 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${boardScale})`,
            }}
          >
            <svg width={300} height={300} viewBox="0 0 200 200">
              {/* Motherboard Grid */}
              <rect x={20} y={20} width={160} height={160} fill="#1e293b" stroke="#334155" strokeWidth={4} rx={8} />

              {/* Empty socket highlighted in pulsing red */}
              <rect
                x={60}
                y={60}
                width={80}
                height={80}
                fill="#0f172a"
                stroke="#ef4444"
                strokeWidth={4}
                rx={8}
                style={{
                  filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))",
                }}
              />
              {/* Empty pins inside */}
              {Array.from({ length: 9 }).map((_, idx) => {
                const r = Math.floor(idx / 3);
                const c = idx % 3;
                return (
                  <circle
                    key={idx}
                    cx={75 + c * 25}
                    cy={75 + r * 25}
                    r={3}
                    fill="#334155"
                  />
                );
              })}
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
              Thiếu chip của TSMC
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_27: Empty retail shelf */}
      {frame >= 81 && frame < 165 && (
        <AbsoluteFill style={{ opacity: opacityVo27 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${shelfTranslateY}px)`,
            }}
          >
            <svg width={400} height={300} viewBox="0 0 400 300">
              {/* Empty Shelves */}
              <line x1={50} y1={120} x2={350} y2={120} stroke="#f8fafc" strokeWidth={6} strokeLinecap="round" />
              <line x1={50} y1={220} x2={350} y2={220} stroke="#f8fafc" strokeWidth={6} strokeLinecap="round" />

              {/* Crossed out phone outline on shelf */}
              <g transform="translate(160, 20)">
                <rect x={20} y={10} width={40} height={80} fill="none" stroke="#334155" strokeWidth={3} rx={4} />
                {/* Red cross */}
                <line x1={10} y1={10} x2={70} y2={90} stroke="#ef4444" strokeWidth={4} />
                <line x1={70} y1={10} x2={10} y2={90} stroke="#ef4444" strokeWidth={4} />
              </g>

              <g transform="translate(100, 120)">
                <rect x={20} y={10} width={40} height={80} fill="none" stroke="#334155" strokeWidth={3} rx={4} />
                <line x1={10} y1={10} x2={70} y2={90} stroke="#ef4444" strokeWidth={4} />
                <line x1={70} y1={10} x2={10} y2={90} stroke="#ef4444" strokeWidth={4} />
              </g>

              <g transform="translate(220, 120)">
                <rect x={20} y={10} width={40} height={80} fill="none" stroke="#334155" strokeWidth={3} rx={4} />
                <line x1={10} y1={10} x2={70} y2={90} stroke="#ef4444" strokeWidth={4} />
                <line x1={70} y1={10} x2={10} y2={90} stroke="#ef4444" strokeWidth={4} />
              </g>
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
              nghĩa là không có điện thoại mới,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_28: Disconnected car battery */}
      {frame >= 165 && frame < 225 && (
        <AbsoluteFill style={{ opacity: opacityVo28 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateX(${carSlideX}px)`,
            }}
          >
            <svg width={500} height={300} viewBox="0 0 500 300">
              {/* Sleek electric car silhouette */}
              <path
                d="M 50 180 L 120 180 C 140 130, 200 100, 260 100 C 320 100, 350 120, 380 150 L 450 180 L 450 220 L 50 220 Z"
                fill="none"
                stroke="#0d9488"
                strokeWidth={5}
                strokeLinecap="round"
              />
              <circle cx={120} cy={220} r={30} fill="#0f172a" stroke="#0d9488" strokeWidth={4} />
              <circle cx={380} cy={220} r={30} fill="#0f172a" stroke="#0d9488" strokeWidth={4} />

              {/* Red Crossed Battery icon on top */}
              <g transform="translate(210, 110)">
                <rect x={10} y={15} width={60} height={35} fill="none" stroke="#ef4444" strokeWidth={4} rx={4} />
                <rect x={70} y={23} width={6} height={18} fill="#ef4444" />
                {/* Red cross */}
                <line x1={0} y1={5} x2={80} y2={60} stroke="#ef4444" strokeWidth={6} />
                <line x1={80} y1={5} x2={0} y2={60} stroke="#ef4444" strokeWidth={6} />
              </g>
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
              không có xe điện,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_29: AI systems shut down */}
      {frame >= 225 && frame < 325 && (
        <AbsoluteFill style={{ opacity: opacityVo29 }}>
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
            <div style={{ transform: `scale(${errorScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Terminal Screen Mockup */}
              <div
                style={{
                  width: 500,
                  height: 250,
                  backgroundColor: "#020617",
                  border: "3px solid #ef4444",
                  borderRadius: 12,
                  padding: 20,
                  fontFamily: "monospace",
                  color: "#ef4444",
                  boxShadow: "0 0 40px rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 15, letterSpacing: 2 }}>CRITICAL ERROR</div>
                <div style={{ fontSize: 18, color: "#94a3b8", textAlign: "center" }}>
                  SYSTEM OFFLINE: NO RESPONSE FROM CHIP HOST<br />
                  AI DATA PROCESSING TERMINATED
                </div>
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
              và các hệ thống AI sẽ ngừng hoạt động.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
