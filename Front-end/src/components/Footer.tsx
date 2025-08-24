import { Facebook, Instagram, Youtube, Shield } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'Phòng Gym', href: '#services' },
    { name: 'Bowling', href: '#services' },
    // { name: 'Lớp nhóm', href: '#services' },
  ],
  support: [
    { name: 'Trung tâm trợ giúp', href: '#' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Liên hệ', href: '#contact' },
    { name: 'Báo cáo sự cố', href: '#' },
    { name: 'Phản hồi', href: '#' },
  ],
  policies: [
    { name: 'Điều khoản sử dụng', href: '#' },
    { name: 'Chính sách bảo mật', href: '#' },
    { name: 'Quy định thành viên', href: '#' },
    { name: 'Chính sách hoàn tiền', href: '#' },
    { name: 'An toàn & Bảo mật', href: '#' },
  ],
};

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }} className="bg-gray-900 text-white -mt-8">
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6" data-testid="text-footer-brand">
              Nhà Văn Hóa Sinh Viên
            </h3>
            <p className="text-gray-300 mb-6" data-testid="text-footer-description">
              Hệ thống quản lý thành viên hiện đại cho Nhà Văn Hóa Sinh Viên. 
              Nâng tầm trải nghiệm thể thao và giải trí của bạn.
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                aria-label="facebook"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="footer-social-facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="instagram"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="footer-social-instagram"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="youtube"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                data-testid="footer-social-youtube"
              >
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6" data-testid="text-footer-services-title">Dịch vụ</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, i) => (
                <li key={link.name}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                    data-testid={`footer-link-service-${i}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6" data-testid="text-footer-support-title">Hỗ trợ</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, i) => (
                <li key={link.name}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                    data-testid={`footer-link-support-${i}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6" data-testid="text-footer-policies-title">Chính sách</h4>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                    data-testid={`footer-link-policy-${link.name}`}
                    onClick={(e) => { if (link.href.startsWith('#')) { e.preventDefault(); scrollToSection(link.href); } }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0" data-testid="text-footer-copyright">
              © 2024 NVHSV Membership System. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-300" data-testid="text-footer-version">Phiên bản 2.1.0</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-gray-300" data-testid="text-footer-security">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}
