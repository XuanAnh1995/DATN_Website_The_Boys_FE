import axios from "axios";

const API_URL_CHECKOUT = "http://localhost:8080/api/sale-pos";

const API_URL_PRODUCT_DETAIL = "http://localhost:8080/api/product-details";

const API_URL_CUSTOMERS = "http://localhost:8080/api/customers";

const API_URL_VOUCHERS = "http://localhost:8080/api/vouchers";

const API_URL_ORDERS = "http://localhost:8080/api/orders";

const SalePOS = {

    // 🛒 Lấy danh sách chi tiết sản phẩm theo bộ lọc
    getProductDetails: async (filters) => {
        console.log("📌 Lấy danh sách sản phẩm với bộ lọc:", filters);
        try {
            const response = await axios.get(API_URL_PRODUCT_DETAIL, { params: filters });
            console.log("✅ Danh sách sản phẩm:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi lấy sản phẩm:", error.response?.data || error.message);
            throw error;
        }
    },

    // 🧑‍💼 Thêm khách hàng mới
    createCustomer: async (customerData) => {
        console.log("📌 Gọi API tạo khách hàng:", customerData);
        try {
            const response = await axios.post(API_URL_CUSTOMERS, customerData);
            console.log("✅ Khách hàng tạo thành công:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi thêm khách hàng:", error.response?.data || error.message);
            return null; // Trả về null để xử lý lỗi ở UI
        }
    },


    // 🧑‍💼 Lấy danh sách khách hàng theo bộ lọc
    getCustomers: async (filters) => {
        console.log("📌 Lấy danh sách khách hàng với bộ lọc:", filters);
        try {
            const response = await axios.get(API_URL_CUSTOMERS, { params: filters });
            console.log("✅ Dữ liệu khách hàng:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi lấy khách hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    // 💳 Thanh toán đơn hàng
    checkout: async (orderData) => {
        console.log("📌 Gửi yêu cầu thanh toán:", orderData);
        try {
            const response = await axios.post(API_URL_CHECKOUT, orderData);
            console.log("✅ Thanh toán thành công:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi thanh toán:", error.response?.data || error.message);
            throw error;
        }
    },


    // 📦 Tạo đơn hàng mới
    createOrder: async (orderData) => {
        console.log("📌 Tạo đơn hàng:", orderData);
        try {
            const response = await axios.post(API_URL_ORDERS, orderData);
            console.log("✅ Đơn hàng tạo thành công:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    // 🛍️ Thêm sản phẩm vào giỏ hàng
    addProductToCart: async (orderId, productData) => {
        console.log(`📌 Thêm sản phẩm vào đơn hàng ${orderId}:`, productData);
        try {
            const response = await axios.post(`${API_URL_ORDERS}/${orderId}/products`, productData);
            console.log("✅ Sản phẩm đã thêm vào giỏ hàng:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi thêm sản phẩm vào giỏ hàng:", error.response?.data || error.message);
            throw error;
        }
    },

    // 💰 Hoàn tất thanh toán cho đơn hàng
    completePayment: async (orderId) => {
        console.log(`📌 Hoàn tất thanh toán cho đơn hàng #${orderId}`);
        try {
            const response = await axios.put(`${API_URL_ORDERS}/${orderId}/payment`);
            console.log("✅ Thanh toán hoàn tất:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Lỗi khi hoàn tất thanh toán:", error.response?.data || error.message);
            throw error;
        }
    },
    

    // 🎟️ Lấy danh sách voucher hợp lệ tại thời điểm hiện tại
    getVouchers: async () => {
        console.log("📌 Lấy danh sách voucher hợp lệ");
        try {
            const response = await axios.get(`${API_URL_VOUCHERS}`);
            console.log("✅ Danh sách voucher hợp lệ:", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách voucher:", error.response?.data || error.message);
            throw error;
        }
    }

};

export default SalePOS;
