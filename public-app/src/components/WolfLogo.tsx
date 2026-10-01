import React from 'react';
import tvmLogo from '../assets/tvm-logo.png';

interface WolfLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const WolfLogo: React.FC<WolfLogoProps> = ({
  className = '',
  size = 48,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={tvmLogo}
        alt="TVM Hacker Hub - Thiruvannamalai"
        className={`w-full h-full object-contain rounded-md transition-transform duration-300 ${
          glow
            ? 'filter drop-shadow-[0_0_12px_rgba(255,26,26,0.65)] hover:drop-shadow-[0_0_20px_rgba(255,26,26,0.9)]'
            : ''
        }`}
      />
    </div>
  );
};
