import React from 'react';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { session, setOpenLoginModal } = useAuth();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left Brand info */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Assignment Hub</span>
          <span className="text-slate-300">|</span>
          <span>Subject-Wise Digital Assignment Library</span>
        </div>

        {/* Middle message */}
        <div className="flex items-center space-x-1 text-slate-500 text-center">
          <span>Organized for college students & classmates</span>
        </div>

        {/* Right Admin link */}
        <div className="flex items-center space-x-4">
          {!session.isAdmin ? (
            <button
              onClick={() => setOpenLoginModal(true)}
              className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Admin Portal
            </button>
          ) : (
            <span className="text-emerald-700 font-semibold flex items-center bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              Admin Session Active
            </span>
          )}
        </div>

      </div>
    </footer>
  );
};
