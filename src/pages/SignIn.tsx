import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const SignIn: React.FC = () => {
  const { loginDemo, loginReal } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@medlens.app');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginReal(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Top Subtle Brand Bar / Security Status */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm">
            <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            HIPAA & SOC-2 Verified
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Clinical System Online
          </span>
          <button onClick={handleDemoLogin} className="hover:text-teal-700 transition-colors font-semibold text-teal-700 underline">
            Quick Demo Login
          </button>
        </div>
      </header>

      {/* Main Centered Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-[440px]">
          {/* Card wrapper */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(15,118,110,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 sm:p-10">
            
            {/* MedLens Logo */}
            <div className="flex justify-center mb-7">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1VNOu26Eg87yOX2ultEeHiY5SEqhBO-N-_Fpip4AUKDcfha60jj59I-fMz5vRkeacWKvBg2ZaBJih40qONLTCB1MjCOS6QRuSyoCOgeCycE3lZXdmDWsDEnx9t-nltMCccPrs1QFAHOuicqKKJYYjThqq1mVhGPztJrX7ip0IXs0QOuqcQ8rCeDUmC1xxVbcpfEYt7Pl2B99jC_CX1_6DL_gSOXceXGRMvR8AzlkTz5wNS3nF6QD0LvMqwF"
                alt="MedLens Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Headings */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-1.5 font-normal">Sign in to your clinical account</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-red-600">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Demo Instant Button */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-sm text-teal-700">bolt</span>
                <span>Enter Demo Mode Immediately (demo@medlens.app)</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">or sign in below</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clinician@hospital.org"
                    className="block w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all bg-slate-50/40 hover:bg-white focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-teal-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all bg-slate-50/40 hover:bg-white focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Remember workstation */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700/20" />
                  <span className="text-xs text-slate-600 font-medium">Remember clinical workstation</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] active:bg-[#134E4A] shadow-[0_2px_8px_rgba(15,118,110,0.25)] transition-all"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              {/* Hospital SSO button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all mt-3"
              >
                <svg className="w-4 h-4 text-teal-700" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                <span>Hospital SSO (Epic / Cerner FHIR)</span>
              </button>
            </form>

            {/* Don't have an account? */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-normal">
                Don’t have an account?{' '}
                <Link to="/signup" className="font-semibold text-teal-700 hover:underline ml-1">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              256-bit TLS encrypted session • Strictly for authorized medical personnel
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div>© 2025 MedLens AI Technologies, Inc. All rights reserved.</div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Security Disclosures</a>
        </div>
      </footer>
    </div>
  );
};
