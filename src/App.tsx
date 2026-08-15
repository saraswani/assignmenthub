import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PdfModal } from './components/PdfModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SubjectModal } from './components/SubjectModal';
import { AssignmentModal } from './components/AssignmentModal';

import { Home } from './pages/Home';
import { SubjectDetail } from './pages/SubjectDetail';
import type { Subject, Assignment } from './types';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-lg space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-900">Application Recovered</h2>
            <p className="text-xs text-slate-500">
              An unexpected error occurred while rendering. Click below to refresh and clear any corrupted local cache.
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-xs"
              >
                Reload Assignment Hub
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainContent: React.FC = () => {
  const {
    selectedSubjectId,
    setSelectedSubjectId,
    activePdfAssignment,
    setActivePdfAssignment,
    deleteSubject,
    deleteAssignment,
  } = useData();

  // Modals state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
  const [assignmentDefaultSubjectId, setAssignmentDefaultSubjectId] = useState<string | null>(null);

  // Subject actions
  const handleOpenAddSubject = () => {
    setSubjectToEdit(null);
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject and all its assignments?')) {
      await deleteSubject(subjectId);
    }
  };

  // Assignment actions
  const handleOpenAddAssignment = (subjectId?: string) => {
    setAssignmentToEdit(null);
    setAssignmentDefaultSubjectId(subjectId || null);
    setIsAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setAssignmentToEdit(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assignment PDF?')) {
      await deleteAssignment(assignmentId);
    }
  };

  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        onGoHome={() => setSelectedSubjectId(null)}
        onOpenAddSubject={handleOpenAddSubject}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {selectedSubjectId ? (
          <SubjectDetail
            subjectId={selectedSubjectId}
            onBackToHome={() => setSelectedSubjectId(null)}
            onOpenAddAssignment={handleOpenAddAssignment}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
            onEditAssignment={handleEditAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        ) : (
          <Home
            onSelectSubject={handleSelectSubject}
            onOpenAddSubject={handleOpenAddSubject}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & PDF Viewers */}
      <PdfModal
        assignment={activePdfAssignment}
        onClose={() => setActivePdfAssignment(null)}
      />

      <AdminLoginModal />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subjectToEdit={subjectToEdit}
      />

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        assignmentToEdit={assignmentToEdit}
        defaultSubjectId={assignmentDefaultSubjectId}
      />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <MainContent />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
