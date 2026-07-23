import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  X,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
} from 'lucide-react';
import { SheetConfig } from '../types';
import { GOOGLE_SHEET_TEMPLATE_SAMPLE } from '../data/mockData';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetConfig: SheetConfig;
  onSyncNow: (urlInput?: string) => Promise<void>;
  onToggleAutoSync: (enabled: boolean) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  sheetConfig,
  onSyncNow,
  onToggleAutoSync,
}) => {
  const [urlInput, setUrlInput] = useState(sheetConfig.sheetUrlOrId);
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin PIN Protection State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      await onSyncNow(isAdminUnlocked ? urlInput : undefined);
      setMessage({
        type: 'success',
        text: 'Đã đồng bộ dữ liệu từ Google Sheet thành công!',
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Không thể đọc dữ liệu từ Google Sheet. Vui lòng kiểm tra quyền công khai của file.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleVerifyPin = () => {
    if (pinCode === '8888' || pinCode === '1234' || pinCode === '0000') {
      setIsAdminUnlocked(true);
      setShowPinInput(false);
      setPinError('');
    } else {
      setPinError('Mã PIN Admin chưa chính xác (Mã mẫu: 8888)');
    }
  };

  const handleCopyTemplate = () => {
    const csvContent = GOOGLE_SHEET_TEMPLATE_SAMPLE.map((row) => row.join(',')).join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B62B8] to-[#3B71CA] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-[#70C1EE]" />
            <h3 className="font-bold text-base">Trạng Thái Kết Nối Google Sheet</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-[#2B62B8] font-bold">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Cơ chế Tự động Đồng bộ Trực tiếp</span>
            </div>
            <p className="leading-relaxed">
              Dữ liệu danh mục quy trình & biểu mẫu đang được kết nối tự động với Google Sheet chính thức của L's Place. Cập nhật trên Sheet sẽ tự đồng bộ sang website.
            </p>
          </div>

          {/* Locked Protected Sheet Info / Unlocked Form */}
          {!isAdminUnlocked ? (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-emerald-900">
                  <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Google Sheet Chính Thức (Đã khóa chỉnh sửa)</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                  Đang hoạt động
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-[#2B62B8] hover:bg-[#224fa0] text-white font-bold rounded-lg transition flex items-center space-x-1.5 shrink-0 shadow-2xs text-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Đang đọc...' : 'Đồng bộ lại ngay'}</span>
                </button>

                {!showPinInput ? (
                  <button
                    onClick={() => setShowPinInput(true)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 underline"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Mở khóa cấu hình Admin</span>
                  </button>
                ) : null}
              </div>

              {/* Admin PIN Unlock Form */}
              {showPinInput && (
                <div className="pt-2 border-t border-emerald-200/80 space-y-2 animate-in fade-in">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Nhập mã PIN Admin để sửa đổi liên kết (Mẫu: 8888):
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      placeholder="Mã PIN 4 số..."
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono w-36"
                    />
                    <button
                      onClick={handleVerifyPin}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => setShowPinInput(false)}
                      className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 text-xs rounded-lg"
                    >
                      Hủy
                    </button>
                  </div>
                  {pinError && <p className="text-[11px] font-bold text-rose-600">{pinError}</p>}
                </div>
              )}
            </div>
          ) : (
            /* Editable URL Input Form (Only visible when unlocked by Admin) */
            <div className="space-y-2 bg-amber-50/60 p-4 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-amber-900 flex items-center space-x-1.5">
                  <Unlock className="w-4 h-4 text-amber-700" />
                  <span>Thay đổi Đường Dẫn (URL) Google Sheet:</span>
                </label>
                <button
                  onClick={() => setIsAdminUnlocked(false)}
                  className="text-[10px] font-bold text-slate-600 bg-white border px-2 py-0.5 rounded hover:bg-slate-100"
                >
                  Khóa lại
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs.../edit"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 p-2.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B71CA] text-xs font-mono"
                />
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-4 py-2.5 bg-[#2B62B8] hover:bg-[#224fa0] text-white font-bold rounded-lg transition flex items-center space-x-1.5 shrink-0 disabled:opacity-50 text-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Đang đọc...' : 'Lưu & Đồng bộ'}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-800">
                Hỗ trợ link file Google Sheets công khai hoặc đường dẫn xuất file CSV.
              </p>
            </div>
          )}

          {/* Feedback message */}
          {message && (
            <div
              className={`p-3 rounded-lg border flex items-center space-x-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Auto Sync Toggle & Status */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">Tự động cập nhật định kỳ</p>
              <p className="text-[11px] text-slate-500">
                Lần đồng bộ gần nhất:{' '}
                {sheetConfig.lastSyncedAt
                  ? new Date(sheetConfig.lastSyncedAt).toLocaleString('vi-VN')
                  : 'Dữ liệu mẫu nội bộ'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sheetConfig.autoSync}
                onChange={(e) => onToggleAutoSync(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B62B8]"></div>
            </label>
          </div>

          {/* Template Columns Preview (Only visible when unlocked by Admin) */}
          {isAdminUnlocked && (
            <div className="space-y-2 border-t border-slate-200 pt-4 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800">Cấu trúc các Cột mẫu trên Google Sheet:</h4>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center space-x-1 text-[#2B62B8] hover:underline font-semibold text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép CSV!' : 'Sao chép mẫu CSV'}</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-[11px] border-collapse min-w-[600px]">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      {GOOGLE_SHEET_TEMPLATE_SAMPLE[0].slice(0, 8).map((h, i) => (
                        <th key={i} className="p-2 border-b border-r border-slate-200 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {GOOGLE_SHEET_TEMPLATE_SAMPLE.slice(1).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.slice(0, 8).map((cell, cIdx) => (
                          <td key={cIdx} className="p-2 border-r border-slate-100 text-slate-600 truncate max-w-[120px]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

