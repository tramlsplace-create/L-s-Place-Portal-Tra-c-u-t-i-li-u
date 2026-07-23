import React, { useState } from 'react';
import { Shield, KeyRound, Check, X, Lock, Eye, AlertCircle, Building2, User } from 'lucide-react';
import { UserRole, UserProfile, DepartmentType } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [selectedDept, setSelectedDept] = useState<DepartmentType>(currentUser.department);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [userName, setUserName] = useState(currentUser.name);

  if (!isOpen) return null;

  const handleApply = () => {
    // Require PIN for elevated roles
    if (selectedRole === 'Trưởng phòng / Quản lý' && currentUser.role === 'Nhân viên') {
      if (pinCode !== '1234' && pinCode !== '0000') {
        setPinError('Mã PIN xác thực Quản lý chưa đúng (Thử mã PIN mẫu: 1234)');
        return;
      }
    } else if (selectedRole === 'Ban Giám đốc' && currentUser.role !== 'Ban Giám đốc') {
      if (pinCode !== '8888' && pinCode !== '0000') {
        setPinError('Mã PIN Ban Giám Đốc chưa đúng (Thử mã PIN mẫu: 8888)');
        return;
      }
    }

    onUpdateUser({
      ...currentUser,
      name: userName || 'Nhân viên L\'s Place',
      role: selectedRole,
      department: selectedDept,
    });
    setPinError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B62B8] to-[#3B71CA] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#70C1EE]" />
            <h3 className="font-bold text-base">Phân Quyền Truy Cập Hệ Thống</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-slate-600">
            Hệ thống tự động lọc các quy trình, quy định và biểu mẫu theo đúng quyền hạn tài khoản của nhân viên L's Place.
          </p>

          {/* User Name & Department Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Họ và Tên Nhân viên</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B71CA]"
                placeholder="Nhập tên..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Phòng Ban Công Tác</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as DepartmentType)}
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3B71CA]"
              >
                {DEPARTMENTS.filter((d) => d !== 'Tất cả').map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Role Level */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Chọn Vai Trò Quyền Hạn:</label>
            <div className="space-y-2.5">
              {/* Role 1: Employee */}
              <div
                onClick={() => {
                  setSelectedRole('Nhân viên');
                  setPinError('');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                  selectedRole === 'Nhân viên'
                    ? 'border-[#2B62B8] bg-blue-50/60 ring-2 ring-[#2B62B8]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-100 text-[#2B62B8] mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">1. Quyền Nhân Viên Cửa Hàng / Khối Văn Phòng</span>
                    {selectedRole === 'Nhân viên' && <Check className="w-4 h-4 text-[#2B62B8]" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Xem toàn bộ Quy trình vận hành SOP, Quy định chung, Biểu mẫu đăng ký ca/phép, Tài liệu đào tạo sản phẩm.
                  </p>
                </div>
              </div>

              {/* Role 2: Manager */}
              <div
                onClick={() => {
                  setSelectedRole('Trưởng phòng / Quản lý');
                  setPinError('');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                  selectedRole === 'Trưởng phòng / Quản lý'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">2. Quyền Trưởng Phòng / Quản Lý Cửa Hàng</span>
                    {selectedRole === 'Trưởng phòng / Quản lý' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bao gồm toàn bộ quyền Nhân viên + Báo cáo nội bộ, Quy định thưởng KPI Cửa hàng, Biểu mẫu đề xuất thanh toán.
                  </p>
                </div>
              </div>

              {/* Role 3: Director */}
              <div
                onClick={() => {
                  setSelectedRole('Ban Giám đốc');
                  setPinError('');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                  selectedRole === 'Ban Giám đốc'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800 mt-0.5">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">3. Quyền Ban Giám Đốc & Admin Cao Cấp</span>
                    {selectedRole === 'Ban Giám đốc' && <Check className="w-4 h-4 text-purple-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Toàn quyền xem tất cả tài liệu tuyệt mật, quy chế quản trị chiến lược, tài chính và phân quyền hệ thống.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Passcode input for elevated roles */}
          {selectedRole !== 'Nhân viên' && selectedRole !== currentUser.role && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 animate-in fade-in">
              <label className="block text-xs font-semibold text-amber-900 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Nhập mã PIN xác thực (Thử nghiệm: Quản lý = 1234, Ban Giám Đốc = 8888)</span>
              </label>
              <input
                type="password"
                placeholder="Nhập 4 số PIN..."
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                maxLength={6}
                className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          )}

          {pinError && (
            <div className="flex items-center space-x-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-xs font-bold text-white bg-[#2B62B8] hover:bg-[#224fa0] rounded-lg shadow-xs transition"
          >
            Lưu & Cập Nhật Phân Quyền
          </button>
        </div>
      </div>
    </div>
  );
};
