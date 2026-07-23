import React from 'react';
import {
  Search,
  BookOpen,
  FileText,
  ClipboardList,
  Sparkles,
  Building,
  Eye,
  Download,
  User,
  Calendar,
  Users,
  ArrowRight,
} from 'lucide-react';
import { DocumentItem, CategoryType } from '../types';
import { getFileFormatConfig } from '../utils/fileIcons';
import coverImg from '../assets/images/lsplace_cover_banner_1784690064667.jpg';
import logoImg from '../assets/images/lsplace_logo_1784689616070.jpg';

interface PortalHomeDashboardProps {
  documents: DocumentItem[];
  onSelectCategory: (category: CategoryType) => void;
  onPreviewDoc: (doc: DocumentItem) => void;
  onSearchSubmit: (query: string) => void;
  onOpenAIModal: () => void;
  onViewAllCategory: (category: string) => void;
}

export const PortalHomeDashboard: React.FC<PortalHomeDashboardProps> = ({
  documents,
  onSelectCategory,
  onPreviewDoc,
  onSearchSubmit,
  onOpenAIModal,
  onViewAllCategory,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Helper to parse dates like "2026-07-15" or "15/07/2026" or ISO for sorting
  const parseDate = (dateStr?: string): number => {
    if (!dateStr) return 0;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts.map((p) => p.trim());
        const time = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`).getTime();
        if (!isNaN(time)) return time;
      }
    }
    const time = new Date(dateStr).getTime();
    return isNaN(time) ? 0 : time;
  };

  // Helper to get top 3 newest documents for a category based on Google Sheet updatedAt column
  const getTop3Newest = (cat: CategoryType) => {
    return documents
      .filter((d) => d.category === cat)
      .sort((a, b) => parseDate(b.updatedAt) - parseDate(a.updatedAt))
      .slice(0, 3);
  };

  const blocksConfig: Array<{
    title: string;
    category: CategoryType;
    icon: React.ElementType;
    iconColor: string;
  }> = [
    {
      title: 'QUY ĐỊNH MỚI',
      category: 'Quy định',
      icon: Building,
      iconColor: 'text-rose-600',
    },
    {
      title: 'QUY TRÌNH MỚI',
      category: 'Quy trình',
      icon: FileText,
      iconColor: 'text-blue-600',
    },
    {
      title: 'BIỂU MẪU MỚI',
      category: 'Biểu mẫu',
      icon: ClipboardList,
      iconColor: 'text-emerald-600',
    },
    {
      title: 'TÀI LIỆU ĐÀO TẠO MỚI',
      category: 'Tài liệu đào tạo',
      icon: BookOpen,
      iconColor: 'text-amber-600',
    },
  ];

  // Instant matching documents for home search autocomplete
  const matchingDocs = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return documents
      .filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
      .slice(0, 5);
  }, [documents, searchTerm]);

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowDropdown(false);
      onSearchSubmit(searchTerm.trim());
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Cover Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200">
        <div className="h-48 sm:h-60 w-full overflow-hidden bg-slate-200">
          <img
            src={coverImg}
            alt="L's Place Supermarket Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Header Info & Logo Overlap */}
      <div className="-mt-14 sm:-mt-16 px-4 sm:px-6 relative z-10 space-y-4">
        {/* Square Logo Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={logoImg}
            alt="L's Place Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Portal Title & Welcome text */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>L's Place Portal</span>
            <span className="text-xl">🌿</span>
          </h1>

          <div className="bg-slate-100/80 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Chào mừng bạn đến với cổng thông tin nội bộ của L's Place. Tại đây bạn có thể tìm thấy tất cả các quy trình, quy định, biểu mẫu và tài liệu cần thiết để hỗ trợ công việc hàng ngày.
          </div>
        </div>

        {/* Prominent Quick Search Input */}
        <div className="pt-2 relative">
          <form onSubmit={handleSearchFormSubmit} className="relative max-w-full">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm nhanh tài liệu, quy trình, biểu mẫu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-11 pr-36 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs transition"
            />
            <div className="absolute right-2 top-2 flex items-center space-x-1.5">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-2xs"
              >
                Tìm
              </button>
              <button
                type="button"
                onClick={onOpenAIModal}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi AI</span>
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && searchTerm.trim() !== '' && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
              {matchingDocs.length > 0 ? (
                <>
                  <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                    Gợi ý kết quả ({matchingDocs.length})
                  </div>
                  {matchingDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setShowDropdown(false);
                        onPreviewDoc(doc);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {doc.code}
                          </span>
                          <span className="font-semibold text-xs text-slate-800 group-hover:text-blue-600 truncate">
                            {doc.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{doc.description}</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium shrink-0">
                        {doc.department}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onSearchSubmit(searchTerm.trim());
                    }}
                    className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-blue-600 font-bold text-xs transition border-t border-slate-100"
                  >
                    Xem tất cả kết quả cho "{searchTerm}" →
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  Không tìm thấy tài liệu phù hợp cho "{searchTerm}".
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onSearchSubmit(searchTerm.trim());
                    }}
                    className="block mx-auto mt-2 text-blue-600 font-bold hover:underline"
                  >
                    Tìm kiếm trong toàn bộ kho tài liệu →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4 Main Featured Categories - Full Width Horizontal Modules */}
      <div className="px-4 sm:px-6 space-y-6 pt-2">
        {blocksConfig.map((block) => {
          const items = getTop3Newest(block.category);
          const IconComponent = block.icon;
          return (
            <div
              key={block.category}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 w-full"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <IconComponent className={`w-5 h-5 ${block.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base uppercase tracking-wide">
                      {block.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategory(block.category)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition flex items-center gap-1.5 shrink-0 bg-blue-50/60 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                  <span>Xem tất cả {block.category.toLowerCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Document Items List - Ultra Clean Minimalist Horizontal Layout */}
              {items.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                  {items.map((doc) => {
                    const formatConfig = getFileFormatConfig(doc.fileType);
                    const FormatIcon = formatConfig.Icon;
                    return (
                      <div
                        key={doc.id}
                        className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                      >
                        {/* Left Details Column */}
                        <div className="space-y-1 flex-1 min-w-0">
                          {/* Row 1: Format Badge, Code & Title */}
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className={`inline-flex items-center space-x-1 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${formatConfig.badgeClass}`}>
                              <FormatIcon className="w-3 h-3 shrink-0" />
                              <span>{formatConfig.label}</span>
                            </span>
                            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                              {doc.code}
                            </span>
                            <h4
                              onClick={() => onPreviewDoc(doc)}
                              className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 cursor-pointer transition truncate"
                            >
                              {doc.title}
                            </h4>
                          </div>

                        {/* Row 2: Short Description */}
                        {doc.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 pl-0.5">
                            {doc.description}
                          </p>
                        )}

                        {/* Row 3: Minimalist Metadata Line */}
                        <div className="flex items-center space-x-2 flex-wrap text-[11px] text-slate-500 pt-0.5">
                          <span>
                            Đối tượng: <strong className="text-slate-700 font-medium">{doc.department}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Tác giả: <strong className="text-slate-700 font-medium">{doc.author || 'Ban Giám Đốc'}</strong>
                          </span>
                          <span>·</span>
                          <span className="font-mono">
                            Cập nhật: <strong className="text-slate-700 font-semibold">{doc.updatedAt}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Right Action Buttons - Vertical Stack */}
                      <div className="flex flex-col space-y-1.5 shrink-0 justify-center min-w-[76px] pt-1 md:pt-0">
                        <button
                          onClick={() => onPreviewDoc(doc)}
                          className="flex items-center justify-center space-x-1 w-full px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Xem</span>
                        </button>
                        <a
                          href={doc.downloadUrl || doc.driveUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center space-x-1 w-full px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-2xs active:scale-95"
                          title="Tải về"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  Chưa có {block.category.toLowerCase()} phù hợp với bộ lọc hiện tại.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

