import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Terminal, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { WolfLogo } from '../components/WolfLogo';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated admin, redirect to /dashboard
  useEffect(() => {
    if (!loading && admin && admin.isAdmin) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [admin, loading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both admin credentials.');
      return;
    }

    setIsSubmitting(true);

    try {
      await loginAdmin(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Admin authentication error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('Invalid security authorization credentials.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Rate limit exceeded. Security lockout active. Please try again later.');
      } else {
        setError(err.message || 'Access denied. Please verify credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-[#111111] border border-[#2A2A2A] hover:border-[#FF1A1A]/60 rounded-xl p-8 sm:p-10 shadow-2xl relative cyber-card-clip">
        {/* Top Glow & Logo */}
        <div className="flex flex-col items-center mb-8">
          <WolfLogo size={64} glow={true} />
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded bg-[#080808] border border-[#2A2A2A] text-[#FF1A1A] font-mono text-xs font-bold uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            LOCAL SECURITY GATEWAY
          </div>
          <h1 className="text-2xl font-display font-black tracking-wider text-white uppercase mt-2">
            ADMIN <span className="text-[#FF1A1A]">CONSOLE</span>
          </h1>
          <p className="text-xs text-[#999999] font-mono mt-1">
            LOCAL-ONLY PRIVILEGED ACCESS • TVM HACKER HUB
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded bg-[#1a0505] border border-[#FF1A1A] text-white flex items-start gap-2.5 text-xs font-mono shadow-[0_0_12px_rgba(255,26,26,0.25)]">
            <AlertCircle className="w-4 h-4 text-[#FF1A1A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#FF1A1A]">CLEARANCE_DENIED:</p>
              <p className="text-[#E5E5E5]">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF1A1A]" />
              Account ID / Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tvmhackershub@gmail.com"
              className="w-full px-4 py-3 bg-[#080808] border border-[#2A2A2A] focus:border-[#FF1A1A] rounded text-white placeholder-[#666666] text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF1A1A]" />
              Passphrase
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#080808] border border-[#2A2A2A] focus:border-[#FF1A1A] rounded text-white placeholder-[#666666] text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#FF1A1A] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded bg-[#FF1A1A] hover:bg-[#FF3333] text-white font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,26,26,0.4)] flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'opacity-75 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-[0_0_25px_rgba(255,26,26,0.7)]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>EXECUTE LOGIN</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
