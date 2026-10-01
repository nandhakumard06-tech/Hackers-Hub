import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.05]">
              TVM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF1A1A] filter drop-shadow-[0_0_20px_rgba(255,26,26,0.4)]">
                HACKER HUB
              </span>
            </h1>

            {/* Tagline */}
            <p className="font-mono text-base sm:text-lg font-bold tracking-widest text-[#FF1A1A] uppercase">
              LEARN • HACK • BUILD • SECURE
            </p>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#E5E5E5]/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A community for students and cybersecurity enthusiasts interested in ethical hacking, CTFs, hackathons, security research, and practical cybersecurity learning.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md bg-[#FF1A1A] hover:bg-[#FF3333] text-white font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,26,26,0.6)] hover:shadow-[0_0_35px_rgba(255,26,26,0.9)] transform hover:-translate-y-0.5"
              >
                <span>JOIN THE COMMUNITY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-md bg-[#111111] hover:bg-[#181818] text-[#E5E5E5] hover:text-white border border-[#2A2A2A] hover:border-[#FF1A1A] font-mono text-sm font-semibold tracking-wider transition-all"
              >
                <Terminal className="w-4 h-4 text-[#FF1A1A]" />
                <span>EXPLORE MISSIONS</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-[#2A2A2A]/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-mono text-2xl font-black text-white">100%</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider">Hands-on Labs</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-black text-[#FF1A1A]">CTFs</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider">Competitions</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-black text-white">0₹</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider">Free Community</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Official TVM Hacker Hub Circular Emblem */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              {/* Outer Cyber Glow Rings */}
              <div className="absolute -inset-6 rounded-full border border-[#FF1A1A]/40 animate-pulse-slow shadow-[0_0_40px_rgba(255,26,26,0.4)] pointer-events-none" />
              <div
                className="absolute -inset-10 rounded-full border border-dashed border-[#FF1A1A]/20 animate-spin pointer-events-none"
                style={{ animationDuration: '45s' }}
              />

              {/* Exact Requested Circular Logo Container */}
              <div className="relative z-10 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full overflow-hidden border-2 border-[#FF1A1A] shadow-[0_0_30px_rgba(255,26,26,0.7)] bg-[#080808] transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/logo.png"
                  alt="TVM Hacker Hub - Thiruvannamalai"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
