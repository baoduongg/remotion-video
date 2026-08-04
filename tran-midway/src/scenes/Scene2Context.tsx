import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";
import { shotTransform } from "../kenBurns";
import { Caption, SectionTitle } from "../TextOverlay";
import { PacificMap, usePacificProjection } from "../vox/PacificMap";
import { DrawOnPath } from "../vox/DrawOnPath";

const MAP_CENTER: [number, number] = [-170, 14];
const MAP_SCALE = 260;

const NODES = [
  {
    lat: 21.3469,
    lon: -157.8583,
    date: "07/12/1941",
    label: "Trân Châu Cảng",
    pop: 40,
    gold: false,
    image: "scene_2_pearl.png",
  },
  {
    lat: 35.6762,
    lon: 139.6503,
    date: "04/1942",
    label: "Không kích Doolittle",
    pop: 200,
    gold: false,
    image: "scene_2_doolittle.png",
  },
  {
    lat: -15,
    lon: 155,
    date: "05/1942",
    label: "Trận biển Coral",
    pop: 320,
    gold: false,
    image: "scene_2_coral.png",
  },
  {
    lat: 28.2072,
    lon: -177.3735,
    date: "06/1942",
    label: "Midway?",
    pop: 430,
    gold: true,
    image: "scene_2_midway.png",
  },
] as const;

export const Scene2Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const project = usePacificProjection(MAP_CENTER, MAP_SCALE);

  const transformBg = shotTransform(frame, [
    { from: 0, to: durationInFrames, scale: [1.05, 1.15], x: [-2, 2] },
  ]);

  const points = NODES.map((node) => project(node.lat, node.lon) ?? [0, 0]);
  const trackPath = `M${points.map(([x, y]) => `${x},${y}`).join(" L")}`;
  const lastPop = NODES[NODES.length - 1].pop;

  return (
    <AbsoluteFill
      name="Scene 2 - Context"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_02.mp3")} from={20} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: transformBg,
          transformOrigin: "center",
          opacity: 0.8,
        }}
      >
        <PacificMap center={MAP_CENTER} scale={MAP_SCALE} landColor="#1c2f45" strokeColor="#3a5470" />
      </div>
      <SectionTitle name="Section title">Sáu tháng trước Midway</SectionTitle>
      {/* Timeline connector following the real map route between events */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={trackPath} stroke="#16283d" strokeWidth={3} fill="none" />
        <DrawOnPath d={trackPath} from={0} to={lastPop + 20} stroke="#d4af37" strokeWidth={3} />
      </svg>
      {/* Circular Vignette Cards */}
      {NODES.map((node, i) => {
        const [x, y] = points[i];
        const scaleNode = interpolate(frame, [node.pop, node.pop + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.5)),
          output: "perceptual-scale",
        });

        return (
          <div
            key={node.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              scale: scaleNode,
            }}
          >
            <div
              style={{
                width: node.gold ? 160 : 220,
                height: node.gold ? 160 : 220,
                borderRadius: 999,
                border: `4px solid ${node.gold ? "#d4af37" : "#4ea1ff"}`,
                boxShadow: node.gold
                  ? "0 0 35px 12px rgba(212,175,55,0.45)"
                  : "0 0 20px 4px rgba(78,161,255,0.25)",
                overflow: "hidden",
                backgroundColor: "#070d16",
              }}
            >
              <Img
                src={staticFile(`images/${node.image}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        );
      })}
      {/* Labels */}
      {NODES.map((node, i) => {
        const [x, y] = points[i];
        return (
          <div
            key={`label-${node.label}`}
            style={{
              position: "absolute",
              left: x,
              top: y - 170,
              translate: "-50% 0%",
              textAlign: "center",
              width: 340,
            }}
          >
            <Interactive.Div
              name={`Date ${node.label}`}
              style={{
                color: node.gold ? "#d4af37" : "#f3f1e7",
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: 34,
                opacity: interpolate(frame, [node.pop, node.pop + 15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: "0px -53.1px",
              }}
            >
              {node.date}
            </Interactive.Div>
            <div
              style={{
                translate: "0px -53.1px",
                color: "#c7d2e0",
                fontFamily: bodyFont,
                fontSize: 26,
                opacity: interpolate(frame, [node.pop + 5, node.pop + 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}
      <Caption name="Context caption" from={480}>
        Sau đòn tập kích Trân Châu Cảng, Đô đốc Yamamoto quyết tâm nhử hạm đội
        tàu sân bay Mỹ ra khỏi nơi ẩn náu — và tiêu diệt nó tại Midway.
      </Caption>
    </AbsoluteFill>
  );
};
