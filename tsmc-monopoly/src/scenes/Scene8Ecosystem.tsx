import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene8Ecosystem: React.FC = () => {
  const frame = useCurrentFrame();

  // vo_34 timing (0 - 99)
  const opacityVo34 = interpolate(frame, [0, 10, 89, 99], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const systemRotate = interpolate(frame, [0, 99], [0, 60]);

  // vo_35 timing (99 - 217)
  const opacityVo35 = interpolate(frame, [99, 109, 207, 217], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logisticsFade = interpolate(frame, [99, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_36 timing (217 - 285)
  const opacityVo36 = interpolate(frame, [217, 227, 275, 285], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const characterPush = interpolate(frame, [217, 285], [-10, 10]);

  // vo_37 timing (285 - 354)
  const opacityVo37 = interpolate(frame, [285, 295, 344, 354], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sunAngle = interpolate(frame, [285, 354], [180, 360]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_34.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_35.mp3")} from={99} />
      <Audio src={staticFile("audio/vo/vo_36.mp3")} from={217} />
      <Audio src={staticFile("audio/vo/vo_37.mp3")} from={285} />

      {/* vo_34: Interlocking gears */}
      {frame >= 0 && frame < 99 && (
        <AbsoluteFill style={{ opacity: opacityVo34 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={360} height={360} viewBox="0 0 200 200">
              {/* Gear 1 (Center) */}
              <g transform={`rotate(${systemRotate} 100 100)`}>
                <circle cx={100} cy={100} r={40} fill="#0d9488" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <rect key={i} x={92} y={50} width={16} height={20} fill="#0d9488" transform={`rotate(${i * 60} 100 100)`} rx={2} />
                ))}
                <circle cx={100} cy={100} r={15} fill="#0f172a" />
              </g>

              {/* Gear 2 (Top Left) */}
              <g transform={`rotate(${-systemRotate * 1.5} 50 50)`}>
                <circle cx={50} cy={50} r={25} fill="#ef4444" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <rect key={i} x={45} y={18} width={10} height={12} fill="#ef4444" transform={`rotate(${i * 60} 50 50)`} rx={2} />
                ))}
                <circle cx={50} cy={50} r={8} fill="#0f172a" />
              </g>

              {/* Gear 3 (Bottom Right) */}
              <g transform={`rotate(${-systemRotate * 1.2} 150 150)`}>
                <circle cx={150} cy={150} r={30} fill="#f8fafc" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <rect key={i} x={145} y={112} width={10} height={15} fill="#f8fafc" transform={`rotate(${i * 60} 150 150)`} rx={2} />
                ))}
                <circle cx={150} cy={150} r={10} fill="#0f172a" />
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
              Nhưng sao chép hệ sinh thái cực kỳ phức tạp
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_35: Global logistics network */}
      {frame >= 99 && frame < 217 && (
        <AbsoluteFill style={{ opacity: opacityVo35 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: logisticsFade,
            }}
          >
            <svg width={600} height={350} viewBox="0 0 600 350">
              {/* Central Taiwan wafer */}
              <circle cx={420} cy={200} r={40} fill="#ef4444" />
              <text x={420} y={260} fill="#ef4444" fontWeight={900} fontSize={18} textAnchor="middle">ĐÀI LOAN</text>

              {/* ASML (Netherlands) */}
              <rect x={80} y={60} width={120} height={50} rx={6} fill="#1e293b" stroke="#0d9488" strokeWidth={2} />
              <text x={140} y={90} fill="#f8fafc" fontWeight={700} fontSize={16} textAnchor="middle">ASML (HÀ LAN)</text>
              <path d="M 200 85 Q 320 100 400 170" fill="none" stroke="#0d9488" strokeWidth={3} strokeDasharray="5,5" />

              {/* Zeiss (Germany) */}
              <rect x={60} y={230} width={140} height={50} rx={6} fill="#1e293b" stroke="#0d9488" strokeWidth={2} />
              <text x={130} y={260} fill="#f8fafc" fontWeight={700} fontSize={16} textAnchor="middle">ZEISS (ĐỨC)</text>
              <path d="M 200 255 Q 320 250 400 220" fill="none" stroke="#0d9488" strokeWidth={3} strokeDasharray="5,5" />

              {/* Chemicals (Japan) */}
              <rect x={280} y={40} width={150} height={50} rx={6} fill="#1e293b" stroke="#0d9488" strokeWidth={2} />
              <text x={355} y={70} fill="#f8fafc" fontWeight={700} fontSize={16} textAnchor="middle">HÓA CHẤT (NHẬT)</text>
              <path d="M 355 90 L 400 170" fill="none" stroke="#0d9488" strokeWidth={3} strokeDasharray="5,5" />
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
              và chuỗi cung ứng bán dẫn khổng lồ của TSMC
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_36: Pushing wall */}
      {frame >= 217 && frame < 285 && (
        <AbsoluteFill style={{ opacity: opacityVo36 }}>
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
              {/* Giant wall */}
              <rect x={300} y={40} width={80} height={220} fill="#1e293b" stroke="#334155" strokeWidth={4} rx={6} />
              <line x1={300} y1={100} x2={380} y2={100} stroke="#334155" strokeWidth={2} />
              <line x1={300} y1={160} x2={380} y2={160} stroke="#334155" strokeWidth={2} />

              {/* Character silhouette pushing the wall */}
              <g transform={`translate(${180 + characterPush}, 130)`}>
                {/* Body angle */}
                <line x1={40} y1={50} x2={60} y2={0} stroke="#ef4444" strokeWidth={10} strokeLinecap="round" />
                <circle cx={65} cy={-15} r={12} fill="#ef4444" />
                {/* Arm pushing */}
                <line x1={60} y1={10} x2={110} y2={10} stroke="#ef4444" strokeWidth={6} strokeLinecap="round" />
                {/* Legs */}
                <line x1={40} y1={50} x2={10} y2={90} stroke="#ef4444" strokeWidth={8} strokeLinecap="round" />
                <line x1={40} y1={50} x2={30} y2={90} stroke="#ef4444" strokeWidth={8} strokeLinecap="round" />
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
              là điều không thể làm
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_37: Sun and moon timeline */}
      {frame >= 285 && frame < 354 && (
        <AbsoluteFill style={{ opacity: opacityVo37 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={300} height={300} viewBox="0 0 200 200">
              <circle cx={100} cy={100} r={80} fill="none" stroke="#334155" strokeWidth={4} strokeDasharray="6,6" />
              <g transform={`rotate(${sunAngle} 100 100)`}>
                {/* Sun */}
                <circle cx={100} cy={20} r={18} fill="#ef4444" />
                {/* Moon */}
                <circle cx={100} cy={180} r={18} fill="#f8fafc" />
                <circle cx={106} cy={180} r={18} fill="#0f172a" />
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
              trong một sớm một chiều.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
