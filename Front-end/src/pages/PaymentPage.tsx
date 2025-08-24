import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Types replicated locally for this page usage
// These should match the shapes used by the pages that navigate here
export type MembershipPlan = {
	id: string;
	name: string;
	price: number;
	duration: string;
	description?: string;
};

export type BookingPayment = {
  serviceId: string;
  serviceName: string;
  pricePerHour: number;
  date: string;
  time: string;
  durationHours: number;
};

export type LocationState =
  | {
      type: 'membership';
      plan: MembershipPlan;
    }
  | {
      type: 'booking';
      booking: BookingPayment;
    }
  | undefined;

const PaymentPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [method, setMethod] = useState<'vnpay' | 'momo' | 'card' | 'cash'>('vnpay');
	const [loading, setLoading] = useState(false);

	const state = location.state as LocationState;

	const totalAmount = useMemo(() => {
		if (state?.type === 'membership') {
			return state.plan.price;
		}
		if (state?.type === 'booking') {
			return state.booking.pricePerHour * state.booking.durationHours;
		}
		return 0;
	}, [state]);

	const handlePay = (e: React.FormEvent) => {
		e.preventDefault();
		if (!state) return;
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			if (state.type === 'membership') {
				navigate('/my-memberships');
			} else if (state.type === 'booking') {
				navigate('/my-bookings');
			}
		}, 1500);
	};

	if (!state) {
		return (
			<div className="min-h-[70vh] flex items-center">
				<div className="max-w-3xl mx-auto w-full">
					<div className="bg-white rounded-lg shadow p-8 text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">Không có dữ liệu thanh toán</h1>
						<p className="text-gray-600 mb-6">Vui lòng thực hiện chọn gói hoặc đặt chỗ trước khi thanh toán.</p>
						<div className="flex gap-3 justify-center">
							<Link to="/membership" className="btn-secondary">Gói thành viên</Link>
							<Link to="/booking" className="btn-primary">Đặt chỗ dịch vụ</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[70vh] flex">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
				{/* Summary */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow p-6 sticky top-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt thanh toán</h2>
						{state.type === 'membership' && (
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Loại:</span>
									<span className="font-medium">Gói thành viên</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Gói:</span>
									<span className="font-medium">{state.plan.name}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Thời hạn:</span>
									<span className="font-medium">{state.plan.duration}</span>
								</div>
								<hr />
								<div className="flex justify-between text-lg font-bold">
									<span>Tổng tiền</span>
									<span className="text-primary-600">{totalAmount.toLocaleString()} VNĐ</span>
								</div>
							</div>
						)}
						{state.type === 'booking' && (
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Loại:</span>
									<span className="font-medium">Đặt chỗ dịch vụ</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Dịch vụ:</span>
									<span className="font-medium">{state.booking.serviceName}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Ngày:</span>
									<span className="font-medium">{state.booking.date}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Giờ:</span>
									<span className="font-medium">{state.booking.time}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Thời lượng:</span>
									<span className="font-medium">{state.booking.durationHours} giờ</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Đơn giá:</span>
									<span className="font-medium">{state.booking.pricePerHour.toLocaleString()} VNĐ/giờ</span>
								</div>
								<hr />
								<div className="flex justify-between text-lg font-bold">
									<span>Tổng tiền</span>
									<span className="text-primary-600">{totalAmount.toLocaleString()} VNĐ</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Payment form */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow p-6">
						<h1 className="text-xl font-semibold text-gray-900 mb-6">Thanh toán</h1>
						<form className="space-y-6" onSubmit={handlePay}>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<label className={`border rounded-lg p-3 cursor-pointer ${method === 'vnpay' ? 'border-primary-600 ring-1 ring-primary-200' : 'border-gray-200'}`}>
										<input type="radio" name="method" className="hidden" checked={method === 'vnpay'} onChange={() => setMethod('vnpay')} />
										<div className="flex items-center gap-3">
											<span className="font-medium">VNPay</span>
										</div>
									</label>
									<label className={`border rounded-lg p-3 cursor-pointer ${method === 'momo' ? 'border-primary-600 ring-1 ring-primary-200' : 'border-gray-200'}`}>
										<input type="radio" name="method" className="hidden" checked={method === 'momo'} onChange={() => setMethod('momo')} />
										<div className="flex items-center gap-3">
											<span className="font-medium">MoMo</span>
										</div>
									</label>
									<label className={`border rounded-lg p-3 cursor-pointer ${method === 'card' ? 'border-primary-600 ring-1 ring-primary-200' : 'border-gray-200'}`}>
										<input type="radio" name="method" className="hidden" checked={method === 'card'} onChange={() => setMethod('card')} />
										<div className="flex items-center gap-3">
											<span className="font-medium">Thẻ tín dụng/Ghi nợ</span>
										</div>
									</label>
									<label className={`border rounded-lg p-3 cursor-pointer ${method === 'cash' ? 'border-primary-600 ring-1 ring-primary-200' : 'border-gray-200'}`}>
										<input type="radio" name="method" className="hidden" checked={method === 'cash'} onChange={() => setMethod('cash')} />
										<div className="flex items-center gap-3">
											<span className="font-medium">Tiền mặt tại quầy</span>
										</div>
									</label>
								</div>
							</div>

							{/* Card fields (mock) */}
							{method === 'card' && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<input className="input-field" placeholder="Tên trên thẻ" />
									<input className="input-field" placeholder="Số thẻ" />
									<input className="input-field" placeholder="MM/YY" />
									<input className="input-field" placeholder="CVV" />
								</div>
							)}

							<button type="submit" disabled={loading} className="btn-primary w-full md:w-auto">
								{loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;