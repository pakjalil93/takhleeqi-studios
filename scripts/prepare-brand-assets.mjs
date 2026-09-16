import sharp from "sharp";
import { mkdir, readdir, copyFile, writeFile } from "node:fs/promises";

// Work from the original embedded PDF images; never redraw brand lettering.
const entries = [
  ["interwood", "1-1-X5.png", "light"],
  ["atlantis", "1-2-X7.png", "light"],
  ["imobile", "2-1-X10.png", "light"],
  ["hoola", "2-2-X11.png", "alpha"],
  ["pildat", "2-3-X13.png", "light"],
  ["bluearc", "3-1-X16.png", "dark"],
  ["5towers", "4-1-X19.png", "dark"],
  ["zk", "4-2-X20.png", "light"],
];
await mkdir("public/media/clients", { recursive: true });
for (const [id, file, kind] of entries) {
  const input = `assets/clients/originals/${file}`;
  let result;
  if (kind === "alpha") result = sharp(input);
  else {
    const { data, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    // Estimate each scanline's background from its outer margins, retaining
    // original foreground pixels and solving their alpha against that matte.
    for (let y = 0; y < height; y++) {
      const samples = [2, 3, 4, width - 5, width - 4, width - 3].map(
        (x) => (y * width + x) * 4,
      );
      const bg = [0, 1, 2].map(
        (c) => samples.map((i) => data[i + c]).sort((a, b) => a - b)[3],
      );
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const rgb = [data[i], data[i + 1], data[i + 2]];
        let alpha =
          kind === "dark"
            ? Math.max(
                ...rgb.map(
                  (v, c) => Math.max(0, v - bg[c]) / Math.max(1, 255 - bg[c]),
                ),
              )
            : Math.max(
                ...rgb.map(
                  (v, c) => Math.max(0, bg[c] - v) / Math.max(1, bg[c]),
                ),
              );
        if (alpha < (kind === "dark" ? 0.1 : 0.06)) alpha = 0;
        data[i + 3] = Math.round(alpha * 255);
        if (alpha > 0)
          for (let c = 0; c < 3; c++)
            data[i + c] = Math.max(
              0,
              Math.min(255, Math.round((rgb[c] - bg[c] * (1 - alpha)) / alpha)),
            );
      }
    }
    result = sharp(data, { raw: { width, height, channels: 4 } });
  }
  await result
    .trim({ threshold: 8 })
    .resize({
      width: 640,
      height: 320,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toFile(`public/media/clients/${id}.png`);
}
await mkdir("public/media/team", { recursive: true });
for (const file of (await readdir("assets/Team_Pictures")).sort(
  (a, b) => parseInt(a) - parseInt(b),
)) {
  await sharp(`assets/Team_Pictures/${file}`)
    .rotate()
    .resize(600, 750, { fit: "cover", position: "north" })
    .webp({ quality: 90 })
    .toFile(`public/media/team/${parseInt(file)}.webp`);
}
await copyFile(
  "assets/brand/logo-original.png",
  "public/media/takhleeqi-brand.png",
);
await sharp("assets/brand/logo-original.png")
  .resize(64, 64, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile("public/favicon.png");
await writeFile(
  "assets/clients/provenance.json",
  JSON.stringify(
    {
      source: "Clients.pdf, embedded images",
      geminiReview:
        "Gemini cleanup rejected: altered symbols, colors and raster checkerboard instead of alpha.",
      method:
        "Original raster lettering and symbols, estimated background matte removal. No generative redraw.",
      logos: entries.map(([id, file]) => ({
        id,
        source: `originals/${file}`,
        output: `media/clients/${id}.png`,
      })),
    },
    null,
    2,
  ) + "\n",
);
