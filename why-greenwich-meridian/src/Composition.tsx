import { AbsoluteFill, Audio, Composition, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Sequence, Img } from "remotion";
import React from "react";
import voiceoverVi from "../voiceover.json";
import voiceoverEn from "../voiceover-en.json";
import voManifestViRaw from "../public/audio/vo/manifest.json";
import voManifestEnRaw from "../public/audio/vo/en/manifest.json";

// Type definitions
interface VoiceoverLine {
  id: string;
  text: string;
  voice: string;
}

interface ManifestEntry {
  durationSec: number;
  durationInFrames: number;
}

const voManifestVi = voManifestViRaw as Record<string, ManifestEntry>;
const voManifestEn = voManifestEnRaw as Record<string, ManifestEntry>;

// Helper to get scenes with timing based on language
export const getScenesWithTiming = (lang: "vi" | "en") => {
  const voiceover = lang === "en" ? voiceoverEn : voiceoverVi;
  const manifest = lang === "en" ? voManifestEn : voManifestVi;
  
  let cumulativeFrames = 0;
  return voiceover.map((line: VoiceoverLine) => {
    const durationInFrames = manifest[line.id]?.durationInFrames || 120;
    const startFrame = cumulativeFrames;
    cumulativeFrames += durationInFrames;
    return {
      ...line,
      startFrame,
      durationInFrames,
    };
  });
};

export const getTotalDuration = (lang: "vi" | "en") => {
  const scenes = getScenesWithTiming(lang);
  if (scenes.length === 0) return 0;
  const lastScene = scenes[scenes.length - 1];
  return lastScene.startFrame + lastScene.durationInFrames;
};

const totalDurationVi = getTotalDuration("vi");
const totalDurationEn = getTotalDuration("en");

const sceneConfig: Record<string, { motion: string; textSafe: string; sfx?: string }> = {
  vo_01: { motion: "slow zoom-in", textSafe: "lower third", sfx: "whoosh" },
  vo_02: { motion: "static hold", textSafe: "upper third" },
  vo_03: { motion: "pan left-to-right", textSafe: "lower third" },
  vo_04: { motion: "static hold", textSafe: "lower third" },
  vo_05: { motion: "slow zoom-in", textSafe: "lower third", sfx: "whoosh" },
  vo_06: { motion: "slide-up", textSafe: "lower third" },
  vo_07: { motion: "pan down-to-up", textSafe: "lower third" },
  vo_08: { motion: "static hold", textSafe: "lower third" },
  vo_09: { motion: "static hold", textSafe: "lower third" },
  vo_10: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_11: { motion: "pan left-to-right", textSafe: "lower third", sfx: "whoosh" },
  vo_12: { motion: "static hold", textSafe: "lower third" },
  vo_13: { motion: "static hold", textSafe: "lower third" },
  vo_14: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_15: { motion: "fade-scale", textSafe: "lower third" },
  vo_16: { motion: "static hold", textSafe: "lower third" },
  vo_17: { motion: "pan down-to-up", textSafe: "lower third", sfx: "whoosh" },
  vo_18: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_19: { motion: "pan left-to-right", textSafe: "lower third", sfx: "whoosh" },
  vo_20: { motion: "static hold", textSafe: "lower third" },
  vo_21: { motion: "static hold", textSafe: "lower third" },
  vo_22: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_23: { motion: "static hold", textSafe: "lower third" },
  vo_24: { motion: "static hold", textSafe: "lower third" },
  vo_25: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_26: { motion: "pan left-to-right", textSafe: "lower third", sfx: "whoosh" },
  vo_27: { motion: "static hold", textSafe: "lower third" },
  vo_28: { motion: "static hold", textSafe: "lower third" },
  vo_29: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_30: { motion: "pan left-to-right", textSafe: "lower third", sfx: "whoosh" },
  vo_31: { motion: "static hold", textSafe: "lower third" },
  vo_32: { motion: "slow zoom-in", textSafe: "lower third" },
  vo_33: { motion: "static hold", textSafe: "lower third" },
  vo_34: { motion: "static hold", textSafe: "lower third" },
};

