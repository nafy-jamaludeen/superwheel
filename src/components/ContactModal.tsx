import React, { useState } from 'react';
import { X, Send, ShieldCheck, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCar?: string;
}

export default function ContactModal({ isOpen, onClose, preselectedCar }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("https://formsubmit.co/ajax/9canff@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🏎️ New Allocation Slot Request from ${name}`,
          "Legal Name": name,
          "Identity Email": email,
          "Phone Link": phone,
          "Personal Specifications": message || "No custom specifications listed.",
          "Direct Selection Model": preselectedCar || 'Showroom Portfolio General Inquiry'
        })
      });
    } catch (err) {
      console.warn("FormSubmit transmission failed:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blacked Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Glass Frame */}
      <div className="relative w-full max-w-xl panel-glass border border-white/10 rounded-2xl p-8 z-10 shadow-3xl text-left overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.2em] block">
                Allocation Registry
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white uppercase italic leading-none">
                Request Private Slot
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Superwheel models are allocated by individual atelier review. Provide legal coordinates below to schedule a live video handshake sequence.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {preselectedCar && (
                <div className="bg-orange-500/5 border border-orange-500/10 p-3.5 rounded-lg text-xs flex justify-between items-center text-orange-400 font-mono">
                  <span>MODEL DIRECT SELECTION:</span>
                  <span className="font-bold text-white uppercase tracking-wider">{preselectedCar}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexis Drazen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 focus:bg-neutral-950 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-700"
                  />
                </div>

                <div className="space-y-1 font-sans">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-medium">
                    Phone Link
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+49 (176) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 focus:bg-neutral-950 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  Secure Identity Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. drazen@heidelberg-global.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 focus:bg-neutral-950 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  Personal Specifications Outline
                </label>
                <textarea
                  placeholder="Draft requirements regarding specific carbon weaves, exterior aerodynamic packages or chassis calibration codes..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-950 focus:bg-neutral-950 py-3 px-4 rounded-lg border border-white/5 focus:border-orange-500/50 outline-none text-xs transition-all text-white placeholder-neutral-700 resize-none font-sans"
                />
              </div>

              <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 uppercase pb-1 tracking-wider">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Atelier Privacy Standard // Secured TLS 1.3 Active</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-display font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(249,115,22,0.3)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> ESTABLISHING TELEPHONE ENCRYPTION...
                  </>
                ) : (
                  <>
                    TRANSMIT SECURE REGISTRY <Send size={12} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto animate-pulse">
              <ShieldCheck size={28} />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-display font-extrabold text-white uppercase tracking-wider italic">
                Registry Active
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your allocation request for the <strong className="text-orange-500">{preselectedCar || 'Superwheel'} showroom</strong> has been securely filed. 
                Our senior portfolio advisors will contact you at <strong>{phone}</strong> to confirm your design review.
              </p>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setPhone('');
                setMessage('');
                onClose();
              }}
              className="px-6 py-3 bg-white text-black text-xs font-display font-bold uppercase tracking-widest rounded-lg transition-transform hover:scale-105"
            >
              Close Studio
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
