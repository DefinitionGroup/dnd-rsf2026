// Downscale the original theaquariumsolution.com imagery to sane web sizes (max 2400px wide), keep PNG alpha.
import sharp from "sharp";
import { readdirSync } from "node:fs";
const dir = "public/images/original";
for (const f of readdirSync(dir)) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue;
  const p = `${dir}/${f}`; const meta = await sharp(p).metadata();
  if ((meta.width ?? 0) <= 2400) continue;
  const buf = await sharp(p).resize({ width: 2400, withoutEnlargement: true }).toBuffer();
  await sharp(buf).toFile(p + ".tmp"); await sharp(p + ".tmp").toFile(p); 
  console.log(f, meta.width, "→ 2400");
}
