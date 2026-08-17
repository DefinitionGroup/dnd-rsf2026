"use client";

import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { sanityLanguages } from "./lib/i18n";
import { apiVersion, dataset, studioProjectId } from "./sanity/env";
import { resolve } from "./sanity/presentation/resolve";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "aquarium",
  title: "The Aquarium Solution",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((t) => t.id !== "page"),
      {
        id: "page-by-language",
        title: "Landing page",
        schemaType: "page",
        parameters: [{ name: "language", type: "string" }],
        value: (params: { language?: string }) => ({ language: params?.language ?? "en" }),
      },
    ],
  },
  plugins: [
    presentationTool({
      resolve,
      previewUrl: { initial: "/en", previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    structureTool({ structure }),
    documentInternationalization({
      supportedLanguages: sanityLanguages,
      schemaTypes: ["page", "menu"],
      languageField: "language",
    }),
    internationalizedArray({
      languages: sanityLanguages,
      fieldTypes: ["string", "text", "richText"],
      buttonAddAll: true,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
