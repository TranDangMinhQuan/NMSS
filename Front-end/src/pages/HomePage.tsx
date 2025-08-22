import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const services = [
    {
      id: 1,
      name: 'Phòng Gym',
      description: 'Phòng tập thể dục hiện đại với đầy đủ thiết bị',
      image: 'https://www.nhavanhoasinhvien.vn/wp-content/uploads/2024/12/z6102634179598_0efe25717f0d11fb8140cf59f07e467a-scaled.jpg',
      price: '200,000 VNĐ/tháng',
    },
    {
      id: 2,
      name: 'Bowling',
      description: 'Sân bowling chuyên nghiệp với 8 làn chơi',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X_xphVZN4rihWkQrM_5iqZR5b3SfVWOxQQ&s',
      price: '80,000 VNĐ/lần',
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Đặt chỗ trực tuyến',
      description: 'Đặt chỗ dịch vụ nhanh chóng và tiện lợi qua website',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Check-in QR Code',
      description: 'Check-in nhanh chóng bằng QR code hoặc RFID',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Hệ thống điểm thưởng',
      description: 'Tích điểm và đổi thưởng khi sử dụng dịch vụ',
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section (redesigned) - full bleed background */}
      {/* -mt-8 removes the top padding from the layout's main container so the hero sits flush under the header */}
      <div style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }} className="bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden -mt-8">
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Nâng tầm <span className="text-yellow-400">trải</span>
                <br />
                <span className="text-yellow-400">nghiệm</span> sinh viên của bạn
              </h1>

              <p className="text-lg sm:text-xl text-primary-100 max-w-xl mb-8">
                Hệ thống membership hiện đại cho Nhà Văn Hóa Sinh Viên. Tập gym, chơi bowling, và nhiều hoạt động thú vị khác - tất cả trong một ứng dụng.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register" className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-primary-900 px-6 py-3 rounded-lg font-semibold shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Đăng ký miễn phí
                </Link>

                <Link to="/services" className="inline-flex items-center gap-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-primary-700 px-6 py-3 rounded-lg font-semibold shadow-sm">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.003v5.994a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Khám phá dịch vụ
                </Link>
              </div>

              {/* Metrics */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400">2,500+</div>
                  <div className="text-sm text-primary-100">Thành viên</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400">50+</div>
                  <div className="text-sm text-primary-100">Dịch vụ</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-yellow-400">98%</div>
                  <div className="text-sm text-primary-100">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Right - Image card with floating badges */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" alt="Gym" className="w-full h-96 object-cover" />
              </div>

              {/* Floating badges */}
              <div className="absolute -left-6 bottom-6">
                <div className="bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 w-56">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">QR Check-in</div>
                    <div className="text-xs text-gray-500">Nhanh chóng & tiện lợi</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 top-6">
                <div className="bg-white rounded-xl shadow-md px-4 py-3 flex items-start gap-3 w-44">
                  <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V11H3v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Đặt lịch online</div>
                    <div className="text-xs text-gray-500">24/7 tiện lợi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-lg text-gray-600">
              Khám phá các dịch vụ giải trí và thể thao đa dạng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full mx-auto">
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
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">{service.price}</span>
                    <Link
                      to="/booking"
                      className="btn-primary text-sm"
                    >
                      Đặt chỗ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-lg text-gray-600">
              Những tính năng độc đáo giúp trải nghiệm của bạn tốt hơn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - full-bleed and visually separated from footer */}
      <div style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }} className="bg-primary-600 text-white overflow-hidden">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Sẵn sàng tham gia?</h2>
            <p className="text-lg sm:text-xl mb-10 text-primary-100 max-w-2xl mx-auto">
              Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt cho thành viên mới
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Đăng ký ngay
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
