import {
  AbsoluteFill,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TARGET = "MIDWAY";
const REVEAL_START = 160;
const REVEAL_STAGGER = 10;
const REVEAL_SPAN = 40;

function decodedChar(index: number, frame: number): string {
  const revealAt = REVEAL_START + index * REVEAL_STAGGER + REVEAL_SPAN;
  if (frame >= revealAt) {
    return TARGET[index];
  }
  return CIPHER_CHARS[(frame * 5 + index * 13) % CIPHER_CHARS.length];
}

export const Scene3Codebreaking: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Scene 3 - Codebreaking"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_03.mp3")} from={30} />
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
          Vũ khí bí mật
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 160,
          top: "42%",
          translate: "0% -50%",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 30,
            color: "#7d90a8",
            letterSpacing: 4,
            marginBottom: 24,
            opacity: interpolate(frame, [40, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          MẬT MÃ HẢI QUÂN NHẬT — MỤC TIÊU: &quot;AF&quot;
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 88,
          }}
        >
          {TARGET.split("").map((_, i) => (
            <span
              key={i}
              style={{
                color:
                  frame >= REVEAL_START + i * REVEAL_STAGGER + REVEAL_SPAN
                    ? "#d4af37"
                    : "#4ea1ff",
              }}
            >
              {decodedChar(i, frame)}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 220,
          top: "40%",
          translate: "0% -50%",
          textAlign: "center",
          opacity: interpolate(frame, [80, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={140} height={160} viewBox="0 0 140 160">
          <circle cx="70" cy="55" r="42" fill="#16283d" stroke="#4ea1ff" strokeWidth={3} />
          <path
            d="M15 158 Q70 90 125 158 Z"
            fill="#16283d"
            stroke="#4ea1ff"
            strokeWidth={3}
          />
        </svg>
        <div
          style={{
            marginTop: 12,
            color: "#f3f1e7",
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          Joseph Rochefort
        </div>
        <div
          style={{
            color: "#7d90a8",
            fontFamily: bodyFont,
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          Chỉ huy Station HYPO
        </div>
      </div>

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
          name="Codebreaking caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [380, 420, durationInFrames - 50, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Rochefort và đội giải mã xác nhận &quot;AF&quot; chính là Midway —
          bằng một tin giả về sự cố thiếu nước ngọt. Nhật Bản mắc bẫy.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
