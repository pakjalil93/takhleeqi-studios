import * as THREE from "three";

/** Remove pixel-scale stair steps before constructing continuous cubic curves. */
export function drawSmoothLogoContour(
  path: THREE.Path,
  contour: number[][],
  centerX: number,
  centerY: number,
  scale: number,
) {
  const lengths = contour.map((p, i) => {
    const q = contour[(i + 1) % contour.length];
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  });
  const perimeter = lengths.reduce((a, b) => a + b, 0);
  const count = Math.max(24, Math.ceil(perimeter / 0.8));
  const samples: THREE.Vector2[] = [];
  let edge = 0,
    traversed = 0;
  for (let i = 0; i < count; i++) {
    const distance = (i * perimeter) / count;
    while (edge < lengths.length - 1 && traversed + lengths[edge] < distance) {
      traversed += lengths[edge++];
    }
    const p = contour[edge],
      q = contour[(edge + 1) % contour.length];
    const t = (distance - traversed) / lengths[edge];
    samples.push(
      new THREE.Vector2(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t),
    );
  }
  // Gaussian filtering has a fixed source-pixel radius, independent of edge length.
  // This preserves long straight strokes while smoothing the low-resolution trace.
  const sigma = 1.35 / (perimeter / count);
  const radius = Math.ceil(sigma * 3);
  const filtered = samples.map((_, i) => {
    const point = new THREE.Vector2();
    let total = 0;
    for (let k = -radius; k <= radius; k++) {
      const weight = Math.exp(-0.5 * (k / sigma) ** 2);
      point.addScaledVector(samples[(i + k + count) % count], weight);
      total += weight;
    }
    point.divideScalar(total);
    return new THREE.Vector2(
      (point.x - centerX) * scale,
      (centerY - point.y) * scale,
    );
  });
  // Uniformly spaced controls avoid the overshoot caused by uneven raster vertices.
  const controls = filtered.filter((_, i) => i % 2 === 0);
  path.moveTo(controls[0].x, controls[0].y);
  controls.forEach((p, i) => {
    const prev = controls[(i + controls.length - 1) % controls.length];
    const next = controls[(i + 1) % controls.length];
    const after = controls[(i + 2) % controls.length];
    const c1 = p.clone().addScaledVector(next.clone().sub(prev), 1 / 6);
    const c2 = next.clone().addScaledVector(p.clone().sub(after), 1 / 6);
    path.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, next.x, next.y);
  });
  path.closePath();
}
