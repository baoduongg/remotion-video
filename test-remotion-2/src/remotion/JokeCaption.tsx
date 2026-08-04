import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export interface JokeCaptionProps {
  text: string;
  type?: "normal" | "joke" | "thought" | "shout" | "speech";
  tailSide?: "left" | "right"; // which side the speech-bubble tail points from, toward the speaker's mouth
  fontSize?: number;
  position?: {
    bottom?: number | string;
    top?: number | string;
    left?: number | string;
    right?: number | string;
    transform?: string;
  };
  style?: React.CSSProperties;
}

export const JokeCaption: React.FC<JokeCaptionProps> = ({
  text,
  type = "normal",
  tailSide = "left",
  fontSize = 34,
  position,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance scale bounce
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 140,
      mass: 0.5,
    },
  });

  // Default positioning: Bottom Center
  const defaultPosition: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: 80,
    zIndex: 100,
    ...position,
  };

  if (type === "normal") {
    return (
      <div
        style={{
          ...defaultPosition,
          scale: String(scale),
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          border: "4px solid white",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5), 4px 4px 0px rgba(0, 0, 0, 0.3)",
          borderRadius: 12,
          padding: "20px 38px",
          maxWidth: 860,
          textAlign: "center",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <span
          style={{
            fontFamily: "Fredoka, sans-serif",
            fontSize,
            color: "white",
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: 0.5,
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  if (type === "joke") {
    return (
      <div
        style={{
          ...defaultPosition,
          scale: String(scale),
          transformOrigin: "center center",
          rotate: "-3deg",
          backgroundColor: "#ffeb3b", // Bright comic yellow
          border: "5px solid black",
          borderRadius: 8,
          padding: "16px 34px",
          boxShadow: "6px 6px 0px black",
          maxWidth: 760,
          textAlign: "center",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <span
          style={{
            fontFamily: "Bangers, sans-serif",
            fontSize: fontSize + 6,
            color: "black",
            letterSpacing: 1.5,
            lineHeight: 1.2,
          }}
        >
          {text.toUpperCase()}
        </span>
      </div>
    );
  }

  if (type === "speech") {
    // Classic rounded speech bubble with a tail pointing down toward the speaker's mouth
    const tailX = tailSide === "left" ? 60 : 340;
    return (
      <div
        style={{
          ...defaultPosition,
          scale: String(scale),
          width: 460,
          textAlign: "center",
          boxSizing: "border-box",
          ...style,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            border: "5px solid black",
            borderRadius: 26,
            padding: "18px 30px",
            boxShadow: "5px 5px 0px rgba(0,0,0,0.25)",
          }}
        >
          <span
            style={{
              fontFamily: "Fredoka, sans-serif",
              fontSize,
              color: "black",
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {text}
          </span>
        </div>
        <svg
          width={400}
          height={26}
          viewBox="0 0 400 26"
          style={{ position: "absolute", top: "100%", left: 0, marginTop: -4 }}
        >
          <path
            d={`M ${tailX - 18} 0 L ${tailX} 26 L ${tailX + 18} 0 Z`}
            fill="white"
            stroke="black"
            strokeWidth={5}
          />
          <path d={`M ${tailX - 15} 0 L ${tailX + 15} 0`} fill="white" stroke="white" strokeWidth={6} />
        </svg>
      </div>
    );
  }

  if (type === "thought") {
    // Cloud thought bubble
    return (
      <div
        style={{
          ...defaultPosition,
          scale: String(scale),
          width: 520,
          height: 195,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          ...style,
        }}
      >
        {/* SVG Cloud Background */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 150"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "visible",
            filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.25))",
          }}
        >
          {/* Main cloud path */}
          <path
            d="M 50 40 
               C 40 10, 80 10, 100 30 
               C 120 10, 160 10, 180 30 
               C 200 10, 240 10, 260 30 
               C 280 10, 320 10, 340 40 
               C 375 40, 390 70, 375 95 
               C 390 120, 350 140, 330 120 
               C 310 140, 270 140, 250 120 
               C 230 140, 190 140, 170 120 
               C 150 140, 110 140, 90 120 
               C 70 140, 30 130, 25 105 
               C 5 95, 10 60, 35 55 
               C 30 40, 45 40, 50 40 Z"
            fill="white"
            stroke="black"
            strokeWidth={5}
            strokeLinejoin="round"
          />

          {/* Thought trail circles */}
          <circle cx={90} cy={135} r={10} fill="white" stroke="black" strokeWidth={4} />
          <circle cx={75} cy={148} r={6} fill="white" stroke="black" strokeWidth={3} />
        </svg>

        {/* Text over cloud */}
        <div
          style={{
            zIndex: 10,
            padding: "24px 54px",
            textAlign: "center",
            boxSizing: "border-box",
            width: "100%",
            transform: "translateY(-10px)",
          }}
        >
          <span
            style={{
              fontFamily: "Fredoka, sans-serif",
              fontSize: fontSize - 4,
              color: "black",
              fontWeight: 600,
              lineHeight: 1.25,
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  if (type === "shout") {
    // Spiky shout bubble
    return (
      <div
        style={{
          ...defaultPosition,
          scale: String(scale),
          width: 520,
          height: 195,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          ...style,
        }}
      >
        {/* SVG Spiky Background */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 150"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "visible",
            filter: "drop-shadow(5px 5px 0px rgba(0,0,0,0.3))",
          }}
        >
          <path
            d="M 20 60 L 5 45 L 40 40 L 15 15 L 60 25 L 75 5 L 105 20 L 135 5 L 155 25 L 195 5 L 215 25 L 255 5 L 275 25 L 315 5 L 335 25 L 365 10 L 380 30 L 405 20 L 395 45 L 415 60 L 395 75 L 405 100 L 380 90 L 365 110 L 335 95 L 315 115 L 275 95 L 255 115 L 215 95 L 195 115 L 155 95 L 135 115 L 105 95 L 75 115 L 60 95 L 15 105 L 40 80 L 5 75 Z"
            fill="#e63946" // Red shout background
            stroke="black"
            strokeWidth={5.5}
            strokeLinejoin="miter"
          />
        </svg>

        {/* Text over spiky bubble */}
        <div
          style={{
            zIndex: 10,
            padding: "24px 48px",
            textAlign: "center",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <span
            style={{
              fontFamily: "Bangers, sans-serif",
              fontSize: fontSize + 4,
              color: "white",
              letterSpacing: 1.2,
              lineHeight: 1.2,
              WebkitTextStroke: "2px black",
            }}
          >
            {text.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return null;
};
