import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText,
  Database,
  Sparkles,
  Search,
  Building2,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  ScrollText,
  Bell,
  UserPlus,
  Users,
  Calendar,
  Image as ImageIcon,
  HelpCircle,
  FolderOpen,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  DocumentItem,
  UserProfile,
  SheetConfig,
  SearchFilter,
  CategoryType,
  DepartmentType,
  UserRole,
} from './types';
import { INITIAL_DOCUMENTS, DEFAULT_USER } from './data/mockData';
import { parseCsvToDocuments, extractSheetCsvUrl, fetchCsvWithFallbacks } from './utils/googleSheets';

import { Sidebar } from './components/Sidebar';
import { PortalHomeDashboard } from './components/PortalHomeDashboard';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { SmartSearchBar } from './components/SmartSearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { DocumentCard } from './components/DocumentCard';
import { DocumentTable } from './components/DocumentTable';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { AISearchAssistantModal } from './components/AISearchAssistantModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

// Fixed Google Sheet URL configured directly in code
export const FIXED_GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/19gJViujZaG1gyr_ZvndH_S-UA5B_p6Jxk7uoK6LPFkw/edit?gid=0#gid=0';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<string>('Trang chủ');

  // State: Documents List
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('lsplace_docs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved docs', e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  // State: User Profile (for display reference)
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('lsplace_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return DEFAULT_USER;
  });

  // State: Google Sheet Config
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => {
    const savedConfig = localStorage.getItem('lsplace_sheet_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (!parsed.sheetUrlOrId || parsed.sheetUrlOrId.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')) {
          parsed.sheetUrlOrId = FIXED_GOOGLE_SHEET_URL;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved sheet config', e);
      }
    }
    return {
      sheetUrlOrId: FIXED_GOOGLE_SHEET_URL,
      lastSyncedAt: new Date().toISOString(),
      syncStatus: 'idle',
      autoSync: true,
      totalItems: INITIAL_DOCUMENTS.length,
    };
  });

  // State: Search & Filters
  const [filter, setFilter] = useState<SearchFilter>({
    query: '',
    category: 'Tất cả',
    department: 'Tất cả',
    tag: '',
    roleFilter: 'all',
    sortBy: 'newest',
    viewMode: 'grid',
  });

  // Modals state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('lsplace_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('lsplace_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lsplace_sheet_config', JSON.stringify(sheetConfig));
  }, [sheetConfig]);

  // Sync Google Sheet Function
  const handleSyncGoogleSheet = useCallback(
    async (overrideUrl?: string) => {
      const urlToUse = overrideUrl || FIXED_GOOGLE_SHEET_URL;
      if (!urlToUse) return;

      setSheetConfig((prev) => ({ ...prev, syncStatus: 'syncing', errorMessage: undefined }));

      try {
        const csvText = await fetchCsvWithFallbacks(urlToUse);
        const parsedDocs = parseCsvToDocuments(csvText);

        if (parsedDocs.length > 0) {
          setDocuments(parsedDocs);
          localStorage.setItem('lsplace_docs', JSON.stringify(parsedDocs));
          setSheetConfig({
            sheetUrlOrId: urlToUse,
            lastSyncedAt: new Date().toISOString(),
            syncStatus: 'success',
            autoSync: true,
            totalItems: parsedDocs.length,
          });
        }
      } catch (error: any) {
        console.warn('Google Sheet background sync notice:', error);
        setSheetConfig((prev) => ({
          ...prev,
          syncStatus: 'idle',
          errorMessage: error?.message,
        }));
      }
    },
    []
  );

  // 1. Initial background sync on mount
  useEffect(() => {
    handleSyncGoogleSheet(FIXED_GOOGLE_SHEET_URL).catch(() => {});
  }, [handleSyncGoogleSheet]);

  // 2. Periodic continuous auto-sync every 15 seconds
  useEffect(() => {
    if (!sheetConfig.autoSync) return;

    const intervalId = setInterval(() => {
      handleSyncGoogleSheet(FIXED_GOOGLE_SHEET_URL).catch(() => {});
    }, 15000);

    return () => clearInterval(intervalId);
  }, [sheetConfig.autoSync, handleSyncGoogleSheet]);

  // 3. Immediate sync whenever user switches back to browser tab
  useEffect(() => {
    const handleFocus = () => {
      if (sheetConfig.autoSync) {
        handleSyncGoogleSheet(FIXED_GOOGLE_SHEET_URL).catch(() => {});
      }
    };

    window.addEventListener('focus', handleFocus);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && sheetConfig.autoSync) {
        handleSyncGoogleSheet(FIXED_GOOGLE_SHEET_URL).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sheetConfig.autoSync, handleSyncGoogleSheet]);

  const updateFilter = (updates: Partial<SearchFilter>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  // Filtered Documents computation
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        // Query match - strictly based on process name (title) and description content
        if (filter.query.trim()) {
          const q = filter.query.toLowerCase().trim();
          const matchTitle = doc.title.toLowerCase().includes(q);
          const matchDesc = doc.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) {
            return false;
          }
        }

        // Category match
        if (filter.category !== 'Tất cả' && doc.category !== filter.category) {
          return false;
        }

        // Department match
        if (filter.department !== 'Tất cả' && doc.department !== filter.department) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Prioritize Important / Ghim
        if (a.isImportant && !b.isImportant) return -1;
        if (!a.isImportant && b.isImportant) return 1;

        switch (filter.sortBy) {
          case 'views':
            return b.viewsCount - a.viewsCount;
          case 'downloads':
            return b.downloadsCount - a.downloadsCount;
          case 'code':
            return a.code.localeCompare(b.code);
          case 'title':
            return a.title.localeCompare(b.title, 'vi');
          case 'newest':
          default:
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
  }, [documents, filter]);

  // Determine if we should show the Dashboard vs Full Catalog list
  const isDashboardView = activeTab === 'Trang chủ';

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-800 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Notion-style Left Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'Trang chủ') {
              updateFilter({ query: '', category: 'Tất cả', department: 'Tất cả' });
            }
          }}
          selectedCategory={filter.category}
          onSelectCategory={(cat) => {
            setActiveTab('Tài liệu');
            updateFilter({ category: cat });
          }}
          selectedDepartment={filter.department}
          onSelectDepartment={(dept) => {
            setActiveTab('Tài liệu');
            updateFilter({ department: dept });
          }}
          onOpenSyncModal={() => setSyncModalOpen(true)}
          onOpenAIModal={() => setAiModalOpen(true)}
          totalDocs={documents.length}
          documents={documents}
          sheetConfig={sheetConfig}
          onTriggerSync={() => handleSyncGoogleSheet(FIXED_GOOGLE_SHEET_URL)}
        />
      </div>

      {/* Main Workspace Canvas */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Floating Mobile Bar */}
        <div className="md:hidden bg-white border-b border-slate-200 p-2.5 px-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center space-x-2 text-slate-900 text-sm font-bold active:opacity-70 transition text-left"
            title="Nhấn để mở Menu Sidebar"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2B62B8] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
              <Menu className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-blue-700">L's Place</span>
                <span className="text-xs text-slate-500 font-normal">Portal 🌿</span>
              </div>
              <span className="text-[10px] text-[#2B62B8] font-semibold flex items-center space-x-0.5">
                <span>Mở Menu Danh Mục</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAiModalOpen(true)}
              className="p-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px]">Hỏi AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-over Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>

            {/* Slide-in Drawer Container */}
            <div className="relative w-72 max-w-[85vw] bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
              {/* Drawer Header */}
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-[#2B62B8] text-white flex items-center justify-center font-extrabold text-xs">
                    L
                  </div>
                  <span className="font-bold text-slate-800 text-xs">Danh Mục & Quy Trình</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                  title="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Component */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeTab={activeTab}
                  onSelectTab={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'Trang chủ') {
                      updateFilter({ query: '', category: 'Tất cả', department: 'Tất cả' });
                    }
                    setIsMobileSidebarOpen(false);
                  }}
                  selectedCategory={filter.category}
                  onSelectCategory={(cat) => {
                    setActiveTab('Tài liệu');
                    updateFilter({ category: cat });
                    setIsMobileSidebarOpen(false);
                  }}
                  selectedDepartment={filter.department}
                  onSelectDepartment={(dept) => {
                    setActiveTab('Tài liệu');
                    updateFilter({ department: dept });
                    setIsMobileSidebarOpen(false);
                  }}
                  onOpenSyncModal={() => {
                    setSyncModalOpen(true);
                    setIsMobileSidebarOpen(false);
                  }}
                  onOpenAIModal={() => {
                    setAiModalOpen(true);
                    setIsMobileSidebarOpen(false);
                  }}
                  totalDocs={documents.length}
                  documents={documents}
                  sheetConfig={sheetConfig}
                  onTriggerSync={() => {
                    handleSyncGoogleSheet(FIXED_GOOGLE_SHEET_URL);
                    setIsMobileSidebarOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {isDashboardView ? (
            /* Notion-style Portal Home Dashboard */
            <PortalHomeDashboard
              documents={filteredDocuments}
              onSelectCategory={(cat) => {
                setActiveTab('Tài liệu');
                updateFilter({ category: cat });
              }}
              onPreviewDoc={(doc) => setPreviewDoc(doc)}
              onSearchSubmit={(q) => {
                updateFilter({ query: q });
                setActiveTab('Tài liệu');
              }}
              onOpenAIModal={() => setAiModalOpen(true)}
              onViewAllCategory={(catName) => {
                setActiveTab(catName);
                updateFilter({ category: 'Tất cả' });
              }}
            />
          ) : (
            /* Full Search & Document Catalog View */
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header Navigation breadcrumb */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeTab === 'Trang chủ' ? 'Kết Quả Tìm Kiếm' : `Danh Mục: ${activeTab}`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hiển thị {filteredDocuments.length} văn bản & tài liệu L's Place
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('Trang chủ');
                    updateFilter({ query: '', category: 'Tất cả', department: 'Tất cả' });
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  ← Quay lại Trang chủ
                </button>
              </div>

              {/* Smart Search Bar */}
              <SmartSearchBar
                filter={filter}
                onFilterChange={updateFilter}
                totalResults={filteredDocuments.length}
                onOpenAIModal={() => setAiModalOpen(true)}
                onToggleMobileFilter={() => setMobileFilterOpen(true)}
              />

              {/* Horizontal Department & Category Tabs */}
              <CategoryTabs
                activeDepartment={filter.department}
                onSelectDepartment={(dept) => updateFilter({ department: dept })}
                activeCategory={filter.category}
                onSelectCategory={(cat) => updateFilter({ category: cat })}
                documents={documents}
              />

              {/* Main Document Grid/Table */}
              <div className="w-full space-y-4">
                {filteredDocuments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-base">
                        Không tìm thấy tài liệu phù hợp
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Thử thay đổi từ khóa hoặc bộ lọc phòng ban để tra cứu tài liệu.
                      </p>
                      <button
                        onClick={() =>
                          updateFilter({
                            query: '',
                            category: 'Tất cả',
                            department: 'Tất cả',
                            tag: '',
                          })
                        }
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  ) : filter.viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredDocuments.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          document={doc}
                          userRole={user.role}
                          onPreview={(d) => setPreviewDoc(d)}
                          onOpenRoleModal={() => setRoleModalOpen(true)}
                        />
                      ))}
                    </div>
                  ) : (
                    <DocumentTable
                      documents={filteredDocuments}
                      userRole={user.role}
                      onPreview={(d) => setPreviewDoc(d)}
                      onOpenRoleModal={() => setRoleModalOpen(true)}
                    />
                  )}
                </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <GoogleSheetSyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        sheetConfig={sheetConfig}
        onSyncNow={handleSyncGoogleSheet}
        onToggleAutoSync={(enabled) =>
          setSheetConfig((prev) => ({ ...prev, autoSync: enabled }))
        }
      />

      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onSelectRelatedDoc={(d) => setPreviewDoc(d)}
        allDocuments={documents}
      />

      <AISearchAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        documents={documents}
        userRole={user.role}
        userDepartment={user.department}
        onPreviewDoc={(d) => setPreviewDoc(d)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onResetSearch={() => {
          setActiveTab('Trang chủ');
          updateFilter({
            query: '',
            category: 'Tất cả',
            department: 'Tất cả',
            tag: '',
          });
        }}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenAIModal={() => setAiModalOpen(true)}
      />
    </div>
  );
}
