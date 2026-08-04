import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { OverSimplifiedVideo } from "./remotion/OverSimplifiedVideo";
import { WarOfTheBucketVideo } from "./remotion/WarOfTheBucketVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="OverSimplifiedHorizontal"
        component={OverSimplifiedVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="OverSimplifiedVertical"
        component={OverSimplifiedVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WarOfTheBucketHorizontal"
        component={WarOfTheBucketVideo}
        durationInFrames={3000}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WarOfTheBucketVertical"
        component={WarOfTheBucketVideo}
        durationInFrames={3000}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
