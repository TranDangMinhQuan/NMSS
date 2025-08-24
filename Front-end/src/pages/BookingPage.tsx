import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BookingPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const services = [
    { id: 'gym', name: 'Phòng Gym', price: 200000 },
    { id: 'bowling', name: 'Bowling', price: 80000 },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const durations = [
    { value: '1', label: '1 giờ' },
    { value: '2', label: '2 giờ' },
    { value: '3', label: '3 giờ' },
    { value: '4', label: '4 giờ' },
  ];

  const selectedServiceData = services.find(s => s.id === selectedService);
  const totalPrice = selectedServiceData ? selectedServiceData.price * parseInt(selectedDuration) : 0;

  const isMember = useMemo(() => user?.role === 'member', [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (!isMember) {
        // Non-members cannot proceed to payment; prompt login
        alert('Vui lòng đăng nhập bằng tài khoản thành viên để thanh toán.');
        return;
      }
      if (!selectedServiceData) return;
      navigate('/payment', {
        state: {
          type: 'booking',
          booking: {
            serviceId: selectedServiceData.id.toString(),
            serviceName: selectedServiceData.name,
            pricePerHour: selectedServiceData.price,
            date: selectedDate,
            time: selectedTime,
            durationHours: parseInt(selectedDuration),
          },
        },
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt chỗ dịch vụ</h1>
        <p className="text-lg text-gray-600">
          Chọn dịch vụ và thời gian phù hợp để đặt chỗ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin đặt chỗ</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn dịch vụ *
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
                className="input-field"
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString()} VNĐ/giờ
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngày *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn giờ *
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="input-field"
              >
                <option value="">-- Chọn giờ --</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng *
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                required
                className="input-field"
              >
                {durations.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedService || !selectedDate || !selectedTime}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                isMember ? 'Xác nhận & thanh toán' : 'Xác nhận đặt chỗ'
              )}
            </button>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đặt chỗ</h3>
            
            {selectedServiceData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dịch vụ:</span>
                  <span className="font-medium">{selectedServiceData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngày:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giờ:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời lượng:</span>
                  <span className="font-medium">{selectedDuration} giờ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đơn giá:</span>
                  <span className="font-medium">{selectedServiceData.price.toLocaleString()} VNĐ/giờ</span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{totalPrice.toLocaleString()} VNĐ</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Vui lòng chọn dịch vụ để xem tóm tắt
              </p>
            )}
          </div>

          {/* Booking Tips */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Lưu ý khi đặt chỗ:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Đặt chỗ trước ít nhất 2 giờ để đảm bảo có chỗ
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Có thể hủy đặt chỗ trước 1 giờ mà không bị phạt
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Thành viên được ưu tiên đặt chỗ và giảm giá
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Vui lòng đến đúng giờ để tránh mất chỗ
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Cần hỗ trợ?</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 Hotline: 0123 456 789</p>
              <p>📧 Email: booking@nvh.edu.vn</p>
              <p>🕒 Giờ làm việc: 7:00 - 22:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
