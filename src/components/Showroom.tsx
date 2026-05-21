import React, { useState, useEffect, useRef } from 'react';
import { Eye, Info, ChevronRight, Activity, ArrowUpRight, Gauge, Zap, Flame, ShieldAlert, Check } from 'lucide-react';
import gsap from 'gsap';
import { CarModel } from '../types';

interface ShowroomProps {
  onContactClick: (carName: string) => void;
  heroImg: string;
  interiorImg: string;
  wheelImg: string;
  isDarkMode: boolean;
}

export default function Showroom({ onContactClick, heroImg, interiorImg, wheelImg, isDarkMode }: ShowroomProps) {
  // Let's configure three elite hypercars with references to the high quality generated images where applicable!
  const supercarList: CarModel[] = [
    {
      id: 'apollo',
      name: 'APOLLO V12 HYBRID',
      tagline: 'The absolute pinnacle of atmospheric combustion.',
      price: '$3,850,000',
      hp: 1050,
      torque: '900 Nm',
      topSpeed: '355 km/h',
      acceleration: '2.4s',
      engine: '6.5L V12 Hybrid',
      weight: '1,525 kg',
      description: 'A masterpiece machined with aerospace-grade composite monocoque chassis, combining high-rpm mechanical screaming with immediate hybrid response designed for high-amplitude downforce.',
      image: heroImg, // We use the beautiful primary matte hypercar here!
      colors: [
        { name: 'Matte Obsidian black', hex: '#0a0a0a', glow: 'rgba(249,115,22,0.4)' },
        { name: 'Satin Liquid Bronze', hex: '#854d0e', glow: 'rgba(234,179,8,0.4)' },
        { name: 'Sarthe Crimson Red', hex: '#991b1b', glow: 'rgba(239,68,68,0.4)' },
        { name: 'Monza Ice Cyan', hex: '#0e7490', glow: 'rgba(6,182,212,0.4)' }
      ]
    },
    {
      id: 'chronos',
      name: 'CHRONOS GT',
      tagline: 'Grand Touring, completely redefined.',
      price: '$2,950,000',
      hp: 875,
      torque: '1,120 Nm',
      topSpeed: '335 km/h',
      acceleration: '2.8s',
      engine: '4.0L Twin-Turbo V8',
      weight: '1,680 kg',
      description: 'Engineered for non-stop continent cross-drift capabilities under absolute comfort. Featuring adaptive magnetic damping filters and carbon fiber active chassis control modules.',
      image: interiorImg, // Use our high-tech dashboard interior closeup as of focus shift!
      colors: [
        { name: 'Satin Graphite Grey', hex: '#262626', glow: 'rgba(163,163,163,0.4)' },
        { name: 'Emerald British Green', hex: '#064e3b', glow: 'rgba(16,185,129,0.4)' },
        { name: 'Amber Copper Luster', hex: '#b45309', glow: 'rgba(245,158,11,0.4)' },
        { name: 'Liquid Silver', hex: '#d4d4d8', glow: 'rgba(212,212,216,0.4)' }
      ]
    },
    {
      id: 'storm',
      name: 'STORM EV COUPE',
      tagline: 'Lightning speed under absolute silence.',
      price: '$4,100,000',
      hp: 1850,
      torque: '2,100 Nm',
      topSpeed: '412 km/h',
      acceleration: '1.78s',
      engine: 'Quad-Motor Solid-State EV',
      weight: '1,890 kg',
      description: 'Zero emission, infinitely torque-vectored track predator with individual motor controls per carbon hub and actively adjusting carbon spoilers.',
      image: wheelImg, // Features our detail alloy wheel wheel rim shot perfectly!
      colors: [
        { name: 'Brilliant Diamond White', hex: '#fafafa', glow: 'rgba(255,255,255,0.6)' },
        { name: 'Liquid Sapphire Blue', hex: '#1e3a8a', glow: 'rgba(59,130,246,0.4)' },
        { name: 'Solaris Yellow', hex: '#eab308', glow: 'rgba(234,179,8,0.5)' },
        { name: 'Matte Stealth Black', hex: '#171717', glow: 'rgba(249,115,22,0.4)' }
      ]
    }
  ];

  const [activeCarIdx, setActiveCarIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  
  const currentCar = supercarList[activeCarIdx];
  const activeColor = currentCar.colors[selectedColorIdx];

  const infoSectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const statContainerRef = useRef<HTMLDivElement | null>(null);

  // Trigger smooth GSAP tab wipe transitions on change
  useEffect(() => {
    // Reset selected color for new vehicle tabs
    setSelectedColorIdx(0);

    const ctx = gsap.context(() => {
      // Entrances
      gsap.fromTo('.anim-fade-up', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );

      gsap.fromTo('.anim-img-scale', 
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }
      );

      gsap.fromTo('.anim-stat-grow',
        { width: '0%' },
        { width: (i, el) => el.getAttribute('data-target-width') || '100%', duration: 1.0, ease: 'power3.out', delay: 0.1 }
      );
    });

    return () => ctx.revert();
  }, [activeCarIdx]);

  return (
    <section id="showroom" className={`relative py-24 md:py-32 px-6 md:px-12 transition-colors duration-500 overflow-hidden ${
      isDarkMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900 border-t border-gray-100'
    }`}>
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-80 h-80 glow-spot-left pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 glow-spot-right pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Nav Tabs heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 block">
              Curated Showroom
            </span>
            <h2 className={`text-3xl md:text-5xl font-display font-extrabold tracking-tight uppercase italic ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              Hypercar Fleet
            </h2>
          </div>

          {/* Luxury Tab Navigation links */}
          <div className={`flex flex-wrap gap-2 md:gap-4 border-b pb-2 md:pb-0 ${
            isDarkMode ? 'border-white/5' : 'border-gray-100'
          }`}>
            {supercarList.map((car, idx) => (
              <button
                key={car.id}
                onClick={() => setActiveCarIdx(idx)}
                className={`px-5 py-3 rounded-lg text-xs font-display font-bold uppercase tracking-widest transition-all ${
                  activeCarIdx === idx
                    ? (isDarkMode ? 'bg-white text-black shadow-lg' : 'bg-neutral-900 text-white shadow-md')
                    : (isDarkMode ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100')
                }`}
              >
                {car.name.split(' ')[0]} {/* Grab First Word */}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          
          {/* Main Display Image Frame */}
          <div className="lg:col-span-7 space-y-6">
            <div className="anim-img-scale relative aspect-video rounded-2xl overflow-hidden panel-glass border border-white/10 group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* Colored ambient glow backdrop responding to paint color choice */}
              <div 
                className="absolute inset-0 transition-opacity duration-1000 opacity-20 pointer-events-none mix-blend-color-burn"
                style={{ backgroundColor: activeColor.hex }}
              />

              {/* Realistic glass gleam effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>

              {/* Glowing shadow ring matching active specs color selection */}
              <div 
                className="absolute inset-0 border-[3px] rounded-2xl transition-all duration-700 pointer-events-none"
                style={{ borderColor: activeColor.hex, opacity: 0.15 }}
              />

              <img
                src={currentCar.image}
                alt={currentCar.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none filter brightness-95 contrast-105"
              />

              {/* Specs Badge Overlay */}
              <div className="absolute bottom-6 left-6 px-4 py-2.5 rounded-lg panel-glass border border-white/10 flex items-center gap-3 backdrop-blur-md">
                <Gauge size={14} className="text-orange-500 animate-spin-slow" />
                <span className="text-xs font-mono tracking-widest text-neutral-300">
                  {currentCar.topSpeed} PEAK SPEED
                </span>
              </div>
            </div>

            {/* Custom Color Selector Studio */}
            <div className={`p-5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              isDarkMode ? 'panel-glass border-white/5' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="space-y-1">
                <span className={`text-[10px] font-mono uppercase tracking-widest ${
                  isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Atelier Paint Finish
                </span>
                <p className={`text-xs font-semibold tracking-wide ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  {activeColor.name}
                </p>
              </div>

              <div className="flex gap-2.5">
                {currentCar.colors.map((color, colorIdx) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColorIdx(colorIdx);
                      // Flashing color animation feedback
                      gsap.fromTo('.anim-border-pulse', 
                        { scale: 0.85 }, 
                        { scale: 1, duration: 0.3 }
                      );
                    }}
                    className={`w-9 h-9 rounded-full relative flex items-center justify-center transition-all duration-300 filter active:scale-95 ${
                      selectedColorIdx === colorIdx ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                      boxShadow: selectedColorIdx === colorIdx ? `0 0 15px ${color.glow}` : 'none',
                      border: isDarkMode ? '2px solid rgba(255,255,255,0.15)' : '2px solid rgba(0,0,0,0.1)'
                    }}
                    title={color.name}
                  >
                    {selectedColorIdx === colorIdx && (
                      <Check size={14} className={color.hex === '#fafafa' ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details Specifications and Pricing */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="anim-fade-up px-3 py-1 rounded bg-orange-900/40 border border-orange-500/20 text-[10px] font-mono font-extrabold tracking-widest text-orange-400">
                  {currentCar.engine}
                </span>
                <span className={`anim-fade-up text-lg font-mono font-bold ${
                  isDarkMode ? 'text-amber-500' : 'text-amber-600'
                }`}>
                  {currentCar.price}
                </span>
              </div>

              <h3 className={`anim-fade-up text-2xl md:text-4xl font-display font-extrabold tracking-tight uppercase leading-none italic ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                {currentCar.name}
              </h3>
              
              <p className={`anim-fade-up text-xs font-medium font-mono tracking-widest ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {currentCar.tagline}
              </p>
            </div>

            <p className={`anim-fade-up text-xs md:text-sm leading-relaxed border-t border-b py-4 font-normal ${
              isDarkMode ? 'text-neutral-400 border-white/5' : 'text-neutral-600 border-gray-100'
            }`}>
              {currentCar.description}
            </p>

            {/* Performance Stats Readouts with animated bars */}
            <div className="space-y-4 pt-2">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
                Mechanical Calibrations
              </div>

              {/* Stat 1: HP */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-mono flex items-center gap-1.5 ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <Flame size={12} className="text-orange-500" /> Peak Power
                  </span>
                  <span className={`font-mono font-bold ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>{currentCar.hp} HP</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-neutral-900' : 'bg-gray-200'
                }`}>
                  <div 
                    data-target-width={`${Math.min((currentCar.hp / 1900) * 100, 100)}%`}
                    className="anim-stat-grow h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500"
                  />
                </div>
              </div>

              {/* Stat 2: Acceleration */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-mono flex items-center gap-1.5 ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <Activity size={12} className="text-cyan-500" /> 0-100 km/h Launch
                  </span>
                  <span className={`font-mono font-bold ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>{currentCar.acceleration}</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-neutral-900' : 'bg-gray-200'
                }`}>
                  <div 
                    data-target-width={`${(3.0 - parseFloat(currentCar.acceleration)) * 70}%`}
                    className="anim-stat-grow h-full bg-cyan-500"
                  />
                </div>
              </div>

              {/* Stat 3: Weight */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-mono flex items-center gap-1.5 ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    <Zap size={12} className="text-amber-500" /> Massive Torque
                  </span>
                  <span className={`font-mono font-bold ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>{currentCar.torque}</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-neutral-900' : 'bg-gray-200'
                }`}>
                  <div 
                    data-target-width="85%"
                    className="anim-stat-grow h-full bg-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onContactClick(currentCar.name)}
                className="flex-1 py-4 text-center text-xs font-display font-extrabold uppercase tracking-widest text-white rounded-xl bg-orange-600 hover:bg-orange-500 shadow-[0_4px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_45px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                SECURE BUILD SLOT <ArrowUpRight size={14} />
              </button>

              <a
                href="#specifications"
                className={`py-4 px-6 rounded-xl text-center text-xs font-display font-bold uppercase tracking-widest transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700' 
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                FULL METRICS
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
