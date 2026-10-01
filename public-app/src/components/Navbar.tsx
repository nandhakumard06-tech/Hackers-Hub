import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { WolfLogo } from './WolfLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavClick = (hashId?: string) => {
    setMobileMenuOpen(false);
    if (hashId) {
      if (location.pathname !== '/') {
        navigate(`/${hashId}`);
      } else {
        const el = document.querySelector(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]/90 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform duration-200"
            onClick={() => handleNavClick()}
          >
            <WolfLogo size={42} />
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white group-hover:text-[#FF1A1A] transition-colors flex items-center gap-1.5">
                TVM <span className="text-[#FF1A1A]">HACKER HUB</span>
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#999999] group-hover:text-white transition-colors">
                LEARN • HACK • BUILD • SECURE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (No admin references) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold tracking-wider transition-colors relative py-1 ${
                isActive('/') && !location.hash
                  ? 'text-[#FF1A1A]'
                  : 'text-[#E5E5E5] hover:text-[#FF1A1A]'
              }`}
            >
              HOME
              {isActive('/') && !location.hash && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF1A1A] shadow-[0_0_8px_#FF1A1A]" />
              )}
            </Link>

            <button
              onClick={() => handleNavClick('#about')}
              className="text-sm font-semibold tracking-wider text-[#E5E5E5] hover:text-[#FF1A1A] transition-colors py-1 cursor-pointer"
            >
              ABOUT
            </button>

            <button
              onClick={() => handleNavClick('#activities')}
              className="text-sm font-semibold tracking-wider text-[#E5E5E5] hover:text-[#FF1A1A] transition-colors py-1 cursor-pointer"
            >
              ACTIVITIES
            </button>

            <Link
              to="/register"
              className={`text-sm font-semibold tracking-wider transition-colors relative py-1 ${
                isActive('/register')
                  ? 'text-[#FF1A1A]'
                  : 'text-[#E5E5E5] hover:text-[#FF1A1A]'
              }`}
            >
              REGISTER
              {isActive('/register') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF1A1A] shadow-[0_0_8px_#FF1A1A]" />
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#E5E5E5] hover:text-white hover:bg-[#181818] border border-[#2A2A2A] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FF1A1A]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (No admin references) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080808] border-b border-[#2A2A2A] px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => handleNavClick()}
            className={`block px-3 py-2 rounded text-base font-semibold tracking-wider ${
              isActive('/') && !location.hash
                ? 'bg-[#181818] text-[#FF1A1A] border-l-4 border-[#FF1A1A]'
                : 'text-[#E5E5E5] hover:bg-[#111111] hover:text-[#FF1A1A]'
            }`}
          >
            HOME
          </Link>

          <button
            onClick={() => handleNavClick('#about')}
            className="w-full text-left block px-3 py-2 rounded text-base font-semibold tracking-wider text-[#E5E5E5] hover:bg-[#111111] hover:text-[#FF1A1A]"
          >
            ABOUT
          </button>

          <button
            onClick={() => handleNavClick('#activities')}
            className="w-full text-left block px-3 py-2 rounded text-base font-semibold tracking-wider text-[#E5E5E5] hover:bg-[#111111] hover:text-[#FF1A1A]"
          >
            ACTIVITIES
          </button>

          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded text-base font-semibold tracking-wider ${
              isActive('/register')
                ? 'bg-[#181818] text-[#FF1A1A] border-l-4 border-[#FF1A1A]'
                : 'text-[#E5E5E5] hover:bg-[#111111] hover:text-[#FF1A1A]'
            }`}
          >
            REGISTER
          </Link>
        </div>
      )}
    </header>
  );
};
