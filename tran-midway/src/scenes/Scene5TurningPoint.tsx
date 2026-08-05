import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";
import { bodyFont } from "../fonts";
import { shotTransform } from "../kenBurns";
import { Caption, SectionTitle } from "../TextOverlay";

const CARRIERS = [
  { x: 280, label: "Akagi", launch: 100, impact: 260 },
  { x: 840, label: "Kaga", launch: 150, impact: 320 },
  { x: 1400, label: "Soryu", launch: 200, impact: 380 },
];

const CARRIER_Y = 300;
const BOMBER_START_Y = 40;

export const Scene5TurningPoint: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const transformBg = shotTransform(frame, [
    { from: 0, to: durationInFrames, scale: [1.12, 1.25], y: [-2, 2] },
  ]);

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
      <Img
        src={staticFile("images/scene_5_turning_point.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: transformBg,
          opacity: 0.55,
        }}
      />

      <SectionTitle name="Section title">Vài phút định mệnh</SectionTitle>

      {/* Carriers */}
      {CARRIERS.map((c) => {
        const hit = frame >= c.impact;
        const burnAge = hit ? frame - c.impact : 0;

        // Shake effect: decays over 25 frames after impact
        let shakeX = 0;
        let shakeY = 0;
        if (hit && burnAge < 25) {
          const amp = interpolate(burnAge, [0, 25], [18, 0], {
            extrapolateRight: "clamp",
          });
          shakeX = Math.sin(burnAge * 1.8) * amp;
          shakeY = Math.cos(burnAge * 2.1) * amp;
        }

        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: c.x - 70,
              top: CARRIER_Y,
              transform: `translate(${shakeX}px, ${shakeY}px)`,
            }}
          >
            {/* Top-down deck sprite */}
            <Img
              src={staticFile("images/carrier_deck_topdown.png")}
              style={{
                width: 480,
                height: 306,
                objectFit: "contain",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.7))",
                opacity: interpolate(frame, [0, 30], [0, 0.95], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />

            {/* Aircraft dots on deck, disappear once hit */}
            {/* {!hit &&
              [0, 1, 2, 3, 4].map((d) => (
                <div
                  key={d}
                  style={{
                    position: "absolute",
                    left: 56 + d * 60,
                    top: 44,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    backgroundColor: "#e0483e",
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    opacity: interpolate(frame, [10, 30], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
              ))} */}

            <div
              style={{
                marginTop: 12,
                textAlign: "center",
                color: "#e6b3ae",
                fontFamily: bodyFont,
                fontSize: 26,
                fontWeight: 700,
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                width: 480,
              }}
            >
              {c.label}
            </div>

            {/* Upgraded Explosion and Smoke Effect */}
            {hit && (
              <>
                {/* 1. Shockwave ring */}
                <div
                  style={{
                    position: "absolute",
                    left: 240, // center of 480 width
                    top: 153, // center of 306 height
                    translate: "-50% -50%",
                    borderRadius: 999,
                    border: "5px solid #ffb347",
                    boxShadow: "0 0 30px #e0483e",
                    width: interpolate(burnAge, [0, 20], [20, 360], { extrapolateRight: "clamp" }),
                    height: interpolate(burnAge, [0, 20], [8, 120], { extrapolateRight: "clamp" }),
                    opacity: interpolate(burnAge, [0, 20], [1, 0], { extrapolateRight: "clamp" }),
                  }}
                />

                {/* 2. White Core Flash */}
                <div
                  style={{
                    position: "absolute",
                    left: 240,
                    top: 153,
                    translate: "-50% -50%",
                    width: 90,
                    height: 90,
                    borderRadius: 999,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 50px 15px #ffffff, 0 0 90px 25px #ffb347",
                    scale: interpolate(burnAge, [0, 10], [0.3, 1.8], { extrapolateRight: "clamp" }),
                    opacity: interpolate(burnAge, [0, 10], [1, 0], { extrapolateRight: "clamp" }),
                  }}
                />

                {/* 3. Yellow Fireball */}
                <div
                  style={{
                    position: "absolute",
                    left: 240,
                    top: 153,
                    translate: "-50% -50%",
                    width: 170,
                    height: 170,
                    borderRadius: 999,
                    backgroundColor: "#ffd700",
                    boxShadow: "0 0 60px 20px #ffb347, 0 0 120px 35px #e0483e",
                    scale: interpolate(burnAge, [0, 25], [0.2, 1.6], { extrapolateRight: "clamp" }),
                    opacity: interpolate(burnAge, [0, 25], [1, 0], { extrapolateRight: "clamp" }),
                  }}
                />

                {/* 4. Red Outer Shell */}
                <div
                  style={{
                    position: "absolute",
                    left: 240,
                    top: 153,
                    translate: "-50% -50%",
                    width: 250,
                    height: 250,
                    borderRadius: 999,
                    backgroundColor: "#e0483e",
                    boxShadow: "0 0 70px 25px #e0483e, 0 0 140px 45px rgba(224,72,62,0.35)",
                    scale: interpolate(burnAge, [0, 40], [0.1, 1.4], { extrapolateRight: "clamp" }),
                    opacity: interpolate(burnAge, [0, 40], [0.95, 0], { extrapolateRight: "clamp" }),
                  }}
                />

                {/* 5. Flying Sparks/Shrapnel */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * Math.PI * 2) / 12;
                  const maxDist = 200 + (i % 3) * 50;
                  const dist = interpolate(burnAge, [0, 30], [0, maxDist], {
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.quad),
                  });
                  const px = 240 + Math.cos(angle) * dist;
                  const py = 103 + Math.sin(angle) * dist * 0.45;

                  const particleScale = interpolate(burnAge, [0, 30], [1.6, 0], {
                    extrapolateRight: "clamp",
                  });
                  const particleOpacity = interpolate(burnAge, [0, 30], [1, 0], {
                    extrapolateRight: "clamp",
                  });

                  return (
                    <div
                      key={`spark-${i}`}
                      style={{
                        position: "absolute",
                        left: px,
                        top: py,
                        translate: "-50% -50%",
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        backgroundColor: i % 2 === 0 ? "#ffd700" : "#ff4500",
                        boxShadow: "0 0 12px #ff4500",
                        scale: particleScale,
                        opacity: particleOpacity,
                      }}
                    />
                  );
                })}

                {/* 6. Billowing Smoke */}
                {[0, 1, 2, 3, 4].map((s) => {
                  const localAge = (burnAge + s * 16) % 80;
                  const riseDist = interpolate(localAge, [0, 80], [0, 190], {
                    extrapolateRight: "clamp",
                  });
                  const drift = Math.sin(s * 1.7) * 50;
                  const smokeScale = interpolate(localAge, [0, 80], [0.6, 2.8], {
                    extrapolateRight: "clamp",
                  });
                  const smokeOpacity = interpolate(localAge, [0, 80], [0.75, 0], {
                    extrapolateRight: "clamp",
                  });

                  return (
                    <div
                      key={`smoke-${s}`}
                      style={{
                        position: "absolute",
                        left: 240 + drift,
                        top: 100 - riseDist,
                        translate: "-50% -50%",
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        backgroundColor: "#1f1f1f",
                        boxShadow: "0 0 20px #151515",
                        opacity: smokeOpacity,
                        scale: smokeScale,
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
        );
      })}

      {/* Dive Bombers falling down */}
      {CARRIERS.map((c, i) => {
        if (frame < c.launch || frame > c.impact + 5) return null;
        const progress = Math.min(
          1,
          Math.max(0, (frame - c.launch) / (c.impact - c.launch)),
        );
        const y = BOMBER_START_Y + (CARRIER_Y - BOMBER_START_Y) * progress;
        return (
          <div key={i} style={{ position: "absolute", left: c.x + 100, top: y }}>
            <Img
              src={staticFile("images/dauntless_bomber.png")}
              style={{
                width: 150,
                height: 150,
                objectFit: "contain",
                transform: "rotate(180deg)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
              }}
            />
          </div>
        );
      })}

      {/* Screen flash on hit */}
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
            pointerEvents: "none",
          }}
        />
      ))}

      <Caption name="Turning point caption" from={430}>
        Đúng lúc ba tàu sân bay Nhật dồn máy bay lên boong để tiếp nhiên liệu, oanh tạc cơ bổ nhào Mỹ bất ngờ xuất hiện từ trên cao.
      </Caption>
    </AbsoluteFill>
  );
};
