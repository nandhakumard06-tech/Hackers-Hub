import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WolfLogo } from './WolfLogo';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
    { label: 'MEMBERS', path: '/members', icon: Users },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#080808] border-b lg:border-b-0 lg:border-r border-[#2A2A2A] flex flex-col justify-between flex-shrink-0">
      <div className="p-5">
        {/* Admin Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#2A2A2A]">
          <WolfLogo size={38} />
          <div>
            <span className="font-display font-black text-base text-white tracking-wider block">
              TVM <span className="text-[#FF1A1A]">CONSOLE</span>
            </span>
            <span className="text-[10px] font-mono text-[#22C55E] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              SESSION ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded font-mono text-xs font-bold tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#FF1A1A] text-white shadow-[0_0_12px_rgba(255,26,26,0.5)]'
                    : 'text-[#999999] hover:text-white hover:bg-[#111111] border border-transparent hover:border-[#2A2A2A]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF1A1A]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Info & Logout */}
      <div className="p-5 border-t border-[#2A2A2A] bg-[#000000]/60 space-y-3">
        <div className="text-xs font-mono truncate">
          <p className="text-[#666666] text-[10px] uppercase">Authenticated As</p>
          <p className="text-white truncate font-semibold">{admin?.email || 'Admin Operative'}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#111111] hover:bg-[#1a0505] text-[#FF1A1A] hover:text-[#FF3333] border border-[#2A2A2A] hover:border-[#FF1A1A] font-mono text-xs font-bold tracking-wider transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </aside>
  );
};
