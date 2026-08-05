import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Foundry } from "./scenes/Scene2Foundry";
import { Scene3Monopoly } from "./scenes/Scene3Monopoly";
import { Scene4Competitors } from "./scenes/Scene4Competitors";
import { Scene5Risks } from "./scenes/Scene5Risks";
import { Scene6Disruption } from "./scenes/Scene6Disruption";
import { Scene7Subsidies } from "./scenes/Scene7Subsidies";
import { Scene8Ecosystem } from "./scenes/Scene8Ecosystem";
import { Scene9Conclusion } from "./scenes/Scene9Conclusion";

export const TSMCVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={553} name="Scene1Hook">
        <Scene1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={455} name="Scene2Foundry">
        <Scene2Foundry />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={471} name="Scene3Monopoly">
        <Scene3Monopoly />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={354} name="Scene4Competitors">
        <Scene4Competitors />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={457} name="Scene5Risks">
        <Scene5Risks />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={325} name="Scene6Disruption">
        <Scene6Disruption />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={325} name="Scene7Subsidies">
        <Scene7Subsidies />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={354} name="Scene8Ecosystem">
        <Scene8Ecosystem />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={429} name="Scene9Conclusion">
        <Scene9Conclusion />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
