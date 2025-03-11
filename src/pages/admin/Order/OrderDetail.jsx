import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await OrderService.getOrderDetails(id);
        console.log("Order details response:", response);
        if (response && response.data) {
          setOrderDetails(response.data);
        } else {
          toast.error("Dữ liệu đơn hàng không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
        toast.error("Lỗi khi tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500 p-6">Đang tải...</div>;
  }

  if (!orderDetails) {
    return <div className="text-center text-red-500 p-6">Không tìm thấy đơn hàng!</div>;
  }

  return (
    <div className="flex justify-center bg-gray-100 py-10 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl border-t-8 border-gray-700">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-4">HÓA ĐƠN</h2>
        <div className="border-b pb-4 mb-4">
          <p className="text-lg font-semibold">{orderDetails.customer?.fullname || "N/A"}</p>
          <p className="text-gray-600">Số điện thoại: {orderDetails.customer?.phone || "N/A"}</p>
          <p className="text-gray-600">Mã đơn hàng: {orderDetails.orderCode || "N/A"}</p>
          <p className="text-gray-600">
            Ngày tạo: {orderDetails.createDate ? new Date(orderDetails.createDate).toLocaleDateString() : "N/A"}
          </p>
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
            {orderDetails.orderDetails.map((detail) => {
              const product = detail.productDetail?.product;
              const price = detail.productDetail?.salePrice ?? detail.productDetail?.product?.salePrice ?? 0;
              const quantity = detail.quantity ?? 0;
              const totalPrice = price * quantity;

              return (
                <tr key={detail.id} className="border-b">
                  <td className="p-3">{product?.productName || "Không có tên"}</td>
                  <td className="p-3 text-center">{quantity}</td>
                  <td className="p-3 text-right text-gray-700 font-semibold">
                    {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-right mt-4 border-t pt-4">
          <p className="text-lg font-bold text-gray-700">
            TỔNG TIỀN: {orderDetails.totalBill?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "N/A"}
          </p>
        </div>

        {orderDetails.voucher && (
          <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500">
            <p className="text-green-700 font-semibold">{orderDetails.voucher?.voucherName || "Không có tên"}</p>
            <p className="text-gray-700">{orderDetails.voucher?.description || "Không có mô tả"}</p>
          </div>
        )}

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
