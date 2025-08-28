import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminAccountsPage from '../pages/AdminAccountsPage';
import StaffAccountsPage from '../pages/StaffAccountsPage';
import MemberAccountsPage from '../pages/MemberAccountsPage';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import MembersManagementPage from '../pages/MembersManagementPage';
import AdminPackageManagement from '../pages/AdminPackageManagement';
import AdminServiceManagement from '../pages/AdminServiceManagement';
import PaymentPage from '../pages/PaymentPage';
import MembershipPage from '../pages/MembershipPage';
import ServicesPage from '../pages/ServicesPage';

// Layout wrapper that includes MainLayout and Outlet for nested routes
const LayoutWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <MainLayout>
      {children || <Outlet />}
    </MainLayout>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Default redirect for authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'staff', 'member']}>
            <LayoutWrapper>
              <DashboardPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<LayoutWrapper />}>
            <Route path="/admin/packages" element={<AdminPackageManagement />} />
            <Route path="/admin/services" element={<AdminServiceManagement />} />
            <Route path="/accounts/admin" element={<AdminAccountsPage />} />
            <Route path="/accounts/staff" element={<StaffAccountsPage />} />
            <Route path="/accounts/member" element={<MemberAccountsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Member routes */}
        <Route element={<ProtectedRoute allowedRoles={['member']} />}>
          <Route element={<LayoutWrapper />}>
            <Route path="/member-services" element={<ServicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Route>
        </Route>

        {/* Staff routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route element={<LayoutWrapper />}>
            <Route path="/members" element={<MembersManagementPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;