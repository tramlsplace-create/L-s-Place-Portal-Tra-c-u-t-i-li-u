import React from 'react';
import {
  Building2,
  Store,
  Users,
  Briefcase,
  FileText,
  Megaphone,
  Truck,
  UserPlus,
  Layers,
  ScrollText,
  ClipboardList,
  BookOpen,
} from 'lucide-react';
import { CategoryType, DepartmentType, DocumentItem } from '../types';

interface CategoryTabsProps {
  activeDepartment: DepartmentType;
  onSelectDepartment: (dept: DepartmentType) => void;
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  documents: DocumentItem[];
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeDepartment,
  onSelectDepartment,
  activeCategory,
  onSelectCategory,
  documents,
}) => {
  const departmentItems: { name: DepartmentType; icon: React.ReactNode; color: string }[] = [
    { name: 'Tất cả', icon: <Building2 className="w-4 h-4" />, color: 'text-slate-500' },
    { name: 'Khối Cửa Hàng', icon: <Store className="w-4 h-4" />, color: 'text-emerald-600' },
    { name: 'HCNS', icon: <Users className="w-4 h-4" />, color: 'text-purple-600' },
    { name: 'Kinh doanh', icon: <Briefcase className="w-4 h-4" />, color: 'text-indigo-600' },
    { name: 'Kế toán', icon: <FileText className="w-4 h-4" />, color: 'text-blue-600' },
    { name: 'Marketing', icon: <Megaphone className="w-4 h-4" />, color: 'text-rose-500' },
    { name: 'Kho & Vận chuyển', icon: <Truck className="w-4 h-4" />, color: 'text-amber-600' },
    { name: 'Nhân viên mới', icon: <UserPlus className="w-4 h-4" />, color: 'text-teal-600' },
  ];

  const categoryItems: { name: CategoryType; icon: React.ReactNode }[] = [
    { name: 'Tất cả', icon: <Layers className="w-3.5 h-3.5" /> },
    { name: 'Quy trình', icon: <FileText className="w-3.5 h-3.5 text-blue-500" /> },
    { name: 'Quy định', icon: <ScrollText className="w-3.5 h-3.5 text-purple-500" /> },
    { name: 'Biểu mẫu', icon: <ClipboardList className="w-3.5 h-3.5 text-emerald-500" /> },
    { name: 'Tài liệu đào tạo', icon: <BookOpen className="w-3.5 h-3.5 text-amber-500" /> },
  ];

  const getDepartmentCount = (dept: DepartmentType) => {
    if (dept === 'Tất cả') return documents.length;
    return documents.filter((d) => d.department === dept).length;
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Primary Horizontal Department Filter Buttons */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center justify-between">
          <span>ĐỐI TƯỢNG ÁP DỤNG</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {departmentItems.map((dept) => {
            const count = getDepartmentCount(dept.name);
            const isActive = activeDepartment === dept.name;

            return (
              <button
                key={dept.name}
                onClick={() => onSelectDepartment(dept.name)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shrink-0 border shadow-2xs ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className={isActive ? 'text-white' : dept.color}>{dept.icon}</span>
                <span className="whitespace-nowrap">{dept.name}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Category Type Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs scrollbar-none">
        <span className="text-slate-400 font-bold text-[11px] shrink-0 uppercase tracking-wider">
          Loại tài liệu:
        </span>
        {categoryItems.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold text-[11px] transition shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

