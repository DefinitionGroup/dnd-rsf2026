/**
 * Block component registry. Keep in sync with blocks/schemas.ts (typegen +
 * the `satisfies` below will complain when a schema has no component).
 */
import type { BlockComponent, BlockType } from "./types";
import HeroBlock from "./hero/Component";
import AnimatedHeadlineBlock from "./animated-headline/Component";
import IntroBlock from "./intro/Component";
import PortableTextBlock from "./portable-text/Component";
import FeatureListBlock from "./feature-list/Component";
import SplitContentBlock from "./split-content/Component";
import GalleryBlock from "./gallery/Component";
import ProductListBlock from "./product-list/Component";
import ProductViewerBlock from "./product-viewer/Component";
import BeforeAfterBlock from "./before-after/Component";
import FeatureTourBlock from "./feature-tour/Component";
import ComparisonTableBlock from "./comparison-table/Component";
import FaqSpecBlock from "./faq-spec/Component";
import TestimonialBlock from "./testimonial/Component";
import CtaBlock from "./cta/Component";
import ContactFormBlock from "./contact-form/Component";
import VideoBlock from "./video/Component";
import HowItWorksBlock from "./how-it-works/Component";
import ProductFinderBlock from "./product-finder/Component";
import StatStripBlock from "./stat-strip/Component";
import IndicatorLegendBlock from "./indicator-legend/Component";

export const blockComponents = {
  heroBlock: HeroBlock,
  animatedHeadlineBlock: AnimatedHeadlineBlock,
  introBlock: IntroBlock,
  portableTextBlock: PortableTextBlock,
  featureListBlock: FeatureListBlock,
  splitContentBlock: SplitContentBlock,
  galleryBlock: GalleryBlock,
  productListBlock: ProductListBlock,
  productViewerBlock: ProductViewerBlock,
  beforeAfterBlock: BeforeAfterBlock,
  featureTourBlock: FeatureTourBlock,
  comparisonTableBlock: ComparisonTableBlock,
  faqSpecBlock: FaqSpecBlock,
  testimonialBlock: TestimonialBlock,
  ctaBlock: CtaBlock,
  contactFormBlock: ContactFormBlock,
  videoBlock: VideoBlock,
  howItWorksBlock: HowItWorksBlock,
  productFinderBlock: ProductFinderBlock,
  statStripBlock: StatStripBlock,
  indicatorLegendBlock: IndicatorLegendBlock,
} satisfies { [K in BlockType]: BlockComponent<K> };
