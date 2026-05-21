import React, { useState } from 'react';
import { Menu, X, ShieldCheck, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onContactClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Header({ onContactClick, isDarkMode, toggleTheme }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Showroom', href: '#showroom' },
    { name: 'Specifications', href: '#specifications' },
    { name: 'Acoustic Lab', href: '#acoustic' },
    { name: 'Bespoke Studio', href: '#bespoke' }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 flex justify-between items-center ${
        isDarkMode ? 'bg-neutral-950/70 border-b border-white/5 backdrop-blur-xl' : 'bg-white/80 border-b border-gray-200/50 backdrop-blur-xl'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-orange-600 overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.4)]">
            <span className="font-display font-black text-black text-xl italic tracking-tighter">S</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-white/10"></div>
          </div>
          <div>
            <span className={`font-display font-extrabold tracking-widest text-lg uppercase italic ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              SUPER<span className="text-orange-500 font-extrabold">WHEEL</span>
            </span>
            <span className="block text-[8px] font-mono tracking-[0.25em] text-neutral-500 uppercase leading-none">
              EXOTIC ATELIER
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors relative py-1 group ${
                isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* CTA Actions and Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Stunning toggle theme button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${
              isDarkMode
                ? 'bg-white/5 border-white/15 text-orange-400 hover:bg-neutral-800'
                : 'bg-neutral-100 border-neutral-200 text-amber-500 hover:bg-neutral-200'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button 
            onClick={onContactClick}
            className={`px-5 py-2.5 rounded-lg border text-xs font-sans font-semibold tracking-widest uppercase transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/15 hover:border-orange-500/40 text-neutral-300 hover:bg-orange-500 hover:text-white' 
                : 'bg-neutral-900 border-neutral-800 hover:border-orange-500/40 text-white hover:bg-orange-500'
            }`}
          >
            Request Allocation
          </button>
        </div>

        {/* Mobile controls row */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-orange-400'
                : 'bg-neutral-100 border-neutral-200 text-amber-500'
            }`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-colors ${
              isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${
          isDarkMode ? 'bg-neutral-950/98 text-white' : 'bg-white/98 text-neutral-900'
        }`}
      >
        <div className="flex flex-col h-full justify-between pt-24 pb-12 px-8">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-xl font-display font-medium tracking-wide transition-colors ${
                  isDarkMode 
                    ? 'text-neutral-300 hover:text-orange-500' 
                    : 'text-neutral-700 hover:text-orange-600'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className={`flex flex-col gap-4 mt-8 pt-8 border-t ${
            isDarkMode ? 'border-neutral-900' : 'border-gray-100'
          }`}>
            <button
              onClick={() => {
                setIsOpen(false);
                onContactClick();
              }}
              className="w-full py-4 text-center text-xs font-semibold tracking-widest uppercase rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              Request Allocation
            </button>
            <div className={`flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest mt-4 ${
              isDarkMode ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              <ShieldCheck size={12} className="text-neutral-500" /> Secure Encryption Active
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
