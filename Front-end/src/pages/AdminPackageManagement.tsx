import React, { useState, useEffect } from 'react';
import { getAllPackages, createPackage, updatePackage, deletePackage as apiDeletePackage, type ServicePackageDTO } from '../services/api';

const AdminPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackageDTO | null>(null);

  // ...existing code...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPackages();
        // Debug: Inspect BE payload shape
        try {
          // eslint-disable-next-line no-console
          console.log('[AdminPackageManagement] packages payload sample:', Array.isArray(data) ? data[0] : data);
        } catch {
          // intentionally ignored
        }
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
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
    await apiDeletePackage(packageId);
    setPackages(packages.filter(p => p.id !== packageId));
  };

  const handleSavePackage = async (packageData: Partial<ServicePackageDTO>) => {
    if (editingPackage) {
      const updated = await updatePackage(editingPackage.id, packageData);
      setPackages(packages.map(p => p.id === editingPackage.id ? updated : p));
    } else {
      const created = await createPackage({
        name: packageData.name || '',
        minPrice: packageData.minPrice || 0,
        maxPrice: packageData.maxPrice || 0,
        totalSessions: packageData.totalSessions || 0,
        dayConstraints: packageData.dayConstraints || '1/1/1/1/1/1/1',
        maxDurationMinutes: packageData.maxDurationMinutes || 0,
        serviceIds: packageData.serviceIds || []
      });
      setPackages([...packages, created]);
    }
    setShowAddModal(false);
    setEditingPackage(null);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const formatAllowedDays = (allowedDays: string) => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const dayArray = allowedDays.split('/');
    return dayArray.map((day, index) => day === '1' ? days[index] : '').filter(day => day).join(', ');
  };

  // Resilient accessors to support camelCase or snake_case and flexible value types
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
    const parsed = parseBoolean(val);
    // BE list endpoint returns only active packages; when field absent, assume active
    return parsed ?? true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Gói Dịch vụ</h1>
          <p className="text-gray-600 mt-2">Quản lý các gói dịch vụ và combo cho khách hàng</p>
          {/* ...existing code... */}
          <p className="text-sm text-gray-500 mt-1">Tổng số gói: {packages.length}</p>
        </div>
        <button
          onClick={handleAddPackage}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Thêm gói dịch vụ</span>
        </button>
      </div>

      {/* Packages Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên gói
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khoảng giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số buổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sử dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời lượng tối đa/buổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tối đa/ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                      {/* BE DTO does not include description */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(pkg.minPrice)} - {formatPrice(pkg.maxPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pkg.totalSessions}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatAllowedDays(getDayConstraints(pkg))}
                    </div>
                  </td>
                  {/* removed legacy allowed_time_frame/allowed_days */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pkg.maxDurationMinutes} phút
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getMaxUsesPerDay(pkg) ?? '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getStatus(pkg) ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    dayConstraints: pkg?.dayConstraints || '1/1/1/1/1/1/1',
    maxDurationMinutes: pkg?.maxDurationMinutes || 0,
    status: pkg?.status ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDayToggle = (dayIndex: number) => {
    const days = formData.dayConstraints.split('/');
    days[dayIndex] = days[dayIndex] === '1' ? '0' : '1';
    setFormData({ ...formData, dayConstraints: days.join('/') });
  };

  const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {pkg ? 'Sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">Tên gói dịch vụ</label>
              <input
                id="packageName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {/* BE DTO does not include description */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Giá tối thiểu (VNĐ)</label>
                <input
                  id="minPrice"
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({...formData, minPrice: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Giá tối đa (VNĐ)</label>
                <input
                  id="maxPrice"
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({...formData, maxPrice: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalSessions" className="block text-sm font-medium text-gray-700">Số buổi</label>
                <input
                  id="totalSessions"
                  type="number"
                  value={formData.totalSessions}
                  onChange={(e) => setFormData({...formData, totalSessions: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxDurationMinutes" className="block text-sm font-medium text-gray-700">Thời lượng tối đa/buổi (phút)</label>
                <input
                  id="maxDurationMinutes"
                  type="number"
                  value={formData.maxDurationMinutes}
                  onChange={(e) => setFormData({...formData, maxDurationMinutes: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="allowedDays" className="block text-sm font-medium text-gray-700">Ngày được phép sử dụng</label>
              <div className="mt-2 flex space-x-2">
                {dayLabels.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      formData.dayConstraints.split('/')[index] === '1'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="allowedDaysDisplay" className="block text-sm font-medium text-gray-700">Ngày được phép (hiển thị)</label>
                <input
                  id="allowedDaysDisplay"
                  type="text"
                  value={formData.dayConstraints}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Per-use min/max minutes not in BE DTO */}
            </div>

            {pkg && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  id="status"
                  value={String(formData.status)}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Ngừng hoạt động</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
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
