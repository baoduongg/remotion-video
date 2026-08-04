import React from "react";

export const ShipIcon: React.FC<{ color: string; width?: number }> = ({
  color,
  width = 110,
}) => {
  const height = width * 0.32;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 35"
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d="M6 24 L14 10 L96 10 L104 24 L96 30 L14 30 Z"
        fill={color}
        opacity={0.92}
      />
      <rect x="30" y="3" width="6" height="9" fill={color} />
      <rect x="50" y="1" width="6" height="11" fill={color} />
      <rect x="70" y="3" width="6" height="9" fill={color} />
    </svg>
  );
};

export const PlaneIcon: React.FC<{
  color: string;
  size?: number;
  rotationDeg?: number;
}> = ({ color, size = 22, rotationDeg = 0 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", rotate: `${rotationDeg}deg` }}
    >
      <path
        d="M12 1 L15 13 L23 17 L15 17 L13 22 L11 22 L11 17 L1 17 L9 13 Z"
        fill={color}
      />
    </svg>
  );
};

export const SubmarineIcon: React.FC<{ color: string; width?: number }> = ({
  color,
  width = 90,
}) => {
  const height = width * 0.34;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 90 30"
      style={{ display: "block", overflow: "visible" }}
    >
      <ellipse cx="45" cy="18" rx="40" ry="9" fill={color} opacity={0.92} />
      <rect x="38" y="2" width="8" height="12" fill={color} />
      <line
        x1="42"
        y1="2"
        x2="42"
        y2="-8"
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
};
