import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Trace the supplied mark, preserving disconnected dots and negative spaces.
const source = "assets/source/takhleeqi-logo-original.png";
const { data, info } = await sharp(source)
  .flatten({ background: "#ffffff" })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height } = info;
const filled = (x, y) =>
  x >= 0 && y >= 0 && x < width && y < height && data[y * width + x] < 150;
const edges = new Map();
const add = (a, b) => edges.set(a.join(","), b);
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++)
    if (filled(x, y)) {
      if (!filled(x, y - 1)) add([x, y], [x + 1, y]);
      if (!filled(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
      if (!filled(x, y + 1)) add([x + 1, y + 1], [x, y + 1]);
      if (!filled(x - 1, y)) add([x, y + 1], [x, y]);
    }
const distance = (p, a, b) => {
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  const t = Math.max(
    0,
    Math.min(
      1,
      ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1),
    ),
  );
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
function simplify(points) {
  let max = 0.6,
    index = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const d = distance(points[i], points[0], points.at(-1));
    if (d > max) {
      max = d;
      index = i;
    }
  }
  return index < 0
    ? [points[0], points.at(-1)]
    : [
        ...simplify(points.slice(0, index + 1)).slice(0, -1),
        ...simplify(points.slice(index)),
      ];
}
const loops = [];
while (edges.size) {
  const start = edges.keys().next().value;
  let key = start;
  const points = [];
  do {
    const next = edges.get(key);
    if (!next) throw new Error("Broken logo contour");
    points.push(key.split(",").map(Number));
    edges.delete(key);
    key = next.join(",");
  } while (key !== start);
  if (points.length < 10) continue;
  let far = 1;
  for (let i = 2; i < points.length; i++)
    if (
      Math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]) >
      Math.hypot(points[far][0] - points[0][0], points[far][1] - points[0][1])
    )
      far = i;
  loops.push([
    ...simplify(points.slice(0, far + 1)).slice(0, -1),
    ...simplify([...points.slice(far), points[0]]).slice(0, -1),
  ]);
}
const signedArea = (points) =>
  points.reduce((sum, p, i) => {
    const q = points[(i + 1) % points.length];
    return sum + p[0] * q[1] - q[0] * p[1];
  }, 0) / 2;
const contains = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i],
      b = polygon[j];
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
};
const shapes = loops
  .filter((p) => signedArea(p) > 0)
  .map((outline) => ({ outline, holes: [] }));
for (const hole of loops.filter((p) => signedArea(p) < 0)) {
  const parent = shapes
    .filter((s) => contains(hole[0], s.outline))
    .sort((a, b) => signedArea(a.outline) - signedArea(b.outline))[0];
  if (!parent) throw new Error("Unassigned logo hole");
  parent.holes.push(hole);
}
const all = loops.flat(),
  xs = all.map((p) => p[0]),
  ys = all.map((p) => p[1]);
const bounds = {
  minX: Math.min(...xs),
  minY: Math.min(...ys),
  maxX: Math.max(...xs),
  maxY: Math.max(...ys),
};
const path = loops
  .map((points) => "M" + points.map((p) => p.join(" ")).join("L") + "Z")
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.minX - 5} ${bounds.minY - 5} ${bounds.maxX - bounds.minX + 10} ${bounds.maxY - bounds.minY + 10}"><defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9f9ff"/><stop offset=".45" stop-color="#67b7f5"/><stop offset=".72" stop-color="#7c90ed"/><stop offset="1" stop-color="#c1f3ff"/></linearGradient></defs><path d="${path}" fill="url(#h)" fill-rule="evenodd"/></svg>`;
let intersection = 0,
  union = 0;
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const original = filled(x, y),
      traced = shapes.some(
        (s) =>
          contains([x + 0.5, y + 0.5], s.outline) &&
          !s.holes.some((h) => contains([x + 0.5, y + 0.5], h)),
      );
    if (original && traced) intersection++;
    if (original || traced) union++;
  }
const similarity = intersection / union;
if (similarity < 0.985)
  throw new Error(`Logo silhouette mismatch: ${similarity}`);
await mkdir("src/assets", { recursive: true });
await mkdir("public/media", { recursive: true });
await writeFile(
  "src/assets/logo-shapes.json",
  JSON.stringify({ bounds, shapes }),
);
await writeFile("public/media/takhleeqi-logo.svg", svg);
await writeFile(
  "assets/logo-provenance.json",
  JSON.stringify(
    {
      source,
      sha256: createHash("sha256")
        .update(await readFile(source))
        .digest("hex"),
      imageSize: [width, height],
      shapeCount: shapes.length,
      holeCount: shapes.reduce((n, s) => n + s.holes.length, 0),
      silhouetteIntersectionOverUnion: similarity,
      method:
        "Threshold contour trace with 0.6-pixel simplification. Original mark, dots and negative spaces preserved; no AI raster generation. 3D edges receive local rounding up to 1.1 source pixels.",
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    shapes: shapes.length,
    holes: shapes.reduce((n, s) => n + s.holes.length, 0),
    vertices: all.length,
    similarity,
    bounds,
  }),
);
