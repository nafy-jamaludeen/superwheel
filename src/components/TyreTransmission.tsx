import React, { useEffect, useRef, useState } from 'react';
import { Settings, RefreshCw, Zap, TrendingUp, Compass, ChevronRight, Volume2, Info } from 'lucide-react';
import gsap from 'gsap';

interface GearConfig {
  name: string;
  ratio: number;
  torqueMultiplier: number;
  color: string;
  description: string;
}

const SHIFT_GEARS: Record<string, GearConfig> = {
  'R': { name: 'Reverse', ratio: -3.42, torqueMultiplier: 3.42, color: '#ef4444', description: 'Maximum backing wheel torque' },
  'N': { name: 'Neutral', ratio: 0.0, torqueMultiplier: 0.0, color: '#a3a3a3', description: 'Zero mechanical energy transfer' },
  '1st': { name: '1st Gear', ratio: 3.91, torqueMultiplier: 3.91, color: '#ea580c', description: 'Dead start launching torque' },
  '2nd': { name: '2nd Gear', ratio: 2.64, torqueMultiplier: 2.64, color: '#f97316', description: 'Rapid initial acceleration' },
  '3rd': { name: '3rd Gear', ratio: 1.83, torqueMultiplier: 1.83, color: '#f59e0b', description: 'High torque pulling band' },
  '4th': { name: '4th Gear', ratio: 1.37, torqueMultiplier: 1.37, color: '#eab308', description: 'V12 acoustic sweet-spot' },
  '5th': { name: '5th Gear', ratio: 1.05, torqueMultiplier: 1.05, color: '#10b981', description: 'High speed cruise mesh' },
  '6th': { name: '6th Gear', ratio: 0.85, torqueMultiplier: 0.85, color: '#06b6d4', description: 'Overdrive aerospace drag cut' },
  '7th': { name: '7th Gear', ratio: 0.68, torqueMultiplier: 0.68, color: '#2563eb', description: 'V-Max ultra-low drag tier' },
};

interface TyreTransmissionProps {
  isDarkMode: boolean;
}

