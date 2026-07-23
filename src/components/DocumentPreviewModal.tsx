import React from 'react';
import { X, Download } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onSelectRelatedDoc?: (doc: DocumentItem) => void;
  allDocuments?: DocumentItem[];
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  onClose,
}) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-[96vw] w-full h-[95vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B62B8] via-[#3B71CA] to-[#70C1EE] px-4 py-2.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white/20 backdrop-blur-xs text-white rounded shrink-0">
              {doc.code}
            </span>
            <div className="truncate">
              <h3 className="font-bold text-sm sm:text-base truncate leading-tight">{doc.title}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-2">
            <a
              href={doc.downloadUrl || doc.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-white text-[#2B62B8] hover:bg-slate-100 font-bold rounded-lg text-xs transition flex items-center space-x-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải về / Drive</span>
            </a>
            <button
              onClick={onClose}
              className="p-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body - Full Width Document Viewer */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden h-full">
          <iframe
            src={doc.driveUrl}
            className="w-full h-full border-0"
            title={doc.title}
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
