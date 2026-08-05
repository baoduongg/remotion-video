import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene3Monopoly: React.FC = () => {
  const frame = useCurrentFrame();

  // vo_12 timing (0 - 139)
  const opacityVo12 = interpolate(frame, [0, 10, 129, 139], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chartDraw = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text90Percent = interpolate(frame, [20, 50], [0, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_13 timing (139 - 228)
  const opacityVo13 = interpolate(frame, [139, 149, 218, 228], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipScale = interpolate(frame, [139, 169], [0.8, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_14 timing (228 - 298)
  const opacityVo14 = interpolate(frame, [228, 238, 288, 298], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const comparisonTranslate = interpolate(frame, [228, 298], [0, -20]);

  // vo_15 timing (298 - 387)
  const opacityVo15 = interpolate(frame, [298, 308, 377, 387], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brainPulse = interpolate(frame % 40, [0, 20, 40], [1, 1.08, 1], {
    easing: Easing.inOut(Easing.ease),
  });

  // vo_16 timing (387 - 471)
  const opacityVo16 = interpolate(frame, [387, 397, 461, 471], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneFloatY = interpolate(frame, [387, 471], [0, -15]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_12.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_13.mp3")} from={139} />
      <Audio src={staticFile("audio/vo/vo_14.mp3")} from={228} />
      <Audio src={staticFile("audio/vo/vo_15.mp3")} from={298} />
      <Audio src={staticFile("audio/vo/vo_16.mp3")} from={387} />

      {/* vo_12: 90% pie chart */}
      {frame >= 0 && frame < 139 && (
        <AbsoluteFill style={{ opacity: opacityVo12 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={400} height={400} viewBox="0 0 200 200">
              {/* Pie Chart background (10% cream) */}
              <circle cx={100} cy={100} r={80} fill="#f8fafc" />

              {/* Pie Chart active (90% red) */}
              <circle
                cx={100}
                cy={100}
                r={80}
                fill="none"
                stroke="#ef4444"
                strokeWidth={160}
                strokeDasharray={`${chartDraw * 90 * 5.02} 502`}
                transform="rotate(-90 100 100)"
              />

              {/* Center cutout (donut chart look) */}
              <circle cx={100} cy={100} r={55} fill="#0f172a" />

              {/* Text inside */}
              <text x={100} y={112} fill="#f8fafc" fontFamily={headingFont} fontSize={32} fontWeight={900} textAnchor="middle">
                {Math.round(text90Percent)}%
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
                fontSize: 44,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              Hiện nay, TSMC kiểm soát hơn 90% nguồn cung
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_13: chip ban dan tien tien */}
      {frame >= 139 && frame < 228 && (
        <AbsoluteFill style={{ opacity: opacityVo13 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${chipScale})`,
            }}
          >
            {/* Glowing microchip design */}
            <svg width={300} height={300} viewBox="0 0 200 200">
              <rect x={30} y={30} width={140} height={140} fill="#1e293b" stroke="#0d9488" strokeWidth={5} rx={16} />
              <rect x={55} y={55} width={90} height={90} fill="#111827" stroke="#ef4444" strokeWidth={3} rx={8} />

              {/* Grid lines inside */}
              <line x1={80} y1={55} x2={80} y2={145} stroke="#0d9488" strokeWidth={2} />
              <line x1={100} y1={55} x2={100} y2={145} stroke="#0d9488" strokeWidth={2} />
              <line x1={120} y1={55} x2={120} y2={145} stroke="#0d9488" strokeWidth={2} />
              <line x1={55} y1={80} x2={145} y2={80} stroke="#0d9488" strokeWidth={2} />
              <line x1={55} y1={100} x2={145} y2={100} stroke="#0d9488" strokeWidth={2} />
              <line x1={55} y1={120} x2={145} y2={120} stroke="#0d9488" strokeWidth={2} />

              {/* Pins around */}
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 90} 100 100)`}>
                  <line x1={60} y1={15} x2={60} y2={30} stroke="#0d9488" strokeWidth={4} />
                  <line x1={100} y1={15} x2={100} y2={30} stroke="#ef4444" strokeWidth={4} />
                  <line x1={140} y1={15} x2={140} y2={30} stroke="#0d9488" strokeWidth={4} />
                </g>
              ))}
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
              chip bán dẫn tiên tiến nhất hành tinh,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_14: duoi 3 nanomet */}
      {frame >= 228 && frame < 298 && (
        <AbsoluteFill style={{ opacity: opacityVo14 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${comparisonTranslate}px)`,
            }}
          >
            <svg width={600} height={350} viewBox="0 0 600 350">
              {/* Hair strand vs Chip nanometer comparison */}
              {/* Hair cylinder */}
              <rect x={100} y={50} width={120} height={250} fill="#334155" rx={10} />
              <text x={160} y={180} fill="#f8fafc" fontFamily={headingFont} fontSize={22} fontWeight={700} textAnchor="middle">
                SỢI TÓC
              </text>
              <text x={160} y={210} fill="#94a3b8" fontFamily={headingFont} fontSize={16} textAnchor="middle">
                ~80,000 nm
              </text>

              {/* Arrow */}
              <path d="M 280 175 L 340 175" stroke="#f8fafc" strokeWidth={4} markerEnd="url(#arrow)" />
              <text x={310} y={150} fill="#0d9488" fontWeight={700} fontSize={20} textAnchor="middle">GẤP 26,000 LẦN</text>

              {/* 3nm Chip node */}
              <circle cx={460} cy={175} r={8} fill="#ef4444" />
              <circle cx={460} cy={175} r={24} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.5} />
              <text x={460} y={230} fill="#ef4444" fontFamily={headingFont} fontSize={26} fontWeight={800} textAnchor="middle">
                3 NM
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
              loại dưới 3 nanomet
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_15: van hanh tri tue nhan tao */}
      {frame >= 298 && frame < 387 && (
        <AbsoluteFill style={{ opacity: opacityVo15 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ transform: `scale(${brainPulse})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={320} height={320} viewBox="0 0 200 200">
                {/* Circuit brain design */}
                {/* Background brain silhouette */}
                <path d="M70,40 Q60,20 100,20 Q140,20 130,40 Q170,45 170,80 Q170,120 130,130 Q120,170 100,170 Q80,170 70,130 Q30,120 30,80 Q30,45 70,40 Z" fill="#1e293b" opacity={0.6} />

                {/* Nodes */}
                <circle cx={70} cy={60} r={6} fill="#0d9488" />
                <circle cx={130} cy={60} r={6} fill="#0d9488" />
                <circle cx={100} cy={95} r={10} fill="#ef4444" />
                <circle cx={60} cy={100} r={6} fill="#0d9488" />
                <circle cx={140} cy={100} r={6} fill="#0d9488" />
                <circle cx={80} cy={135} r={6} fill="#0d9488" />
                <circle cx={120} cy={135} r={6} fill="#0d9488" />

                {/* Connection lines */}
                <line x1={70} y1={60} x2={100} y2={95} stroke="#0d9488" strokeWidth={2} />
                <line x1={130} y1={60} x2={100} y2={95} stroke="#0d9488" strokeWidth={2} />
                <line x1={60} y1={100} x2={100} y2={95} stroke="#0d9488" strokeWidth={2} />
                <line x1={140} y1={100} x2={100} y2={95} stroke="#0d9488" strokeWidth={2} />
                <line x1={80} y1={135} x2={100} y2={95} stroke="#0d9488" strokeWidth={2} />
                <line x1={120} y1={135} x2={100} y2={95} stroke="#0d9488" strokeWidth={2} />
              </svg>
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
              dùng để vận hành trí tuệ nhân tạo
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_16: và dien thoai thong minh the he moi */}
      {frame >= 387 && frame < 471 && (
        <AbsoluteFill style={{ opacity: opacityVo16 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${phoneFloatY}px)`,
            }}
          >
            <svg width={240} height={420} viewBox="0 0 240 420">
              {/* Smartphone vector outline */}
              <rect x={20} y={20} width={200} height={380} fill="#1e293b" stroke="#0d9488" strokeWidth={6} rx={24} />
              <rect x={35} y={35} width={170} height={350} fill="#0f172a" rx={12} />

              {/* Interface mockup details */}
              <rect x={50} y={60} width={140} height={80} fill="#1f2937" rx={6} />
              <circle cx={70} cy={100} r={15} fill="#ef4444" />
              <line x1={100} y1={90} x2={170} y2={90} stroke="#f8fafc" strokeWidth={4} strokeLinecap="round" />
              <line x1={100} y1={110} x2={150} y2={110} stroke="#94a3b8" strokeWidth={4} strokeLinecap="round" />

              <rect x={50} y={160} width={140} height={180} fill="#1f2937" rx={6} />
              <circle cx={120} cy={250} r={35} fill="none" stroke="#0d9488" strokeWidth={3} />
              <circle cx={120} cy={250} r={15} fill="#0d9488" />
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
              và điện thoại thông minh thế hệ mới.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
