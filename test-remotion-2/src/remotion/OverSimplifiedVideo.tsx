import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";
import { TitleCard } from "./TitleCard";
import { MapScene, Territory, Conquest, CameraStep } from "./MapScene";
import { Character } from "./Character";
import { JokeCaption } from "./JokeCaption";
import { SceneTransition } from "./SceneTransition";

// Define territories for the map scene
const mapTerritories: Territory[] = [
  {
    id: "gbr",
    name: "Britain",
    color: "#e63946", // Red
    strokeColor: "black",
    path: "M 360 80 Q 420 50 440 100 T 470 170 T 480 260 L 380 270 Q 360 210 390 170 T 360 80 Z",
    labelX: 410,
    labelY: 160,
  },
  {
    id: "fra",
    name: "France",
    color: "#1d3557", // Dark blue-navy
    strokeColor: "black",
    path: "M 350 495 L 390 320 Q 420 310 460 290 L 550 275 Q 600 275 630 280 L 675 360 Q 690 420 680 480 L 490 538 Z",
    labelX: 480,
    labelY: 380,
  },
  {
    id: "ger",
    name: "Germany",
    color: "#e07a5f", // Orange-brown
    strokeColor: "black",
    path: "M 630 280 L 675 360 Q 690 420 680 480 L 760 430 L 850 420 L 870 250 L 730 200 Z",
    labelX: 730,
    labelY: 310,
  },
  {
    id: "spa",
    name: "Spain",
    color: "#fcbf49", // Yellow
    strokeColor: "black",
    path: "M 275 495 L 350 495 L 490 538 L 355 595 L 275 560 Z",
    labelX: 330,
    labelY: 540,
  },
  {
    id: "ita",
    name: "Italy",
    color: "#2a9d8f", // Teal green
    strokeColor: "black",
    path: "M 680 480 L 760 430 L 850 420 Q 860 480 920 560 L 880 570 L 810 520 Z",
    labelX: 810,
    labelY: 490,
  },
];

// Conquest event: France invades Germany
const mapConquests: Conquest[] = [
  {
    invaderId: "fra",
    targetId: "ger",
    centerX: 650,
    centerY: 320,
    startFrame: 130,
    duration: 50,
    arrow: {
      startX: 530,
      startY: 350,
      endX: 670,
      endY: 310,
    },
  },
];

// Camera steps for the map zoom and pan
const mapCameraSteps: CameraStep[] = [
  {
    startFrame: 0,
    duration: 25,
    zoom: 1.0,
    x: 500,
    y: 300,
  },
  {
    startFrame: 25, // Transition begins
    duration: 120, // holds focus
    zoom: 1.8,
    x: 580,
    y: 320, // focus on France-Germany border
  },
  {
    startFrame: 175,
    duration: 30,
    zoom: 1.0,
    x: 500,
    y: 300, // Zoom out
  },
];

export const OverSimplifiedVideo: React.FC = () => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const isVertical = videoHeight > videoWidth;
  const bgImage = isVertical
    ? staticFile("confrontation_bg_vertical.png")
    : staticFile("confrontation_bg_horizontal.png");

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* SCENE 1: Title Card (Frames 0 - 85) */}
      <Sequence durationInFrames={85}>
        <TitleCard
          title="Napoleon's Comedic Rise"
          subtitle="An OverSimplified Historic Explainer"
          styleType="default"
        />
      </Sequence>

      {/* TRANSITION 1 (Frames 73 - 97) */}
      <Sequence from={73} durationInFrames={24}>
        <SceneTransition />
      </Sequence>

      {/* SCENE 2: Map Scene (Frames 85 - 290) */}
      <Sequence from={85} durationInFrames={205}>
        <MapScene
          territories={mapTerritories}
          conquests={mapConquests}
          cameraSteps={mapCameraSteps}
        />
        
        {/* Sync captions for map scene */}
        <Sequence from={10} durationInFrames={50}>
          <JokeCaption text="France was feeling a bit squeezed..." type="normal" />
        </Sequence>
        <Sequence from={65} durationInFrames={60}>
          <JokeCaption text="...so Napoleon decided to make some border adjustments!" type="normal" />
        </Sequence>
        <Sequence from={130} durationInFrames={55}>
          <JokeCaption text="WHOOSH! TAKEOVER!" type="joke" />
        </Sequence>
        <Sequence from={190} durationInFrames={15}>
          <JokeCaption text="Nice." type="normal" />
        </Sequence>
      </Sequence>

      {/* TRANSITION 2 (Frames 278 - 302) */}
      <Sequence from={278} durationInFrames={24}>
        <SceneTransition colors={["#e63946", "#ffd700", "#1d3557"]} />
      </Sequence>

      {/* SCENE 3: Character Dialogue (Frames 290 - 450) */}
      <Sequence from={290} durationInFrames={160}>
        {/* Custom Character Scene Layout using generated background */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          <Img
            src={bgImage}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Characters Container (Responsive layout) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingLeft: "12%",
              paddingRight: "12%",
              paddingBottom: "10%",
              zIndex: 10,
            }}
          >
            {/* Napoleon (Left) */}
            <NapoleonController />

            {/* British General (Right) */}
            <BritishGeneralController />
          </div>

          {/* Captions synced to dialogue */}
          <JokeCaptionController />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// Helper controller components to cleanly manage states over time within Scene 3 (relative frame starts at 0 for these components)
