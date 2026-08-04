import { Composition, Folder } from "remotion";
import "./index.css";
import { TranMidway } from "./TranMidway";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Context } from "./scenes/Scene2Context";
import { Scene3Codebreaking } from "./scenes/Scene3Codebreaking";
import { Scene4FirstStrike } from "./scenes/Scene4FirstStrike";
import { Scene5TurningPoint } from "./scenes/Scene5TurningPoint";
import { Scene6Yorktown } from "./scenes/Scene6Yorktown";
import { Scene7Aftermath } from "./scenes/Scene7Aftermath";
import { Scene8Outro } from "./scenes/Scene8Outro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="TranMidway-Scenes">
        <Composition
          id="Scene1Hook"
          component={Scene1Hook}
          durationInFrames={420}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2Context"
          component={Scene2Context}
          durationInFrames={630}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3Codebreaking"
          component={Scene3Codebreaking}
          durationInFrames={850}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene4FirstStrike"
          component={Scene4FirstStrike}
          durationInFrames={750}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene5TurningPoint"
          component={Scene5TurningPoint}
          durationInFrames={700}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene6Yorktown"
          component={Scene6Yorktown}
          durationInFrames={630}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene7Aftermath"
          component={Scene7Aftermath}
          durationInFrames={620}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene8Outro"
          component={Scene8Outro}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="TranMidway"
        component={TranMidway}
        durationInFrames={4820}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
