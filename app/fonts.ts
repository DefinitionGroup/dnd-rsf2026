import { Open_Sans, Roboto_Condensed } from "next/font/google";

export const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const robotoCondensed = Roboto_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

export const fontClassNames = `${openSans.variable} ${robotoCondensed.variable}`;
