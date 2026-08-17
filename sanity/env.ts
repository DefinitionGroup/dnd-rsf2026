export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-14";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

/** True when the site should talk to Sanity; false → demo mode from content/demo.ts */
export const isSanityConfigured = Boolean(projectId && dataset);

// Sanity validates config during bundling. This valid-looking fallback is only
// used to compile the disconnected Studio shell and the client instance; nothing
// fetches with it unless isSanityConfigured is true.
export const studioProjectId = projectId || "abcdefgh";
