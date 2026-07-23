import React, { useState } from 'react';
import {
  FileText,
  RefreshCw,
  UserCheck,
  Shield,
  Search,
  Bot,
  Menu,
  X,
  Database,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Lock,
} from 'lucide-react';
import { UserProfile, SheetConfig, UserRole } from '../types';
import logoImg from '../assets/images/lsplace_logo_1784689616070.jpg';

interface NavbarProps {
  user: UserProfile;
  sheetConfig: SheetConfig;
  onOpenRoleModal: () => void;
  onOpenSyncModal: () => void;
  onOpenAIModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  sheetConfig,
  onOpenRoleModal,
  onOpenSyncModal,
  onOpenAIModal,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Ban Giám đốc':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Trưởng phòng / Quản lý':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner for Company Branding */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2 font-medium">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            Cổng thông tin L's Place
          </span>
          <span className="hidden sm:inline text-slate-300">Hệ thống Tra cứu Quy trình, Quy định & Biểu mẫu Doanh Nghiệp</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <button
            onClick={onOpenSyncModal}
            className="flex items-center space-x-1.5 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded-md transition text-slate-300"
          >
            <Database className="w-3 h-3 text-blue-400" />
            <span>Google Sheet Sync: {sheetConfig.totalItems} VB</span>
            {sheetConfig.syncStatus === 'syncing' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
          <button
            onClick={onOpenAIModal}
            className="hidden md:flex items-center space-x-1 font-semibold text-amber-300 hover:text-amber-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Trợ lý AI Tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center space-x-2.5">
              {/* L's Place PNG Logo Image */}
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-2xs bg-white flex items-center justify-center shrink-0">
                <img
                  src={logoImg}
                  alt="L's Place Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* L's Place Custom Typography Logo */}
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-0.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-700 leading-none">
                    L's
                  </span>
                  <span className="text-xl sm:text-2xl font-light tracking-tight text-sky-500 leading-none">
                    place
                  </span>
                </div>
                <span className="text-[9px] font-bold tracking-[0.22em] text-slate-500 uppercase mt-0.5">
                  Food Mart
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <div className="hidden sm:flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Thư Viện Quyết Định & Quy Trình</h1>
              <p className="text-[11px] font-medium text-slate-500">Knowledge Hub • Portal Nội Bộ</p>
            </div>
          </div>

          {/* Quick Header Search Bar - Professional Polish style */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm quy trình, biểu mẫu, tài liệu đào tạo L's Place..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2 pl-10 pr-24 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />

              <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onOpenAIModal}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>AI SEARCH</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Role Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-2xs transition"
            >
              <Bot className="w-4 h-4" />
              <span>Hỏi Trợ lý AI</span>
            </button>

            {/* Google Sheets Sync Button */}
            <button
              onClick={onOpenSyncModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-200"
              title="Đồng bộ dữ liệu Google Sheet"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline">Google Sheet</span>
            </button>

            {/* User Profile Block */}
            <div className="relative">
              <button
                onClick={onOpenRoleModal}
                className="flex items-center space-x-2.5 p-1.5 pl-2.5 pr-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition shadow-2xs"
              >
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{user.department}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-blue-700 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                  {user.name.charAt(0)}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <button
              onClick={onOpenAIModal}
              className="p-2 text-amber-600 bg-amber-50 rounded-lg"
              title="Hỏi AI"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500">Quyền hiện tại: {user.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRoleModal();
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Đổi vai trò
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSyncModal();
              }}
              className="flex items-center justify-center space-x-2 p-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
            >
              <Database className="w-4 h-4 text-blue-600" />
              <span>Cấu hình Sheet</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIModal();
              }}
              className="flex items-center justify-center space-x-2 p-2 bg-amber-500 text-white rounded-lg text-xs font-semibold"
            >
              <Bot className="w-4 h-4" />
              <span>Hỏi Trợ lý AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
