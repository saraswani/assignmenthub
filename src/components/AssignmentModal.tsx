import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Assignment } from '../types';
import { useData } from '../context/DataContext';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentToEdit?: Assignment | null;
  defaultSubjectId?: string | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentToEdit,
  defaultSubjectId,
}) => {
  const { subjects, addAssignment, updateAssignment } = useData();
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignmentToEdit) {
      setSubjectId(assignmentToEdit.subject_id);
      setTitle(assignmentToEdit.title);
      setDescription(assignmentToEdit.description || '');
      setSelectedFile(null);
    } else {
      setSubjectId(defaultSubjectId || (subjects[0]?.id || ''));
      setTitle('');
      setDescription('');
      setSelectedFile(null);
    }
    setErrorMsg('');
  }, [assignmentToEdit, defaultSubjectId, isOpen, subjects]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorMsg('Please select a valid PDF document (.pdf file).');
        return;
      }
      setErrorMsg('');
      setSelectedFile(file);
      // Auto fill title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.pdf$/i, '');
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setErrorMsg('Please select a subject for this assignment.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please enter an assignment title.');
      return;
    }
    if (!assignmentToEdit && !selectedFile) {
      setErrorMsg('Please attach an original PDF file for the assignment.');
      return;
    }

    setLoading(true);
    try {
      if (assignmentToEdit) {
        await updateAssignment(
          assignmentToEdit.id,
          {
            subject_id: subjectId,
            title: title.trim(),
            description: description.trim(),
          },
          selectedFile || undefined
        );
      } else {
        await addAssignment({
          subject_id: subjectId,
          title: title.trim(),
          description: description.trim(),
          file: selectedFile!,
        });
      }
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to save assignment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold">
              {assignmentToEdit ? 'Edit Assignment / Replace PDF' : 'Upload New Assignment PDF'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Subject *
            </label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="" disabled>Select course subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code || 'COURSE'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Assignment Title / Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assignment 1 — Searching Algorithms"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Short Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Implementation and time complexity analysis of Linear Search..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* PDF Upload Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {assignmentToEdit ? 'Replace Original PDF (Optional)' : 'Attach Original PDF File *'}
            </label>

            <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center space-x-2 text-emerald-700 font-medium text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="truncate max-w-xs">{selectedFile.name}</span>
                  <span className="text-slate-400 text-xs">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                </div>
              ) : assignmentToEdit ? (
                <div className="text-slate-500 text-xs">
                  <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700">Current File: {assignmentToEdit.file_name}</p>
                  <p className="text-slate-400">Click or drop a new PDF to replace current document</p>
                </div>
              ) : (
                <div className="text-slate-500 text-xs">
                  <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                  <p className="font-semibold text-slate-800 text-sm">Click to select PDF or drag & drop file</p>
                  <p className="text-slate-400">Exact original PDF will be preserved without modification</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Processing File...' : assignmentToEdit ? 'Save Changes' : 'Upload Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
