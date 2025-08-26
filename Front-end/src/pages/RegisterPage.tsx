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
import { register as apiRegister } from '../services/api';
import Logo from '../assets/logo.svg';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    cccd: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cccd.trim()) {
      newErrors.cccd = 'CCCD là bắt buộc';
    } else if (formData.cccd.length < 9) {
      newErrors.cccd = 'CCCD phải có ít nhất 9 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }

    if (!formData.gender) {
      newErrors.gender = 'Giới tính là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // Chuyển đổi dữ liệu cho đúng schema
      let gender: 'MALE' | 'FEMALE' = 'MALE';
      if (formData.gender === 'female') gender = 'FEMALE';
      // Nếu có giá trị khác, mặc định là MALE hoặc sửa lại logic nếu cần
      const payload = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        cccd: formData.cccd,
        gender,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : '',
        phone: formData.phone,
        address: formData.address,
      };
      await apiRegister(payload);
  setToastMsg('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
  setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  setToastMsg(errorMsg || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };


  return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} type={toastMsg.includes('thành công') ? 'success' : 'error'} />}
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
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
          Đăng ký tài khoản
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tạo tài khoản mới để sử dụng các dịch vụ của Nhà Văn Hóa Sinh Viên
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h3>
            </div>
            {/* Row 1: Họ và tên | CCCD */}
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Nhập họ và tên đầy đủ"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label htmlFor="cccd" className="block text-sm font-medium text-gray-700">CCCD *</label>
              <input
                id="cccd"
                name="cccd"
                type="text"
                required
                value={formData.cccd}
                onChange={handleChange}
                className={`input-field ${errors.cccd ? 'border-red-500' : ''}`}
                placeholder="Nhập CCCD"
              />
              {errors.cccd && (
                <p className="text-red-500 text-xs mt-1">{errors.cccd}</p>
              )}
            </div>
            {/* Row 2: Email | Số điện thoại */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            {/* Row 3: Ngày sinh | Giới tính */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Ngày sinh *</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính *</label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
            {/* Row 4: Địa chỉ (full width) */}
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                placeholder="Nhập địa chỉ"
              />
            </div>
            {/* Row 5: Mật khẩu | Xác nhận mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu *</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu *</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? (
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            {/* Terms and Conditions */}
            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đăng ký...
                  </div>
                ) : (
                  'Đăng ký tài khoản'
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

            {/* Google sign-up removed */}

            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
