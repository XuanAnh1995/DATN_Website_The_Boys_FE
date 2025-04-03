import React, { useState, useEffect, useMemo } from "react";
import SalePOS from "../../../services/POSService";
import ColorService from "../../../services/ColorService"
import SizeService from "../../../services/SizeService"
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
    const [filter, setFilter] = useState({
        minPrice: "",
        maxPrice: "",
        color: "",
        size: ""
    });

    // State mới cho danh sách màu sắc và kích thước
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    const [selectedVoucher, setSelectedVoucher] = useState("");
    const [calculatedDiscount, setCalculatedDiscount] = useState(0);
    const [vouchers, setVouchers] = useState([]);
    // Thêm state để lưu voucher tối ưu
    const [optimalVoucher, setOptimalVoucher] = useState(null);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Số sản phẩm trên mỗi trang

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Mảng các hóa đơn đang tạo
    const [orders, setOrders] = useState([]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(null);

    // Định nghĩa currentOrder bằng useMemo
    const currentOrder = useMemo(() => {
        return activeOrderIndex !== null && activeOrderIndex < orders.length
            ? orders[activeOrderIndex]
            : { items: [], totalAmount: 0, discount: 0 };
    }, [activeOrderIndex, orders]);

    // State cho form thêm khách hàng mới
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        fullname: "",
        phone: "",
        email: ""
    });

    // Nhân viên hiện tại (giả định)
    const [currentEmployee] = useState({ id: 1, name: "Nhân viên mặc định" });

    useEffect(() => {
        fetchProductDetails();
        fetchCustomers();
        fetchVouchers();
        fetchColors(); // Lấy danh sách màu sắc
        fetchSizes();  // Lấy danh sách kích thước
    }, []);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer.id);
        setCustomerName(customer.fullname);
        setPhone(customer.phone);
        setEmail(customer.email);
        setSearchKeyword(customer.fullname); // Hiển thị tên khách hàng trong input
        setFilteredCustomers([]); // Ẩn danh sách gợi ý
        if (activeOrderIndex !== null) {
            setOrders(prevOrders => {
                const updatedOrders = [...prevOrders];
                updatedOrders[activeOrderIndex].customerId = customer.id;
                return updatedOrders;
            });
        }
    };

    useEffect(() => {
        let filtered = allProducts;
        // Lọc theo searchTerm (tìm kiếm chung)
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo màu sắc
        if (filter.color) {
            filtered = filtered.filter(product =>
                product.color?.name?.toLowerCase().includes(filter.color.toLowerCase())
            );
        }

        // Lọc theo kích thước
        if (filter.size) {
            filtered = filtered.filter(product =>
                product.size?.name?.toLowerCase().includes(filter.size.toLowerCase())
            );
        }

        // Lọc theo khoảng giá
        const minPrice = Number(filter.minPrice) || 0;
        const maxPrice = Number(filter.maxPrice) || Infinity;
        filtered = filtered.filter(product => {
            const now = new Date();
            const startDate = product.promotion?.startDate ? new Date(product.promotion.startDate) : null;
            const endDate = product.promotion?.endDate ? new Date(product.promotion.endDate) : null;
            const isPromotionActive = startDate && endDate && now >= startDate && now <= endDate;
            const discountPercent = isPromotionActive ? product.promotion.promotionPercent : 0;
            const effectivePrice = discountPercent > 0
                ? product.salePrice * (1 - discountPercent / 100)
                : product.salePrice;

            return effectivePrice >= minPrice && effectivePrice <= maxPrice;
        });

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset về trang đầu tiên khi áp dụng bộ lọc
    }, [searchTerm, allProducts, filter]);

    // Tìm voucher tối ưu mỗi khi totalAmount thay đổi
    useEffect(() => {
        if (currentOrder?.totalAmount > 0) {
            const validVouchers = vouchers.filter(v => {
                const now = new Date();
                const startDate = new Date(v.startDate);
                const endDate = new Date(v.endDate);
                return (
                    v.status === true &&
                    currentOrder.totalAmount >= v.minCondition &&
                    now >= startDate && now <= endDate
                );
            });

            // Tính giá trị giảm giá cho từng voucher và tìm voucher tối ưu
            const vouchersWithDiscount = validVouchers.map(voucher => ({
                ...voucher,
                discountValue: calculateDiscount(voucher, currentOrder.totalAmount)
            }));

            // Sắp xếp theo giá trị giảm giá giảm dần
            const sortedVouchers = vouchersWithDiscount.sort((a, b) => b.discountValue - a.discountValue);

            // Lấy voucher tối ưu (giảm giá nhiều nhất)
            const bestVoucher = sortedVouchers[0];
            setOptimalVoucher(bestVoucher || null);

            // Tự động áp dụng voucher tối ưu (tùy chọn)
            if (bestVoucher && !selectedVoucher) {
                handleVoucherChange(bestVoucher.voucherCode);
            }
        } else {
            setOptimalVoucher(null);
        }
    }, [currentOrder.totalAmount, vouchers, selectedVoucher]);

    // Hàm lấy danh sách sản phẩm chi tiết
    const fetchProductDetails = async () => {
        try {
            const response = await SalePOS.getProductDetails({});
            setAllProducts(response?.content || []);
            setFilteredProducts(response?.content || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    // Hàm lấy danh sách khách hàng
    const fetchCustomers = async () => {
        try {
            const response = await SalePOS.getCustomers();
            setCustomers(response?.content || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
        }
    };

    // Hàm lấy danh sách voucher
    const fetchVouchers = async () => {
        try {
            const response = await SalePOS.getVouchers();
            setVouchers(response?.content || []);
        } catch (error) {
            console.log("Lỗi khi lấy danh sách voucher", error)
        }
    }

    // Hàm lấy danh sách màu sắc
    const fetchColors = async () => {
        try {
            const response = await ColorService.getAllColors();
            setColors(response.content || []); // Giả sử API trả về { content: [...] }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách màu sắc:", error);
        }
    };

    // Hàm lấy danh sách kích thước
    const fetchSizes = async () => {
        try {
            const response = await SizeService.getAllSizes();
            setSizes(response.content || []); // Giả sử API trả về { content: [...] }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách kích thước:", error);
        }
    };

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
        console.log("📌 Voucher được chọn:", voucherCode);

        setSelectedVoucher(voucherCode);

        const voucher = vouchers.find((v) => v.voucherCode === voucherCode);

        console.log("📌 Voucher tìm thấy:", voucher);

        if (voucher && currentOrder.totalAmount >= voucher.minCondition) {
            const discountAmount = Math.min(
                (currentOrder.totalAmount * voucher.reducedPercent) / 100,
                voucher.maxDiscount
            );

            console.log("✅ Giảm giá áp dụng:", discountAmount);

            setCalculatedDiscount(discountAmount);
            if (activeOrderIndex !== null) {
                setOrders(prevOrders => {
                    const updatedOrders = [...prevOrders];
                    updatedOrders[activeOrderIndex].voucherId = voucher.id;
                    return updatedOrders;
                });
            }
        } else {
            console.log("❌ Không đủ điều kiện để áp dụng voucher.");

            setCalculatedDiscount(0);
        }
    };

    // Hàm tính giá trị giảm giá thực tế cho một voucher
    const calculateDiscount = (voucher, totalAmount) => {
        if (!voucher || totalAmount < voucher.minCondition) return 0;
        const discountAmount = Math.min(
            (totalAmount * voucher.reducedPercent) / 100,
            voucher.maxDiscount
        );
        return discountAmount;
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
        console.log("🔄 Resetting newCustomer...");
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

            // Gọi API để lưu khách hàng mới
            const response = await CustomerService.add(trimmedCustomer);
            console.log("Response từ backend:", response);

            // 🟢 Kiểm tra response và cập nhật UI
            if (response?.data?.id) {
                console.log("🟢 Khách hàng đã được tạo, thêm vào danh sách...");
                setCustomers(prev => [...prev, response.data]);

                console.log("🟢 Chọn khách hàng mới...");
                handleSelectCustomer(response.data);

                console.log("🟢 Reset form khách hàng...");
                resetNewCustomer(); // Reset form
            } else {
                console.log("❌ Không thể tạo khách hàng mới, dữ liệu trả về:", response);
            }

        } catch (error) {
            console.error("Lỗi khi tạo khách hàng mới:", error);
            // alert(`Lỗi khi tạo khách hàng: ${error.response?.data?.message || "Không xác định"}`);
        }
    };


    const handleCreateOrder = async () => {
        try {
            const orderData = {
                customerId: selectedCustomer && selectedCustomer !== "walk-in" ? selectedCustomer : -1,
                employeeId: 1, // Tạm thời set cứng ID nhân viên là 1
                voucherId: selectedVoucher ? vouchers.find(v => v.voucherCode === selectedVoucher)?.id : null,
                paymentMethod: "cash",
            };

            const newOrder = await SalePOS.createOrder(orderData);

            setOrders(prevOrders => [...prevOrders, {
                id: newOrder.id,
                items: [],
                totalAmount: 0,
                discount: 0,
                customerId: orderData.customerId,
                voucherId: orderData.voucherId,
                paymentMethod: orderData.paymentMethod
            }]);

            console.log("🔍 Kiểm tra giá trị customerId trước khi gửi:", selectedCustomer);
            setActiveOrderIndex(orders.length);
            console.log("✅ Đơn hàng mới đã được tạo:", newOrder);
        } catch (error) {
            console.error("❌ Lỗi khi tạo đơn hàng:", error);
        }
    };


    // thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product) => {
        console.log("🛒 [ADD TO CART] Bắt đầu thêm sản phẩm vào giỏ hàng...");
        if (activeOrderIndex === null || activeOrderIndex >= orders.length) {
            alert("Vui lòng tạo hóa đơn trước!");
            console.warn("⚠ Không có đơn hàng nào được chọn. Hãy tạo đơn hàng trước!");
            return;
        }

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];

            console.log("📌 [ORDER] Đơn hàng hiện tại:", currentOrder);

            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingItemIndex = currentOrder.items.findIndex(item => item.id === product.id);
            if (existingItemIndex !== -1) {
                const existingItem = currentOrder.items[existingItemIndex];

                // Kiểm tra nếu số lượng vượt quá tồn kho
                if (existingItem.quantity >= product.quantity) {
                    alert(`Sản phẩm "${product.product?.productName}" chỉ còn ${product.quantity} sản phẩm trong kho.`);
                    return updatedOrders;
                }

                console.log(`🔄 [UPDATE] Sản phẩm ${product.id} đã có trong giỏ hàng, tăng số lượng lên.`);
                currentOrder.items[existingItemIndex].quantity += 1;
            } else {
                console.log(`➕ [NEW] Thêm sản phẩm mới:`, product);
                currentOrder.items.push({
                    ...product,
                    quantity: 1,
                    quantityAvailable: product.quantity     // Lưu số lượng tồn kho
                });
            }

            currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
                const salePrice = Number(item.salePrice) || 0;
                const discountPercent = Number(item.promotion?.promotionPercent) || 0;
                const discountedPrice = salePrice * (1 - discountPercent / 100);
                return sum + discountedPrice * item.quantity;
            }, 0);

            console.log("💰 [TOTAL] Tổng tiền đơn hàng sau khi thêm sản phẩm:", currentOrder.totalAmount);
            return updatedOrders;
        });
    };

    // quá trình xóa sản phẩm khỏi giỏ hàng.
    const handleRemoveFromCart = (productId) => {
        console.log("🗑 [REMOVE FROM CART] Bắt đầu xóa sản phẩm khỏi giỏ hàng...");
        if (activeOrderIndex === null) {
            console.warn("⚠ Không có đơn hàng nào được chọn.");
            return;
        }

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];

            console.log("📌 [ORDER] Trước khi xóa, danh sách sản phẩm:", currentOrder.items);

            // Lọc ra danh sách sản phẩm mới (loại bỏ sản phẩm đã xóa)
            currentOrder.items = currentOrder.items.filter(item => item.id !== productId);

            currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
                const salePrice = Number(item.salePrice) || 0;
                const discountPercent = Number(item.promotion?.promotionPercent) || 0;
                const discountedPrice = salePrice * (1 - discountPercent / 100);
                return sum + discountedPrice * item.quantity;
            }, 0);

            console.log("💰 [TOTAL] Tổng tiền sau khi xóa sản phẩm:", currentOrder.totalAmount);
            console.log("✅ [SUCCESS] Sản phẩm đã được xóa thành công!");
            return updatedOrders;
        });
    };

    // quá trình thay đổi số lượng sản phẩm trong giỏ hàng.
    const handleQuantityChange = (productId, newQuantity) => {
        if (activeOrderIndex === null) {
            console.warn("⚠ Không có đơn hàng nào được chọn.");
            return;
        }

        if (newQuantity <= 0) {
            console.warn(`⚠ Số lượng sản phẩm ID ${productId} không hợp lệ (${newQuantity}).`);
            return;
        }

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const currentOrder = updatedOrders[activeOrderIndex];

            const itemIndex = currentOrder.items.findIndex(item => item.id === productId);

            if (itemIndex !== -1) {
                console.log(`🔄 [UPDATE] Cập nhật số lượng sản phẩm ID ${productId} từ ${currentOrder.items[itemIndex].quantity} → ${newQuantity}`);
                currentOrder.items[itemIndex].quantity = newQuantity;
            } else {
                console.warn(`⚠ Không tìm thấy sản phẩm ID ${productId} trong giỏ hàng!`);
                return updatedOrders;
            }

            // Cập nhật tổng tiền
            currentOrder.totalAmount = currentOrder.items.reduce((sum, item) => {
                const salePrice = Number(item.salePrice) || 0;
                const discountPercent = Number(item.promotion?.promotionPercent) || 0;
                const discountedPrice = salePrice * (1 - discountPercent / 100);
                return sum + discountedPrice * item.quantity;
            }, 0);

            console.log("💰 [TOTAL] Tổng tiền đơn hàng sau khi cập nhật số lượng:", currentOrder.totalAmount);
            console.log("✅ [SUCCESS] Cập nhật số lượng thành công!");
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
            const finalAmount = totalAmount - calculatedDiscount;
            setChangeAmount(Math.max(customerPaid - finalAmount, 0)); // Đảm bảo không âm
        }
    }, [customerPaid, activeOrderIndex, orders, calculatedDiscount]);

    // const handleVNPayPayment = async (orderId) => {
    //     try {
    //         const paymentUrl = await SalePOS.createVNPayPaymentUrl(orderId);
    //         window.location.href = paymentUrl; // Chuyển hướng đến URL thanh toán VNPay
    //     } catch (error) {
    //         alert(error.message); // Hiển thị thông báo lỗi cho người dùng
    //     }
    // };

    // Hàm xử lý thanh toán VNPay
    const handleVNPayPayment = async (orderId) => {
        try {
            const paymentUrl = await SalePOS.createVNPayPaymentUrl(orderId);
            localStorage.setItem("pendingOrderId", orderId); // Lưu orderId để xử lý callback
            window.location.href = paymentUrl; // Chuyển hướng đến VNPay
        } catch (error) {
            console.error("❌ Lỗi khi tạo URL thanh toán VNPay:", error);
            alert("Lỗi khi tạo URL thanh toán: " + error.message);
        }
    };



    // Hàm xử lý thanh toán chính
    const handlePayment = async () => {
        if (activeOrderIndex === null) {
            console.log("⚠ Không có hóa đơn nào được chọn.");
            alert("Vui lòng chọn hoặc tạo hóa đơn!");
            return;
        }

        const currentOrder = orders[activeOrderIndex];
        if (currentOrder.items.length === 0) {
            console.log("⚠ Giỏ hàng trống!");
            alert("Giỏ hàng trống, vui lòng thêm sản phẩm!");
            return;
        }

        if (!selectedCustomer) {
            console.log("⚠ Không có khách hàng nào được chọn.");
            alert("Vui lòng chọn khách hàng!");
            return;
        }

        const customerId = selectedCustomer === "walk-in" ? -1 : selectedCustomer;
        const orderRequest = {
            orderId: currentOrder.id ?? null,
            customerId: customerId,
            employeeId: currentEmployee.id,
            voucherId: selectedVoucher ? vouchers.find(v => v.voucherCode === selectedVoucher)?.id : null,
            paymentMethod: paymentMethod,
            orderDetails: currentOrder.items.map(item => ({
                productDetailId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await SalePOS.checkout(orderRequest);
            const { orderId, paymentResponse } = response;

            if (paymentMethod === "vnpay") {
                if (orderId) {
                    await handleVNPayPayment(orderId);
                } else {
                    throw new Error("Không thể lấy orderId cho thanh toán VNPay.");
                }
            } else {
                if (paymentResponse && paymentResponse.status === "success") {
                    console.log("✅ Thanh toán thành công!");
                    handleRemoveOrder(activeOrderIndex);
                    resetAfterPayment();
                    await fetchProductDetails();
                } else {
                    throw new Error("Thanh toán thất bại!");
                }
            }
        } catch (error) {
            console.error("❌ Lỗi khi thanh toán:", error);
            alert("Có lỗi xảy ra khi thanh toán: " + error.message);
        }
    };

    // Hàm reset sau khi thanh toán thành công
    const resetAfterPayment = () => {

        // Reset các state liên quan đến khách hàng
        setSelectedCustomer("");
        setCustomerName("");
        setPhone("");
        setEmail("");
        setSearchKeyword(""); // Reset ô tìm kiếm khách hàng
        setFilteredCustomers([]); // Ẩn danh sách gợi ý khách hàng

        // Reset các state liên quan đến thanh toán
        setTotalAmount(0);
        setCustomerPaid(0);
        setChangeAmount(0);
        setSelectedVoucher("");
        setCalculatedDiscount(0);

        // Reset các state liên quan đến form thêm khách hàng (nếu cần)
        setShowAddCustomerForm(false);
        setNewCustomer({
            fullname: "",
            phone: "",
            email: ""
        });

    };


    return (
        <div className="p-4 bg-gray-100 min-h-screen relative">

            {/* Form thêm khách hàng mới */}
            {showAddCustomerForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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

            <div className="flex items-center bg-blue-600 p-3 text-white">
                <input
                    type="text"
                    placeholder="F3) Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 p-2 border rounded text-black"
                />
                <button onClick={handleCreateOrder} className="ml-2 bg-white text-blue-600 px-4 py-2 rounded">
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
                                    className="text-blue-500 hover:text-blue-700"
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
                                    <th className="p-2">Mã Sản Phẩm</th>
                                    <th className="p-2">Tên Sản Phẩm</th>
                                    <th className="p-2">Màu Sắc</th>
                                    <th className="p-2">Kích Thước</th>
                                    <th className="p-2">Giá Bán</th>
                                    <th className="p-2">Giảm Giá</th>
                                    <th className="p-2">Số Lượng</th>
                                    <th className="p-2">Thành Tiền</th>
                                    <th className="p-2">Thao Tác</th>
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
                                            <td className="p-2">{item.productDetailCode || "Không có mã"}</td>
                                            <td className="p-2">{item.product?.productName || "Không có tên"}</td>
                                            <td className="p-2">{item.color?.name || "Không có mã"}</td>
                                            <td className="p-2">{item.size?.name || "Không có mã"}</td>
                                            <td className="p-2 text-blue-600 font-bold">{item.salePrice?.toLocaleString()} VND</td>
                                            <td className="p-2 text-blue-600 font-bold">
                                                {(item.salePrice - discountedPrice).toLocaleString()} VND
                                            </td>

                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={item.quantityAvailable || 1} // giới hạn số lượng tối đa theo tồn kho
                                                    value={isNaN(item.quantity) || item.quantity < 1 ? 1 : item.quantity}
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value) || 1;
                                                        if (newQuantity > item.quantityAvailable) {
                                                            alert(`Sản phẩm "${item.product?.productName}" chỉ còn ${item.quantityAvailable} sản phẩm trong kho.`);
                                                            return;
                                                        }
                                                        handleQuantityChange(item.id, newQuantity);
                                                    }}
                                                    className="w-16 p-1 text-center border rounded"
                                                />
                                            </td>
                                            <td className="p-2 text-blue-600 font-bold">
                                                {(discountedPrice * item.quantity).toLocaleString()} VND
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded"
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

                    {/*Danh sách chi tiêt sản phẩm*/}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h3>

                        {/* Form Bộ Lọc */}
                        <div className="mb-4 flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Giá tối thiểu (VND)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={filter.minPrice}
                                    onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                                    placeholder="Nhập giá tối thiểu"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Giá tối đa (VND)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={filter.maxPrice}
                                    onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                                    placeholder="Nhập giá tối đa"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
                                <select
                                    value={filter.color}
                                    onChange={(e) => setFilter({ ...filter, color: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="">Chọn màu sắc</option>
                                    {colors.map((color) => (
                                        <option key={color.id} value={color.name}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Kích thước</label>
                                <select
                                    value={filter.size}
                                    onChange={(e) => setFilter({ ...filter, size: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="">Chọn kích thước</option>
                                    {sizes.map((size) => (
                                        <option key={size.id} value={size.name}>
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Bảng Danh Sách Sản Phẩm */}
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left">Mã sản phẩm</th>
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
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product) => {
                                        const now = new Date();
                                        const startDate = product.promotion?.startDate ? new Date(product.promotion.startDate) : null;
                                        const endDate = product.promotion?.endDate ? new Date(product.promotion.endDate) : null;

                                        const isPromotionActive = startDate && endDate && now >= startDate && now <= endDate;
                                        const discountPercent = isPromotionActive ? product.promotion.promotionPercent : 0;
                                        const discount = discountPercent > 0 ? `${discountPercent}%` : "___";

                                        const discountedPrice = discountPercent > 0
                                            ? product.salePrice * (1 - discountPercent / 100)
                                            : product.salePrice;

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border-b">{product.productDetailCode || "Không có mã"}</td>
                                                <td className="py-2 px-4 border-b">{product.product?.productName || "Không có tên"}</td>
                                                <td className="py-2 px-4 border-b">{product.color?.name || "Không xác định"}</td>
                                                <td className="py-2 px-4 border-b">{product.size?.name || "Không xác định"}</td>
                                                <td className="py-2 px-4 border-b text-center">{product.quantity || 0}</td>
                                                <td className="py-2 px-4 border-b text-blue-600 font-bold">
                                                    {product.salePrice?.toLocaleString()} VND
                                                </td>
                                                <td className="py-2 px-4 border-b text-blue-600 font-bold">{discount}</td>
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
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Thông tin thanh toán */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Khách hàng</h3>
                    {/* Ô tìm kiếm khách hàng */}
                    <div className="flex items-center space-x-2 w-80">
                        {/* Ô nhập tìm kiếm */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={handleSearchCustomer}
                                placeholder="🔍 Nhập tên, số điện thoại hoặc email..."
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

                        {/* Nút Thêm khách hàng */}
                        <button
                            onClick={handleAddNewCustomerClick}
                            className="bg-blue-600 text-white p-2 rounded flex items-center justify-center w-10 h-10"
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

                    {/* Chọn voucher */}
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">Chọn voucher</label>
                        <select
                            value={selectedVoucher}
                            onChange={(e) => handleVoucherChange(e.target.value)}
                            className="border p-2 w-full mt-1 rounded-md"
                        >
                            <option value="">Chọn voucher</option>
                            {vouchers
                                .filter(v => {
                                    const now = new Date();
                                    const startDate = new Date(v.startDate);
                                    const endDate = new Date(v.endDate);
                                    return (
                                        v.status === true &&
                                        currentOrder?.totalAmount >= v.minCondition &&
                                        now >= startDate && now <= endDate
                                    );
                                })
                                .sort((a, b) => {
                                    const discountA = calculateDiscount(a, currentOrder.totalAmount);
                                    const discountB = calculateDiscount(b, currentOrder.totalAmount);
                                    return discountB - discountA; // Sắp xếp giảm dần theo giá trị giảm giá
                                })
                                .map(v => (
                                    <option key={v.id} value={v.voucherCode}>
                                        {v.voucherCode} - {v.voucherName} - {v.reducedPercent}%
                                        (Giảm {calculateDiscount(v, currentOrder.totalAmount).toLocaleString()} VND)
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
                            <option value="vnpay">VNPay</option> {/* Thêm tùy chọn VNPay */}
                        </select>
                    </div>


                    {paymentMethod !== "vnpay" && (
                        <div className="mt-2">
                            <label>Khách thanh toán:</label>
                            <input
                                type="number"
                                min="0"
                                value={customerPaid || ""}
                                onChange={(e) => setCustomerPaid(Number(e.target.value) || 0)}
                                className="border p-2 w-full mt-1"
                            />
                            <p className="mt-2">
                                Tiền thừa trả khách: {changeAmount.toLocaleString()} VND
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        className="bg-blue-600 text-white w-full py-2 mt-4 rounded"
                        disabled={!activeOrderIndex && activeOrderIndex !== 0}
                    >
                        {paymentMethod === "vnpay" ? "Chuyển đến VNPay" : "Thanh toán"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalePOSPage;