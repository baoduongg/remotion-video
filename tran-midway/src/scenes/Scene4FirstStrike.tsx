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
import { ShipIcon, PlaneIcon } from "../icons";

const US_SHIPS = [
  { y: 300, label: "Yorktown" },
  { y: 470, label: "Enterprise" },
  { y: 640, label: "Hornet" },
];

const JAPAN_SHIPS = [
  { y: 250, label: "Akagi" },
  { y: 400, label: "Kaga" },
  { y: 550, label: "Soryu" },
  { y: 700, label: "Hiryu" },
];

const PLANES = [
  { launch: 150, destroy: 260, y: 640, survivor: false },
  { launch: 185, destroy: 300, y: 600, survivor: false },
  { launch: 220, destroy: 340, y: 660, survivor: false },
  { launch: 255, destroy: 380, y: 610, survivor: false },
  { launch: 290, destroy: null, y: 650, survivor: true },
] as const;

const PLANE_X_START = 300;
const PLANE_X_END = 1350;
const PLANE_TRAVEL = 150;

export const Scene4FirstStrike: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Scene 4 - First Strike"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_04.mp3")} from={20} />
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
          4 tháng 6, 1942 — Đợt tấn công đầu tiên
        </Interactive.Div>
      </div>

      {US_SHIPS.map((ship, i) => (
        <div
          key={ship.label}
          style={{
            position: "absolute",
            left: 140,
            top: ship.y,
            opacity: interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <ShipIcon color="#4ea1ff" width={130} />
          <div
            style={{
              marginTop: 6,
              color: "#c7d2e0",
              fontFamily: bodyFont,
              fontSize: 22,
            }}
          >
            {ship.label}
          </div>
        </div>
      ))}

      {JAPAN_SHIPS.map((ship, i) => (
        <div
          key={ship.label}
          style={{
            position: "absolute",
            left: width - 280,
            top: ship.y,
            opacity: interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ scale: "-1 1" }}>
            <ShipIcon color="#e0483e" width={130} />
          </div>
          <div
            style={{
              marginTop: 6,
              color: "#e6b3ae",
              fontFamily: bodyFont,
              fontSize: 22,
              textAlign: "right",
            }}
          >
            {ship.label}
          </div>
        </div>
      ))}

      {PLANES.map((plane, i) => {
        const endFrame = plane.survivor
          ? plane.launch + PLANE_TRAVEL + 60
          : (plane.destroy as number);
        const inFlight = frame >= plane.launch && frame < endFrame + 20;
        if (!inFlight) return null;

        const progress = Math.min(
          1,
          Math.max(0, (frame - plane.launch) / PLANE_TRAVEL),
        );
        const x = PLANE_X_START + (PLANE_X_END - PLANE_X_START) * progress;
        const y = plane.survivor
          ? plane.y - Math.max(0, frame - (plane.launch + PLANE_TRAVEL)) * 1.5
          : plane.y;

        const destroyed = !plane.survivor && frame >= (plane.destroy as number);
        const burstAge = destroyed ? frame - (plane.destroy as number) : 0;

        return (
          <div key={i} style={{ position: "absolute", left: x, top: y }}>
            {!destroyed && (
              <div
                style={{
                  opacity: plane.survivor
                    ? interpolate(
                        frame,
                        [
                          plane.launch + PLANE_TRAVEL + 30,
                          plane.launch + PLANE_TRAVEL + 60,
                        ],
                        [1, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                      )
                    : 1,
                }}
              >
                <PlaneIcon color="#4ea1ff" size={26} rotationDeg={90} />
              </div>
            )}
            {destroyed && burstAge < 20 && (
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  top: -20,
                  width: 60,
                  height: 60,
                  borderRadius: 999,
                  backgroundColor: "#e0483e",
                  opacity: interpolate(burstAge, [0, 20], [0.9, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  scale: interpolate(burstAge, [0, 20], [0.3, 1.6], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    output: "perceptual-scale",
                  }),
                }}
              />
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 210,
          translate: "-50% 0%",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Stat callout"
          style={{
            color: "#d4af37",
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 56,
            opacity: interpolate(
              frame,
              [520, 560, durationInFrames - 60, durationInFrames - 20],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          15 máy bay ngư lôi &mdash; chỉ 1 người sống sót
        </Interactive.Div>
      </div>

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
          name="First strike caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [40, 80, durationInFrames - 30, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Phi đội Ngư lôi 8 từ tàu Hornet lao vào tấn công không có tiêm kích
          hộ tống. Toàn bộ 15 máy bay bị bắn hạ — chỉ Ensign George Gay sống
          sót.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
