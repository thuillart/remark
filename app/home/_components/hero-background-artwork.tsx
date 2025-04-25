"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

interface BackgroundAnimationProps {
  seed?: number;
  lineFrequency?: number;
  lineColor?: number;
  theme?: "light" | "dark" | "system";
  meshColor?: number;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  panX?: number;
  panY?: number;
  panZ?: number;
  speed?: number;
  noiseFrequency?: number;
  lineOpacity?: number;
  className?: string;
  reverseDirection?: boolean;
}

const BackgroundAnimation = (props: BackgroundAnimationProps) => {
  const {
    seed = 0,
    theme,
    lineFrequency = 5,
    lineColor = 16777215,
    meshColor = 8409136,
    cameraPosition = {
      x: 0,
      y: 100,
      z: 0,
    },
    panX = 0,
    panY = 0,
    panZ = 0,
    speed = 1,
    noiseFrequency = 50,
    lineOpacity = 1,
    reverseDirection = false,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelFrame: number;

    // Create scene
    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const aspectRatio = width / height;

    // Create camera
    const camera = new THREE.OrthographicCamera(
      -((50 * aspectRatio) / 2),
      (50 * aspectRatio) / 2,
      25,
      -25,
      0.1,
      1000,
    );
    camera.position.set(
      cameraPosition.x + panX,
      cameraPosition.y + panY,
      cameraPosition.z + panZ,
    );
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    containerRef.current?.appendChild(renderer.domElement);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        renderer.setSize(newWidth, newHeight);

        const newAspectRatio = newWidth / newHeight;
        camera.left = (-50 * newAspectRatio) / 2;
        camera.right = (50 * newAspectRatio) / 2;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", handleResize);

    // Create geometry
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    planeGeometry.rotateX(-Math.PI / 2);

    // Apply noise to vertices
    const position = planeGeometry.attributes.position;
    const noise = new ImprovedNoise();
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      const noiseValue = noise.noise(
        vertex.x / noiseFrequency,
        vertex.z / noiseFrequency,
        seed,
      );
      position.setY(i, 30 * noiseValue);
    }

    planeGeometry.computeVertexNormals();

    // Create uniforms
    const uniforms = {
      time: { value: 0 },
      lineFrequency: { value: lineFrequency },
      lineColor: {
        value: new THREE.Color(theme === "dark" ? 0xffffff : 0x000000),
      },
      meshColor: { value: new THREE.Color(meshColor) },
      lineThickness: { value: 1 },
      speed: { value: reverseDirection ? -speed : speed },
      lineOpacity: { value: lineOpacity },
    };

    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float lineFrequency;
        uniform vec3 lineColor;
        uniform float lineThickness;
        uniform float speed;
        uniform float lineOpacity;
        varying vec3 vPos;

        // This creates a monochrome effect by averaging the RGB values
        // It uses a combination of sine waves to create a more natural looking gradient
        vec3 monochromeMask(float coord, float hueShift) {
          float r = sin(coord * 0.5 + hueShift + sin(vPos.x * 0.1) + time * 0.1) * 0.45 + 0.45;
          float g = sin(coord * 0.5 + hueShift + sin(vPos.z * 0.1) + time * 0.2 + 2.0) * 0.4 + 0.4; // Darker green
          float b = sin(coord * 0.5 + hueShift + sin((vPos.x + vPos.z) * 0.1) + time * 0.3 + 4.0) * 0.40 + 0.40;
          float opacity = (r + g + b) / 3.0; // Average the RGB values to get monochromatic
          return vec3(opacity, opacity, opacity);
        }

        void main() {
          // 1. Create a grid pattern
          float coord = (vPos.y * lineFrequency + time * speed) / 2.0;
          float grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / lineThickness;
          float line = min(grid, 1.0);

          // 2. Inject the monochrome effect
          float hueShiftAmount = mod(time * 0.5, 6.28);
          vec3 lineColor = monochromeMask((vPos.x + vPos.z) * 0.0001, hueShiftAmount);

          gl_FragColor = vec4(lineColor, lineOpacity * (1.0 - line));
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);

    // Animation loop with fixed timing
    const clock = new THREE.Clock();

    const animate = () => {
      let lastTime = performance.now();

      const frame = () => {
        cancelFrame = requestAnimationFrame(frame);

        const currentTime = performance.now();
        const delta = currentTime - lastTime;

        if (delta >= 16.666666666666668) {
          lastTime = currentTime - (delta % 16.666666666666668);

          uniforms.time.value = clock.getElapsedTime();
          renderer.render(scene, camera);
        }
      };

      frame();
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(cancelFrame);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [
    seed,
    lineFrequency,
    meshColor,
    cameraPosition,
    panX,
    panY,
    panZ,
    speed,
    noiseFrequency,
    lineOpacity,
    reverseDirection,
    theme,
  ]);

  return <div ref={containerRef} className="size-full" />;
};

export function HeroBackgroundArtwork() {
  const { theme } = useTheme();

  return (
    <div className="-z-1 -translate-x-1/2 absolute bottom-0 left-1/2 size-full [mask:radial-gradient(ellipse_at_center_calc(100%_-_100px),var(--color-background),transparent_75%)]">
      <div className="relative size-full">
        <BackgroundAnimation
          seed={8}
          panX={0}
          panY={0}
          panZ={0}
          theme={theme as "light" | "dark" | "system"}
          speed={0.4}
          lineColor={0}
          meshColor={16777215}
          lineOpacity={0.3}
          lineFrequency={2}
          cameraPosition={{ x: 0, z: 0, y: 100 }}
          noiseFrequency={200}
          reverseDirection={false}
        />
      </div>
    </div>
  );
}
