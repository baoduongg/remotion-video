import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { bodyFont } from "../fonts";
import { shotTransform } from "../kenBurns";
import { Caption, SectionTitle } from "../TextOverlay";
import { AnimatedCounter } from "../vox/AnimatedCounter";

const MAX_BAR = 600;

const ROWS = [
  {
    label: "Tàu sân bay",
    japan: 4,
    us: 1,
    max: 4,
    prefix: "",
    grow: 70,
  },
  {
    label: "Người thiệt mạng",
    japan: 3057,
    us: 307,
    max: 3057,
    prefix: "~",
    grow: 170,
  },
  {
    label: "Máy bay",
    japan: 248,
    us: 150,
    max: 248,
    prefix: "~",
    grow: 270,
  },
] as const;

const ROW_Y = [280, 480, 680];

export const Scene7Aftermath: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const transform = shotTransform(frame, [
    { from: 0, to: 310, scale: [1.0, 1.12] },
    { from: 310, to: durationInFrames, scale: [1.18, 1.3], x: [-2, 2], y: [-1, 1] },
  ]);

  return (
    <AbsoluteFill
      name="Scene 7 - Aftermath"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_07.mp3")} from={30} />
      <Img
        src={staticFile("images/scene_7_aftermath.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform,
          opacity: 0.45,
        }}
      />
      <SectionTitle name="Aftermath title">Tổn thất hai bên</SectionTitle>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 165,
          translate: "-50% 0%",
          display: "flex",
          gap: 500,
          color: "#7d90a8",
          fontFamily: bodyFont,
          fontSize: 24,
          letterSpacing: 3,
          textTransform: "uppercase",
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        }}
      >
        <span style={{ color: "#e0483e" }}>Nhật Bản</span>
        <span style={{ color: "#4ea1ff" }}>Hoa Kỳ</span>
      </div>

      {ROWS.map((row, rowIndex) => {
        const japanWidth = interpolate(
          frame,
          [row.grow, row.grow + 60],
          [0, (row.japan / row.max) * MAX_BAR],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const usWidth = interpolate(
          frame,
          [row.grow, row.grow + 60],
          [0, (row.us / row.max) * MAX_BAR],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const labelOpacity = interpolate(
          frame,
          [row.grow - 10, row.grow + 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={row.label}
            style={{
              position: "absolute",
              left: "50%",
              top: ROW_Y[rowIndex],
              translate: "-50% 0%",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#f3f1e7",
                fontFamily: bodyFont,
                fontSize: 26,
                marginBottom: 10,
                opacity: labelOpacity,
              }}
            >
              {row.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", height: 40 }}>
              <div
                style={{
                  width: MAX_BAR,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: japanWidth,
                    height: 34,
                    backgroundColor: "#e0483e",
                    borderRadius: "6px 0 0 6px",
                  }}
                />
                <div
                  style={{
                    marginLeft: 12,
                    color: "#e6b3ae",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                  }}
                >
                  <AnimatedCounter
                    from={row.grow}
                    to={row.grow + 40}
                    target={row.japan}
                    prefix={row.prefix}
                  />
                </div>
              </div>
              <div style={{ width: 40 }} />
              <div style={{ width: MAX_BAR, display: "flex" }}>
                <div
                  style={{
                    marginRight: 12,
                    color: "#bcd9ff",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                    textAlign: "right",
                  }}
                >
                  <AnimatedCounter
                    from={row.grow}
                    to={row.grow + 40}
                    target={row.us}
                    prefix={row.prefix}
                  />
                </div>
                <div
                  style={{
                    width: usWidth,
                    height: 34,
                    backgroundColor: "#4ea1ff",
                    borderRadius: "0 6px 6px 0",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      <Caption name="Aftermath caption" from={400}>
        Chỉ trong vài ngày, thế cân bằng lực lượng ở Thái Bình Dương đảo chiều
        — và không bao giờ quay lại như cũ.
      </Caption>
    </AbsoluteFill>
  );
};
