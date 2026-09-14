import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createLogoSculpture } from "./LogoSculpture";

export default function HeroScene({ paused = false }: { paused?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const small = innerWidth < 700;
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 11);
    const logo = createLogoSculpture(small);
    const group = logo.group;
    scene.add(group);
    scene.add(new THREE.AmbientLight(0x80bcff, 2));
    [
      [-4, 4, 4, 0xffffff, 45],
      [4, 1, 3, 0x227aff, 70],
      [0, -4, 2, 0x79efff, 50],
    ].forEach(([x, y, z, color, intensity]) => {
      const l = new THREE.PointLight(color, intensity, 20);
      l.position.set(x, y, z);
      scene.add(l);
    });
    const count = small ? 160 : 480;
    const points = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    let seed = 72;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2,
        r = 2.3 + random() * 3.4;
      base[i * 3] = Math.cos(a) * r;
      base[i * 3 + 1] = Math.sin(a) * r * 0.69;
      base[i * 3 + 2] = (random() - 0.5) * 4;
    }
    points.set(base);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(points, 3));
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uRatio: { value: renderer.getPixelRatio() } },
      vertexShader:
        "uniform float uRatio; varying float vDepth; void main(){vec4 p=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*p; gl_PointSize=clamp(38./-p.z,2.,6.)*uRatio;vDepth=clamp(8./-p.z,.2,1.);}",
      fragmentShader:
        "varying float vDepth; void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(.4,.75,1.,a*vDepth*.85);}",
    });
    const particles = new THREE.Points(pg, particleMaterial);
    scene.add(particles);
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    const orbitDots: THREE.Mesh[] = [];
    for (let j = 0; j < 3; j++) {
      const path = [];
      for (let i = 0; i <= 160; i++) {
        const t = (i / 160) * Math.PI * 2;
        path.push(
          new THREE.Vector3(
            Math.cos(t) * (3.05 + j * 0.33),
            Math.sin(t) * (2.15 + j * 0.2),
            0,
          ),
        );
      }
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(path),
        new THREE.LineBasicMaterial({
          color: 0x63aaff,
          transparent: true,
          opacity: 0.18 - j * 0.025,
        }),
      );
      line.rotation.set(0.45 + j * 0.3, 0.2 + j * 0.25, j * 0.5);
      orbitGroup.add(line);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.036, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xa3eaff }),
      );
      orbitDots.push(dot);
      line.add(dot);
    }
    const connections = new Float32Array(70 * 6);
    const cg = new THREE.BufferGeometry();
    cg.setAttribute("position", new THREE.BufferAttribute(connections, 3));
    cg.setDrawRange(0, 0);
    const links = new THREE.LineSegments(
      cg,
      new THREE.LineBasicMaterial({
        color: 0x56abff,
        transparent: true,
        opacity: 0.24,
      }),
    );
    scene.add(links);
    const pulses = Array.from({ length: 5 }, () => {
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0x93dbff }),
      );
      scene.add(pulse);
      return pulse;
    });
    let mouseX = 0,
      mouseY = 0,
      turn = 0,
      dragging = false,
      lastX = 0,
      visible = true,
      frame = 0,
      lastTime = 0,
      elapsed = 0,
      disposed = false;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const bounds = () => container.getBoundingClientRect();
    const move = (e: PointerEvent) => {
      const b = bounds();
      mouseX = ((e.clientX - b.left) / b.width) * 2 - 1;
      mouseY = -(((e.clientY - b.top) / b.height) * 2 - 1);
      if (dragging) {
        turn += (e.clientX - lastX) * 0.004;
        lastX = e.clientX;
      }
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        dragging = true;
        lastX = e.clientX;
        container.setPointerCapture(e.pointerId);
      }
    };
    const up = () => {
      dragging = false;
    };
    const leave = () => {
      if (!dragging) {
        mouseX = 0;
        mouseY = 0;
      }
    };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerdown", down);
    container.addEventListener("pointerup", up);
    container.addEventListener("pointercancel", up);
    container.addEventListener("pointerleave", leave);
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    const render = (time: number) => {
      if (disposed) return;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (visible && !document.hidden) {
        if (!reduce.matches && !paused)
          elapsed += dt * (1 + Math.min(scrollY / innerHeight, 1) * 0.75);
        const t = elapsed;
        const scroll =
          reduce.matches || paused ? 0 : Math.min(scrollY / innerHeight, 1);
        group.rotation.y +=
          (-0.38 +
            Math.sin(t * 0.25) * 0.13 +
            turn +
            mouseX * 0.12 -
            group.rotation.y) *
          0.035;
        group.rotation.x += (0.08 + mouseY * 0.07 - group.rotation.x) * 0.035;
        group.rotation.z = Math.sin(t * 0.18) * 0.015;
        group.position.y = Math.sin(t * 0.65) * 0.055 + scroll * 0.3;
        camera.position.z = 11 - scroll * 0.7;
        logo.update(t);
        orbitGroup.rotation.z = t * 0.017 + mouseX * 0.025;
        orbitDots.forEach((dot, j) => {
          const a = t * (0.18 + j * 0.06) + j * 2;
          dot.position.set(
            Math.cos(a) * (3.05 + j * 0.33),
            Math.sin(a) * (2.15 + j * 0.2),
            0,
          );
        });
        let segments = 0;
        for (let i = 0; i < count; i++) {
          const k = i * 3;
          points[k] = base[k] + Math.sin(t * 0.2 + i) * 0.06;
          points[k + 1] = base[k + 1] + Math.cos(t * 0.16 + i) * 0.06;
          points[k + 2] = base[k + 2];
          const dx = points[k] - mouseX * 4,
            dy = points[k + 1] - mouseY * 3,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 1.5) {
            points[k] += dx * (1.5 - d) * 0.16;
            points[k + 1] += dy * (1.5 - d) * 0.16;
          }
          if (i < 70 && segments < 70) {
            const next = ((i + 1) % count) * 3;
            const distance = Math.hypot(
              points[k] - points[next],
              points[k + 1] - points[next + 1],
            );
            if (distance < 1.65) {
              connections.set(points.subarray(k, k + 3), segments * 6);
              connections.set(
                points.subarray(next, next + 3),
                segments * 6 + 3,
              );
              segments++;
            }
          }
        }
        pg.attributes.position.needsUpdate = true;
        cg.attributes.position.needsUpdate = true;
        cg.setDrawRange(0, segments * 2);
        pulses.forEach((pulse, index) => {
          pulse.visible = index < segments;
          if (!pulse.visible) return;
          const offset = index * 6;
          const progress = (t * 0.35 + index * 0.19) % 1;
          pulse.position.set(
            THREE.MathUtils.lerp(
              connections[offset],
              connections[offset + 3],
              progress,
            ),
            THREE.MathUtils.lerp(
              connections[offset + 1],
              connections[offset + 4],
              progress,
            ),
            THREE.MathUtils.lerp(
              connections[offset + 2],
              connections[offset + 5],
              progress,
            ),
          );
        });
        renderer.render(scene, camera);
      }
      if (!reduce.matches && !paused) frame = requestAnimationFrame(render);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    observer.observe(container);
    const visibility = () => {
      if (!document.hidden && visible) start();
      else cancelAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", visibility);
    const contextLost = (event: Event) => {
      event.preventDefault();
      container.classList.remove("scene-ready");
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    reduce.addEventListener("change", start);
    start();
    container.classList.add("scene-ready");
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reduce.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", visibility);
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerdown", down);
      container.removeEventListener("pointerup", up);
      container.removeEventListener("pointercancel", up);
      container.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.Points
        ) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((m: THREE.Material) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [paused]);
  return (
    <div className="scene" ref={host} aria-hidden="true">
      <div className="scene-fallback logo-fallback">
        <img
          src="media/takhleeqi-logo-wireframe.svg"
          alt=""
          width="200"
          height="200"
        />
      </div>
    </div>
  );
}
