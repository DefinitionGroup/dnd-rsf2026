import { Archivo } from "next/font/google";

/**
 * One family for the whole system. Archivo's width axis gives us a narrow,
 * heavy voice for measurements (.figure) and the normal width for everything
 * else — a nod to the brand's condensed heritage without a second face.
 */
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const fontClassNames = archivo.variable;
