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

export interface AccountUpdateDTO {
    fullName: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    phone: string;
    address: string;
}

export interface AccountProfileDTO {
    fullName: string;
    email: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    cccd: string;
    phone: string;
    address: string;
}

export async function getAccountsByRole(role: RoleEnum) {
    const response = await api.get<AccountResponse[]>(`/api/account/list-account/${role}`);
    return response.data;
}

export async function updateAdminAccount(data: AccountUpdateDTO) {
    const response = await api.put(`/api/account/manager/profile`, data);
    return response.data;
}

export async function deleteAdminAccount(id: number) {
    const response = await api.put(`/api/account/admin/delete/${id}/INACTIVE`);
    return response.data;
}

export async function getMembers() {
    const response = await api.get<AccountResponse[]>(`/api/account/list-account/member`);
    return response.data;
}

export async function updateMemberProfile(data: AccountProfileDTO) {
    // Debug logging
    console.log('=== UPDATE MEMBER PROFILE DEBUG ===');
    console.log('Request URL:', `${api.defaults.baseURL}/api/account/member/profile`);
    console.log('Request Method:', 'PUT');
    console.log('Request Data:', JSON.stringify(data, null, 2));
    
    // Check token
    const savedUser = localStorage.getItem('nvh_user');
    let currentUser = null;
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('Current User:', {
            email: currentUser.email,
            role: currentUser.role,
            hasToken: !!currentUser.token,
            tokenPreview: currentUser.token ? `${currentUser.token.substring(0, 20)}...` : 'No token'
        });
    } else {
        console.log('No user found in localStorage');
    }
    
    try {
        const response = await api.put(`/api/account/member/profile`, data);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        console.log('Response Headers:', response.headers);
        
        // Validate response
        if (response.status === 200 || response.status === 204) {
            console.log('✅ Member profile update successful');
        } else {
            console.warn('⚠️ Unexpected response status:', response.status);
        }
        return response.data;
    } catch (error: any) {
        console.log('=== API ERROR DEBUG ===');
        console.log('Error Status:', error.response?.status);
        console.log('Error Data:', error.response?.data);
        console.log('Error Headers:', error.response?.headers);
        console.log('Request Headers:', error.config?.headers);
        
        // If member endpoint fails with 500/403, try manager endpoint for ADMIN/STAFF users
        const normalizedRole = currentUser?.role?.toUpperCase();
        if ((error.response?.status === 500 || error.response?.status === 403) && 
            currentUser && (normalizedRole === 'ADMIN' || normalizedRole === 'STAFF')) {
            console.log('=== TRYING ALTERNATIVE ENDPOINT FOR ADMIN/STAFF ===');
            try {
                // Convert AccountProfileDTO to AccountUpdateDTO for manager endpoint
                const managerData = {
                    fullName: data.fullName,
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth,
                    phone: data.phone,
                    address: data.address
                };
                console.log('Using manager endpoint with data:', managerData);
                const response = await api.put(`/api/account/manager/profile`, managerData);
                console.log('Manager endpoint success:', response.status);
                return response.data;
            } catch (managerError: any) {
                console.log('Manager endpoint also failed:', managerError.response?.status);
                // Throw original error
                throw error;
            }
        }
        
        throw error;
    }
}

export async function deleteMemberAccount(id: number) {
    const response = await api.put(`/api/account/staff/delete/${id}/INACTIVE`);
    return response.data;
}

export async function updateStaffAccount(data: AccountUpdateDTO) {
    const response = await api.put(`/api/account/manager/profile`, data);
    return response.data;
}

export async function deleteStaffAccount(id: number) {
    const response = await api.put(`/api/account/admin/delete/${id}/INACTIVE`);
    return response.data;
}

// Account Create DTO type
export interface AccountCreateDTO {
    subject: string;
    emailOwner: string;
    email: string;
    password: string;
    cccd: string; // lowercase to match backend expectation
    fullName: string;
    gender: 'MALE' | 'FEMALE';
    role: 'STAFF' | 'MEMBER';
    bloodTypeId: number;
    dateOfBirth: string; // yyyy-mm-dd format
    phone: string;
    address: string;
}

export async function createAccount(data: AccountCreateDTO) {
    console.log('=== CREATE ACCOUNT DEBUG ===');
    console.log('Request URL:', `${api.defaults.baseURL}/api/account/admin/create`);
    console.log('Request Data:', JSON.stringify(data, null, 2));
    
    try {
        const response = await api.post('/api/account/admin/create', data);
        console.log('✅ Account created successfully:', response.status);
        return response.data;
    } catch (error: any) {
        console.log('=== CREATE ACCOUNT ERROR ===');
        console.log('Error Status:', error.response?.status);
        console.log('Error Data:', error.response?.data);
        throw error;
    }
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