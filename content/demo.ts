/**
 * Demo content — used ONLY when Sanity is not configured (see sanity/lib/loaders.ts).
 * Shapes mirror the GROQ query results so components never special-case demo data.
 * `en` is authored; other locales fall back to the en pages (as the live site does
 * before translations exist).
 */
import type { PageDocument, SiteShell } from "@/blocks/types";
import type { Locale } from "@/lib/i18n";
import type { PageRoute } from "@/lib/translations";
import { heroDemo } from "@/blocks/hero/demo";
import { animatedHeadlineDemo } from "@/blocks/animated-headline/demo";
import { introDemo } from "@/blocks/intro/demo";
import { portableTextDemo } from "@/blocks/portable-text/demo";
import { featureListDemo } from "@/blocks/feature-list/demo";
import { splitContentDemo } from "@/blocks/split-content/demo";
import { galleryDemo } from "@/blocks/gallery/demo";
import { productListDemo } from "@/blocks/product-list/demo";
import { productViewerDemo } from "@/blocks/product-viewer/demo";
import { beforeAfterDemo } from "@/blocks/before-after/demo";
import { featureTourDemo } from "@/blocks/feature-tour/demo";
import { comparisonTableDemo } from "@/blocks/comparison-table/demo";
import { faqSpecDemo } from "@/blocks/faq-spec/demo";
import { testimonialDemo } from "@/blocks/testimonial/demo";
import { ctaDemo } from "@/blocks/cta/demo";
import { contactFormDemo } from "@/blocks/contact-form/demo";
import { img, link } from "./demo-helpers";
import { funktionPump, khManager, spektrum150 } from "./demo-products";

const STOCKISTS = "https://www.theaquariumsolution.com/stockists";

function page(input: {
  id: string;
  title: string;
  slug: string;
  isHomepage?: boolean;
  navbarVariant?: "light" | "dark";
  metadata: { title: string; description: string; image?: string };
  product?: PageDocument["product"];
  content: NonNullable<PageDocument["content"]>;
}): PageDocument {
  return {
    _id: `demo-page-en-${input.id}`,
    _updatedAt: "2026-08-17T00:00:00Z",
    title: input.title,
    slug: input.slug,
    language: "en",
    isHomepage: input.isHomepage ?? false,
    navbarVariant: input.navbarVariant ?? "light",
    metadata: {
      _type: "metadata",
      title: input.metadata.title,
      description: input.metadata.description,
      image: img(input.metadata.image ?? "og-default.jpg", { width: 1200, height: 630 }),
    },
    product: input.product ?? null,
    groupId: `demo-group-${input.id}`,
    translations: null,
    content: input.content,
  };
}

/* ---------------------------------------------------------------- pages */

