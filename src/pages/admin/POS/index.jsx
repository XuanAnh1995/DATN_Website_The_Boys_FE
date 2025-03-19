import React, { useState, useEffect } from "react";
import SalePOS from "../../../services/POSService";

const SalePOSPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [productDetails, setProductDetails] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [customerPaid, setCustomerPaid] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [phone, setPhone] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await SalePOS.getProductDetails({});
            setProductDetails(response?.content || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center bg-red-600 p-3 text-white rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="F3) Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 p-2 border rounded text-black"
                />
                <button className="ml-2 bg-white text-red-600 px-4 py-2 rounded shadow-md">Hóa đơn mặc định</button>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Danh sách sản phẩm / Giỏ hàng */}
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                    {productDetails.length === 0 ? (
                        <div className="text-center text-gray-500">
                            <img src="/empty-box.png" alt="Empty" className="w-32 mx-auto" />
                            <p>Đơn hàng của bạn chưa có sản phẩm nào!</p>
                        </div>
                    ) : (
                        <table className="min-w-full border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2">Tên Sản Phẩm</th>
                                    <th className="p-2">Giá</th>
                                    <th className="p-2">Số Lượng</th>
                                    <th className="p-2">Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productDetails.map((pd) => (
                                    <tr key={pd.id} className="text-center border">
                                        <td className="p-2">{pd.product?.productName || "Không có tên"}</td>
                                        <td className="p-2">{pd.salePrice?.toLocaleString()} VND</td>
                                        <td className="p-2">{pd.quantity}</td>
                                        <td className="p-2">{(pd.salePrice * pd.quantity).toLocaleString()} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Thanh toán */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Khách hàng</h3>
                    <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="border p-2 w-full rounded mb-4">
                        <option value="">Chọn khách hàng</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.customerName}</option>
                        ))}
                    </select>
                    <button className="bg-blue-600 text-white w-full py-2 rounded mb-4"> + </button>
                    {/* Thông tin khách hàng */}
                    <div className="bg-gray-200 p-4 rounded mb-4">
                        <h4 className="font-semibold mb-2">Khách hàng</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="📞 Số điện thoại (F4)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Tên khách"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <select
                                className="w-full p-2 border rounded"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            >
                                <option value="">-- Tỉnh/Thành phố --</option>
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            >
                                <option value="">-- Quận/Huyện --</option>
                            </select>
                            <select
                                className="w-full p-2 border rounded"
                                value={ward}
                                onChange={(e) => setWard(e.target.value)}
                            >
                                <option value="">-- Phường/Xã --</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Địa chỉ chi tiết"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Thanh toán</h3>
                    <p className="mb-2">Tổng tiền: {totalAmount.toLocaleString()} VND</p>
                    <p className="mb-2">Chiết khấu (F6): {discount.toLocaleString()} VND</p>
                    <p className="mb-2">KHÁCH PHẢI TRẢ: {(totalAmount - discount).toLocaleString()} VND</p>
                    <p className="mb-2">Tiền khách đưa (F8):
                        <input type="number" value={customerPaid} onChange={(e) => setCustomerPaid(Number(e.target.value))} className="ml-2 border p-1 rounded" />
                    </p>
                    <p className="mb-4">Tiền thừa trả khách: {changeAmount.toLocaleString()} VND</p>
                    <div className="mb-4">
                        <label className="mr-2">Phương thức thanh toán:</label>
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="border p-2 rounded">
                            <option value="cash">Tiền mặt</option>
                            <option value="card">Thẻ</option>
                            <option value="bank">Chuyển khoản</option>
                        </select>
                    </div>
                    <button className="bg-green-600 text-white w-full py-2 rounded">Thanh toán (F9)</button>
                </div>
            </div>
        </div>
    );
};

export default SalePOSPage;