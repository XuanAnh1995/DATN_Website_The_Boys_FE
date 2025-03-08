import axios from "axios";

const API_URL_CHECKOUT = "http://localhost:8080/api/sale-pos/checkout";

const API_URL_PRODUCT_DETAIL = "http://localhost:8080/api/product-details";

const API_URL_CUSTOMERS = "http://localhost:8080/api/customers";

const SalePOS = {
    // Lấy danh sách chi tiết sản phẩm theo bộ lọc
    getProductDetails: (filters) => {
        console.log("Lấy danh sách chi tiết sản phẩm với bộ lọc:", filters);
        return axios.get(API_URL_PRODUCT_DETAIL, { params: filters })
            .then(response => {
                console.log("Lấy danh sách chi tiết sản phẩm thành công:", response.data.data);
                return response.data.data;
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách chi tiết sản phẩm:", error);
                throw error;
            });
    },

    // Lấy danh sách khách hàng theo bộ lọc
    getCustomers: (filters) => {
        console.log("Lấy danh sách khách hàng với bộ lọc:", filters);
        return axios.get(API_URL_CUSTOMERS, { params: filters })
            .then(response => {
                console.log("Dữ liệu khách hàng từ API:", response.data.data);
                return response.data.data;
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách khách hàng:", error);
                throw error;
            });
    },
    checkout: (orderData) => {
        console.log("Gửi yêu cầu thanh toán:", orderData);
        return axios.post(API_URL_CHECKOUT, orderData)
            .then(response => {
                console.log("Thanh toán thành công:", response.data);
                return response.data;
            })
            .catch(error => {
                console.error("Lỗi khi thực hiện thanh toán:", error);
                throw error;
            });
        },
        

        createOrder: async (orderData) => {
            try {
                const response = await axios.post('http://localhost:8080/api/orders', orderData);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi tạo đơn hàng:", error);
                throw error;
            }
        },
        
        addProductToCart: async (orderId, productData) => {
            try {
                const response = await axios.post(`http://localhost:8080/api/sale-pos/orders/${orderId}/products`, productData);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
                throw error;
            }
        },
        
        completePayment: async (orderId) => {
            try {
                const response = await axios.put(`http://localhost:8080/api/sale-pos/orders/${orderId}/payment`);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi hoàn tất thanh toán:", error);
                throw error;
            }
        }
};

export default SalePOS;
