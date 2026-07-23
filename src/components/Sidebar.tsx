import React, { useMemo } from 'react';
import {
  ScrollText,
  FileText,
  ClipboardList,
  BookOpen,
  Mail,
  Phone,
  Layers,
  Sparkles,
  Building2,
  Store,
  Users,
  TrendingUp,
  Calculator,
  Megaphone,
  Truck,
  UserPlus,
  RefreshCw,
  Database,
} from 'lucide-react';
import { CategoryType, DepartmentType, DocumentItem, SheetConfig } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabName: string) => void;
  selectedCategory?: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  selectedDepartment?: DepartmentType;
  onSelectDepartment?: (department: DepartmentType) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenSyncModal?: () => void;
  onOpenAIModal: () => void;
  totalDocs: number;
  documents?: DocumentItem[];
  sheetConfig?: SheetConfig;
  onTriggerSync?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  selectedDepartment = 'Tất cả',
  onSelectDepartment,
  onOpenSyncModal,
  onOpenAIModal,
  totalDocs,
  documents = [],
  sheetConfig,
  onTriggerSync,
}) => {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Quy định': 0,
      'Quy trình': 0,
      'Biểu mẫu': 0,
      'Tài liệu đào tạo': 0,
    };
    documents.forEach((doc) => {
      if (counts[doc.category] !== undefined) {
        counts[doc.category]++;
      }
    });
    return counts;
  }, [documents]);

  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Khối Cửa Hàng': 0,
      'HCNS': 0,
      'Kinh doanh': 0,
      'Kế toán': 0,
      'Marketing': 0,
      'Kho & Vận chuyển': 0,
      'Nhân viên mới': 0,
    };
    documents.forEach((doc) => {
      if (counts[doc.department] !== undefined) {
        counts[doc.department]++;
      }
    });
    return counts;
  }, [documents]);

  return (
    <aside className="w-64 bg-[#FAF9F6] border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto p-4 text-slate-700 text-xs select-none">
      <div className="space-y-4">
        {/* Workspace Title Header - Click to Return Home */}
        <button
          onClick={() => {
            onSelectTab('Trang chủ');
            onSelectCategory('Tất cả');
          }}
          className="w-full text-left flex items-center justify-between p-1.5 hover:bg-slate-200/60 rounded-lg cursor-pointer transition group"
          title="Quay lại Trang chủ"
        >
          <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm">
            <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-xs group-hover:bg-emerald-700 transition">
              L
            </div>
            <span className="truncate group-hover:text-emerald-700 transition">L's Place Portal 🌿</span>
          </div>
        </button>

        {/* Section: TÀI LIỆU */}
        <div className="pt-2 space-y-1">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 py-1">
            Tài liệu
          </div>

          <button
            onClick={() => {
              onSelectTab('Tài liệu');
              onSelectCategory('Tất cả');
            }}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              activeTab === 'Tài liệu' && selectedCategory === 'Tất cả'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Layers className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Tất cả kho tài liệu</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {totalDocs}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectTab('Quy định');
              onSelectCategory('Quy định');
            }}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedCategory === 'Quy định' || activeTab === 'Quy định'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <ScrollText className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate">Quy định</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {categoryCounts['Quy định'] || 0}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectTab('Quy trình');
              onSelectCategory('Quy trình');
            }}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedCategory === 'Quy trình' || activeTab === 'Quy trình'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Quy trình</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {categoryCounts['Quy trình'] || 0}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectTab('Biểu mẫu');
              onSelectCategory('Biểu mẫu');
            }}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedCategory === 'Biểu mẫu' || activeTab === 'Biểu mẫu'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <ClipboardList className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Biểu mẫu</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {categoryCounts['Biểu mẫu'] || 0}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectTab('Tài liệu đào tạo');
              onSelectCategory('Tài liệu đào tạo');
            }}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedCategory === 'Tài liệu đào tạo' || activeTab === 'Tài liệu đào tạo'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">Tài liệu đào tạo</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {categoryCounts['Tài liệu đào tạo'] || 0}
            </span>
          </button>
        </div>

        {/* Section: ĐỐI TƯỢNG ÁP DỤNG */}
        <div className="pt-2 space-y-1">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 py-1">
            Đối tượng áp dụng
          </div>

          <button
            onClick={() => onSelectDepartment?.('Tất cả')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Tất cả'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">Tất cả phòng ban</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {totalDocs}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('Khối Cửa Hàng')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Khối Cửa Hàng'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Store className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Khối Cửa Hàng</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['Khối Cửa Hàng'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('HCNS')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'HCNS'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">HCNS</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['HCNS'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('Kinh doanh')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Kinh doanh'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">Kinh doanh</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['Kinh doanh'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('Kế toán')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Kế toán'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Calculator className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">Kế toán</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['Kế toán'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('Marketing')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Marketing'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Megaphone className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">Marketing</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['Marketing'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('Kho & Vận chuyển')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Kho & Vận chuyển'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Truck className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="truncate">Kho & Vận chuyển</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['Kho & Vận chuyển'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectDepartment?.('Nhân viên mới')}
            className={`w-full flex items-center justify-between space-x-2 px-2.5 py-1.5 rounded-lg transition ${
              selectedDepartment === 'Nhân viên mới'
                ? 'bg-slate-200/80 font-bold text-slate-900'
                : 'hover:bg-slate-200/50 text-slate-600 font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <UserPlus className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate">Nhân viên mới</span>
            </div>
            <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-bold text-slate-600 shrink-0">
              {departmentCounts['Nhân viên mới'] || 0}
            </span>
          </button>
        </div>

        {/* Action Shortcuts & Live Sheet Sync Status */}
        <div className="pt-2 border-t border-slate-200 space-y-1.5">
          <button
            onClick={onOpenAIModal}
            className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Trợ lý AI Tìm kiếm</span>
          </button>

          {/* Google Sheet Sync Quick Action */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-[11px]">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sheet Live Sync</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <p className="text-[10px] text-emerald-700/80 leading-tight">
              Tự động đọc & cập nhật ngay khi sửa Google Sheet.
            </p>

            <div className="flex items-center justify-between pt-0.5">
              <button
                onClick={onTriggerSync}
                className="text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition flex items-center space-x-1"
                title="Đồng bộ thủ công ngay lập tức"
              >
                <RefreshCw className={`w-3 h-3 ${sheetConfig?.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>{sheetConfig?.syncStatus === 'syncing' ? 'Đang đọc...' : 'Đồng bộ ngay'}</span>
              </button>

              <button
                onClick={onOpenSyncModal}
                className="text-[10px] font-semibold text-emerald-700 underline hover:text-emerald-900"
              >
                Cấu hình
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Help Support Card */}
      <div className="pt-4 mt-auto">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <h4 className="font-bold text-slate-800 text-xs">Cần hỗ trợ?</h4>
          <p className="text-[11px] text-slate-500">Liên hệ bộ phận HCNS</p>
          <div className="space-y-1 text-[11px] text-slate-600 pt-1 font-medium">
            <div className="flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href="mailto:hcns@lsplace.com.vn" className="hover:underline">
                hcns@lsplace.com.vn
              </a>
            </div>
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <a href="tel:02439339515" className="hover:underline">
                024 39339515
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

