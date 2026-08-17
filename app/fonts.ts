import { Inter } from "next/font/google";

/**
 * Apple architecture: SF Pro renders natively on Apple devices via the system
 * stack (-apple-system / BlinkMacSystemFont). Inter is the documented fallback
 * for every other platform. No display face is shipped separately.
 */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const fontClassNames = inter.variable;
