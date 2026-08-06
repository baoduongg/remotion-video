import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Beat } from "../data/beats";

const clampOpts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function baseMotion(motion: Beat["motion"], frame: number, d: number) {
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let opacity = 1;

  switch (motion) {
    case "zoom-in":
      scale = interpolate(frame, [0, d], [1, 1.08], {
        ...clampOpts,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      break;
    case "pan-lr":
      translateX = interpolate(frame, [0, d], [-30, 30], clampOpts);
      scale = 1.06;
      break;
    case "pan-du":
      translateY = interpolate(frame, [0, d], [30, -30], clampOpts);
      scale = 1.06;
      break;
    case "fade-scale":
      scale = interpolate(frame, [0, 15], [0.8, 1], {
        ...clampOpts,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      opacity = interpolate(frame, [0, 15], [0, 1], clampOpts);
      break;
    case "slide-up":
      translateY = interpolate(frame, [0, 15], [60, 0], {
        ...clampOpts,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      opacity = interpolate(frame, [0, 15], [0, 1], clampOpts);
      break;
    case "static":
    default:
      break;
  }

  return { scale, translateX, translateY, opacity };
}

// ponytail: cheap deterministic hash, only needs to spread per-beat animation phase/amplitude
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const Scene: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = beat.durationFrames;
  const base = baseMotion(beat.motion, frame, d);

  if (!beat.bgAsset || !beat.fgAsset) {
    return (
      <CanvasImage
        src={staticFile(beat.asset)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: base.scale,
          translate: `${base.translateX}px ${base.translateY}px`,
          opacity: base.opacity,
        }}
      />
    );
  }

  const seed = hash(beat.id);
  const phase = ((seed % 100) / 100) * Math.PI * 2;
  const bobAmp = 5 + (seed % 5); // px, per-scene so foregrounds don't bob in lockstep
  const rotAmp = 1 + ((seed >> 3) % 4) * 0.4; // deg
  const freq = 0.5 + ((seed >> 5) % 4) * 0.12; // cycles/sec

  const t = frame / fps;
  const bobY = Math.sin(t * freq * Math.PI * 2 + phase) * bobAmp;
  const wobbleRot = Math.sin(t * freq * Math.PI * 2 * 0.6 + phase) * rotAmp;

  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 18 });

  return (
    <AbsoluteFill>
      <CanvasImage
        src={staticFile(beat.bgAsset)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: base.scale,
          translate: `${base.translateX}px ${base.translateY}px`,
          opacity: base.opacity,
        }}
      />
      <CanvasImage
        src={staticFile(beat.fgAsset)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: base.scale * interpolate(entrance, [0, 1], [0.9, 1]),
          translate: `${base.translateX * 1.35}px ${base.translateY * 1.35 + bobY}px`,
          rotate: `${wobbleRot}deg`,
          opacity: base.opacity * interpolate(entrance, [0, 1], [0, 1]),
        }}
      />
    </AbsoluteFill>
  );
};
