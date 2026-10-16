"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Lumera's hero: a slow-turning volume of light built from thousands of
 * points, pulled into a torus knot and drifting on curl-like noise.
 *
 * Deliberately not an object — AesthetIQ's hero is a rendered invoice card,
 * and this product is the free one, so it reads as light rather than
 * paperwork. The whole thing is one BufferGeometry and one ShaderMaterial:
 * the motion happens on the GPU, so the cost is flat regardless of count.
 */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uPointer;
  attribute float aScale;
  attribute vec3 aSeed;
  varying float vFade;

  // Cheap value noise — enough to break up the lattice without the cost of
  // a real simplex implementation on every vertex, every frame.
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
  }

  void main() {
    vec3 pos = position;

    // Breathing drift: each point follows its own slow loop, seeded so the
    // field never pulses in unison.
    float t = uTime * 0.22 + aSeed.x * 6.283;
    pos += vec3(
      sin(t + aSeed.y * 3.0) * 0.18,
      cos(t * 1.3 + aSeed.z * 3.0) * 0.18,
      sin(t * 0.8 + aSeed.x * 3.0) * 0.18
    );

    // Pointer parallax, strongest on the points nearest the camera so the
    // volume feels like it has depth rather than sliding as one plane.
    float depth = smoothstep(-2.0, 2.0, pos.z);
    pos.xy += uPointer * depth * 0.42;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Perspective-correct sizing, plus a per-point variation.
    gl_PointSize = uSize * aScale * (1.0 / -mvPosition.z);

    // Fade with distance so the far side of the knot sits behind the near
    // side instead of reading as one flat sheet of dots.
    vFade = smoothstep(-5.0, 1.5, mvPosition.z) * (0.45 + hash(aSeed) * 0.55);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vFade;

  void main() {
    // Round the square point sprite and feather its edge.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, d) * vFade;

    gl_FragColor = vec4(mix(uColorA, uColorB, vFade), alpha);
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
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      // Sample points off a torus knot so the cloud has a readable silhouette
      // instead of being an undifferentiated ball of noise.
      const COUNT = lowPower ? 14000 : 42000;
      const source = new THREE.TorusKnotGeometry(2.0, 0.62, 420, 48, 2, 3);
      const sourcePositions = source.attributes.position;

      const positions = new Float32Array(COUNT * 3);
      const scales = new Float32Array(COUNT);
      const seeds = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        const v = Math.floor(Math.random() * sourcePositions.count);
        // Scatter around the surface point rather than sitting exactly on it,
        // which is what turns a mesh into a volume.
        const spread = 0.26;
        positions[i * 3] = sourcePositions.getX(v) + (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = sourcePositions.getY(v) + (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = sourcePositions.getZ(v) + (Math.random() - 0.5) * spread;

        scales[i] = 0.5 + Math.random() * 1.6;
        seeds[i * 3] = Math.random();
        seeds[i * 3 + 1] = Math.random();
        seeds[i * 3 + 2] = Math.random();
      }
      source.dispose();

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

      const uniforms = {
        uTime: { value: 0 },
        uSize: { value: lowPower ? 420 : 300 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        // Violet into amber: the brand's two poles, so the cloud carries the
        // palette rather than being generic blue.
        uColorA: { value: new THREE.Color(0x6d28d9) },
        uColorB: { value: new THREE.Color(0xfbbf24) },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        // Additive, so overlapping points build light where the knot folds
        // over itself — that is where the glow comes from.
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      function resize() {
        const rect = container!.getBoundingClientRect();
        const w = Math.max(rect.width, 1);
        const h = Math.max(rect.height, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
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
          points.rotation.y = t * 0.09;
          points.rotation.x = Math.sin(t * 0.15) * 0.16;
        }

        // Entrance: the cloud scales up once, so the first paint is a reveal
        // rather than a hard cut.
        const intro = Math.min(t / 1.6, 1);
        const eased = 1 - Math.pow(1 - intro, 4);
        points.scale.setScalar(0.72 + eased * 0.28);

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
