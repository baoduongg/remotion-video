import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont } from "./fonts";

const ACCENT = "#d4af37";
const INK = "#f3f1e7";
const SUB = "#9db1c9";
const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SectionTitle: React.FC<{ name: string; children: React.ReactNode }> = ({
  name,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], clampOpts);
  const x = interpolate(frame, [0, 20], [-14, 0], clampOpts);

  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 86,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div style={{ width: 26, height: 2, backgroundColor: ACCENT }} />
      <Interactive.Div
        name={name}
        style={{
          color: SUB,
          fontFamily: bodyFont,
          fontSize: 28,
          letterSpacing: 3,
          textTransform: "uppercase",
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        }}
      >
        {children}
      </Interactive.Div>
    </div>
  );
};

export const Caption: React.FC<{
  name: string;
  from: number;
  to?: number;
  children: React.ReactNode;
}> = ({ name, from, to, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const end = to ?? durationInFrames;

  const opacity = interpolate(frame, [from, from + 25, end - 25, end], [0, 1, 1, 0], clampOpts);
  const y = interpolate(frame, [from, from + 25], [26, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 380,
          background:
            "linear-gradient(to top, rgba(5,9,15,0.9), rgba(5,9,15,0.4) 55%, rgba(5,9,15,0) 100%)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 140,
          bottom: 96,
          maxWidth: 1180,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{ width: 52, height: 4, backgroundColor: ACCENT, marginBottom: 22, borderRadius: 2 }} />
        <Interactive.Div
          name={name}
          style={{
            color: INK,
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.45,
            textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          }}
        >
          {children}
        </Interactive.Div>
      </div>
    </>
  );
};
