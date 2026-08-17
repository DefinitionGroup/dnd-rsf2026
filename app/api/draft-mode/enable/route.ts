import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";

const handler = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});

export const GET = isSanityConfigured
  ? handler.GET
  : async () => new Response("Sanity is not configured; draft mode unavailable.", { status: 404 });
