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

export const Scene2Foundry: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Animating values for each beat
  // vo_07
  const opacityVo7 = interpolate(frame, [0, 10, 113, 123], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yearScale = interpolate(frame, [0, 40], [0.8, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_08
  const opacityVo8 = interpolate(frame, [123, 133, 207, 217], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const designScale = interpolate(frame, [123, 150], [0.9, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_09
  const opacityVo9 = interpolate(frame, [217, 227, 283, 293], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gearRotation = interpolate(frame, [217, 293], [0, 180]);

  // vo_10
  const opacityVo10 = interpolate(frame, [293, 303, 361, 371], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [293, 320], [0.5, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_11
  const opacityVo11 = interpolate(frame, [371, 381, 445, 455], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crownScale = interpolate(frame, [371, 400], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_07.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_08.mp3")} from={123} />
      <Audio src={staticFile("audio/vo/vo_09.mp3")} from={217} />
      <Audio src={staticFile("audio/vo/vo_10.mp3")} from={293} />
      <Audio src={staticFile("audio/vo/vo_11.mp3")} from={371} />

      {/* vo_07: Morris Chang 1987 */}
      {frame >= 0 && frame < 123 && (
        <AbsoluteFill style={{ opacity: opacityVo7 }}>
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
            <div style={{ transform: `scale(${yearScale})`, textAlign: "center" }}>
              <div
                style={{
                  fontSize: 140,
                  fontFamily: headingFont,
                  fontWeight: 900,
                  color: "#ef4444",
                  letterSpacing: 4,
                  lineHeight: 1,
                }}
              >
                1987
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontFamily: headingFont,
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginTop: 20,
                  letterSpacing: 2,
                }}
              >
                MORRIS CHANG
              </div>
              <div style={{ fontSize: 24, color: "#0d9488", marginTop: 10, fontWeight: 600 }}>
                FOUNDER OF TSMC
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
                fontSize: 44,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              Được thành lập năm 1987 bởi Morris Chang,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_08: TSMC không tự thiết kế chip */}
      {frame >= 123 && frame < 217 && (
        <AbsoluteFill style={{ opacity: opacityVo8 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${designScale})`,
            }}
          >
            <svg width={500} height={400} viewBox="0 0 500 400">
              {/* Abstract Blueprint Grid */}
              <rect x={50} y={50} width={400} height={300} fill="#1e293b" stroke="#334155" strokeWidth={4} rx={12} />
              <line x1={150} y1={50} x2={150} y2={350} stroke="#334155" strokeWidth={2} />
              <line x1={250} y1={50} x2={250} y2={350} stroke="#334155" strokeWidth={2} />
              <line x1={350} y1={50} x2={350} y2={350} stroke="#334155" strokeWidth={2} />
              <line x1={50} y1={150} x2={450} y2={150} stroke="#334155" strokeWidth={2} />
              <line x1={50} y1={250} x2={450} y2={250} stroke="#334155" strokeWidth={2} />

              {/* Crossed red lines */}
              <line x1={80} y1={80} x2={420} y2={320} stroke="#ef4444" strokeWidth={12} strokeLinecap="round" />
              <line x1={420} y1={80} x2={80} y2={320} stroke="#ef4444" strokeWidth={12} strokeLinecap="round" />

              {/* Text Badge */}
              <rect x={120} y={160} width={260} height={80} fill="#0f172a" rx={8} stroke="#ef4444" strokeWidth={3} />
              <text x={250} y={210} fill="#ef4444" fontFamily={headingFont} fontSize={32} fontWeight={800} textAnchor="middle">
                NO DESIGN
              </text>
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
              TSMC không tự thiết kế chip.
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_09: Họ chỉ làm một việc duy nhất */}
      {frame >= 217 && frame < 293 && (
        <AbsoluteFill style={{ opacity: opacityVo9 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={350}
              height={350}
              viewBox="0 0 200 200"
              style={{
                transform: `rotate(${gearRotation}deg)`,
              }}
            >
              {/* Cog / Gear representing manufacturing focus */}
              <circle cx={100} cy={100} r={50} fill="#ef4444" />
              {Array.from({ length: 8 }).map((_, idx) => {
                const angle = (idx * 360) / 8;
                return (
                  <rect
                    key={idx}
                    x={90}
                    y={30}
                    width={20}
                    height={40}
                    fill="#ef4444"
                    transform={`rotate(${angle}, 100, 100)`}
                    rx={4}
                  />
                );
              })}
              <circle cx={100} cy={100} r={25} fill="#0f172a" />
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
              Họ chỉ làm một việc duy nhất:
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_10: sản xuất chip cho các đối tác */}
      {frame >= 293 && frame < 371 && (
        <AbsoluteFill style={{ opacity: opacityVo10 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
              {/* Central Wafer Hub */}
              <circle cx={width / 2} cy={height / 2} r={80} fill="#0d9488" opacity={logoScale} />
              <text x={width / 2} y={height / 2 + 10} fill="#f8fafc" fontSize={24} fontWeight={800} textAnchor="middle" opacity={logoScale}>
                FACTORY
              </text>

              {/* Client brand labels (Apple, Nvidia, etc.) connected to wafer */}
              <g transform={`scale(${logoScale})`} style={{ transformOrigin: "center" }}>
                {/* Top-Left: Apple */}
                <line x1={width * 0.25} y1={height * 0.25} x2={width / 2} y2={height / 2} stroke="#f8fafc" strokeWidth={3} strokeDasharray="5,5" />
                <rect x={width * 0.15} y={height * 0.2} width={130} height={50} rx={8} fill="#1e293b" stroke="#f8fafc" strokeWidth={2} />
                <text x={width * 0.15 + 65} y={height * 0.2 + 32} fill="#f8fafc" fontWeight={700} fontSize={20} textAnchor="middle">APPLE</text>

                {/* Top-Right: Nvidia */}
                <line x1={width * 0.75} y1={height * 0.25} x2={width / 2} y2={height / 2} stroke="#f8fafc" strokeWidth={3} strokeDasharray="5,5" />
                <rect x={width * 0.65} y={height * 0.2} width={130} height={50} rx={8} fill="#1e293b" stroke="#f8fafc" strokeWidth={2} />
                <text x={width * 0.65 + 65} y={height * 0.2 + 32} fill="#f8fafc" fontWeight={700} fontSize={20} textAnchor="middle">NVIDIA</text>

                {/* Bottom-Left: AMD */}
                <line x1={width * 0.25} y1={height * 0.75} x2={width / 2} y2={height / 2} stroke="#f8fafc" strokeWidth={3} strokeDasharray="5,5" />
                <rect x={width * 0.15} y={height * 0.7} width={130} height={50} rx={8} fill="#1e293b" stroke="#f8fafc" strokeWidth={2} />
                <text x={width * 0.15 + 65} y={height * 0.7 + 32} fill="#f8fafc" fontWeight={700} fontSize={20} textAnchor="middle">AMD</text>

                {/* Bottom-Right: Qualcomm */}
                <line x1={width * 0.75} y1={height * 0.75} x2={width / 2} y2={height / 2} stroke="#f8fafc" strokeWidth={3} strokeDasharray="5,5" />
                <rect x={width * 0.63} y={height * 0.7} width={150} height={50} rx={8} fill="#1e293b" stroke="#f8fafc" strokeWidth={2} />
                <text x={width * 0.63 + 75} y={height * 0.7 + 32} fill="#f8fafc" fontWeight={700} fontSize={20} textAnchor="middle">QUALCOMM</text>
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
              sản xuất chip cho các đối tác,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_11: nhưng làm tốt hơn bất kỳ ai */}
      {frame >= 371 && frame < 455 && (
        <AbsoluteFill style={{ opacity: opacityVo11 }}>
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
            <div style={{ transform: `scale(${crownScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Crown Icon (SVG) */}
              <svg width={150} height={150} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2}>
                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="#ef4444" />
                <path d="M3 20h18v2H3z" fill="#ef4444" />
              </svg>
              <h2
                style={{
                  fontFamily: headingFont,
                  color: "#f8fafc",
                  fontSize: 56,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginTop: 20,
                  textShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
                }}
              >
                TỐT NHẤT THẾ GIỚI
              </h2>
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
              nhưng làm tốt hơn bất kỳ ai.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
