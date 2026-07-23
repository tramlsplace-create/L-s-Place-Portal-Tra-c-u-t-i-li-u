export type CategoryType = 'Tất cả' | 'Quy trình' | 'Quy định' | 'Biểu mẫu' | 'Tài liệu đào tạo';

export type DepartmentType =
  | 'Tất cả'
  | 'Khối Cửa Hàng'
  | 'HCNS'
  | 'Kinh doanh'
  | 'Kế toán'
  | 'Marketing'
  | 'Kho & Vận chuyển'
  | 'Nhân viên mới';

export type UserRole = 'Nhân viên' | 'Trưởng phòng / Quản lý' | 'Ban Giám đốc';

export type FileType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'mp4' | 'mp3' | 'jpg' | 'png' | 'zip' | 'folder' | (string & {});

export interface DocumentItem {
  id: string;
  code: string; // e.g., SOP-CH-001
  title: string;
  category: Exclude<CategoryType, 'Tất cả'>;
  department: Exclude<DepartmentType, 'Tất cả'>;
  minRole: UserRole;
  tags: string[];
  description: string;
  driveUrl: string; // Google Drive link
  downloadUrl?: string; // Direct download link
  fileType: FileType;
  fileSize?: string;
  updatedAt: string;
  version: string;
  author: string;
  viewsCount: number;
  downloadsCount: number;
  isImportant?: boolean;
}

export interface UserProfile {
  name: string;
  role: UserRole;
  department: DepartmentType;
  employeeId: string;
  avatarUrl?: string;
}

export interface SheetConfig {
  sheetUrlOrId: string;
  lastSyncedAt: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  autoSync: boolean;
  totalItems: number;
}

export interface SearchFilter {
  query: string;
  category: CategoryType;
  department: DepartmentType;
  tag: string;
  roleFilter: string;
  sortBy: 'newest' | 'views' | 'downloads' | 'title' | 'code';
  viewMode: 'grid' | 'table';
}

export interface AISearchResponse {
  answer: string;
  suggestedDocIds: string[];
  relatedTopics: string[];
}
