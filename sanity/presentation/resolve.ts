import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/** URL ↔ document mapping for the Presentation tool (must stay in sync with app/(site)/[locale] routes). */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/:locale", filter: `_type == "page" && language == $locale && isHomepage == true` },
    { route: "/:locale/:slug", filter: `_type == "page" && language == $locale && slug.current == $slug` },
  ]),
  locations: {
    page: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language", isHomepage: "isHomepage" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.isHomepage ? `/${doc?.language}` : `/${doc?.language}/${doc?.slug}`,
          },
        ],
      }),
    }),
    product: defineLocations({
      select: { name: "name" },
      message: "Products appear inside landing pages via product blocks.",
      tone: "positive",
    }),
    siteSettings: defineLocations({ message: "Site settings apply to every page.", tone: "caution" }),
    menu: defineLocations({ message: "Navigation applies to every page of this language.", tone: "caution" }),
  },
};
