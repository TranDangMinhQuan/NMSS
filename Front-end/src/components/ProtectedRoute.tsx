import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu role không hợp lệ, chuyển hướng về route mặc định theo role
  if (!allowedRoles.includes(user.role)) {
    let redirect = "/";
    if (user.role === "admin") redirect = "/dashboard";
    else if (user.role === "member") redirect = "/services";
    else if (user.role === "staff") redirect = "/members";
    return <Navigate to={redirect} replace />;
  }

  // Nếu hợp lệ, render children
  return <>{children}</>;
};

export default ProtectedRoute;
