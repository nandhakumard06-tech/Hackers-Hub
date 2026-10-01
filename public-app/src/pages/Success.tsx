import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Home, Mail, Shield, ArrowRight } from 'lucide-react';
import { WolfLogo } from '../components/WolfLogo';

export const Success: React.FC = () => {
  const location = useLocation();
  const member = location.state?.member;

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/40 rounded-xl p-8 sm:p-12 text-center shadow-[0_0_40px_rgba(255,26,26,0.15)] relative cyber-card-clip">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#FF1A1A]/20 to-transparent pointer-events-none" />

        {/* Big Check Icon inside Glowing Red Circle */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FF1A1A]/20 border-2 border-[#FF1A1A] animate-ping opacity-40" />
          <div className="relative w-20 h-20 rounded-full bg-[#080808] border-2 border-[#FF1A1A] flex items-center justify-center shadow-[0_0_25px_rgba(255,26,26,0.6)]">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-2xl sm:text-4xl font-display font-black tracking-wider text-white uppercase mb-3">
          REGISTRATION <span className="text-[#FF1A1A]">SUCCESSFUL</span>
        </h1>

        <p className="font-mono text-sm sm:text-base font-bold text-[#FF1A1A] uppercase tracking-wider mb-2">
          Welcome to TVM Hackers Hub!
        </p>

        <p className="text-sm sm:text-base text-[#E5E5E5]/90 mb-4 font-normal">
          Your registration has been received.
        </p>

        <div className="p-4 bg-[#080808] border border-[#2A2A2A] rounded-lg mb-8 text-left space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#999999]">
            <Mail className="w-4 h-4 text-[#FF1A1A]" />
            <span>
              A confirmation email will be sent to your registered email address.
            </span>
          </div>
          {member?.email && (
            <div className="pt-2 border-t border-[#2A2A2A] text-white">
              <span className="text-[#888888]">Registered Email:</span>{' '}
              <span className="text-[#FF1A1A] font-bold">{member.email}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-[#FF1A1A] hover:bg-[#FF3333] text-white font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,26,26,0.5)]"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#080808] hover:bg-[#181818] text-[#E5E5E5] border border-[#2A2A2A] hover:border-[#FF1A1A] font-mono text-sm font-semibold tracking-wider transition-all"
          >
            <span>REGISTER ANOTHER</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
