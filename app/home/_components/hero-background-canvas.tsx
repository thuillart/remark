"use client";

import { motion } from "motion/react";
import React from "react";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

interface CanvasProps {
  resolvedTheme: string;
}

export function Canvas({ resolvedTheme }: CanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    let cancelFrame: number;
    const scene = new THREE.Scene();
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;
    let aspectRatio = width / height;

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

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    containerRef.current.appendChild(renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      aspectRatio = width / height;
      renderer.setSize(width, height);
      camera.left = -((50 * aspectRatio) / 2);
      camera.right = (50 * aspectRatio) / 2;
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

    // 6. Material-parameters setup
    const uniforms: THREE.ShaderMaterialParameters["uniforms"] = {
      time: {
        value: 0, // To update the shader on each frame
      },
      lineColor: {
        value: new THREE.Color(resolvedTheme === "dark" ? 0xffffff : 0x000000),
      },
      lineOpacity: {
        value: 0.2,
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
          // Create a grid pattern that moves with time
          // 2.0 controls line frequency, 0.4 controls animation speed
          float coord = (vPos.y * 2.0 + time * 0.4) / 2.0;
          // Create sharp lines using fract and fwidth
          float grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid, 1.0);
          // Output color with opacity based on line pattern
          gl_FragColor = vec4(lineColor, lineOpacity * (1.0 - line));
        }
      `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true, // As we use alpha: true in the renderer
      vertexShader,
      fragmentShader,
    });

    // 7. Mesh-setup (merges geometry & material into a single object)
    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    // 7. Animation-setup (updates the shader on each frame)
    const clock = new THREE.Clock();

    const animate = () => {
      cancelFrame = requestAnimationFrame(animate);
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup (prevents memory leaks on resize)
    return () => {
      cancelAnimationFrame(cancelFrame);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [resolvedTheme]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="size-full"
      transition={{ duration: 0.5 }}
    />
  );
}
