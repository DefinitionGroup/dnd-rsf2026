import type { StructureResolver } from "sanity/structure";
import { LOCALES } from "@/lib/i18n";

const singletonTypes = new Set(["siteSettings"]);
const handled = new Set(["page", "product", "testimonial", "menu", "siteSettings", "translation.metadata"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("The Aquarium Solution")
    .items([
      S.listItem()
        .title("Landing pages")
        .child(
          S.list()
            .title("Landing pages")
            .items([
              S.documentTypeListItem("page").title("All pages"),
              S.divider(),
              ...LOCALES.map((locale) =>
                S.listItem()
                  .title(locale.title)
                  .id(`pages-${locale.id}`)
                  .child(
                    S.documentList()
                      .title(`${locale.title} pages`)
                      .schemaType("page")
                      .filter('_type == "page" && language == $language')
                      .params({ language: locale.id })
                      .initialValueTemplates([S.initialValueTemplateItem("page-by-language", { language: locale.id })]),
                  ),
              ),
            ]),
        ),
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      S.documentTypeListItem("menu").title("Navigation"),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() || "") && !handled.has(item.getId() || ""),
      ),
    ]);
