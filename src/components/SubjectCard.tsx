import React from 'react';
import { BookOpen, ChevronRight, Edit3, Trash2, FileText, Binary, Globe, Calculator, Network, Database, Cpu } from 'lucide-react';
import { Subject } from '../types';
import { useAuth } from '../context/AuthContext';

interface SubjectCardProps {
  subject: Subject;
  assignmentCount: number;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  assignmentCount,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const { session } = useAuth();

  // Pick an appropriate icon based on subject name or icon property
  const renderIcon = () => {
    const name = subject.name.toLowerCase();
    if (name.includes('data') || name.includes('algorithm')) return <Binary className="w-6 h-6 text-blue-600" />;
    if (name.includes('web') || name.includes('dev')) return <Globe className="w-6 h-6 text-emerald-600" />;
    if (name.includes('math') || name.includes('algebra')) return <Calculator className="w-6 h-6 text-purple-600" />;
    if (name.includes('network')) return <Network className="w-6 h-6 text-indigo-600" />;
    if (name.includes('dbms') || name.includes('database')) return <Database className="w-6 h-6 text-amber-600" />;
    if (name.includes('operating') || name.includes('system') || name.includes('cpu')) return <Cpu className="w-6 h-6 text-rose-600" />;
    return <BookOpen className="w-6 h-6 text-blue-600" />;
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md subject-card-glow flex flex-col justify-between transition-all">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
              {renderIcon()}
            </div>
            <div>
              <span className="inline-block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                {subject.code || 'COURSE'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {subject.name}
              </h3>
            </div>
          </div>

          {/* Admin Edit/Delete Controls */}
          {session.isAdmin && (
            <div className="flex items-center space-x-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Subject"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Subject Description */}
        <p className="text-sm text-slate-600 mb-5 line-clamp-2 min-h-[40px]">
          {subject.description || 'College subject assignments and reference PDFs repository.'}
        </p>
      </div>

      {/* Card Footer Row */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center text-xs font-semibold text-slate-500">
          <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span>{assignmentCount} {assignmentCount === 1 ? 'Assignment' : 'Assignments'}</span>
        </div>

        <button
          onClick={onSelect}
          className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700 bg-blue-50 group-hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Assignments
          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
