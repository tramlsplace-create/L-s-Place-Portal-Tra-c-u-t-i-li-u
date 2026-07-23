import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Video,
  Music,
  Image as ImageIcon,
  File,
} from 'lucide-react';

export interface FileFormatConfig {
  label: string;
  Icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
  badgeClass: string;
}

export function getFileFormatConfig(fileType?: string): FileFormatConfig {
  const t = (fileType || 'pdf').toLowerCase().trim();

  if (t.includes('xls') || t.includes('csv') || t.includes('sheet') || t === 'excel') {
    return {
      label: 'XLSX',
      Icon: FileSpreadsheet,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  if (t.includes('doc') || t.includes('word')) {
    return {
      label: 'DOCX',
      Icon: FileText,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    };
  }

  if (t.includes('ppt') || t.includes('powerpoint') || t.includes('presentation')) {
    return {
      label: 'PPTX',
      Icon: Presentation,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    };
  }

  if (t.includes('mp4') || t.includes('video') || t.includes('mov') || t.includes('avi') || t.includes('mkv')) {
    return {
      label: 'MP4',
      Icon: Video,
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    };
  }

  if (t.includes('mp3') || t.includes('audio') || t.includes('sound') || t.includes('wav') || t.includes('m4a')) {
    return {
      label: 'MP3',
      Icon: Music,
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    };
  }

  if (t.includes('jpg') || t.includes('jpeg') || t.includes('png') || t.includes('gif') || t.includes('image') || t.includes('ảnh') || t.includes('img')) {
    return {
      label: 'JPG',
      Icon: ImageIcon,
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    };
  }

  if (t.includes('zip') || t.includes('rar') || t.includes('7z')) {
    return {
      label: 'ZIP',
      Icon: File,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }

  // Default PDF
  return {
    label: t ? t.toUpperCase() : 'PDF',
    Icon: FileText,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  };
}
