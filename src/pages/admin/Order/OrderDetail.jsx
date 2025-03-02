import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await OrderService.getOrderDetails(id);
        setOrderDetails(response.data);
      } catch (error) {
        toast.error("Lỗi khi tải chi tiết đơn hàng");
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (!orderDetails) {
    return <div className="text-center text-gray-500 p-6">Đang tải...</div>;
  }

  return (
    <div className="flex justify-center bg-gray-100 py-10 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl border-t-8 border-gray-700">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">HÓA ĐƠN</h2>
        <div className="border-b pb-4 mb-4">
          <p className="text-lg font-semibold">{orderDetails.customer.fullname}</p>
          <p className="text-gray-600">Số điện thoại: {orderDetails.customer.phone}</p>
          <p className="text-gray-600">Mã đơn hàng: {orderDetails.orderCode}</p>
          <p className="text-gray-600">Ngày tạo: {new Date(orderDetails.createDate).toLocaleDateString()}</p>
        </div>

        <table className="w-full border-collapse border text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3 text-center">Số lượng</th>
              <th className="p-3 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.orderDetailResponses.map((detail) => (
              <tr key={detail.id} className="border-b">
                <td className="p-3">{detail.productName}</td>
                <td className="p-3 text-center">{detail.quantity}</td>
                <td className="p-3 text-right text-gray-700 font-semibold">
                  {((detail.price || 0) * (detail.quantity || 0)).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 border-t pt-4">
          <p className="text-lg font-bold text-gray-700">
            TỔNG TIỀN: {orderDetails.totalBill.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-gray-700 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition"
            onClick={() => navigate("/admin/order")}
          >
            🔙 Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
