"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React from "react";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

export function HeroCanvas() {
  const { theme, resolvedTheme } = useTheme();
  const materialRef = React.useRef<THREE.ShaderMaterial | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // If the theme is not light or dark, use the resolvedTheme
  const currentTheme =
    theme === "light" || theme === "dark" ? theme : resolvedTheme;

  // Effect to update material color when theme changes
  React.useEffect(() => {
    if (!materialRef.current) return;

    const white = new THREE.Color(0xffffff);
    const black = new THREE.Color(0x000000);
    materialRef.current.uniforms.lineColor.value =
      currentTheme === "dark" ? white : black;
  }, [currentTheme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to run on every render
  React.useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene-setup
    let cancelFrame: number;
    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const aspectRatio = width / height;

    // 2. Camera-setup
    // Using OrthographicCamera for a 2D-like effect without perspective distortion
    // The camera is positioned above the plane to create a top-down view
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

    // 3. Renderer-setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true, // Transparent background
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Higher for retina displays
    containerRef.current.appendChild(renderer.domElement);

    // 4. Handle resize
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

    // 5. Geometry-setup
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    planeGeometry.rotateX(-Math.PI / 2); // Makes plane horizontal

    const position = planeGeometry.attributes.position;
    const noise = new ImprovedNoise();
    const vertex = new THREE.Vector3();

    // Creates a grid of lines on the plane
    // Apply Perlin noise to Y coordinates to create organic wave-like patterns
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      // Scale noise input (200) and amplitude (30) for desired wave size and height
      const noiseValue = noise.noise(vertex.x / 200, vertex.z / 200, 8);
      position.setY(i, 30 * noiseValue);
    }

    // Recalculate normals after modifying geometry for proper lighting
    planeGeometry.computeVertexNormals();

    const black: THREE.Color = new THREE.Color(0x000000);
    const white: THREE.Color = new THREE.Color(0xffffff);

    // 6. Material-parameters setup
    const uniforms: THREE.ShaderMaterialParameters["uniforms"] = {
      time: {
        value: 0, // To update the shader on each frame
      },
      lineColor: {
        value: currentTheme === "dark" ? white : black,
      },
      lineOpacity: {
        value: 1,
      },
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
          // 1. Calculate coordinate for grid pattern animation
          float coord = (vPos.y * 2.0 + time * 0.4) / 2.0;
  
          // 2. Generate sharp grid lines
          float grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  
          // 3. Limit line intensity to maximum of 1.0
          float line = min(grid, 1.0);
  
          // 4. Output final color
          gl_FragColor = vec4(lineColor, lineOpacity * (1.0 - line));
        }
      `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    materialRef.current = material;

    // 7. Mesh-setup (merges geometry & material into a single object)
    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    // 8. Animation-setup (updates the shader on each frame)
    const clock = new THREE.Clock();

    const animate = () => {
      cancelFrame = requestAnimationFrame(animate);
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup (prevents memory leaks on resize)
    return () => {
      cancelAnimationFrame(cancelFrame);
      renderer.dispose();
      scene.remove(mesh);
      mesh.geometry.dispose();
      materialRef.current?.dispose();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      className="size-full"
    />
  );
}