const Scene: React.FC<{
  id: string;
  text: string;
  durationInFrames: number;
  motion: string;
  textSafe: string;
  sfx?: string;
  lang: "vi" | "en";
}> = ({ id, text, durationInFrames, motion, textSafe, sfx, lang }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Calculate motion style
  let transformStyle = "";
  if (motion === "slow zoom-in") {
    const scale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
      extrapolateRight: "clamp",
    });
    transformStyle = `scale(${scale})`;
  } else if (motion === "pan left-to-right") {
    const translateX = interpolate(frame, [0, durationInFrames], [-30, 30], {
      extrapolateRight: "clamp",
    });
    transformStyle = `translateX(${translateX}px) scale(1.06)`;
  } else if (motion === "pan down-to-up") {
    const translateY = interpolate(frame, [0, durationInFrames], [30, -30], {
      extrapolateRight: "clamp",
    });
    transformStyle = `translateY(${translateY}px) scale(1.06)`;
  } else if (motion === "slide-up") {
    const translateY = interpolate(frame, [0, 15], [height, 0], {
      extrapolateRight: "clamp",
    });
    transformStyle = `translateY(${translateY}px)`;
  } else if (motion === "fade-scale") {
    const scale = interpolate(frame, [0, 15], [0.8, 1], {
      extrapolateRight: "clamp",
    });
    transformStyle = `scale(${scale})`;
  }

  // Text transition using spring
  const textSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const textTranslateY = interpolate(textSpring, [0, 1], [20, 0]);

  // Position settings
  const textPositionStyle: React.CSSProperties = {
    position: "absolute",
    left: "5%",
    right: "5%",
    display: "flex",
    justifyContent: "center",
    ...(textSafe === "upper third" ? { top: "10%" } : { bottom: "8%" }),
  };

  // Color Palette Constants
  const navyColor = "#0b1b3d";
  const creamColor = "#f9f6f0";

  return (
    <AbsoluteFill style={{ backgroundColor: navyColor, overflow: "hidden" }}>
      {/* Background Plate Image with Animating Transform */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: transformStyle,
          transformOrigin: "center center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile(`images/scene-${id}.png`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt={`Scene ${id}`}
        />
      </div>

      {/* Voiceover Voice */}
      <Audio src={staticFile(lang === "en" ? `audio/vo/en/${id}.mp3` : `audio/vo/${id}.mp3`)} />

      {/* Ambient/Tension SFX whoosh */}
      {sfx === "whoosh" && (
        <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.25} />
      )}

      {/* Editorial Vox Typography Overlaid */}
      <div
        style={{
          ...textPositionStyle,
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        <span
          style={{
            backgroundColor: creamColor,
            color: navyColor,
            fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif, system-ui",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: "bold",
            fontSize: "2rem",
            padding: "10px 24px",
            borderRadius: "0px", // Flat box editorial look
            boxShadow: "8px 8px 0px rgba(11, 27, 61, 0.8)",
            textAlign: "center",
            maxWidth: "85%",
            lineHeight: "1.3",
            border: `3px solid ${navyColor}`,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const MyComponent: React.FC<{ lang: "vi" | "en" }> = ({ lang }) => {
  const scenesWithTiming = getScenesWithTiming(lang);
  return (
    <AbsoluteFill>
      {scenesWithTiming.map((scene) => {
        const config = sceneConfig[scene.id] || { motion: "static hold", textSafe: "lower third" };
        return (
          <React.Fragment key={scene.id}>
            <Sequence
              from={scene.startFrame}
              durationInFrames={scene.durationInFrames}
            >
              <Scene
                id={scene.id}
                text={scene.text}
                durationInFrames={scene.durationInFrames}
                motion={config.motion}
                textSafe={config.textSafe}
                sfx={config.sfx}
                lang={lang}
              />
            </Sequence>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export const MyComponentVi: React.FC = () => {
  return <MyComponent lang="vi" />;
};

export const MyComponentEn: React.FC = () => {
  return <MyComponent lang="en" />;
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponentVi}
      durationInFrames={totalDurationVi}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

export const MyCompositionEn: React.FC = () => {
  return (
    <Composition
      id="WhyGreenwichMeridian-EN"
      component={MyComponentEn}
      durationInFrames={totalDurationEn}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
