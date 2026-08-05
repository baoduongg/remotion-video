import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene7Subsidies: React.FC = () => {
  const frame = useCurrentFrame();

  // vo_30 timing (0 - 93)
  const opacityVo30 = interpolate(frame, [0, 10, 83, 93], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mapScale = interpolate(frame, [0, 50], [0.85, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_31 timing (93 - 173)
  const opacityVo31 = interpolate(frame, [93, 103, 163, 173], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Coin dropping animation
  const coinY = interpolate(frame, [93, 150], [-40, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_32 timing (173 - 244)
  const opacityVo32 = interpolate(frame, [173, 183, 234, 244], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const craneRotate = interpolate(frame, [173, 244], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // vo_33 timing (244 - 325)
  const opacityVo33 = interpolate(frame, [244, 254, 315, 325], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scissorCut = interpolate(frame, [244, 275], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Audio Tracks */}
      <Audio src={staticFile("audio/vo/vo_30.mp3")} from={0} />
      <Audio src={staticFile("audio/vo/vo_31.mp3")} from={93} />
      <Audio src={staticFile("audio/vo/vo_32.mp3")} from={173} />
      <Audio src={staticFile("audio/vo/vo_33.mp3")} from={244} />

      {/* vo_30: US, Japan, Europe maps */}
      {frame >= 0 && frame < 93 && (
        <AbsoluteFill style={{ opacity: opacityVo30 }}>
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
            <svg width={600} height={300} viewBox="0 0 600 300">
              {/* US outline (abstract box shape) */}
              <rect x={50} y={100} width={130} height={80} fill="#1e293b" stroke="#0d9488" strokeWidth={3} rx={8} />
              <text x={115} y={145} fill="#f8fafc" fontWeight={800} fontSize={18} textAnchor="middle">USA</text>

              {/* Europe outline */}
              <rect x={230} y={80} width={140} height={100} fill="#1e293b" stroke="#0d9488" strokeWidth={3} rx={8} />
              <text x={300} y={135} fill="#f8fafc" fontWeight={800} fontSize={18} textAnchor="middle">EUROPE</text>

              {/* Japan outline */}
              <polygon points="460,220 480,180 500,100 520,120 480,240" fill="#1e293b" stroke="#0d9488" strokeWidth={3} />
              <text x={530} y={180} fill="#f8fafc" fontWeight={800} fontSize={18} textAnchor="middle">JAPAN</text>
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
              Mỹ, Nhật Bản và châu Âu
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_31: Pouring money */}
      {frame >= 93 && frame < 173 && (
        <AbsoluteFill style={{ opacity: opacityVo31 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={400} height={350} viewBox="0 0 400 350">
              {/* Funnel */}
              <polygon points="120,60 280,60 220,180 180,180" fill="#1e293b" stroke="#334155" strokeWidth={3} />
              <rect x={180} y={180} width={40} height={50} fill="#1e293b" stroke="#334155" strokeWidth={3} />

              {/* Factory below */}
              <rect x={130} y={230} width={140} height={70} fill="#0d9488" rx={6} />
              <polygon points="130,230 150,200 170,230" fill="#0d9488" />
              <polygon points="170,230 190,200 210,230" fill="#0d9488" />

              {/* Coins falling down */}
              <circle cx={200} cy={coinY} r={18} fill="#ef4444" />
              <text x={200} y={coinY + 7} fill="#f8fafc" fontSize={18} fontWeight={900} textAnchor="middle">$</text>

              <circle cx={170} cy={coinY - 60} r={18} fill="#ef4444" />
              <text x={170} y={coinY - 53} fill="#f8fafc" fontSize={18} fontWeight={900} textAnchor="middle">$</text>

              <circle cx={230} cy={coinY - 120} r={18} fill="#ef4444" />
              <text x={230} y={coinY - 113} fill="#f8fafc" fontSize={18} fontWeight={900} textAnchor="middle">$</text>
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
              đang đổ hàng chục tỷ đô la
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_32: Building new factories */}
      {frame >= 173 && frame < 244 && (
        <AbsoluteFill style={{ opacity: opacityVo32 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={400} height={350} viewBox="0 0 400 350">
              {/* Construction Crane */}
              <line x1={80} y1={300} x2={80} y2={100} stroke="#f8fafc" strokeWidth={5} />
              {/* Rotating arm */}
              <line
                x1={80}
                y1={100}
                x2={280}
                y2={100 - craneRotate}
                stroke="#f8fafc"
                strokeWidth={5}
              />
              <line x1={250} y1={100 - craneRotate} x2={250} y2={170} stroke="#ef4444" strokeWidth={2} />

              {/* Building structure */}
              <rect x={180} y={200} width={180} height={100} fill="none" stroke="#0d9488" strokeWidth={4} strokeDasharray="8,8" />
              <rect x={200} y={220} width={50} height={80} fill="#0d9488" opacity={0.5} />
              <rect x={270} y={240} width={60} height={60} fill="#0d9488" opacity={0.5} />
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
              xây dựng nhà máy mới
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* vo_33: Cutting dependencies */}
      {frame >= 244 && frame < 325 && (
        <AbsoluteFill style={{ opacity: opacityVo33 }}>
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
              {/* Left hub (US/EU) */}
              <rect x={40} y={110} width={100} height={80} fill="#1e293b" stroke="#334155" strokeWidth={3} rx={8} />
              <text x={90} y={155} fill="#f8fafc" fontWeight={800} fontSize={18} textAnchor="middle">USA / EU</text>

              {/* Right hub (Taiwan TSMC) */}
              <rect x={360} y={110} width={100} height={80} fill="#1e293b" stroke="#334155" strokeWidth={3} rx={8} />
              <text x={410} y={155} fill="#ef4444" fontWeight={800} fontSize={18} textAnchor="middle">TSMC</text>

              {/* Thick rope between them */}
              <line x1={140} y1={150} x2={360} y2={150} stroke="#f8fafc" strokeWidth={8} strokeLinecap="round" />

              {/* Scissors cutting it */}
              <g transform="translate(220, 110)">
                <line x1={10} y1={10} x2={50} y2={50} stroke="#ef4444" strokeWidth={6} strokeLinecap="round" transform={`rotate(${scissorCut} 30 30)`} />
                <line x1={50} y1={10} x2={10} y2={50} stroke="#ef4444" strokeWidth={6} strokeLinecap="round" transform={`rotate(${-scissorCut} 30 30)`} />
                <circle cx={10} cy={10} r={8} fill="none" stroke="#ef4444" strokeWidth={3} />
                <circle cx={50} cy={10} r={8} fill="none" stroke="#ef4444" strokeWidth={3} />
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
              nhằm giảm bớt sự phụ thuộc này.
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
