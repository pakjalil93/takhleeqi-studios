import { readFile, writeFile } from "node:fs/promises";
import * as THREE from "three";
import { drawSmoothLogoContour } from "../src/logoContours.ts";
const { bounds, shapes } = JSON.parse(
  await readFile("src/assets/logo-shapes.json", "utf8"),
);
const paths = shapes.flatMap((shape) => [shape.outline, ...shape.holes]);
const path = paths
  .map((points) => {
    const contour = new THREE.Path();
    drawSmoothLogoContour(contour, points, 0, 0, 1);
    const xy = p => `${p.x.toFixed(3)} ${(-p.y).toFixed(3)}`;
    return 'M' + xy(contour.curves[0].v0) + contour.curves.map(curve => `C${xy(curve.v1)} ${xy(curve.v2)} ${xy(curve.v3)}`).join('') + 'Z';
  })
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.minX - 10} ${bounds.minY - 10} ${bounds.maxX - bounds.minX + 20} ${bounds.maxY - bounds.minY + 20}">
<defs><pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#3ab4ff" stroke-width=".35" opacity=".65"/></pattern><filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.3"/></filter><clipPath id="mark"><path d="${path}" clip-rule="evenodd"/></clipPath></defs>
<path d="${path}" fill="none" stroke="#008fff" stroke-width="3" filter="url(#glow)"/>
<path d="${path}" fill="#051d38" fill-opacity=".5" fill-rule="evenodd"/>
<rect x="0" y="0" width="250" height="250" fill="url(#grid)" clip-path="url(#mark)"/>
<path d="${path}" fill="none" stroke="#a5efff" stroke-width=".8"/>
</svg>`;
await writeFile("public/media/takhleeqi-logo-wireframe.svg", svg);
console.log("Wireframe fallback saved.");
