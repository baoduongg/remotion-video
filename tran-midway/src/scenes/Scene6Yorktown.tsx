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

const IMPACT_FRAME = 100;
const SUB_ARRIVE = 340;
const SUB_TRAVEL = 103;
const TORPEDO_HIT = 480;
const SINK_START = 495;
const SINK_END = 590;

export const Scene6Yorktown: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const sinkProgress = interpolate(frame, [SINK_START, SINK_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const transform = shotTransform(frame, [
    { from: 0, to: 300, scale: [1.05, 1.18], y: [-2, 0] },
    { from: 300, to: durationInFrames, scale: [1.22, 1.35], x: [-2, 2], y: [0, 3] },
  ]);

  return (
    <AbsoluteFill
      name="Scene 6 - Yorktown"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_06.mp3")} from={20} />
      <Img
        src={staticFile("images/scene_6_yorktown.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform,
          opacity: 0.65,
        }}
      />
      <Audio
        src={staticFile("audio/sfx/boom.mp3")}
        from={IMPACT_FRAME}
        volume={0.5}
      />
      <Audio
        src={staticFile("audio/sfx/boom.mp3")}
        from={TORPEDO_HIT}
        volume={0.6}
      />
      <SectionTitle name="Section title">Cái giá của chiến thắng</SectionTitle>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 380,
          translate: "-50% -50%",
        }}
      >
        <div
          style={{
            rotate: `${sinkProgress * 20}deg`,
            translate: `0px ${sinkProgress * 140}px`,
            opacity:
              interpolate(frame, [0, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) *
              (1 - sinkProgress),
          }}
        >
          <Img
            src={staticFile("images/us_carrier.png")}
            style={{
              width: 800,
              height: 300,
              objectFit: "contain",
              filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.75))",
            }}
          />
          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              color: "#c7d2e0",
              fontFamily: bodyFont,
              fontSize: 34,
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            USS Yorktown
          </div>
        </div>
      </div>

      {frame >= IMPACT_FRAME &&
        [0, 1, 2, 3].map((s) => {
          const age = (frame - IMPACT_FRAME + s * 40) % 160;
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: 900 + s * 30,
                top: 380 - age,
                width: 40 - s * 4,
                height: 40 - s * 4,
                borderRadius: 999,
                backgroundColor: "#5a5a5a",
                opacity: interpolate(age, [0, 160], [0.5, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          );
        })}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: interpolate(
            frame,
            [IMPACT_FRAME - 2, IMPACT_FRAME, IMPACT_FRAME + 6],
            [0, 0.3, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      />

      <div
        style={{
          position: "absolute",
          left: interpolate(frame, [SUB_ARRIVE, SUB_ARRIVE + SUB_TRAVEL], [1600, 1150], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          top: 540,
          opacity: interpolate(frame, [SUB_ARRIVE, SUB_ARRIVE + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Img
          src={staticFile("images/submarine_sprite.png")}
          style={{
            width: 280,
            height: 96,
            objectFit: "contain",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.65))",
          }}
        />
        <div
          style={{
            marginTop: 8,
            textAlign: "center",
            color: "#c9a8e0",
            fontFamily: bodyFont,
            fontSize: 24,
            fontWeight: 700,
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          I-168
        </div>
      </div>

      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <line
          x1={1150}
          y1={575}
          x2={interpolate(
            frame,
            [SUB_ARRIVE + SUB_TRAVEL, TORPEDO_HIT],
            [1150, 1030],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}
          y2={470}
          stroke="#c9a8e0"
          strokeWidth={3}
          opacity={interpolate(
            frame,
            [SUB_ARRIVE + SUB_TRAVEL, SUB_ARRIVE + SUB_TRAVEL + 7, TORPEDO_HIT],
            [0, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}
        />
      </svg>

      <Caption name="Yorktown caption" from={140}>
        Hiryu, tàu sân bay Nhật duy nhất còn lại, khiến Yorktown hư hại nặng —
        trước khi tàu ngầm I-168 đánh chìm nó ba ngày sau.
      </Caption>
    </AbsoluteFill>
  );
};
