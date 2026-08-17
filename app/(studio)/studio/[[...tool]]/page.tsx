import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <p className="label mb-3">Studio prepared</p>
        <h1 className="text-3xl">Connect the Sanity project to mount the Studio.</h1>
        <p className="mt-4 text-muted">
          Copy <code>.env.example</code> to <code>.env.local</code> and set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> /
          <code>NEXT_PUBLIC_SANITY_DATASET</code>. Until then the site runs from <code>content/demo.ts</code>.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