const home = page({
  id: "home",
  title: "Home",
  slug: "home",
  isHomepage: true,
  metadata: {
    title: "The Aquarium Solution | Reef equipment by D-D",
    description: "Lighting, pumps and water chemistry engineered for reef aquariums. Discover Spektrum, Funktion and KH Manager.",
    image: "hero-reef.jpg",
  },
  content: [
    heroDemo({
      brand: "D-D The Aquarium Solution",
      headline: "Equipment that lets the reef\ndo the talking.",
      summary: "Full-spectrum lighting, silent DC pumps and automatic alkalinity control — designed by reef keepers, built for the long run.",
      image: "hero-reef.jpg",
      imageAlt: "A thriving reef aquarium lit by Spektrum LEDs",
      primaryCta: { label: "Explore products", href: "#products" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    introDemo({
      eyebrow: "Why D-D",
      headline: "Thirty years of listening to reef keepers, distilled into three product lines.",
      body: ["Every product on this site started as a problem in somebody's tank. We build the add-on that solves it, test it on our own systems, and only then put it in a box."],
    }),
    productListDemo({
      eyebrow: "Products",
      headline: "Choose your upgrade.",
      intro: "Three landing pages, three ways to make a reef more stable, more colourful and quieter.",
      items: [
        { product: spektrum150, link: { label: "Spektrum 150", href: "/en/spektrum-150" } },
        { product: funktionPump, link: { label: "Funktion Return Pump", href: "/en/funktion-return-pump" } },
        { product: khManager, link: { label: "KH Manager", href: "/en/kh-manager" } },
      ],
    }),
    comparisonTableDemo({ eyebrow: "At a glance", headline: "Which one first?", intro: "All three play together; here is how they differ." }),
    testimonialDemo({
      eyebrow: "Reef keepers say",
      headline: "Trusted on tanks from 60 to 6,000 litres.",
      testimonials: [
        { quote: "The Spektrum turned my sad brown acros into something I actually want to photograph.", name: "Marek K.", role: "SPS keeper", company: "Gdańsk" },
        { quote: "I forgot the return pump was on. That is the review.", name: "Claire D.", role: "Reef hobbyist", company: "Lyon" },
        { quote: "KH Manager caught a swing at 3 a.m. and dosed before I woke up. Corals never noticed.", name: "Yuki T.", role: "Store owner", company: "Osaka" },
      ],
    }),
    ctaDemo({
      eyebrow: "Ready?",
      headline: "Talk to us or find a dealer near you.",
      body: "We ship through specialist aquarium retailers worldwide.",
      primaryCta: { label: "Find a stockist", href: STOCKISTS },
      secondaryCta: { label: "Contact us", href: "/en/contact" },
      tone: "ink",
    }),
  ],
});

const spektrumPage = page({
  id: "spektrum-150",
  title: "Spektrum 150",
  slug: "spektrum-150",
  product: spektrum150,
  metadata: {
    title: "Spektrum 150 reef LED | The Aquarium Solution",
    description: "Eight-colour full-spectrum reef LED with silent passive cooling and programmable schedules. See it in 360°.",
    image: "spektrum-150-mounted.jpg",
  },
  content: [
    heroDemo({
      brand: "Spektrum · Lighting",
      headline: "Colour corals\nwere made for.",
      summary: "Spektrum 150 blends eight LED colours through a single optic — true fluorescence, no disco, no hot spots.",
      image: "spektrum-150-mounted.jpg",
      imageAlt: "Spektrum 150 mounted above a reef tank",
      primaryCta: { label: "See it in 360°", href: "#viewer" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    productViewerDemo({ eyebrow: "360° view", headline: "Every angle. Every lens.", intro: "Drag to rotate, scroll or pinch to zoom into the optic.", alt: "Spektrum 150 reef LED rotating through 360 degrees" }),
    featureTourDemo({ eyebrow: "Feature tour", headline: "What 150 watts of intent looks like.", intro: "Scroll to walk through the light." }),
    beforeAfterDemo({
      eyebrow: "Before / after",
      headline: "Same tank. Same corals. New light.",
      intro: "Slide to compare a standard white LED with Spektrum 150.",
      beforeLabel: "Standard LED",
      afterLabel: "Spektrum 150",
      alt: "Reef tank under standard white LED compared with the same tank under Spektrum 150",
      caption: "Unedited photos, identical exposure.",
    }),
    featureListDemo({
      eyebrow: "In the box",
      headline: "Everything to hang it tonight.",
      items: [
        { title: "Rim brackets + hanging kit", text: "Both mounting options included." },
        { title: "Slim aluminium body", text: "3.2 cm high, passive cooling — no fans." },
        { title: "Six control channels", text: "Sunrise, midday, dusk and lunar phases in the app." },
        { title: "3-year warranty", text: "Registered online in two minutes." },
      ],
    }),
    galleryDemo({
      eyebrow: "Gallery",
      headline: "Up close.",
      images: [
        { file: "spektrum-150.jpg", alt: "Spektrum 150 from the front", caption: "Front" },
        { file: "spektrum-150-detail.jpg", alt: "Spektrum 150 lens cluster close-up", caption: "Optic" },
        { file: "reef-corals.jpg", alt: "Corals under Spektrum light", caption: "Result" },
      ],
    }),
    faqSpecDemo({
      eyebrow: "Details",
      headline: "Specs and answers.",
      product: spektrum150,
      faqs: [
        { question: "How many Spektrum 150s do I need?", answer: ["One unit covers roughly 60 × 60 cm at SPS intensity; for mixed reefs you can stretch to 75 × 60 cm. Overlap units by 10 cm for even PAR."] },
        { question: "Does it need a fan?", answer: ["No. The aluminium body is the heatsink; the light stays below 45 °C at full power."] },
        { question: "Can I control several lights together?", answer: ["Yes — group them in the app and they share one schedule."] },
      ],
      downloads: [{ label: "Manual (PDF)", href: "https://www.theaquariumsolution.com/product/8438/545" }],
    }),
    ctaDemo({ eyebrow: "Next step", headline: "See Spektrum in a store near you.", primaryCta: { label: "Find a stockist", href: STOCKISTS }, secondaryCta: { label: "Ask a question", href: "/en/contact" }, tone: "lime" }),
  ],
});

const funktionPage = page({
  id: "funktion-return-pump",
  title: "Funktion Return Pump",
  slug: "funktion-return-pump",
  product: funktionPump,
  metadata: {
    title: "Funktion Return Pump | The Aquarium Solution",
    description: "Whisper-quiet, efficient DC return pumps with ten flow settings, feed mode and dry-run protection.",
    image: "funktion-pump-lineup.jpg",
  },
  content: [
    heroDemo({
      brand: "Funktion · Pumps",
      headline: "Hear the reef,\nnot the pump.",
      summary: "Sine-wave DC driver, ceramic shaft, tool-free strip-down. Four sizes from nano to 8,000 l/h.",
      image: "funktion-pump-lineup.jpg",
      imageAlt: "The Funktion Return Pump line-up",
      primaryCta: { label: "Compare sizes", href: "#compare" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    animatedHeadlineDemo({ eyebrow: "Quiet by design", headline: "Under 30 decibels at full flow. Your fridge is louder." }),
    featureTourDemo({
      eyebrow: "Feature tour",
      headline: "Four ideas, one pump.",
      tone: "paper",
      steps: [
        { title: "Sine-wave DC driver", body: "Smooth current means no coil hum and 40 % less power than an AC pump of the same flow.", image: "funktion-pump-detail.jpg", imageAlt: "Funktion controller and driver", stat: "< 30 dB", statLabel: "At full flow" },
        { title: "Ceramic shaft, tool-free", body: "Twist the volute, lift the impeller, rinse. Back together in under a minute.", image: "funktion-pump.jpg", imageAlt: "Funktion pump disassembled", stat: "60 s", statLabel: "Clean-out" },
        { title: "Feed mode & dry-run cut-off", body: "One press pauses flow for feeding; a dry sump stops the pump before it overheats.", image: "reef-fish.jpg", imageAlt: "Fish feeding in a reef tank", stat: "10", statLabel: "Flow steps" },
      ],
    }),
    comparisonTableDemo({
      eyebrow: "Compare",
      headline: "Pick your size.",
      rowHeader: "Model",
      columns: [
        { title: "Funktion 2000", subtitle: "Nano / up to 250 l", cta: { label: "Ask about 2000", href: "/en/contact" } },
        { title: "Funktion 4000", subtitle: "Up to 600 l", highlight: true, cta: { label: "Ask about 4000", href: "/en/contact" } },
        { title: "Funktion 8000", subtitle: "Up to 1,500 l", cta: { label: "Ask about 8000", href: "/en/contact" } },
      ],
      rows: [
        { label: "Max flow", cells: ["2,000 l/h", "4,000 l/h", "8,000 l/h"] },
        { label: "Max head", cells: ["2.0 m", "3.2 m", "4.5 m"] },
        { label: "Power", cells: ["12 W", "28 W", "65 W"] },
        { label: "Feed mode", cells: ["yes", "yes", "yes"] },
        { label: "Dry-run protection", cells: ["yes", "yes", "yes"] },
        { label: "Outlet", cells: ["20 mm", "25 mm", "32 mm"] },
      ],
      footnote: "Flow measured at zero head with clean impeller.",
    }),
    splitContentDemo({
      eyebrow: "Built to be serviced",
      headline: "Ten years of impellers in stock.",
      body: ["Every wear part is a spare part. Impellers, O-rings and shafts stay available for the life of the pump — through your dealer or direct."],
      image: "funktion-pump-detail.jpg",
      imageAlt: "Funktion impeller and ceramic shaft",
      tone: "sand",
      cta: { label: "Find a stockist", href: STOCKISTS },
    }),
    faqSpecDemo({
      eyebrow: "Details",
      headline: "Specs and answers.",
      product: funktionPump,
      faqs: [
        { question: "Which size for my sump?", answer: ["Aim for 5–10× tank volume per hour through the sump. A 400 l tank is happy on the Funktion 4000 throttled to about 60 %."] },
        { question: "Can it run externally?", answer: ["Yes — all sizes are rated for in-line use with the supplied barbed fittings."] },
      ],
    }),
    contactFormDemo({
      eyebrow: "Contact",
      headline: "Not sure which size? Ask us.",
      intro: "Tell us your tank volume and plumbing; we answer within one working day.",
      interestOptions: ["Funktion 2000", "Funktion 4000", "Funktion 8000", "Spare parts", "Something else"],
    }),
  ],
});

const khPage = page({
  id: "kh-manager",
  title: "KH Manager",
  slug: "kh-manager",
  product: khManager,
  metadata: {
    title: "KH Manager alkalinity controller | The Aquarium Solution",
    description: "Automatic alkalinity testing and dosing for reef aquariums — up to 24 tests a day, app alerts, integrated dosing control.",
    image: "kh-manager-app.jpg",
  },
  content: [
    heroDemo({
      brand: "KH Manager · Water chemistry",
      headline: "Stability\nwhile you sleep.",
      summary: "KH Manager tests carbonate hardness up to 24 times a day and adjusts dosing before corals notice a swing.",
      image: "kh-manager-app.jpg",
      imageAlt: "KH Manager app showing an alkalinity trend graph",
      primaryCta: { label: "How it works", href: "#tour" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    portableTextDemo({
      body: [
        "h2: The one parameter that moves everything else.",
        "Alkalinity is the first thing to drift and the last thing hobbyists test. KH Manager makes it the one thing you never think about again.",
        "- Tests on your schedule, from 4 to 24 times a day",
        "- Learns your tank's consumption and adjusts the doser",
        "- Alerts you on the phone if something is off",
      ],
    }),
    featureTourDemo({
      eyebrow: "How it works",
      headline: "Test. Compare. Correct.",
      steps: [
        { title: "Sample", body: "A peristaltic pump draws 20 ml from the sump into the measuring cell.", image: "kh-manager-detail.jpg", imageAlt: "KH Manager measuring cell", stat: "20 ml", statLabel: "Per test" },
        { title: "Titrate", body: "Reagent is added drop by drop while a pH probe watches the curve; resolution is 0.05 dKH.", image: "kh-manager.jpg", imageAlt: "KH Manager unit", stat: "0.05", statLabel: "dKH resolution" },
        { title: "Correct", body: "If the reading drifts outside your band, the connected doser is nudged — gently, never in one big shot.", image: "kh-manager-app.jpg", imageAlt: "KH Manager app trend and alerts", stat: "24×", statLabel: "Tests a day" },
      ],
    }),
    beforeAfterDemo({
      eyebrow: "Before / after",
      headline: "Thirty days of alkalinity.",
      intro: "Manual dosing on the left, KH Manager on the right.",
      before: "reef-before.jpg",
      after: "reef-after.jpg",
      beforeLabel: "Manual dosing",
      afterLabel: "KH Manager",
      alt: "Alkalinity chart with manual dosing compared with KH Manager control",
      startPosition: 40,
    }),
    featureListDemo({
      eyebrow: "Why it matters",
      headline: "Stable KH, visible results.",
      intro: "What reef keepers report after the first month.",
      items: [
        { title: "Better polyp extension", text: "SPS and LPS extend further when KH stops swinging." },
        { title: "Fewer tip burns", text: "Alkalinity spikes are the number-one cause of STN at the tips." },
        { title: "Less testing", text: "Reagent lasts for months; you read a graph instead of a test kit." },
      ],
    }),
    faqSpecDemo({
      eyebrow: "Details",
      headline: "Specs and answers.",
      product: khManager,
      faqs: [
        { question: "Which dosing pumps does it control?", answer: ["Any doser with a 0–10 V or dry-contact input, plus our own D-D doser natively over the app."] },
        { question: "How often do I replace reagent?", answer: ["At 12 tests a day a 500 ml bottle lasts about three months."] },
        { question: "Does it need calibration?", answer: ["It self-calibrates against the reference solution every 30 tests."] },
      ],
      downloads: [{ label: "Manual (PDF)", href: "https://www.theaquariumsolution.com/product/8339/418" }],
    }),
    testimonialDemo({
      testimonials: [{ quote: "Set it up on a Sunday, stopped worrying on Monday. My KH graph is a flat line now.", name: "Jonas W.", role: "Reef keeper", company: "Hamburg" }],
    }),
    ctaDemo({ eyebrow: "Next step", headline: "See KH Manager at your dealer.", primaryCta: { label: "Find a stockist", href: STOCKISTS }, secondaryCta: { label: "Contact us", href: "/en/contact" }, tone: "ink" }),
  ],
});

const contactPage = page({
  id: "contact",
  title: "Contact",
  slug: "contact",
  navbarVariant: "dark",
  metadata: { title: "Contact | The Aquarium Solution", description: "Ask us about Spektrum, Funktion or KH Manager, or find a stockist near you." },
  content: [
    contactFormDemo({
      eyebrow: "Contact",
      headline: "Ask a reef keeper.",
      intro: "Product questions, dealer enquiries, spare parts — we answer within one working day.",
      interestOptions: ["Spektrum 150", "Funktion Return Pump", "KH Manager", "Becoming a dealer", "Something else"],
    }),
  ],
});

const pages: PageDocument[] = [home, spektrumPage, funktionPage, khPage, contactPage];

/* ------------------------------------------------------------- shell */

const shell: SiteShell = {
  settings: {
    _id: "siteSettings",
    brandName: "The Aquarium Solution",
    description: "D-D The Aquarium Solution designs lighting, pumps and water-chemistry equipment for reef aquariums.",
    email: ["info@theaquariumsolution.com"],
    phone: [],
    legacySiteUrl: "https://www.theaquariumsolution.com",
    dealerLocatorUrl: STOCKISTS,
    socialLinks: [
      { _key: "fb", ...link("Facebook", "https://www.facebook.com/theaquariumsolution") },
      { _key: "ig", ...link("Instagram", "https://www.instagram.com/theaquariumsolution") },
    ],
    defaultMetadata: {
      _type: "metadata",
      title: "The Aquarium Solution",
      description: "Aquarium add-ons and reef equipment by D-D The Aquarium Solution.",
      image: img("og-default.jpg", { width: 1200, height: 630 }),
    },
  },
  menu: {
    _id: "menu-en",
    language: "en",
    items: [
      { _key: "m1", ...link("Spektrum 150", "/en/spektrum-150") },
      { _key: "m2", ...link("Funktion Pump", "/en/funktion-return-pump") },
      { _key: "m3", ...link("KH Manager", "/en/kh-manager") },
    ],
    cta: link("Find a stockist", STOCKISTS),
    footerLinks: [{ _key: "f1", ...link("Contact", "/en/contact") }],
  },
};

/* ------------------------------------------------------------ getters */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDemoHome(_locale: Locale) {
  return home;
}

export function getDemoPage(_locale: Locale, slug: string) {
  return pages.find((p) => p.slug === slug && !p.isHomepage) ?? null;
}

export function getDemoRoutes(): (PageRoute & { _id: string; _updatedAt: string; title: string })[] {
  return pages.map((p) => ({ _id: p._id, _updatedAt: p._updatedAt, title: p.title, slug: p.slug, language: p.language, isHomepage: p.isHomepage, groupId: p.groupId }));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDemoShell(_locale: Locale) {
  return shell;
}

export const demoPages = pages;
