import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { beats } from "./data/beats";
import { sfxCues } from "./data/sfxCues";
import { Scene } from "./components/Scene";
import { KineticCaption } from "./components/KineticCaption";
import { palette } from "./theme";

export const WhyUsStateBorders: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.navy }}>
      {beats.map((beat) => (
        <Sequence
          key={beat.id}
          from={beat.startFrame}
          durationInFrames={beat.durationFrames}
          name={beat.id}
        >
          <Scene beat={beat} />
          <KineticCaption beat={beat} />
          <Audio src={staticFile(`audio/vo/${beat.id}.mp3`)} />
        </Sequence>
      ))}
      {sfxCues.map((cue, i) => (
        <Sequence
          key={`sfx-${i}`}
          from={cue.frame}
          durationInFrames={cue.durationFrames ?? 90}
          name={`sfx-${cue.type}-${cue.beatId}`}
          layout="none"
        >
          <Audio src={staticFile(cue.file)} volume={() => cue.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
