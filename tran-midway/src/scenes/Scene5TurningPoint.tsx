import {
  AbsoluteFill,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { bodyFont } from "../fonts";
import { PlaneIcon } from "../icons";

const CARRIERS = [
  { x: 480, label: "Akagi", launch: 100, impact: 260 },
  { x: 960, label: "Kaga", launch: 150, impact: 320 },
  { x: 1440, label: "Soryu", launch: 200, impact: 380 },
];

const CARRIER_Y = 300;
const BOMBER_START_Y = 40;

export const Scene5TurningPoint: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Scene 5 - Turning Point"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_05.mp3")} from={20} />
      {CARRIERS.map((c) => (
        <Audio
          key={`boom-${c.label}`}
          src={staticFile("audio/sfx/boom.mp3")}
          from={c.impact}
          volume={0.5}
        />
      ))}
      <div style={{ position: "absolute", left: 160, top: 90 }}>
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
          Vài phút định mệnh
        </Interactive.Div>
      </div>

      {CARRIERS.map((c) => {
        const hit = frame >= c.impact;
        const burnAge = hit ? frame - c.impact : 0;

        return (
          <div key={c.label} style={{ position: "absolute", left: c.x, top: CARRIER_Y }}>
            {/* top-down hull */}
            <div
              style={{
                width: 220,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#e0483e",
                opacity: interpolate(frame, [0, 30], [0, 0.92], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
            {/* aircraft dots on deck, disappear once hit */}
            {!hit &&
              [0, 1, 2, 3, 4].map((d) => (
                <div
                  key={d}
                  style={{
                    position: "absolute",
                    left: 20 + d * 38,
                    top: 22,
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    backgroundColor: "#070d16",
                    opacity: interpolate(frame, [10, 30], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
              ))}
            <div
              style={{
                marginTop: 8,
                textAlign: "center",
                color: "#e6b3ae",
                fontFamily: bodyFont,
                fontSize: 24,
              }}
            >
              {c.label}
            </div>

            {hit && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 80,
                    top: -10,
                    width: 90,
                    height: 90,
                    borderRadius: 999,
                    backgroundColor: "#ffb347",
                    opacity: interpolate(burnAge, [0, 25], [0.95, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    scale: interpolate(burnAge, [0, 25], [0.2, 1.8], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      output: "perceptual-scale",
                    }),
                  }}
                />
                {[0, 1, 2].map((s) => (
                  <div
                    key={s}
                    style={{
                      position: "absolute",
                      left: 90 + s * 20,
                      top: 20 - ((burnAge + s * 15) % 90),
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      backgroundColor: "#3a3a3a",
                      opacity: 0.4,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}

      {CARRIERS.map((c, i) => {
        if (frame < c.launch || frame > c.impact + 5) return null;
        const progress = Math.min(
          1,
          Math.max(0, (frame - c.launch) / (c.impact - c.launch)),
        );
        const y = BOMBER_START_Y + (CARRIER_Y - BOMBER_START_Y) * progress;
        return (
          <div key={i} style={{ position: "absolute", left: c.x + 100, top: y }}>
            <PlaneIcon color="#4ea1ff" size={24} rotationDeg={180} />
          </div>
        );
      })}

      {CARRIERS.map((c) => (
        <div
          key={`flash-${c.label}`}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ffffff",
            opacity: interpolate(
              frame,
              [c.impact - 2, c.impact, c.impact + 6],
              [0, 0.35, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: 100,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Turning point caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [430, 470, durationInFrames - 30, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Đúng lúc ba tàu sân bay Nhật dồn máy bay lên boong để tiếp nhiên
          liệu, oanh tạc cơ bổ nhào Mỹ bất ngờ xuất hiện từ trên cao.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
