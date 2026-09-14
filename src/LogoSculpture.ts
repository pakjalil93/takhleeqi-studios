import * as THREE from "three";
import logo from "./assets/logo-shapes.json";
import { drawSmoothLogoContour } from "./logoContours";

/** Extrudes the actual supplied mark, including its eight islands and inner hole. */
export function createLogoSculpture(small: boolean) {
  const group = new THREE.Group();
  const centerX = (logo.bounds.minX + logo.bounds.maxX) / 2;
  const centerY = (logo.bounds.minY + logo.bounds.maxY) / 2;
  const scale = 3.65 / (logo.bounds.maxX - logo.bounds.minX);
  const drawContour = (path: THREE.Path, contour: number[][]) =>
    drawSmoothLogoContour(path, contour, centerX, centerY, scale);
  const shapes = logo.shapes.map(({ outline, holes }) => {
    const shape = new THREE.Shape();
    drawContour(shape, outline);
    holes.forEach((points) => {
      const hole = new THREE.Path();
      drawContour(hole, points);
      shape.holes.push(hole);
    });
    return shape;
  });
  const depth = 0.62;
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    steps: 1,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.024,
    bevelSegments: small ? 3 : 5,
    curveSegments: 3,
  });
  geometry.translate(0, 0, -depth / 2);
  // Transparent surfaces reveal both the front grid and the depth behind it.
  const hologram = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: `varying vec3 vLocal; varying vec3 vNormal; varying vec3 vView;
      void main(){vLocal=position;vec4 p=modelViewMatrix*vec4(position,1.);
        vNormal=normalize(normalMatrix*normal);vView=-p.xyz;
        gl_Position=projectionMatrix*p;}`,
    fragmentShader: `uniform float uTime;varying vec3 vLocal;varying vec3 vNormal;varying vec3 vView;
      float grid(vec2 p,float pitch){
        vec2 coord=p/pitch;
        vec2 distance=abs(fract(coord-.5)-.5)/max(fwidth(coord),vec2(.0001));
        return 1.-smoothstep(.35,1.1,min(distance.x,distance.y));
      }
      void main(){
        vec3 n=abs(normalize(cross(dFdx(vLocal),dFdy(vLocal))));
        n=pow(n,vec3(6.));n/=max(n.x+n.y+n.z,.001);
        float fine=grid(vLocal.yz,.085)*n.x+grid(vLocal.xz,.085)*n.y+grid(vLocal.xy,.085)*n.z;
        float major=grid(vLocal.yz,.425)*n.x+grid(vLocal.xz,.425)*n.y+grid(vLocal.xy,.425)*n.z;
        float fresnel=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.5);
        float scan=exp(-pow((vLocal.y-(mod(uTime*.35,5.)-2.5))*7.,2.));
        float front=gl_FrontFacing?1.:.42;
        float alpha=(.012+fine*.15+major*.2+fresnel*.24+scan*.045)*front;
        vec3 color=mix(vec3(.035,.32,1.),vec3(.35,.84,1.),max(major*.6,fresnel));
        gl_FragColor=vec4(color,alpha);
      }`,
  });
  group.add(new THREE.Mesh(geometry, hologram));

  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.55, 1.3, 2.1),
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x219aff,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const sliceMaterial = new THREE.LineBasicMaterial({
    color: 0x319fff,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const ribs: number[] = [];
  for (const shape of shapes) {
    for (const contour of [shape, ...shape.holes]) {
      const length = contour.getLength();
      const samples = Math.max(
        32,
        Math.min(small ? 280 : 480, Math.ceil(length * 65)),
      );
      const outline = contour.getSpacedPoints(samples).slice(0, -1);
      // Nested depth contours create the luminous, layered engineering-wire look.
      const layers = small ? 5 : 9;
      for (let layer = 0; layer < layers; layer++) {
        const z = -depth / 2 + (layer / (layers - 1)) * depth;
        const points = outline.map((p) => new THREE.Vector3(p.x, p.y, z));
        group.add(
          new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(points),
            sliceMaterial,
          ),
        );
      }
      for (const z of [-depth / 2 - 0.025, depth / 2 + 0.025]) {
        const path = new THREE.CatmullRomCurve3(
          outline.map((p) => new THREE.Vector3(p.x, p.y, z)),
          true,
          "centripetal",
        );
        group.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(path, samples, 0.009, small ? 6 : 8, true),
            edgeMaterial,
          ),
        );
        group.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(path, samples, 0.032, 8, true),
            glowMaterial,
          ),
        );
        if (!small)
          group.add(
            new THREE.Mesh(
              new THREE.TubeGeometry(path, samples, 0.065, 6, true),
              glowMaterial,
            ),
          );
      }
      for (
        let i = 0;
        i < outline.length;
        i += Math.max(2, Math.round(outline.length / (length * 12)))
      ) {
        const p = outline[i];
        ribs.push(p.x, p.y, -depth / 2, p.x, p.y, depth / 2);
      }
    }
  }
  const ribGeometry = new THREE.BufferGeometry();
  ribGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(ribs, 3),
  );
  group.add(new THREE.LineSegments(ribGeometry, sliceMaterial));
  group.rotation.set(0.08, -0.3, 0);
  return {
    group,
    update(time: number) {
      hologram.uniforms.uTime.value = time;
      edgeMaterial.opacity = 0.87 + Math.sin(time * 0.7) * 0.07;
      glowMaterial.opacity = 0.095 + Math.sin(time * 0.7) * 0.012;
    },
  };
}
