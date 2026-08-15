import React from 'react';
import { FileText, Eye, Download, Calendar, HardDrive, Edit3, Trash2, ShieldAlert } from 'lucide-react';
import { Assignment } from '../types';
import { useAuth } from '../context/AuthContext';

interface AssignmentCardProps {
  assignment: Assignment;
  subjectName?: string;
  onViewPdf: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  subjectName,
  onViewPdf,
  onEdit,
  onDelete,
}) => {
  const { session } = useAuth();

  const formattedDate = new Date(assignment.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = assignment.pdf_url;
    link.download = assignment.file_name || `${assignment.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header & Tag */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            {subjectName && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {subjectName}
              </span>
            )}
          </div>

          {/* Admin Edit/Delete */}
          {session.isAdmin && (
            <div className="flex items-center space-x-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Assignment / Replace PDF"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Assignment Title */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {assignment.title}
        </h4>

        {/* Short Description */}
        {assignment.description ? (
          <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2">
            {assignment.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">No additional description provided.</p>
        )}

        {/* Metadata info row */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mb-5 pt-1 border-t border-slate-100">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>Added {formattedDate}</span>
          </div>
          {assignment.file_size && (
            <div className="flex items-center">
              <HardDrive className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{assignment.file_size}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: View PDF & Download PDF */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <button
          onClick={onViewPdf}
          className="w-full inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs sm:text-sm font-semibold hover:bg-blue-100 hover:border-blue-300 transition-all shadow-2xs"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View PDF
        </button>

        <button
          onClick={handleDownload}
          className="w-full inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
        >
          <Download className="w-4 h-4 mr-1.5 text-slate-500" />
          Download
        </button>
      </div>
    </div>
  );
};
