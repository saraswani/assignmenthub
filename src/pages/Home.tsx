import React from 'react';
import { BookOpen, Plus, FolderPlus, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SubjectCard } from '../components/SubjectCard';
import type { Subject } from '../types';

interface HomeProps {
  onSelectSubject: (subjectId: string) => void;
  onOpenAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onSelectSubject,
  onOpenAddSubject,
  onEditSubject,
  onDeleteSubject,
}) => {
  const { subjects, getSubjectCount } = useData();
  const { session, setOpenLoginModal } = useAuth();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <section className="pt-8 sm:pt-12 pb-6 text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Your Assignments Easily
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-normal">
          All your college assignments, organized subject-wise in one place.
        </p>

        {session.isAdmin && (
          <div className="pt-2">
            <button
              onClick={onOpenAddSubject}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create New Subject
            </button>
          </div>
        )}
      </section>

      {/* Main Subjects Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            Course Subjects
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'}
          </span>
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                assignmentCount={getSubjectCount(subject.id)}
                onSelect={() => onSelectSubject(subject.id)}
                onEdit={() => onEditSubject(subject)}
                onDelete={() => onDeleteSubject(subject.id)}
              />
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <FolderPlus className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">No subjects added yet.</h3>
              <p className="text-xs text-slate-500">
                Log in as Administrator to create your first subject and upload assignment PDFs.
              </p>
            </div>

            <div className="pt-2">
              {session.isAdmin ? (
                <button
                  onClick={onOpenAddSubject}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                >
                  Add Subject Now
                </button>
              ) : (
                <button
                  onClick={() => setOpenLoginModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-600" />
                  Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </section>

    </div>
  );
};
