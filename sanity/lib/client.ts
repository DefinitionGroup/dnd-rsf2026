import { createClient } from "next-sanity";
import { apiVersion, dataset, studioProjectId } from "@/sanity/env";

// Always constructed (createClient throws without a projectId, so the studio
// placeholder is used); loaders never call it unless isSanityConfigured.
export const client = createClient({
  projectId: studioProjectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: { studioUrl: "/studio" },
});
