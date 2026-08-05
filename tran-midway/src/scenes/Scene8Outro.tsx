import {
  AbsoluteFill,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont } from "../fonts";

export const Scene8Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill name="Scene 8 - Outro" style={{ backgroundColor: "#070d16" }}>
      <Audio src={staticFile("audio/vo/vo_08.mp3")} from={15} />
      <Img
        src={staticFile("images/scene_8_outro.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          opacity: 0.7,
        }}
      />
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: 0.2 }}
      >
        {[0.2, 0.4, 0.6, 0.8].map((p) => (
          <line
            key={`h-${p}`}
            x1={0}
            y1={height * p}
            x2={width}
            y2={height * p}
            stroke="#16283d"
            strokeWidth={1}
          />
        ))}
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((p) => (
          <line
            key={`v-${p}`}
            x1={width * p}
            y1={0}
            x2={width * p}
            y2={height}
            stroke="#16283d"
            strokeWidth={1}
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          translate: "-50% -50%",
          width: 12,
          height: 12,
          borderRadius: 999,
          backgroundColor: "#d4af37",
          boxShadow: "0 0 30px 8px rgba(212,175,55,0.4)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          translate: "-50% 0%",
          textAlign: "center",
          width: 1400,
        }}
      >
        <Interactive.Div
          name="Closing line"
          style={{
            color: "#f3f1e7",
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 52,
            lineHeight: 1.5,
            textShadow: "0 4px 26px rgba(0,0,0,0.65)",
            opacity: interpolate(frame, [30, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Midway không phải trận đánh lớn nhất Thế chiến II. Nhưng đó là trận
          đánh mà một bên gần như không thể thua — và một bên gần như không
          có quyền được thắng.
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: interpolate(
            frame,
            [durationInFrames - 40, durationInFrames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      />
    </AbsoluteFill>
  );
};
