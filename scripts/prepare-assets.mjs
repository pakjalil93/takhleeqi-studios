import sharp from "sharp";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
await mkdir("public/media", { recursive: true });
const selections = [
  {
    name: "animation",
    left: 16,
    top: 868,
    width: 325,
    height: 127,
    description:
      "Supplied concept artwork: animated young character watching a luminous butterfly.",
  },
  {
    name: "mapping",
    left: 360,
    top: 869,
    width: 306,
    height: 125,
    description:
      "Supplied concept artwork: cobalt projection patterns on an architectural facade.",
  },
  {
    name: "virtual",
    left: 681,
    top: 868,
    width: 330,
    height: 128,
    description:
      "Supplied concept artwork: a virtual production stage with a mountain landscape.",
  },
  {
    name: "product",
    left: 96,
    top: 655,
    width: 261,
    height: 93,
    description:
      "Supplied concept artwork: dark headphones in a blue-lit landscape.",
  },
  {
    name: "immersive",
    left: 747,
    top: 495,
    width: 235,
    height: 86,
    description:
      "Supplied concept artwork: a VR headset and luminous underwater imagery.",
  },
  {
    name: "film",
    left: 719,
    top: 656,
    width: 262,
    height: 94,
    description:
      "Supplied concept artwork: camera crew silhouetted against a cinematic backdrop.",
  },
];
for (const { name, description, ...region } of selections) {
  await sharp("MOCKUP")
    .extract(region)
    .resize({ width: 960 })
    .webp({ quality: 88 })
    .toFile(`public/media/${name}.webp`);
  await sharp("MOCKUP")
    .extract(region)
    .resize({ width: 480 })
    .webp({ quality: 83 })
    .toFile(`public/media/${name}-small.webp`);
}
await writeFile(
  "MEDIA_INVENTORY.json",
  JSON.stringify(
    {
      source: "MOCKUP",
      type: "PNG",
      dimensions: [1024, 1536],
      sha256: createHash("sha256")
        .update(await readFile("MOCKUP"))
        .digest("hex"),
      originalPreserved: true,
      provenance:
        "User-supplied approved design reference. Extracted artwork is illustrative concept material, not verified studio work. No external images downloaded and no AI image generation called.",
      selected: selections,
      missing: [
        "Original project photographs and video",
        "Verified showreel",
        "Contact details and social URLs",
        "Genuine testimonials and metrics",
      ],
      originalWebsiteGraphics: [
        "Live procedural Three.js chrome sculpture, particles and orbital paths",
        "Original geometric T monogram",
      ],
      duplicates: [],
    },
    null,
    2,
  ),
);
console.log(
  "12 optimized concept images saved in public/media; original unchanged.",
);
