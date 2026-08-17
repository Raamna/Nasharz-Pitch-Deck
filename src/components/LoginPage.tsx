import React, { useState } from 'react';
import { BrandingConfig } from '../types';
import { Lock, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LoginPageProps {
  branding: BrandingConfig;
  onClientLogin: (name: string) => void;
  onAdminLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  branding,
  onClientLogin,
  onAdminLogin,
}) => {
  const [name, setName] = useState('aati');
  const [accessCode, setAccessCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim() || 'Valued Client';
    const code = accessCode.trim();

    // Check Admin Login credentials: aati / 566288
    if (trimmedName.toLowerCase() === 'aati' && code === branding.adminPassword) {
      onAdminLogin();
      return;
    }

    // Check Client Login credentials: alaska$bat, login alaska, Alaska$Bat
    const validClientCodes = [
      branding.clientAccessCode.toLowerCase(),
      'login alaska',
      'alaska$bat',
    ];

    if (validClientCodes.includes(code.toLowerCase())) {
      onClientLogin(trimmedName);
    } else {
      setErrorMsg('Invalid access code. Please use "alaska$bat" for client or "566288" for admin.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 lg:p-16 bg-zinc-950 text-white font-sans overflow-hidden">
      
      {/* Full Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={branding.robotWide}
          alt="Alaska Batteries Visual"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft Vignette & Dark Overlay for optimal image visibility and high contrast text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/75"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>
      </div>

      {/* Left Content Banner - Anchored to Bottom Left */}
      <div className="relative z-10 w-full lg:w-1/2 mb-6 lg:mb-0 max-w-xl self-end">
        <div className="space-y-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#c69a53] block">
            Alaska Batteries
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none font-heading">
            Launch Deck
          </h1>
          <p className="text-base sm:text-xl font-normal text-white/80 font-sans tracking-tight">
            From brief to final execution.
          </p>
        </div>
      </div>

      {/* Right Frosted Glass Login Card */}
      <div className="relative z-10 w-full lg:w-[440px] xl:w-[480px] bg-zinc-900/65 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between my-auto">
        
        <div>
          {/* Top Header Logo */}
          <div className="flex items-center gap-3 mb-8">
            <BrandLogo src={branding.whiteLogo || branding.blackLogo} alt="Nasharz Icon" className="h-6 w-auto object-contain" fallbackColor="#ffffff" />
            <span className="h-3.5 w-px bg-white/20"></span>
            <span className="text-xs font-semibold text-white/90 tracking-tight font-sans">
              Nasharz Films
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <div className="w-10 h-10 bg-white/10 border border-white/15 rounded-full flex items-center justify-center mb-5 text-[#c69a53]">
              <Lock className="w-4 h-4 text-[#c69a53]" />
            </div>
            
            <span className="text-xs font-medium text-[#c69a53] block mb-2">
              Private presentation
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.1] mb-2 font-heading">
              Alaska<br />Batteries.
            </h2>

            <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
              From brief to final execution.
            </p>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/70 font-medium block mb-1.5">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c69a53]/60 focus:border-[#c69a53] transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs text-white/70 font-medium block mb-1.5">
                Access code
              </label>
              <input
                type="password"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="••••••"
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c69a53]/60 focus:border-[#c69a53] transition-all font-medium"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-300 bg-red-950/60 p-3 rounded-xl font-medium border border-red-500/30">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#c69a53] hover:bg-[#d6aa63] text-zinc-950 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-between transition-all shadow-lg active:scale-[0.99] cursor-pointer mt-5"
            >
              <span>Open campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Credits */}
        <div className="pt-8 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-normal">
          <span>Produced by Nasharz</span>
          <span>2K26</span>
        </div>

      </div>
    </div>
  );
};

