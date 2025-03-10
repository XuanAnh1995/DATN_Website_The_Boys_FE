import React, { useState, useEffect } from "react";
import SalePOS from "../../../services/POSService";
import CustomerService from "../../../services/CustomerService"
import { FaShoppingCart, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const SalePOSPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [discount, setDiscount] = useState(0);
    const [customerPaid, setCustomerPaid] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [phone, setPhone] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);

    const [selectedVoucher, setSelectedVoucher] = useState("");
    const [calculatedDiscount, setCalculatedDiscount] = useState(0);
    const [vouchers, setVouchers] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    // State cho form thêm khách hàng mới
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        fullname: "",
        phone: "",
        email: ""
    });

    // Mảng các hóa đơn đang tạo
    const [orders, setOrders] = useState([]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(null);

    // Nhân viên hiện tại (giả định)
    const [currentEmployee] = useState({ id: 1, name: "Nhân viên mặc định" });

    useEffect(() => {
        fetchProductDetails();
        fetchCustomers();
        fetchVouchers();
    }, []);

    // 🟢 Cập nhật tiền thừa khi khách nhập số tiền
    useEffect(() => {
        setChangeAmount(Math.max(customerPaid - totalAmount, 0)); // Đảm bảo không âm
    }, [customerPaid, totalAmount]);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer.id);
        setCustomerName(customer.fullname);
        setPhone(customer.phone);
        setEmail(customer.email);
        setSearchKeyword(customer.fullname); // Hiển thị tên khách hàng trong input
        setFilteredCustomers([]); // Ẩn danh sách gợi ý
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = allProducts.filter(product =>
                product.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(allProducts);
        }
    }, [searchTerm, allProducts]);


    const fetchProductDetails = async () => {
        try {
            const response = await SalePOS.getProductDetails({});
            setAllProducts(response?.content || []);
            setFilteredProducts(response?.content || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await SalePOS.getCustomers();
            setCustomers(response?.content || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
        }
    };

    const fetchVouchers = async () => {
        try {
            const response = await SalePOS.getVouchers();
            setVouchers(response?.content || []);
        } catch (error) {
            console.log("Lỗi khi lấy danh sách voucher", error)
        }
    }

    const handleSearchCustomer = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyword(keyword);

        if (!keyword) {
            setFilteredCustomers([]);
            return;
        }

        const results = customers.filter((customer) =>
            (customer.fullname?.toLowerCase() || "").includes(keyword) ||  // ✅ Kiểm tra fullname
            (customer.phone || "").includes(keyword) ||  // ✅ Kiểm tra phone
            (customer.email?.toLowerCase() || "").includes(keyword)  // ✅ Kiểm tra email
        );

        setFilteredCustomers(results);
    };

    const handleVoucherChange = (voucherCode) => {
        setSelectedVoucher(voucherCode);

        const voucher = vouchers.find((v) => v.voucherCode === voucherCode);
        if (voucher && currentOrder.totalAmount >= voucher.minCondition) {
            const discountAmount = Math.min(
                (currentOrder.totalAmount * voucher.reducedPercent) / 100,
                voucher.maxDiscount
            );
            setCalculatedDiscount(discountAmount);
        } else {
            setCalculatedDiscount(0);
        }
    };

    const handleAddNewCustomerClick = () => {
        setShowAddCustomerForm(true);
    };

    const handleCancelAddCustomer = () => {
        setShowAddCustomerForm(false);
        setNewCustomer({
            fullname: "",
            phone: "",
            email: ""
        });
    };

    const handleNewCustomerInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUseWalkInCustomer = () => {
        // Sử dụng khách vãng lai (không có thông tin cụ thể)
        setSelectedCustomer("walk-in"); // Giá trị đặc biệt cho khách vãng lai
        setCustomerName("Khách vãng lai");
        setPhone("");
        setEmail("");
        setShowAddCustomerForm(false);
    };

    // Hàm reset thông tin khách hàng
    const resetNewCustomer = () => {
        setNewCustomer({
            fullname: "",
            phone: "",
            email: ""
        });
        setShowAddCustomerForm(false);
    };

    const handleSaveNewCustomer = async () => {
        try {

            // console.log("Dữ liệu gửi đi:", newCustomer);

            // Loại bỏ khoảng trắng đầu/cuối khi nhập thông tin
            const trimmedCustomer = {
                fullname: newCustomer.fullname.trim(),
                phone: newCustomer.phone.trim(),
                email: newCustomer.email.trim(),
            };

            // // Kiểm tra nếu không nhập đầy đủ thông tin
            // if (!trimmedCustomer.fullname || !trimmedCustomer.phone || !trimmedCustomer.email) {
            //     alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
            //     return;
            // }

            // // Kiểm tra nếu không có thông tin gì - xem như khách vãng lai
            // if (!trimmedCustomer.fullname && !trimmedCustomer.phone && !trimmedCustomer.email) {
            //     handleUseWalkInCustomer();
            //     return;
            // }

            // Gọi API để lưu khách hàng mới
            const response = await CustomerService.add(trimmedCustomer);
            console.log("Response từ backend:", response);

            if (response && response.id) {
                // Thêm khách hàng mới vào danh sách
                setCustomers(prev => [...prev, response]);

                // Chọn khách hàng mới thêm
                handleSelectCustomer(response);

                // Reset form nhập liệu
                resetNewCustomer();

            } else {
                // alert("Không thể tạo khách hàng mới. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo khách hàng mới:", error);
            // alert(`Lỗi khi tạo khách hàng: ${error.response?.data?.message || "Không xác định"}`);
        }
    };

    const handleCreateOrder = () => {
        const newOrder = {
            id: Date.now(),
            items: [],
            totalAmount: 0,
            discount: 0,
            customerId: selectedCustomer,
            paymentMethod: "cash"
        };

        setOrders(prevOrders => [...prevOrders, newOrder]);
        setActiveOrderIndex(orders.length);
    };



    const handleAddToCart = (product) => {
        if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
            alert("Vui lòng tạo hóa đơn trước!");
            return;
        }

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];

            const existingItemIndex = currentOrder.items.findIndex(item => item.id === product.id);

            if (existingItemIndex !== -1) {
                currentOrder.items[existingItemIndex].quantity += 1;
            } else {
                currentOrder.items.push({ ...product, quantity: 1 });
            }

            // // Cập nhật tổng tiền
            // currentOrder.totalAmount = currentOrder.items.reduce(
            //     (sum, item) => sum + item.salePrice * item.quantity, 0
            // );

            currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
                // ✅ Đảm bảo giá gốc không bị undefined
                const salePrice = Number(item.salePrice) || 0;

                // ✅ Đảm bảo phần trăm giảm giá luôn là số
                const discountPercent = Number(item.promotion?.promotionPercent) || 0;

                // ✅ Tính giá sau giảm chính xác
                const discountedPrice = salePrice * (1 - discountPercent / 100);

                // ✅ Nhân với số lượng rồi cộng vào tổng
                return sum + discountedPrice * item.quantity;
            }, 0);


            return updatedOrders;
        });
    };


    const handleRemoveFromCart = (productId) => {
        if (activeOrderIndex === null) return;

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];

            currentOrder.items = currentOrder.items.filter(item => item.id !== productId);

            // Cập nhật tổng tiền
            currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
                // ✅ Đảm bảo giá gốc không bị undefined
                const salePrice = Number(item.salePrice) || 0;

                // ✅ Đảm bảo phần trăm giảm giá luôn là số
                const discountPercent = Number(item.promotion?.promotionPercent) || 0;

                // ✅ Tính giá sau giảm chính xác
                const discountedPrice = salePrice * (1 - discountPercent / 100);

                // ✅ Nhân với số lượng rồi cộng vào tổng
                return sum + discountedPrice * item.quantity;
            }, 0);


            return updatedOrders;
        });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (activeOrderIndex === null) return;
        if (newQuantity <= 0) return;

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];

            const itemIndex = currentOrder.items.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                currentOrder.items[itemIndex].quantity = newQuantity;
            }

            // Cập nhật tổng tiền
            currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
                // ✅ Đảm bảo giá gốc không bị undefined
                const salePrice = Number(item.salePrice) || 0;

                // ✅ Đảm bảo phần trăm giảm giá luôn là số
                const discountPercent = Number(item.promotion?.promotionPercent) || 0;

                // ✅ Tính giá sau giảm chính xác
                const discountedPrice = salePrice * (1 - discountPercent / 100);

                // ✅ Nhân với số lượng rồi cộng vào tổng
                return sum + discountedPrice * item.quantity;
            }, 0);


            return updatedOrders;
        });
    };

    const handleSwitchOrder = (index) => {
        setActiveOrderIndex(index);

        if (orders[index]) {
            const order = orders[index];
            setSelectedCustomer(order.customerId);
            setDiscount(order.discount);
            setPaymentMethod(order.paymentMethod);

            // Cập nhật thông tin khách hàng
            if (order.customerId === "walk-in") {
                setCustomerName("Khách vãng lai");
                setPhone("");
                setEmail("");
            } else {
                const selected = customers.find(c => c.id === order.customerId);
                if (selected) {
                    setPhone(selected.phone || "");
                    setCustomerName(selected.fullname || "");
                    setEmail(selected.email || "");
                }
            }
        }
    };

    const handleRemoveOrder = (index) => {
        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            updatedOrders.splice(index, 1);
            return updatedOrders;
        });

        if (activeOrderIndex === index) {
            setActiveOrderIndex(null);
        } else if (activeOrderIndex > index) {
            setActiveOrderIndex(activeOrderIndex - 1);
        }
    };

    const handleDiscountChange = (value) => {
        setDiscount(value);

        if (activeOrderIndex !== null) {
            setOrders(prevOrders => {
                const updatedOrders = [...prevOrders];
                updatedOrders[activeOrderIndex].discount = value;
                return updatedOrders;
            });
        }
    };

    useEffect(() => {
        if (activeOrderIndex !== null && orders[activeOrderIndex]) {
            const totalAmount = orders[activeOrderIndex].totalAmount;
            setChangeAmount(customerPaid - (totalAmount - discount));
        }
    }, [customerPaid, activeOrderIndex, orders, discount]);

    const handlePayment = async () => {
        if (activeOrderIndex === null) {
            console.log("⚠ Không có hóa đơn nào được chọn.");
            return;
        }

        const currentOrder = orders[activeOrderIndex];

        if (currentOrder.items.length === 0) {
            console.log("⚠ Giỏ hàng trống!");
            return;
        }

        if (!selectedCustomer) {
            console.log("⚠ Không có khách hàng nào được chọn.");
            return;
        }

        // Đối với khách vãng lai, ta cần xử lý đặc biệt
        let customerId = selectedCustomer;
        if (selectedCustomer === "walk-in") {
            console.log("🟢 Chọn khách vãng lai, sử dụng ID 23.");
            customerId = 23; // Giả sử 23 là ID cho khách vãng lai
        }

        const orderRequest = {
            customerId: customerId,
            employeeId: currentEmployee.id,
            voucherId: null, // Có thể thêm tính năng chọn voucher sau
            paymentMethod: paymentMethod,
            orderDetails: currentOrder.items.map(item => ({
                productDetailId: item.id,
                quantity: item.quantity
            }))
        };

        try {

            // 🟢 Bước 1: Tạo đơn hàng
            console.log("📌 Gửi yêu cầu tạo đơn hàng:", orderRequest);
            const createOrderResponse = await SalePOS.checkout(orderRequest);

            if (!createOrderResponse || !createOrderResponse.data || !createOrderResponse.data.data) {
                console.log("❌ Không thể tạo đơn hàng, vui lòng thử lại!");
                return;
            }

            const orderId = createOrderResponse.data.data.id; // 🟢 Lấy `orderId` từ phản hồi BE
            console.log("✅ Đơn hàng được tạo với ID:", orderId);

            // 🟢 Bước 2: Gửi yêu cầu thanh toán cho đơn hàng vừa tạo
            const paymentResponse = await SalePOS.completePayment(orderId);

            if (paymentResponse && paymentResponse.status === "success") {
                console.log("✅ Thanh toán thành công!");
                handleRemoveOrder(activeOrderIndex);
            } else {
                console.log("❌ Thanh toán thất bại!");
            }
        } catch (error) {
            console.error("❌ Lỗi khi thanh toán:", error);
        }
    };

    // Lấy đơn hàng hiện tại
    const currentOrder = activeOrderIndex !== null && activeOrderIndex < orders.length
        ? orders[activeOrderIndex]
        : { items: [], totalAmount: 0, discount: 0 };

    return (
        <div className="p-4 bg-gray-100 min-h-screen relative">

            {/* Form thêm khách hàng mới */}
            {showAddCustomerForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Tìm kiếm hoặc thêm khách hàng</h3>
                            <button
                                onClick={handleCancelAddCustomer}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Ô tìm kiếm khách hàng */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={handleSearchCustomer}
                                placeholder="🔍 Nhập tên, số điện thoại hoặc email khách hàng..."
                                className="border p-2 w-full rounded-md shadow-sm"
                            />
                            {/* Danh sách gợi ý khách hàng */}
                            {filteredCustomers.length > 0 && (
                                <ul className="absolute z-10 bg-white border rounded-md w-full mt-1 shadow">
                                    {filteredCustomers.map((customer) => (
                                        <li
                                            key={customer.id}
                                            onClick={() => handleSelectCustomer(customer)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {customer.fullname} - {customer.phone}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>

                        {/* Hiển thị thông tin khách hàng đã chọn */}
                        {selectedCustomer && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                <p><strong>Tên:</strong> {selectedCustomer.fullname}</p>
                                <p><strong>SĐT:</strong> {selectedCustomer.phone}</p>
                                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                            </div>
                        )}

                        {/* Nếu không tìm thấy khách hàng, hiển thị form thêm mới */}
                        {!selectedCustomer && (
                            <div className="space-y-3 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={newCustomer.fullname}
                                        onChange={handleNewCustomerInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Nhập họ tên khách hàng"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={newCustomer.phone}
                                        onChange={handleNewCustomerInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newCustomer.email}
                                        onChange={handleNewCustomerInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Nút Hành Động */}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleUseWalkInCustomer}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Khách vãng lai
                            </button>

                            <button
                                onClick={handleSaveNewCustomer}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Lưu khách hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center bg-red-600 p-3 text-white">
                <input
                    type="text"
                    placeholder="F3) Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 p-2 border rounded text-black"
                />
                <button onClick={handleCreateOrder} className="ml-2 bg-white text-red-600 px-4 py-2 rounded">
                    Tạo hóa đơn mới
                </button>
            </div>

            {/* Danh sách các hóa đơn đang tạo */}
            {orders.length > 0 && (
                <div className="flex overflow-x-auto my-2 bg-white p-2 rounded shadow">
                    {orders.map((order, index) => (
                        <div
                            key={order.id}
                            className={`min-w-[150px] cursor-pointer p-2 mr-2 rounded ${index === activeOrderIndex ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100'}`}
                            onClick={() => handleSwitchOrder(index)}
                        >
                            <div className="flex justify-between items-center">
                                <span>Hóa đơn #{index + 1}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveOrder(index);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                            <div className="text-sm">{order.items.length} sản phẩm</div>
                            <div className="font-bold">{order.totalAmount.toLocaleString()} VND</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Giỏ hàng hiện tại */}
                <div className="col-span-2 bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2">Giỏ hàng {activeOrderIndex !== null ? `(Hóa đơn #${activeOrderIndex + 1})` : ""}</h3>

                    {!activeOrderIndex && activeOrderIndex !== 0 ? (
                        <div className="text-center text-gray-500 p-4">
                            <img src="/src/assets/empty_box.png" alt="Empty" className="w-32 mx-auto" />
                            <p>Vui lòng tạo hoặc chọn một hóa đơn</p>
                        </div>
                    ) : currentOrder.items.length === 0 ? (
                        <div className="text-center text-gray-500 p-4">
                            <img src="/src/assets/empty_box.png" alt="Empty" className="w-32 mx-auto" />
                            <p>Giỏ hàng của bạn chưa có sản phẩm nào!</p>
                        </div>
                    ) : (
                        <table className="min-w-full border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2">Tên Sản Phẩm</th>
                                    <th className="p-2">Giá Bán</th>
                                    <th className="p-2">Số Lượng</th>
                                    <th className="p-2">Thành Tiền</th>
                                    <th className="p-2">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrder.items.map((item) => {
                                    const discountPercent = item.promotion?.promotionPercent || 0;
                                    const discountedPrice = discountPercent > 0
                                        ? item.salePrice * (1 - discountPercent / 100)
                                        : item.salePrice;

                                    return (
                                        <tr key={item.id} className="text-center border">
                                            <td className="p-2">{item.product?.productName || "Không có tên"}</td>
                                            <td className="p-2 text-blue-600 font-bold">
                                                {discountedPrice.toLocaleString()} VND
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={isNaN(item.quantity) || item.quantity < 1 ? 1 : item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                    className="w-16 p-1 text-center border rounded"
                                                />
                                            </td>
                                            <td className="p-2 text-red-600 font-bold">
                                                {(discountedPrice * item.quantity).toLocaleString()} VND
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white p-1 rounded"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h3>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                                    <th className="py-2 px-4 border-b text-left">Màu sắc</th>
                                    <th className="py-2 px-4 border-b text-left">Kích thước</th>
                                    <th className="py-2 px-4 border-b text-left">Số lượng</th>
                                    <th className="py-2 px-4 border-b text-left">Giá bán</th>
                                    <th className="py-2 px-4 border-b text-left">Giảm giá</th>
                                    <th className="py-2 px-4 border-b text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => {
                                        const discountPercent = product.promotion?.promotionPercent || 0;
                                        const discount = discountPercent > 0 ? `${discountPercent}%` : "Không có";

                                        const discountedPrice = discountPercent > 0
                                            ? product.salePrice * (1 - discountPercent / 100)
                                            : product.salePrice;

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border-b">{product.product?.productName || "Không có tên"}</td>
                                                <td className="py-2 px-4 border-b">{product.color?.name || "Không xác định"}</td>
                                                <td className="py-2 px-4 border-b">{product.size?.name || "Không xác định"}</td>
                                                <td className="py-2 px-4 border-b text-center">{product.quantity || 0}</td>
                                                <td className="py-2 px-4 border-b text-red-600 font-bold">
                                                    {product.salePrice?.toLocaleString()} VND
                                                </td>
                                                <td className="py-2 px-4 border-b text-green-600 font-bold">{discount}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                                                    >
                                                        <FaShoppingCart size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-2 px-4 text-center text-gray-500">Không có sản phẩm nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                </div>

                {/* Thông tin thanh toán */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Khách hàng</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddNewCustomerClick}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            title="Thêm khách hàng mới"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {customerName && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                            <p><strong>Tên:</strong> {customerName}</p>
                            {phone && <p><strong>SĐT:</strong> {phone}</p>}
                            {email && <p><strong>Email:</strong> {email}</p>}
                        </div>
                    )}

                    <h3 className="text-lg font-semibold mt-4">Thanh toán</h3>
                    <p>Tổng tiền: {currentOrder.totalAmount.toLocaleString()} VND</p>

                    <div className="flex items-center mt-2">
                        <label className="w-1/3">Voucher (F6):</label>
                        <select
                            value={selectedVoucher}
                            onChange={(e) => handleVoucherChange(e.target.value)}
                            className="border p-2 flex-1"
                        >
                            <option value="">Chọn voucher</option>
                            {vouchers.length > 0 && vouchers.map((v) => (
                                <option key={v.id} value={v.voucherCode}>
                                    {v.voucherCode} - {v.voucherName}
                                </option>
                            ))}
                        </select>
                    </div>


                    <p className="font-bold text-lg mt-2">
                        KHÁCH PHẢI TRẢ: {(currentOrder.totalAmount - calculatedDiscount).toLocaleString()} VND
                    </p>

                    <div className="mt-2">
                        <label>Phương thức thanh toán:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="border p-2 w-full mt-1"
                        >
                            <option value="cash">Tiền mặt</option>
                            <option value="card">Thẻ</option>
                            <option value="transfer">Chuyển khoản</option>
                        </select>
                    </div>

                    <div className="mt-2">
                        <label>Khách thanh toán:</label>
                        <input
                            type="number"
                            min="0"
                            value={customerPaid || ""}
                            onChange={(e) => setCustomerPaid(Number(e.target.value) || 0)} // 🟢 Đảm bảo không bị NaN khi input rỗng
                            className="border p-2 w-full mt-1"
                        />
                    </div>

                    <p className="mt-2">
                        Tiền thừa trả khách: {changeAmount.toLocaleString()} VND
                    </p>

                    <button
                        onClick={handlePayment}
                        className="bg-green-600 text-white w-full py-2 mt-4 rounded"
                        disabled={!activeOrderIndex && activeOrderIndex !== 0}
                    >
                        Thanh toán (F9)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalePOSPage;