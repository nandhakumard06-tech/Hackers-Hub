import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />

      {/* Red Radial Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-red-700/5 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px]" />

      {/* Micro Scanline Overlay */}
      <div className="scanline-overlay opacity-25" />
    </div>
  );
};
