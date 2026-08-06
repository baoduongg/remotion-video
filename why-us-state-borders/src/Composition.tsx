import { Composition } from "remotion";
import { WhyUsStateBorders } from "./WhyUsStateBorders";
import { TOTAL_FRAMES } from "./data/beats";

export const MyComposition = () => {
  return (
    <Composition
      id="WhyUsStateBorders"
      component={WhyUsStateBorders}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
