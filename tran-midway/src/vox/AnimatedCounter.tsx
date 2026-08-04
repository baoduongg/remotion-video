import { interpolate, useCurrentFrame } from "remotion";

export type AnimatedCounterProps = {
  from: number;
  to: number;
  target: number;
  prefix?: string;
  style?: React.CSSProperties;
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  target,
  prefix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [from, to], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span style={style}>
      {prefix}
      {Math.round(value).toLocaleString("vi-VN")}
    </span>
  );
};
