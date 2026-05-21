import React from 'react';
import { Mail, Phone, MapPin, ShieldAlert, Cpu } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-neutral-900 py-16 px-6 md:px-12 relative z-10 text-neutral-500 text-xs text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Branding */}
        <div className="space-y-4 col-span-1 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center font-display font-black text-black italic text-lg">
              S
            </div>
            <span className="font-display font-extrabold text-white uppercase italic tracking-wider">
              SUPER<span className="text-orange-500">WHEEL</span>
            </span>
          </div>
          <p className="text-neutral-500 leading-relaxed font-mono text-[10px]">
            Limited availability atelier commissions of hypercars. Structured globally across advanced carbon research facilities.
          </p>
        </div>

        {/* Studio Slots */}
        <div className="space-y-3 col-span-1">
          <h4 className="text-neutral-200 uppercase font-mono text-[9px] tracking-widest font-black">
            Global Facilities
          </h4>
          <ul className="space-y-2 text-[11px] font-mono leading-relaxed">
            <li className="flex items-center gap-2">
              <MapPin size={12} className="text-neutral-700" /> Stuttgart Research, DE
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={12} className="text-neutral-700" /> Maranello Core Windtunnel, IT
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={12} className="text-neutral-700" /> Tokyo Craft center, JP
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 col-span-1">
          <h4 className="text-neutral-200 uppercase font-mono text-[9px] tracking-widest font-black">
            Inquiries Link
          </h4>
          <ul className="space-y-2 text-[11px] leading-relaxed">
            <li>
              <a href="#showroom" className="hover:text-white transition-colors uppercase font-mono text-[11px] tracking-wider">Showroom Fleet</a>
            </li>
            <li>
              <a href="#specifications" className="hover:text-white transition-colors uppercase font-mono text-[11px] tracking-wider">Carbon Tech</a>
            </li>
            <li>
              <a href="#acoustic" className="hover:text-white transition-colors uppercase font-mono text-[11px] tracking-wider">Audio Lab</a>
            </li>
            <li>
              <a href="#bespoke" className="hover:text-white transition-colors uppercase font-mono text-[11px] tracking-wider">Bespoke Studio</a>
            </li>
          </ul>
        </div>

        {/* Disclaimer / Encryption */}
        <div className="space-y-3 col-span-1">
          <h4 className="text-neutral-200 uppercase font-mono text-[9px] tracking-widest font-black">
            Private Protocol
          </h4>
          <p className="text-[10px] font-mono leading-relaxed text-neutral-600">
            All designs, custom engineering carbon configurations, and exhaust waveforms constitute proprietary trade assets of Superwheel Atelier Ltd. Unauthorized telemetry extraction is prohibited.
          </p>
          <div className="flex items-center gap-2 text-[8px] font-mono text-neutral-700 uppercase tracking-widest">
            <Cpu size={12} className="text-neutral-800" /> CONSOLE LINK VALID
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-950 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-600 text-[10px] uppercase font-mono tracking-widest">
        <span>© {currentYear} Superwheel Atelier. Crafted globally.</span>
        <span className="flex items-center gap-1.5"><ShieldAlert size={12} className="text-neutral-700" /> ALL RIGHTS RESERVED SECTIONS</span>
      </div>
    </footer>
  );
}
