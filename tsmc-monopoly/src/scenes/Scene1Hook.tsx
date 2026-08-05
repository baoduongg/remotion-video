import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Animating values
  const scaleImage1 = interpolate(frame, [0, 100], [1.0, 1.1], {
    extrapolateRight: "clamp",
  });
  const opacityImage1 = interpolate(frame, [0, 10, 90, 100], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panImage2X = interpolate(frame, [100, 176], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityImage2 = interpolate(frame, [100, 110, 166, 176], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleImage3 = interpolate(frame, [176, 290], [1.0, 1.1], {
    extrapolateRight: "clamp",
  });
  const opacityImage3 = interpolate(frame, [176, 186, 280, 290], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_04 elements
  const opacityVo4 = interpolate(frame, [290, 300, 346, 356], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const circleScale = interpolate(frame, [290, 320], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_05 elements (map)
  const opacityVo5 = interpolate(frame, [356, 366, 441, 451], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mapScale = interpolate(frame, [356, 386], [0.8, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_06 elements
  const opacityVo6 = interpolate(frame, [451, 461, 543, 553], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tsmcScale = interpolate(frame, [451, 481], [0.9, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_01.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_02.mp3")} from={100} />
      <Audio src={staticFile("audio/vo/vo_03.mp3")} from={176} />
      <Audio src={staticFile("audio/vo/vo_04.mp3")} from={290} />
      <Audio src={staticFile("audio/vo/vo_05.mp3")} from={356} />
      <Audio src={staticFile("audio/vo/vo_06.mp3")} from={451} />

      {/* vo_01: touching screen */}
      {frame >= 0 && frame < 100 && (
        <AbsoluteFill style={{ opacity: opacityImage1 }}>
          <Img
            src={staticFile("images/scene-1-touching-screen.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scaleImage1})`,
            }}
          />
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
              Mọi thiết bị điện tử bạn chạm vào hôm nay,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_02: phone pocket */}
      {frame >= 100 && frame < 176 && (
        <AbsoluteFill style={{ opacity: opacityImage2 }}>
          <Img
            src={staticFile("images/scene-1-phone-pocket.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `translateX(${panImage2X}px)`,
            }}
          />
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
              từ chiếc iPhone trong túi
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_03: server racks */}
      {frame >= 176 && frame < 290 && (
        <AbsoluteFill style={{ opacity: opacityImage3 }}>
          <Img
            src={staticFile("images/scene-1-server-racks.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scaleImage3})`,
            }}
          />
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
              đến các máy chủ AI khổng lồ của siêu máy tính,
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_04: common point */}
      {frame >= 290 && frame < 356 && (
        <AbsoluteFill style={{ opacity: opacityVo4 }}>
          {/* SVG Infographic */}
          <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
            {/* Connecting lines */}
            <line x1={width / 2} y1={height / 2} x2={width * 0.2} y2={height * 0.3} stroke="#0d9488" strokeWidth={4} opacity={circleScale} />
            <line x1={width / 2} y1={height / 2} x2={width * 0.8} y2={height * 0.3} stroke="#0d9488" strokeWidth={4} opacity={circleScale} />
            <line x1={width / 2} y1={height / 2} x2={width * 0.3} y2={height * 0.7} stroke="#0d9488" strokeWidth={4} opacity={circleScale} />
            <line x1={width / 2} y1={height / 2} x2={width * 0.7} y2={height * 0.7} stroke="#0d9488" strokeWidth={4} opacity={circleScale} />

            {/* Core central red dot */}
            <circle cx={width / 2} cy={height / 2} r={40 * circleScale} fill="#ef4444" />
            <circle cx={width / 2} cy={height / 2} r={60 * circleScale} fill="none" stroke="#ef4444" strokeWidth={3} opacity={0.5} />

            {/* Outlying device nodes */}
            <circle cx={width * 0.2} cy={height * 0.3} r={20 * circleScale} fill="#0d9488" />
            <circle cx={width * 0.8} cy={height * 0.3} r={20 * circleScale} fill="#0d9488" />
            <circle cx={width * 0.3} cy={height * 0.7} r={20 * circleScale} fill="#0d9488" />
            <circle cx={width * 0.7} cy={height * 0.7} r={20 * circleScale} fill="#0d9488" />
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
              đều có một điểm chung:
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_05: east asia map */}
      {frame >= 356 && frame < 451 && (
        <AbsoluteFill style={{ opacity: opacityVo5 }}>
          {/* Simple Vector Map of East Asia */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${mapScale})`,
            }}
          >
            <svg width={800} height={500} viewBox="0 0 800 500">
              {/* Mainland Outline (Abstract) */}
              <path
                d="M 100 100 Q 200 80 300 100 T 500 120 T 600 200 T 550 350 T 400 400 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={3}
              />
              {/* Taiwan Island */}
              <path
                d="M 590 320 Q 610 330 600 370 T 580 350 Z"
                fill="#ef4444"
                stroke="#f8fafc"
                strokeWidth={2}
                style={{
                  filter: "drop-shadow(0px 0px 10px rgba(239,68,68,0.7))",
                }}
              />
              {/* Pulsing indicator on Taiwan */}
              <circle cx={595} cy={345} r={20} fill="none" stroke="#ef4444" strokeWidth={2} opacity={0.6} />
              {/* Text label */}
              <text x={630} y={350} fill="#f8fafc" fontFamily={bodyFont} fontSize={28} fontWeight={700}>
                ĐÀI LOAN
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
              chúng phụ thuộc vào một hòn đảo ở Đông Á
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_06: TSMC name */}
      {frame >= 451 && frame < 553 && (
        <AbsoluteFill style={{ opacity: opacityVo6 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${tsmcScale})`,
            }}
          >
            {/* Semi-conductor grid background */}
            <div
              style={{
                width: 320,
                height: 320,
                border: "4px solid #0d9488",
                borderRadius: 16,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(4, 1fr)",
                gap: 8,
                padding: 16,
                backgroundColor: "#111827",
                boxShadow: "0 0 50px rgba(13, 148, 136, 0.3)",
                marginBottom: 30,
              }}
            >
              {Array.from({ length: 16 }).map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: idx % 3 === 0 ? "#ef4444" : "#1f2937",
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
            <h1
              style={{
                fontFamily: headingFont,
                color: "#f8fafc",
                fontSize: 90,
                fontWeight: 900,
                letterSpacing: 8,
                margin: 0,
              }}
            >
              TSMC
            </h1>
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
              và công ty duy nhất mang tên TSMC.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
