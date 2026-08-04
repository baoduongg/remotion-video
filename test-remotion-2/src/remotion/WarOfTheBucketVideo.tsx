import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  interpolate,
} from "remotion";
import { Character } from "./Character";
import { JokeCaption } from "./JokeCaption";
import { SceneTransition } from "./SceneTransition";
import { MapScene } from "./MapScene";
import { TitleCard } from "./TitleCard";

// --- Vector Helper Components ---

export const Bucket: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ display: "inline-block", width: 95, height: 108, position: "relative", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 80 90">
        {/* Handle */}
        <path d="M 15 35 Q 40 5 65 35" fill="none" stroke="black" strokeWidth={5} />
        {/* Bucket body */}
        <path
          d="M 15 35 L 22 80 A 5 5 0 0 0 27 84 L 53 84 A 5 5 0 0 0 58 80 L 65 35 Z"
          fill="#b5838d"
          stroke="black"
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {/* Iron bands */}
        <rect x={16.5} y={48} width={47} height={6} fill="#6c757d" stroke="black" strokeWidth={3.5} />
        <rect x={19.5} y={70} width={41} height={6} fill="#6c757d" stroke="black" strokeWidth={3.5} />
        {/* Bucket top opening ellipse */}
        <ellipse cx={40} cy={35} rx={25} ry={6} fill="#6d597a" stroke="black" strokeWidth={5} />
      </svg>
    </div>
  );
};

export const Well: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ display: "inline-block", width: 162, height: 162, position: "relative", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 120 120">
        {/* Well base stone */}
        <rect x={20} y={60} width={80} height={50} rx={8} fill="#8d99ae" stroke="black" strokeWidth={4.5} />
        {/* Brick line details */}
        <path d="M 20 78 H 100 M 35 95 H 85" stroke="black" strokeWidth={2.5} />
        {/* Support poles */}
        <line x1={30} y1={60} x2={30} y2={15} stroke="black" strokeWidth={5} />
        <line x1={90} y1={60} x2={90} y2={15} stroke="black" strokeWidth={5} />
        {/* Pulley drum */}
        <rect x={40} y={23} width={40} height={8} fill="#8b5a2b" stroke="black" strokeWidth={3} />
        {/* Roof */}
        <polygon points="10,22 60,2 110,22" fill="#e63946" stroke="black" strokeWidth={4.5} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const BellTower: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div style={{ display: "inline-block", width: 216, height: 486, position: "relative", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 150 350" style={{ overflow: "visible" }}>
        {/* Main stone tower body */}
        <rect x={40} y={120} width={70} height={220} fill="#d3d3d3" stroke="black" strokeWidth={5} strokeLinejoin="round" />
        {/* Brick details */}
        <path d="M 50 150 H 60 M 80 180 H 95 M 55 220 H 70 M 85 260 H 100 M 60 300 H 75" stroke="black" strokeWidth={3} />
        {/* Top roof arch */}
        <polygon points="25,120 75,45 125,120" fill="#4a5759" stroke="black" strokeWidth={5} strokeLinejoin="round" />
        {/* Bell opening arch */}
        <path d="M 52 170 A 23 23 0 0 1 98 170 V 220 H 52 Z" fill="#2b2d42" stroke="black" strokeWidth={5} />
        {/* Hanging wooden beam */}
        <rect x={35} y={155} width={80} height={8} fill="#8b5a2b" stroke="black" strokeWidth={3.5} />
      </svg>
      {/* Hanging bucket with dynamic swing animation */}
      <Bucket
        style={{
          position: "absolute",
          top: 213,
          left: 54,
          transformOrigin: "47px 7px",
          animation: "swing 2.5s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes swing {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
};


const ClashStar: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: "inline-block", width: 297, height: 297, position: "relative", ...style }}>
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <polygon
        points="50,5 60,35 90,30 70,55 85,85 55,75 50,95 40,65 10,70 30,45 15,15 45,25"
        fill="#fcbf49"
        stroke="black"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <text
        x={50}
        y={57}
        fontSize={18}
        fontWeight="bold"
        fontFamily="Bangers"
        fill="#e63946"
        stroke="black"
        strokeWidth={1}
        textAnchor="middle"
        style={{ paintOrder: "stroke fill" }}
      >
        CLASH!
      </text>
    </svg>
  </div>
);

