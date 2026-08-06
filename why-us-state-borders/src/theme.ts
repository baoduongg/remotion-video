import { loadFont } from "@remotion/google-fonts/Anton";

export const palette = {
  kraft: "#c8a876",
  cream: "#f5ecd9",
  terracotta: "#c0453a",
  navy: "#1b2a4a",
  mustard: "#e0a831",
};

const { fontFamily: antonFontFamily } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin", "vietnamese"],
});

export const fontFamily = antonFontFamily;
