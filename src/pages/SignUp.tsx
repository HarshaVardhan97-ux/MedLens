import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const SignUp: React.FC = () => {
  const { signUpReal, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Clinical Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await signUpReal(fullName, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0F766E_0.75px,transparent_0.75px)] [background-size:24px_24px]"></div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-8 flex items-center">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1VNOu26Eg87yOX2ultEeHiY5SEqhBO-N-_Fpip4AUKDcfha60jj59I-fMz5vRkeacWKvBg2ZaBJih40qONLTCB1MjCOS6QRuSyoCOgeCycE3lZXdmDWsDEnx9t-nltMCccPrs1QFAHOuicqKKJYYjThqq1mVhGPztJrX7ip0IXs0QOuqcQ8rCeDUmC1xxVbcpfEYt7Pl2B99jC_CX1_6DL_gSOXceXGRMvR8AzlkTz5wNS3nF6QD0LvMqwF"
              alt="MedLens"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            HIPAA & SOC-2 Compliant Environment
          </span>
          <button onClick={handleDemoLogin} className="text-teal-700 font-semibold hover:underline">
            Use Demo Mode
          </button>
        </div>
      </header>

      {/* Main Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 transition-all">
            {/* Logo & Welcome */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center mb-4">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VNOu26Eg87yOX2ultEeHiY5SEqhBO-N-_Fpip4AUKDcfha60jj59I-fMz5vRkeacWKvBg2ZaBJih40qONLTCB1MjCOS6QRuSyoCOgeCycE3lZXdmDWsDEnx9t-nltMCccPrs1QFAHOuicqKKJYYjThqq1mVhGPztJrX7ip0IXs0QOuqcQ8rCeDUmC1xxVbcpfEYt7Pl2B99jC_CX1_6DL_gSOXceXGRMvR8AzlkTz5wNS3nF6QD0LvMqwF"
                  alt="MedLens Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
              <p className="mt-1 text-sm text-slate-500">Join clinical teams using AI-assisted diagnostic insights</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-red-600">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Sign Up Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label htmlFor="full-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <input
                    type="text"
                    id="full-name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Alex Morgan or Alex Morgan"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@healthsystem.org"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </div>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  </div>
                  <input
                    type="password"
                    id="confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition"
                  />
                </div>
              </div>

              {/* Terms and consent */}
              <div className="pt-1 flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700/30 accent-teal-700"
                  />
                </div>
                <div className="ml-2 text-[12px] text-slate-500 leading-tight">
                  I agree to the <a href="#" className="text-teal-700 font-medium underline">Terms of Service</a> and <a href="#" className="text-teal-700 font-medium underline">Clinical Data Privacy Policy</a>
                </div>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#0F766E] hover:underline ml-1">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2025 MedLens AI Technologies, Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600 transition">Security & Compliance</a>
            <a href="#" className="hover:text-slate-600 transition">Privacy Practices</a>
            <a href="#" className="hover:text-slate-600 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
