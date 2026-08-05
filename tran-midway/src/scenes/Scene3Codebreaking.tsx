import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";
import { shotTransform } from "../kenBurns";
import { Caption, SectionTitle } from "../TextOverlay";

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

  const transformBg = shotTransform(frame, [
    { from: 0, to: durationInFrames, scale: [1.02, 1.15], y: [-2, 2] },
  ]);

  return (
    <AbsoluteFill
      name="Scene 3 - Codebreaking"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_03.mp3")} from={30} />
      <Img
        src={staticFile("images/scene_3_codebreaking.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: transformBg,
          opacity: 0.65,
        }}
        freeze={523}
      />
      <SectionTitle name="Section title">Vũ khí bí mật</SectionTitle>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: "45%",
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
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
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
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
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
          top: "45%",
          translate: "0% -50%",
          textAlign: "center",
          opacity: interpolate(frame, [80, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 290,
            height: 290,
            borderRadius: 999,
            border: "4px solid #d4af37",
            boxShadow: "0 0 35px 10px rgba(212,175,55,0.4)",
            overflow: "hidden",
            margin: "0 auto 18px auto",
            backgroundColor: "#070d16",
          }}
        >
          <Img
            src={staticFile("images/joseph_rochefort.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 50,
            color: "#f3f1e7",
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 32,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          Joseph Rochefort
        </div>
        <div
          style={{
            color: "#9db1c9",
            fontFamily: bodyFont,
            fontSize: 24,
            letterSpacing: 2,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            marginTop: 4,
          }}
        >
          Chỉ huy Station HYPO
        </div>
      </div>
      <Caption name="Codebreaking caption" from={380}>
        Rochefort và đội giải mã xác nhận &quot;AF&quot; chính là Midway — bằng
        một tin giả về sự cố thiếu nước ngọt. Nhật Bản mắc bẫy.
      </Caption>
    </AbsoluteFill>
  );
};
