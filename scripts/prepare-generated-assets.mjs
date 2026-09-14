import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const names = [
  "animation",
  "mapping",
  "immersive",
  "product",
  "virtual",
  "film",
];
const generated = [];
for (const name of names) {
  const source = `assets/generated/${name}.png`;
  const meta = await sharp(source).metadata();
  const outputs = [];
  for (const width of [480, 960, 1536]) {
    const output = `public/media/creative-${name}-${width}.webp`;
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 480 ? 82 : 88 })
      .toFile(output);
    outputs.push(output);
  }
  generated.push({
    name,
    source,
    width: meta.width,
    height: meta.height,
    sha256: createHash("sha256")
      .update(await readFile(source))
      .digest("hex"),
    outputs,
  });
}
const inventory = JSON.parse(await readFile("MEDIA_INVENTORY.json", "utf8"));
inventory.activeArtwork = {
  generator: "Built-in image_gen",
  created: "2026-09-14",
  provenance:
    "Original AI-generated illustrative service and concept artwork. Not verified client work or photographs of the actual studio. Earlier mockup artwork and source files preserved.",
  prompts: "assets/generated/prompts.json",
  images: generated,
};
await writeFile(
  "MEDIA_INVENTORY.json",
  JSON.stringify(inventory, null, 2) + "\n",
);
console.log(
  "Prepared 18 responsive WebP images from 6 original 1536px artworks.",
);
