import React, { useState, useEffect } from 'react';
import { getAllPackages, createPackage, updatePackage, deletePackage as apiDeletePackage, type ServicePackageDTO } from '../services/api';

const AdminPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackageDTO | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const data = await getAllPackages();
<<<<<<< HEAD
        console.log('[AdminPackageManagement] packages payload sample:', Array.isArray(data) ? data[0] : data);
=======
        // Debug: Inspect BE payload shape
        try {
          // eslint-disable-next-line no-console
          console.log('[AdminPackageManagement] packages payload sample:', Array.isArray(data) ? data[0] : data);
        } catch {
          // intentionally ignored
        }
>>>>>>> 6246b1f644d4aac29ff0901dc8f5c4419c1cb803
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        setError('Không thể tải dữ liệu gói dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddPackage = () => {
    setShowAddModal(true);
    setEditingPackage(null);
  };

  const handleEditPackage = (pkg: ServicePackageDTO) => {
    setEditingPackage(pkg);
    setShowAddModal(true);
  };

  const handleDeletePackage = async (packageId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) return;
    try {
      await apiDeletePackage(packageId);
      setPackages(packages.filter(p => p.id !== packageId));
    } catch (error) {
      console.error('Failed to delete package:', error);
      alert('Không thể xóa gói dịch vụ');
    }
  };

  const handleSavePackage = async (packageData: Partial<ServicePackageDTO>) => {
    try {
      console.log('=== PACKAGE SAVE DEBUG ===');
      console.log('🚀 Saving package data:', packageData);
      console.log('📝 Is editing:', !!editingPackage);
      
      if (editingPackage) {
        console.log('📡 Updating package ID:', editingPackage.id);
        const updated = await updatePackage(editingPackage.id, packageData);
        console.log('✅ Package updated successfully:', updated);
        setPackages(packages.map(p => p.id === editingPackage.id ? updated : p));
      } else {
        const createPayload = {
          name: packageData.name || '',
          minPrice: packageData.minPrice || 0,
          maxPrice: packageData.maxPrice || 0,
          totalSessions: packageData.totalSessions || 0,
          allowedDays: packageData.allowedDays || [],
          maxDurationMinutes: packageData.maxDurationMinutes || 0,
          serviceIds: packageData.serviceIds || []
        };
        
        console.log('📡 Creating new package with payload:', createPayload);
        const created = await createPackage(createPayload);
        console.log('✅ Package created successfully:', created);
        setPackages([...packages, created]);
      }
      setShowAddModal(false);
      setEditingPackage(null);
    } catch (error: any) {
      console.error('❌ Failed to save package:', error);
      
      let errorMessage = 'Không thể lưu gói dịch vụ';
      if (error.response?.status === 500) {
        errorMessage = 'Lỗi máy chủ nội bộ. Vui lòng kiểm tra dữ liệu đầu vào.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ: ' + (error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin');
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này';
      } else if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn';
      }
      
      alert(errorMessage);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const formatAllowedDays = (allowedDays: string[]) => {
    if (!allowedDays || allowedDays.length === 0) return 'Không có dữ liệu';
    
    const dayMapping: { [key: string]: string } = {
      'MONDAY': 'T2',
      'TUESDAY': 'T3', 
      'WEDNESDAY': 'T4',
      'THURSDAY': 'T5',
      'FRIDAY': 'T6',
      'SATURDAY': 'T7',
      'SUNDAY': 'CN'
    };
    
    return allowedDays.map(day => dayMapping[day] || day).join(', ');
  };

  const parseBoolean = (val: unknown): boolean | undefined => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') {
      const v = val.trim().toLowerCase();
      if (v === 'true' || v === '1' || v === 'yes') return true;
      if (v === 'false' || v === '0' || v === 'no') return false;
    }
    return undefined;
  };

