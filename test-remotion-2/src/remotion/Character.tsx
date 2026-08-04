import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";

export interface CharacterProps {
  role: "soldier" | "king" | "napoleon" | "citizen" | "general" | "bologna" | "modena" | "tourist";
  eyeExpression?: "normal" | "angry" | "shocked" | "sad" | "wink" | "closed";
  emotionMarker?: "none" | "exclamation" | "question" | "sweat" | "anger";
  armPosition?: "down" | "pointing-left" | "pointing-right" | "hips" | "waving";
  bodyColor?: string;
  pantsColor?: string;
  skinColor?: string;
  cheekColor?: string;
  accessoryColor?: string;
  bounceHeight?: number; // Amplitude of idle bounce (default 6)
  bounceSpeed?: number;  // Frames per cycle (default 24)
  isTalking?: boolean; // Wider head tilt + faster bob while a caption is on screen
  scale?: number;
  style?: React.CSSProperties;
}

// Eye-dot anchor per character PNG, in the 250x300 overlay viewBox (measured per art asset).
// Tourist wears sunglasses so eyes aren't drawn/blinked.
const EYE_ANCHORS: Partial<Record<CharacterProps["role"], { left: [number, number]; right: [number, number]; r: number }>> = {
  bologna: { left: [123, 112], right: [150, 112], r: 7 },
  modena: { left: [122, 125], right: [149, 125], r: 7 },
  general: { left: [127, 96], right: [148, 96], r: 6 },
};

export const Character: React.FC<CharacterProps> = ({
  role,
  emotionMarker = "none",
  bounceHeight = 9, // ponytail: livelier idle motion, was too static
  bounceSpeed = 20,
  isTalking = false,
  scale = 1,
  style,
}) => {
  const frame = useCurrentFrame();

  // Dynamic bounce calculation for idle movement (faster/wider while talking)
  const speed = isTalking ? bounceSpeed * 0.6 : bounceSpeed;
  const height = isTalking ? bounceHeight * 1.4 : bounceHeight;
  const t = (frame * 2 * Math.PI) / speed;
  const bounceY = Math.sin(t) * height;
  const rotateAngle = Math.cos(t) * (isTalking ? 4 : 1.5); // subtle tilt, wider when talking

  // Blink: closed for 4 frames every ~110 frames (offset per role so a group doesn't blink in unison)
  const blinkCycle = 110;
  const roleOffset = role.length * 17;
  const framesInCycle = (frame + roleOffset) % blinkCycle;
  const isBlinking = framesInCycle < 4;
  const eyeAnchor = EYE_ANCHORS[role];

  const getCharacterImage = () => {
    switch (role) {
      case "general":
        return "char_general.png";
      case "bologna":
        return "char_bologna.png";
      case "modena":
        return "char_modena.png";
      case "tourist":
        return "char_tourist.png";
      case "napoleon":
      default:
        return "char_napoleon.png"; // Fallback to Napoleon
    }
  };

  const charImage = getCharacterImage();

  return (
    <div
      style={{
        display: "inline-block",
        scale: String(scale),
        translate: `0px ${bounceY}px`,
        rotate: `${rotateAngle}deg`,
        transformOrigin: "bottom center",
        width: 340,
        height: 408,
        position: "relative",
        ...style,
      }}
    >
      {/* 1. Puppet Image Asset */}
      <Img
        src={staticFile(charImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* 2. SVG Overlay for Dynamic Emotion Markers */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 250 300"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {/* Shadow under character */}
        <ellipse cx={125} cy={285} rx={50} ry={8} fill="rgba(0, 0, 0, 0.15)" />

        {/* Blink: skin-tone eyelid covers the eye dots for a few frames every cycle */}
        {isBlinking && eyeAnchor && (
          <>
            <ellipse cx={eyeAnchor.left[0]} cy={eyeAnchor.left[1]} rx={eyeAnchor.r} ry={3} fill="#f6d7ae" />
            <ellipse cx={eyeAnchor.right[0]} cy={eyeAnchor.right[1]} rx={eyeAnchor.r} ry={3} fill="#f6d7ae" />
          </>
        )}

        {/* Emotion Markers (aligned with the head position on the con rối image) */}
        {emotionMarker === "exclamation" && (
          <g style={{ transform: "translate(125px, 20px)", filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.3))" }}>
            <circle cx={0} cy={0} r={14} fill="#e63946" stroke="black" strokeWidth={3.5} />
            <text
              x={0}
              y={8}
              fontSize={24}
              fontWeight="bold"
              fontFamily="Fredoka"
              fill="white"
              textAnchor="middle"
            >
              !
            </text>
          </g>
        )}

        {emotionMarker === "question" && (
          <g style={{ transform: "translate(125px, 20px)", filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.3))" }}>
            <circle cx={0} cy={0} r={14} fill="#4ea8de" stroke="black" strokeWidth={3.5} />
            <text
              x={0}
              y={8}
              fontSize={22}
              fontWeight="bold"
              fontFamily="Fredoka"
              fill="white"
              textAnchor="middle"
            >
              ?
            </text>
          </g>
        )}

        {emotionMarker === "sweat" && (
          // Sweat drop near temple (left side of head)
          <path
            d="M 68 85 C 64 85, 60 90, 60 96 C 60 102, 68 106, 68 106 C 68 106, 76 102, 76 96 C 76 90, 72 85, 68 85 Z"
            fill="#4ea8de"
            stroke="black"
            strokeWidth={3}
            style={{ transform: "translate(15px, -15px) rotate(-20deg)", transformOrigin: "68px 95px" }}
          />
        )}

        {emotionMarker === "anger" && (
          // Anger cross lines (near right temple)
          <g style={{ transform: "translate(175px, 60px)" }}>
            <path
              d="M -10 0 Q 0 0 0 10 M 0 0 Q 0 -10 -10 -10 M 0 0 Q 10 0 10 -10 M 0 0 Q 0 10 10 10"
              fill="none"
              stroke="#e63946"
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
