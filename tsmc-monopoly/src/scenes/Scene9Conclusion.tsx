import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene9Conclusion: React.FC = () => {
  const frame = useCurrentFrame();

  // vo_38 timing (0 - 80)
  const opacityVo38 = interpolate(frame, [0, 10, 70, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const independentGearRotate = interpolate(frame, [0, 80], [0, 180]);

  // vo_39 timing (80 - 158)
  const opacityVo39 = interpolate(frame, [80, 90, 148, 158], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const technicianScale = interpolate(frame, [80, 110], [0.9, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_40 timing (158 - 249)
  const opacityVo40 = interpolate(frame, [158, 168, 239, 249], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sandDrop = interpolate(frame, [158, 249], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_41 timing (249 - 330)
  const opacityVo41 = interpolate(frame, [249, 259, 320, 330], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glassTranslateX = interpolate(frame, [249, 300], [-80, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_42 timing (330 - 429)
  const opacityVo42 = interpolate(frame, [330, 340, 419, 429], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yellowPulse = interpolate(frame % 30, [0, 15, 30], [1.0, 1.05, 1.0], {
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_38.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_39.mp3")} from={80} />
      <Audio src={staticFile("audio/vo/vo_40.mp3")} from={158} />
      <Audio src={staticFile("audio/vo/vo_41.mp3")} from={249} />
      <Audio src={staticFile("audio/vo/vo_42.mp3")} from={330} />

      {/* vo_38: Standalone gear */}
      {frame >= 0 && frame < 80 && (
        <AbsoluteFill style={{ opacity: opacityVo38 }}>
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
              width={220}
              height={220}
              viewBox="0 0 100 100"
              style={{ transform: `rotate(${independentGearRotate}deg)` }}
            >
              <circle cx={50} cy={50} r={30} fill="#0d9488" />
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={i}
                  x={44}
                  y={10}
                  width={12}
                  height={15}
                  fill="#0d9488"
                  transform={`rotate(${i * 45} 50 50)`}
                  rx={2}
                />
              ))}
              <circle cx={50} cy={50} r={10} fill="#0f172a" />
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
              Liệu thế giới có thể tự chủ
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_39: Clean room operator */}
      {frame >= 80 && frame < 158 && (
        <AbsoluteFill style={{ opacity: opacityVo39 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${technicianScale})`,
            }}
          >
            <svg width={300} height={300} viewBox="0 0 200 200">
              {/* Technician outline */}
              <circle cx={100} cy={60} r={24} fill="#0d9488" />
              <path d="M60,140 Q100,90 140,140 Z" fill="#0d9488" />

              {/* Silicon Wafer in hand */}
              <circle cx={100} cy={110} r={35} fill="#ef4444" stroke="#f8fafc" strokeWidth={2} />
              <line x1={70} y1={110} x2={130} y2={110} stroke="#f8fafc" strokeWidth={1} />
              <line x1={100} y1={80} x2={100} y2={140} stroke="#f8fafc" strokeWidth={1} />
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
              công nghệ bán dẫn tiên tiến
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_40: Hourglass and storm */}
      {frame >= 158 && frame < 249 && (
        <AbsoluteFill style={{ opacity: opacityVo40 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={300} height={350} viewBox="0 0 200 250">
              {/* Hourglass Frame */}
              <line x1={40} y1={20} x2={160} y2={20} stroke="#f8fafc" strokeWidth={8} strokeLinecap="round" />
              <line x1={40} y1={230} x2={160} y2={230} stroke="#f8fafc" strokeWidth={8} strokeLinecap="round" />
              <path d="M50,20 L50,80 Q100,125 100,125 Q100,125 150,80 L150,20 Z" fill="none" stroke="#f8fafc" strokeWidth={4} />
              <path d="M50,230 L50,170 Q100,125 100,125 Q100,125 150,170 L150,230 Z" fill="none" stroke="#f8fafc" strokeWidth={4} />

              {/* Sand running out */}
              {/* Top Sand shrinking */}
              <polygon points={`60,80 140,80 100,125`} fill="#ef4444" opacity={1 - sandDrop / 120} />
              {/* Sand line */}
              <line x1={100} y1={125} x2={100} y2={220} stroke="#ef4444" strokeWidth={3} />
              {/* Bottom Sand filling */}
              <path d={`M 70,225 Q 100,${225 - sandDrop / 3} 130,225 Z`} fill="#ef4444" />
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
                fontSize: 40,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              trước khi một cuộc khủng hoảng lớn xảy ra?
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_41: Magnifying glass focusing chip */}
      {frame >= 249 && frame < 330 && (
        <AbsoluteFill style={{ opacity: opacityVo41 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={500} height={300} viewBox="0 0 500 300">
              {/* Microchip */}
              <rect x={220} y={120} width={60} height={60} fill="#1e293b" stroke="#ef4444" strokeWidth={2} rx={4} />
              <rect x={235} y={135} width={30} height={30} fill="#ef4444" />

              {/* Magnifying Glass sliding in */}
              <g transform={`translate(${glassTranslateX}, 0)`}>
                <circle cx={250} cy={150} r={60} fill="none" stroke="#f8fafc" strokeWidth={6} />
                <line x1={292} y1={192} x2={340} y2={240} stroke="#f8fafc" strokeWidth={8} strokeLinecap="round" />
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
              Câu trả lời vẫn đang nằm tại
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_42: Yellow-lit fab room */}
      {frame >= 330 && frame < 429 && (
        <AbsoluteFill style={{ opacity: opacityVo42 }}>
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
            <div style={{ transform: `scale(${yellowPulse})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width={320} height={200} viewBox="0 0 320 200">
                {/* Yellow lit industrial cleanroom grid */}
                <rect x={10} y={10} width={300} height={180} fill="#111827" stroke="#eab308" strokeWidth={4} rx={12} />
                <line x1={80} y1={10} x2={80} y2={190} stroke="#eab308" strokeWidth={2} opacity={0.3} />
                <line x1={160} y1={10} x2={160} y2={190} stroke="#eab308" strokeWidth={2} opacity={0.3} />
                <line x1={240} y1={10} x2={240} y2={190} stroke="#eab308" strokeWidth={2} opacity={0.3} />

                {/* Robotic assembly arms (simplified) */}
                <line x1={80} y1={100} x2={140} y2={100} stroke="#eab308" strokeWidth={6} strokeLinecap="round" />
                <line x1={140} y1={100} x2={140} y2={130} stroke="#eab308" strokeWidth={4} strokeLinecap="round" />
                <circle cx={140} cy={135} r={8} fill="#ef4444" />
              </svg>
              <h2
                style={{
                  fontFamily: headingFont,
                  color: "#eab308",
                  fontSize: 40,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginTop: 20,
                  textShadow: "0 0 20px rgba(234, 179, 8, 0.4)",
                }}
              >
                PHÒNG SẠCH TSMC
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
              các phòng sạch vô trùng của TSMC.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
