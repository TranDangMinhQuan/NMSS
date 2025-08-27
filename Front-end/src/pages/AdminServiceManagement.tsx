import React, { useState, useEffect } from 'react';
import { getServiceTypesByCenter, createServiceType, updateServiceType, deleteServiceType as apiDeleteServiceType, type ServiceTypeDTO } from '../services/api';

const AdminServiceManagement: React.FC = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceTypeDTO | null>(null);

  // ...existing code...
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: replace 1 with selected/active center id when available
        const data = await getServiceTypesByCenter(1);
        setServiceTypes(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddService = () => {
    setShowAddModal(true);
    setEditingService(null);
  };

  const handleEditService = (service: ServiceTypeDTO) => {
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;
    await apiDeleteServiceType(serviceId);
    setServiceTypes(serviceTypes.filter(s => s.id !== serviceId));
  };

  const handleSaveService = async (serviceData: Partial<ServiceTypeDTO>) => {
    if (editingService) {
      const updated = await updateServiceType(editingService.id, serviceData);
      setServiceTypes(serviceTypes.map(s => s.id === editingService.id ? updated : s));
    } else {
      const created = await createServiceType({
        name: serviceData.name || '',
        description: serviceData.description || '',
        centerId: 1,
        status: serviceData.status ?? true
      });
      setServiceTypes([...serviceTypes, created]);
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

      {/* Service Types Table (BE: ServiceTypeDTO) */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên loại dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
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
              {serviceTypes.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status ? 'Hoạt động' : 'Không hoạt động'}
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
                        onClick={() => handleDeleteService(service.id)}
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

// Service Modal Component (align with ServiceTypeDTO)
interface ServiceModalProps {
  service: ServiceTypeDTO | null;
  onSave: (data: Partial<ServiceTypeDTO>) => void;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    status: service?.status ?? true
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
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {service && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
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
