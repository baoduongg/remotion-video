import {
  AbsoluteFill,
  Interactive,
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
import { PacificMap, usePacificProjection } from "../vox/PacificMap";
import { DrawOnPath } from "../vox/DrawOnPath";
import { ShipIcon } from "../icons";

// Approximate positions for the morning of June 4, 1942 — illustrative, not
// navigational. Kido Butai northwest of Midway, US TF16/17 at "Point Luck"
// northeast of Midway. Midway itself: 28.2072, -177.3735.
const MAP_CENTER: [number, number] = [-176, 31];
const MAP_SCALE = 6200;

const US_SHIPS = [
  { lat: 32.3, lon: -173.4, label: "Yorktown" },
  { lat: 32.0, lon: -172.9, label: "Enterprise" },
  { lat: 31.7, lon: -173.3, label: "Hornet" },
];

const JAPAN_SHIPS = [
  { lat: 31.3, lon: -179.6, label: "Akagi" },
  { lat: 31.1, lon: -179.1, label: "Kaga" },
  { lat: 30.7, lon: -179.5, label: "Soryu" },
  { lat: 30.5, lon: -179.0, label: "Hiryu" },
];

// Ship positions moved from fixed pixels to real map coordinates (see
// US_SHIPS/JAPAN_SHIPS above); Hornet now projects to roughly (1427, 378)
// and the Japanese carrier cluster to roughly (335-440, 470-660) — the
// opposite left/right arrangement from the old hard-coded layout, since
// Kido Butai's real longitude sits west of TF16/17's. Plane launch/end X
// and the per-plane y band below are retuned to match: planes now launch
// near Hornet (right) and fly left into the Japanese formation.
const PLANES = [
  { launch: 150, destroy: 260, y: 460, survivor: false },
  { launch: 185, destroy: 300, y: 420, survivor: false },
  { launch: 220, destroy: 340, y: 480, survivor: false },
  { launch: 255, destroy: 380, y: 430, survivor: false },
  { launch: 290, destroy: 400, y: 470, survivor: true },
] as const;

const PLANE_X_START = 1400;
const PLANE_X_END = 300;
const PLANE_TRAVEL = 150;

export const Scene4FirstStrike: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const project = usePacificProjection(MAP_CENTER, MAP_SCALE);

  const transformBg = shotTransform(frame, [
    { from: 0, to: durationInFrames, scale: [1.02, 1.1], x: [-1, 1] },
  ]);

  const usPoints = US_SHIPS.map((ship) => project(ship.lat, ship.lon) ?? [0, 0]);
  const japanPoints = JAPAN_SHIPS.map((ship) => project(ship.lat, ship.lon) ?? [0, 0]);

  return (
    <AbsoluteFill
      name="Scene 4 - First Strike"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_04.mp3")} from={20} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: transformBg,
          transformOrigin: "center",
        }}
      >
        <PacificMap center={MAP_CENTER} scale={MAP_SCALE} landColor="#1c2f45" strokeColor="#3a5470" />
      </div>

      <SectionTitle name="Section title">4 tháng 6, 1942 — Đợt tấn công đầu tiên</SectionTitle>

      {/* US Ships */}
      {US_SHIPS.map((ship, i) => {
        const [x, y] = usPoints[i];
        return (
          <div
            key={ship.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              opacity: interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ShipIcon color="#4ea1ff" width={90} />
            <div
              style={{
                marginTop: 6,
                color: "#c7d2e0",
                fontFamily: bodyFont,
                fontSize: 22,
                textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              {ship.label}
            </div>
          </div>
        );
      })}

      {/* Japan Ships */}
      {JAPAN_SHIPS.map((ship, i) => {
        const [x, y] = japanPoints[i];
        return (
          <div
            key={ship.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              opacity: interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ShipIcon color="#e0483e" width={90} />
            <div
              style={{
                marginTop: 6,
                color: "#e6b3ae",
                fontFamily: bodyFont,
                fontSize: 22,
                textAlign: "right",
                textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              {ship.label}
            </div>
          </div>
        );
      })}

      {/* Attack vector: Torpedo Squadron 8's run from Hornet toward the Japanese formation */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <DrawOnPath
          d={`M${usPoints[2][0]},${usPoints[2][1]} L${japanPoints[1][0]},${japanPoints[1][1]}`}
          from={140}
          to={290}
          stroke="#ffd700"
          strokeWidth={2}
        />
      </svg>

      {/* Anti-aircraft tracer fire (Lưới lửa phòng không Nhật Bản từ biên phải sang biên trái) */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.7 }}
      >
        {Array.from({ length: 14 }).map((_, i) => {
          // Tracers shoot during the air attack (frames 100 to 450)
          const startFrame = 90 + i * 25;
          const duration = 20;
          if (frame < startFrame || frame > startFrame + duration) return null;

          const age = frame - startFrame;
          const tProgress = age / duration;

          // Japanese carriers coordinates on the right side
          const shooterY = 250 + (i % 4) * 150;
          const startX = width - 380;
          const startY = shooterY + 50;

          // Shoots towards the left (where the planes are flying)
          const lineLength = 220;
          const angle = Math.PI - 0.2 + (i % 3) * 0.1 - (i % 2) * 0.15; // angle pointing left-ish

          const curDist = tProgress * 1100;
          const endX = startX + Math.cos(angle) * curDist;
          const endY = startY + Math.sin(angle) * curDist;

          const startTracerX = endX - Math.cos(angle) * lineLength;
          const startTracerY = endY - Math.sin(angle) * lineLength;

          return (
            <line
              key={i}
              x1={startTracerX}
              y1={startTracerY}
              x2={endX}
              y2={endY}
              stroke={i % 2 === 0 ? "#00ffcc" : "#ffd700"} // green and yellow tracers
              strokeWidth={3}
              opacity={interpolate(tProgress, [0.7, 1.0], [0.95, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          );
        })}
      </svg>

      {/* Moving Planes */}
      {PLANES.map((plane, i) => {
        const isDestroyable = (plane.destroy as number | null) !== null;
        const endFrame = isDestroyable
          ? (plane.destroy as number)
          : plane.launch + PLANE_TRAVEL + 60;
        const inFlight = frame >= plane.launch && frame < endFrame + 30;
        if (!inFlight) return null;

        const progress = Math.min(
          1,
          Math.max(0, (frame - plane.launch) / PLANE_TRAVEL),
        );
        const x = PLANE_X_START + (PLANE_X_END - PLANE_X_START) * progress;

        // Let them dive slightly as they fly to make it more dynamic!
        const y = plane.y + progress * 40 - (plane.survivor && frame > plane.launch + PLANE_TRAVEL ? (frame - (plane.launch + PLANE_TRAVEL)) * 2 : 0);

        const destroyed = isDestroyable && frame >= (plane.destroy as number);
        const burstAge = destroyed ? frame - (plane.destroy as number) : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
            }}
          >
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
                  transform: `rotate(${plane.survivor && frame > plane.launch + PLANE_TRAVEL ? -15 : 5}deg)`,
                }}
              >
                <Img
                  src={staticFile("images/devastator_plane.png")}
                  style={{
                    width: 130,
                    height: 130,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.65))",
                  }}
                />
              </div>
            )}

            {/* Dynamic explosion and falling smoke trail */}
            {destroyed && burstAge < 30 && (
              <>
                {/* Explosion flash */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    translate: "-50% -50%",
                    width: 90,
                    height: 90,
                    borderRadius: 999,
                    backgroundColor: "#ffb347",
                    boxShadow: "0 0 35px 10px #ff4500, 0 0 70px 20px #e0483e",
                    scale: interpolate(burstAge, [0, 20], [0.3, 1.8], { extrapolateRight: "clamp" }),
                    opacity: interpolate(burstAge, [0, 20], [1, 0], { extrapolateRight: "clamp" }),
                  }}
                />

                {/* Spiral falling smoke */}
                <div
                  style={{
                    position: "absolute",
                    left: interpolate(burstAge, [0, 30], [0, 60], { extrapolateRight: "clamp" }),
                    top: interpolate(burstAge, [0, 30], [0, 110], { extrapolateRight: "clamp" }),
                    translate: "-50% -50%",
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: "#1c1c1c",
                    boxShadow: "0 0 15px #111",
                    opacity: interpolate(burstAge, [0, 30], [0.8, 0], { extrapolateRight: "clamp" }),
                    scale: interpolate(burstAge, [0, 30], [0.8, 3.0], { extrapolateRight: "clamp" }),
                  }}
                />
              </>
            )}
          </div>
        );
      })}

      {/* Stat Callout */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 210,
          translate: "-50% 0%",
          textAlign: "center",
          backgroundColor: "rgba(5,9,15,0.65)",
          padding: "16px 36px",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: interpolate(
            frame,
            [520, 560, durationInFrames - 60, durationInFrames - 20],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <Interactive.Div
          name="Stat callout"
          style={{
            color: "#d4af37",
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: 2,
          }}
        >
          15 máy bay ngư lôi &mdash; chỉ 1 người sống sót
        </Interactive.Div>
      </div>

      <Caption name="First strike caption" from={40}>
        Phi đội Ngư lôi 8 từ tàu Hornet lao vào tấn công không có tiêm kích hộ tống. Toàn bộ 15 máy bay bị bắn hạ — chỉ Ensign George Gay sống sót.
      </Caption>
    </AbsoluteFill>
  );
};
