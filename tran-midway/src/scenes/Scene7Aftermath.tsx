import {
  AbsoluteFill,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { headingFont, bodyFont } from "../fonts";

const MAX_BAR = 600;

const ROWS = [
  {
    label: "Tàu sân bay",
    japan: 4,
    us: 1,
    max: 4,
    japanText: "4",
    usText: "1",
    grow: 70,
  },
  {
    label: "Người thiệt mạng",
    japan: 3057,
    us: 307,
    max: 3057,
    japanText: "~3.057",
    usText: "~307",
    grow: 170,
  },
  {
    label: "Máy bay",
    japan: 248,
    us: 150,
    max: 248,
    japanText: "~248",
    usText: "~150",
    grow: 270,
  },
];

const ROW_Y = [280, 480, 680];

export const Scene7Aftermath: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Scene 7 - Aftermath"
      style={{ backgroundColor: "#070d16" }}
    >
      <Audio src={staticFile("audio/vo/vo_07.mp3")} from={30} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 90,
          translate: "-50% 0%",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Aftermath title"
          style={{
            color: "#f3f1e7",
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 56,
            letterSpacing: 4,
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          TỔN THẤT
        </Interactive.Div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 165,
          translate: "-50% 0%",
          display: "flex",
          gap: 500,
          color: "#7d90a8",
          fontFamily: bodyFont,
          fontSize: 24,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#e0483e" }}>Nhật Bản</span>
        <span style={{ color: "#4ea1ff" }}>Hoa Kỳ</span>
      </div>

      {ROWS.map((row, rowIndex) => {
        const japanWidth = interpolate(
          frame,
          [row.grow, row.grow + 60],
          [0, (row.japan / row.max) * MAX_BAR],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const usWidth = interpolate(
          frame,
          [row.grow, row.grow + 60],
          [0, (row.us / row.max) * MAX_BAR],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const labelOpacity = interpolate(
          frame,
          [row.grow - 10, row.grow + 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={row.label}
            style={{
              position: "absolute",
              left: "50%",
              top: ROW_Y[rowIndex],
              translate: "-50% 0%",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#f3f1e7",
                fontFamily: bodyFont,
                fontSize: 26,
                marginBottom: 10,
                opacity: labelOpacity,
              }}
            >
              {row.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", height: 40 }}>
              <div
                style={{
                  width: MAX_BAR,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: japanWidth,
                    height: 34,
                    backgroundColor: "#e0483e",
                    borderRadius: "6px 0 0 6px",
                  }}
                />
                <div
                  style={{
                    marginLeft: 12,
                    color: "#e6b3ae",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                  }}
                >
                  {row.japanText}
                </div>
              </div>
              <div style={{ width: 40 }} />
              <div style={{ width: MAX_BAR, display: "flex" }}>
                <div
                  style={{
                    marginRight: 12,
                    color: "#bcd9ff",
                    fontFamily: bodyFont,
                    fontSize: 24,
                    opacity: labelOpacity,
                    minWidth: 100,
                    textAlign: "right",
                  }}
                >
                  {row.usText}
                </div>
                <div
                  style={{
                    width: usWidth,
                    height: 34,
                    backgroundColor: "#4ea1ff",
                    borderRadius: "0 6px 6px 0",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: 100,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Aftermath caption"
          style={{
            color: "#f3f1e7",
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 36,
            lineHeight: 1.4,
            opacity: interpolate(
              frame,
              [400, 440, durationInFrames - 30, durationInFrames],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          Chỉ trong vài ngày, thế cân bằng lực lượng ở Thái Bình Dương đảo
          chiều — và không bao giờ quay lại như cũ.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
