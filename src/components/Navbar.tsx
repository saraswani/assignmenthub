import React from 'react';
import { BookOpen, ShieldCheck, LogOut, Home, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onGoHome: () => void;
  onOpenAddSubject?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome, onOpenAddSubject }) => {
  const { session, logout, setOpenLoginModal } = useAuth();
  const { setSelectedSubjectId } = useData();

  const handleHomeClick = () => {
    setSelectedSubjectId(null);
    onGoHome();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={handleHomeClick}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  Assignment Hub
                </span>
                {session.isAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Admin Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleHomeClick}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-1.5 text-slate-500" />
              Subjects
            </button>

            {session.isAdmin ? (
              <div className="flex items-center space-x-2">
                {onOpenAddSubject && (
                  <button
                    onClick={onOpenAddSubject}
                    className="inline-flex items-center px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Subject
                  </button>
                )}

                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4 mr-1.5 text-slate-500" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenLoginModal(true)}
                className="inline-flex items-center px-3.5 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-600" />
                Admin Login
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
