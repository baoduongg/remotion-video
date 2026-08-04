import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill name="Scene 1 - Hook" style={{ backgroundColor: "#070d16" }}>
      <Audio src={staticFile("audio/vo/vo_01.mp3")} from={15} />
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
          }}
        >
          Trận Midway
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: 130,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Hook caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 40,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [3 * fps, 3.6 * fps, durationInFrames - 20, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Một đảo san hô nhỏ gần như vô nghĩa trên bản đồ — nhưng tháng 6 năm
          1942, nó quyết định cục diện cả một cuộc chiến.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
