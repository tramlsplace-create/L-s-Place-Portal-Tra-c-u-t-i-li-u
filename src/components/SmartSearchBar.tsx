import React from 'react';
import { Search, Sparkles, SlidersHorizontal, LayoutGrid, List, ArrowUpDown, X } from 'lucide-react';
import { SearchFilter } from '../types';

interface SmartSearchBarProps {
  filter: SearchFilter;
  onFilterChange: (updates: Partial<SearchFilter>) => void;
  totalResults: number;
  onOpenAIModal: () => void;
  onToggleMobileFilter: () => void;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  filter,
  onFilterChange,
  totalResults,
  onOpenAIModal,
  onToggleMobileFilter,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
      {/* Main Search Row */}
      <div className="flex flex-col md:flex-row items-stretch gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên quy trình hoặc nội dung mô tả..."
            value={filter.query}
            onChange={(e) => onFilterChange({ query: e.target.value })}
            className="w-full pl-11 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B71CA] focus:bg-white transition"
          />
          {filter.query && (
            <button
              onClick={() => onFilterChange({ query: '' })}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAIModal}
          className="px-4 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 shrink-0 group"
        >
          <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="text-xs">Hỏi AI Tra Cứu</span>
        </button>

        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilter}
          className="md:hidden px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Control Bar: View Switcher & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="text-slate-500 font-medium flex items-center space-x-2">
          <span>
            Tìm thấy <strong className="text-slate-900 font-bold">{totalResults}</strong> tài liệu phù hợp
          </span>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Sorting dropdown */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Sắp xếp:</span>
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#3B71CA]"
            >
              <option value="newest">Mới nhất</option>
              <option value="views">Xem nhiều nhất</option>
              <option value="downloads">Lượt tải nhiều nhất</option>
              <option value="code">Mã VB (A-Z)</option>
              <option value="title">Tên (A-Z)</option>
            </select>
          </div>

          {/* View Mode Switcher (Grid / Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              className={`p-1 rounded-md transition ${
                filter.viewMode === 'grid' ? 'bg-white text-[#2B62B8] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Giao diện thẻ (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onFilterChange({ viewMode: 'table' })}
              className={`p-1 rounded-md transition ${
                filter.viewMode === 'table' ? 'bg-white text-[#2B62B8] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Giao diện bảng danh sách (Table)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