export default function TyreTransmission({ isDarkMode }: TyreTransmissionProps) {
  const [activeGear, setActiveGear] = useState<string>('3rd');
  const [autoDrivetrain, setAutoDrivetrain] = useState<boolean>(true);
  const [clutchPressed, setClutchPressed] = useState<boolean>(false);
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // References for anim logic
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollAccumulator = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const lastScrollY = useRef<number>(0);

  // Mechanical rotation angles
  const engineAngle = useRef<number>(0);
  const counterAngle = useRef<number>(0);
  const tireAngle = useRef<number>(0);

  // Current physics metrics for telemetry dashboard
  const [telemetry, setTelemetry] = useState({
    engineRpm: 3200,
    tireSpeedKmh: 124,
    transTorqueNm: 850,
    clutchSlipRpm: 0,
    efficiency: 98,
    scrollImpulse: 0
  });

  // Track scroll activity to spin the drivetrain
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (Math.abs(delta) > 0) {
        // Feed displacement into rotational velocity
        scrollAccumulator.current += Math.abs(delta) * 0.04;
        
        // Cap the maximum scroll impulse impulse to protect engine
        if (scrollAccumulator.current > 45) {
          scrollAccumulator.current = 45;
        }
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shift gear handler
  const handleShift = (gearKey: string) => {
    setClutchPressed(true);
    
    // Play dual-clutch pop sound if enabled
    if (soundEnabled && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Mechanical clunk sound
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      } catch (e) {
        console.log('Audio shift clunk caught:', e);
      }
    }

    setTimeout(() => {
      setActiveGear(gearKey);
      setClutchPressed(false);
    }, 150);
  };

  // Render drivetrain loop inside canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;
    let baseTime = 0;

    // Responsive sizing logic
    const handleCanvasResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    };
    
    handleCanvasResize();
    window.addEventListener('resize', handleCanvasResize);

    // Dynamic teeth drawing utility
    const drawGearWithTeeth = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      teethCount: number,
      angle: number,
      mainColor: string,
      accentColor: string,
      spokeCount = 5
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);

      c.beginPath();
      const toothDepth = radius * 0.11;
      const innerRadius = radius - toothDepth;
      const outerRadius = radius + toothDepth;

      for (let i = 0; i < teethCount; i++) {
        const angleStep = (Math.PI * 2) / teethCount;
        const currentAngle = i * angleStep;

        c.lineTo(Math.cos(currentAngle) * innerRadius, Math.sin(currentAngle) * innerRadius);
        c.lineTo(Math.cos(currentAngle + angleStep * 0.28) * outerRadius, Math.sin(currentAngle + angleStep * 0.28) * outerRadius);
        c.lineTo(Math.cos(currentAngle + angleStep * 0.72) * outerRadius, Math.sin(currentAngle + angleStep * 0.72) * outerRadius);
        c.lineTo(Math.cos(currentAngle + angleStep) * innerRadius, Math.sin(currentAngle + angleStep) * innerRadius);
      }

      c.closePath();
      
      // Metallic circular linear gradient
      const gradient = c.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      gradient.addColorStop(0, isDarkMode ? '#2c2c2f' : '#f0f0f5');
      gradient.addColorStop(0.5, mainColor);
      gradient.addColorStop(1, isDarkMode ? '#171719' : '#b5b5c0');

      c.fillStyle = gradient;
      c.fill();

      // Gear outline stroke
      c.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';
      c.lineWidth = 1.5;
      c.stroke();

      // Inner gearbox detailing
      c.beginPath();
      c.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
      c.fillStyle = isDarkMode ? '#0d0d0e' : '#fcfcfd';
      c.fill();
      c.stroke();

      // Dynamic glowing index lines
      c.beginPath();
      c.arc(0, 0, radius * 0.48, 0, Math.PI * 2);
      c.strokeStyle = accentColor;
      c.lineWidth = 1.2;
      c.stroke();

      // Spokes
      c.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
      c.lineWidth = radius * 0.08;
      for (let j = 0; j < spokeCount; j++) {
        const sAngle = (j * Math.PI * 2) / spokeCount;
        c.beginPath();
        c.moveTo(Math.cos(sAngle) * (radius * 0.15), Math.sin(sAngle) * (radius * 0.15));
        c.lineTo(Math.cos(sAngle) * (radius * 0.62), Math.sin(sAngle) * (radius * 0.62));
        c.stroke();
      }

      // Hub core axle
      c.beginPath();
      c.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
      c.fillStyle = isDarkMode ? '#3f3f46' : '#9a9aae';
      c.fill();
      c.strokeStyle = isDarkMode ? '#ffffff' : '#4b5563';
      c.lineWidth = 2;
      c.stroke();

      c.restore();
    };

    // Rendering Tick Loop
    const drawFrame = (timestamp: number) => {
      baseTime += 1;
      
      // Decay user scroll impulse friction over time
      scrollAccumulator.current *= 0.952;
      if (scrollAccumulator.current < 0.005) {
        scrollAccumulator.current = 0;
      }

      // Base engine power rotation speeds
      const scrollSpeedInput = scrollAccumulator.current;
      const autoSpinnerSpeed = autoDrivetrain ? 1.4 : 0;
      const combinedDrivetrainSpeed = scrollSpeedInput + autoSpinnerSpeed;

      const currentGear = SHIFT_GEARS[activeGear];
      const actualTransmissionRatio = currentGear.ratio;

      // Simulate clutch pedal disconnect behavior
      const mechanicalRatioMultiplier = clutchPressed ? 0 : actualTransmissionRatio;

      // Increment rotation cycles
      engineAngle.current += combinedDrivetrainSpeed * 0.035;
      
      // Counter speed turns backwards
      counterAngle.current -= combinedDrivetrainSpeed * 0.045 * (mechanicalRatioMultiplier !== 0 ? 1 : 0.05);
      
      // Tire rotation linked strictly to ratio outcome
      const tireSpeedDelta = combinedDrivetrainSpeed * 0.035 * (mechanicalRatioMultiplier !== 0 ? (1 / mechanicalRatioMultiplier) : 0);
      tireAngle.current += tireSpeedDelta;

      // Telemetry statistics modeling
      const rpmBase = combinedDrivetrainSpeed * 1500;
      const calculatedRpm = Math.floor(Math.min(1000 + rpmBase, 9200));
      const speedCalculatedVal = Math.floor(Math.abs(tireSpeedDelta * 1250));
      const torqueCalculatedVal = Math.floor((mechanicalRatioMultiplier !== 0 ? (750 * mechanicalRatioMultiplier) : 0));

      setTelemetry({
        engineRpm: calculatedRpm,
        tireSpeedKmh: speedCalculatedVal,
        transTorqueNm: torqueCalculatedVal,
        clutchSlipRpm: clutchPressed ? calculatedRpm : 0,
        efficiency: clutchPressed ? 0 : 98 - Math.floor(scrollSpeedInput * 0.2),
        scrollImpulse: parseFloat(scrollSpeedInput.toFixed(2))
      });

      // Clear layout
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save global scaling
      const ratio = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(ratio, ratio);

      const logicalWidth = canvas.width / ratio;
      const logicalHeight = canvas.height / ratio;

      // Define coordinates responsive layout
      const centerlineY = logicalHeight * 0.52;
      const leftGearX = logicalWidth * 0.22;
      const centerGearX = logicalWidth * 0.44;
      const rightWheelX = logicalWidth * 0.74;

      // 1. Draw connecting gear housing box wireframe background
      ctx.strokeStyle = isDarkMode ? 'rgba(255,100,0,0.06)' : 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(leftGearX, centerlineY);
      ctx.lineTo(centerGearX, centerlineY);
      ctx.lineTo(rightWheelX, centerlineY);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.strokeRect(leftGearX - 65, centerlineY - 80, (rightWheelX - leftGearX) + 125, 175);

      // A. ENGINE INPUT PINION GEAR
      const engineGearColor = isDarkMode ? '#27272a' : '#d4d4d8';
      drawGearWithTeeth(
        ctx,
        leftGearX,
        centerlineY - 15,
        50,
        22,
        engineAngle.current,
        engineGearColor,
        '#f97316',
        5
      );

      // Draw active motor rotation arrow
      ctx.beginPath();
      ctx.arc(leftGearX, centerlineY - 15, 62, -Math.PI * 0.2, Math.PI * 0.5);
      ctx.strokeStyle = 'rgba(249,115,22,0.45)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = isDarkMode ? '#a1a1aa' : '#52525b';
      ctx.font = 'bold 9px monospace';
      ctx.letterSpacing = '1px';
      ctx.fillText('ENGINE PINION', leftGearX - 35, centerlineY - 78);

      // B. SPEED TRANSMISSION COUNTER-SHAFT GEAR
      const gearThemeColor = currentGear.color;
      drawGearWithTeeth(
        ctx,
        centerGearX,
        centerlineY + 15,
        64,
        28,
        counterAngle.current,
        isDarkMode ? '#1e293b' : '#e2e8f0',
        gearThemeColor,
        6
      );

      ctx.fillStyle = gearThemeColor;
      ctx.fillText(`${activeGear.toUpperCase()} RATIO`, centerGearX - 42, centerlineY + 92);

      // C. HIGH-PERFORMANCE DYNAMIC WHEEL / TIRE SYSTEM
      ctx.save();
      ctx.translate(rightWheelX, centerlineY);
      ctx.rotate(tireAngle.current);

      // Render the Tire Outer Wall (Rubber)
      ctx.beginPath();
      ctx.arc(0, 0, 105, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? '#18181b' : '#27272a';
      ctx.fill();
      
      // Tire Tread Outer slots (16 steps rotation indices)
      ctx.lineWidth = 6;
      ctx.strokeStyle = isDarkMode ? '#09090b' : '#121214';
      for (let s = 0; s < 24; s++) {
        const rad = (s * Math.PI * 2) / 24;
        ctx.beginPath();
        // Draw deep radial traction lines
        ctx.moveTo(Math.cos(rad) * 98, Math.sin(rad) * 98);
        ctx.lineTo(Math.cos(rad) * 105, Math.sin(rad) * 105);
        ctx.stroke();
      }

      // Tire Inner Trim & Bead lines
      ctx.beginPath();
      ctx.arc(0, 0, 82, 0, Math.PI * 2);
      ctx.strokeStyle = isDarkMode ? '#3f3f46' : '#52525b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Curved Carbon Fiber Sidewall letter markings
      ctx.font = '900 8.5px Arial';
      ctx.fillStyle = isDarkMode ? '#e4e4e7' : '#d4d4d8';
      ctx.textAlign = 'center';
      
      // Draw tires lettering
      ctx.save();
      ctx.rotate(Math.PI * 1.5);
      ctx.fillText('SUPERWHEEL ZR21', 0, -88);
      ctx.restore();

      ctx.save();
      ctx.rotate(Math.PI * 0.5);
      ctx.fillStyle = '#f97316';
      ctx.fillText('CORSE MONOCOQUE', 0, -88);
      ctx.restore();

      // CNC Machined forged metal Alloy Wheel Hub Spokes
      const alloyBase = isDarkMode ? '#334155' : '#cbd5e1';
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      const alloyGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 80);
      alloyGrad.addColorStop(0, '#e2e8f0');
      alloyGrad.addColorStop(0.4, alloyBase);
      alloyGrad.addColorStop(1, isDarkMode ? '#030712' : '#cbd5e1');
      ctx.fillStyle = alloyGrad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
      ctx.stroke();

      // Alloy spokes structural architecture
      ctx.strokeStyle = isDarkMode ? '#475569' : '#94a3b8';
      ctx.lineWidth = 10;
      for (let sp = 0; sp < 10; sp++) {
        const spRad = (sp * Math.PI * 2) / 10;
        ctx.beginPath();
        ctx.moveTo(Math.cos(spRad) * 15, Math.sin(spRad) * 15);
        ctx.lineTo(Math.cos(spRad) * 76, Math.sin(spRad) * 76);
        ctx.stroke();
      }

      // Wheel central locking axle cap and rotor
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Brand central S logo inside hub
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('S', 0, 5);

      ctx.restore(); // Restore wheel translation

      // Draw STATIC high-performance carbon brake caliper behind overlay (does not rotate)
      ctx.save();
      ctx.translate(rightWheelX, centerlineY);
      ctx.rotate(-Math.PI * 0.32); // Caliper position at top right 45deg
      
      ctx.beginPath();
      ctx.arc(0, 0, 75, -0.4, 0.4);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.95)'; // Racing Red Brembo-style caliper
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Label on caliper
      ctx.font = 'bold 8.5px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('BREMBO', 68, 2);
      
      ctx.restore();

      // Tire static title indicator
      ctx.fillStyle = isDarkMode ? '#a1a1aa' : '#52525b';
      ctx.font = 'bold 9px monospace';
      ctx.letterSpacing = '1px';
      ctx.fillText('ROTATIONAL TYRE OUTLET', rightWheelX - 60, centerlineY - 118);

      ctx.restore(); // Restore global context scaler

      localFrameId = requestAnimationFrame(drawFrame);
    };

    localFrameId = requestAnimationFrame(drawFrame);
    
    // Cleanup bindings safely
    return () => {
      cancelAnimationFrame(localFrameId);
      window.removeEventListener('resize', handleCanvasResize);
    };
  }, [activeGear, isDarkMode, autoDrivetrain, clutchPressed]);

  return (
    <section 
      id="transmission-lab" 
      className={`relative py-24 md:py-28 px-6 md:px-12 transition-colors duration-500 overflow-hidden border-t ${
        isDarkMode ? 'bg-[#030303] text-neutral-100 border-white/5' : 'bg-gray-50 text-neutral-900 border-gray-200'
      }`}
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Typography */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 block">
              TRANSMISSION & KINEMATICS
            </span>
            <h2 className={`text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic leading-none ${
              isDarkMode ? 'text-white' : 'text-neutral-950'
            }`}>
              SCROLL-LINKED <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">TYRE & GEARBOX</span>
            </h2>
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Experience real-time drivetrain mechanics. Spin the tire and mesh-gears instantly by **scrolling this page** or toggling the direct torque transmission simulator below.
            </p>
          </div>

          {/* Interactive Top controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.15)]' 
                  : (isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900')
              }`}
              title="Toggle Mechanical Transmission Click Sounds"
            >
              <Volume2 size={15} /> 
              <span>{soundEnabled ? 'SHIFTER AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            <button
              onClick={() => setAutoDrivetrain(prev => !prev)}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                autoDrivetrain 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : (isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900')
              }`}
            >
              <RefreshCw size={15} className={autoDrivetrain ? 'animate-spin-slow' : ''} />
              <span>{autoDrivetrain ? 'DRIVETRAIN SPINNING' : 'DRIVETRAIN LOCKED'}</span>
            </button>
          </div>
        </div>

        {/* Main Interface Layout Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* 1. Left Visualizer Panel (Canvas & Interaction overlays) */}
          <div className={`lg:col-span-8 flex flex-col justify-between p-6 rounded-2xl border relative overflow-hidden min-h-[420px] transition-colors ${
            isDarkMode ? 'bg-[#080809] border-[#1f1f23]' : 'bg-white border-gray-100 shadow-md'
          }`}>
            <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
              <span className={`text-[9px] font-mono tracking-wider ${
                isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                KINETIC DOCK // REAL-TIME SPEED: <strong className="text-orange-500">{telemetry.tireSpeedKmh} KM/H</strong>
              </span>
            </div>

            {/* Direct interactive scroll scroll indicator badge */}
            <div className={`absolute top-4 right-6 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 flex items-center gap-1.5 z-10 transition-all ${
              telemetry.scrollImpulse > 0.1 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
            }`}>
              <TrendingUp size={11} className="text-orange-400" />
              <span className="text-[9px] font-mono text-orange-400 font-bold">SCROLL GAIN: {telemetry.scrollImpulse} rad/s</span>
            </div>

            {/* Core Canvas Element */}
            <div className="w-full flex-1 flex items-center justify-center my-6 z-1">
              <canvas 
                ref={canvasRef} 
                className="w-full h-80 max-h-[340px] block cursor-crosshair"
              />
            </div>

            {/* Visual guide footer inside panel */}
            <div className={`pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
              isDarkMode ? 'border-neutral-900 text-neutral-500' : 'border-gray-100 text-gray-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <Info size={12} className="text-orange-500 animate-pulse" />
                Scroll the layout downwards slowly to inspect gear engaging velocity ratios.
              </span>
              <span className="hidden sm:inline">Ratios range from 3.91:1 down to overdrive 0.68:1</span>
            </div>
          </div>

          {/* 2. Right Selector & Telemetry Board */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            
            {/* Control Pod 1: Shift Gate Panel */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between h-auto leading-none ${
              isDarkMode ? 'bg-[#080809] border-[#1f1f23]' : 'bg-white border-gray-100 shadow-md'
            }`}>
              <div className="space-y-1.5 mb-6">
                <h3 className={`text-xs font-mono uppercase tracking-[0.2em] ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  DUAL-CLUTCH TRANS-SHIFTER
                </h3>
                <p className={`text-[11px] leading-relaxed ${
                  isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Select a gear to engage the ratio. Watch the tire rotational output adapt instantly.
                </p>
              </div>

              {/* Responsive Shifter Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Object.keys(SHIFT_GEARS).map((gear) => {
                  const gearInfo = SHIFT_GEARS[gear];
                  const isCurrent = activeGear === gear;
                  
                  return (
                    <button
                      key={gear}
                      onClick={() => handleShift(gear)}
                      className={`py-3.5 px-2 rounded-xl text-center font-display font-black text-xs tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none border ${
                        isCurrent 
                          ? 'border-[1.5px] text-white shadow-xl scale-102 hover:-translate-y-0.5' 
                          : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                      style={{
                        borderColor: isCurrent ? gearInfo.color : undefined,
                        backgroundColor: isCurrent ? gearInfo.color : undefined,
                      }}
                    >
                      <span className="text-sm font-semibold leading-none">{gear}</span>
                      <span className="text-[8px] font-mono tracking-normal leading-none opacity-85">
                        {gear === 'N' ? '0' : (gear === 'R' ? 'R' : `i: ${gearInfo.ratio}`)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active gear textual label */}
              <div className={`p-4 rounded-xl flex items-start gap-3 transition-colors ${
                isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-gray-50 text-neutral-900 border border-gray-100'
              }`}>
                <div 
                  className="w-3.5 h-3.5 rounded-full mt-0.5 animate-pulse shrink-0" 
                  style={{ backgroundColor: SHIFT_GEARS[activeGear].color }}
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Engaged configuration</span>
                  <p className="text-xs font-semibold">{SHIFT_GEARS[activeGear].name} ({SHIFT_GEARS[activeGear].ratio}:1 Ratio)</p>
                  <p className={`text-[10px] leading-normal ${
                    isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>{SHIFT_GEARS[activeGear].description}</p>
                </div>
              </div>
            </div>

            {/* Control Pod 2: Dynamic Telemetry Performance Gauge */}
            <div className={`p-6 rounded-2xl border flex flex-col h-full justify-between ${
              isDarkMode ? 'bg-[#080809] border-[#1f1f23]' : 'bg-white border-gray-100 shadow-md'
            }`}>
              <h3 className={`text-xs font-mono uppercase tracking-[0.2em] mb-4 ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                TRANSMISSION PHYS METRICS
              </h3>

              <div className="space-y-4">
                {/* Metric 1: Crankshaft Engine RPM */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-mono text-[11px]">
                    <span className="text-neutral-400">V12 Crankshaft Engine RPM</span>
                    <span className={`font-bold ${telemetry.engineRpm > 7500 ? 'text-orange-500 animate-pulse' : 'text-white'}`}>
                      {telemetry.engineRpm} RPM
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-neutral-950' : 'bg-gray-100'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 transition-all duration-100"
                      style={{ width: `${(telemetry.engineRpm / 9200) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: Rear Wheel Axis Speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-mono text-[11px]">
                    <span className="text-neutral-400">Traction Tyre Output Velocity</span>
                    <span className="font-bold text-white">{telemetry.tireSpeedKmh} KM/H</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-neutral-950' : 'bg-gray-100'
                  }`}>
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-150"
                      style={{ width: `${Math.min((telemetry.tireSpeedKmh / 375) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3: Torque multiplier */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-mono text-[11px]">
                    <span className="text-neutral-400">Multiplied Output Axle Torque</span>
                    <span className="font-bold text-white">{telemetry.transTorqueNm} NM</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-neutral-950' : 'bg-gray-100'
                  }`}>
                    <div 
                      className="h-full bg-purple-500 transition-all duration-200"
                      style={{ width: `${Math.min((telemetry.transTorqueNm / 3000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Clutch status block */}
              <div className={`mt-4 pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                isDarkMode ? 'border-neutral-900' : 'border-gray-100'
              }`}>
                <span className="text-neutral-500">Dual Clutch Linkage:</span>
                <span className={clutchPressed ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                  {clutchPressed ? 'SLIPPING DISCONNECTED' : `LOCKED ENGAGED [${telemetry.efficiency}%]` }
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
