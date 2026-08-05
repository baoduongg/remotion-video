import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily: headingFont } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
});

export const bodyFont = headingFont;
