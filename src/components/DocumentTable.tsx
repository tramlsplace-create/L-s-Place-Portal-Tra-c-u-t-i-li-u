import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  Eye,
  Lock,
  Building2,
  Calendar,
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';
import { getFileFormatConfig } from '../utils/fileIcons';

interface DocumentTableProps {
  documents: DocumentItem[];
  userRole: UserRole;
  onPreview: (doc: DocumentItem) => void;
  onOpenRoleModal: () => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  userRole,
  onPreview,
  onOpenRoleModal,
}) => {
  const roleHierarchy: Record<UserRole, number> = {
    'Nhân viên': 1,
    'Trưởng phòng / Quản lý': 2,
    'Ban Giám đốc': 3,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3.5 pl-5">Mã VB</th>
              <th className="p-3.5">Tên Tài Liệu & Nội Dung</th>
              <th className="p-3.5">Loại & Đối Tượng</th>
              <th className="p-3.5">Tác Giả & Cập Nhật</th>
              <th className="p-3.5">Quyền Hạn</th>
              <th className="p-3.5 pr-5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {documents.map((doc) => {
              const isUnlocked = roleHierarchy[userRole] >= roleHierarchy[doc.minRole];
              const formatConfig = getFileFormatConfig(doc.fileType);
              const FormatIcon = formatConfig.Icon;

              return (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/80 transition group"
                >
                  {/* Code */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                      {doc.code}
                    </span>
                  </td>

                  {/* Title & Description */}
                  <td className="p-3.5 max-w-md">
                    <div className="flex items-start space-x-2">
                      <span className="mt-0.5 shrink-0">
                        <FormatIcon className={`w-4 h-4 ${formatConfig.text}`} />
                      </span>
                      <div>
                        <span
                          onClick={() => isUnlocked && onPreview(doc)}
                          className={`font-bold text-slate-900 group-hover:text-[#2B62B8] transition ${
                            isUnlocked ? 'cursor-pointer' : ''
                          }`}
                        >
                          {doc.title}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category & Department */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-800 font-bold text-[10px] rounded border border-blue-100">
                        {doc.category}
                      </span>
                      <p className="text-[11px] text-slate-500">{doc.department}</p>
                    </div>
                  </td>

                  {/* Author & Updated date */}
                  <td className="p-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                    <div className="font-semibold text-slate-800">{doc.author || 'Ban Quản trị'}</div>
                    <div className="text-[10px] text-slate-400">{doc.updatedAt}</div>
                  </td>

                  {/* Required Role */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                        doc.minRole === 'Ban Giám đốc'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : doc.minRole === 'Trưởng phòng / Quản lý'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {doc.minRole}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    {isUnlocked ? (
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onPreview(doc)}
                          className="px-2.5 py-1.5 bg-[#2B62B8] hover:bg-[#224fa0] text-white font-bold rounded-lg text-xs transition flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem</span>
                        </button>
                        <a
                          href={doc.downloadUrl || doc.driveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition flex items-center space-x-1"
                          title="Tải về"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={onOpenRoleModal}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-lg text-[11px] transition inline-flex items-center space-x-1"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Khóa</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
