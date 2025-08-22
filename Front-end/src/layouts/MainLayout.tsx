import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in (guest), show only header with limited navigation
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    );
  }

  // If user is admin or staff, show sidebar layout WITHOUT header
  if (user.role === 'admin' || user.role === 'staff') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex flex-1 w-full">
          <Sidebar />
          <main className="flex-1 p-8">
            {children || <Outlet />}
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // For regular members, show header-only layout (without Trang chủ)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
