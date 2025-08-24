import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

type ProfileUser = {
  username: string;
  role: string;
  email?: string;
  fullName?: string;
  phone?: string;
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const u = user as ProfileUser | null;
  const [form, setForm] = useState({
    username: u?.username || '',
    email: u?.email || '',
    fullName: u?.fullName || '',
    phone: u?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // For demo app we only update local state; persistent backend not implemented
    // You may want to extend the auth hook to save profile updates
    alert('Lưu thông tin thành công (demo)');
    setEditing(false);
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

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <div className="text-sm text-gray-500">Role: {user.role}</div>
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
                <div className="text-xs text-gray-500">Tên đăng nhập</div>
                <div className="text-sm">{user.username}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm">{u?.email || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="text-sm">{u?.phone || '—'}</div>
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
                <div className="pt-2">
                  <button onClick={handleSave} className="btn-primary">Lưu</button>
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
