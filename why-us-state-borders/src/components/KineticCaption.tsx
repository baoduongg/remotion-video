import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Beat } from "../data/beats";
import { fontFamily, palette } from "../theme";

export const KineticCaption: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunkDuration = beat.durationFrames / beat.chunks.length;
  const activeIndex = Math.min(
    beat.chunks.length - 1,
    Math.floor(frame / chunkDuration)
  );
  const chunk = beat.chunks[activeIndex];
  const chunkStartFrame = activeIndex * chunkDuration;
  const localFrame = frame - chunkStartFrame;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: "6%",
        right: "6%",
        bottom: "10%",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        opacity,
        translate: `0px ${translateY}px`,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: 58,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          lineHeight: 1.15,
          textShadow:
            "0 2px 0 rgba(27,42,74,0.9), 0 4px 12px rgba(27,42,74,0.6), 0 0 3px rgba(27,42,74,0.8)",
          WebkitTextStroke: `2px ${palette.navy}`,
        }}
      >
        {chunk.words.map((w, i) => (
          <span
            key={i}
            style={{ color: w.keyword ? palette.mustard : palette.cream }}
          >
            {w.text}
            {i < chunk.words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </div>
  );
};
