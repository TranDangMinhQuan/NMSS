import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMemberProfile, updateMemberProfile } from '../services/api';
import type { MemberProfile } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [form, setForm] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
      alert('Cập nhật thành công!');
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl">
            {(form.fullName?.charAt(0) ?? 'U').toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{form.fullName}</h1>
            <div className="text-sm text-gray-500">Trạng thái: {form.status}</div>
          </div>
          <div className="ml-auto">
            <button onClick={() => setEditing(!editing)} className="btn-primary">{editing ? 'Hủy' : 'Chỉnh sửa'}</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin cá nhân</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm">{form.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="text-sm">{form.phone}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">CCCD</div>
                <div className="text-sm">{form.cccd}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Giới tính</div>
                <div className="text-sm">{form.gender}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Ngày sinh</div>
                <div className="text-sm">{form.dateOfBirth?.slice(0, 10)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
                <div className="text-sm">{form.address}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Cập nhật</h3>
            {editing ? (
                <div className="space-y-3">
                <div>
                  <label htmlFor="fullName" className="block text-sm text-gray-700">Họ và tên</label>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
                  <input id="email" name="email" value={form.email} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-700">Số điện thoại</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="cccd" className="block text-sm text-gray-700">CCCD</label>
                  <input id="cccd" name="cccd" value={form.cccd} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm text-gray-700">Địa chỉ</label>
                  <input id="address" name="address" value={form.address} onChange={handleChange} className="input-field mt-1" />
                </div>
                <div className="pt-2">
                  <button type="button" onClick={handleSave} className="btn-primary">Lưu</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Bấm "Chỉnh sửa" để cập nhật thông tin cá nhân.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
