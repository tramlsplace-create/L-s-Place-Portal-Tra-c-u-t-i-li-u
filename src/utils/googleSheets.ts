import Papa from 'papaparse';
import { DocumentItem, FileType, UserRole } from '../types';

export function extractSheetCsvUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Already a direct CSV or GViz URL
  if (trimmed.includes('pub?output=csv') || trimmed.includes('/export?format=csv') || trimmed.includes('/gviz/tq?tqx=out:csv')) {
    return trimmed;
  }

  // Extract Sheet ID & GID from standard edit/view link: https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit#gid=0
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
    // Primary: Google Sheets GViz CSV export endpoint
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${gidParam}`;
  }

  return trimmed;
}

export function parseCsvToDocuments(csvString: string): DocumentItem[] {
  if (!csvString || csvString.trim().startsWith('<!DOCTYPE html') || csvString.trim().startsWith('<html')) {
    return [];
  }

  const result = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (!result.data || result.data.length === 0) {
    return [];
  }

  const documents: DocumentItem[] = [];

  result.data.forEach((row, index) => {
    // Find matching columns flexibly regardless of slight naming differences
    const getVal = (...keys: string[]) => {
      for (const key of keys) {
        const foundKey = Object.keys(row).find(
          (k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, '')
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
          return String(row[foundKey]).trim();
        }
      }
      return '';
    };

    const code = getVal('Mã VB', 'Mã văn bản', 'Mã tài liệu', 'Code', 'ID') || `DOC-${index + 101}`;
    const title = getVal('Tên tài liệu', 'Tên văn bản', 'Tên', 'Title', 'Document Name');
    if (!title) return; // Skip empty rows without title

    const rawCategory = getVal('Loại tài liệu', 'Loại', 'Danh mục', 'Category', 'Type');
    let category: DocumentItem['category'] = 'Quy trình';
    if (rawCategory.includes('định') || rawCategory.includes('Định')) category = 'Quy định';
    else if (rawCategory.includes('mẫu') || rawCategory.includes('Mẫu')) category = 'Biểu mẫu';
    else if (rawCategory.includes('đào tạo') || rawCategory.includes('Đào tạo') || rawCategory.includes('Training')) category = 'Tài liệu đào tạo';
    else if (rawCategory.includes('trình') || rawCategory.includes('SOP')) category = 'Quy trình';

    const rawDepartment = getVal('Đối tượng áp dụng', 'Đối tượng', 'Phòng ban', 'Bộ phận', 'Department', 'Kho', 'Kho / Khối', 'Khối', 'Khối / Phòng ban', 'Áp dụng');
    let department: DocumentItem['department'] = 'Khối Cửa Hàng';

    if (rawDepartment) {
      const dLower = rawDepartment.toLowerCase();
      if (dLower.includes('hcns') || dLower.includes('nhân sự') || dLower.includes('hành chính') || dLower.includes('hr')) {
        department = 'HCNS';
      } else if (dLower.includes('kế toán') || dLower.includes('tài chính') || dLower.includes('finance')) {
        department = 'Kế toán';
      } else if (dLower.includes('kinh doanh') || dLower.includes('sales')) {
        department = 'Kinh doanh';
      } else if (dLower.includes('marketing')) {
        department = 'Marketing';
      } else if (dLower.includes('kho') || dLower.includes('vận chuyển') || dLower.includes('logistics')) {
        department = 'Kho & Vận chuyển';
      } else if (dLower.includes('mới') || dLower.includes('onboarding') || dLower.includes('nhân viên mới')) {
        department = 'Nhân viên mới';
      } else if (dLower.includes('cửa hàng') || dLower.includes('store') || dLower.includes('siêu thị')) {
        department = 'Khối Cửa Hàng';
      } else {
        department = rawDepartment as any;
      }
    }

    const rawRole = getVal('Quyền truy cập', 'Quyền', 'Role', 'Access');
    let minRole: UserRole = 'Nhân viên';
    if (rawRole.includes('Quản lý') || rawRole.includes('Trưởng phòng') || rawRole.includes('Manager')) minRole = 'Trưởng phòng / Quản lý';
    else if (rawRole.includes('Giám đốc') || rawRole.includes('Admin') || rawRole.includes('Director')) minRole = 'Ban Giám đốc';

    const rawTags = getVal('Thẻ', 'Tags', 'Thẻ/Tags', 'Từ khóa');
    const tags = rawTags
      ? rawTags.split(/[,;\n]+/).map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
      : ['TàiLiệu'];

    const description = getVal('Mô tả ngắn', 'Mô tả', 'Description', 'Ghi chú') || 'Tài liệu nội bộ ban hành bởi L\'s Place Food Mart.';
    const driveUrl = getVal('Link Google Drive', 'Link Drive', 'Link', 'Drive URL', 'URL') || 'https://drive.google.com';
    const downloadUrl = getVal('Link tải về', 'Download URL', 'Link Tải') || driveUrl;

    const rawFileType = getVal('Định dạng', 'Loại file', 'File Type', 'Type', 'Format').toLowerCase();
    let fileType: FileType = 'pdf';
    if (rawFileType.includes('doc') || rawFileType.includes('word')) fileType = 'docx';
    else if (rawFileType.includes('xls') || rawFileType.includes('csv') || rawFileType.includes('excel') || rawFileType.includes('sheet')) fileType = 'xlsx';
    else if (rawFileType.includes('ppt') || rawFileType.includes('presentation')) fileType = 'pptx';
    else if (rawFileType.includes('mp4') || rawFileType.includes('video') || rawFileType.includes('mov') || rawFileType.includes('avi')) fileType = 'mp4';
    else if (rawFileType.includes('mp3') || rawFileType.includes('audio') || rawFileType.includes('sound') || rawFileType.includes('wav')) fileType = 'mp3';
    else if (rawFileType.includes('jpg') || rawFileType.includes('jpeg') || rawFileType.includes('png') || rawFileType.includes('image') || rawFileType.includes('ảnh') || rawFileType.includes('img')) fileType = 'jpg';
    else if (rawFileType.includes('pdf')) fileType = 'pdf';
    else if (rawFileType) fileType = rawFileType;
    else if (driveUrl.includes('spreadsheet')) fileType = 'xlsx';
    else if (driveUrl.includes('presentation')) fileType = 'pptx';
    else if (driveUrl.includes('document')) fileType = 'docx';

    const fileSize = getVal('Dung lượng', 'Size') || '1.2 MB';
    const updatedAt = getVal('Ngày cập nhật', 'Ngày ban hành', 'Date', 'Updated') || new Date().toISOString().split('T')[0];
    const version = getVal('Phiên bản', 'Version') || '1.0';
    const author = getVal('Tác giả', 'Người soạn thảo', 'Người tạo', 'Đơn vị ban hành', 'Ban hành', 'Author', 'Người biên soạn') || 'Ban Quản trị L\'s Place';

    // Deterministic ID so background auto-sync doesn't disrupt React state or selection
    const cleanCode = code.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const stableId = `doc-sheet-${index}-${cleanCode || 'item'}`;

    // Hash function to derive stable pseudo-random view counts
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash << 5) - hash + code.charCodeAt(i);
      hash |= 0;
    }
    const stableViews = 100 + (Math.abs(hash) % 400);
    const stableDownloads = 20 + (Math.abs(hash) % 120);

    documents.push({
      id: stableId,
      code,
      title,
      category,
      department,
      minRole,
      tags,
      description,
      driveUrl: formatGoogleDrivePreviewUrl(driveUrl),
      downloadUrl,
      fileType,
      fileSize,
      updatedAt,
      version,
      author,
      viewsCount: stableViews,
      downloadsCount: stableDownloads,
      isImportant: index < 3,
    });
  });

  return documents;
}

export function formatGoogleDrivePreviewUrl(url: string): string {
  if (!url) return 'https://drive.google.com';
  
  // Converts google drive view/edit links to preview embed links
  if (url.includes('drive.google.com/file/d/')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  
  if (url.includes('docs.google.com/document/d/')) {
    const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (docIdMatch && docIdMatch[1]) {
      return `https://docs.google.com/document/d/${docIdMatch[1]}/preview`;
    }
  }

  if (url.includes('docs.google.com/spreadsheets/d/')) {
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetIdMatch && sheetIdMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/preview`;
    }
  }

  if (url.includes('docs.google.com/presentation/d/')) {
    const pptIdMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
    if (pptIdMatch && pptIdMatch[1]) {
      return `https://docs.google.com/presentation/d/${pptIdMatch[1]}/preview`;
    }
  }

  return url;
}
