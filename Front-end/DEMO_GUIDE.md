# 🚀 Hướng dẫn sử dụng NVH Membership System Demo

## 📋 Tổng quan
Đây là hệ thống quản lý thành viên Nhà Văn Hóa Sinh Viên được xây dựng với React, TypeScript và Tailwind CSS.

## 🔐 Tài khoản Demo

### Tài khoản có sẵn:
| Vai trò | Username | Password | Quyền truy cập |
|---------|----------|----------|----------------|
| **Admin** | `admin` | `password` | Toàn bộ hệ thống |
| **Staff** | `staff` | `password` | Quản lý thành viên, check-in |
| **Member** | `member` | `password` | Đặt chỗ, xem thông tin cá nhân |

## 🎯 Cách sử dụng

### 1. Truy cập ứng dụng
- Mở trình duyệt và truy cập: `http://localhost:5173`
- Hoặc chạy lệnh: `npm run dev`

### 2. Đăng nhập
- Click vào "Đăng nhập" hoặc truy cập `/login`
- Sử dụng một trong các tài khoản demo ở trên
- Nhập username và password (mật khẩu mặc định: `password`)

### 3. Khám phá tính năng

#### 👤 **Với tài khoản Admin:**
- **Dashboard**: Xem tổng quan hệ thống
- **Quản lý thành viên**: Thêm, sửa, xóa thành viên
- **Quản lý thẻ thành viên**: Phát hành, gia hạn thẻ
- **Quản lý gói dịch vụ**: Tạo và quản lý các gói
- **Quản lý đặt chỗ**: Xem và xử lý đặt chỗ
- **Check-in**: Thực hiện check-in/check-out
- **Quản lý thanh toán**: Xử lý thanh toán
- **Điểm thưởng**: Quản lý hệ thống điểm
- **Quản lý trung tâm**: Thêm, sửa trung tâm
- **Báo cáo**: Xem báo cáo và thống kê

#### 👨‍💼 **Với tài khoản Staff:**
- **Dashboard**: Xem tổng quan
- **Quản lý thành viên**: Xem và quản lý thành viên
- **Check-in**: Thực hiện check-in/check-out
- **Quản lý đặt chỗ**: Xử lý đặt chỗ
- **Thanh toán**: Xử lý thanh toán

#### 👤 **Với tài khoản Member:**
- **Dashboard**: Xem thông tin cá nhân
- **Đặt chỗ**: Đặt chỗ dịch vụ
- **Thẻ thành viên**: Xem thông tin thẻ
- **Lịch sử**: Xem lịch sử sử dụng dịch vụ

## 🎨 Giao diện

### Responsive Design
- **Desktop**: Layout đầy đủ với sidebar
- **Tablet**: Layout thích ứng
- **Mobile**: Layout tối ưu cho màn hình nhỏ

### Màu sắc chính
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#64748B)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

## 🔧 Tính năng Demo

### ✅ Đã hoàn thành:
- [x] Hệ thống authentication
- [x] Giao diện responsive
- [x] Routing với React Router
- [x] TypeScript type safety
- [x] Tailwind CSS styling
- [x] Components tái sử dụng
- [x] Protected routes
- [x] Demo data
- [x] Loading states
- [x] Error handling

### 📱 Các trang chính:
- **HomePage**: Trang chủ với hero section
- **LoginPage**: Đăng nhập với demo accounts
- **RegisterPage**: Đăng ký thành viên mới
- **DashboardPage**: Dashboard với stats
- **ServicesPage**: Hiển thị dịch vụ
- **MembershipPage**: Gói thành viên
- **BookingPage**: Đặt chỗ dịch vụ
- **MembersManagementPage**: Quản lý thành viên

## 🚀 Chạy ứng dụng

### Development:
```bash
npm run dev
```

### Build production:
```bash
npm run build
```

### Preview build:
```bash
npm run preview
```

## 📁 Cấu trúc dự án

```
src/
├── components/          # Components tái sử dụng
├── hooks/              # Custom hooks
├── layouts/            # Layout components
├── pages/              # Các trang
├── data/               # Demo data
├── types/              # TypeScript types
├── services/           # API services
└── App.tsx             # Component chính
```

## 🔄 Tích hợp Backend

Khi có backend thực tế, chỉ cần:
1. Cập nhật `src/services/api.ts` với URL backend
2. Thay thế logic demo trong `useAuth.ts` bằng API calls
3. Cập nhật các components để sử dụng real data

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ:
- **Email**: support@nvh.edu.vn
- **Phone**: 0123 456 789

---

**NVH Membership System** - Hệ thống quản lý thành viên hiện đại 🏛️
