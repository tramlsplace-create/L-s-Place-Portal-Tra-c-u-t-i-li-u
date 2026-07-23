import React from 'react';
import { Building2, Shield, Filter, Star, RotateCcw, X, FolderKanban, CheckCircle2 } from 'lucide-react';
import { SearchFilter, DepartmentType, UserProfile } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface FilterSidebarProps {
  filter: SearchFilter;
  onFilterChange: (updates: Partial<SearchFilter>) => void;
  user: UserProfile;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  onFilterChange,
  user,
  isMobileOpen,
  onCloseMobile,
}) => {
  const resetFilters = () => {
    onFilterChange({
      category: 'Tất cả',
      department: 'Tất cả',
      tag: '',
      roleFilter: 'all',
      query: '',
    });
  };

  const content = (
    <div className="space-y-5 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="font-bold text-white text-sm flex items-center space-x-2">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Lọc & Phân Loại</span>
        </h3>
        <button
          onClick={resetFilters}
          className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center space-x-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Quick My Department Toggle */}
      <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-2">
        <p className="font-bold text-slate-300 text-[11px]">Phòng ban của bạn</p>
        <button
          onClick={() =>
            onFilterChange({
              department: filter.department === user.department ? 'Tất cả' : user.department,
            })
          }
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-left transition flex items-center justify-between ${
            filter.department === user.department
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
          }`}
        >
          <span className="truncate pr-1">{user.department}</span>
          <Building2 className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {/* Department Select Filter */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Khối / Phòng ban
        </div>
        <div className="space-y-1">
          {DEPARTMENTS.map((dept) => {
            const isSelected = filter.department === dept;
            return (
              <button
                key={dept}
                onClick={() => onFilterChange({ department: dept as DepartmentType })}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 font-medium'
                }`}
              >
                <span className="truncate pr-2">{dept}</span>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Access Permission Level Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-800">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Quyền Hạn Truy Cấp
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ roleFilter: 'all' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
              filter.roleFilter === 'all'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 font-medium'
            }`}
          >
            Tất cả tài liệu
          </button>
          <button
            onClick={() => onFilterChange({ roleFilter: 'accessible' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
              filter.roleFilter === 'accessible'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 font-medium'
            }`}
          >
            ✓ Tôi có quyền xem
          </button>
          <button
            onClick={() => onFilterChange({ roleFilter: 'restricted' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
              filter.roleFilter === 'restricted'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 font-medium'
            }`}
          >
            🔒 Hạn chế / Giám đốc
          </button>
        </div>
      </div>

      {/* Status Box */}
      <div className="pt-2">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Trạng Thái Google Sheet</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[11px] font-medium text-slate-300">Tự động đồng bộ liên tục</p>
        </div>
      </div>
    </div>
  );

  // Desktop View
  if (!isMobileOpen) {
    return (
      <aside className="hidden md:block w-64 bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 shadow-md shrink-0 self-start sticky top-24">
        {content}
      </aside>
    );
  }

  // Mobile Drawer Mode
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex justify-end md:hidden animate-in fade-in">
      <div className="w-80 bg-slate-900 text-slate-200 h-full p-6 shadow-2xl overflow-y-auto space-y-4 border-l border-slate-800">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <span className="font-bold text-white text-base">Bộ Lọc L's Place</span>
          <button onClick={onCloseMobile} className="p-1 rounded-lg text-slate-400 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        {content}
        <button
          onClick={onCloseMobile}
          className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};
