import React, { useState, useEffect } from 'react';
import type { Service, ServiceCategory } from '../types';

const AdminServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Mock data for demo
  useEffect(() => {
    setTimeout(() => {
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

      setCategories([
        {
          category_id: '1',
          center_id: '1',
          name: 'Thể thao',
          description: 'Các dịch vụ thể thao và fitness'
        },
        {
          category_id: '2',
          center_id: '1',
          name: 'Giải trí',
          description: 'Các dịch vụ giải trí và vui chơi'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleAddService = () => {
    setShowAddModal(true);
    setEditingService(null);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      setServices(services.filter(s => s.service_id !== serviceId));
    }
  };

  const handleSaveService = (serviceData: Partial<Service>) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.service_id === editingService.service_id 
          ? { ...s, ...serviceData }
          : s
      ));
    } else {
      // Add new service
      const newService: Service = {
        service_id: Date.now().toString(),
        category_id: serviceData.category_id || '1',
        name: serviceData.name || '',
        description: serviceData.description || '',
        price_per_unit: serviceData.price_per_unit || 0,
        unit_type: serviceData.unit_type || 'hour',
        status: 'active',
        category: categories.find(c => c.category_id === serviceData.category_id)
      };
      setServices([...services, newService]);
    }
    setShowAddModal(false);
    setEditingService(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
          <p className="text-gray-600 mt-2">Quản lý danh sách dịch vụ và cập nhật thông tin</p>
        </div>
        <button
          onClick={handleAddService}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Thêm dịch vụ</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
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
              {services.map((service) => (
                <tr key={service.service_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.category?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {service.price_per_unit.toLocaleString()} VNĐ/{service.unit_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.service_id)}
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
        <ServiceModal
          service={editingService}
          categories={categories}
          onSave={handleSaveService}
          onClose={() => {
            setShowAddModal(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
};

// Service Modal Component
interface ServiceModalProps {
  service: Service | null;
  categories: ServiceCategory[];
  onSave: (data: Partial<Service>) => void;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category_id: service?.category_id || '',
    price_per_unit: service?.price_per_unit || 0,
    unit_type: service?.unit_type || 'hour',
    status: service?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {service ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Danh mục</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                <label className="block text-sm font-medium text-gray-700">Giá</label>
                <input
                  type="number"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData({...formData, price_per_unit: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
                <select
                  value={formData.unit_type}
                  onChange={(e) => setFormData({...formData, unit_type: e.target.value as 'hour' | 'session' | 'game'})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="hour">Giờ</option>
                  <option value="session">Buổi</option>
                  <option value="game">Ván</option>
                  <option value="month">Tháng</option>
                </select>
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
                {service ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceManagement;
