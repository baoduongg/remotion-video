import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";
import { Caption } from "../TextOverlay";
import { shotTransform } from "../kenBurns";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const transform = shotTransform(frame, [
    { from: 0, to: 240, scale: [1.0, 1.1] },
    { from: 240, to: durationInFrames, scale: [1.22, 1.35], x: [-3, 2], y: [-2, 3] },
  ]);

  return (
    <AbsoluteFill name="Scene 1 - Hook" style={{ backgroundColor: "#070d16" }}>
      <Audio src={staticFile("audio/vo/vo_01.mp3")} from={15} />
      <Img
        src={staticFile("images/scene_1_hook.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform,
          opacity: 0.7,
        }}
      />
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: 0.28 }}
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
          top: "40%",
          translate: "-50% -50%",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            backgroundColor: "#d4af37",
            boxShadow: "0 0 40px 12px rgba(212,175,55,0.5)",
            scale: interpolate(frame % 60, [0, 30, 60], [1, 1.6, 1], {
              easing: Easing.inOut(Easing.ease),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          translate: "-50% 0%",
        }}
      >
        <Interactive.Div
          name="Midway label"
          style={{
            color: "#7d90a8",
            fontFamily: bodyFont,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: interpolate(frame, [10, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Đảo san hô Midway
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          translate: "-50% 0%",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Title"
          style={{
            color: "#f3f1e7",
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 100,
            letterSpacing: 6,
            opacity: interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          Trận Midway
        </Interactive.Div>
      </div>

      <Caption name="Hook caption" from={3 * fps}>
        Một đảo san hô nhỏ gần như vô nghĩa trên bản đồ — nhưng tháng 6 năm
        1942, nó quyết định cục diện cả một cuộc chiến.
      </Caption>
    </AbsoluteFill>
  );
};
