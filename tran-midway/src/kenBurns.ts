import { interpolate } from "remotion";

export type Shot = {
  from: number;
  to: number;
  scale: [number, number];
  x?: [number, number];
  y?: [number, number];
};

export function shotTransform(frame: number, shots: Shot[]): string {
  const shot = shots.find((s) => frame >= s.from && frame < s.to) ?? shots[shots.length - 1];
  const local = frame - shot.from;
  const localDur = shot.to - shot.from;
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const scale = interpolate(local, [0, localDur], shot.scale, opts);
  const x = shot.x ? interpolate(local, [0, localDur], shot.x, opts) : 0;
  const y = shot.y ? interpolate(local, [0, localDur], shot.y, opts) : 0;

  return `scale(${scale}) translate(${x}%, ${y}%)`;
}
