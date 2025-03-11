import axios from "axios";

const API_URL_CHECKOUT = "http://localhost:8080/api/sale-pos/checkout";
const API_URL_PRODUCT_DETAIL = "http://localhost:8080/api/product-details";
const API_URL_CUSTOMERS = "http://localhost:8080/api/customers";
const API_URL_VOUCHERS = "http://localhost:8080/api/vouchers";
const API_URL_ORDERS = "http://localhost:8080/api/sale-pos/orders";

const paymentMethodMapping = {
    "cash": 1,
    "card": 2,
    "transfer": 3
};

const SalePOS = {
    getProductDetails: async (filters) => {
        try {
            const response = await axios.get(API_URL_PRODUCT_DETAIL, { params: filters });
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi lấy sản phẩm:", error.response?.data || error.message);
            throw error;
        }
    },

    getCustomers: async (filters) => {
        try {
            const response = await axios.get(API_URL_CUSTOMERS, { params: filters });
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi lấy khách hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    createOrder: async (orderData) => {
        try {
            orderData.paymentMethod = paymentMethodMapping[orderData.paymentMethod] || 1;
            console.log("📌 Dữ liệu gửi đi:", JSON.stringify(orderData, null, 2));
            const response = await axios.post(API_URL_ORDERS, orderData);
            if (!response.data || !response.data.data || !response.data.data.id) {
                throw new Error("❌ API không trả về ID đơn hàng!");
            }
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    addProductToCart: async (orderId, productData) => {
        try {
            const response = await axios.post(`${API_URL_ORDERS}/${orderId}/products`, productData);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi thêm sản phẩm vào đơn hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    completePayment: async (orderId) => {
        try {
            const response = await axios.post(API_URL_CHECKOUT, { orderId });
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi hoàn tất thanh toán:", error.response?.data || error.message);
            throw error;
        }
    },

    getVouchers: async () => {
        try {
            const response = await axios.get(API_URL_VOUCHERS);
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách voucher:", error.response?.data || error.message);
            throw error;
        }
    },

    checkout: async (orderData) => {
        try {
            console.log("📌 Kiểm tra orderDetails trước khi gửi:", orderData.orderDetails);
            if (!orderData.orderDetails || orderData.orderDetails.length === 0) {
                console.log("⚠ Không có sản phẩm nào trong đơn hàng!");
                return;
            }
            
            const orderResponse = await SalePOS.createOrder(orderData);
            if (!orderResponse || !orderResponse.id) {
                throw new Error("❌ Không nhận được Order ID từ API!");
            }
            const orderId = orderResponse.id;
            for (let item of orderData.orderDetails) {
                await SalePOS.addProductToCart(orderId, item);
            }
            const paymentResponse = await SalePOS.completePayment(orderId);
            return { orderId, paymentResponse };
        } catch (error) {
            console.error("❌ Lỗi khi checkout:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default SalePOS;
export { paymentMethodMapping };

const handlePayment = async () => {
    if (activeOrderIndex === null) {
        console.log("⚠ Không có hóa đơn nào được chọn.");
        return;
    }

    const currentOrder = orders[activeOrderIndex];

    if (!currentOrder.items || currentOrder.items.length === 0) {
        console.log("⚠ Giỏ hàng trống!");
        return;
    }

    if (!selectedCustomer) {
        console.log("⚠ Không có khách hàng nào được chọn.");
        return;
    }

    let customerId = selectedCustomer === "walk-in" ? -1 : selectedCustomer;

    console.log("📌 Voucher ID trước khi gửi:", selectedVoucher);
    console.log("📌 Tổng tiền trước khi gửi:", currentOrder?.totalAmount);

    const voucherId = selectedVoucher ? vouchers.find(v => v.voucherCode === selectedVoucher)?.id : null;
    if (selectedVoucher && !voucherId) {
        console.log("⚠ Voucher không hợp lệ.");
        return;
    }

    console.log("📌 Phương thức thanh toán đã chọn:", paymentMethod);
    const paymentMethodCode = paymentMethodMapping[paymentMethod];
    console.log("📌 Mã phương thức thanh toán:", paymentMethodCode);

    if (!paymentMethodCode) {
        console.log("⚠ Phương thức thanh toán không hợp lệ.");
        return;
    }

    const orderRequest = {
        customerId: customerId,
        employeeId: currentEmployee.id,
        voucherId: voucherId,
        paymentMethod: paymentMethodCode,
        orderDetails: currentOrder.items.map(item => ({
            productDetailId: item.id,
            quantity: item.quantity
        }))
    };

    console.log("📌 Gửi yêu cầu tạo đơn hàng:", JSON.stringify(orderRequest, null, 2));

    try {
        const orderResponse = await SalePOS.createOrder(orderRequest);
        if (!orderResponse || !orderResponse.id) {
            console.log("❌ Lỗi khi tạo đơn hàng.");
            return;
        }

        const orderId = orderResponse.id;
        const payment = await SalePOS.completePayment(orderId);

        if (!payment || !payment.id || payment.paymentStatus !== "success") {
            console.log("❌ Thanh toán thất bại hoặc phản hồi không hợp lệ:", payment);
            return;
        }

        console.log("✅ Đơn hàng được tạo với ID:", payment.id);

        if (payment.paymentStatus === "success") {
            console.log("✅ Thanh toán thành công!");
            handleRemoveOrder(activeOrderIndex);
        } else {
            console.log("❌ Thanh toán thất bại!");
        }
    } catch (error) {
        console.error("❌ Lỗi khi thanh toán:", error.response?.data || error.message || error);
    }
};
