import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full ${maxWidth} bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/40 rounded-lg p-6 shadow-2xl transition-all duration-300`}
      >
        {/* Top corner red cyber accent */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
          <div className="absolute transform rotate-45 bg-[#FF1A1A] w-12 h-2 -top-2 -right-4 shadow-[0_0_8px_#FF1A1A]" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A2A2A]">
          <div>
            <h3
              id="modal-title"
              className="text-lg font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 bg-[#FF1A1A] rounded-full animate-ping" />
              {title}
            </h3>
            <div className="h-0.5 w-16 bg-[#FF1A1A] mt-1" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#999999] hover:text-[#FF1A1A] hover:bg-[#181818] rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-[#E5E5E5]">{children}</div>
      </div>
    </div>
  );
};
