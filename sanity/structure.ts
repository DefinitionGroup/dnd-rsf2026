import type { StructureResolver } from "sanity/structure";
import { LOCALES } from "@/lib/i18n";
import { isStudioAdmin } from "./env";

const singletonTypes = new Set(["siteSettings"]);
const handled = new Set(["page", "product", "testimonial", "menu", "siteSettings", "translation.metadata"]);

/** Pages flagged `adminOnly` are listed only for Studio admins (NEXT_PUBLIC_SANITY_ADMIN_EMAILS). */
const ADMIN_FILTER = "adminOnly == true";
const EDITOR_FILTER = "adminOnly != true";

export const structure: StructureResolver = (S, { currentUser }) => {
  const admin = isStudioAdmin(currentUser);
  const visible = admin ? "" : ` && ${EDITOR_FILTER}`;
  const pageTemplates = LOCALES.map((locale) =>
    S.initialValueTemplateItem("page-by-language", { language: locale.id }),
  );

  return S.list()
    .title("The Aquarium Solution")
    .items([
      S.listItem()
        .title("Landing pages")
        .child(
          S.list()
            .title("Landing pages")
            .items([
              S.listItem()
                .title("All pages")
                .id("pages-all")
                .child(
                  S.documentList()
                    .title("All pages")
                    .schemaType("page")
                    .filter(`_type == "page"${visible}`)
                    .initialValueTemplates(pageTemplates),
                ),
              ...(admin
                ? [
                    S.listItem()
                      .title("Admin pages")
                      .id("pages-admin")
                      .child(
                        S.documentList()
                          .title("Admin pages")
                          .schemaType("page")
                          .filter(`_type == "page" && ${ADMIN_FILTER}`)
                          .initialValueTemplates(pageTemplates),
                      ),
                  ]
                : []),
              S.divider(),
              ...LOCALES.map((locale) =>
                S.listItem()
                  .title(locale.title)
                  .id(`pages-${locale.id}`)
                  .child(
                    S.documentList()
                      .title(`${locale.title} pages`)
                      .schemaType("page")
                      .filter(`_type == "page" && language == $language${visible}`)
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
};
