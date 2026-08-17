import { fontClassNames } from "@/app/fonts";
import { baseMetadata } from "@/lib/page-metadata";
import "../globals.css";

export const metadata = baseMetadata;

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassNames}>
      <body>{children}</body>
    </html>
  );
}
