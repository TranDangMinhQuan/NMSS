import React, { useState, useEffect } from 'react';
import { getServiceTypesByCenter, createServiceType, updateServiceType, deleteServiceType as apiDeleteServiceType, getAllCenters, type ServiceTypeDTO, type CenterDTO } from '../services/api';

const AdminServiceManagement: React.FC = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeDTO[]>([]);
  const [centers, setCenters] = useState<CenterDTO[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceTypeDTO | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== ADMIN SERVICE MANAGEMENT DEBUG ===');
        console.log('🚀 Starting to fetch centers and service types...');
        
        // Check authentication
        const savedUser = localStorage.getItem('nvh_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          console.log('👤 Current user:', {
            email: user.email,
            role: user.role,
            hasToken: !!user.token
          });
        } else {
          console.warn('⚠️ No user found in localStorage');
        }
        
        setError(null);
        
        // Fetch centers first
        console.log('📡 Fetching centers...');
        const centersData = await getAllCenters();
        console.log('✅ Centers fetched:', centersData);
        setCenters(centersData);
        
        // Use first center if available, otherwise default to 1
        const centerIdToUse = centersData.length > 0 ? centersData[0].id : 1;
        setSelectedCenterId(centerIdToUse);
        
        // Fetch service types for selected center
        console.log(`📡 Fetching service types for center ${centerIdToUse}...`);
        const serviceData = await getServiceTypesByCenter(centerIdToUse);
        console.log('✅ Service types fetched successfully:', {
          count: serviceData.length,
          sample: serviceData[0] || 'No data'
        });
        setServiceTypes(serviceData);
      } catch (error: any) {
        console.error('❌ Failed to fetch data:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        let errorMessage = 'Không thể tải dữ liệu';
        if (error.response?.status === 404) {
          errorMessage = 'Không tìm thấy dữ liệu cho trung tâm này';
        } else if (error.response?.status === 403) {
          errorMessage = 'Bạn không có quyền truy cập dữ liệu này';
        } else if (error.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn';
        }
        
        setError(errorMessage);
        setServiceTypes([]);
        setCenters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCenterChange = async (centerId: number) => {
    setSelectedCenterId(centerId);
    setLoading(true);
    try {
      console.log(`📡 Switching to center ${centerId}...`);
      const serviceData = await getServiceTypesByCenter(centerId);
      console.log('✅ Service types fetched for new center:', serviceData);
      setServiceTypes(serviceData);
      setError(null);
    } catch (error: any) {
      console.error('❌ Failed to fetch service types for center:', error);
      setError('Không thể tải dịch vụ cho trung tâm này');
      setServiceTypes([]);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      console.log('=== SERVICE SAVE DEBUG ===');
      console.log('🚀 Saving service data:', serviceData);
      console.log('📝 Is editing:', !!editingService);
      
      if (editingService) {
        console.log('📡 Updating service ID:', editingService.id);
        const updated = await updateServiceType(editingService.id, serviceData);
        console.log('✅ Service updated successfully:', updated);
        setServiceTypes(serviceTypes.map(s => s.id === editingService.id ? updated : s));
      } else {
        const createPayload = {
          name: serviceData.name || '',
          centerId: serviceData.centerId || selectedCenterId
        };
        
        console.log('📡 Creating new service with payload:', createPayload);
        const created = await createServiceType(createPayload);
        console.log('✅ Service created successfully:', created);
        setServiceTypes([...serviceTypes, created]);
      }
      setShowAddModal(false);
      setEditingService(null);
    } catch (error: any) {
      console.error('❌ Failed to save service:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Không thể lưu dịch vụ';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="ml-4 text-gray-600">Đang tải dữ liệu dịch vụ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Dịch vụ</h1>
          <button
            onClick={handleAddService}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm Dịch vụ
          </button>
        </div>

        {/* Center Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Trung tâm:
          </label>
          <select
            value={selectedCenterId}
            onChange={(e) => handleCenterChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name} - {center.address}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Thử lại
          </button>
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
                Quản lý Dịch vụ
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Tạo và quản lý các loại dịch vụ cho từng trung tâm</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Tổng dịch vụ: {serviceTypes.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Trung tâm: {centers.find(c => c.id === selectedCenterId)?.name || 'Đang tải...'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddService}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm Dịch vụ Mới</span>
              </div>
            </button>
          </div>
        </div>

        {/* Center Selector Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Chọn Trung Tâm</h3>
              <p className="text-gray-600">Lọc dịch vụ theo từng trung tâm cụ thể</p>
            </div>
          </div>
          <select
            value={selectedCenterId}
            onChange={(e) => handleCenterChange(Number(e.target.value))}
            className="w-full lg:w-auto min-w-80 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                🏢 {center.name} - {center.address}
              </option>
            ))}
          </select>
        </div>

        {/* Modern Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTypes.map((service) => (
            <div key={service.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">ID: {service.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
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
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Trung tâm:</strong> {centers.find(c => c.id === service.centerId)?.name || `ID: ${service.centerId}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <strong>Địa chỉ:</strong> {centers.find(c => c.id === service.centerId)?.address || 'Đang tải...'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Được tạo cho trung tâm</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {serviceTypes.length === 0 && (
            <div className="col-span-full">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có dịch vụ nào</h3>
                <p className="text-gray-500 mb-6">Thêm dịch vụ đầu tiên cho trung tâm này</p>
                <button
                  onClick={handleAddService}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm dịch vụ đầu tiên
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <ServiceModal
            service={editingService}
            selectedCenter={centers.find(c => c.id === selectedCenterId) || null}
            centers={centers}
            onSave={handleSaveService}
            onClose={() => {
              setShowAddModal(false);
              setEditingService(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Service Modal Component (align with ServiceTypeDTO)
interface ServiceModalProps {
  service: ServiceTypeDTO | null;
  selectedCenter: CenterDTO | null;
  centers: CenterDTO[];
  onSave: (data: Partial<ServiceTypeDTO>) => void;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, selectedCenter, centers, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    centerId: selectedCenter?.id || (centers.length > 0 ? centers[0].id : 1)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-auto">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h3>
              <p className="text-gray-600">Tạo hoặc cập nhật thông tin dịch vụ</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên dịch vụ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                required
                placeholder="Ví dụ: Fitness, Yoga, Swimming..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn Trung tâm</label>
              <select
                value={formData.centerId}
                onChange={(e) => setFormData({...formData, centerId: Number(e.target.value)})}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                required
              >
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    🏢 {center.name} - {center.address}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Chọn trung tâm mà dịch vụ này sẽ thuộc về
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Dịch vụ sẽ được tạo cho trung tâm đã chọn và có thể được sử dụng ngay lập tức.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {service ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceManagement;
