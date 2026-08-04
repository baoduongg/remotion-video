import { evolvePath } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";

export type DrawOnPathProps = {
  d: string;
  from: number;
  to: number;
  stroke: string;
  strokeWidth?: number;
  fill?: string;
};

export const DrawOnPath: React.FC<DrawOnPathProps> = ({
  d,
  from,
  to,
  stroke,
  strokeWidth = 4,
  fill = "none",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, d);

  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
    />
  );
};
