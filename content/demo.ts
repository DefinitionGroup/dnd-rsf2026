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
import { hero3dDemo } from "@/blocks/hero-3d/demo";
import { cinematicHeroDemo } from "@/blocks/cinematic-hero/demo";
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
import { specsDemo } from "@/blocks/specs/demo";
import { faqDemo } from "@/blocks/faq/demo";
import { testimonialDemo } from "@/blocks/testimonial/demo";
import { ctaDemo } from "@/blocks/cta/demo";
import { contactFormDemo } from "@/blocks/contact-form/demo";
import { videoDemo } from "@/blocks/video/demo";
import { statStripDemo } from "@/blocks/stat-strip/demo";
import { howItWorksDemo } from "@/blocks/how-it-works/demo";
import { productFinderDemo } from "@/blocks/product-finder/demo";
import { indicatorLegendDemo } from "@/blocks/indicator-legend/demo";
import { mediaDemo } from "@/blocks/media/demo";
import { img, link } from "./demo-helpers";
import { demoProductMenu } from "./demo-product-menu";
import { clarisea, fmr75, funktionPump, khManager, rowaphos, spektrum150 } from "./demo-products";

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
    description: "Filtration and water-quality equipment for reef aquariums: ClariSea Gen 3 automatic fleece filters, RowaPhos phosphate remover and the FMR75 fluidised media reactor.",
    image: "hero-reef.jpg",
  },
  content: [
    heroDemo({
      brand: "D-D The Aquarium Solution",
      headline: "Equipment that lets the reef\ndo the talking.",
      summary: "Automatic fleece filtration, phosphate control that means business and a media reactor that ticks every box — designed by reef keepers, built for the long run.",
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
      intro: "An automatic fleece filter, a phosphate remover and the reactor to run it in — three ways to clearer water and a more stable reef.",
      items: [
        { product: clarisea, link: { label: "Explore", href: "/en/clarisea" } },
        { product: rowaphos, link: { label: "Explore", href: "/en/rowaphos" } },
        { product: fmr75, link: { label: "Explore", href: "/en/fmr75" } },
      ],
    }),
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
    cinematicHeroDemo({
      brand: "ClariSea Gen 3",
      headline: "Clear water,\nrunning itself.",
      summary: "The fleece advances, the float rises, the controller takes over — filtration you watch once, then forget.",
      videoAlt: "ClariSea Gen 3 fleece filter running in a reef sump",
      primaryCta: { label: "Which size do I need?", href: "#productFinderBlock" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
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
    hero3dDemo({
      brand: "ClariSea Gen 3 \u00b7 SK5000",
      headline: "Here comes the fleece filter\nthat does more.",
      summary: "Every part engineered to click into place. Scroll to assemble the SK5000.",
      modelAlt: "Exploded 3D view of the ClariSea SK5000 fleece filter assembling into the complete unit as the page scrolls.",
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
    specsDemo({
      eyebrow: "Details",
      headline: "Technical specifications",
      product: clarisea,
      downloads: [
        { label: "Quick start guide (PDF)", href: "https://www.theaquariumsolution.com/product/3078/409" },
        { label: "Gen 3 parts list (PDF)", href: "https://www.theaquariumsolution.com/product/3078/409" },
      ],
    }),
    faqDemo({
      headline: "Frequently asked questions",
      faqs: [
        { question: "Which model do I need?", answer: ["Match the recommended flow to your return-pump throughput and sump water depth (5–20 cm submerged, 10 cm optimal). As a guide: SK-3000 G3 up to about 600 l, SK-5000 G3 up to about 1,200 l. Use the finder above."] },
        { question: "How often do I change the roll?", answer: ["A 40 m roll typically lasts eight to ten weeks. The controller alerts you when the roll is empty; the drop-in holder means you change it without lifting the unit out of the sump."] },
        { question: "Does it work in freshwater?", answer: ["Yes — ClariSea Gen 3 fits both freshwater and saltwater systems, including fish-breeding and coral-propagation set-ups."] },
        { question: "What does the water bypass do?", answer: ["It lets you decide how much of the flow passes through the fleece — handy when feeding, medicating or tuning overall flow."] },
        { question: "What happens if the fleece jams?", answer: ["The controller stops advancing, flashes red and sounds an alarm; the integrated fail-safe overflow lets water pass so your return pump never runs dry."] },
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

const ROWAPHOS_DOWNLOADS = "https://www.theaquariumsolution.com/sites/default/files/downloads";

const rowaphosPage = page({
  id: "rowaphos",
  title: "RowaPhos",
  slug: "rowaphos",
  product: rowaphos,
  metadata: {
    title: "RowaPhos phosphate remover | The Aquarium Solution",
    description: "The phosphate remover that means business: patented ferric hydroxide that removes phosphate and silicate from freshwater and saltwater — 25 g PO₄ per kg, effective below 0.05 ppm, no leaching. Five sizes, 100 ml to 5 kg.",
    image: "original/rowaphos-reef-plant.jpg",
  },
  content: [
    heroDemo({
      brand: "RowaPhos by D-D · Phosphate remover",
      headline: "Here comes the phosphate remover\nthat means business.",
      summary: "The clever choice for clean water and a globally proven leader in phosphate control — all at exceptional value for money.",
      image: "original/rowaphos-group.png",
      imageAlt: "RowaPhos phosphate remover — the range from 100 ml to the 5 kg commercial pack",
      primaryCta: { label: "How much do I need?", href: "#productFinderBlock" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    statStripDemo({
      eyebrow: "RowaPhos by the numbers",
      stats: [
        { value: "25", suffix: "g/kg", label: "Phosphate adsorbed per kg in saltwater" },
        { value: "20", suffix: "g/kg", label: "Phosphate adsorbed per kg in freshwater" },
        { value: "0.05", prefix: "<", suffix: "ppm", label: "Still removing phosphate at low concentrations" },
        { value: "5", suffix: "sizes", label: "From 100 ml up to a 5 kg commercial pack" },
      ],
    }),
    introDemo({
      eyebrow: "Freshwater and saltwater",
      headline: "A unique ferric hydroxide that removes phosphate and silicate — from reef tanks to planted aquariums.",
      wideHeadline: true,
      body: [
        "RowaPhos was originally patented and chemically engineered in Germany, where it was first developed for treating mains water. It delivers the largest adsorption capacity when compared to other commercial phosphate removers.",
      ],
      background: "black",
      backgroundImage: "original/rowaphos-reef-plant.jpg",
      backgroundMuted: 55,
      minHeight: "75",
    }),
    splitContentDemo({
      eyebrow: "Feed your fish, not your algae",
      headline: "Cleaner water, stronger corals, fewer algae.",
      body: [
        "Phosphate feeds nuisance algae, which can overrun plants and expensive corals — and in the reef aquarium it holds back the calcification corals need to build their skeletons.",
        "RowaPhos is easy to use, improves water quality, supports SPS growth and curbs nuisance algae.",
        "Since algae rarely takes a day off, regular use of RowaPhos is highly recommended.",
      ],
      image: "original/rowaphos-media.png",
      imageAlt: "RowaPhos ferric hydroxide granules",
    }),
    featureListDemo({
      eyebrow: "Why RowaPhos",
      headline: "Engineered to out-adsorb the rest.",
      items: [
        { title: "Largest adsorption capacity", text: "A whopping 25 g of phosphate per kg in saltwater and 20 g per kg in freshwater." },
        { title: "Keeps working at low levels", text: "Continues to remove phosphate effectively even below 0.05 ppm." },
        { title: "No leaching", text: "Does not release phosphate back into the system when saturated — so there is no rush to remove exhausted media." },
        { title: "Phosphate and silicate", text: "One media for both — in freshwater and saltwater aquariums alike." },
        { title: "Independently tested", text: "In tests by the Technical University of Berlin on the five most commonly used phosphate removers, the others reached only 30–40 % of RowaPhos' removal capacity by weight." },
        { title: "Patented — not a copy", text: "Only Rowa make RowaPhos. Other iron-based media have a different chemical structure and different properties." },
      ],
    }),
    splitContentDemo({
      eyebrow: "For best results",
      headline: "RowaPhos + the FMR75 reactor.",
      body: [
        "Run RowaPhos in D-D's FMR75 fluidised media reactor and dose 25 g per 100 l in saltwater.",
        "And of course follow the instructions — removing phosphate too fast can stress corals.",
      ],
      image: "original/fmr75.jpg",
      imageAlt: "D-D FMR75 fluidised media reactor",
      reverse: true,
      tone: "sand",
      cta: { label: "About the FMR75", href: "/en/fmr75" },
    }),
    productFinderDemo({
      eyebrow: "Which size?",
      headline: "Find your RowaPhos pack in ten seconds.",
      intro: "Tell us your system volume and water type — we recommend the pack that removes 3 ppm of phosphate from it.",
      volumeLabel: "System volume",
      volumeMin: 50,
      volumeMax: 6000,
      volumeDefault: 400,
      loadLabel: "Water type",
      loadOptions: [
        { label: "Saltwater", factor: 1, rollFactor: 1 },
        { label: "Freshwater", factor: 0.5, rollFactor: 1 },
      ],
      rules: [
        { maxEffectiveVolume: 400, resultTitle: "RowaPhos 100 ml (RP10)", resultBody: "Removes 3 ppm of phosphate from about 400 l of saltwater or 800 l of freshwater. Media bag included.", product: rowaphos, cta: { label: "Find a stockist", href: STOCKISTS } },
        { maxEffectiveVolume: 1000, resultTitle: "RowaPhos 250 ml (RP25)", resultBody: "Removes 3 ppm of phosphate from about 1,000 l of saltwater or 2,000 l of freshwater. Media bag included.", product: rowaphos, cta: { label: "Find a stockist", href: STOCKISTS } },
        { maxEffectiveVolume: 2000, resultTitle: "RowaPhos 500 ml (RP50)", resultBody: "Removes 3 ppm of phosphate from about 2,000 l of saltwater or 4,000 l of freshwater.", product: rowaphos, cta: { label: "Find a stockist", href: STOCKISTS } },
        { maxEffectiveVolume: 4000, resultTitle: "RowaPhos 1,000 ml (RP100)", resultBody: "Removes 3 ppm of phosphate from about 4,000 l of saltwater or 8,000 l of freshwater.", product: rowaphos, cta: { label: "Find a stockist", href: STOCKISTS } },
        { maxEffectiveVolume: 20000, resultTitle: "RowaPhos 5 kg commercial pack (RP500KG)", resultBody: "Removes 3 ppm of phosphate from about 20,000 l of saltwater or 40,000 l of freshwater — for large systems, ponds and stores.", product: rowaphos, cta: { label: "Find a stockist", href: STOCKISTS } },
        { resultTitle: "Talk to us about your system", resultBody: "Tell us about your system and we will help you plan the right quantity.", cta: { label: "Talk to us", href: "/en/contact" } },
      ],
      footnote: "Guide values based on removing 3 ppm of phosphate (PO₄). For the ongoing dose in saltwater, use 25 g per 100 l and follow the instructions — removing phosphate too fast can stress corals.",
    }),
    comparisonTableDemo({
      eyebrow: "Five sizes",
      headline: "From 100 ml right up to 5 kg.",
      intro: "Same patented media in every pack — pick the size that suits your system.",
      rowHeader: "Pack",
      columns: [
        { title: "100 ml", subtitle: "RP10", cta: { label: "Find a stockist", href: STOCKISTS } },
        { title: "250 ml", subtitle: "RP25", cta: { label: "Find a stockist", href: STOCKISTS } },
        { title: "500 ml", subtitle: "RP50", cta: { label: "Find a stockist", href: STOCKISTS } },
        { title: "1,000 ml", subtitle: "RP100", cta: { label: "Find a stockist", href: STOCKISTS } },
        { title: "5 kg", subtitle: "RP500KG · commercial", cta: { label: "Find a stockist", href: STOCKISTS } },
      ],
      rows: [
        { label: "Saltwater", hint: "Removes 3 ppm PO₄ from approx.", cells: ["400 l", "1,000 l", "2,000 l", "4,000 l", "20,000 l"] },
        { label: "Freshwater", hint: "Removes 3 ppm PO₄ from approx.", cells: ["800 l", "2,000 l", "4,000 l", "8,000 l", "40,000 l"] },
        { label: "Saltwater (US gal)", cells: ["105", "265", "525", "1,050", "5,250"] },
        { label: "Freshwater (US gal)", cells: ["210", "530", "1,050", "2,100", "10,500"] },
        { label: "Media bag included", cells: ["yes", "yes", "no", "no", "no"] },
      ],
      footnote: "Use with D-D's FMR75 fluidised media reactor for best results.",
    }),
    specsDemo({
      eyebrow: "Details",
      headline: "Technical specifications",
      product: rowaphos,
      downloads: [
        { label: "What is RowaPhos? (PDF)", href: `${ROWAPHOS_DOWNLOADS}/What%20is%20Rowaphos%20_14.pdf` },
        { label: "Fluidising RowaPhos (PDF)", href: `${ROWAPHOS_DOWNLOADS}/dd%20saltwater%20rowa%20v4.pdf` },
        { label: "RowaPhos test report (PDF)", href: `${ROWAPHOS_DOWNLOADS}/Rowaphos%20Test%20Report%20.pdf` },
        { label: "Removal comparison (PDF)", href: `${ROWAPHOS_DOWNLOADS}/RowaPhos%20removal%20Comparrison.pdf` },
      ],
    }),
    faqDemo({
      headline: "Frequently asked questions",
      faqs: [
        { question: "How much RowaPhos should I use?", answer: ["In saltwater, dose 25 g per 100 l — ideally in D-D's FMR75 fluidised media reactor. Follow the instructions: removing phosphate too fast can stress corals."] },
        { question: "Does it work in freshwater?", answer: ["Yes. RowaPhos removes phosphate and silicate from freshwater and saltwater systems. In freshwater it adsorbs 20 g of phosphate per kg, so each pack treats roughly twice the volume."] },
        { question: "Will it leach phosphate back when it is exhausted?", answer: ["No. RowaPhos does not release phosphate back into the system when saturated, so there is no need to remove exhausted media immediately."] },
        { question: "Does it still work when my phosphate is already low?", answer: ["Yes — RowaPhos continues to remove phosphate effectively even below 0.05 ppm."] },
        { question: "Should I use it all the time?", answer: ["Regular use is highly recommended. Algae rarely takes a day off, and constant use keeps nuisance algae in check."] },
        { question: "Is it the same as other iron-based phosphate removers?", answer: ["No. RowaPhos is a patented ferric hydroxide made only by Rowa. Other iron-based media have a different chemical structure and different properties."] },
      ],
    }),
    ctaDemo({
      eyebrow: "RowaPhos",
      headline: "Simply the clever choice.",
      body: "Available through specialist aquarium retailers worldwide.",
      primaryCta: { label: "Find a stockist", href: STOCKISTS },
      secondaryCta: { label: "Ask us a question", href: "/en/contact" },
      tone: "ink",
    }),
  ],
});

const FMR75_MANUAL = "https://www.theaquariumsolution.com/sites/default/files/downloads/FMR-%2075%20Operating%20Instructions%20v2_0.pdf";

const fmr75Page = page({
  id: "fmr75",
  title: "FMR75",
  slug: "fmr75",
  product: fmr75,
  metadata: {
    title: "FMR75 fluidised media reactor | The Aquarium Solution",
    description: "The media reactor that ticks every box: fluidise RowaPhos, bio pellets (up to 700 ml), carbon and sand in freshwater or saltwater. Even 360° flow, no media loss, top up without emptying — as reactor or KIT with a 1,000 l/h pump.",
    image: "original/fmr75-og.jpg",
  },
  content: [
    heroDemo({
      brand: "FMR75 by D-D · Fluidised media reactor",
      headline: "Here comes the media reactor\nthat ticks every box.",
      summary: "The clever choice for fluidising RowaPhos, bio pellets, carbon and sand — complete in the box, flexible to fit, and all at exceptional value for money.",
      image: "original/fmr75-kit-hero.png",
      imageAlt: "D-D FMR75 fluidised media reactor with its box and the 1,000 l/h feed pump from the FMR75 KIT",
      primaryCta: { label: "Reactor or KIT?", href: "#comparisonTableBlock" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    statStripDemo({
      eyebrow: "FMR75 by the numbers",
      stats: [
        { value: "700", suffix: "ml", label: "Bio pellet capacity" },
        { value: "340", suffix: "mm", label: "Fluidising column between the perforated plates" },
        { value: "360", suffix: "°", label: "Even flow from the dished base — no dead spots" },
        { value: "25", suffix: "mm", label: "Thickest tank or sump glass it hangs on" },
      ],
    }),
    introDemo({
      eyebrow: "Freshwater and saltwater",
      headline: "One compact reactor for a whole range of media — RowaPhos, bio pellets, carbon and sand.",
      wideHeadline: true,
      body: [
        "Many smaller reactors look good, are packaged well and are competitively priced — but when you get down to using them, they just do not tick all of the boxes. D-D spent a lot of time ironing out the bugs to make the FMR75 flexible, and ideal for every hobbyist.",
        "It is affordable enough for a small tank, or for several units on a larger system — with no compromise on design or build. After all, it is no good having the best reactor in the world if it breaks after five minutes.",
      ],
    }),
    mediaDemo({
      image: "original/fmr75-reactor.png",
      imageSize: { width: 345, height: 886 },
      alt: "The FMR75 fluidised media reactor: a clear 80 mm reaction tube between a black lid with hang-on bracket and a black base, green media sponges top and bottom",
      caption: "128 × 94 × 440 mm — small enough for the smallest nano, with the capacity for larger systems.",
      fit: "natural",
      height: "80",
      heightMobile: "66",
      maxWidth: "720",
      spacing: "small",
    }),
    featureListDemo({
      eyebrow: "Why the FMR75",
      headline: "Engineered to fix what other reactors get wrong.",
      items: [
        { title: "Efficient fluidisation", text: "The dished base spreads an even flow from the central downpipe through 360° — no dead spots." },
        { title: "Fast restart, no compacting", text: "A lower perforated diffusion plate holds the media when the pump is off, leaving an empty plenum below for faster fluidisation on restart." },
        { title: "Media stays in the reactor", text: "An upper perforated plate and a fine sponge hold back all but the finest particles — even in the surge when the pump starts." },
        { title: "Top up without emptying", text: "The central feed tube is separate from the lid, so tube and media stay put while you top up. No screws to undo either: the lid screws on and seals with a replaceable multi-stage seal." },
        { title: "Stand it, hang it, clamp it", text: "In the sump, beside it, hung on it — or clamped straight onto the tank with the bracket built into the lid. Inlet and outlet fit in several positions, so pipework runs where your system needs it." },
        { title: "No back-siphon", text: "The supplied non-return valve stops water and media siphoning back through the pump in a power cut — simple but effective." },
      ],
    }),
    splitContentDemo({
      eyebrow: "Plug & play",
      headline: "Everything you need is in the box.",
      body: [
        "How often do you buy a piece of equipment, only to find you do not have all the parts to install it?",
        "The FMR75 comes with three lengths of clear tubing, a non-return valve, a flow adjustment tap, two grades of media sponge and eight cable ties. The FMR75 KIT adds a 1,000 l/h feed pump.",
      ],
      image: "original/fmr75-fittings.png",
      imageAlt: "FMR75 fittings: three lengths of clear tubing, a flow adjustment tap, a non-return valve and cable ties",
    }),
    splitContentDemo({
      eyebrow: "Installation",
      headline: "Set up right, first time.",
      body: [
        "- Fit the flow tap on the IN side, as close to the pump as possible — if it ever weeps under pressure, it simply drips back into the sump.",
        "- Push the non-return valve onto the end of the OUT pipe, upright so the ball engages. Not sure which way round? Blow through it.",
        "- Inside the sump is best: any small weep stays in the system. Running it outside? Bond the elbows with aquarium silicone and secure every hose with the cable ties supplied.",
      ],
      image: "original/fmr75-kit-fittings.png",
      imageAlt: "FMR75 KIT feed pump with the flow adjustment tap, non-return valve, tubing and cable ties",
      reverse: true,
      tone: "sand",
      cta: { label: "Operating instructions (PDF)", href: FMR75_MANUAL },
    }),
    comparisonTableDemo({
      eyebrow: "FMR75 or FMR75 KIT?",
      headline: "Two versions, one clever design.",
      intro: "Same reactor, same fittings. The KIT adds a feed pump specified for bio pellets.",
      rowHeader: "Version",
      columns: [
        { title: "FMR75", subtitle: "Reactor · add the pump of your choice", cta: { label: "Find a stockist", href: STOCKISTS } },
        { title: "FMR75 KIT", subtitle: "Reactor + 1,000 l/h feed pump", highlight: true, cta: { label: "Find a stockist", href: STOCKISTS } },
      ],
      rows: [
        { label: "Reactor with lid, perforated plates and feed tube", cells: ["yes", "yes"] },
        { label: "Tubing, non-return valve and flow tap", cells: ["yes", "yes"] },
        { label: "Fine and coarse media sponges", cells: ["yes", "yes"] },
        { label: "Feed pump", cells: ["no", "1,000 l/h"] },
        { label: "Best for", cells: ["RowaPhos and other media that need gentle fluidisation", "Bio pellets"] },
        { label: "Dimensions", hint: "Including fittings and lid", cells: ["128 × 94 × 440 mm"] },
        { label: "Freshwater & saltwater", cells: ["yes", "yes"] },
      ],
      footnote: "The KIT pump is specified for bio pellets and can deliver more flow than a small charge of RowaPhos needs — for gentle fluidisation, choose the FMR75 and a smaller pump.",
    }),
    comparisonTableDemo({
      eyebrow: "Set up for your media",
      headline: "One reactor, three set-ups.",
      intro: "Fit the sponges — or leave them out — to suit what you run.",
      rowHeader: "Media",
      columns: [
        { title: "RowaPhos", subtitle: "and other phosphate removers" },
        { title: "Bio pellets", subtitle: "up to 700 ml" },
        { title: "Carbon", subtitle: "and other media" },
      ],
      rows: [
        { label: "Upper fine sponge", cells: ["yes", "no", "yes"] },
        { label: "Lower coarse sponge", cells: ["no", "no", "yes"] },
        { label: "Fluidise", cells: ["Gently", "yes", "no"] },
        { label: "Feed flow", hint: "Guide value", cells: ["approx. 500 l/h", "Strong — the KIT pump is specified for pellets", "Just enough to flow through"] },
        { label: "Recommended version", cells: ["FMR75 + a smaller pump", "FMR75 KIT", "FMR75 or FMR75 KIT"] },
      ],
      footnote: "With bio pellets, the perforated plate keeps them in without the upper sponge. Carbon is best left unfluidised to prevent abrasion. Other media may need a little experimentation.",
      background: "gray",
    }),
    splitContentDemo({
      eyebrow: "For best results",
      headline: "FMR75 + RowaPhos.",
      body: [
        "RowaPhos needs gentle fluidisation — run it in the FMR75 with a smaller pump of your choice and dose 25 g per 100 l in saltwater.",
        "Fit the upper fine sponge, leave the lower one out, and follow the instructions — removing phosphate too fast can stress corals.",
      ],
      image: "original/rowaphos-4-tub.png",
      imageAlt: "RowaPhos phosphate remover in four pack sizes",
      cta: { label: "About RowaPhos", href: "/en/rowaphos" },
    }),
    specsDemo({
      eyebrow: "Details",
      headline: "Technical specifications",
      product: fmr75,
      downloads: [{ label: "FMR75 operating instructions (PDF)", href: FMR75_MANUAL }],
    }),
    faqDemo({
      headline: "Frequently asked questions",
      faqs: [
        { question: "FMR75 or FMR75 KIT — which do I need?", answer: ["The KIT adds a 1,000 l/h feed pump, specified for fluidising bio pellets. For media that need gentle fluidisation, such as RowaPhos, choose the FMR75 and a smaller pump of your choice."] },
        { question: "What can I run in it?", answer: ["RowaPhos and other phosphate removers, bio pellets (up to 700 ml), carbon, and biological sand as a fluidised sand filter — in freshwater and saltwater aquariums."] },
        { question: "Which sponges do I fit?", answer: ["No sponges for most bio pellets — the upper perforated plate holds them in. The upper fine sponge only for RowaPhos. Upper fine and lower coarse sponges for carbon and other media."] },
        { question: "Should I fluidise carbon?", answer: ["No. Carbon does not need to tumble — set the flow so it stays put, which prevents abrasion."] },
        { question: "Will media wash out when the pump starts?", answer: ["The upper perforated plate and fine sponge hold back all but the finest particles during the start-up surge. With bio pellets, leave the upper sponge out — the plate still keeps them in."] },
        { question: "Do I need the non-return valve?", answer: ["If the reactor sits above the water level, yes: fit it on the OUT side and it stops water and media siphoning back through the pump when the power goes off. Hung level with the aquarium's water line, the reactor cannot drain down, so the valve is not needed."] },
        { question: "Can I install it outside the sump?", answer: ["Yes. Once you have settled the position, set the elbows at the right angle, bond them to the lid spigots with aquarium silicone or solvent-weld adhesive, and secure every hose with the cable ties supplied. Inside the sump is still best — any small weep stays in the system."] },
        { question: "The media will not fluidise — what is wrong?", answer: ["Check the pipes: the feed must go into the spigot in the centre of the lid. No flow at all with the pump running? The non-return valve is probably the wrong way round."] },
        { question: "The KIT pump hums when I turn the tap down — what now?", answer: ["Throttling the pump hard can stall its impeller. Fit a T-piece and a second valve (not included) in the feed line to divert the excess flow back to the sump, so the pump can run unrestricted."] },
      ],
    }),
    ctaDemo({
      eyebrow: "FMR75",
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
    specsDemo({
      eyebrow: "Details",
      headline: "Technical specifications",
      product: spektrum150,
      downloads: [{ label: "Manual (PDF)", href: "https://www.theaquariumsolution.com/product/8438/545" }],
    }),
    faqDemo({
      headline: "Frequently asked questions",
      faqs: [
        { question: "How many Spektrum 150s do I need?", answer: ["One unit covers roughly 60 × 60 cm at SPS intensity; for mixed reefs you can stretch to 75 × 60 cm. Overlap units by 10 cm for even PAR."] },
        { question: "Does it need a fan?", answer: ["No. The aluminium body is the heatsink; the light stays below 45 °C at full power."] },
        { question: "Can I control several lights together?", answer: ["Yes — group them in the app and they share one schedule."] },
      ],
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
    specsDemo({
      eyebrow: "Details",
      headline: "Technical specifications",
      product: funktionPump,
    }),
    faqDemo({
      headline: "Frequently asked questions",
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
    specsDemo({
      eyebrow: "Details",
      headline: "Technical specifications",
      product: khManager,
      downloads: [{ label: "Manual (PDF)", href: "https://www.theaquariumsolution.com/product/8339/418" }],
    }),
    faqDemo({
      headline: "Frequently asked questions",
      faqs: [
        { question: "Which dosing pumps does it control?", answer: ["Any doser with a 0–10 V or dry-contact input, plus our own D-D doser natively over the app."] },
        { question: "How often do I replace reagent?", answer: ["At 12 tests a day a 500 ml bottle lasts about three months."] },
        { question: "Does it need calibration?", answer: ["It self-calibrates against the reference solution every 30 tests."] },
      ],
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

const cinematicPage = page({
  id: "cinematic",
  title: "ClariSea — The Film",
  slug: "cinematic",
  navbarVariant: "dark",
  metadata: {
    title: "ClariSea Gen 3 — the film | The Aquarium Solution",
    description: "Watch the fleece advance, the float rise and the controller take over — ClariSea Gen 3 in motion.",
    image: "clarisea-video-poster.jpg",
  },
  content: [
    cinematicHeroDemo({
      brand: "ClariSea Gen 3",
      headline: "Clear water,\nrunning itself.",
      summary: "The fleece advances, the float rises, the controller takes over — filtration you watch once, then forget.",
      videoAlt: "ClariSea Gen 3 fleece filter running in a reef sump",
      entrance: "rise",
      primaryCta: { label: "Which size do I need?", href: "/en/clarisea#productFinderBlock" },
      secondaryCta: { label: "Find a stockist", href: STOCKISTS },
    }),
    introDemo({
      eyebrow: "Why ClariSea",
      headline: "Every claim in that film points at a part you can touch.",
      body: [
        "Automatic fleece advance, a fail-safe overflow and a controller that doses attention so you don't have to. No filter socks, no guesswork.",
      ],
    }),
  ],
});

const pages: PageDocument[] = [home, clariseaPage, rowaphosPage, fmr75Page, spektrumPage, funktionPage, khPage, contactPage, cinematicPage];

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
      { _key: "m4", ...link("RowaPhos", "/en/rowaphos") },
      { _key: "m5", ...link("FMR75", "/en/fmr75") },
    ],
    cta: link("Find a stockist", STOCKISTS),
    footerLinks: [{ _key: "f1", ...link("Contact", "/en/contact") }],
  },
  productMenu: demoProductMenu,
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
