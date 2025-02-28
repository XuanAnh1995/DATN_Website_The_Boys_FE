import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { toast } from "react-toastify";

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await OrderService.getOrderDetails(id);
                setOrderDetails(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
                toast.error("Lỗi khi tải chi tiết đơn hàng");
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (!orderDetails) {
        return <div className="text-center text-gray-500 p-6">Đang tải...</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
            <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Chi Tiết Đơn Hàng</h1>
                
                {/* Thông tin đơn hàng */}
                <div className="border rounded-lg shadow-sm p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                        <p><strong>Mã đơn hàng:</strong> {orderDetails.orderCode}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(orderDetails.createDate).toLocaleString()}</p>
                        <p><strong>Tổng tiền:</strong> <span className="text-red-500 font-bold">{orderDetails.totalBill.toLocaleString()} VND</span></p>
                        <p><strong>Trạng thái:</strong> <span className={`px-3 py-1 rounded-full text-white ${orderDetails.statusOrder === 1 ? "bg-green-500" : "bg-gray-400"}`}>
                            {orderDetails.statusOrder === 1 ? "Hoàn thành" : "Chờ xử lý"}
                        </span></p>
                    </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="border rounded-lg shadow-sm p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
                    <p><strong>Tên:</strong> {orderDetails.customer.fullname}</p>
                    <p><strong>Số điện thoại:</strong> {orderDetails.customer.phone}</p>
                    <p><strong>Email:</strong> {orderDetails.customer.email}</p>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="border rounded-lg shadow-sm p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm trong đơn hàng</h2>
                    <table className="w-full border border-gray-300 rounded-lg shadow-sm text-left">
                        <thead className="bg-gray-700 text-white">
                            <tr>
                                <th className="p-3">Sản phẩm</th>
                                <th className="p-3 text-center">Số lượng</th>
                                <th className="p-3 text-right">Giá tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.orderDetailResponses.map((detail) => (
                                <tr key={detail.id} className="border-t text-gray-700 text-lg">
                                    <td className="p-3 flex items-center space-x-3">
                                        <img src={detail.productImage} alt={detail.productName} className="w-16 h-16 rounded-md shadow object-cover" />
                                        <span>{detail.productName}</span>
                                    </td>
                                    <td className="p-3 text-center">{detail.quantity}</td>
                                    <td className="p-3 text-right text-red-500 font-bold">{((detail.price || 0) * (detail.quantity || 0)).toLocaleString()} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Thông tin nhân viên */}
                <div className="border rounded-lg shadow-sm p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">Nhân viên xử lý</h2>
                    <p><strong>Tên:</strong> {orderDetails.employee.fullname}</p>
                    <p><strong>Số điện thoại:</strong> {orderDetails.employee.phone}</p>
                </div>

                {/* Voucher */}
                {orderDetails.voucher && (
                    <div className="border rounded-lg shadow-sm p-6 bg-white">
                        <h2 className="text-xl font-semibold mb-4">Voucher</h2>
                        <p><strong>Tên Voucher:</strong> {orderDetails.voucher.voucherName}</p>
                        <p><strong>Giảm giá:</strong> {orderDetails.voucher.reducedPercent}%</p>
                    </div>
                )}

                {/* Nút quay lại */}
                <div className="text-center">
                    <button
                        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                        onClick={() => navigate("/admin/order")}
                    >
                        🔙 Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    );
}
