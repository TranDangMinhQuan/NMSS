import React, { useState, useMemo } from 'react';
import { resetPassword } from '../services/api';

const ResetPasswordPage: React.FC = () => {
  const token = useMemo(() => new URLSearchParams(window.location.search).get('token') || '', []);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await resetPassword(token, password);
      setMessage('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.');
    } catch (e) {
      setError('Không thể đặt lại mật khẩu. Token có thể đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Mật khẩu mới</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Nhập lại mật khẩu</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="input-field mt-1" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
