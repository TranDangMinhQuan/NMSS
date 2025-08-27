import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes - admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/packages" element={<AdminPackageManagement />} />
          <Route path="/admin/services" element={<AdminServiceManagement />} />
        </Route>

        {/* Protected routes - member */}
        <Route element={<ProtectedRoute allowedRoles={["member"]}><MainLayout /></ProtectedRoute>}>
          <Route path="/member-services" element={<ServicesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/accounts/admin" element={<AdminAccountsPage />} />
          <Route path="/accounts/staff" element={<StaffAccountsPage />} />
          <Route path="/accounts/member" element={<MemberAccountsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* Protected routes - staff */}
        <Route element={<ProtectedRoute allowedRoles={["staff"]}><MainLayout /></ProtectedRoute>}>
          <Route path="/members" element={<MembersManagementPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* Protected routes - admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]}><MainLayout /></ProtectedRoute>}>
          <Route path="/admin/packages" element={<AdminPackageManagement />} />
          <Route path="/admin/services" element={<AdminServiceManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;