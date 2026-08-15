import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Mail, AlertCircle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginModal: React.FC = () => {
  const { login, openLoginModal, setOpenLoginModal } = useAuth();
  const [email, setEmail] = useState('admin@assignmenthub.edu');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!openLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setOpenLoginModal(false);
    } else {
      setErrorMsg(result.error || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Admin Portal Login</h3>
          </div>
          <button
            onClick={() => setOpenLoginModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Sign in as administrator to manage subjects, upload assignments, and replace PDF documents.
          </p>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@assignmenthub.edu"
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preset demo credentials hint */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-800 space-y-1">
            <div className="font-semibold flex items-center">
              <Key className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Default Admin Credentials:
            </div>
            <p>Email: <span className="font-mono font-semibold">admin@assignmenthub.edu</span></p>
            <p>Password: <span className="font-mono font-semibold">admin123</span></p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setOpenLoginModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
