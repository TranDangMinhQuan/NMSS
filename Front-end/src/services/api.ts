import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081', // Đổi lại thành địa chỉ backend thật
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header from localStorage token
api.interceptors.request.use((config) => {
    try {
        const savedUser = localStorage.getItem('nvh_user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user?.token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${user.token}`;
            }
        }
    } catch {}
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

// ================= Admin Data Fetching (aligned with BE DTOs) =================

export interface ServiceTypeDTO {
    id: number;
    name: string;
    description: string;
    centerId: number;
    status: boolean;
}

export async function getServiceTypesByCenter(centerId: number) {
    const response = await api.get<ServiceTypeDTO[]>(`/api/service-types/center/${centerId}`);
    return response.data;
}

export async function createServiceType(payload: Partial<ServiceTypeDTO>) {
    const response = await api.post<ServiceTypeDTO>(`/api/service-types`, payload);
    return response.data;
}

export async function updateServiceType(id: number, payload: Partial<ServiceTypeDTO>) {
    const response = await api.put<ServiceTypeDTO>(`/api/service-types/${id}`, payload);
    return response.data;
}

export async function deleteServiceType(id: number) {
    await api.delete(`/api/service-types/${id}`);
}

export interface ServicePackageDTO {
    id: number;
    name: string;
    minPrice: number;
    maxPrice: number;
    totalSessions: number;
    dayConstraints: string;
    maxDurationMinutes: number;
    maxUsesPerDay?: number;
    status?: boolean;
    serviceIds: number[];
}

export async function getAllPackages() {
    const response = await api.get<ServicePackageDTO[]>(`/api/packages`);
    return response.data;
}

export async function createPackage(payload: Partial<ServicePackageDTO>) {
    const response = await api.post<ServicePackageDTO>(`/api/packages`, payload);
    return response.data;
}

export async function updatePackage(id: number, payload: Partial<ServicePackageDTO>) {
    const response = await api.put<ServicePackageDTO>(`/api/packages/${id}`, payload);
    return response.data;
}

export async function deletePackage(id: number) {
    await api.delete(`/api/packages/${id}`);
}

export type RoleEnum = 'ADMIN' | 'STAFF' | 'MEMBER';
export type StatusEnum = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface AccountResponse {
    id: number;
    email: string;
    role: RoleEnum;
    fullName: string;
    gender?: 'MALE' | 'FEMALE';
    dateOfBirth?: string;
    phone?: string;
    address?: string;
    createAt: string;
    status: StatusEnum;
    token?: string;
}

export async function getAccountsByRole(role: RoleEnum) {
    const response = await api.get<AccountResponse[]>(`/api/account/list-account/${role}`);
    return response.data;
}

export default api;