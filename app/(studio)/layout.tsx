import type { Metadata } from "next";
import { preloadModule } from "react-dom";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import "../globals.css";

// Lets the Sanity Dashboard embed and talk to this studio
// https://www.sanity.io/docs/dashboard/dashboard-configure
const bridgeScript = "https://core.sanity-cdn.com/bridge.js";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: `Content Studio | ${SITE_NAME}`,
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  preloadModule(bridgeScript, { as: "script" });
  return (
    <html lang="en">
      <body>
        <script src={bridgeScript} async type="module" />
        {children}
      </body>
    </html>
  );
}
