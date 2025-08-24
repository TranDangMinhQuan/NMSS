import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ❌ Không render header cho admin/staff
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return null;
  }

  // Guest navigation
  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NVH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Nhà Văn Hóa Sinh Viên
                </span>
              </Link>
            </div>

            {/* Guest Navigation */}
            <nav className="flex items-center space-x-8">
              {/* <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Trang chủ
              </Link> */}
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                Đăng ký
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Member navigation
  if (user && user.role === 'member') {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/member-services" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NVH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Nhà Văn Hóa Sinh Viên
                </span>
              </Link>
            </div>

            {/* Member Navigation */}
            <nav className="flex items-center space-x-8">
              <Link
                to="/member-services"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dịch vụ
              </Link>
              <Link
                to="/membership"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Thành viên
              </Link>
              <Link
                to="/booking"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Đặt chỗ
              </Link>
              
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <div className="text-sm text-gray-700">
                    Xin chào, <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Lịch đặt chỗ
                  </Link>
                  <Link
                    to="/my-memberships"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Thẻ thành viên
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Fallback - không render gì cả
  return null;
};

export default Header;