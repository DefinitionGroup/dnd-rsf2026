import { defineCliConfig } from "sanity/cli";
import { dataset, studioProjectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId: studioProjectId, dataset },
  typegen: {
    path: [
      "./app/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./blocks/**/*.{ts,tsx}",
      "./sanity/**/*.{ts,tsx}",
      "./lib/**/*.{ts,tsx}",
      "./content/**/*.ts",
    ],
    schema: "./schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
