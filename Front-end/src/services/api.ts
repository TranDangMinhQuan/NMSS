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
    const response = await api.get<MemberProfile>('/api/account/member/profile');
    return response.data;
}

export async function updateMemberProfile(data: Partial<MemberProfile>) {
    const response = await api.put<MemberProfile>('/api/account/member/profile', data);
    return response.data;
}
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081', // Đổi lại thành địa chỉ backend thật
    headers: {
        'Content-Type': 'application/json',
    },
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