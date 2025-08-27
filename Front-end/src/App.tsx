import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';

// Lazy load pages for better performance
const AdminAccountsPage = React.lazy(() => import('./pages/AdminAccountsPage'));
const StaffAccountsPage = React.lazy(() => import('./pages/StaffAccountsPage'));
const MemberAccountsPage = React.lazy(() => import('./pages/MemberAccountsPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const AdminServiceManagement = React.lazy(() => import('./pages/AdminServiceManagement'));
const AdminPackageManagement = React.lazy(() => import('./pages/AdminPackageManagement'));
const MembershipPage = React.lazy(() => import('./pages/MembershipPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const MembersManagementPage = React.lazy(() => import('./pages/MembersManagementPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

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

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          
          {/* Protected Routes with MainLayout */}
          <Route path="/" element={
            <MainLayout>
              <React.Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </React.Suspense>
            </MainLayout>
          } />
          
          {/* Quản lý dịch vụ: Cho phép admin, staff, member */}
          <Route path="/services" element={
            <ProtectedRoute roles={['admin', 'staff', 'member']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AdminServiceManagement />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Quản lý gói dịch vụ: Cho phép admin, staff, member */}
          <Route path="/packages" element={
            <ProtectedRoute roles={['admin', 'staff', 'member']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AdminPackageManagement />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Xem dịch vụ: Cho phép member, staff, admin */}
          <Route path="/member-services" element={
            <ProtectedRoute roles={['member', 'staff', 'admin']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ServicesPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['admin', 'staff', 'member']}>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/membership" element={
            <MainLayout>
              <React.Suspense fallback={<div>Loading...</div>}>
                <MembershipPage />
              </React.Suspense>
            </MainLayout>
          } />
          
          <Route path="/booking" element={
            <ProtectedRoute roles={['member', 'staff', 'admin']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <BookingPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/payment" element={
            <ProtectedRoute roles={['member']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <PaymentPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Account Management Routes */}
          <Route path="/accounts/admin" element={
            <ProtectedRoute roles={["admin"]}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AdminAccountsPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/accounts/staff" element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <StaffAccountsPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/accounts/member" element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MemberAccountsPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/members" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <MembersManagementPage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/membership-cards" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <div>Membership Cards Management Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/packages" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <div>Packages Management Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <div>Bookings Management Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/checkin" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <div>Check-in Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/payments" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <div>Payments Management Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reward-points" element={
            <ProtectedRoute roles={['admin', 'staff']}>
              <MainLayout>
                <div>Reward Points Management Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/centers" element={
            <ProtectedRoute roles={['admin']}>
              <MainLayout>
                <div>Centers Management Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute roles={['admin']}>
              <MainLayout>
                <div>Reports Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Member Routes */}
          <Route path="/profile" element={
            <ProtectedRoute roles={['member', 'staff', 'admin']}>
              <MainLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <ProfilePage />
                </React.Suspense>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute roles={['member']}>
              <MainLayout>
                <div>My Bookings Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/my-memberships" element={
            <ProtectedRoute roles={['member']}>
              <MainLayout>
                <div>My Memberships Page</div>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <MainLayout>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Trang bạn tìm kiếm không tồn tại.</p>
                  <a href="/" className="btn-primary">
                    Về trang chủ
                  </a>
                </div>
              </div>
            </MainLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;