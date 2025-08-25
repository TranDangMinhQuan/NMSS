export async function forgotPasswordRequest(email: string) {
    const response = await api.post('/api/forgot-password-request', { email });
    return response.data;
}

export async function resetPassword(token: string, newPassword: string) {
    const response = await api.post('/api/reset-password-request', { token, newPassword });
    return response.data as string;
}
export interface MemberProfile {
    fullName: string;
    email: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    cccd: string;
    phone: string;
    address: string;
    status: string;
}

export async function getMemberProfile() {
    // Backend profile endpoint is GET /api/account/view-profile
    const response = await api.get<MemberProfile>('/api/account/view-profile');
    return response.data;
}

export async function updateMemberProfile(data: Partial<MemberProfile>) {
    // Backend returns 200 with no body for this endpoint, so refetch profile afterwards
    await api.put<void>('/api/account/member/profile', data);
    const refreshed = await getMemberProfile();
    return refreshed;
}
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081', // Đổi lại thành địa chỉ backend thật
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Bearer token from saved user (if available)
api.interceptors.request.use((config) => {
    try {
        const raw = localStorage.getItem('nvh_user');
        if (raw) {
            const parsed = JSON.parse(raw);
            const token: string | undefined = parsed?.token;
            if (token) {
                config.headers = config.headers ?? {};
                (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            }
        }
    } catch {
        // ignore JSON errors, send without token
    }
    return config;
});

export async function login(email: string, password: string) {
    const response = await api.post('/api/login', { email, password });
    return response.data;
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
    cccd: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    phone: string;
    address: string;
}

export async function register(data: RegisterPayload) {
    const response = await api.post('/api/register', data);
    return response.data;
}

export default api;