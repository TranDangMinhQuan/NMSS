import { useState, useEffect } from 'react';
import type { Account } from '../types';
import { login as apiLogin } from '../services/api';

const useAuth = () => {
    const [user, setUser] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('nvh_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('nvh_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await apiLogin(credentials.email, credentials.password);
            setUser(userData);
            localStorage.setItem('nvh_user', JSON.stringify(userData));
            setLoading(false);
            return userData;
        } catch (err) {
            const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(errorMsg || 'Tên đăng nhập hoặc mật khẩu không đúng');
            setLoading(false);
            return undefined;
        }
    };

    // ...existing code...

    const logout = () => {
        setUser(null);
        // Remove user from localStorage
        localStorage.removeItem('nvh_user');
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
    };
};

export { useAuth };