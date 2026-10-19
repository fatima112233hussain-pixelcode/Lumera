"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Softco's hero: a slowly turning sphere of light, drawn as a point cloud
 * with a bright rim and a sparse interior.
 *
 * A sphere rather than a knot on purpose — a knot photographs differently
 * at every angle, so the hero looked like a different thing on every visit,
 * and at small sizes the folds read as noise. A shell has one silhouette
 * from every direction, which is what a hero needs.
 *
 * The structure comes from where the points sit, not from their colour:
 * density is biased hard toward the surface, so the edge is a crisp ring of
 * light and the middle stays open enough to read the headline through.
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  attribute float aScale;
  attribute vec3 aSeed;
  varying float vGlow;
  varying float vSeed;

  void main() {
    vec3 pos = position;

    // Each point drifts on its own small loop, so the shell shimmers
    // rather than sitting still.
    float t = uTime * 0.3 + aSeed.x * 6.283;
    pos += vec3(
      sin(t + aSeed.y * 5.0),
      cos(t * 1.2 + aSeed.z * 5.0),
      sin(t * 0.9 + aSeed.x * 5.0)
    ) * 0.07;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Pointer parallax, strongest at the front of the shell.
    float depth = smoothstep(-3.0, 3.0, mv.z);
    mv.xy += uPointer * depth * 0.5;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * aScale * (1.0 / -mv.z);

    // Front of the shell is brighter than the back, which is what gives a
    // flat scatter of points the appearance of a volume.
    vGlow = smoothstep(-4.0, 2.0, mv.z);
    vSeed = aSeed.x;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vGlow;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // A soft core with a long falloff reads as a glowing speck rather than
    // a hard dot.
    float core = smoothstep(0.5, 0.0, d);
    float alpha = core * core * (0.1 + vGlow * 0.5);

    // Sky blue is the minority colour: a few points in it keep the field
    // from being a single flat Softco blue.
    vec3 tint = mix(uColorA, uColorB, step(0.88, vSeed));
    gl_FragColor = vec4(tint, alpha);
  }
`;

export function AuroraScene({ onUnsupported }: { onUnsupported?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        onUnsupported?.();
        return;
      }
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        if (!renderer.getContext()) throw new Error("no webgl");
      } catch {
        onUnsupported?.();
        return;
      }

      const lowPower =
        window.matchMedia("(max-width: 700px)").matches ||
        (navigator.hardwareConcurrency ?? 8) <= 4;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 8);

      const COUNT = lowPower ? 6500 : 17000;
      const positions = new Float32Array(COUNT * 3);
      const scales = new Float32Array(COUNT);
      const seeds = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        // Even directions on the sphere, via the standard z-then-angle
        // method — rejection or naive angle pairs would bunch at the poles.
        const u = Math.random() * 2 - 1;
        const theta = Math.random() * Math.PI * 2;
        const r = Math.sqrt(1 - u * u);

        // Radius biased hard to the surface: a high power pushes almost
        // everything into a thin shell and leaves the centre open.
        const radius = 2.7 * Math.pow(Math.random(), 0.06);

        positions[i * 3] = Math.cos(theta) * r * radius;
        positions[i * 3 + 1] = u * radius;
        positions[i * 3 + 2] = Math.sin(theta) * r * radius;

        scales[i] = 0.45 + Math.random() * 1.3;
        seeds[i * 3] = Math.random();
        seeds[i * 3 + 1] = Math.random();
        seeds[i * 3 + 2] = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

      const uniforms = {
        uTime: { value: 0 },
        uSize: { value: lowPower ? 95 : 72 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: new THREE.Color(0x5b8cff) },
        uColorB: { value: new THREE.Color(0x97ddff) },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const field = new THREE.Points(geometry, material);
      scene.add(field);

      function resize() {
        const rect = container!.getBoundingClientRect();
        const w = Math.max(rect.width, 1);
        const h = Math.max(rect.height, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        uniforms.uPixelRatio.value = renderer.getPixelRatio();
      }
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const pointerTarget = { x: 0, y: 0 };
      function onPointerMove(event: PointerEvent) {
        const rect = container!.getBoundingClientRect();
        pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      }
      const pointerFine = window.matchMedia(
        "(pointer: fine) and (hover: hover)",
      ).matches;
      if (pointerFine && !reducedMotion) {
        window.addEventListener("pointermove", onPointerMove);
      }

      let frame = 0;
      const start = performance.now();

      function draw(time: number) {
        const t = (time - start) / 1000;
        uniforms.uTime.value = t;

        const p = uniforms.uPointer.value;
        p.x += (pointerTarget.x - p.x) * 0.04;
        p.y += (pointerTarget.y - p.y) * 0.04;

        if (!reducedMotion) {
          field.rotation.y = t * 0.075;
          field.rotation.x = Math.sin(t * 0.12) * 0.1;
        }

        const intro = Math.min(t / 1.8, 1);
        const eased = 1 - Math.pow(1 - intro, 4);
        field.scale.setScalar(0.8 + eased * 0.2);

        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      }
      frame = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        container!.removeChild(renderer.domElement);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="size-full" aria-hidden />;
}
