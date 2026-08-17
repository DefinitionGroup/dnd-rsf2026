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

for (const [name, tone, w, h, label] of images) {
  const [c1, c2] = palette[tone];
  const angle = name.startsWith("spektrum-spin-") ? Number(name.slice(-2)) * 30 : 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <g transform="translate(${w / 2} ${h / 2}) rotate(${angle})">
      <rect x="${-w * 0.22}" y="${-h * 0.09}" width="${w * 0.44}" height="${h * 0.18}" rx="${h * 0.04}" fill="rgba(255,255,255,0.18)"/>
      <circle cx="${w * 0.22}" cy="0" r="${h * 0.05}" fill="#99cc33" opacity="0.9"/>
    </g>
    <text x="50%" y="92%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(h * 0.045)}" fill="rgba(255,255,255,0.75)">${String(label).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 78 }).toFile(path.join(out, `${name}.jpg`));
}
console.log(`Wrote ${images.length} placeholder images to public/images`);
