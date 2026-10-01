import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, User, Mail, Phone, ShieldAlert, Cpu, Trophy, Hash } from 'lucide-react';
import { RegistrationFormData } from '../types/registration';
import { validateRegistrationForm, ValidationErrors } from '../utils/validation';
import { createRegistration } from '../firebase/firestore';

export const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    mobile: '',
    hackingLevel: '',
    attendedWolfCTF: '',
    attendedWolfHackathons: '',
    hackathonCount: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'attendedWolfHackathons') {
      let countValue = '';
      if (value === 'no') {
        countValue = 'New member';
      } else if (value === 'yes') {
        countValue = '';
      }
      setFormData((prev) => ({
        ...prev,
        attendedWolfHackathons: value as any,
        hackathonCount: countValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear inline error when typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (duplicateError) {
      setDuplicateError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError(null);

    // Validate form fields
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Firestore & trigger email
      const payload: RegistrationFormData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: validation.formattedMobile,
        hackathonCount: formData.hackathonCount || (formData.attendedWolfHackathons === 'no' ? 'New member' : ''),
      };

      await createRegistration(payload);

      // Redirect to /success with member state
      navigate('/success', {
        state: {
          member: {
            name: payload.name,
            email: payload.email,
            mobile: payload.mobile,
            hackingLevel: payload.hackingLevel,
            attendedWolfCTF: payload.attendedWolfCTF,
            attendedWolfHackathons: payload.attendedWolfHackathons,
            hackathonCount: payload.hackathonCount,
          },
        },
      });
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.message && err.message.includes('already registered')) {
        setDuplicateError('This email is already registered with TVM Hackers Hub.');
      } else {
        setDuplicateError(err.message || 'An unexpected error occurred during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/50 rounded-xl p-6 sm:p-10 shadow-2xl transition-all duration-300 relative cyber-card-clip">
      {/* Red Accent Header Line */}
      <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent shadow-[0_0_10px_#FF1A1A]" />

      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wider text-white uppercase">
          MEMBER <span className="text-[#FF1A1A]">REGISTRATION</span>
        </h2>
        <p className="font-mono text-xs text-[#999999] mt-2 uppercase tracking-widest">
          JOIN THE CYBER ELITE • TVM HACKERS HUB
        </p>
      </div>

      {/* Duplicate / Server Error Alert */}
      {duplicateError && (
        <div className="mb-6 p-4 rounded-lg bg-[#1a0505] border border-[#FF1A1A] text-white flex items-start gap-3 shadow-[0_0_15px_rgba(255,26,26,0.3)] animate-shake">
          <AlertTriangle className="w-5 h-5 text-[#FF1A1A] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-mono font-bold text-[#FF1A1A] uppercase tracking-wider text-xs mb-0.5">
              Registration Warning
            </p>
            <p className="text-[#E5E5E5] font-medium">{duplicateError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#FF1A1A]" />
            Full Name <span className="text-[#FF1A1A]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. peter parker"
            className={`w-full px-4 py-3 bg-[#080808] border ${
              errors.name ? 'border-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.5)]' : 'border-[#2A2A2A]'
            } focus:border-[#FF1A1A] rounded text-white placeholder-[#666666] text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs font-mono text-[#FF1A1A] flex items-center gap-1">
              <span>✕</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#FF1A1A]" />
            Email Address <span className="text-[#FF1A1A]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. member@tvmhackers.org"
            className={`w-full px-4 py-3 bg-[#080808] border ${
              errors.email ? 'border-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.5)]' : 'border-[#2A2A2A]'
            } focus:border-[#FF1A1A] rounded text-white placeholder-[#666666] text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-mono text-[#FF1A1A] flex items-center gap-1">
              <span>✕</span> {errors.email}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobile" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#FF1A1A]" />
            Mobile Number (India) <span className="text-[#FF1A1A]">*</span>
          </label>
          <div className="relative">
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+919876543210 or 10-digit number"
              className={`w-full px-4 py-3 bg-[#080808] border ${
                errors.mobile ? 'border-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.5)]' : 'border-[#2A2A2A]'
              } focus:border-[#FF1A1A] rounded text-white placeholder-[#666666] text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all`}
            />
          </div>
          {errors.mobile ? (
            <p className="mt-1.5 text-xs font-mono text-[#FF1A1A] flex items-center gap-1">
              <span>✕</span> {errors.mobile}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-[#888888] font-mono">
              Supports +91XXXXXXXXXX or standard 10-digit format
            </p>
          )}
        </div>

        {/* Ethical Hacking Level */}
        <div>
          <label htmlFor="hackingLevel" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF1A1A]" />
            Ethical Hacking Level <span className="text-[#FF1A1A]">*</span>
          </label>
          <select
            id="hackingLevel"
            name="hackingLevel"
            required
            value={formData.hackingLevel}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[#080808] border ${
              errors.hackingLevel ? 'border-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.5)]' : 'border-[#2A2A2A]'
            } focus:border-[#FF1A1A] rounded text-white text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all cursor-pointer`}
          >
            <option value="" disabled className="text-[#666666]">
              Select level
            </option>
            <option value="basic" className="bg-[#111111] text-white py-1">
              Basic (Beginner / Foundational Security Concepts)
            </option>
            <option value="intermediate" className="bg-[#111111] text-white py-1">
              Intermediate (CTF Player / Scripting & Web Exploitation)
            </option>
            <option value="advanced" className="bg-[#111111] text-white py-1">
              Advanced (Vulnerability Research / Reverse Engineering / Binary Exploitation)
            </option>
          </select>
          {errors.hackingLevel && (
            <p className="mt-1.5 text-xs font-mono text-[#FF1A1A] flex items-center gap-1">
              <span>✕</span> {errors.hackingLevel}
            </p>
          )}
        </div>

        {/* Two Question Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Attended Wolf CTF */}
          <div>
            <label htmlFor="attendedWolfCTF" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#FF1A1A]" />
              Attended Wolf CTF? <span className="text-[#FF1A1A]">*</span>
            </label>
            <select
              id="attendedWolfCTF"
              name="attendedWolfCTF"
              required
              value={formData.attendedWolfCTF}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#080808] border ${
                errors.attendedWolfCTF ? 'border-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.5)]' : 'border-[#2A2A2A]'
              } focus:border-[#FF1A1A] rounded text-white text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all cursor-pointer`}
            >
              <option value="" disabled className="text-[#666666]">
                Select option
              </option>
              <option value="yes" className="bg-[#111111] text-white py-1">
                Yes
              </option>
              <option value="no" className="bg-[#111111] text-white py-1">
                No
              </option>
            </select>
            {errors.attendedWolfCTF && (
              <p className="mt-1.5 text-xs font-mono text-[#FF1A1A] flex items-center gap-1">
                <span>✕</span> {errors.attendedWolfCTF}
              </p>
            )}
          </div>

          {/* Attended Wolf Hackathons */}
          <div>
            <label htmlFor="wolfHackathonSelect" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#FF1A1A]" />
              Attended Wolf Hackathons? <span className="text-[#FF1A1A]">*</span>
            </label>
            <select
              id="wolfHackathonSelect"
              name="attendedWolfHackathons"
              required
              value={formData.attendedWolfHackathons}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#080808] border ${
                errors.attendedWolfHackathons ? 'border-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.5)]' : 'border-[#2A2A2A]'
              } focus:border-[#FF1A1A] rounded text-white text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all cursor-pointer`}
            >
              <option value="" disabled className="text-[#666666]">
                Select option
              </option>
              <option value="yes" className="bg-[#111111] text-white py-1">
                Yes
              </option>
              <option value="no" className="bg-[#111111] text-white py-1">
                No
              </option>
            </select>
            {errors.attendedWolfHackathons && (
              <p className="mt-1.5 text-xs font-mono text-[#FF1A1A] flex items-center gap-1">
                <span>✕</span> {errors.attendedWolfHackathons}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Hackathon Count Box (Appears when an option is selected) */}
        {formData.attendedWolfHackathons && (
          <div className="animate-fadeIn">
            <label htmlFor="hackathonCount" className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-[#FF1A1A]" />
              {formData.attendedWolfHackathons === 'yes' ? 'Number of Hackathons Attended' : 'Status'}
            </label>
            <input
              type="text"
              id="hackathonCount"
              name="hackathonCount"
              value={formData.hackathonCount || ''}
              onChange={handleChange}
              readOnly={formData.attendedWolfHackathons === 'no'}
              placeholder={formData.attendedWolfHackathons === 'yes' ? 'Enter number of hackathons' : ''}
              className={`w-full px-4 py-3 bg-[#080808] border border-[#2A2A2A] rounded text-white text-sm font-sans focus:outline-none transition-all ${
                formData.attendedWolfHackathons === 'no'
                  ? 'bg-[#181818] text-[#888888] cursor-not-allowed border-[#333333]'
                  : 'focus:border-[#FF1A1A] focus:ring-1 focus:ring-[#FF1A1A] placeholder-[#666666]'
              }`}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-md bg-[#FF1A1A] hover:bg-[#FF3333] text-white font-mono font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,26,26,0.5)] hover:shadow-[0_0_30px_rgba(255,26,26,0.8)] border border-transparent hover:border-white/30 flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>REGISTERING...</span>
              </>
            ) : (
              <span>REGISTER NOW</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
