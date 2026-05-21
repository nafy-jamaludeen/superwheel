import React, { useEffect } from 'react';
import { Settings, Shield, Cpu, Wind, Info, Disc, Compass } from 'lucide-react';
import gsap from 'gsap';

interface SpecsBentoProps {
  interiorImg: string;
  wheelImg: string;
  isDarkMode: boolean;
}

export default function SpecsBento({ interiorImg, wheelImg, isDarkMode }: SpecsBentoProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create interesting subtle on-scroll or timed floating movements
      gsap.fromTo('.anim-bento-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="specifications" className={`relative py-24 md:py-32 px-6 md:px-12 transition-colors duration-500 overflow-hidden border-t ${
      isDarkMode ? 'bg-[#030303] text-neutral-100 border-white/5' : 'bg-gray-100 text-neutral-900 border-gray-200'
    }`}>
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 glow-spot-left pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] glow-spot-ambient pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="max-w-xl space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 block">
            Automotive Metallurgy & Physics
          </span>
          <h2 className={`text-3xl md:text-5xl font-display font-extrabold tracking-tight uppercase italic leading-none ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            Carbon Engineering
          </h2>
          <p className={`text-sm leading-relaxed ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Every component of a Superwheel chassis must pass complex thermal simulations. 
            We design for maximum mechanical grip, structural safety, and sensory feedback.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Main Wheel Detail Closeup */}
          <div className="anim-bento-card md:col-span-8 group panel-glass rounded-2xl overflow-hidden relative min-h-[360px] flex flex-col justify-end p-8 shadow-2xl transition-all duration-300 hover:border-orange-500/20 border">
            <div className="absolute inset-0 z-0">
              <img
                src={wheelImg}
                alt="Forged Alloys closeup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7] contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-orange-500 font-mono uppercase tracking-widest">
                <Disc size={14} className="animate-spin-slow" /> Structural Dynamics
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white uppercase italic">
                Forged Bronze Alloys
              </h3>
              <p className="text-neutral-300 text-xs md:text-sm max-w-lg leading-relaxed">
                Featuring monoblock extreme CNC milled high-grade aluminum architecture. Rotational mass is reduced by 3.2 kilograms per corner to maximize throttle-response and lateral tire traction.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-mono text-[10px] tracking-wider text-neutral-400">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 uppercase">FR: 20" × 9.5J</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 uppercase">RR: 21" × 12.0J</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 uppercase">Carbon Ceramic Rotors</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Aerodynamics Value Gauge */}
          <div className="anim-bento-card md:col-span-4 group panel-glass-interactive rounded-2xl p-8 flex flex-col justify-between min-h-[300px] border">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Wind size={20} />
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Fluid CFD Analysis
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className={`text-xs font-mono uppercase tracking-widest ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>Aero Drag Index</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-display font-extrabold tracking-tighter ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>0.24</span>
                  <span className={`text-xs font-mono ${
                    isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>Cd</span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Utilizing active front diffuser air channels and a deploying three-section carbon rear wing generating up to 800 kilograms of net downforce at high track speed.
              </p>
            </div>
          </div>

          {/* Bento Card 3: Cockpit Interior detailed specifications */}
          <div className="anim-bento-card md:col-span-4 group panel-glass-interactive rounded-2xl p-8 flex flex-col justify-between min-h-[300px] border">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu size={20} />
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Digital Interface
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className={`text-xs font-mono uppercase tracking-widest ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>CAN Bus Response</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-display font-extrabold tracking-tighter ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>1,000</span>
                  <span className={`text-xs font-mono ${
                    isDarkMode ? 'text-cyan-500' : 'text-cyan-600 font-bold'
                  }`}>Hz</span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Absolute zero-lag cockpit control feedback telemetry links directly from custom carbon paddle-shifters to the electronic gearbox control core.
              </p>
            </div>
          </div>

          {/* Bento Card 4: Interior Image Detail Showcase */}
          <div className="anim-bento-card md:col-span-8 group panel-glass rounded-2xl overflow-hidden relative min-h-[360px] flex flex-col justify-end p-8 shadow-2xl transition-all duration-300 hover:border-cyan-500/20 border">
            <div className="absolute inset-0 z-0">
              <img
                src={interiorImg}
                alt="Interior steering closeup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75] contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-cyan-500 font-mono uppercase tracking-widest">
                <Compass size={14} className="animate-pulse" /> Pilot Ergonomics
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white uppercase italic">
                Carbon Cockpit Cell
              </h3>
              <p className="text-neutral-300 text-xs md:text-sm max-w-lg leading-relaxed">
                Fully tailored with laser-etched Alcantara weaves and bespoke density seating shells mapped to your anatomy. Features an aerospace steering ring with fully variable haptic race profiles.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-mono text-[10px] tracking-wider text-neutral-400">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 uppercase">Fórmula Steering Layout</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 uppercase">Zero-Glare Glass Panel</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 uppercase">Bespoke Haptic Dials</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
