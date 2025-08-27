import React, { useState, useEffect } from 'react';
// Toast component đơn giản
function Toast({ message, color, onClose }: { readonly message: string; readonly color: string; readonly onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 ${color} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}>
      {message}
    </div>
  );
}
import { forgotPasswordRequest } from '../services/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<string>('bg-green-500');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await forgotPasswordRequest(email);
  setToastColor('bg-green-500');
  setToastMsg('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn!');
  } catch (err) {
    console.error('Forgot password request error:', err);
    setToastColor('bg-red-500');
    setToastMsg('Không thể gửi yêu cầu. Vui lòng kiểm tra lại email hoặc thử lại sau.');
  } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {toastMsg && <Toast message={toastMsg} color={toastColor} onClose={() => setToastMsg(null)} />}
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field mt-1"
              placeholder="Nhập email của bạn"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
