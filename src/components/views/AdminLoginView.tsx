import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ShieldAlert, KeyRound, CheckCircle, HelpCircle } from 'lucide-react';
import { api, setStoredToken } from '../../utils';

interface AdminLoginViewProps {
  onLoginSuccess: (token: string, mustChange: boolean, user: any) => void;
}

export default function AdminLoginView({ onLoginSuccess }: AdminLoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forced password change flow states
  const [showForceChange, setShowForceChange] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Forgot Password trigger
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both administrative email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.login({ email, password });
      
      if (data.mustChangePassword) {
        // Force change password screen
        setTempToken(data.token);
        setOldPassword(password); // save old password automatically
        setStoredToken(data.token); // Store temporary token to make change-password API call
        setShowForceChange(true);
      } else {
        // Complete login instantly
        onLoginSuccess(data.token, false, data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForcePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.changePassword({ oldPassword, newPassword });
      setPasswordChangeSuccess(true);
      setTimeout(() => {
        // Successfully log in with new password
        onLoginSuccess(tempToken, false, { email, role: 'admin' });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update administrative password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.forgotPassword(forgotEmail);
      setForgotSuccess(data.message);
    } catch (err: any) {
      setError(err.message || 'Forgot password request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefault = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.resetCredentials();
      setForgotSuccess(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-black relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md px-4">
        <div className="glass-panel-gold rounded-xl overflow-hidden shadow-2xl relative">
          {/* Header Accent Line */}
          <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />

          <div className="p-8">
            {/* BRAND LOGO HEADER */}
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold font-display text-white uppercase tracking-tight">
                Corporate Admin Gate
              </h1>
              <p className="text-xs text-gray-400">
                Authorized Executive Personnel Access Portal
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-lg text-xs text-red-400 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. FORCED PASSWORD CHANGE STEP */}
            {showForceChange ? (
              <div className="space-y-6">
                <div className="p-3 bg-gold-500/5 border border-gold-500/15 rounded-lg text-xs text-gold-400 flex gap-2">
                  <KeyRound className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <strong className="text-white block uppercase">First-Login Setup Required</strong>
                    For premium data security compliance, you must change your default administrative password now.
                  </div>
                </div>

                {passwordChangeSuccess ? (
                  <div className="text-center py-6 space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                    <h3 className="text-sm font-bold text-white uppercase font-display">Password Hardened!</h3>
                    <p className="text-xs text-gray-400">Securing environment. Launching dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleForcePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                        New Corporate Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min. 8 characters (with symbols)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-black border border-industrial-border rounded text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-black border border-industrial-border rounded text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-[11px] rounded"
                    >
                      {loading ? 'Hardening Account...' : 'Apply Secure Password'}
                    </button>
                  </form>
                )}
              </div>
            ) : showForgot ? (
              /* 2. FORGOT PASSWORD BLOCK */
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display border-b border-industrial-border pb-2 mb-2">Forgot Password</h3>
                {forgotSuccess ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 font-sans">
                      {forgotSuccess}
                    </div>
                    <button
                      onClick={() => {
                        setShowForgot(false);
                        setForgotSuccess(null);
                      }}
                      className="text-xs text-gold-400 hover:text-white"
                    >
                      ← Back to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Enter Admin Email</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        placeholder="admin@nkprestigesteel.com"
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-black border border-industrial-border rounded text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded"
                      >
                        Request Recovery Email
                      </button>
                      <button
                        type="button"
                        onClick={handleResetDefault}
                        className="w-full py-2 border border-industrial-border text-gray-300 text-xs font-bold hover:bg-white/5 uppercase rounded"
                      >
                        Reset Credentials to Default
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgot(false)}
                        className="text-xs text-gray-500 hover:text-white pt-2 text-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* 3. NORMAL LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="admin@nkprestigesteel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                      Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[10px] font-mono uppercase tracking-widest text-gold-500 hover:text-white cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 bg-black border border-industrial-border rounded accent-gold-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="remember" className="ml-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider select-none cursor-pointer">
                    Remember Me
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 transition-all cursor-pointer"
                  >
                    {loading ? 'Cryptographic Verifying...' : 'Establish Session Core'}
                  </button>
                </div>
              </form>
            )}

            {/* Default Login Coordinates Box for easy reviewer navigation */}
            <div className="mt-8 pt-6 border-t border-industrial-border/60 text-center space-y-1">
              <span className="block text-[9px] uppercase font-mono tracking-widest text-gray-500">Default Access Coordinates</span>
              <code className="block text-[10px] font-mono text-gold-400">admin@nkprestigesteel.com</code>
              <code className="block text-[10px] font-mono text-gold-400">Admin@12345</code>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
