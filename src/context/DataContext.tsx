import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Subject, Assignment } from '../types';
import { INITIAL_SUBJECTS, INITIAL_ASSIGNMENTS } from '../lib/initialData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { fileToDataUri, formatFileSize } from '../lib/pdfUtils';

interface DataContextType {
  subjects: Subject[];
  assignments: Assignment[];
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  activePdfAssignment: Assignment | null;
  setActivePdfAssignment: (assignment: Assignment | null) => void;
  
  // Subject CRUD
  addSubject: (data: { name: string; description?: string; code?: string }) => Promise<void>;
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Assignment CRUD
  addAssignment: (data: {
    subject_id: string;
    title: string;
    description?: string;
    file: File;
  }) => Promise<void>;
  updateAssignment: (id: string, data: Partial<Assignment>, file?: File) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  
  // Helpers
  getAssignmentsForSubject: (subjectId: string) => Assignment[];
  getSubjectCount: (subjectId: string) => number;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SUBJECTS_KEY = 'assignment_hub_subjects_v3';
const ASSIGNMENTS_KEY = 'assignment_hub_assignments_v3';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(SUBJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Failed to read subjects from localStorage:', err);
    }
    return INITIAL_SUBJECTS || [];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(ASSIGNMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Failed to read assignments from localStorage:', err);
    }
    return INITIAL_ASSIGNMENTS || [];
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activePdfAssignment, setActivePdfAssignment] = useState<Assignment | null>(null);

  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeAssignments = Array.isArray(assignments) ? assignments : [];

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(safeSubjects));
    } catch (e) {
      console.warn('Failed to save subjects to localStorage:', e);
    }
  }, [safeSubjects]);

  useEffect(() => {
    try {
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(safeAssignments));
    } catch (e) {
      console.warn('Failed to save assignments to localStorage:', e);
    }
  }, [safeAssignments]);

  // Load from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const fetchSupabaseData = async () => {
        try {
          const { data: subData } = await client.from('subjects').select('*');
          if (Array.isArray(subData)) setSubjects(subData);
          
          const { data: asgData } = await client.from('assignments').select('*');
          if (Array.isArray(asgData)) setAssignments(asgData);
        } catch (err) {
          console.warn('Supabase fetch error, using local state:', err);
        }
      };
      fetchSupabaseData();
    }
  }, []);

  // Subject Operations
  const addSubject = async (data: { name: string; description?: string; code?: string }) => {
    const newSubject: Subject = {
      id: 'sub-' + Date.now(),
      name: data.name.trim(),
      description: data.description?.trim() || '',
      code: data.code?.trim().toUpperCase() || '',
      created_at: new Date().toISOString(),
    };

    setSubjects(prev => [newSubject, ...(Array.isArray(prev) ? prev : [])]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('subjects').insert([newSubject]);
    }
  };

  const updateSubject = async (id: string, data: Partial<Subject>) => {
    setSubjects(prev => (Array.isArray(prev) ? prev : []).map(s => s.id === id ? { ...s, ...data } : s));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('subjects').update(data).eq('id', id);
    }
  };

  const deleteSubject = async (id: string) => {
    setSubjects(prev => (Array.isArray(prev) ? prev : []).filter(s => s.id !== id));
    setAssignments(prev => (Array.isArray(prev) ? prev : []).filter(a => a.subject_id !== id));

    if (selectedSubjectId === id) {
      setSelectedSubjectId(null);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('assignments').delete().eq('subject_id', id);
      await supabase.from('subjects').delete().eq('id', id);
    }
  };

  // Assignment Operations
  const addAssignment = async (data: {
    subject_id: string;
    title: string;
    description?: string;
    file: File;
  }) => {
    const pdfUrl = await fileToDataUri(data.file);
    const fileName = data.file.name;
    const fileSize = formatFileSize(data.file.size);

    const newAssignment: Assignment = {
      id: 'asg-' + Date.now(),
      subject_id: data.subject_id,
      title: data.title.trim(),
      description: data.description?.trim() || '',
      pdf_url: pdfUrl,
      file_name: fileName,
      file_size: fileSize,
      created_at: new Date().toISOString(),
    };

    setAssignments(prev => [newAssignment, ...(Array.isArray(prev) ? prev : [])]);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('assignments').insert([newAssignment]);
    }
  };

  const updateAssignment = async (id: string, data: Partial<Assignment>, file?: File) => {
    let updatedData = { ...data };

    if (file) {
      const pdfUrl = await fileToDataUri(file);
      updatedData.pdf_url = pdfUrl;
      updatedData.file_name = file.name;
      updatedData.file_size = formatFileSize(file.size);
    }

    setAssignments(prev => (Array.isArray(prev) ? prev : []).map(a => a.id === id ? { ...a, ...updatedData } : a));

    if (isSupabaseConfigured && supabase) {
      await supabase.from('assignments').update(updatedData).eq('id', id);
    }
  };

  const deleteAssignment = async (id: string) => {
    setAssignments(prev => (Array.isArray(prev) ? prev : []).filter(a => a.id !== id));

    if (activePdfAssignment?.id === id) {
      setActivePdfAssignment(null);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('assignments').delete().eq('id', id);
    }
  };

  const getAssignmentsForSubject = (subjectId: string) => {
    return safeAssignments.filter(a => a.subject_id === subjectId);
  };

  const getSubjectCount = (subjectId: string) => {
    return safeAssignments.filter(a => a.subject_id === subjectId).length;
  };

  const clearAllData = () => {
    setSubjects([]);
    setAssignments([]);
    localStorage.removeItem(SUBJECTS_KEY);
    localStorage.removeItem(ASSIGNMENTS_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        subjects: safeSubjects,
        assignments: safeAssignments,
        selectedSubjectId,
        setSelectedSubjectId,
        activePdfAssignment,
        setActivePdfAssignment,
        addSubject,
        updateSubject,
        deleteSubject,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        getAssignmentsForSubject,
        getSubjectCount,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
