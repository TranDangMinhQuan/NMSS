import React, { useState, useEffect } from 'react';
import type { Service, Package } from '../types';

const AdminPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  // Mock data for demo - using existing Package interface
  useEffect(() => {
    setTimeout(() => {
      setPackages([
        {
          package_id: '1',
          name: 'Gói Gym Premium',
          description: 'Gói tập gym cao cấp với đầy đủ tiện ích',
          duration: 3,
          min_amount: 400000,
          max_amount: 600000,
          allowed_days: '1/1/1/1/1/1/0', // Mon-Sat
          allowed_time_frame: '06:00-22:00',
          per_use_min_minutes: 30,
          per_use_max_minutes: 120,
          price: 500000
        },
        {
          package_id: '2',
          name: 'Gói Giải trí Combo',
          description: 'Gói giải trí kết hợp bowling và các hoạt động khác',
          duration: 1,
          min_amount: 250000,
          max_amount: 350000,
          allowed_days: '1/1/1/1/1/1/1', // All days
          allowed_time_frame: '10:00-23:00',
          per_use_min_minutes: 60,
          per_use_max_minutes: 180,
          price: 300000
        }
      ]);

      setServices([
        {
          service_id: '1',
          category_id: '1',
          name: 'Phòng Gym',
          description: 'Phòng tập thể dục hiện đại với đầy đủ thiết bị',
          price_per_unit: 200000,
          unit_type: 'month',
          status: 'active',
          category: {
            category_id: '1',
            center_id: '1',
            name: 'Thể thao',
            description: 'Các dịch vụ thể thao và fitness'
          }
        },
        {
          service_id: '2',
          category_id: '2',
          name: 'Bowling',
          description: 'Sân bowling chuyên nghiệp với 8 làn chơi',
          price_per_unit: 80000,
          unit_type: 'game',
          status: 'active',
          category: {
            category_id: '2',
            center_id: '1',
            name: 'Giải trí',
            description: 'Các dịch vụ giải trí và vui chơi'
          }
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleAddPackage = () => {
    setShowAddModal(true);
    setEditingPackage(null);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowAddModal(true);
  };

  const handleDeletePackage = (packageId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) {
      setPackages(packages.filter(p => p.package_id !== packageId));
    }
  };

  const handleSavePackage = (packageData: Partial<Package>) => {
    if (editingPackage) {
      // Update existing package
      setPackages(packages.map(p => 
        p.package_id === editingPackage.package_id 
          ? { ...p, ...packageData }
          : p
      ));
    } else {
      // Add new package
      const newPackage: Package = {
        package_id: Date.now().toString(),
        name: packageData.name || '',
        description: packageData.description || '',
        duration: packageData.duration || 1,
        min_amount: packageData.min_amount || 0,
        max_amount: packageData.max_amount || 0,
        allowed_days: packageData.allowed_days || '1/1/1/1/1/1/1',
        allowed_time_frame: packageData.allowed_time_frame || '08:00-18:00',
        per_use_min_minutes: packageData.per_use_min_minutes || 30,
        per_use_max_minutes: packageData.per_use_max_minutes || 120,
        price: packageData.price || 0
      };
      setPackages([...packages, newPackage]);
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
          {/* Show count of mock services to ensure the services variable is used in this component */}
          <p className="text-sm text-gray-500 mt-1">Danh sách dịch vụ hiện có: {services.length}</p>
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
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giới hạn giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sử dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giờ sử dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.package_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{pkg.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(pkg.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pkg.duration} tháng
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(pkg.min_amount)} - {formatPrice(pkg.max_amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatAllowedDays(pkg.allowed_days)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pkg.allowed_time_frame}
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
                        onClick={() => handleDeletePackage(pkg.package_id)}
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
  package: Package | null;
  onSave: (data: Partial<Package>) => void;
  onClose: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({ package: pkg, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    price: pkg?.price || 0,
    duration: pkg?.duration || 1,
    min_amount: pkg?.min_amount || 0,
    max_amount: pkg?.max_amount || 0,
    allowed_days: pkg?.allowed_days || '1/1/1/1/1/1/1',
    allowed_time_frame: pkg?.allowed_time_frame || '08:00-18:00',
    per_use_min_minutes: pkg?.per_use_min_minutes || 30,
    per_use_max_minutes: pkg?.per_use_max_minutes || 120
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDayToggle = (dayIndex: number) => {
    const days = formData.allowed_days.split('/');
    days[dayIndex] = days[dayIndex] === '1' ? '0' : '1';
    setFormData({ ...formData, allowed_days: days.join('/') });
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
              <label className="block text-sm font-medium text-gray-700">Tên gói dịch vụ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá gói (VNĐ)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Thời hạn (tháng)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({...formData, min_amount: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Giá tối đa (VNĐ)</label>
                <input
                  type="number"
                  value={formData.max_amount}
                  onChange={(e) => setFormData({...formData, max_amount: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày được phép sử dụng</label>
              <div className="mt-2 flex space-x-2">
                {dayLabels.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      formData.allowed_days.split('/')[index] === '1'
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
                <label className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
                <input
                  type="time"
                  value={formData.allowed_time_frame.split('-')[0]}
                  onChange={(e) => {
                    const endTime = formData.allowed_time_frame.split('-')[1];
                    setFormData({...formData, allowed_time_frame: `${e.target.value}-${endTime}`});
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
                <input
                  type="time"
                  value={formData.allowed_time_frame.split('-')[1]}
                  onChange={(e) => {
                    const startTime = formData.allowed_time_frame.split('-')[0];
                    setFormData({...formData, allowed_time_frame: `${startTime}-${e.target.value}`});
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian tối thiểu/lần (phút)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.per_use_min_minutes}
                  onChange={(e) => setFormData({...formData, per_use_min_minutes: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian tối đa/lần (phút)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.per_use_max_minutes}
                  onChange={(e) => setFormData({...formData, per_use_max_minutes: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

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
