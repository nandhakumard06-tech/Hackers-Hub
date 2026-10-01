import React from 'react';
import { RegistrationForm } from '../components/RegistrationForm';
import { ShieldCheck, Lock, Terminal, Zap } from 'lucide-react';

export const Register: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Breadcrumb / Title */}
        <div className="text-center mb-10 space-y-3">

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            MEMBER <span className="text-[#FF1A1A]">REGISTRATION</span>
          </h1>
          <p className="text-sm sm:text-base text-[#999999] max-w-lg mx-auto font-sans">
            Join the TVM Hackers Hub community network. Fill out the form below to receive event notifications, challenge invites, and workshop access.
          </p>
        </div>

        {/* The Form */}
        <RegistrationForm />


      </div>
    </div>

  );
};
