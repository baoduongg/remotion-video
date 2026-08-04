import React from "react";
import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from "remotion";

export interface TitleCardProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  styleType?: "default" | "classic-red" | "royal";
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor = "#ffffff",
  accentColor,
  styleType = "default",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for pop-in scale bounce
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 11,   // slightly underdamped for bounce
      stiffness: 110,
      mass: 0.7,
    },
  });

  // Theme settings
  const getTheme = () => {
    switch (styleType) {
      case "classic-red":
        return {
          bg: backgroundColor || "#560bad", // Dark purple/violet
          bannerBg: accentColor || "#f72585", // Neon pink
          border: "#ffd700",
        };
      case "royal":
        return {
          bg: backgroundColor || "#03045e", // Deep royal blue
          bannerBg: accentColor || "#ffd700", // Bright gold
          border: "#ffffff",
        };
      case "default":
      default:
        return {
          bg: backgroundColor || "#1a1a24", // Dark charcoal
          bannerBg: accentColor || "#f77f00", // Vivid orange
          border: "#fcbf49",
        };
    }
  };

  const theme = getTheme();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        overflow: "hidden",
      }}
    >
      {/* Decorative Outer Border */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          right: 30,
          bottom: 30,
          border: `5px double ${theme.border}`,
          borderRadius: 8,
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />

      {/* Main Animated Box */}
      <div
        style={{
          scale: String(scale),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {/* Decorative Badge Icon (OverSimplified Sunburst or Crown-like icon) */}
        <div style={{ marginBottom: 26 }}>
          <svg width={130} height={130} viewBox="0 0 100 100">
            {/* Sunburst background */}
            <circle cx={50} cy={50} r={40} fill={theme.bannerBg} stroke="black" strokeWidth={5} />
            <polygon
              points="50,15 57,35 78,35 62,48 68,70 50,56 32,70 38,48 22,35 43,35"
              fill={textColor}
              stroke="black"
              strokeWidth={3}
            />
          </svg>
        </div>

        {/* Title Banner */}
        <div
          style={{
            backgroundColor: theme.bannerBg,
            border: "6px solid black",
            borderRadius: 15,
            padding: "24px 48px",
            boxShadow: "8px 8px 0px rgba(0, 0, 0, 0.4)",
            position: "relative",
            transform: "rotate(-1.5deg)",
          }}
        >
          <h1
            style={{
              fontFamily: "Bangers, sans-serif",
              fontSize: 84,
              color: textColor,
              margin: 0,
              padding: 0,
              letterSpacing: 2,
              lineHeight: 1.1,
              // Heavy black stroke
              WebkitTextStroke: "6px black",
              paintOrder: "stroke fill",
              textShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)",
            }}
          >
            {title.toUpperCase()}
          </h1>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              marginTop: 40,
              transform: "rotate(1deg)",
            }}
          >
            <h2
              style={{
                fontFamily: "Fredoka, sans-serif",
                fontSize: 40,
                fontWeight: 700,
                color: "#ffffff",
                backgroundColor: "black",
                padding: "10px 28px",
                borderRadius: 8,
                border: "4px solid white",
                display: "inline-block",
                boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.3)",
                margin: 0,
              }}
            >
              {subtitle}
            </h2>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
