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
import { ShipIcon, SubmarineIcon } from "../icons";

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

  return (
    <AbsoluteFill
      name="Scene 6 - Yorktown"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_06.mp3")} from={20} />
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
          Cái giá của chiến thắng
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 420,
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
          <ShipIcon color="#4ea1ff" width={220} />
          <div
            style={{
              marginTop: 10,
              textAlign: "center",
              color: "#c7d2e0",
              fontFamily: bodyFont,
              fontSize: 26,
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
          top: 560,
          opacity: interpolate(frame, [SUB_ARRIVE, SUB_ARRIVE + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <SubmarineIcon color="#7d3fb0" width={100} />
        <div
          style={{
            marginTop: 6,
            textAlign: "center",
            color: "#c9a8e0",
            fontFamily: bodyFont,
            fontSize: 20,
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
          name="Yorktown caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [140, 180, durationInFrames - 40, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Hiryu, tàu sân bay Nhật duy nhất còn lại, khiến Yorktown hư hại nặng
          — trước khi tàu ngầm I-168 đánh chìm nó ba ngày sau.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
