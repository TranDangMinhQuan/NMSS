import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'gym', name: 'Phòng Gym' },
    { id: 'bowling', name: 'Bowling' },
  ];

  const services = [
    {
      id: 'gym',
      name: 'Phòng Gym',
      category: 'gym',
      description: 'Phòng gym hiện đại, trang bị đầy đủ thiết bị, không gian thoải mái, mở cửa từ 5AM - 11PM, đặt phòng tối thiểu 1 giờ.',
      price: 200000,
      unit: 'tháng',
      image: 'https://www.nhavanhoasinhvien.vn/wp-content/uploads/2024/12/z6102634179598_0efe25717f0d11fb8140cf59f07e467a-scaled.jpg',
      features: ['Thiết bị hiện đại', 'Huấn luyện viên', 'Phòng thay đồ', 'Tủ khóa'],
    },
    {
      id: 'bowling',
      name: 'Bowling',
      category: 'bowling',
      description: 'Sân bowling chuẩn quốc tế với 8 làn chơi, hệ thống chấm điểm tự động, bóng và giày chất lượng cao, không gian giải trí hiện đại, phù hợp cho cá nhân, nhóm bạn và sự kiện.',
      price: 80000,
      unit: 'lần',
      image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X_xphVZN4rihWkQrM_5iqZR5b3SfVWOxQQ&s',
      features: ['8 làn chơi', 'Giày bowling', 'Bóng bowling', 'Hướng dẫn'],
    },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  // ...removed time selection for service cards...

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ của chúng tôi</h1>
        <p className="text-lg text-gray-600">
          Khám phá các dịch vụ giải trí và thể thao đa dạng tại Nhà Văn Hóa Sinh Viên
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full mx-auto flex flex-col h-full hover:shadow-xl transition-transform transform hover:-translate-y-1">
            <div className="h-56 bg-gray-200">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Bao gồm:</h4>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1"></div>
              <div className="flex items-center justify-center mt-4">
                <Link
                  to={`/booking?service=${service.id}`}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-base"
                >
                  Đặt chỗ ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chưa tìm thấy dịch vụ phù hợp?
        </h2>
        <p className="text-gray-600 mb-6">
          Liên hệ với chúng tôi để được tư vấn và hỗ trợ tìm dịch vụ phù hợp nhất
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/membership#contact"
            className="btn-primary"
          >
            Liên hệ tư vấn
          </Link>
          <Link
            to="/membership"
            className="btn-secondary"
          >
            Xem gói thành viên
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
