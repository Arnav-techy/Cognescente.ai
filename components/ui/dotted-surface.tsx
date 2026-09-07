import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export interface DottedSurfaceProps {
  className?: string;
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  vertexColors?: boolean;
}

export function DottedSurface({
  className,
  size = 8,
  opacity = 0.8,
  sizeAttenuation = true,
  vertexColors = true,
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Safely get theme from next-themes if inside ThemeProvider
  let themeContext: { theme?: string; resolvedTheme?: string } = {};
  try {
    themeContext = useTheme();
  } catch {
    // Fallback if ThemeProvider is not present
    themeContext = { theme: "dark", resolvedTheme: "dark" };
  }

  const isDark =
    themeContext.resolvedTheme === "dark" ||
    themeContext.theme === "dark" ||
    !themeContext.theme ||
    themeContext.theme === "system";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Grid configuration matching reference wave
    const SEPARATION_X = 90;
    const SEPARATION_Y = 90;
    const AMOUNTX = 60;
    const AMOUNTY = 60;
    const numParticles = AMOUNTX * AMOUNTY;

    // Scene
    const scene = new THREE.Scene();

    // Camera setup - elevated and looking down/forward so top ~55-60% remains dark/empty
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(
      65,
      width / height,
      1,
      10000
    );
    camera.position.set(0, 380, 1150);
    camera.lookAt(0, 20, -100);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(isDark ? 0x030303 : 0xffffff, 1);
    container.appendChild(renderer.domElement);

    // Circular dot texture for smooth points
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(16, 16, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    const dotTexture = new THREE.CanvasTexture(canvas);
    dotTexture.needsUpdate = true;

    // Geometry buffers
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const baseColor = isDark
      ? new THREE.Color(0xf4f4f5) // crisp light gray/white in dark mode
      : new THREE.Color(0x18181b); // dark gray in light mode

    const horizonColor = isDark
      ? new THREE.Color(0x71717a)
      : new THREE.Color(0xa1a1aa);

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const posX = ix * SEPARATION_X - (AMOUNTX * SEPARATION_X) / 2;
        const posY = 0;
        const posZ = iy * SEPARATION_Y - (AMOUNTY * SEPARATION_Y) / 2;

        positions[i] = posX;
        positions[i + 1] = posY;
        positions[i + 2] = posZ;

        // Subtle gradient fading into the horizon
        const depthRatio = Math.max(0, Math.min(1, (posZ + (AMOUNTY * SEPARATION_Y) / 2) / (AMOUNTY * SEPARATION_Y)));
        const pointColor = horizonColor.clone().lerp(baseColor, depthRatio);

        colors[i] = pointColor.r;
        colors[i + 1] = pointColor.g;
        colors[i + 2] = pointColor.b;

        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    if (vertexColors) {
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }

    // Material
    const material = new THREE.PointsMaterial({
      size: size,
      map: dotTexture,
      transparent: true,
      opacity: opacity,
      sizeAttenuation: sizeAttenuation,
      vertexColors: vertexColors,
      color: vertexColors ? 0xffffff : isDark ? 0xf4f4f5 : 0x18181b,
      depthTest: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    let count = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      let idx = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          // Rolling sine wave deformation
          posArray[idx + 1] =
            Math.sin((ix + count) * 0.3) * 48 +
            Math.sin((iy + count) * 0.5) * 48;
          idx += 3;
        }
      }

      posAttr.needsUpdate = true;
      count += 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      dotTexture.dispose();
      renderer.dispose();
    };
  }, [size, opacity, sizeAttenuation, vertexColors, isDark]);

  return (
    <div
      ref={containerRef}
      className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)}
      aria-hidden="true"
    />
  );
}

export default DottedSurface;
