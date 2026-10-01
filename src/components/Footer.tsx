import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Phone } from 'lucide-react';
import { WolfLogo } from './WolfLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#000000] border-t border-[#2A2A2A] text-[#999999] relative overflow-hidden">
      {/* Red accent line top */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <WolfLogo size={42} />
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-wider text-white">
                  TVM <span className="text-[#FF1A1A]">HACKER HUB</span>
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[#FF1A1A]">
                  LEARN • HACK • BUILD • SECURE
                </span>
              </div>
            </div>
            <p className="text-sm text-[#E5E5E5]/75 max-w-md leading-relaxed">
              A premier community for students and cybersecurity enthusiasts interested in ethical hacking, CTF challenges, hackathons, vulnerability research, and hands-on defense tactics.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#999999]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF1A1A]" /> Thiruvannamalai, Tamil Nadu
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FF1A1A] rounded-full" />
              Community Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-[#999999] hover:text-[#FF1A1A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-[#999999] hover:text-[#FF1A1A] transition-colors">
                  About Community
                </Link>
              </li>
              <li>
                <Link to="/#activities" className="text-[#999999] hover:text-[#FF1A1A] transition-colors">
                  Activities & Events
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[#999999] hover:text-[#FF1A1A] transition-colors">
                  Member Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Enquiries & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FF1A1A] rounded-full" />
              Enquiries & Contact
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <a
                  href="mailto:tvmhackershub@gmail.com"
                  className="text-[#E5E5E5] hover:text-[#FF1A1A] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF1A1A] flex-shrink-0" />
                  <span className="break-all">tvmhackershub@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+916379869678"
                  className="text-[#E5E5E5] hover:text-[#FF1A1A] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF1A1A] flex-shrink-0" />
                  <span>+91 63798 69678</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 mt-8 border-t border-[#2A2A2A]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} TVM Hacker Hub. All rights reserved.</p>
          <p className="font-mono">
            DISCLAIMER: For ethical education & authorized research purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};
