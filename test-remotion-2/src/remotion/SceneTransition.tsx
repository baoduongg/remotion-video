import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Audio, staticFile } from "remotion";

export interface SceneTransitionProps {
  colors?: string[];
  durationInFrames?: number;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  colors = ["#1d3557", "#e63946", "#ffeb3b"], // Classic OverSimplified Blue, Red, Yellow
  durationInFrames = 16, // ponytail: snappier wipe, less flat-color dead time between scenes
}) => {
  const frame = useCurrentFrame();

  // We want to animate 3 panels, staggered.
  // Panel 1 (First color): Animates from frame 0 to 16
  // Panel 2 (Second color): Animates from frame 2 to 18
  // Panel 3 (Third color): Animates from frame 4 to 20
  
  // Since we want the transition to be fully responsive, we'll translate from -120% to 100%.
  // A width of 120% ensures complete screen coverage.
  const getPanelX = (startFrame: number, endFrame: number) => {
    return interpolate(frame, [startFrame, endFrame], [-120, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 1, 0.5, 1), // Custom smooth slide curve
    });
  };

  const panelX1 = getPanelX(0, durationInFrames - 8);
  const panelX2 = getPanelX(2, durationInFrames - 6);
  const panelX3 = getPanelX(4, durationInFrames - 4);

  const panelCoordinates = [panelX1, panelX2, panelX3];

  return (
    <AbsoluteFill
      style={{
        zIndex: 500,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ponytail: baked in once here so every wipe across the video gets a whoosh for free */}
      <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.5} />
      {colors.slice(0, 3).map((color, index) => {
        const xPercent = panelCoordinates[index] ?? -120;
        
        return (
          <div
            key={`transition-panel-${index}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "120%",
              height: "100%",
              backgroundColor: color,
              borderLeft: "6px solid black",
              borderRight: "6px solid black",
              transform: `translateX(${xPercent}%) skewX(-8deg)`, // Slanted edges for dynamic motion
              transformOrigin: "top left",
              boxShadow: "0 0 30px rgba(0,0,0,0.5)",
              zIndex: 510 + index,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
