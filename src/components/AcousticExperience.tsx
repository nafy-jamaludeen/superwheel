import React, { useState, useEffect, useRef } from 'react';
import { Play, Power, Volume2, ShieldAlert, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function AcousticExperience() {
  const [isIgnited, setIsIgnited] = useState(false);
  const [isRevving, setIsRevving] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [engineNote, setEngineNote] = useState('V12 Atmospheric');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mainVolumeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Stop engine and clean up nodes
  const stopEngine = () => {
    oscsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscsRef.current = [];

    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
      } catch (e) {}
      lfoRef.current = null;
    }

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    setIsIgnited(false);
    setIsRevving(false);
  };

  useEffect(() => {
    return () => {
      stopEngine();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleIgnitionToggle = () => {
    if (isIgnited) {
      stopEngine();
      return;
    }

    // Lazy load audio context securely on user gesture
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Set up audio chains
    const mainVolume = ctx.createGain();
    mainVolume.gain.setValueAtTime(volume, ctx.currentTime);
    mainVolumeRef.current = mainVolume;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime); // Throaty low idle
    filterRef.current = filter;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyserRef.current = analyser;

    // Connect chain
    filter.connect(analyser);
    analyser.connect(mainVolume);
    mainVolume.connect(ctx.destination);

    // Create complex V12 cylinders synthesis: multiple detuned low saw oscillators to mimic physical cylinders
    const pitches = [32.70, 34.65, 43.65, 65.41]; // Base low C / Db sub-bass frequencies
    const oscillators: OscillatorNode[] = [];

    pitches.forEach((pitch, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = index % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      
      // Slight detune for cylinder mechanical feel
      osc.detune.setValueAtTime(index * 2.8 - 5, ctx.currentTime);
      
      oscGain.gain.setValueAtTime(0.25, ctx.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start();
      oscillators.push(osc);
    });

    oscsRef.current = oscillators;

    // Pulse LFO modulations to simulate internal compression cycles
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(7.5, ctx.currentTime); // V12 engine idle compression rate
    lfoGain.gain.setValueAtTime(25, ctx.currentTime); // Detuning range

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    lfoRef.current = lfo;

    setIsIgnited(true);

    // Fade in ignition start
    gsap.fromTo('.spark-effect', { scale: 0.8, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.6 });

    // Trigger visualizer loop
    startVisualizer();
  };

  // Live frequency revving sweeps
  const handleRevStart = () => {
    if (!isIgnited || !audioCtxRef.current) return;
    setIsRevving(true);
    const ctx = audioCtxRef.current;
    
    // Rev V12 upwards
    const t = ctx.currentTime;
    
    // Smoothly transition frequencies
    const baseFreqs = [32.70, 34.65, 43.65, 65.41];
    oscsRef.current.forEach((osc, idx) => {
      osc.frequency.cancelScheduledValues(t);
      // Rev 3.5x peak frequency
      osc.frequency.exponentialRampToValueAtTime(baseFreqs[idx] * 4.2, t + 0.9);
    });

    if (filterRef.current) {
      filterRef.current.frequency.cancelScheduledValues(t);
      // Open filter to let screaming high-harmonics escape Exhaust Valves
      filterRef.current.frequency.exponentialRampToValueAtTime(1150, t + 0.8);
    }
    
    if (lfoRef.current) {
      lfoRef.current.frequency.cancelScheduledValues(t);
      lfoRef.current.frequency.exponentialRampToValueAtTime(32, t + 0.9);
    }
  };

  const handleRevStop = () => {
    if (!isIgnited || !audioCtxRef.current) return;
    setIsRevving(false);
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    // Return to deep idle rumble
    const baseFreqs = [32.70, 34.65, 43.65, 65.41];
    oscsRef.current.forEach((osc, idx) => {
      osc.frequency.cancelScheduledValues(t);
      osc.frequency.exponentialRampToValueAtTime(baseFreqs[idx], t + 1.2);
    });

    if (filterRef.current) {
      filterRef.current.frequency.cancelScheduledValues(t);
      filterRef.current.frequency.exponentialRampToValueAtTime(140, t + 1.4);
    }

    if (lfoRef.current) {
      lfoRef.current.frequency.cancelScheduledValues(t);
      lfoRef.current.frequency.setValueAtTime(7.5, t + 1.0);
    }
  };

  // Keep volume settings live in current cycle
  useEffect(() => {
    if (mainVolumeRef.current && audioCtxRef.current) {
      mainVolumeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Audio Canvas visualizer loop
  const startVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameIdRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Clear with atmospheric matte black alpha
      ctx.fillStyle = 'rgba(10, 10, 10, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      
      // Select stroke color based on revving pressure
      const strokeColor = isRevving ? '#f97316' : '#a3a3a3';
      const shadowColor = isRevving ? 'rgba(249, 115, 22, 0.5)' : 'rgba(163, 163, 163, 0.1)';
      ctx.strokeStyle = strokeColor;
      ctx.shadowBlur = isRevving ? 14 : 2;
      ctx.shadowColor = shadowColor;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    draw();
  };

  return (
    <div id="acoustic" className="relative py-24 md:py-32 overflow-hidden px-6 md:px-12 bg-black border-t border-b border-neutral-900">
      {/* Background Atmosphere */}
      <div className="absolute inset-y-0 right-0 w-1/3 glow-spot-right z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 glow-spot-ambient z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Info and Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-orange-500">
                Acoustic Research Center
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight uppercase">
                The Audio <br />Bespoke Labs
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                Experience the raw physical luxury profile of Superwheel automotive craft. 
                Our team synthesizes specific engine frequencies directly in the browser to match our carbon exhausts inside actual testing domes.
              </p>
            </div>

            {/* Dashboard Display panel */}
            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-neutral-600 uppercase">
                SYSTEM FEED // LIVE
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase leading-none">Power Output</div>
                  <div className="text-lg font-mono font-bold text-white leading-none">
                    {isIgnited ? (isRevving ? '8,900 RPM' : '850 RPM') : '0 RPM'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase leading-none">Engine Core</div>
                  <div className="text-lg font-mono font-bold text-white leading-none flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${isIgnited ? 'bg-orange-500 animate-pulse' : 'bg-neutral-800'}`}></span>
                    {isIgnited ? 'ACTIVE' : 'OFFLINE'}
                  </div>
                </div>
              </div>

              {/* Slider panel */}
              <div className="space-y-2 pt-2 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-neutral-500">
                  <span className="flex items-center gap-1"><Volume2 size={12} /> Master Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div className="bg-orange-500/5 p-3 rounded border border-orange-500/10 flex items-center gap-3 text-xs text-orange-400">
                <Sparkles size={16} className="shrink-0" />
                <span>Interact with buttons below using speakers or headphones. No downloads required.</span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Ignition Button */}
              <button
                onClick={handleIgnitionToggle}
                className={`relative group px-6 py-4 rounded-xl font-display font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 select-none active:scale-95 ${
                  isIgnited
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-red-500 border border-neutral-800'
                    : 'bg-white hover:bg-neutral-100 text-black shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                }`}
              >
                <Power size={16} className={isIgnited ? 'text-red-500 animate-pulse' : 'text-neutral-500'} />
                {isIgnited ? 'KILL V12 CORE' : 'IGNITE V12 ENGINE'}
                <div className="spark-effect absolute inset-0 bg-orange-500 rounded-xl opacity-0 pointer-events-none"></div>
              </button>

              {/* Gas Pedal Button */}
              <button
                onMouseDown={handleRevStart}
                onMouseUp={handleRevStop}
                onMouseLeave={handleRevStop}
                onTouchStart={handleRevStart}
                onTouchEnd={handleRevStop}
                disabled={!isIgnited}
                className={`px-8 py-4 rounded-xl font-display font-extrabold text-xs uppercase tracking-[0.22em] border transition-all select-none duration-150 active:scale-95 ${
                  isIgnited
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white border-transparent shadow-[0_4px_30px_rgba(249,115,22,0.3)] cursor-pointer hover:shadow-[0_4px_45px_rgba(249,115,22,0.45)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed opacity-50'
                }`}
              >
                {isRevving ? 'EXHAUST SCREAMING!' : 'HOLD TO REV PEDAL'}
              </button>
            </div>
          </div>

          {/* Column 2: Live Oscillo Waveform Stage */}
          <div className="lg:col-span-7 h-80 lg:h-96 relative flex items-center justify-center rounded-2xl border border-neutral-900 bg-neutral-950/80 p-1 overflow-hidden group">
            {/* Glossy inner border light */}
            <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>

            <div className="absolute top-4 left-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                COCKPIT COUPLER DIAGNOSTICS
              </span>
            </div>

            {/* Waveform Canvas */}
            <canvas
              ref={canvasRef}
              width={600}
              height={320}
              className="w-full h-full block rounded-xl opacity-90 transition-opacity"
            />

            {!isIgnited && (
              <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col justify-center items-center p-8 text-center transition-all">
                <div className="w-14 h-14 rounded-full bg-neutral-900/80 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4 animate-pulse">
                  <Power size={24} />
                </div>
                <h3 className="font-display font-bold uppercase text-sm tracking-widest text-neutral-200">
                  Engine Exhaust Muted
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mt-2 font-mono">
                  Press the V12 ignition button on the left to start the power cycle.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
