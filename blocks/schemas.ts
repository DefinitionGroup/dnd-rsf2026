/**
 * The ONLY list of page-builder blocks. Schema index, page content array,
 * PageBuilder registry, demo content and seed all derive from here.
 * Add a block: create blocks/<name>/{schema.ts,Component.tsx,demo.ts} and list it below.
 */
import { schema as heroBlock } from "./hero/schema";
import { schema as animatedHeadlineBlock } from "./animated-headline/schema";
import { schema as introBlock } from "./intro/schema";
import { schema as portableTextBlock } from "./portable-text/schema";
import { schema as featureListBlock } from "./feature-list/schema";
import { schema as splitContentBlock } from "./split-content/schema";
import { schema as galleryBlock } from "./gallery/schema";
import { schema as productListBlock } from "./product-list/schema";
import { schema as productViewerBlock } from "./product-viewer/schema";
import { schema as beforeAfterBlock } from "./before-after/schema";
import { schema as featureTourBlock } from "./feature-tour/schema";
import { schema as comparisonTableBlock } from "./comparison-table/schema";
import { schema as faqSpecBlock } from "./faq-spec/schema";
import { schema as testimonialBlock } from "./testimonial/schema";
import { schema as ctaBlock } from "./cta/schema";
import { schema as contactFormBlock } from "./contact-form/schema";

export const blockSchemas = [
  heroBlock,
  animatedHeadlineBlock,
  introBlock,
  portableTextBlock,
  featureListBlock,
  splitContentBlock,
  galleryBlock,
  productListBlock,
  productViewerBlock,
  beforeAfterBlock,
  featureTourBlock,
  comparisonTableBlock,
  faqSpecBlock,
  testimonialBlock,
  ctaBlock,
  contactFormBlock,
];

export const blockTypeNames = blockSchemas.map((s) => s.name);
export type BlockTypeName = (typeof blockSchemas)[number]["name"];
