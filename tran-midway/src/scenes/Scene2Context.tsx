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

const NODES = [
  { x: 0.12, date: "07/12/1941", label: "Trân Châu Cảng", pop: 40, gold: false },
  { x: 0.38, date: "04/1942", label: "Không kích Doolittle", pop: 200, gold: false },
  { x: 0.64, date: "05/1942", label: "Trận biển Coral", pop: 320, gold: false },
  { x: 0.9, date: "06/1942", label: "Midway?", pop: 430, gold: true },
] as const;

export const Scene2Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const lineY = height * 0.45;

  return (
    <AbsoluteFill name="Scene 2 - Context" style={{ backgroundColor: "#070d16" }}>
      <Audio src={staticFile("audio/vo/vo_02.mp3")} from={20} />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 90,
        }}
      >
        <Interactive.Div
          name="Section title"
          style={{
            color: "#7d90a8",
            fontFamily: bodyFont,
            fontSize: 30,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Sáu tháng trước Midway
        </Interactive.Div>
      </div>

      <svg
        width={width}
        height={4}
        style={{ position: "absolute", left: 0, top: lineY }}
      >
        <line
          x1={width * 0.1}
          y1={2}
          x2={width * 0.92}
          y2={2}
          stroke="#16283d"
          strokeWidth={3}
        />
        <line
          x1={width * 0.1}
          y1={2}
          x2={width * 0.92}
          y2={2}
          stroke="#d4af37"
          strokeWidth={3}
          strokeDasharray={width}
          strokeDashoffset={interpolate(frame, [0, 90], [width, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          })}
        />
      </svg>

      {NODES.map((node) => (
        <div
          key={node.label}
          style={{
            position: "absolute",
            left: width * node.x,
            top: lineY + 2,
            translate: "-50% -50%",
          }}
        >
          <div
            style={{
              width: node.gold ? 22 : 16,
              height: node.gold ? 22 : 16,
              borderRadius: 999,
              backgroundColor: node.gold ? "#d4af37" : "#4ea1ff",
              boxShadow: node.gold
                ? "0 0 30px 8px rgba(212,175,55,0.5)"
                : "none",
              scale: interpolate(
                frame,
                [node.pop, node.pop + 15],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(2)),
                  output: "perceptual-scale",
                },
              ),
            }}
          />
        </div>
      ))}

      {NODES.map((node) => (
        <div
          key={`label-${node.label}`}
          style={{
            position: "absolute",
            left: width * node.x,
            top: lineY - 120,
            translate: "-50% 0%",
            textAlign: "center",
            width: 340,
          }}
        >
          <Interactive.Div
            name={`Date ${node.label}`}
            style={{
              color: node.gold ? "#d4af37" : "#f3f1e7",
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 34,
              opacity: interpolate(frame, [node.pop, node.pop + 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {node.date}
          </Interactive.Div>
          <div
            style={{
              marginTop: 10,
              color: "#c7d2e0",
              fontFamily: bodyFont,
              fontSize: 26,
              opacity: interpolate(
                frame,
                [node.pop + 5, node.pop + 20],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          >
            {node.label}
          </div>
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: 120,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Context caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [480, 520, durationInFrames - 40, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Sau đòn tập kích Trân Châu Cảng, Đô đốc Yamamoto quyết tâm nhử hạm
          đội tàu sân bay Mỹ ra khỏi nơi ẩn náu — và tiêu diệt nó tại Midway.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
