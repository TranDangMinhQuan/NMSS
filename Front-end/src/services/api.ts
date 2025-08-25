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