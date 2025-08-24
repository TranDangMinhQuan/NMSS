import React, { useState, useEffect } from 'react';
import type { DashboardStats } from '../types';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    todayCheckins: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalMembers: 1250,
        activeMemberships: 890,
        totalRevenue: 125000000,
        pendingBookings: 45,
        todayCheckins: 156,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const RecentActivityCard: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Nguyễn Văn A đã đặt chỗ Gym</p>
            <p className="text-xs text-gray-500">2 phút trước</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Trần Thị B gia hạn thẻ thành viên</p>
            <p className="text-xs text-gray-500">15 phút trước</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Lê Văn C check-in Bowling</p>
            <p className="text-xs text-gray-500">1 giờ trước</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Phạm Thị D đăng ký thành viên mới</p>
            <p className="text-xs text-gray-500">2 giờ trước</p>
          </div>
        </div>
      </div>
    </div>
  );

  const QuickActionsCard: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center space-x-2 p-3 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-sm font-medium text-primary-700">Thêm thành viên</span>
        </button>
        <button className="flex items-center space-x-2 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-green-700">Tạo đặt chỗ</span>
        </button>
        <button className="flex items-center space-x-2 p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-yellow-700">Check-in</span>
        </button>
        <button className="flex items-center space-x-2 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium text-purple-700">Xem báo cáo</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống quản lý thành viên NVH</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng thành viên"
          value={stats.totalMembers.toLocaleString()}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
          color="bg-blue-500"
        />
        <StatCard
          title="Thẻ đang hoạt động"
          value={stats.activeMemberships.toLocaleString()}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
          color="bg-green-500"
        />
        <StatCard
          title="Doanh thu tháng"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="bg-yellow-500"
        />
        <StatCard
          title="Đặt chỗ chờ xử lý"
          value={stats.pendingBookings}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-red-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <QuickActionsCard />
      </div>
    </div>
  );
};

export default DashboardPage;