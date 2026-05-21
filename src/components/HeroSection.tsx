import React, { useEffect, useRef } from 'react';
import { ArrowDown, Play } from 'lucide-react';
import gsap from 'gsap';
import * as THREE from 'three';

interface HeroSectionProps {
  onExploreClick: () => void;
  onAcousticClick: () => void;
  heroImg: string;
  isDarkMode: boolean;
}

export default function HeroSection({ onExploreClick, onAcousticClick, heroImg, isDarkMode }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [webglError, setWebglError] = React.useState(false);

  // Sync background color smoothly into WebGL shader when isDarkMode changes
  useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms && materialRef.current.uniforms.uBgColor) {
      const targetColor = isDarkMode ? new THREE.Color('#030303') : new THREE.Color('#f4f5f7');
      gsap.to(materialRef.current.uniforms.uBgColor.value, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (webglError || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.OrthographicCamera | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let mesh: THREE.Mesh | null = null;
    let texture: THREE.Texture | null = null;
    let animationFrameId: number | null = null;

    // Handlers defined outside try so cleanup can references them
    let handleResize: (() => void) | null = null;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let mouseEnterHandler: (() => void) | null = null;
    let mouseLeaveHandler: (() => void) | null = null;

    try {
      // Standard Three.js initialization with extra diagnostics check
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });

      if (!renderer || !renderer.getContext()) {
        throw new Error("Unable to retrieve valid WebGL context.");
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);

      scene = new THREE.Scene();

      // Using an Orthographic Camera for pixel-perfect 2D full-viewport quad
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Custom Shaders
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec2 uTextureSize;
        uniform vec3 uBgColor;
        uniform vec2 uMouse;
        uniform float uTime;
        uniform float uHover;
        varying vec2 vUv;

        void main() {
          vec2 s = uResolution;
          vec2 i = uTextureSize;
          
          float rs = s.x / s.y;
          float ri = i.x / i.y;
          vec2 uv = vUv;
          
          // Dynamic "object-fit: contain" scaling calculation inside shader
          if (rs > ri) {
            float val = ri / rs;
            uv.y = uv.y * val + (1.0 - val) * 0.5;
          } else {
            float val = rs / ri;
            uv.x = uv.x * val + (1.0 - val) * 0.5;
          }
          
          // Out-of-bounds gets clean background fills
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            gl_FragColor = vec4(uBgColor, 1.0);
            return;
          }
          
          // Wind-tunnel aerodynamic waviness
          float speedLine = sin(uv.y * 32.0 - uTime * 4.5) * cos(uv.x * 12.0 + uTime * 2.0) * 0.0035;
          float waves = sin(uv.x * 20.0 - uTime * 5.0) * 0.0045;
          
          // Interactive mouse pointer wake waves
          float dist = distance(vUv, uMouse);
          float mouseForce = smoothstep(0.35, 0.0, dist);
          vec2 mouseDeflection = vec2(sin(uTime * 3.0 + vUv.y * 14.0), cos(uTime * 3.0 + vUv.x * 14.0)) * mouseForce * 0.015 * uHover;
          
          vec2 distortedUv = uv + vec2(waves + speedLine, speedLine) + mouseDeflection;
          distortedUv = clamp(distortedUv, 0.001, 0.999);
          
          vec4 color = texture2D(uTexture, distortedUv);
          
          // High-end real-time custom background keyer:
          // Key out the cyclorama background based on luminance/brightness
          float brightness = (color.r + color.g + color.b) / 3.0;
          float isBg = smoothstep(0.86, 0.94, brightness);
          vec3 baseColor = mix(color.rgb, uBgColor, isBg);
          
          // Aerodynamic CFD (Computational Fluid Dynamics) lines passing over car's monocoque body
          float flowLine = step(0.975, sin(distortedUv.x * 2.5 - distortedUv.y * 0.6 - uTime * 6.0));
          float isCar = step(0.1, 1.0 - isBg) * (1.0 - isBg); // Keep lines exclusively constrained on car's metal structure
          
          // Glowing hot red/orange flow trails
          vec3 cfdLaser = vec3(0.98, 0.22, 0.04) * flowLine * isCar * 0.85;
          
          gl_FragColor = vec4(baseColor + cfdLaser, color.a);
        }
      `;

      // Initialize uniforms
      const initialBgColor = isDarkMode ? new THREE.Color('#030303') : new THREE.Color('#f4f5f7');
      const uniforms = {
        uTexture: { value: null as THREE.Texture | null },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uTextureSize: { value: new THREE.Vector2(1920, 1080) }, // fallback ratio
        uBgColor: { value: initialBgColor },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uHover: { value: 0 }
      };

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        depthWrite: false,
        depthTest: false
      });
      materialRef.current = material;

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Load hypercar texture
      const textureLoader = new THREE.TextureLoader();
      texture = textureLoader.load(heroImg, (loadedTex) => {
        if (!loadedTex) return;
        loadedTex.minFilter = THREE.LinearFilter;
        loadedTex.generateMipmaps = false;
        uniforms.uTexture.value = loadedTex;
        uniforms.uTextureSize.value.set(loadedTex.image.width || 1920, loadedTex.image.height || 1080);
        
        // Instantly trigger a render once texture lands
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }, undefined, (err) => {
        console.warn("Failed to load hero texture inside WebGL renderer:", err);
      });

      // Custom interactive timeline using normalized viewport pointers
      const mousePos = { x: 0.5, y: 0.5 };
      const targetMousePos = { x: 0.5, y: 0.5 };

      handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetMousePos.x = (e.clientX - rect.left) / rect.width;
        targetMousePos.y = 1.0 - (e.clientY - rect.top) / rect.height; // flip coordinates for WebGL logic
      };

      container.addEventListener('mousemove', handleMouseMove);

      // Custom GSAP entrance & hover animations
      const hoverState = { val: 0 };
      
      mouseEnterHandler = () => {
        gsap.to(hoverState, { val: 1.0, duration: 0.8, ease: 'power2.out', onUpdate: () => {
          if (material && material.uniforms) material.uniforms.uHover.value = hoverState.val;
        }});
      };

      mouseLeaveHandler = () => {
        gsap.to(hoverState, { val: 0.0, duration: 1.2, ease: 'power2.out', onUpdate: () => {
          if (material && material.uniforms) material.uniforms.uHover.value = hoverState.val;
        }});
      };

      container.addEventListener('mouseenter', mouseEnterHandler);
      container.addEventListener('mouseleave', mouseLeaveHandler);

      // Animation render loop
      let lastTime = 0;

      const tick = (now: number) => {
        const delta = (now - lastTime) * 0.001;
        lastTime = now;
        
        if (material && material.uniforms) {
          material.uniforms.uTime.value += delta;
        }

        // Smooth lerp mouse pos for fluid interactive feedback
        mousePos.x += (targetMousePos.x - mousePos.x) * 0.08;
        mousePos.y += (targetMousePos.y - mousePos.y) * 0.08;
        if (material && material.uniforms) {
          material.uniforms.uMouse.value.set(mousePos.x, mousePos.y);
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(tick);
      };
      animationFrameId = requestAnimationFrame(tick);

      // Correct resize observer
      handleResize = () => {
        if (!container || !renderer || !material) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        material.uniforms.uResolution.value.set(width, height);
      };
      window.addEventListener('resize', handleResize);

    } catch (err) {
      console.warn("WebGL Renderer context unsupported or error during bootstrap, falling back smoothly:", err);
      setWebglError(true);
    }

    // Dynamic wind tunnel background sway animation
    gsap.to('.anim-smoke-float', {
      y: '1.5%',
      x: '0.8%',
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return () => {
      // Complete safety garbage collection on unmount
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (container) {
        if (handleMouseMove) container.removeEventListener('mousemove', handleMouseMove);
        if (mouseEnterHandler) container.removeEventListener('mouseenter', mouseEnterHandler);
        if (mouseLeaveHandler) container.removeEventListener('mouseleave', mouseLeaveHandler);
      }
      
      if (scene && mesh) scene.remove(mesh);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [heroImg, webglError]);

  return (
    <section 
      ref={containerRef}
      className={`relative h-screen w-full flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-12 transition-colors duration-500 overflow-hidden cursor-crosshair select-none ${
        isDarkMode ? 'bg-[#030303] text-neutral-100' : 'bg-[#f4f5f7] text-neutral-900'
      }`}
    >
      {/* Three.js interactive WebGL canvas background fully covering the Hero block */}
      {!webglError ? (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full z-0 block border-0 pointer-events-none" 
        />
      ) : (
        /* Static High-End CSS Fallback when WebGL is absent/unsupported */
        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center overflow-hidden p-6">
          <img
            src={heroImg}
            alt="Superwheel flagship V12 supercar side profile"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain select-none max-w-6xl transition-transform duration-1000 ease-out anim-smoke-float"
          />
        </div>
      )}

      {/* Dark dynamic vignette over canvas */}
      <div className={`absolute inset-0 pointer-events-none z-1 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent' 
          : 'bg-gradient-to-t from-[#f4f5f7] via-[#f4f5f7]/20 to-transparent'
      }`} />

      {/* Visually stunning minimal layout containing precisely 2-3 word focus headers */}
      <div className="max-w-4xl w-full text-left space-y-6 relative z-10 pointer-events-none">
        <div className="space-y-2">
          {/* Top Indicator */}
          <div className="anim-interactive-tag flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className={`text-[10px] font-mono tracking-[0.35em] uppercase font-bold leading-none ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              THREE.JS SHADER WIND-TUNNEL // STAGE 01
            </span>
          </div>

          {/* Ultra minimal 2 Words Title */}
          <h1 className={`anim-interactive-title text-6xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase italic leading-none select-none ${
            isDarkMode ? 'text-white' : 'text-neutral-950'
          }`}>
            PURE <span className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">VELOCITY</span>
          </h1>

          {/* 3 Words Sub-tagline */}
          <p className="anim-interactive-sub overflow-hidden">
            <span className={`text-xs font-mono tracking-[0.3em] uppercase block font-bold leading-none ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              AEROSPACE MONOCOQUE PLATFORM
            </span>
          </p>
        </div>

        {/* Floating Controls with Interactive Buttons */}
        <div className="flex flex-wrap gap-4 pt-2 pointer-events-auto">
          <button
            onClick={onExploreClick}
            className={`anim-interactive-btn px-8 py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
              isDarkMode 
                ? 'bg-white text-black hover:bg-neutral-150 hover:shadow-[0_0_35px_rgba(255,255,255,0.15)]' 
                : 'bg-neutral-950 text-white hover:bg-neutral-800 hover:shadow-[0_0_35px_rgba(0,0,0,0.12)]'
            }`}
          >
            SHOWROOM
          </button>
          
          <button
            onClick={onAcousticClick}
            className={`anim-interactive-btn px-6 py-3.5 rounded-xl border font-display font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:border-orange-500/30 text-white hover:bg-white/10' 
                : 'bg-black/5 border-neutral-300 hover:border-orange-500/35 text-neutral-800 hover:bg-black/10'
            }`}
          >
            <Play size={12} className="text-orange-500" /> LISTEN SOUND
          </button>
        </div>
      </div>

      {/* Floating Scroll Fleet Indicator */}
      <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-3 text-neutral-400 hover:text-orange-500 transition-colors pointer-events-auto cursor-pointer select-none" onClick={onExploreClick}>
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase font-bold">SCROLL FLEET</span>
        <ArrowDown size={14} className="animate-bounce text-orange-500" />
      </div>
    </section>
  );
}
