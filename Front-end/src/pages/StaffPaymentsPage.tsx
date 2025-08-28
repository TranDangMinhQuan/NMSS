import { useEffect, useState } from "react";
import { getPayments } from "../services/api";
import { Payment } from "../types";

const StaffPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    getPayments().then(setPayments);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Quản lý thanh toán</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Thành viên</th>
            <th>Số tiền</th>
            <th>Ngày</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.memberName}</td>
              <td>{payment.amount}</td>
              <td>{payment.date}</td>
              <td>
                <button>Xem</button>
                {/* Nếu BE cho phép tạo/confirm/refund, render nút tương ứng */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffPaymentsPage;