import { useCurrentFrame, interpolate, useVideoConfig, Img, staticFile } from "remotion";

export interface Territory {
  id: string;
  name: string;
  path: string;
  color: string;
  strokeColor?: string;
  labelX: number;
  labelY: number;
}

export interface Conquest {
  invaderId: string;
  targetId: string;
  centerX: number; // Point where takeover starts
  centerY: number;
  startFrame: number;
  duration: number;
  arrow?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
}

export interface CameraStep {
  startFrame: number;
  duration: number; // Duration of hold at this step
  zoom: number;
  x: number; // Focal point X (defaults to 500)
  y: number; // Focal point Y (defaults to 300)
}

export interface MapSceneProps {
  territories: Territory[];
  conquests?: Conquest[];
  cameraSteps?: CameraStep[];
  children?: React.ReactNode;
}

export const MapScene: React.FC<MapSceneProps> = ({
  territories,
  conquests = [],
  cameraSteps = [],
  children,
}) => {
  const frame = useCurrentFrame();
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  const isVertical = videoHeight > videoWidth;
  const bgMapImage = isVertical
    ? staticFile("map_bg_vertical.png")
    : staticFile("map_bg_horizontal.png");

  // SVG Base ViewBox is 1000x600.
  // Center of base viewBox is (500, 300)
  const baseWidth = 1000;
  const baseHeight = 600;

  // 1. Calculate Camera state (zoom, x, y)
  let currentZoom = 1;
  let currentX = 500;
  let currentY = 300;

  if (cameraSteps && cameraSteps.length > 0) {
    const sortedSteps = [...cameraSteps].sort((a, b) => a.startFrame - b.startFrame);
    
    // Initial state before any step
    let prevStep = { startFrame: 0, duration: 0, zoom: 1, x: 500, y: 300 };

    for (const step of sortedSteps) {
      if (frame < step.startFrame) {
        // Transition from prevStep to current step
        const transitionStart = prevStep.startFrame + prevStep.duration;
        const transitionEnd = step.startFrame;
        
        if (frame > transitionStart && transitionEnd > transitionStart) {
          // Interpolating between camera steps
          currentZoom = interpolate(frame, [transitionStart, transitionEnd], [prevStep.zoom, step.zoom], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          currentX = interpolate(frame, [transitionStart, transitionEnd], [prevStep.x, step.x], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          currentY = interpolate(frame, [transitionStart, transitionEnd], [prevStep.y, step.y], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else {
          currentZoom = prevStep.zoom;
          currentX = prevStep.x;
          currentY = prevStep.y;
        }
        break;
      } else if (frame >= step.startFrame && frame <= step.startFrame + step.duration) {
        // Holding at current step
        currentZoom = step.zoom;
        currentX = step.x;
        currentY = step.y;
        prevStep = step;
      } else {
        // Past current step
        currentZoom = step.zoom;
        currentX = step.x;
        currentY = step.y;
        prevStep = step;
      }
    }
  }

  // Camera translation centering math:
  // We want coordinates (currentX, currentY) of the 1000x600 canvas to be at the center (500, 300)
  const translateX = 500 - currentX * currentZoom;
  const translateY = 300 - currentY * currentZoom;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#bde0fe", // Pastel blue ocean
        overflow: "hidden",
        position: "absolute",
      }}
    >
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          scale: String(currentZoom),
          translate: `${translateX}px ${translateY}px`,
          transformOrigin: "0px 0px",
          position: "relative",
        }}
      >
        <Img
          src={bgMapImage}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <svg
          width={baseWidth}
          height={baseHeight}
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          style={{ overflow: "visible", position: "relative", zIndex: 1 }}
        >
          <defs>
            {/* Arrowhead marker for military arrows */}
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e63946" stroke="black" strokeWidth={1} />
            </marker>

          </defs>

          {/* 4. Military Arrows */}
          {conquests.map((conquest, idx) => {
            if (!conquest.arrow) return null;
            
            // Draw arrow 15 frames before the takeover starts
            const arrowStartFrame = conquest.startFrame - 15;
            if (frame < arrowStartFrame) return null;

            const arrowProgress = interpolate(
              frame,
              [arrowStartFrame, conquest.startFrame],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const { startX, startY, endX, endY } = conquest.arrow;
            
            // Calculate current end point of the arrow path
            const currentEndX = startX + (endX - startX) * arrowProgress;
            const currentEndY = startY + (endY - startY) * arrowProgress;

            // Fade out the arrow after conquest begins
            const arrowOpacity = interpolate(
              frame,
              [conquest.startFrame, conquest.startFrame + 15],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (arrowOpacity <= 0) return null;

            return (
              <g key={`arrow-${idx}`} style={{ opacity: arrowOpacity }}>
                <path
                  d={`M ${startX} ${startY} L ${currentEndX} ${currentEndY}`}
                  stroke="#e63946"
                  strokeWidth={7}
                  strokeLinecap="round"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  style={{ filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.3))" }}
                />
              </g>
            );
          })}

          {/* 5. Country Labels */}
          {territories.map((territory) => {
            // Find if this country is conquered by the end of the timeline
            // (If so, we change label color if necessary, but typically standard black works)
            
            // Subtle pop-in for the text label
            return (
              <g key={`label-${territory.id}`}>
                {/* Thick text outline using svg duplicate stroke technique */}
                <text
                  x={territory.labelX}
                  y={territory.labelY}
                  fontSize={26}
                  fontWeight="bold"
                  fontFamily="Fredoka"
                  textAnchor="middle"
                  stroke="white"
                  strokeWidth={6}
                  strokeLinejoin="round"
                >
                  {territory.name.toUpperCase()}
                </text>
                <text
                  x={territory.labelX}
                  y={territory.labelY}
                  fontSize={26}
                  fontWeight="bold"
                  fontFamily="Fredoka"
                  textAnchor="middle"
                  fill="#1d3557"
                >
                  {territory.name.toUpperCase()}
                </text>
              </g>
            );
          })}
          {children}
        </svg>
      </div>
    </div>
  );
};
