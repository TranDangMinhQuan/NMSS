# NVH Membership System

Hệ thống quản lý thành viên Nhà Văn Hóa Sinh Viên - một ứng dụng web hiện đại được xây dựng với React, TypeScript và Tailwind CSS.

## 🚀 Tính năng chính

### Cho Khách hàng (Guest)
- Xem thông tin dịch vụ và gói thành viên
- Đăng ký tài khoản mới
- Đặt chỗ dịch vụ trực tuyến

### Cho Thành viên (Member)
- Quản lý thẻ thành viên
- Gia hạn thành viên
- Đặt chỗ dịch vụ
- Tích lũy và sử dụng điểm thưởng
- Xem lịch sử sử dụng dịch vụ

### Cho Nhân viên (Staff)
- Quản lý thành viên
- Thực hiện check-in/check-out
- Hỗ trợ đặt chỗ trực tiếp
- Xử lý thanh toán

### Cho Quản trị viên (Admin)
- Quản lý toàn bộ hệ thống
- Quản lý trung tâm, loại dịch vụ, dịch vụ
- Quản lý loại thẻ và gói dịch vụ
- Xem báo cáo và thống kê

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (version 18 trở lên)
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng ở môi trường development
```bash
npm run dev
```

### Build ứng dụng cho production
```bash
npm run build
```

### Preview build production
```bash
npm run preview
```

## 🏗️ Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── Header.tsx      # Header chính
│   ├── Sidebar.tsx     # Sidebar cho admin/staff
│   ├── LoadingSpinner.tsx
│   └── Modal.tsx
├── hooks/              # Custom hooks
│   └── useAuth.ts      # Hook quản lý authentication
├── layouts/            # Layout components
│   └── MainLayout.tsx  # Layout chính
├── pages/              # Các trang của ứng dụng
│   ├── HomePage.tsx    # Trang chủ
│   ├── LoginPage.tsx   # Trang đăng nhập
│   ├── RegisterPage.tsx # Trang đăng ký
│   ├── DashboardPage.tsx # Dashboard
│   ├── ServicesPage.tsx # Trang dịch vụ
│   ├── MembershipPage.tsx # Trang gói thành viên
│   └── BookingPage.tsx # Trang đặt chỗ
├── services/           # API services
│   └── api.ts          # Cấu hình axios
├── types/              # TypeScript type definitions
│   └── index.ts        # Các interface và type
├── App.tsx             # Component chính
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔐 Tài khoản demo

Để test các chức năng khác nhau, bạn có thể sử dụng các tài khoản demo sau:

- **Admin**: `admin` / `password`
- **Staff**: `staff` / `password`
- **Member**: `member` / `password`

## 🎨 Thiết kế UI/UX

### Màu sắc chính
- **Primary**: Blue (#3B82F6 - #1E40AF)
- **Secondary**: Gray (#64748B - #0F172A)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 📱 Tính năng responsive

- Responsive navigation với mobile menu
- Adaptive layouts cho các kích thước màn hình
- Touch-friendly interface cho mobile devices

## 🔧 Cấu hình

### Tailwind CSS
File cấu hình: `tailwind.config.js`
- Custom color palette
- Custom components classes
- Form và Typography plugins

### Environment Variables
Tạo file `.env.local` để cấu hình:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=NVH Membership System
```

## 🚀 Deployment

### Build cho production
```bash
npm run build
```

### Deploy lên Vercel
```bash
npm install -g vercel
vercel
```

### Deploy lên Netlify
```bash
npm run build
# Upload thư mục dist lên Netlify
```

## 📋 Roadmap

### Phase 1 (Hiện tại)
- ✅ Giao diện cơ bản
- ✅ Hệ thống authentication
- ✅ Trang đăng ký/đăng nhập
- ✅ Dashboard cơ bản
- ✅ Trang dịch vụ và đặt chỗ

### Phase 2 (Sắp tới)
- 🔄 Tích hợp backend API
- 🔄 Hệ thống thanh toán
- 🔄 QR Code check-in
- 🔄 Email notifications
- 🔄 Mobile app

### Phase 3 (Tương lai)
- 📅 AI-powered recommendations
- 📅 Advanced analytics
- 📅 Multi-language support
- 📅 PWA features

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: support@nvh.edu.vn
- **Phone**: 0123 456 789
- **Website**: https://nvh.edu.vn

---

**NVH Membership System** - Hệ thống quản lý thành viên hiện đại cho Nhà Văn Hóa Sinh Viên 🏛️