// Drifting cloud/mist filler for flat-color backgrounds so vertical framing doesn't
// show big empty color blocks above/below the action.
const SkyClouds: React.FC<{ tone?: "day" | "warm"; style?: React.CSSProperties }> = ({ tone = "day", style }) => {
  const frame = useCurrentFrame();
  const fill = tone === "warm" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.55)";
  const drift = (offset: number, speed: number) => (frame * speed + offset) % 140 - 20;

  const cloud = (cx: number, cy: number, s: number) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={30} ry={14} fill={fill} />
      <ellipse cx={-18} cy={4} rx={18} ry={11} fill={fill} />
      <ellipse cx={20} cy={4} rx={20} ry={12} fill={fill} />
    </g>
  );

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 178"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", ...style }}
    >
      {cloud(drift(0, 0.03), 14, 1)}
      {cloud(drift(60, 0.02), 6, 0.6)}
      {cloud(drift(-30, 0.025), 158, 0.8)}
      {cloud(drift(90, 0.018), 168, 0.5)}
    </svg>
  );
};

// Zoom+recenter wrapper for close-up punchline shots. Scales the whole scene up around
// a focal point for [from, from+duration), then eases back to the normal wide shot.
const CameraShot: React.FC<{
  from: number;
  duration: number;
  zoom?: number;
  focalX?: number; // percent
  focalY?: number; // percent
  children: React.ReactNode;
}> = ({ from, duration, zoom = 1.35, focalX = 50, focalY = 55, children }) => {
  const frame = useCurrentFrame();
  const ease = 15;
  const z = interpolate(
    frame,
    [from, from + ease, from + duration - ease, from + duration],
    [1, zoom, zoom, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        scale: String(z),
        transformOrigin: `${focalX}% ${focalY}%`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Map Scene Coordinates for Italy Focus
const italyTerritories = [
  {
    id: "gbr",
    name: "",
    color: "rgba(0,0,0,0)",
    path: "",
    labelX: 0,
    labelY: 0,
  },
  {
    id: "fra",
    name: "Bologna",
    color: "#e63946",
    strokeColor: "black",
    path: "M 670 470 A 15 15 0 1 1 700 470 A 15 15 0 1 1 670 470 Z", // Simplified dot
    labelX: 730,
    labelY: 485,
  },
  {
    id: "ger",
    name: "Modena",
    color: "#4ea8de",
    strokeColor: "black",
    path: "M 645 440 A 15 15 0 1 1 675 440 A 15 15 0 1 1 645 440 Z", // Simplified dot
    labelX: 630,
    labelY: 445,
  },
];

const scene1CameraSteps = [
  {
    startFrame: 0,
    duration: 30,
    zoom: 1.0,
    x: 500,
    y: 300,
  },
  {
    startFrame: 30,
    duration: 420,
    zoom: 2.1,
    x: 680,
    y: 450, // Zoom into Italy / Bologna / Modena
  },
];

const scene3CameraSteps = [
  {
    startFrame: 0,
    duration: 330,
    zoom: 2.1,
    x: 680,
    y: 450,
  },
];

const scene3Conquests = [
  {
    invaderId: "ger",
    targetId: "fra",
    centerX: 690,
    centerY: 465,
    startFrame: 120, // Arrow shoots relative frame 105 to 120
    duration: 40,
    arrow: {
      startX: 685, // Bologna
      startY: 470,
      endX: 660,   // Modena
      endY: 440,
    },
  },
];

// --- Audio Track: Edge-TTS narration + Remotion SFX, synced to the caption frames above ---
// Each entry starts at the same absolute frame as its matching caption/story-beat.
// durationInFrames is the measured clip length + a small buffer; audio Sequences are
// independent of the visual caption Sequences so a slightly-long line can finish
// speaking after its caption box has already changed (normal for dubbed narration).
const voiceoverTrack = [
  { from: 10, duration: 106, file: "vo_01.mp3" },
  { from: 150, duration: 147, file: "vo_02.mp3" },
  { from: 300, duration: 139, file: "vo_03.mp3" },
  { from: 460, duration: 132, file: "vo_04.mp3" },
  { from: 580, duration: 109, file: "vo_05.mp3" },
  { from: 720, duration: 77, file: "vo_06.mp3" },
  { from: 870, duration: 147, file: "vo_07.mp3" },
  { from: 1050, duration: 138, file: "vo_08.mp3" },
  { from: 1180, duration: 95, file: "vo_09.mp3" },
  { from: 1270, duration: 127, file: "vo_10.mp3" },
  { from: 1380, duration: 112, file: "vo_11.mp3" },
  { from: 1510, duration: 186, file: "vo_12.mp3" },
  { from: 1705, duration: 163, file: "vo_13.mp3" },
  { from: 1900, duration: 109, file: "vo_14.mp3" },
  { from: 2110, duration: 134, file: "vo_15.mp3" },
  { from: 2250, duration: 163, file: "vo_16.mp3" },
  { from: 2400, duration: 125, file: "vo_17.mp3" },
  { from: 2550, duration: 166, file: "vo_18.mp3" },
  { from: 2700, duration: 78, file: "vo_19.mp3" },
  { from: 2755, duration: 125, file: "vo_20.mp3" },
  { from: 2875, duration: 107, file: "vo_21.mp3" },
];

// Comedic SFX cues at key story beats (whoosh on scene wipes lives in SceneTransition.tsx itself)
const sfxTrack = [
  { from: 700, duration: 45, file: "skedaddle.wav", volume: 0.8 }, // bucket theft getaway
  { from: 1380, duration: 30, file: "triggered.wav", volume: 0.8 }, // angry leader outburst
  { from: 1700, duration: 70, file: "wilhelm-scream.wav", volume: 0.7 }, // battle clash
  { from: 2100, duration: 45, file: "record-scratch.wav", volume: 0.9 }, // "wait, that's not true" twist
  { from: 2750, duration: 30, file: "bruh.wav", volume: 0.8 }, // tourist's reaction
];

export const WarOfTheBucketVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  // Battle scene background image selection
  const bgBattle = isVertical
    ? staticFile("confrontation_bg_vertical.png")
    : staticFile("confrontation_bg_horizontal.png");

  return (
    <AbsoluteFill style={{ backgroundColor: "#eae2b7", fontFamily: "Fredoka, sans-serif" }}>

      {/* =======================================================
          HOOK: Cold-open teaser trước khi vào bối cảnh (0s - 3s | Frame 0 - 90)
          Ponytail: tái dùng TitleCard + SceneTransition có sẵn thay vì dựng UI riêng.
          Overlay đè lên Scene 1 (zIndex 50, thấp hơn 500 của SceneTransition) nên
          không cần dịch lại toàn bộ mốc frame phía sau.
          ======================================================= */}
      <Sequence durationInFrames={90} style={{ zIndex: 200 }}>
        <TitleCard
          title="Một Cái Thùng Gỗ..."
          subtitle="...khiến 32.000 người ra trận"
          styleType="classic-red"
        />
      </Sequence>

      <Sequence from={72} durationInFrames={18} style={{ zIndex: 210 }}>
        <SceneTransition />
      </Sequence>

      {/* =======================================================
          SCENE 1: INTRO & BỐI CẢNH (0s - 15s | Frame 0 - 450)
          ======================================================= */}
      <Sequence durationInFrames={450}>
        <MapScene
          territories={italyTerritories}
          conquests={[]}
          cameraSteps={scene1CameraSteps}
        />

        {/* Captions and Narrator speech */}
        {frame >= 10 && frame < 150 && (
          <JokeCaption
            text="Nước Ý, năm 1325."
            type="normal"
            position={{ bottom: 80 }}
          />
        )}

        {frame >= 150 && frame < 300 && (
          <JokeCaption
            text="Thời điểm mà con người sẵn sàng chiến đấu vì tôn giáo, vì lãnh thổ..."
            type="normal"
            position={{ bottom: 80 }}
          />
        )}

        {frame >= 300 && frame < 450 && (
          <JokeCaption
            text="...và theo truyền thuyết dân gian nổi tiếng nhất nước Ý, vì một cái thùng gỗ múc nước."
            type="joke"
            position={{ bottom: 80 }}
          />
        )}

        {/* Narrator stick figure pop-in */}
        {frame >= 60 && frame < 435 && (
          <Character
            role="general"
            style={{
              position: "absolute",
              bottom: isVertical ? 250 : 150,
              left: isVertical ? "5%" : "15%",
              scale: isVertical ? 0.75 : 0.9,
            }}
          />
        )}
      </Sequence>

      {/* Transition: 15s (Frame 450) */}
      <Sequence from={435} durationInFrames={30}>
        <SceneTransition />
      </Sequence>

      {/* =======================================================
          SCENE 2: MÂU THUẪN BAN ĐẦU — TRUYỀN THUYẾT (15s - 35s | Frame 450 - 1050)
          ======================================================= */}
      <Sequence from={450} durationInFrames={600}>
        <AbsoluteFill>
          <Img src={bgBattle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

          {/* The Giếng nước (Well) */}
          <Well style={{ position: "absolute", bottom: 150, left: "45%" }} />

          {/* Bucket sitting on the well, disappears when stolen at frame 700 */}
          {frame < 700 && (
            <Bucket style={{ position: "absolute", bottom: 205, left: "47%", scale: 0.55 }} />
          )}

          {/* Bologna Soldier (red) standing near the well */}
          <Character
            role="bologna"
            emotionMarker={
              frame >= 770 && frame < 850
                ? "exclamation"
                : frame >= 850
                ? "sweat"
                : "none"
            }
            isTalking={frame >= 720 && frame < 870}
            style={{
              position: "absolute",
              bottom: 120,
              left: "20%",
              scale: 0.9,
            }}
          />

          {/* Modena Soldier (blue) sneaking in, taking the bucket, and running */}
          {frame >= 490 && (
            <Character
              role="modena"
              isTalking={frame >= 870 && frame < 1035}
              style={{
                position: "absolute",
                bottom: 120,
                // Sneaking movement animation coordinates
                left: interpolate(
                  frame,
                  [490, 650, 700, 760],
                  [100, 52, 52, 100], // moves to well, pauses, runs back right
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ) + "%",
                scale: 0.9,
                transform: frame >= 700 ? "scaleX(-1)" : "none", // turns back to run
              }}
            />
          )}

          {/* Stolen bucket carried by Modena Soldier from frame 700 to 760 */}
          {frame >= 700 && frame < 760 && (
            <Bucket
              style={{
                position: "absolute",
                bottom: 160,
                left: interpolate(
                  frame,
                  [700, 760],
                  [58, 106],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ) + "%",
                scale: 0.45,
              }}
            />
          )}

          {/* Dialogues */}
          {frame >= 460 && frame < 580 && (
            <JokeCaption
              text="Chuyện kể rằng một vài tên lính Modena lén đột nhập vào Bologna..."
              type="normal"
              position={{ bottom: 80 }}
            />
          )}

          {frame >= 580 && frame < 720 && (
            <JokeCaption
              text="...và tóm lấy một cái thùng gỗ múc nước giếng mang về."
              type="normal"
              position={{ bottom: 80 }}
            />
          )}

          {frame >= 720 && frame < 870 && (
            <JokeCaption
              text="Cái thùng gỗ múc nước của chúng ta đâu rồi?!"
              type="shout"
              position={{ bottom: "60%", left: "15%", transform: "none" }}
            />
          )}

          {frame >= 870 && frame < 1035 && (
            <JokeCaption
              text="Nó là của tụi này rồi! Muốn lấy lại thì bước qua xác tụi này!"
              type="speech"
              tailSide="right"
              position={{ bottom: "62%", right: "8%", transform: "none" }}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Transition: 35s (Frame 1050) */}
      <Sequence from={1035} durationInFrames={30}>
        <SceneTransition />
      </Sequence>

      {/* =======================================================
          SCENE 3: LÊN CƠN GIẬN & TUYÊN CHIẾN (35s - 50s | Frame 1050 - 1500)
          ======================================================= */}
      <Sequence from={1050} durationInFrames={450}>
        {frame >= 1050 && frame < 1380 ? (
          <AbsoluteFill>
            <MapScene
              territories={italyTerritories}
              conquests={scene3Conquests}
              cameraSteps={scene3CameraSteps}
            />

            {frame >= 1050 && frame < 1180 && (
              <JokeCaption
                text="Và thế là Bologna lập tức tập hợp một quân đội 32.000 người..."
                type="normal"
                position={{ bottom: 80 }}
              />
            )}

            {frame >= 1180 && frame < 1270 && (
              <JokeCaption
                text="...hừng hực khí thế đi đòi lại đúng một cái thùng nước."
                type="joke"
                position={{ bottom: 80 }}
              />
            )}

            {frame >= 1270 && frame < 1380 && (
              <>
                {/* Bologna Soldier thắc mắc */}
                <Character
                  role="bologna"
                  emotionMarker="question"
                  isTalking
                  style={{
                    position: "absolute",
                    bottom: 120,
                    left: "35%",
                    scale: 1.1,
                  }}
                />
                <JokeCaption
                  text="Sếp ơi, mình đi đánh nhau vì cái thùng thiệt đó hả?"
                  type="thought"
                  position={{ bottom: "55%", left: "20%" }}
                />
              </>
            )}
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ backgroundColor: "#e63946" }}>
            <SkyClouds tone="warm" />
            {/* from is relative to this Scene's own Sequence (from=1050), so 1380 absolute -> 330 */}
            <CameraShot from={330} duration={120} zoom={2.6} focalX={57} focalY={76}>
              {/* Angry Bologna Leader */}
              <Character
                role="bologna"
                emotionMarker="anger"
                isTalking
                bounceHeight={15} // aggressive bounce
                bounceSpeed={12}  // rapid shaking
                style={{
                  position: "absolute",
                  bottom: 120,
                  left: "35%",
                  scale: 1.3,
                }}
              />
            </CameraShot>
            <JokeCaption
              text="Đó không chỉ là cái thùng! Đó là cái thùng CỦA CHÚNG TA! ĐÁNH BỎ MẸ NÓ ĐI!"
              type="shout"
              fontSize={44}
              position={{ top: "15%", left: "20%", right: "20%" }}
            />
          </AbsoluteFill>
        )}
      </Sequence>

      {/* Transition: 50s (Frame 1500) */}
      <Sequence from={1485} durationInFrames={30}>
        <SceneTransition />
      </Sequence>

      {/* =======================================================
          SCENE 4: TRẬN CHIẾN ZAPPOLINO (50s - 1h10 | Frame 1500 - 2100)
          ======================================================= */}
      <Sequence from={1500} durationInFrames={600}>
        <AbsoluteFill>
          <Img src={bgBattle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

          {/* Bologna Army (Left Side) - 3 characters clustered */}
          {frame < 1820 && (
            <div
              style={{
                position: "absolute",
                bottom: 100,
                left: interpolate(
                  frame,
                  [1500, 1680, 1720],
                  [-10, 20, 20],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ) + "%",
                display: "flex",
                gap: "-20px",
              }}
            >
              <Character role="bologna" scale={0.8} />
              <Character role="bologna" scale={0.9} style={{ marginLeft: -60 }} />
              <Character role="bologna" scale={0.8} style={{ marginLeft: -60 }} />
            </div>
          )}

          {/* Modena Army (Right Side) - 1 small lone character */}
          {frame < 1820 && (
            <Character
              role="modena"
              style={{
                position: "absolute",
                bottom: 100,
                left: interpolate(
                  frame,
                  [1500, 1680, 1720],
                  [100, 60, 60],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ) + "%",
                scale: 0.8,
              }}
            />
          )}

          {/* Battle Clash! (Frames 1700 - 1820) */}
          {frame >= 1700 && frame < 1820 && (
            <ClashStar style={{ position: "absolute", top: "25%", left: "40%" }} />
          )}

          {/* Post-battle: Bologna army retreats, Modena chases */}
          {frame >= 1820 && (
            <>
              {/* Bologna Retreats left */}
              <div
                style={{
                  position: "absolute",
                  bottom: 100,
                  left: interpolate(
                    frame,
                    [1820, 2000],
                    [20, -50],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ) + "%",
                  display: "flex",
                }}
              >
                <Character role="bologna" scale={0.8} emotionMarker="sweat" />
                <Character role="bologna" scale={0.8} style={{ marginLeft: -60 }} />
              </div>

              {/* Modena Pursues left */}
              <Character
                role="modena"
                style={{
                  position: "absolute",
                  bottom: 100,
                  left: interpolate(
                    frame,
                    [1820, 2020],
                    [60, -30],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ) + "%",
                  scale: 0.9,
                }}
              />
            </>
          )}

          {/* Captions */}
          {frame >= 1510 && frame < 1700 && (
            <JokeCaption
              text="Quân Bologna đông gấp 4 lần. Dễ ăn đúng không? Không hề!"
              type="normal"
              position={{ bottom: 80 }}
            />
          )}

          {frame >= 1700 && frame < 1900 && (
            <JokeCaption
              text="Tại Zappolino, quân Modena đã đánh tan nát quân Bologna chỉ trong vài giờ..."
              type="normal"
              position={{ bottom: 80 }}
            />
          )}

          {frame >= 1900 && frame < 2085 && (
            <JokeCaption
              text="...và chốt hạ bằng cách đuổi theo Bologna về tận cổng nhà."
              type="joke"
              position={{ bottom: 80 }}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Transition: 1h10 (Frame 2100) */}
      <Sequence from={2085} durationInFrames={30}>
        <SceneTransition />
      </Sequence>

      {/* =======================================================
          SCENE 5: SỰ THẬT LỊCH SỬ & CÚ TWIST (1h10 - 1h40 | Frame 2100 - 3000)
          ======================================================= */}
      <Sequence from={2100} durationInFrames={900}>
        {/* Sub-scene 5A: Record Scratch Twist Intro (Frames 2100 - 2250) */}
        {frame >= 2100 && frame < 2250 && (
          <AbsoluteFill>
            {/* Frozen grayscale battle background */}
            <AbsoluteFill style={{ filter: "grayscale(80%)" }}>
              <Img src={bgBattle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 100, left: "-10%", display: "flex" }}>
                <Character role="bologna" scale={0.8} />
                <Character role="bologna" scale={0.8} style={{ marginLeft: -60 }} />
              </div>
              <Character role="modena" style={{ position: "absolute", bottom: 100, left: "20%", scale: 0.9 }} />
            </AbsoluteFill>

            {/* Comic RECORD SCRATCH! splash */}
            {frame >= 2100 && frame < 2150 && (
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-5deg)",
                  fontFamily: "Bangers",
                  fontSize: 92,
                  color: "#e63946",
                  zIndex: 200,
                  textShadow: "4px 4px 0px black",
                  WebkitTextStroke: "2.5px black",
                }}
              >
                RECORD SCRATCH!
              </div>
            )}

            {/* Narrator pop-in, close-up camera punch for the twist reveal (from is relative to this Sequence's from=2100, so 2130 absolute -> 30) */}
            {frame >= 2130 && (
              <CameraShot from={30} duration={90} zoom={2.4} focalX={61} focalY={76}>
                <Character
                  role="general"
                  isTalking
                  style={{
                    position: "absolute",
                    bottom: 120,
                    left: "40%",
                    scale: 1.2,
                    zIndex: 150,
                  }}
                />
              </CameraShot>
            )}

            <JokeCaption
              text="Nhưng khoan — sự thật là cái thùng chưa từng bị trộm TRƯỚC trận chiến."
              type="normal"
              position={{ bottom: 80 }}
            />
          </AbsoluteFill>
        )}

        {/* Sub-scene 5B: Monteveglio Conquest on Map (Frames 2250 - 2550) */}
        {frame >= 2250 && frame < 2550 && (
          <AbsoluteFill>
            <MapScene
              territories={italyTerritories}
              conquests={[]}
              cameraSteps={[
                {
                  startFrame: 2250,
                  duration: 300,
                  zoom: 2.8,
                  x: 672,
                  y: 452,
                },
              ]}
            >
              {/* Monteveglio Fortress Graphic at (672, 452) */}
              <g transform="translate(672, 452)">
                {/* Animated pulsing red circle */}
                <circle
                  cx={0}
                  cy={0}
                  r={interpolate(frame, [2260, 2380], [10, 45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                  fill="none"
                  stroke="#e63946"
                  strokeWidth={3}
                  strokeDasharray="4,4"
                  style={{
                    opacity: interpolate(frame, [2260, 2380], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  }}
                />

                {/* Draw cartoon castle */}
                <rect x={-15} y={-10} width={30} height={20} fill="#8d99ae" stroke="black" strokeWidth={2.5} rx={2} />
                <rect x={-15} y={-15} width={6} height={6} fill="#8d99ae" stroke="black" strokeWidth={2.5} />
                <rect x={-3} y={-15} width={6} height={6} fill="#8d99ae" stroke="black" strokeWidth={2.5} />
                <rect x={9} y={-15} width={6} height={6} fill="#8d99ae" stroke="black" strokeWidth={2.5} />
                <path d="M -4 10 A 4 4 0 0 1 4 10 Z" fill="#2b2d42" stroke="black" strokeWidth={1.5} />

                {/* Modena Ghibelline Flag rising */}
                {frame >= 2350 && (
                  <g
                    style={{
                      transform: `translate(12px, ${interpolate(frame, [2350, 2450], [15, -15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                    }}
                  >
                    <line x1={0} y1={15} x2={0} y2={-15} stroke="black" strokeWidth={2} />
                    <path d="M 0 -15 L 18 -10 L 0 -5 Z" fill="#4ea8de" stroke="black" strokeWidth={1.5} />
                  </g>
                )}
              </g>

              {/* Label for Monteveglio */}
              {frame >= 2280 && (
                <g transform="translate(672, 480)">
                  <text x={0} y={0} fontSize={8} fontWeight="bold" fontFamily="Fredoka" textAnchor="middle" stroke="white" strokeWidth={2}>
                    MONTEVEGLIO
                  </text>
                  <text x={0} y={0} fontSize={8} fontWeight="bold" fontFamily="Fredoka" textAnchor="middle" fill="black">
                    MONTEVEGLIO
                  </text>
                </g>
              )}
            </MapScene>

            {frame >= 2250 && frame < 2400 && (
              <JokeCaption
                text="Chiến tranh thực ra nổ ra vì Modena vừa chiếm pháo đài Monteveglio của Bologna..."
                type="normal"
                position={{ bottom: 80 }}
              />
            )}

            {frame >= 2400 && frame < 2550 && (
              <JokeCaption
                text="...giữa lúc hai phe Guelph và Ghibelline vốn đã ghét nhau từ lâu."
                type="normal"
                position={{ bottom: 80 }}
              />
            )}
          </AbsoluteFill>
        )}

        {/* Sub-scene 5C: Bell Tower (Frames 2550 - 2750) */}
        {frame >= 2550 && frame < 2750 && (
          <AbsoluteFill style={{ backgroundColor: "#90e0ef" }}>
            <SkyClouds tone="day" />
            <BellTower style={{ position: "absolute", bottom: 0, left: "20%" }} />

            {/* Proud Modena Soldier */}
            <Character
              role="modena"
              style={{
                position: "absolute",
                bottom: 80,
                right: "20%",
                scale: 1.1,
              }}
            />

            {frame >= 2550 && frame < 2700 && (
              <JokeCaption
                text="Cái thùng chỉ xuất hiện SAU khi Modena thắng trận — họ mang nó về như một món quà sỉ nhục..."
                type="normal"
                position={{ bottom: 80 }}
              />
            )}

            {frame >= 2700 && frame < 2750 && (
              <JokeCaption
                text="...treo lên tháp chuông như một chiếc cúp vô địch!"
                type="joke"
                position={{ bottom: 80 }}
              />
            )}
          </AbsoluteFill>
        )}

        {/* Sub-scene 5D: Museum Ending (Frames 2750 - 3000) */}
        {frame >= 2750 && (
          <AbsoluteFill style={{ backgroundColor: "#f2e9e1" }}>
            {/* Museum Header */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 156,
                backgroundColor: "#e3d5ca",
                borderBottom: "6px solid black",
              }}
            >
              <h2
                style={{
                  fontFamily: "Bangers",
                  fontSize: 46,
                  color: "black",
                  textAlign: "center",
                  marginTop: 52,
                }}
              >
                MODENA HISTORICAL MUSEUM
              </h2>
            </div>

            {/* Display case containing the vector bucket */}
            <div
              style={{
                position: "absolute",
                bottom: 80,
                left: "45%",
                width: 182,
                height: 208,
                border: "5px solid black",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bucket style={{ scale: 1.1 }} />
            </div>

            {/* Modern Tourist on the left */}
            <Character role="tourist" style={{ position: "absolute", bottom: 60, left: "15%", scale: 0.85 }} />

            {/* Ghost Modena Soldier on the right (with opacity 0.5) */}
            <Character
              role="modena"
              isTalking={frame >= 2875 && frame < 3000}
              style={{
                position: "absolute",
                bottom: 60,
                right: "15%",
                opacity: 0.5, // Ghostly appearance
                scale: 1.0,
              }}
            />

            {frame >= 2750 && frame < 2875 && (
              <JokeCaption
                text="Ủa, hàng ngàn người ngã xuống chỉ vì cái này hả?"
                type="thought"
                position={{ bottom: "55%", left: "5%", transform: "none" }}
              />
            )}

            {frame >= 2875 && frame < 3000 && (
              <JokeCaption
                text="Thật ra là vì một pháo đài... nhưng cái thùng nghe hay hơn nhiều!"
                type="speech"
                tailSide="right"
                position={{ bottom: "55%", right: "5%", transform: "none" }}
              />
            )}
          </AbsoluteFill>
        )}
      </Sequence>

      {/* =======================================================
          AUDIO TRACK: Edge-TTS voiceover + Remotion SFX
          ======================================================= */}
      {voiceoverTrack.map((vo) => (
        <Sequence key={vo.file} from={vo.from} durationInFrames={vo.duration}>
          <Audio src={staticFile(`audio/vo/${vo.file}`)} />
        </Sequence>
      ))}

      {sfxTrack.map((sfx) => (
        <Sequence key={sfx.file} from={sfx.from} durationInFrames={sfx.duration}>
          <Audio src={staticFile(`audio/sfx/${sfx.file}`)} volume={sfx.volume} />
        </Sequence>
      ))}

    </AbsoluteFill>
  );
};
