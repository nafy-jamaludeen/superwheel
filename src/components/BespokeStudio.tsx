import React, { useState } from 'react';
import { Sparkles, Check, DollarSign, PenTool, Shield, Calendar, Send } from 'lucide-react';
import gsap from 'gsap';

interface OptionItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

interface BespokeStudioProps {
  onFormSubmit: (selectedOptionNames: string[], totalPrice: number) => void;
}

export default function BespokeStudio({ onFormSubmit }: BespokeStudioProps) {
  const optionsList: OptionItem[] = [
    { id: 'carbon-ext', name: 'Raw Twill Carbon Exterior Pack', category: 'Aero', price: 185000, description: 'Exposed high-gloss performance twill carbon weaves replacing all standard composite bumper elements.' },
    { id: 'caliper-ceramic', name: 'Carbon-Ceramic Caliper Color Match', category: 'Hardware', price: 34000, description: 'Custom selection of racing yellow, azure cyan, or saturn gold brakes with direct thermostatic links.' },
    { id: 'sound-exhaust', name: 'Inconel Screaming Track Exhaust', category: 'Acoustics', price: 95000, description: 'Saves 12kg of central chassis weight while enhancing standard upper-frequency mechanical harmonics.' },
    { id: 'magnetic-damp', name: 'Bespoke Magne-Ride Race Suspension', category: 'Hardware', price: 72000, description: 'Active dampers reading track surfaces 1000 times a second for customizable drift capability.' },
    { id: 'interior-tailor', name: 'Alcantara Monocoque Tailored Cell', category: 'Interior', price: 120000, description: 'Handmade, density-padded seats fully bespoke-stitched to align perfectly to the owner\'s proportions.' }
  ];

  const [selectedIDs, setSelectedIDs] = useState<string[]>(['carbon-ext', 'sound-exhaust']);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const basePrice = 3850000;
  const currentOptionsPrice = optionsList
    .filter(o => selectedIDs.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);
  const totalPrice = basePrice + currentOptionsPrice;

  const toggleOption = (id: string) => {
    if (selectedIDs.includes(id)) {
      setSelectedIDs(selectedIDs.filter(item => item !== id));
    } else {
      setSelectedIDs([...selectedIDs, id]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;

    const chosenNames = optionsList
      .filter(o => selectedIDs.includes(o.id))
      .map(o => o.name);

    try {
      await fetch("https://formsubmit.co/ajax/9canff@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🛠️ New Custom Build Sheet from ${inquiryName}`,
          "Client Name": inquiryName,
          "Secure Email": inquiryEmail,
          "Base Chassis Price": "$3,850,000",
          "Selected Upgrades": chosenNames.join(", ") || "No custom options selected.",
          "Estimated Total build": `$${totalPrice.toLocaleString()}`,
          "Client Custom Inquiries": inquiryMessage || "No additional comments."
        })
      });
    } catch (err) {
      console.warn("FormSubmit bespoke transmission failed:", err);
    } finally {
      onFormSubmit(chosenNames, totalPrice);
      setSubmitted(true);

      // Blast celebration or transition
      gsap.fromTo('.anim-success-box', 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  };

  return (
    <section id="bespoke" className="relative py-24 md:py-32 px-6 md:px-12 bg-[#050505] overflow-hidden border-t border-b border-neutral-900">
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 glow-spot-left pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] glow-spot-ambient pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="max-w-xl space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 block">
            Bespoke Atelier Configurator
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white uppercase italic leading-none">
            Tailor Your Chassis
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Select high-performance structural enhancements to define your Superwheel build sheet. 
            All allocations include individual engine test curves and high-speed carbon training loops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Options Selector */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] mb-2 text-left">
              Select Desired Track Options
            </div>

            {optionsList.map((option) => {
              const isSelected = selectedIDs.includes(option.id);
              return (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`p-5 rounded-xl border cursor-pointer select-none text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-neutral-900 border-orange-500/30'
                      : 'bg-neutral-950/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex h-full gap-4 items-start">
                    {/* Checkbox circle */}
                    <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-orange-600 border-transparent text-white' : 'border-neutral-700'
                    }`}>
                      {isSelected && <Check size={12} />}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
                        <h4 className="text-sm font-semibold text-white tracking-wide">
                          {option.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-orange-500">
                          +${option.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-xs leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Allocation Calculator Summary Form */}
          <div className="lg:col-span-5">
            <div className="panel-glass rounded-xl p-8 border border-white/10 shadow-2xl space-y-6">
              
              <div className="text-left space-y-1 pb-4 border-b border-white/5">
                <h3 className="font-display font-bold uppercase text-sm tracking-widest text-neutral-200">
                  Total Allocation Summary
                </h3>
                <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                  Subject to atelier design slot availability
                </span>
              </div>

              {/* Price Calculation rows */}
              <div className="space-y-3 font-mono text-xs border-b border-white/5 pb-4">
                <div className="flex justify-between text-neutral-400">
                  <span>Base Model Apollo V12:</span>
                  <span className="text-neutral-200">${basePrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Atelier Tailored Packs ({selectedIDs.length}):</span>
                  <span className="text-neutral-200">+${currentOptionsPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-950">
                  <span>ESTIMATED TOTAL:</span>
                  <span className="text-orange-500">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Allocation Request Box */}
              {!submitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sterling Hunter"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-neutral-950/80 hover:bg-neutral-950/100 focus:bg-neutral-950/100 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-600"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      Secure Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. hunter@atelier-reserve.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full bg-neutral-950/80 hover:bg-neutral-950/100 focus:bg-neutral-950/100 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-600"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      Custom Specifications/Inquiries (Optional)
                    </label>
                    <textarea
                      placeholder="Include details about customized paint finish codes or delivery details..."
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full bg-neutral-950/80 hover:bg-neutral-950/100 focus:bg-neutral-950/100 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-600 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-display font-extrabold text-xs uppercase tracking-widest shadow-[0_4px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_45px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    SUBMIT TO ATELIER SECURELY <Send size={12} />
                  </button>
                </form>
              ) : (
                <div className="anim-success-box py-8 px-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-display font-extrabold text-white uppercase tracking-wider">
                      Allocation Request Saved
                    </h4>
                    <p className="text-[10px] text-orange-400 font-mono">
                      CODE STATUS: EXCLUSIVE_RESERVE_HEIDELBERG
                    </p>
                  </div>
                  <p className="text-neutral-400 text-xs">
                    Thank you, <strong>{inquiryName}</strong>. Our atelier advisors will verify your allocation slots and reach out directly at <strong>{inquiryEmail}</strong> within 12 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryName('');
                      setInquiryEmail('');
                      setInquiryMessage('');
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[10px] font-mono text-neutral-400 hover:text-white uppercase tracking-widest border border-white/5 rounded transition-all"
                  >
                    Configure Another Frame
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
