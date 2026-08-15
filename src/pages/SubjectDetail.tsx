import React from 'react';
import { Plus, Edit3, Trash2, FileText, ArrowLeft } from 'lucide-react';
import type { Subject, Assignment } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { AssignmentCard } from '../components/AssignmentCard';

interface SubjectDetailProps {
  subjectId: string;
  onBackToHome: () => void;
  onOpenAddAssignment: (subjectId: string) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (assignmentId: string) => void;
}

export const SubjectDetail: React.FC<SubjectDetailProps> = ({
  subjectId,
  onBackToHome,
  onOpenAddAssignment,
  onEditSubject,
  onDeleteSubject,
  onEditAssignment,
  onDeleteAssignment,
}) => {
  const { subjects, getAssignmentsForSubject, setActivePdfAssignment } = useData();
  const { session } = useAuth();

  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto my-8">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Subject Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">The requested subject does not exist or was removed.</p>
        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Subjects
        </button>
      </div>
    );
  }

  const subjectAssignments = getAssignmentsForSubject(subject.id);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Simple Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onBackToHome },
          { label: subject.name, active: true },
        ]}
      />

      {/* Subject Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {subject.code && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  {subject.code}
                </span>
              )}
              <span className="text-xs font-semibold text-slate-500">
                {subjectAssignments.length} {subjectAssignments.length === 1 ? 'Assignment' : 'Assignments'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {subject.name}
            </h1>

            {subject.description && (
              <p className="text-sm text-slate-600 max-w-2xl">
                {subject.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {session.isAdmin ? (
              <>
                <button
                  onClick={() => onOpenAddAssignment(subject.id)}
                  className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Upload PDF
                </button>

                <button
                  onClick={() => onEditSubject(subject)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Edit Subject"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteSubject(subject.id)}
                  className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 text-slate-500" />
                Back to Subjects
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Assignments List */}
      {subjectAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onViewPdf={() => setActivePdfAssignment(assignment)}
              onEdit={() => onEditAssignment(assignment)}
              onDelete={() => onDeleteAssignment(assignment.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty Assignments state */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-6 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No assignments added yet.</h3>
          <p className="text-xs text-slate-500">
            There are no assignment PDFs uploaded for {subject.name}.
          </p>

          {session.isAdmin && (
            <div className="pt-2">
              <button
                onClick={() => onOpenAddAssignment(subject.id)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Upload PDF
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
