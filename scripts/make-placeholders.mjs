// Generates local placeholder JPGs for demo mode (no Sanity env). Run: pnpm placeholders
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const out = path.resolve("public/images");
await mkdir(out, { recursive: true });

const palette = {
  reef: ["#0f4c5c", "#1a1a1a"],
  lime: ["#99cc33", "#3a5a12"],
  deep: ["#0b2a3a", "#000000"],
  sand: ["#e8ecdf", "#b9c4a8"],
  light: ["#a2d5f2", "#0f4c5c"],
};

const images = [
  ["hero-reef", "reef", 1920, 1080, "Reef tank"],
  ["spektrum-150", "light", 1600, 1200, "Spektrum 150"],
  ["spektrum-150-detail", "deep", 1600, 1200, "Spektrum optics"],
  ["spektrum-150-mounted", "reef", 1600, 1000, "Spektrum mounted"],
  ["funktion-pump", "sand", 1600, 1200, "Funktion pump"],
  ["funktion-pump-detail", "deep", 1600, 1200, "Funktion impeller"],
  ["funktion-pump-lineup", "sand", 1600, 1000, "Funktion line-up"],
  ["kh-manager", "sand", 1600, 1200, "KH Manager"],
  ["kh-manager-detail", "deep", 1600, 1200, "KH Manager display"],
  ["kh-manager-app", "light", 1600, 1000, "KH Manager app"],
  ["reef-before", "deep", 1600, 1000, "Before"],
  ["reef-after", "reef", 1600, 1000, "After"],
  ["reef-corals", "reef", 1600, 1200, "Corals"],
  ["reef-fish", "light", 1600, 1200, "Fish"],
  ["og-default", "lime", 1200, 630, "The Aquarium Solution"],
  ["clarisea-hero", "deep", 1920, 1080, "ClariSea Gen 3 in sump"],
  ["clarisea-sk3000", "sand", 1600, 1200, "ClariSea SK-3000 G3"],
  ["clarisea-sk5000", "sand", 1600, 1200, "ClariSea SK-5000 G3"],
  ["clarisea-controller", "deep", 1600, 1200, "Smart controller"],
  ["clarisea-roll", "sand", 1600, 1200, "40 m fleece roll"],
  ["clarisea-rollers", "deep", 1600, 1200, "Rollers & fleece guides"],
  ["clarisea-adapter", "deep", 1600, 1200, "Universal inlet adaptor"],
  ["clarisea-roll-change", "sand", 1600, 1200, "Roll change"],
  ["clarisea-water-before", "deep", 1600, 1000, "Before"],
  ["clarisea-water-after", "light", 1600, 1000, "After"],
  ["clarisea-sump", "reef", 1600, 1200, "Full system, open cabinet"],
  ["clarisea-led", "deep", 1600, 1200, "Blue LED"],
  ["clarisea-video-poster", "deep", 1920, 1080, "Play video"],
  ...Array.from({ length: 12 }, (_, i) => [`spektrum-spin-${String(i + 1).padStart(2, "0")}`, "light", 1200, 1200, `Spin ${i + 1}`]),
];

const keep = new Set(["clarisea-hero","clarisea-sk3000","clarisea-sk5000","clarisea-controller","clarisea-roll","clarisea-rollers","clarisea-adapter","clarisea-roll-change","clarisea-water-before","clarisea-water-after","clarisea-sump","clarisea-led","clarisea-video-poster"]);
for (const [name, tone, w, h, label] of images) {
  if (keep.has(name)) continue; // derived from the proxy video (ffmpeg frames), see docs/briefs
  const [c1, c2] = palette[tone];
  const angle = name.startsWith("spektrum-spin-") ? Number(name.slice(-2)) * 30 : 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="${Math.round(w*0.06)}" y="${Math.round(h*0.08)}" width="${Math.round(w*0.88)}" height="${Math.round(h*0.84)}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    <text x="${Math.round(w*0.08)}" y="${Math.round(h*0.14)}" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(h * 0.032)}" fill="rgba(255,255,255,0.7)">${String(label).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
    <text x="${Math.round(w*0.08)}" y="${Math.round(h*0.14)+Math.round(h*0.045)}" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(h * 0.024)}" fill="rgba(255,255,255,0.45)">Placeholder — final photography to follow${angle ? ` · frame ${angle/30}` : ""}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 78 }).toFile(path.join(out, `${name}.jpg`));
}
console.log(`Wrote ${images.length} placeholder images to public/images`);
