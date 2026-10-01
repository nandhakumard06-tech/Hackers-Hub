import React from 'react';
import { Flag, Award, BookOpen, LucideIcon } from 'lucide-react';

interface ActivityCardProps {
  title: string;
  subtitle: string;
  description: string;
  iconName: 'flag' | 'award' | 'book';
  tag: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  subtitle,
  description,
  iconName,
  tag,
}) => {
  const getIcon = () => {
    switch (iconName) {
      case 'flag':
        return <Flag className="w-8 h-8 text-[#FF1A1A]" />;
      case 'award':
        return <Award className="w-8 h-8 text-[#FF1A1A]" />;
      case 'book':
        return <BookOpen className="w-8 h-8 text-[#FF1A1A]" />;
      default:
        return <Flag className="w-8 h-8 text-[#FF1A1A]" />;
    }
  };

  return (
    <div className="group relative bg-[#111111] hover:bg-[#181818] border border-[#2A2A2A] hover:border-[#FF1A1A] rounded-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,26,26,0.35)] flex flex-col justify-between cyber-card-clip overflow-hidden">
      {/* Background cyber accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FF1A1A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Top Header with Icon & Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-[#080808] border border-[#2A2A2A] group-hover:border-[#FF1A1A] rounded-md transition-colors">
            {getIcon()}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#999999] group-hover:text-[#FF1A1A] transition-colors border border-[#2A2A2A] group-hover:border-[#FF1A1A]/40 px-2.5 py-1 rounded bg-[#080808]">
            {tag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <p className="font-mono text-xs font-bold text-[#FF1A1A] tracking-wider uppercase mb-1">
          {subtitle}
        </p>
        <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#E5E5E5]/75 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Card Footer Bar */}
      <div className="mt-8 pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono text-[#999999]">
        <span className="group-hover:text-white transition-colors">INITIATIVE</span>
        <span className="text-[#FF1A1A] group-hover:translate-x-1 transition-transform inline-block">
          → ENTER LAB
        </span>
      </div>
    </div>
  );
};
