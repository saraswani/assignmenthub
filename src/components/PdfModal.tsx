import React, { useState } from 'react';
import { X, Download, ExternalLink, Maximize2, Minimize2, AlertCircle, FileText } from 'lucide-react';
import { Assignment } from '../types';

interface PdfModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export const PdfModal: React.FC<PdfModalProps> = ({ assignment, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  if (!assignment) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = assignment.pdf_url;
    link.download = assignment.file_name || `${assignment.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(assignment.pdf_url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className={`bg-white w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-5xl h-[90vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3 truncate mr-2">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {assignment.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">{assignment.file_name}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              onClick={handleOpenNewTab}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              title="Open Original PDF in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Open Tab
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:p-2 p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - PDF Container */}
        <div className="flex-1 bg-slate-900 relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
          {!iframeError ? (
            <iframe
              src={assignment.pdf_url}
              title={assignment.title}
              className="w-full h-full border-none"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="p-8 text-center text-slate-300 max-w-md">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Direct Viewer Unavailable</h4>
              <p className="text-sm text-slate-400 mb-6">
                Your browser or device does not support embedded PDF previewing for this file format. You can open or download the exact original PDF file directly below.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleOpenNewTab}
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Open Original PDF
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
                >
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Mobile Bar */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="truncate">
            Original unaltered document • {assignment.file_size || 'PDF'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenNewTab}
              className="sm:hidden text-blue-600 font-semibold underline"
            >
              Open PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
