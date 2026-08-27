/**
 * The ONLY list of page-builder blocks. Schema index, page content array,
 * PageBuilder registry, demo content and seed all derive from here.
 * Add a block: create blocks/<name>/{schema.ts,Component.tsx,demo.ts} and list it below.
 */
import { schema as heroBlock } from "./hero/schema";
import { schema as hero3dBlock } from "./hero-3d/schema";
import { schema as cinematicHeroBlock } from "./cinematic-hero/schema";
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
import { schema as specsBlock } from "./specs/schema";
import { schema as faqBlock } from "./faq/schema";
import { schema as testimonialBlock } from "./testimonial/schema";
import { schema as ctaBlock } from "./cta/schema";
import { schema as contactFormBlock } from "./contact-form/schema";
import { schema as videoBlock } from "./video/schema";
import { schema as howItWorksBlock } from "./how-it-works/schema";
import { schema as productFinderBlock } from "./product-finder/schema";
import { schema as statStripBlock } from "./stat-strip/schema";
import { schema as indicatorLegendBlock } from "./indicator-legend/schema";

export const blockSchemas = [
  heroBlock,
  hero3dBlock,
  cinematicHeroBlock,
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
  specsBlock,
  faqBlock,
  videoBlock,
  howItWorksBlock,
  productFinderBlock,
  statStripBlock,
  indicatorLegendBlock,
  testimonialBlock,
  ctaBlock,
  contactFormBlock,
];

export const blockTypeNames = blockSchemas.map((s) => s.name);
export type BlockTypeName = (typeof blockSchemas)[number]["name"];
