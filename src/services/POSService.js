import axios from "axios";

const API_URL = "http://localhost:8080/api/order";

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
    }


};

export default SalePOS;
