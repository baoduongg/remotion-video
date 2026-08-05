import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene5Risks: React.FC = () => {
  const frame = useCurrentFrame();

  // vo_21 timing (0 - 90)
  const opacityVo21 = interpolate(frame, [0, 10, 80, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const warningPulse = interpolate(frame % 30, [0, 15, 30], [1, 1.15, 1], {
    easing: Easing.inOut(Easing.ease),
  });

  // vo_22 timing (90 - 197)
  const opacityVo22 = interpolate(frame, [90, 100, 187, 197], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Shaking effect for earthquake
  const shakeX = Math.sin(frame * 1.5) * interpolate(frame, [90, 110, 170, 197], [0, 8, 8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeY = Math.cos(frame * 1.5) * interpolate(frame, [90, 110, 170, 197], [0, 8, 8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_23 timing (197 - 277)
  const opacityVo23 = interpolate(frame, [197, 207, 267, 277], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowSlide = interpolate(frame, [197, 230], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_24 timing (277 - 348)
  const opacityVo24 = interpolate(frame, [277, 287, 338, 348], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gateScale = interpolate(frame, [277, 300], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_25 timing (348 - 457)
  const opacityVo25 = interpolate(frame, [348, 358, 447, 457], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockScale = interpolate(frame, [348, 380], [0.5, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_21.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_22.mp3")} from={90} />
      <Audio src={staticFile("audio/vo/vo_23.mp3")} from={197} />
      <Audio src={staticFile("audio/vo/vo_24.mp3")} from={277} />
      <Audio src={staticFile("audio/vo/vo_25.mp3")} from={348} />

      {/* vo_21: Warning triangle */}
      {frame >= 0 && frame < 90 && (
        <AbsoluteFill style={{ opacity: opacityVo21 }}>
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
              width={250}
              height={250}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              style={{ transform: `scale(${warningPulse})` }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="rgba(239, 68, 68, 0.15)" strokeWidth={2} />
              <line x1={12} y1={9} x2={12} y2={13} stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
              <line x1={12} y1={17} x2={12.01} y2={17} stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
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
              Tại sao việc này lại cực kỳ nguy hiểm?
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_22: Earthquake shaking Taiwan */}
      {frame >= 90 && frame < 197 && (
        <AbsoluteFill style={{ opacity: opacityVo22 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(${shakeX}px, ${shakeY}px)`,
            }}
          >
            <svg width={500} height={350} viewBox="0 0 500 350">
              {/* Seismograph jagged lines */}
              <path
                d={`M 50 200 L 150 200 L 180 150 L 200 250 L 220 100 L 240 300 L 260 50 L 280 250 L 300 180 L 320 220 L 450 200`}
                fill="none"
                stroke="#ef4444"
                strokeWidth={5}
                strokeLinecap="round"
              />
              {/* Shaking Taiwan map */}
              <path
                d="M 370 120 Q 395 130 380 210 T 350 180 Z"
                fill="#0d9488"
                stroke="#f8fafc"
                strokeWidth={2}
              />
              <text x={370} y={250} fill="#f8fafc" fontFamily={headingFont} fontSize={24} fontWeight={800} textAnchor="middle">
                ĐỘNG ĐẤT
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
              Nếu một trận động đất lớn xảy ra tại Đài Loan,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_23: Geopolitical arrows */}
      {frame >= 197 && frame < 277 && (
        <AbsoluteFill style={{ opacity: opacityVo23 }}>
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
              {/* Central Taiwan target */}
              <circle cx={300} cy={150} r={20} fill="#0d9488" />
              <circle cx={300} cy={150} r={40} fill="none" stroke="#0d9488" strokeWidth={2} />
              <text x={300} y={220} fill="#f8fafc" fontWeight={800} fontSize={20} textAnchor="middle">ĐÀI LOAN</text>

              {/* Left Arrow (Red) */}
              <line x1={50 + 150 * arrowSlide} y1={150} x2={220} y2={150} stroke="#ef4444" strokeWidth={10} markerEnd="url(#arrow)" opacity={arrowSlide} />
              <text x={80} y={120} fill="#ef4444" fontWeight={900} fontSize={20}>QUÂN SỰ</text>

              {/* Right Arrow (Cream) */}
              <line x1={550 - 150 * arrowSlide} y1={150} x2={380} y2={150} stroke="#f8fafc" strokeWidth={10} markerEnd="url(#arrow)" opacity={arrowSlide} />
              <text x={450} y={120} fill="#f8fafc" fontWeight={900} fontSize={20}>ĐỊA CHÍNH TRỊ</text>
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
              hoặc nếu căng thẳng địa chính trị
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_24: Factory blocked */}
      {frame >= 277 && frame < 348 && (
        <AbsoluteFill style={{ opacity: opacityVo24 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${gateScale})`,
            }}
          >
            <svg width={300} height={300} viewBox="0 0 200 200">
              {/* Factory silhouette */}
              <path d="M30,150 L30,100 L60,120 L60,100 L90,120 L90,100 L120,120 L120,150 Z" fill="#1e293b" stroke="#334155" strokeWidth={3} />
              <rect x={140} y={80} width={30} height={70} fill="#1e293b" stroke="#334155" strokeWidth={3} />

              {/* Big Red "X" representing disruption */}
              <line x1={20} y1={50} x2={180} y2={170} stroke="#ef4444" strokeWidth={14} strokeLinecap="round" />
              <line x1={180} y1={50} x2={20} y2={170} stroke="#ef4444" strokeWidth={14} strokeLinecap="round" />
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
              làm gián đoạn nhà máy,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_25: Locked globe */}
      {frame >= 348 && frame < 457 && (
        <AbsoluteFill style={{ opacity: opacityVo25 }}>
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
            <div style={{ transform: `scale(${lockScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg width={200} height={200} viewBox="0 0 200 200">
                {/* Globe */}
                <circle cx={100} cy={100} r={80} fill="#1e293b" stroke="#334155" strokeWidth={3} />
                <path d="M30,100 Q100,60 170,100" fill="none" stroke="#334155" strokeWidth={2} />
                <path d="M30,100 Q100,140 170,100" fill="none" stroke="#334155" strokeWidth={2} />
                <line x1={100} y1={20} x2={100} y2={180} stroke="#334155" strokeWidth={2} />

                {/* Big Lock Overlay */}
                <rect x={70} y={90} width={60} height={50} fill="#ef4444" rx={6} />
                <path d="M80,90 L80,65 Q100,45 120,65 L120,90" fill="none" stroke="#ef4444" strokeWidth={8} />
              </svg>
              <h2
                style={{
                  fontFamily: headingFont,
                  color: "#ef4444",
                  fontSize: 50,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginTop: 20,
                  textShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
                }}
              >
                ĐÓNG BĂNG TOÀN CẦU
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
                fontSize: 40,
                fontWeight: 700,
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                padding: "12px 24px",
                borderRadius: 8,
              }}
            >
              nền kinh tế số toàn cầu sẽ lập tức đóng băng.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