const NapoleonController: React.FC = () => {
  const frame = useCurrentFrame();

  let eyeExpression: "normal" | "angry" | "sad" = "normal";
  let armPosition: "down" | "hips" | "pointing-right" = "down";
  let emotionMarker: "none" | "anger" | "sweat" = "none";

  if (frame >= 20 && frame < 70) {
    // Napoleon gets angry
    eyeExpression = "angry";
    armPosition = "hips";
    emotionMarker = "anger";
  } else if (frame >= 70 && frame < 115) {
    // Napoleon points at British general
    eyeExpression = "angry";
    armPosition = "pointing-right";
    emotionMarker = "none";
  } else if (frame >= 115) {
    // Napoleon gets roasted and is sad/sweating
    eyeExpression = "sad";
    armPosition = "down";
    emotionMarker = "sweat";
  }

  return (
    <Character
      role="napoleon"
      scale={1.3}
      eyeExpression={eyeExpression}
      armPosition={armPosition}
      emotionMarker={emotionMarker}
      bodyColor="#1d3557"
      pantsColor="#ffffff"
    />
  );
};

const BritishGeneralController: React.FC = () => {
  const frame = useCurrentFrame();

  let eyeExpression: "normal" | "shocked" | "wink" = "normal";
  let armPosition: "down" | "waving" | "hips" = "down";
  let emotionMarker: "none" | "exclamation" | "question" = "none";

  if (frame >= 35 && frame < 70) {
    // General gets shocked by Napoleon's anger
    eyeExpression = "shocked";
    armPosition = "waving";
    emotionMarker = "exclamation";
  } else if (frame >= 70 && frame < 115) {
    // General calms down and crosses arms/hips to roast Napoleon
    eyeExpression = "normal";
    armPosition = "hips";
    emotionMarker = "none";
  } else if (frame >= 115) {
    // General winks smugly
    eyeExpression = "wink";
    armPosition = "down";
    emotionMarker = "none";
  }

  return (
    <Character
      role="general"
      scale={1.3}
      eyeExpression={eyeExpression}
      armPosition={armPosition}
      emotionMarker={emotionMarker}
      bodyColor="#e63946"
      pantsColor="#2b2d42"
    />
  );
};

const JokeCaptionController: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame >= 20 && frame < 65) {
    return (
      <JokeCaption
        text="You want a piece of me, Briti-Boy?!"
        type="shout"
        position={{ bottom: 180, left: "40%", transform: "translateX(-50%)" }}
      />
    );
  }
  
  if (frame >= 70 && frame < 110) {
    return (
      <JokeCaption
        text="Napoleon, you are literally 5 foot 6..."
        type="normal"
        position={{ bottom: 180, left: "60%", transform: "translateX(-50%)" }}
      />
    );
  }

  if (frame >= 115 && frame < 155) {
    return (
      <JokeCaption
        text="Ouch. Emotionally damaged."
        type="joke"
        position={{ bottom: 210, left: "38%", transform: "translateX(-50%)" }}
      />
    );
  }

  return null;
};
