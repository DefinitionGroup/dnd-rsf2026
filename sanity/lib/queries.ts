import { defineQuery } from "next-sanity";

/* ---------- reusable fragments ---------- */

const imageFragment = /* groq */ `{
  ...,
  asset->{ _id, url, "lqip": metadata.lqip, "dimensions": metadata.dimensions }
}`;

const captionedImageFragment = /* groq */ `{ _key, alt, caption, image ${imageFragment} }`;

/** Product fields resolved to the requested $locale with `en` fallback. */
export const productFragment = /* groq */ `{
  _id,
  "slug": slug.current,
  "name": coalesce(name[language == $locale][0].value, name[language == "en"][0].value),
  "tagline": coalesce(tagline[language == $locale][0].value, tagline[language == "en"][0].value),
  "body": coalesce(body[language == $locale][0].value, body[language == "en"][0].value),
  category,
  sku,
  image ${imageFragment},
  imageAlt,
  gallery[] ${captionedImageFragment},
  "specs": specs[]{
    _key,
    "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
    value,
    unit
  },
  legacyUrl,
  manualUrl,
  videoUrl
}`;

const pageContentFragment = /* groq */ `content[]{
  ...,
  _type == "heroBlock" => {
    ...,
    image ${imageFragment},
    video{ asset->{ _id, url, mimeType } }
  },
  _type == "splitContentBlock" => { ..., image ${imageFragment} },
  _type == "galleryBlock" => { ..., images[] ${captionedImageFragment} },
  _type == "productListBlock" => {
    ...,
    items[]{ _key, link, product-> ${productFragment} }
  },
  _type == "productViewerBlock" => {
    ...,
    frames[] ${imageFragment},
    product-> ${productFragment}
  },
  _type == "beforeAfterBlock" => { ..., before ${imageFragment}, after ${imageFragment} },
  _type == "featureTourBlock" => { ..., steps[]{ ..., image ${imageFragment} } },
  _type == "comparisonTableBlock" => { ..., columns[]{ ..., product-> ${productFragment} } },
  _type == "faqSpecBlock" => { ..., product-> ${productFragment} },
  _type == "videoBlock" => { ..., file{ asset->{ _id, url, mimeType } }, poster ${imageFragment} },
  _type == "howItWorksBlock" => { ..., steps[]{ ..., image ${imageFragment} } },
  _type == "productFinderBlock" => { ..., rules[]{ ..., product->{ _id, "slug": slug.current, "name": coalesce(name[language == $locale][0].value, name[language == "en"][0].value), image ${imageFragment} } } },
  _type == "testimonialBlock" => {
    ...,
    "testimonials": testimonials[@->approved == true]->{ _id, quote, name, role, company }
  }
}`;

const pageProjection = /* groq */ `{
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  language,
  isHomepage,
  navbarVariant,
  metadata{ ..., image ${imageFragment} },
  product-> ${productFragment},
  "groupId": *[_type == "translation.metadata" && references(^._id)][0]._id,
  "translations": *[_type == "translation.metadata" && references(^._id)][0]
    .translations[defined(value)]{ language, "slug": value->slug.current, "isHomepage": value->isHomepage },
  ${pageContentFragment}
}`;

/* ---------- pages ---------- */

export const HOME_PAGE_QUERY = defineQuery(
  `*[_type == "page" && language == $locale && isHomepage == true][0]${pageProjection}`,
);

/** Locale page by localized slug, falling back to the `en` document with the same slug. */
export const PAGE_BY_SLUG_QUERY = defineQuery(
  `coalesce(
    *[_type == "page" && language == $locale && slug.current == $slug][0],
    *[_type == "page" && language == "en" && slug.current == $slug][0]
  )${pageProjection}`,
);

export const PAGE_ROUTES_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)] | order(language asc, slug.current asc){
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    language,
    isHomepage,
    "groupId": *[_type == "translation.metadata" && references(^._id)][0]._id
  }`,
);

/* ---------- shell ---------- */

export const SITE_SHELL_QUERY = defineQuery(
  `{
    "settings": *[_type == "siteSettings"][0]{
      _id,
      brandName,
      "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
      email,
      phone,
      legacySiteUrl,
      dealerLocatorUrl,
      socialLinks,
      defaultMetadata{ ..., image ${imageFragment} }
    },
    "menu": coalesce(
      *[_type == "menu" && language == $locale][0],
      *[_type == "menu" && language == "en"][0]
    ){ _id, language, items, cta, footerLinks }
  }`,
);

/* ---------- products ---------- */

export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"] | order(category asc) ${productFragment}`);
