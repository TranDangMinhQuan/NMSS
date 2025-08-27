import React, { useMemo, useState, useEffect } from 'react';
// Toast component đơn giản
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
      {message}
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  const [selectedService, setSelectedService] = useState(initialService);
  useEffect(() => {
    // Nếu có initialService và chưa set thì set lại
    if (initialService && !selectedService) {
      setSelectedService(initialService);
    }
  }, [initialService, selectedService]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { user } = useAuth();

  const services = [
    { id: 'gym', name: 'Phòng Gym', priceNormal: 200000, pricePeak: 250000 },
    { id: 'bowling', name: 'Bowling', priceNormal: 80000, pricePeak: 120000 },
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

  const [selectedPriceType, setSelectedPriceType] = useState<'normal' | 'peak'>('normal');

  // Tự động xác định khung giờ thường/cao điểm dựa vào selectedTime
  useEffect(() => {
    if (!selectedTime) return;
    // Giờ cao điểm: 17:00 - 21:00
    const peakHours = ['17:00', '18:00', '19:00', '20:00', '21:00'];
    if (peakHours.includes(selectedTime)) {
      setSelectedPriceType('peak');
    } else {
      setSelectedPriceType('normal');
    }
  }, [selectedTime]);
  const selectedServiceData = services.find(s => s.id === selectedService);
  const pricePerHour = selectedServiceData
    ? selectedPriceType === 'normal'
      ? selectedServiceData.priceNormal
      : selectedServiceData.pricePeak
    : 0;
  const totalPrice = pricePerHour * parseInt(selectedDuration);

  const isMember = useMemo(() => user?.role === 'member', [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (!isMember) {
        setToastMsg('Vui lòng đăng nhập bằng tài khoản thành viên để thanh toán.');
        return;
      }
      if (!selectedServiceData) return;
      navigate('/payment', {
        state: {
          type: 'booking',
          booking: {
            serviceId: selectedServiceData.id.toString(),
            serviceName: selectedServiceData.name,
            pricePerHour: pricePerHour,
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
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
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
            {initialService ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dịch vụ đã chọn</label>
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold min-h-[24px] flex items-center">
                  {selectedServiceData?.name || 'Không xác định'}
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn dịch vụ *
                </label>
                <select
                  id="service-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Type Display (tự động xác định) */}
            {selectedServiceData && selectedTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khung giờ áp dụng
                </label>
                <div className="flex gap-4">
                  <span className={`px-4 py-2 rounded-lg font-medium border ${selectedPriceType === 'normal' ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                    Giờ thường ({selectedServiceData.priceNormal.toLocaleString()} VNĐ/giờ)
                  </span>
                  <span className={`px-4 py-2 rounded-lg font-medium border ${selectedPriceType === 'peak' ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                    Giờ cao điểm ({selectedServiceData.pricePeak.toLocaleString()} VNĐ/giờ)
                  </span>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngày *
              </label>
              <input
                id="date-select"
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
                id="time-select"
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
                id="duration-select"
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
                (() => {
                  if (isMember) return 'Xác nhận & thanh toán';
                  return 'Xác nhận đặt chỗ';
                })()
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
                  <span className="font-medium">{pricePerHour.toLocaleString()} VNĐ/giờ</span>
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
                <span className="text-blue-600 mr-2">•</span>&nbsp;
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
