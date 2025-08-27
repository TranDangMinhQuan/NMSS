import React, { useState, useEffect } from 'react';
// Toast component đơn giản
function Toast({ message, onClose }: { readonly message: string; readonly onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
      {message}
    </div>
  );
}
import { useAuth } from '../hooks/useAuth';
import { getMemberProfile, updateMemberProfile } from '../services/api';
import type { MemberProfile } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [form, setForm] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getMemberProfile();
        setProfile(data);
        setForm(data);
      } catch {
        setError('Không thể tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      setLoading(true);
      const updated = await updateMemberProfile(form);
      setProfile(updated);
      setForm(updated);
      setEditing(false);
      setError(null);
  setToastMsg('Cập nhật thành công!');
    } catch {
      setError('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Bạn chưa đăng nhập</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để xem trang hồ sơ.</p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Đang tải thông tin...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }
  if (!profile || !form) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Avatar + Name + Status */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-400 via-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
            {(form.fullName?.charAt(0) ?? 'U').toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              {form.fullName}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 ml-2 shadow">{form.status}</span>
            </h1>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setEditing(!editing)}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-base flex items-center gap-2"
            >
              {editing ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Hủy
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6" /></svg>
                  Chỉnh sửa
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info & Edit */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-semibold text-primary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Thông tin cá nhân
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28">Email:</span>
                <span className="text-sm font-medium text-gray-800">{form.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28">Số điện thoại:</span>
                <span className="text-sm font-medium text-gray-800">{form.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28">CCCD:</span>
                <span className="text-sm font-medium text-gray-800">{form.cccd}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28">Giới tính:</span>
                <span className="text-sm font-medium text-gray-800">{form.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28">Ngày sinh:</span>
                <span className="text-sm font-medium text-gray-800">{form.dateOfBirth?.slice(0, 10)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28">Địa chỉ:</span>
                <span className="text-sm font-medium text-gray-800">{form.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-primary-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /></svg>
              Cập nhật
            </h3>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm text-gray-700 font-medium">Họ và tên</label>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 font-medium">Email</label>
                  <input id="email" name="email" value={form.email} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-700 font-medium">Số điện thoại</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="cccd" className="block text-sm text-gray-700 font-medium">CCCD</label>
                  <input id="cccd" name="cccd" value={form.cccd} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm text-gray-700 font-medium">Địa chỉ</label>
                  <input id="address" name="address" value={form.address} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div className="pt-2">
                  <button type="button" onClick={handleSave} className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-base">Lưu</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Bấm <span className="font-semibold text-primary-600">"Chỉnh sửa"</span> để cập nhật thông tin cá nhân.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
