import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Sparkles, Eye, EyeOff, Check, X, Shield, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const { login, register, demoLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Password reset fields
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!termsAccepted) {
          throw new Error('Please accept the Terms of Service and Privacy Policy to continue.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await register(name, email, password, confirmPassword);
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'login') {
        await login(email, password);
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword(email);
        setSuccessMsg(res.message);
        if (res.demoCode) {
          setResetCode(res.demoCode);
        }
        setMode('reset');
      } else if (mode === 'reset') {
        const res = await api.resetPassword({ email, code: resetCode, newPassword });
        setSuccessMsg(res.message);
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: 'student' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Visual & Value Proposition */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-r border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CareerAI</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              Discover Your Future. Build Your Career.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Empower your trajectory with intelligent skill profiling, verified market benchmarks, and customized 5-phase career roadmaps.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Transparent scoring weights for skills, interests & academics</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Curated beginner project milestones & verified certifications</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Ground truth salary estimates cited with official BLS reports</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-6 border-t border-slate-800/80">
            <p className="text-[11px] font-medium text-slate-400 mb-2">Evaluator Quick Sign-In:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('student')}
                className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors text-center cursor-pointer"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('admin')}
                className="px-3 py-2 text-xs font-medium text-amber-300 bg-slate-800 hover:bg-slate-700/80 border border-amber-500/30 rounded-lg transition-colors text-center cursor-pointer"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {mode === 'login' && 'Sign in to CareerAI'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset your password'}
              {mode === 'reset' && 'Enter new password'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' && 'Welcome back. Enter your credentials to access your dashboard.'}
              {mode === 'register' && 'Join thousands of students finding clarity in their career journey.'}
              {mode === 'forgot' && 'Enter your email to receive a password reset code.'}
              {mode === 'reset' && 'Provide the reset code and create a new secure password.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {(mode === 'login' || mode === 'register') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setError(null); setMode('forgot'); }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength indicator for registration */}
                {mode === 'register' && password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Strength: {strengthLabels[strength - 1] || 'Too short'}</span>
                      <span className="font-mono">{password.length} chars</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1">
                      {[0, 1, 2, 3].map((lvl) => (
                        <div
                          key={lvl}
                          className={`rounded-full transition-all ${
                            strength > lvl ? strengthColors[strength - 1] : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {mode === 'reset' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Verification Code</label>
                  <input
                    type="text"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-400 cursor-pointer">
                  Remember me on this browser
                </label>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 text-[11px] text-slate-400 cursor-pointer leading-tight">
                  I agree to CareerAI's <span className="text-slate-200 underline">Terms of Service</span> and <span className="text-slate-200 underline">Privacy Policy</span>.
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-all shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Code'}
                    {mode === 'reset' && 'Reset Password'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle login / register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setError(null); setMode('register'); }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Sign up for free
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setError(null); setMode('login'); }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => { setError(null); setMode('login'); }}
                className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
