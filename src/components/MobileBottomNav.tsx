import React from 'react';
import { Home, Bot, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  onResetSearch: () => void;
  onOpenAIModal: () => void;
  onOpenSidebar?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onResetSearch,
  onOpenAIModal,
  onOpenSidebar,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex justify-around items-center text-[10px] text-slate-600 shadow-lg">
      <button
        onClick={onResetSearch}
        className="flex flex-col items-center space-y-0.5 text-[#2B62B8]"
      >
        <Home className="w-5 h-5" />
        <span className="font-bold">Trang chủ</span>
      </button>

      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center space-y-0.5 text-slate-700 font-bold"
        >
          <Menu className="w-5 h-5" />
          <span>Danh mục</span>
        </button>
      )}

      <button
        onClick={onOpenAIModal}
        className="flex flex-col items-center space-y-0.5 text-amber-600 font-bold"
      >
        <Bot className="w-5 h-5" />
        <span>Trợ lý AI</span>
      </button>
    </div>
  );
};
