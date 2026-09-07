import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface NeonRGBTextEffectProps {
  text?: string;
  className?: string;
  intensity?: number;
  fontWeight?: number | string;
  maxFontSize?: number;
  minFontSize?: number;
}

export function NeonRGBTextEffect({
  text = "Cognescente.ai",
  className,
  intensity = 1.0,
  fontWeight = 700,
  maxFontSize = 96,
  minFontSize = 24,
}: NeonRGBTextEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Scene & Orthographic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Offscreen 2D canvas for high-resolution text rendering
    const textCanvas = document.createElement("canvas");
    const ctx = textCanvas.getContext("2d", { willReadFrequently: false });

    let currentTexture: THREE.CanvasTexture | null = null;

    // Custom Shader Material for Subtle Neon RGB Chromatic Separation
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_intensity;
      uniform vec2 u_resolution;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        // Discard outside boundaries
        if (uv.x <= 0.001 || uv.x >= 0.999 || uv.y <= 0.001 || uv.y >= 0.999) {
          discard;
        }

        float t = u_time * 1.6;

        // Gentle subtle wave along vertical axis
        float scanWave = sin(uv.y * 30.0 + t * 2.5) * 0.0006;
        
        // Occasional very subtle digital glitch micro-slice
        float glitchBand = step(0.992, sin(uv.y * 16.0 + t * 4.0)) * 0.0016;
        
        float rOffset = (0.0024 + scanWave + glitchBand) * u_intensity;
        float bOffset = (0.0022 + scanWave * 0.75 + glitchBand * 1.1) * u_intensity;

        // Sample RGB channels with chromatic displacement
        vec4 rColor = texture2D(u_texture, clamp(uv + vec2(rOffset, 0.0), 0.0, 1.0));
        vec4 gColor = texture2D(u_texture, uv);
        vec4 bColor = texture2D(u_texture, clamp(uv - vec2(bOffset, 0.0), 0.0, 1.0));

        float alpha = max(gColor.a, max(rColor.a, bColor.a));
        if (alpha < 0.005) {
          discard;
        }

        // Primary white core with subtle chromatic fringe separation
        vec3 rgb = vec3(rColor.r, gColor.g, bColor.b);
        float coreOverlap = min(rColor.a, min(gColor.a, bColor.a));
        rgb = mix(rgb, vec3(1.0), coreOverlap * 0.92);

        gl_FragColor = vec4(rgb, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_texture: { value: null },
        u_time: { value: 0.0 },
        u_intensity: { value: intensity },
        u_resolution: { value: new THREE.Vector2(1, 1) },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const updateTextAndSize = () => {
      if (!container || !ctx) return;

      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Set high-res canvas dimensions
      textCanvas.width = Math.floor(width * dpr);
      textCanvas.height = Math.floor(height * dpr);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Proportional font sizing based on container width and height
      let targetFontSize = Math.min(
        maxFontSize,
        Math.max(minFontSize, Math.floor(height * 0.72))
      );

      ctx.font = `${fontWeight} ${targetFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

      // If text exceeds width bounds, shrink font down smoothly
      let metrics = ctx.measureText(text);
      while (metrics.width > width * 0.94 && targetFontSize > 11) {
        targetFontSize -= 1;
        ctx.font = `${fontWeight} ${targetFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
        metrics = ctx.measureText(text);
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, width / 2, height / 2);
      ctx.restore();

      // Dispose and re-create texture to handle WebGL dimension changes cleanly on resize
      if (currentTexture) {
        currentTexture.dispose();
      }
      currentTexture = new THREE.CanvasTexture(textCanvas);
      currentTexture.minFilter = THREE.LinearFilter;
      currentTexture.magFilter = THREE.LinearFilter;
      currentTexture.wrapS = THREE.ClampToEdgeWrapping;
      currentTexture.wrapT = THREE.ClampToEdgeWrapping;
      currentTexture.generateMipmaps = false;

      material.uniforms.u_texture.value = currentTexture;
      renderer.setSize(width, height);
      material.uniforms.u_resolution.value.set(width * dpr, height * dpr);
    };

    updateTextAndSize();

    // Resize observer & window listener
    const resizeObserver = new ResizeObserver(() => {
      updateTextAndSize();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", updateTextAndSize);

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      material.uniforms.u_time.value = performance.now() * 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTextAndSize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      if (currentTexture) {
        currentTexture.dispose();
      }
      renderer.dispose();
    };
  }, [text, intensity, fontWeight, maxFontSize, minFontSize]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex items-center justify-center pointer-events-none select-none",
        className
      )}
      aria-label={text}
    />
  );
}

export default NeonRGBTextEffect;
