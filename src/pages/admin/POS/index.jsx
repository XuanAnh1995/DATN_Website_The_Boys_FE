import React, { useState, useEffect } from "react";
import SalePOS from "../../../services/POSService";
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
    }, []);

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

    const handleCustomerChange = (e) => {
        const customerId = Number(e.target.value);
        setSelectedCustomer(customerId);
        const selected = customers.find(c => c.id === customerId);
        if (selected) {
            setPhone(selected.phone || "");
            setCustomerName(selected.fullname || "");
            setEmail(selected.email || "");
        } else {
            setPhone("");
            setCustomerName("");
            setEmail("");
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

    const handleSaveNewCustomer = async () => {
        try {
            // Kiểm tra nếu không có thông tin gì - xem như khách vãng lai
            if (!newCustomer.fullname && !newCustomer.phone && !newCustomer.email) {
                handleUseWalkInCustomer();
                return;
            }
            
            // Gọi API để lưu khách hàng mới
            const response = await SalePOS.createCustomer(newCustomer);
            
            if (response && response.id) {
                // Thêm khách hàng mới vào danh sách
                setCustomers(prev => [...prev, response]);
                
                // Chọn khách hàng mới thêm
                setSelectedCustomer(response.id);
                setCustomerName(response.fullname);
                setPhone(response.phone);
                setEmail(response.email);
                
                // Đóng form
                setShowAddCustomerForm(false);
                setNewCustomer({
                    fullname: "",
                    phone: "",
                    email: ""
                });
            } else {
                alert("Không thể tạo khách hàng mới. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo khách hàng mới:", error);
            alert("Đã xảy ra lỗi khi tạo khách hàng mới!");
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
            
            // Cập nhật tổng tiền
            currentOrder.totalAmount = currentOrder.items.reduce(
                (sum, item) => sum + item.salePrice * item.quantity, 0
            );
            
            return updatedOrders;
        });
    };


    // const handleCreateOrder = async () => {
    //     try {
    //         const orderRequest = {
    //             customerId: selectedCustomer === "walk-in" ? 0 : selectedCustomer,
    //             employeeId: currentEmployee.id,
    //             voucherId: null,
    //             paymentMethod: paymentMethod,
    //             statusOrder: 1, // Giả sử 1 là trạng thái "Mới tạo"
    //             kindOfOrder: 1, // Giả sử 1 là loại đơn hàng POS
    //             orderDetails: [] // Ban đầu không có sản phẩm
    //         };
            
    //         // Gọi API tạo đơn hàng
    //         const response = await SalePOS.createOrder(orderRequest);
            
    //         if (response && response.data) {
    //             const newOrder = {
    //                 id: response.data.id,
    //                 items: response.data.orderDetails || [],
    //                 totalAmount: response.data.totalAmount || 0,
    //                 discount: 0,
    //                 customerId: selectedCustomer,
    //                 paymentMethod: paymentMethod
    //             };
                
    //             setOrders(prevOrders => [...prevOrders, newOrder]);
    //             setActiveOrderIndex(orders.length);
                
    //             // Thông báo thành công
    //             alert("Đã tạo hóa đơn mới thành công!");
    //         } else {
    //             alert("Có lỗi xảy ra khi tạo hóa đơn!");
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi tạo hóa đơn:", error);
    //         alert("Có lỗi xảy ra khi tạo hóa đơn: " + error.message);
    //     }
    // };
    
    // const handleAddToCart = async (product) => {
    //     if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
    //         alert("Vui lòng tạo hóa đơn trước!");
    //         return;
    //     }
        
    //     const currentOrder = orders[activeOrderIndex];
        
    //     try {
    //         const productDetailRequest = {
    //             productDetailId: product.id,
    //             quantity: 1 // Mặc định thêm 1 sản phẩm
    //         };
            
    //         // Gọi API thêm sản phẩm vào giỏ hàng
    //         const response = await SalePOS.addProductToCart(currentOrder.id, productDetailRequest);
            
    //         if (response) {
    //             // Cập nhật state với dữ liệu trả về từ server
    //             setOrders(prevOrders => {
    //                 const updatedOrders = [...prevOrders];
    //                 updatedOrders[activeOrderIndex] = {
    //                     ...currentOrder,
    //                     items: response.orderDetails || [],
    //                     totalAmount: response.totalAmount || 0
    //                 };
    //                 return updatedOrders;
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    //         alert("Có lỗi xảy ra khi thêm sản phẩm!");
    //     }
    // };

    const handleRemoveFromCart = (productId) => {
        if (activeOrderIndex === null) return;
        
        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];
            
            currentOrder.items = currentOrder.items.filter(item => item.id !== productId);
            
            // Cập nhật tổng tiền
            currentOrder.totalAmount = currentOrder.items.reduce(
                (sum, item) => sum + item.salePrice * item.quantity, 0
            );
            
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
            currentOrder.totalAmount = currentOrder.items.reduce(
                (sum, item) => sum + item.salePrice * item.quantity, 0
            );
            
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
            const selected = customers.find(c => c.id === order.customerId);
            if (selected) {
                setPhone(selected.phone || "");
                setCustomerName(selected.fullname || "");
                setEmail(selected.email || "");
            } else if (order.customerId === "walk-in") {
                setCustomerName("Khách vãng lai");
                setPhone("");
                setEmail("");
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
            alert("Vui lòng chọn hóa đơn để thanh toán!");
            return;
        }
        
        const currentOrder = orders[activeOrderIndex];
        
        if (currentOrder.items.length === 0) {
            alert("Giỏ hàng trống! Vui lòng thêm sản phẩm.");
            return;
        }
        
        if (!selectedCustomer) {
            alert("Vui lòng chọn khách hàng!");
            return;
        }
        
        try {
            // Đối với khách vãng lai, ta cần xử lý đặc biệt
            let customerId = selectedCustomer;
            if (selectedCustomer === "walk-in") {
                // Bạn có thể có một ID mặc định cho khách vãng lai trong hệ thống
                // hoặc có thể tạo một khách hàng mới đại diện cho khách vãng lai
                customerId = 0; // Giả sử 0 là ID cho khách vãng lai
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
            
            // Gọi API thanh toán
            const response = await SalePOS.checkout(orderRequest);
            
            if (response && response.status === "success") {
                alert("Thanh toán thành công!");
                // Xóa hóa đơn đã thanh toán
                handleRemoveOrder(activeOrderIndex);
            } else {
                alert("Thanh toán thất bại: " + (response?.message || "Có lỗi xảy ra"));
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra khi thanh toán!");
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Thêm khách hàng mới</h3>
                            <button 
                                onClick={handleCancelAddCustomer}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
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
                            <img src="/empty-box.png" alt="Empty" className="w-32 mx-auto" />
                            <p>Vui lòng tạo hoặc chọn một hóa đơn</p>
                        </div>
                    ) : currentOrder.items.length === 0 ? (
                        <div className="text-center text-gray-500 p-4">
                            <img src="/empty-box.png" alt="Empty" className="w-32 mx-auto" />
                            <p>Giỏ hàng của bạn chưa có sản phẩm nào!</p>
                        </div>
                    ) : (
                        <table className="min-w-full border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2">Tên Sản Phẩm</th>
                                    <th className="p-2">Giá</th>
                                    <th className="p-2">Số Lượng</th>
                                    <th className="p-2">Thành Tiền</th>
                                    <th className="p-2">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrder.items.map((item) => (
                                    <tr key={item.id} className="text-center border">
                                        <td className="p-2">{item.product?.productName || "Không có tên"}</td>
                                        <td className="p-2">{item.salePrice?.toLocaleString()} VND</td>
                                        <td className="p-2">
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={item.quantity} 
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                className="w-16 p-1 text-center border rounded"
                                            />
                                        </td>
                                        <td className="p-2">{(item.salePrice * item.quantity).toLocaleString()} VND</td>
                                        <td className="p-2">
                                            <button 
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white p-1 rounded"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    {/* Danh sách sản phẩm có thể thêm vào giỏ hàng */}
                    <h3 className="text-lg font-semibold mt-6 mb-2">Danh sách sản phẩm</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="border p-2 rounded hover:shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">{product.product?.productName || "Không có tên"}</div>
                                        <div className="text-red-600 font-bold">{product.salePrice?.toLocaleString()} VND</div>
                                    </div>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-full"
                                    >
                                        <FaShoppingCart size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thông tin thanh toán */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Khách hàng</h3>
                    <div className="flex gap-2">
                        <select value={selectedCustomer} onChange={handleCustomerChange} className="border p-2 w-full">
                            <option value="">Chọn khách hàng</option>
                            {selectedCustomer === "walk-in" && (
                                <option value="walk-in">Khách vãng lai</option>
                            )}
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.fullname}</option>
                            ))}
                        </select>
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
                        <label className="w-1/3">Chiết khấu (F6):</label>
                        <input 
                            type="number" 
                            value={discount} 
                            onChange={(e) => handleDiscountChange(Number(e.target.value))} 
                            className="border p-2 flex-1" 
                        />
                        <span className="ml-2">VND</span>
                    </div>
                    
                    <p className="font-bold text-lg mt-2">KHÁCH PHẢI TRẢ: {(currentOrder.totalAmount - discount).toLocaleString()} VND</p>
                    
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
                            value={customerPaid} 
                            onChange={(e) => setCustomerPaid(Number(e.target.value))} 
                            className="border p-2 w-full mt-1" 
                        />
                    </div>
                    
                    <p className="mt-2">Tiền thừa trả khách: {changeAmount > 0 ? changeAmount.toLocaleString() : 0} VND</p>
                    
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