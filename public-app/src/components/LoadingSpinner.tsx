import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
}) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-t-[#FF1A1A] border-r-[#FF1A1A] border-b-transparent border-l-transparent animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeMap[size]} rounded-full border-t-transparent border-r-transparent border-b-white/40 border-l-white/40 animate-spin animate-reverse`}
          style={{ animationDuration: '1.5s' }}
        />
      </div>
      {text && (
        <span className="font-mono text-xs uppercase tracking-widest text-[#999999] animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};
