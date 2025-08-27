import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminAccountsPage from '../pages/AdminAccountsPage';
import StaffAccountsPage from '../pages/StaffAccountsPage';
import MemberAccountsPage from '../pages/MemberAccountsPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';

const AppRouter: React.FC = () => {
    return (
        <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/accounts/admin" element={<AdminAccountsPage />} />
          <Route path="/accounts/staff" element={<StaffAccountsPage />} />
          <Route path="/accounts/member" element={<MemberAccountsPage />} />
        </Route>
      </Routes>
    </Router>

    );
};

export default AppRouter;