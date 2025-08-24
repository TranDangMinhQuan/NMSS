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
      id: 1,
      name: 'Phòng Gym',
      category: 'gym',
      description: 'Phòng tập thể dục hiện đại với đầy đủ thiết bị tập luyện chuyên nghiệp',
      price: 200000,
      unit: 'tháng',
      image: 'https://www.nhavanhoasinhvien.vn/wp-content/uploads/2024/12/z6102634179598_0efe25717f0d11fb8140cf59f07e467a-scaled.jpg',
      features: ['Thiết bị hiện đại', 'Huấn luyện viên', 'Phòng thay đồ', 'Tủ khóa'],
    },
    {
      id: 2,
      name: 'Bowling',
      category: 'bowling',
      description: 'Sân bowling chuyên nghiệp với 8 làn chơi và thiết bị hiện đại',
      price: 80000,
      unit: 'lần',
      image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X_xphVZN4rihWkQrM_5iqZR5b3SfVWOxQQ&s',
      features: ['8 làn chơi', 'Giày bowling', 'Bóng bowling', 'Hướng dẫn'],
    },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

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
          <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full mx-auto hover:shadow-xl transition-transform transform hover:-translate-y-1">
            <div className="h-56 bg-gray-200">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
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

              <div className="flex items-center justify-between">
                <span className="text-primary-600 font-bold">
                  {service.price.toLocaleString()} VNĐ/{service.unit}
                </span>
                <div className="flex gap-2 items-center">
                  <Link
                    to="/booking"
                    className="btn-primary text-sm"
                  >
                    Đặt chỗ
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
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
