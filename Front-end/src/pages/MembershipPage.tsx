import React, { useState, useEffect } from 'react';

// Simple accessible accordion component for FAQ
const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // start with all closed by default

  const faqs = [
    {
      q: 'Làm sao để đăng ký thành viên?',
      a: 'Bạn có thể đăng ký thành viên trực tuyến qua website hoặc đến trực tiếp tại các trung tâm NVH. Điền thông tin cá nhân và chọn gói phù hợp, sau đó hoàn tất thanh toán để kích hoạt.',
    },
    {
      q: 'Có thể hủy hoặc đổi gói thành viên không?',
      a: 'Bạn có thể gia hạn hoặc nâng cấp gói bất cứ lúc nào. Hủy gói hiện tại có thể tuân theo điều khoản hoàn tiền tùy vào chính sách từng gói.',
    },
    {
      q: 'Giờ hoạt động của phòng gym và bowling?',
      a: 'Phòng gym: 6:00 - 22:00 (gói cơ bản), 24/7 (gói cao cấp và VIP)\nBowling: 10:00 - 23:00 hàng ngày\nLớp nhóm: 7:00 - 21:00 (có lịch cụ thể cho từng môn)',
    },
    {
      q: 'Có ưu đãi gì cho sinh viên không?',
      a: 'Có, NVH áp dụng nhiều chương trình giảm giá dành cho sinh viên và thành viên, bao gồm giảm giá dịch vụ và ưu đãi khi mua gói dài hạn.',
    },
    {
      q: 'Nếu quên mang điện thoại thì làm sao check-in?',
      a: 'Bạn có thể xuất trình CMND/CCCD tại quầy lễ tân để check-in hoặc sử dụng mã QR được gửi qua email.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.q} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
            >
              <span className="font-medium text-gray-900">{item.q}</span>
              <span className={`transform transition-transform text-primary-600 ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <div
              className={`px-6 pb-4 text-sm text-gray-600 transition-all duration-200 ${isOpen ? 'pt-0 max-h-96' : 'max-h-0 opacity-0'}`}
              style={{whiteSpace: 'pre-line'}}
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
};
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MembershipPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If the route contains a hash (e.g. /membership#contact), scroll the target into view
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Delay slightly to ensure element is rendered
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // give a tiny visual offset if header is fixed (adjust as needed)
          window.scrollBy(0, -12);
        }
      }, 50);
    }
  }, [location]);

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Gói Cơ Bản',
      price: 500000,
      duration: '3 tháng',
      description: 'Phù hợp cho người mới bắt đầu',
      features: [
        'Sử dụng tất cả dịch vụ cơ bản',
        'Giảm giá 10% cho các dịch vụ',
        'Hỗ trợ qua điện thoại',
        'Tích điểm cơ bản',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Gói Premium',
      price: 1200000,
      duration: '6 tháng',
      description: 'Lựa chọn phổ biến nhất',
      features: [
        'Tất cả quyền lợi gói cơ bản',
        'Giảm giá 20% cho các dịch vụ',
        'Ưu tiên sử dụng dịch vụ',
        'Tích điểm gấp đôi',
        'Hỗ trợ ưu tiên',
        'Miễn phí khóa học định kỳ',
      ],
      popular: true,
    },
    {
      id: 'vip',
      name: 'Gói VIP',
      price: 2000000,
      duration: '12 tháng',
      description: 'Trải nghiệm cao cấp nhất',
      features: [
        'Tất cả quyền lợi gói Premium',
        'Giảm giá 30% cho các dịch vụ',
        'Truy cập không giới hạn',
        'Tích điểm gấp ba',
        'Hỗ trợ 24/7',
        'Miễn phí tất cả khóa học',
        'Phòng VIP riêng biệt',
        'Tặng kèm gói dịch vụ đặc biệt',
      ],
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Tiết kiệm chi phí',
      description: 'Giảm giá đặc biệt cho thành viên trên tất cả dịch vụ',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: 'Tích điểm thưởng',
      description: 'Tích điểm và đổi thưởng khi sử dụng dịch vụ',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
        </svg>
      ),
      title: 'Khóa học miễn phí',
      description: 'Tham gia các khóa học và workshop miễn phí',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Gói Thành Viên</h1>
        <p className="text-base md:text-lg text-gray-600">
          Chọn gói thành viên phù hợp và tận hưởng những ưu đãi đặc biệt
        </p>
      </div>

      {/* Benefits Section */}
      <section className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Quyền lợi thành viên</h2>
          <p className="text-gray-600">
            Khám phá những lợi ích độc quyền dành cho thành viên NVH
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-primary-600">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm md:text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Plans */}
      <section>
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Chọn gói thành viên</h2>
          <p className="text-gray-600">
            So sánh và chọn gói thành viên phù hợp nhất với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg p-6 border-2 transition-all flex flex-col ${
                selectedPlan === plan.id
                  ? 'border-primary-500 shadow-xl'
                  : 'border-gray-200 hover:border-primary-300'
              } ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              <div className="mb-6 flex-1">
                <div className="text-center mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                <div className="mb-3">
                  <span className="text-2xl md:text-3xl font-bold text-primary-600">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600"> VNĐ</span>
                </div>
                <p className="text-sm text-gray-500">Thời hạn: {plan.duration}</p>
                </div>

                <div className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mt-auto ${
                  selectedPlan === plan.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id ? 'Đã chọn' : 'Chọn gói này'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            {!user && (
              <>
                <Link to="/login" className="btn-primary text-lg px-8 py-3">Đăng nhập để thanh toán</Link>
                <Link to="/register" className="btn-secondary text-lg px-8 py-3">Đăng ký (dành cho khách)</Link>
              </>
            )}
            {user?.role === 'member' && (
              <button
                className="btn-primary text-lg px-8 py-3"
                onClick={() => {
                  const plan = membershipPlans.find(p => p.id === selectedPlan);
                  if (!plan) return;
                  navigate('/payment', {
                    state: {
                      type: 'membership',
                      plan: {
                        id: plan.id,
                        name: plan.name,
                        price: plan.price,
                        duration: plan.duration,
                        description: plan.description,
                      },
                    },
                  });
                }}
              >
                Thanh toán gói này
              </button>
            )}
          </div>
        )}
      </section>

      {/* FAQ Section - interactive accordion */}
      <section className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Câu hỏi thường gặp</h2>
          <p className="text-gray-600">Giải đáp những thắc mắc phổ biến của sinh viên</p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {/* FAQ data rendered below */}
        </div>

        {/* Render accordion items */}
        <FaqAccordion />
      </section>

    {/* Contact Section - full-bleed background, inner content constrained */}
  <div id="contact" style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }} className="bg-primary-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left - contact details */}
            <div>
      <h3 className="text-xl md:text-2xl font-bold mb-3">Liên hệ với chúng tôi</h3>
      <p className="text-primary-100 mb-4 md:mb-6">Sẵn sàng hỗ trợ bạn 24/7 với đội ngũ tận tâm và chuyên nghiệp</p>

              <div className="space-y-4 text-sm text-primary-100">
                <div>
                  <div className="font-semibold">Địa chỉ</div>
                  <div className="text-primary-100">Số 1 Lưu Hữu Phước<br/>Đông Hoà, Dĩ An, Hồ Chí Minh</div>
                </div>
                <div>
                  <div className="font-semibold">Điện thoại</div>
                  <div className="text-primary-100">Hotline: 1900 1234<br/>Zalo/WhatsApp: 0987 654 321</div>
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-primary-100">support@nvsvmembership.edu.vn</div>
                </div>
                <div>
                  <div className="font-semibold">Giờ làm việc</div>
                  <div className="text-primary-100">Thứ 2 - Chủ nhật: 6:00 - 23:00<br/>Hỗ trợ online: 24/7</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button aria-label="facebook" className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z"/></svg>
                </button>
                <button aria-label="twitter" className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5 8.5 8.5 0 0112 3a8.5 8.5 0 019 8.5z"/></svg>
                </button>
                <button aria-label="instagram" className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8A8.5 8.5 0 0112 21a8.5 8.5 0 01-8.1-5.7A8.38 8.38 0 013 11.5"/></svg>
                </button>
              </div>
            </div>

            {/* Right - contact form */}
            <div>
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg text-left text-gray-800">
                <h4 className="text-lg font-semibold mb-4">Gửi tin nhắn cho chúng tôi</h4>
                <form className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="input-field" placeholder="Họ và tên *" />
                    <input className="input-field" placeholder="Email *" />
                  </div>
                  <select className="input-field w-full">
                    <option>Chọn chủ đề</option>
                    <option>Đăng ký thành viên</option>
                    <option>Hỗ trợ kỹ thuật</option>
                    <option>Khác</option>
                  </select>
                  <textarea className="input-field w-full h-32" placeholder="Nội dung *" />
                  <div className="text-right">
                    <button type="button" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-primary-900 font-semibold px-6 py-2 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7"/></svg>
                      Gửi tin nhắn
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Footer is rendered by the layout */}
    </div>
  );
};

export default MembershipPage;
