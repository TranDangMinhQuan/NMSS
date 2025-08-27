import React, { useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const heroImages = [
    {
      src: 'https://daihoc.fpt.edu.vn/wp-content/uploads/2019/08/GYM-487x325.jpg',
      alt: 'Gym',
    },
    {
      src: 'https://tanthoidai.com.vn/images/gallery/images/D%E1%BB%B1%20%C3%A1n%20Vinhomes%20Riverside/Trung%20t%C3%A2m%20gi%E1%BA%A3i%20tr%C3%AD%20bowling%20t%E1%BA%A1i%20Almaz%20Vinhomes%20Riverside.jpg',
      alt: 'Bowling',
    },
  ];
  const [imgIdx, setImgIdx] = useState(0);
  const services = [
    {
      id: 'gym',
      name: 'Phòng Gym',
      description: 'Phòng gym hiện đại, trang bị đầy đủ thiết bị, không gian thoải mái, mở cửa từ 5AM - 11PM, đặt phòng tối thiểu 1 giờ.',
      image: 'https://www.nhavanhoasinhvien.vn/wp-content/uploads/2024/12/z6102634179598_0efe25717f0d11fb8140cf59f07e467a-scaled.jpg',
      features: ['Thiết bị hiện đại', 'Huấn luyện viên', 'Phòng thay đồ', 'Tủ khóa'],
    },
    {
      id: 'bowling',
      name: 'Bowling',
      description: 'Sân bowling chuẩn quốc tế với 8 làn chơi, hệ thống chấm điểm tự động, bóng và giày chất lượng cao, không gian giải trí hiện đại, phù hợp cho cá nhân, nhóm bạn và sự kiện.',
      image: ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_X_xphVZN4rihWkQrM_5iqZR5b3SfVWOxQQ&s',
      features: ['8 làn chơi', 'Giày bowling', 'Bóng bowling', 'Hướng dẫn'],
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
      {/* Hero Section - Animated Gradient & Floating Shapes */}
      <div style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }} className="relative overflow-hidden -mt-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 opacity-90"></div>
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-400 bg-opacity-30 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-20 w-56 h-56 bg-blue-400 bg-opacity-30 rounded-full blur-2xl animate-float-fast"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-300 bg-opacity-20 rounded-full blur-2xl animate-float-mid"></div>
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="text-left">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 drop-shadow-xl">
                  <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-text-gradient">Nâng tầm trải nghiệm</span>
                  <br />
                  <span className="text-white">sinh viên của bạn</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 max-w-xl mb-10 font-medium drop-shadow-lg">
                  Hệ thống membership hiện đại cho Nhà Văn Hóa Sinh Viên. Tập gym, chơi bowling, và nhiều hoạt động thú vị khác - tất cả trong một ứng dụng.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link to="/register" className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-primary-900 px-7 py-4 rounded-xl font-bold shadow-xl text-lg transition-transform transform hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Đăng ký miễn phí
                  </Link>
                  <Link to="/services" className="inline-flex items-center gap-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-primary-700 px-7 py-4 rounded-xl font-bold shadow-lg text-lg transition-transform transform hover:scale-105">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.003v5.994a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Khám phá dịch vụ
                  </Link>
                </div>
                {/* Metrics */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-start">
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold text-yellow-300 drop-shadow">2,500+</div>
                    <div className="text-base text-white/80">Thành viên</div>
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold text-pink-300 drop-shadow">50+</div>
                    <div className="text-base text-white/80">Dịch vụ</div>
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold text-blue-300 drop-shadow">98%</div>
                    <div className="text-base text-white/80">Hài lòng</div>
                  </div>
                </div>
              </div>
              {/* Right - Animated gym & bowling illustration */}
              <div className="relative flex justify-center lg:justify-end">
                <button
                  type="button"
                  className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg animate-float-img relative h-80 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Chuyển ảnh hero"
                  tabIndex={0}
                  onClick={() => setImgIdx((imgIdx + 1) % heroImages.length)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setImgIdx((imgIdx + 1) % heroImages.length);
                    }
                  }}
                >
                  <img src={heroImages[imgIdx].src} alt={heroImages[imgIdx].alt} className="w-full h-80 object-cover transition-all duration-500" />
                </button>
                {/* Floating badges */}
                <div className="absolute -left-8 bottom-8 animate-float-badge">
                  <div className="bg-white rounded-xl shadow-md px-5 py-4 flex items-center gap-4 w-60">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">QR Check-in</div>
                      <div className="text-xs text-gray-500">Nhanh chóng & tiện lợi</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-8 top-8 animate-float-badge">
                  <div className="bg-white rounded-xl shadow-md px-5 py-4 flex items-start gap-4 w-52">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V11H3v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">Đặt lịch online</div>
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-lg text-gray-600">
              Dịch vụ đa dạng, tiện ích hiện đại, trải nghiệm sinh viên năng động và chuyên nghiệp.
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