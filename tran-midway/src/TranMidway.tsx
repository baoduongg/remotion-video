import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Context } from "./scenes/Scene2Context";
import { Scene3Codebreaking } from "./scenes/Scene3Codebreaking";
import { Scene4FirstStrike } from "./scenes/Scene4FirstStrike";
import { Scene5TurningPoint } from "./scenes/Scene5TurningPoint";
import { Scene6Yorktown } from "./scenes/Scene6Yorktown";
import { Scene7Aftermath } from "./scenes/Scene7Aftermath";
import { Scene8Outro } from "./scenes/Scene8Outro";

export const TranMidway: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={420} name="Scene1Hook">
        <Scene1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={630} name="Scene2Context">
        <Scene2Context />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={850} name="Scene3Codebreaking">
        <Scene3Codebreaking />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={750} name="Scene4FirstStrike">
        <Scene4FirstStrike />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={700} name="Scene5TurningPoint">
        <Scene5TurningPoint />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={630} name="Scene6Yorktown">
        <Scene6Yorktown />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={620} name="Scene7Aftermath">
        <Scene7Aftermath />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={360} name="Scene8Outro">
        <Scene8Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