<<<<<<< HEAD
  const getAllowedDays = (pkg: any): string[] => pkg?.allowedDays ?? [];
  const getStatus = (pkg: any): boolean => {
    const val = pkg?.status ?? pkg?.is_active ?? pkg?.active;
=======
  const parseNumber = (val: unknown): number | undefined => {
    if (typeof val === 'number') return Number.isFinite(val) ? val : undefined;
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };

  const getDayConstraints = (pkg: ServicePackageDTO): string => pkg?.dayConstraints ?? (pkg as ServicePackageDTO & { day_constraints?: string })?.day_constraints ?? '';
  const getMaxUsesPerDay = (pkg: ServicePackageDTO): number | undefined => {
    const val = (pkg as ServicePackageDTO & { max_uses_per_day?: unknown })?.maxUsesPerDay ?? (pkg as Partial<ServicePackageDTO> & { max_uses_per_day?: unknown })?.max_uses_per_day;
    return parseNumber(val);
  };
  const getStatus = (pkg: ServicePackageDTO): boolean => {
    const val = (pkg as ServicePackageDTO & { is_active?: unknown; active?: unknown }).status 
      ?? (pkg as Partial<ServicePackageDTO> & { is_active?: unknown }).is_active 
      ?? (pkg as Partial<ServicePackageDTO> & { active?: unknown }).active;
>>>>>>> 6246b1f644d4aac29ff0901dc8f5c4419c1cb803
    const parsed = parseBoolean(val);
    return parsed ?? true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu gói dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Quản lý Gói Dịch vụ
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Tạo và quản lý các gói dịch vụ</p>
              </div>
              <button
                onClick={handleAddPackage}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="relative flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Thêm Gói Mới</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">Lỗi tải dữ liệu</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating background shapes */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-blue-400 bg-opacity-20 rounded-full blur-2xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-40 h-40 bg-purple-400 bg-opacity-20 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Quản lý Gói Dịch vụ
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Tạo và quản lý các gói dịch vụ cho thành viên</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Tổng gói: {packages.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Gói hoạt động: {packages.filter(p => getStatus(p)).length}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddPackage}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm Gói Mới</span>
              </div>
            </button>
          </div>
        </div>

        {/* Packages Grid - Modern Card Layout */}
        {packages.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có gói dịch vụ nào</h3>
            <p className="text-gray-600 mb-6">Tạo gói dịch vụ đầu tiên để bắt đầu quản lý</p>
            <button
              onClick={handleAddPackage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Tạo Gói Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getStatus(pkg) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getStatus(pkg) ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Khoảng giá:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(pkg.minPrice)} - {formatPrice(pkg.maxPrice)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số buổi:</span>
                    <span className="font-semibold text-gray-900">{pkg.totalSessions} buổi</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thời lượng/buổi:</span>
                    <span className="font-semibold text-gray-900">{pkg.maxDurationMinutes} phút</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Ngày sử dụng:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {formatAllowedDays(getAllowedDays(pkg)).split(', ').map((day, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <PackageModal
          package={editingPackage}
          onSave={handleSavePackage}
          onClose={() => {
            setShowAddModal(false);
            setEditingPackage(null);
          }}
        />
      )}
    </div>
  );
};

// Package Modal Component
interface PackageModalProps {
  package: ServicePackageDTO | null;
  onSave: (data: Partial<ServicePackageDTO>) => void;
  onClose: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({ package: pkg, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    minPrice: pkg?.minPrice || 0,
    maxPrice: pkg?.maxPrice || 0,
    totalSessions: pkg?.totalSessions || 0,
    allowedDays: pkg?.allowedDays || [],
    maxDurationMinutes: pkg?.maxDurationMinutes || 0,
    status: pkg?.status ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDayToggle = (dayName: string) => {
    const currentDays = [...formData.allowedDays];
    const dayIndex = currentDays.indexOf(dayName);
    
    if (dayIndex > -1) {
      currentDays.splice(dayIndex, 1);
    } else {
      currentDays.push(dayName);
    }
    
    setFormData({ ...formData, allowedDays: currentDays });
  };

  const dayLabels = [
    { label: 'T2', value: 'MONDAY' },
    { label: 'T3', value: 'TUESDAY' },
    { label: 'T4', value: 'WEDNESDAY' },
    { label: 'T5', value: 'THURSDAY' },
    { label: 'T6', value: 'FRIDAY' },
    { label: 'T7', value: 'SATURDAY' },
    { label: 'CN', value: 'SUNDAY' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {pkg ? 'Sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="packageName" className="block text-sm font-semibold text-gray-700 mb-2">
                Tên gói dịch vụ
              </label>
              <input
                id="packageName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nhập tên gói dịch vụ"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá tối thiểu (VNĐ)
                </label>
                <input
                  id="minPrice"
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({...formData, minPrice: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá tối đa (VNĐ)
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({...formData, maxPrice: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalSessions" className="block text-sm font-semibold text-gray-700 mb-2">
                  Số buổi
                </label>
                <input
                  id="totalSessions"
                  type="number"
                  value={formData.totalSessions}
                  onChange={(e) => setFormData({...formData, totalSessions: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxDurationMinutes" className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời lượng tối đa/buổi (phút)
                </label>
                <input
                  id="maxDurationMinutes"
                  type="number"
                  value={formData.maxDurationMinutes}
                  onChange={(e) => setFormData({...formData, maxDurationMinutes: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ngày được phép sử dụng
              </label>
              <div className="flex flex-wrap gap-3">
                {dayLabels.map((dayObj) => (
                  <button
                    key={dayObj.value}
                    type="button"
                    onClick={() => handleDayToggle(dayObj.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      formData.allowedDays.includes(dayObj.value)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dayObj.label}
                  </button>
                ))}
              </div>
              {formData.allowedDays.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-blue-800">
                    Đã chọn: {formData.allowedDays.map(day => dayLabels.find(d => d.value === day)?.label).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {pkg && (
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  id="status"
                  value={String(formData.status)}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Ngừng hoạt động</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all"
              >
                {pkg ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPackageManagement;
