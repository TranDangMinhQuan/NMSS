import React, { useState, useEffect } from 'react';
// Toast component đơn giản
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
function Toast({ message, onClose, type = 'success' }: { readonly message: string; readonly onClose: () => void; readonly type?: 'success' | 'error' }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-3 ${type === 'success' ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-red-400 to-pink-500'} text-white`}>
      {type === 'success' ? (
        <CheckCircleIcon className="w-6 h-6 text-white drop-shadow" />
      ) : (
        <XCircleIcon className="w-6 h-6 text-white drop-shadow" />
      )}
      <span className="font-semibold text-base">{message}</span>
    </div>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../assets/logo.svg';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<string>('bg-red-500');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email: formData.email, password: formData.password });
      if (user) {
        setToastColor('bg-green-500');
        setToastMsg('Đăng nhập thành công!');
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/dashboard');
          } else if (user.role === 'member') {
            navigate('/member-services');
          } else if (user.role === 'staff') {
            navigate('/members');
          } else {
            localStorage.removeItem('nvh_user');
            navigate('/login');
          }
        }, 1500);
      }
    } catch (err) {
      setToastColor('bg-red-500');
      setToastMsg(
        err instanceof Error
          ? `Đăng nhập thất bại! ${err.message}`
          : 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} type={toastColor === 'bg-green-500' ? 'success' : 'error'} />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="relative w-12 h-12 flex items-center justify-center">
            <img
              src={Logo}
              alt="Logo Gym"
              className="w-12 h-12 transition-transform duration-500 hover:scale-110 hover:rotate-6 drop-shadow-xl"
              style={{ filter: 'drop-shadow(0 0 8px #a78bfa)' }}
            />
            <span className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-tr from-purple-400 via-blue-300 to-pink-300 opacity-30"></span>
          </span>
        </div>
        <div className="mt-3 text-center">
          <Link to="/" className="text-sm text-primary-600 hover:text-primary-500 inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Về trang chủ
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào hệ thống
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhà Văn Hóa Sinh Viên - Hệ thống quản lý thành viên
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Nhập email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Nhập mật khẩu"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.154-2.004.444-2.92M6.34 6.34A9.969 9.969 0 0112 5c5.523 0 10 4.477 10 10 0 1.02-.154 2.004-.444 2.92M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google sign-in removed */}

            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ...existing code... */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;