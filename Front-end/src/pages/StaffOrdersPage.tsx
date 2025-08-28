import { useEffect, useState } from "react";
import { getServiceOrders } from "../services/api";
import { ServiceOrder } from "../types";

const StaffOrdersPage = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    getServiceOrders({ status }).then(setOrders);
  }, [status]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Đơn dịch vụ</h1>
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">Tất cả</option>
        <option value="pending">Chờ xác nhận</option>
        <option value="confirmed">Đã xác nhận</option>
        <option value="checked_in">Đã check-in</option>
        <option value="completed">Hoàn thành</option>
        <option value="canceled">Đã hủy</option>
      </select>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th>Thành viên</th>
            <th>Dịch vụ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.memberName}</td>
              <td>{order.serviceName}</td>
              <td>{order.status}</td>
              <td>
                {/* Nếu BE cho phép update trạng thái, render nút tương ứng */}
                {order.status === "pending" && <button>Check-in</button>}
                {/* ... */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffOrdersPage;