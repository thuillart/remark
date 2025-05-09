"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import React from "react";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

type Theme = "light" | "dark";

const black = new THREE.Color(0x000000);
const white = new THREE.Color(0xffffff);

export function HeroCanvas() {
  const { theme, resolvedTheme } = useTheme();

  const materialRef = React.useRef<THREE.ShaderMaterial | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scheme: Theme =
    theme === "light" || theme === "dark"
      ? (theme as Theme)
      : (resolvedTheme as Theme);

  React.useEffect(() => {
    if (!materialRef.current) return;
    const isDark = scheme === "dark";
    materialRef.current.uniforms.lineColor.value = isDark ? white : black;
  }, [scheme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to re-render the canvas when the theme changes
  React.useEffect(() => {
    if (!containerRef.current) return;

    let cancelFrame: number;
    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const aspectRatio = width / height;

    const camera = new THREE.OrthographicCamera(
      -((50 * aspectRatio) / 2),
      (50 * aspectRatio) / 2,
      25,
      -25,
      0.1,
      1000,
    );
    camera.position.set(0, 100, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    containerRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      renderer.setSize(newWidth, newHeight);
      const newAspectRatio = newWidth / newHeight;
      camera.left = (-50 * newAspectRatio) / 2;
      camera.right = (50 * newAspectRatio) / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    const planeGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    planeGeometry.rotateX(-Math.PI / 2);
    applyNoiseToGeometry(planeGeometry);

    const isDark = scheme === "dark";
    const material = createShaderMaterial(isDark);
    materialRef.current = material;

    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    const animate = () => {
      cancelFrame = requestAnimationFrame(animate);
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  function applyNoiseToGeometry(geometry: THREE.PlaneGeometry) {
    const position = geometry.attributes.position;
    const noise = new ImprovedNoise();
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      const noiseValue = noise.noise(vertex.x / 200, vertex.z / 200, 8);
      position.setY(i, 30 * noiseValue);
    }

    geometry.computeVertexNormals();
  }

  function createShaderMaterial(isDark: boolean) {
    const uniforms: THREE.ShaderMaterialParameters["uniforms"] = {
      time: { value: 0 },
      lineColor: { value: isDark ? white : black },
      lineOpacity: { value: 1 },
    };

    const vertexShader = `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 lineColor;
      uniform float lineOpacity;
      varying vec3 vPos;

      void main() {
        float coord = (vPos.y * 2.0 + time * 0.4) / 2.0;
        float line = 1.0 - smoothstep(0.0, 0.008, abs(fract(coord - 0.5) - 0.5));
        gl_FragColor = vec4(lineColor, lineOpacity * line);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      className="size-full"
    />
  );
}
