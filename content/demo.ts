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
import { videoDemo } from "@/blocks/video/demo";
import { statStripDemo } from "@/blocks/stat-strip/demo";
import { howItWorksDemo } from "@/blocks/how-it-works/demo";
import { productFinderDemo } from "@/blocks/product-finder/demo";
import { indicatorLegendDemo } from "@/blocks/indicator-legend/demo";
import { img, link } from "./demo-helpers";
import { clarisea, funktionPump, khManager, spektrum150 } from "./demo-products";

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
    description: "Filtration, lighting, pumps and water chemistry engineered for reef aquariums. Discover ClariSea, Spektrum, Funktion and KH Manager.",
    image: "hero-reef.jpg",
  },
  content: [
    heroDemo({
      brand: "D-D The Aquarium Solution",
      headline: "Equipment that lets the reef\ndo the talking.",
      summary: "Full-spectrum lighting, silent DC pumps and automatic alkalinity control — designed by reef keepers, built for the long run.",
      image: "original/clarisea-banner.jpg",
      imageAlt: "ClariSea Gen 3 automatic fleece filters",
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
      intro: "Four ways to make a reef clearer, more stable, more colourful and quieter.",
      items: [
        { product: clarisea, link: { label: "ClariSea Gen 3", href: "/en/clarisea" } },
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

const clariseaPage = page({
  id: "clarisea",
  title: "ClariSea Gen 3",
  slug: "clarisea",
  product: clarisea,
  metadata: {
    title: "ClariSea Gen 3 automatic fleece filter | The Aquarium Solution",
    description: "The fleece filter that does more: SK-3000 and SK-5000 Gen 3 remove waste, detritus and microalgae automatically — no filter socks, smart controller, 40 m roll, fail-safe overflow.",
    image: "original/clarisea-banner.jpg",
  },
  content: [
    heroDemo({
      brand: "ClariSea Gen 3 · Automatic fleece filter",
      headline: "Here comes the fleece filter\nthat does more.",
      summary: "The clever choice for highly efficient filtration with minimal maintenance — all at exceptional value for money.",
      image: "original/clarisea-unit-dark.jpg",
      imageAlt: "ClariSea Gen 3 automatic fleece filter",
      video: { url: "/videos/clarisea-proxy.mp4", mimeType: "video/mp4" },
      primaryCta: { label: "Which size do I need?", href: "#productFinderBlock" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    statStripDemo({
      stats: [
        { value: "3,000", suffix: "l/h", label: "SK-3000 G3 — 790 gal per hour" },
        { value: "5,000", suffix: "l/h", label: "SK-5000 G3 — 1,320 gal per hour" },
        { value: "40", suffix: "m", label: "Phosphate-free, low-odour fleece per roll" },
        { value: "8–10", suffix: "weeks", label: "Expected lifespan of one roll" },
      ],
    }),
    introDemo({
      eyebrow: "Goodbye filter socks",
      headline: "Automatic removal of waste, detritus, uneaten food, microalgae and fine particles — before they break down in your aquarium.",
      body: [
        "These compact roller filters fit both freshwater and saltwater systems. They eliminate the need for annoying filter socks and their constant cleaning.",
        "The result? Improved water clarity, enhanced light penetration for healthier coral and plant growth, reduced nitrate and phosphate build-up — and a much easier life for your protein skimmer.",
      ],
    }),
    videoDemo({
      eyebrow: "See it run",
      headline: "ClariSea in motion.",
      intro: "Watch the fleece advance, the float rise and the controller take over — the whole cycle in under a minute.",
      caption: "Studio footage — the final film follows the shoot script.",
    }),
    howItWorksDemo({ eyebrow: "How it works", headline: "Consistent filtration, around the clock.", intro: "The smart controller advances the fleece as it becomes dirty — automatically, or at the push of a button." }),
    featureTourDemo({
      eyebrow: "Gen 3 details",
      headline: "Every part rethought.",
      intro: "Scroll through what changed in the third generation.",
      tone: "paper",
      steps: [
        { title: "Top rollers with fleece guides", body: "Reduce tension on the fleece, ensuring smoother operation over time.", image: "original/clarisea-rollers.jpg", imageAlt: "Top rollers with fleece guides", stat: "Gen 3", statLabel: "Roller design" },
        { title: "Quick-release silencer plates", body: "Reduce noise, water splashes and salt creep even further — and lift off without tools.", image: "original/clarisea-body.jpg", imageAlt: "ClariSea Gen 3 body with quick-release silencer plates", stat: "0", statLabel: "Tools needed" },
        { title: "Drop-in fleece holder + removal tool", body: "Roll changes are quick and simple — while the unit stays in the sump.", image: "original/clarisea-fleece-holder.jpg", imageAlt: "The drop-in fleece holder", stat: "40 m", statLabel: "Per roll" },
        { title: "Integrated water bypass", body: "Control how heavily your water is filtered — valuable flexibility for feeding, tank medication or general flow management.", image: "original/clarisea-motor.jpg", imageAlt: "Upgraded Gen 3 motor and cruciform", stat: "1", statLabel: "Lever" },
        { title: "Fully assembled body, universal inlet", body: "Quick and easy installation; the universal inlet adaptor fits 32 mm, 40 mm and 1\" pipework.", image: "original/clarisea-inlet.jpg", imageAlt: "Universal inlet adaptor close-up", stat: "32 · 40 · 1\"", statLabel: "Inlet sizes" },
      ],
    }),
    beforeAfterDemo({
      eyebrow: "Before / after",
      headline: "Everything the fleece caught.",
      intro: "Slide to compare a fresh roll with one after weeks in the sump — none of it reached your aquarium.",
      before: "original/clarisea-fleece-holder.jpg",
      after: "original/clarisea-removal-tool.jpg",
      beforeLabel: "New roll",
      afterLabel: "Used roll",
      alt: "A new ClariSea fleece roll being fitted, compared with a used roll after weeks in the sump",
      caption: "Detritus, uneaten food and microalgae — removed automatically before they break down.",
    }),
    productFinderDemo({
      eyebrow: "Which size?",
      headline: "Find your ClariSea in ten seconds.",
      intro: "Tell us your aquarium volume and how heavily you feed — we recommend the model and estimate roll life.",
      footnote: "Guide values. Very heavy bioload, breeding systems or coral propagation may need the larger unit or two units in parallel.",
    }),
    comparisonTableDemo({
      eyebrow: "SK-3000 vs SK-5000",
      headline: "Two sizes, one clever design.",
      intro: "Same Gen 3 body, controller and 40 m roll — pick by the flow your return pump delivers and the volume you keep.",
      rowHeader: "Model",
      columns: [
        { title: "ClariSea SK-3000 G3", subtitle: "Up to 3,000 l/h · 790 gal/h", product: clarisea, cta: { label: "Find a stockist", href: STOCKISTS } },
        { title: "ClariSea SK-5000 G3", subtitle: "Up to 5,000 l/h · 1,320 gal/h", product: clarisea, highlight: true, cta: { label: "Find a stockist", href: STOCKISTS } },
      ],
      rows: [
        { label: "Recommended flow", cells: ["3,000 l/h", "5,000 l/h"] },
        { label: "Recommended aquarium", hint: "Guide value, normal stocking", cells: ["up to 600 l", "up to 1,200 l"] },
        { label: "Fleece width", cells: ["10 cm", "15 cm"] },
        { label: "Universal inlet 32 / 40 mm / 1\"", cells: ["yes", "yes"] },
        { label: "Smart controller & alarms", cells: ["yes", "yes"] },
        { label: "Fail-safe overflow", cells: ["yes", "yes"] },
        { label: "Water bypass", cells: ["yes", "yes"] },
        { label: "40 m roll included", cells: ["yes", "yes"] },
        { label: "Freshwater & saltwater", cells: ["yes", "yes"] },
      ],
      footnote: "Optional clean-roll positioning kit available for space-constrained sumps.",
    }),
    indicatorLegendDemo({ eyebrow: "Extra safe", headline: "Audible and visual alarms — a glance tells you everything is running smoothly.", intro: "Tap a state to see what the controller shows and what to do." }),
    galleryDemo({
      eyebrow: "Gallery",
      headline: "Up close.",
      images: [
        { file: "original/clarisea-removal-tool.jpg", alt: "Fleece removal tool with a used roll", caption: "Fleece removal tool" },
        { file: "original/clarisea-motor.jpg", alt: "Upgraded Gen 3 motor and cruciform", caption: "Upgraded motor and cruciform" },
        { file: "original/clarisea-rollers.jpg", alt: "Top rollers with fleece guides", caption: "Top rollers with fleece guides" },
        { file: "original/clarisea-inlet.jpg", alt: "Universal inlet adaptor", caption: "Universal inlet adaptor" },
        { file: "original/clarisea-fleece-holder.jpg", alt: "Fitting a new roll in the drop-in fleece holder", caption: "Drop-in fleece holder" },
        { file: "original/clarisea-body.jpg", alt: "Fully pre-assembled ClariSea Gen 3 body", caption: "Fully assembled body" },
      ],
    }),
    faqSpecDemo({
      eyebrow: "Details",
      headline: "Specs and answers.",
      product: clarisea,
      faqs: [
        { question: "Which model do I need?", answer: ["Match the recommended flow to your return-pump throughput and sump water depth (5–20 cm submerged, 10 cm optimal). As a guide: SK-3000 G3 up to about 600 l, SK-5000 G3 up to about 1,200 l. Use the finder above."] },
        { question: "How often do I change the roll?", answer: ["A 40 m roll typically lasts eight to ten weeks. The controller alerts you when the roll is empty; the drop-in holder means you change it without lifting the unit out of the sump."] },
        { question: "Does it work in freshwater?", answer: ["Yes — ClariSea Gen 3 fits both freshwater and saltwater systems, including fish-breeding and coral-propagation set-ups."] },
        { question: "What does the water bypass do?", answer: ["It lets you decide how much of the flow passes through the fleece — handy when feeding, medicating or tuning overall flow."] },
        { question: "What happens if the fleece jams?", answer: ["The controller stops advancing, flashes red and sounds an alarm; the integrated fail-safe overflow lets water pass so your return pump never runs dry."] },
      ],
      downloads: [
        { label: "Quick start guide (PDF)", href: "https://www.theaquariumsolution.com/product/3078/409" },
        { label: "Gen 3 parts list (PDF)", href: "https://www.theaquariumsolution.com/product/3078/409" },
      ],
    }),
    ctaDemo({
      eyebrow: "ClariSea Gen 3",
      headline: "Simply the clever choice.",
      body: "Available through specialist aquarium retailers worldwide.",
      primaryCta: { label: "Find a stockist", href: STOCKISTS },
      secondaryCta: { label: "Ask us a question", href: "/en/contact" },
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
      image: "original/spektrum-150-tilt.png",
      imageAlt: "Spektrum 150 reef LED",
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
      image: "original/funktion-lineup.png",
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

const pages: PageDocument[] = [home, clariseaPage, spektrumPage, funktionPage, khPage, contactPage];

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
      { _key: "m0", ...link("ClariSea", "/en/clarisea") },
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
