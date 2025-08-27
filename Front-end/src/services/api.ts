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
  } catch {
    // Ignore errors reading/parsing localStorage token
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

export interface DashboardStatsDTO {
  totalMembers: number;
  activeMemberships: number;
  pendingBookings: number;
  completedBookings: number;
  activePackages: number;
}

// Account API
export const getAllAccounts = async (): Promise<AccountResponse[]> => {
  try {
    // Backend has /api/account/list-account/{role} endpoints
    // We'll get all roles: ADMIN, STAFF, MEMBER
    const [adminAccounts, staffAccounts, memberAccounts] = await Promise.all([
      api.get('/api/account/list-account/ADMIN'),
      api.get('/api/account/list-account/STAFF'),
      api.get('/api/account/list-account/MEMBER'),
    ]);
    
    // Combine all accounts
    const allAccounts = [
      ...adminAccounts.data,
      ...staffAccounts.data,
      ...memberAccounts.data,
    ];
    
    console.log('[DEBUG] 📊 All accounts by role:', {
      admin: adminAccounts.data.length,
      staff: staffAccounts.data.length,
      member: memberAccounts.data.length,
      total: allAccounts.length
    });
    
    return allAccounts;
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return [];
  }
};

// Service Order API
export const getAllOrders = async (): Promise<ServiceOrderResponseDTO[]> => {
  try {
    const response = await api.get('/api/service-orders');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
};

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStatsDTO> => {
  try {
    console.log('[DEBUG] 🚀 Starting dashboard stats calculation...');
    
    // Get data from existing backend APIs
    console.log('[DEBUG] 📡 Calling getAllAccounts()...');
    const accounts = await getAllAccounts();
    console.log('[DEBUG] 📊 Accounts received:', accounts);
    console.log('[DEBUG] 📊 Accounts count:', accounts.length);
    
    console.log('[DEBUG] 📡 Calling getAllPackages()...');
    const packages = await getAllPackages();
    console.log('[DEBUG] 📦 Packages received:', packages);
    console.log('[DEBUG] 📦 Packages count:', packages.length);
    
    console.log('[DEBUG] 📡 Calling getAllOrders()...');
    const orders = await getAllOrders();
    console.log('[DEBUG] 📋 Orders received:', orders);
    console.log('[DEBUG] 📋 Orders count:', orders.length);
    
    console.log('[DEBUG] 🔍 Raw data summary:', { 
      accountsCount: accounts.length, 
      packagesCount: packages.length, 
      ordersCount: orders.length 
    });
    
    // Calculate real statistics
    const totalMembers = accounts.filter((acc: AccountResponse) => acc.role === 'MEMBER').length;
    const activeMemberships = accounts.filter((acc: AccountResponse) => acc.role === 'MEMBER' && acc.status === 'ACTIVE').length;
    const pendingBookings = orders.filter((order: ServiceOrderResponseDTO) => order.status === 'PENDING').length;
    const completedBookings = orders.filter((order: ServiceOrderResponseDTO) => order.status === 'COMPLETED').length;
    const activePackages = packages.filter((pkg: ServicePackageDTO) => pkg.status === true).length;
    
    const stats = {
      totalMembers,
      activeMemberships,
      pendingBookings,
      completedBookings,
      activePackages,
    };
    
    console.log('[DEBUG] 🧮 Calculated stats:', stats);
    console.log('[DEBUG] 🧮 Calculation details:', {
      totalMembers: `${totalMembers} (filtered from ${accounts.length} accounts)`,
      activeMemberships: `${activeMemberships} (filtered from ${accounts.length} accounts)`,
      pendingBookings: `${pendingBookings} (filtered from ${orders.length} orders)`,
      completedBookings: `${completedBookings} (filtered from ${orders.length} orders)`,
      activePackages: `${activePackages} (filtered from ${packages.length} packages)`,
    });
    
    return stats;
    
  } catch (error) {
    console.error('[ERROR] ❌ Failed to fetch dashboard stats:', error);
    // Return default values if API fails
    return {
      totalMembers: 0,
      activeMemberships: 0,
      pendingBookings: 0,
      completedBookings: 0,
      activePackages: 0,
    };
  }
};

export interface ServiceOrderResponseDTO {
  id: number;
  memberId: number;
  packageId: number;
  serviceTypeId: number;
  startTime: string;
  endTime: string;
  status: string;
}

export default api;