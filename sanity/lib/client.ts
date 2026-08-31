import { createClient } from "next-sanity";
import { apiVersion, dataset, studioProjectId } from "@/sanity/env";

// Always constructed (createClient throws without a projectId, so the studio
// placeholder is used); loaders never call it unless isSanityConfigured.
export const client = createClient({
  projectId: studioProjectId,
  dataset,
  apiVersion,
  // CDN in production only: in dev it adds a second stale layer on top of
  // Next's fetch cache, so a seed or Studio edit can serve old data for minutes.
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: { studioUrl: "/studio" },
});
