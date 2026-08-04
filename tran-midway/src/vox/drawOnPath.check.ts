// ponytail: manual sanity check (no test framework in this project).
// Run with: node src/vox/drawOnPath.check.ts
import { evolvePath, getLength } from "@remotion/paths";

const d = "M0,0 L100,0";
const length = getLength(d);

const start = evolvePath(0, d);
const end = evolvePath(1, d);

// evolvePath(0) uses 1.5x length to work around browser rounding issues
// See: https://github.com/remotion-dev/remotion/issues/3960
const extendedLength = length * 1.5;
if (Math.round(start.strokeDashoffset) !== Math.round(extendedLength)) {
  throw new Error(
    `Expected progress=0 to fully hide the path (dashoffset === ${extendedLength}), got ${start.strokeDashoffset}`,
  );
}
if (Math.round(end.strokeDashoffset) !== 0) {
  throw new Error(
    `Expected progress=1 to fully reveal the path (dashoffset === 0), got ${end.strokeDashoffset}`,
  );
}

console.log(
  `OK: evolvePath hides at progress=0 (offset ${start.strokeDashoffset}) and reveals at progress=1 (offset ${end.strokeDashoffset}), length=${length}.`,
);
