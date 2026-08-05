import { Composition, Folder } from "remotion";
import "./index.css";
import { TSMCVideo } from "./TSMCVideo";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Foundry } from "./scenes/Scene2Foundry";
import { Scene3Monopoly } from "./scenes/Scene3Monopoly";
import { Scene4Competitors } from "./scenes/Scene4Competitors";
import { Scene5Risks } from "./scenes/Scene5Risks";
import { Scene6Disruption } from "./scenes/Scene6Disruption";
import { Scene7Subsidies } from "./scenes/Scene7Subsidies";
import { Scene8Ecosystem } from "./scenes/Scene8Ecosystem";
import { Scene9Conclusion } from "./scenes/Scene9Conclusion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="TSMC-Scenes">
        <Composition
          id="Scene1Hook"
          component={Scene1Hook}
          durationInFrames={553}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2Foundry"
          component={Scene2Foundry}
          durationInFrames={455}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3Monopoly"
          component={Scene3Monopoly}
          durationInFrames={471}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene4Competitors"
          component={Scene4Competitors}
          durationInFrames={354}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene5Risks"
          component={Scene5Risks}
          durationInFrames={457}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene6Disruption"
          component={Scene6Disruption}
          durationInFrames={325}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene7Subsidies"
          component={Scene7Subsidies}
          durationInFrames={325}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene8Ecosystem"
          component={Scene8Ecosystem}
          durationInFrames={354}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene9Conclusion"
          component={Scene9Conclusion}
          durationInFrames={429}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="TSMCVideo"
        component={TSMCVideo}
        durationInFrames={3563} // 3723 total sequence frames - 160 transition frames (8 * 20)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
