import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  Eye,
  Lock,
  Calendar,
  Building2,
  Shield,
  ExternalLink,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';
import { getFileFormatConfig } from '../utils/fileIcons';

interface DocumentCardProps {
  document: DocumentItem;
  userRole: UserRole;
  onPreview: (doc: DocumentItem) => void;
  onOpenRoleModal: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document: doc,
  userRole,
  onPreview,
  onOpenRoleModal,
}) => {
  // Permission Check Logic
  const roleHierarchy: Record<UserRole, number> = {
    'Nhân viên': 1,
    'Trưởng phòng / Quản lý': 2,
    'Ban Giám đốc': 3,
  };

  const isUnlocked = roleHierarchy[userRole] >= roleHierarchy[doc.minRole];

  const formatConfig = getFileFormatConfig(doc.fileType);
  const FormatIcon = formatConfig.Icon;

  return (
    <div
      className={`group p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between h-full ${
        !isUnlocked ? 'opacity-80 bg-slate-50/60' : ''
      }`}
    >
      <div className="flex gap-3.5 items-start">
        {/* Document File Box Icon */}
        <div
          className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center shrink-0 border ${formatConfig.badgeClass}`}
        >
          <FormatIcon className={`w-6 h-6 ${formatConfig.text}`} />
          <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">{formatConfig.label}</span>
        </div>

        {/* Title & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
              {doc.code}
            </span>
          </div>

          <h3
            onClick={() => isUnlocked && onPreview(doc)}
            className={`text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors ${
              isUnlocked ? 'cursor-pointer' : ''
            }`}
          >
            {doc.title}
          </h3>

          <div className="flex items-center gap-1.5 flex-wrap mt-1.5 text-[10px] text-slate-500 font-medium">
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">{doc.category}</span>
            <span>•</span>
            <span className="truncate">{doc.department}</span>
            {doc.author && (
              <>
                <span>•</span>
                <span className="text-slate-600 font-medium truncate">Tác giả: {doc.author}</span>
              </>
            )}
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {doc.description}
          </p>
        </div>
      </div>

      {/* Footer bar */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end text-[11px] text-slate-500">
        <div>
          {isUnlocked ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPreview(doc)}
                className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs"
                title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
                <span>Xem</span>
              </button>
              <a
                href={doc.downloadUrl || doc.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs"
                title="Tải về"
              >
                <Download className="w-4 h-4" />
                <span>Tải về</span>
              </a>
            </div>
          ) : (
            <button
              onClick={onOpenRoleModal}
              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-lg text-[10px] transition flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Yêu cầu quyền {doc.minRole}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
