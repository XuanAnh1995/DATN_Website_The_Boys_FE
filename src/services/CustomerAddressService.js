import axios from "axios";

const AddressService = {
    // Lấy địa chỉ theo ID
    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/addresses/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy địa chỉ khách hàng:", error);
            throw error;
        }
    },

    // Lấy danh sách địa chỉ theo ID khách hàng
    async getByCustomerId(customerId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/addresses/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách địa chỉ khách hàng:", error);
            throw error;
        }
    },

    // Tạo mới địa chỉ
    async create(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/addresses`, data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo địa chỉ khách hàng:", error);
            throw error;
        }
    },

    // Cập nhật địa chỉ
    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/addresses/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật địa chỉ khách hàng:", error);
            throw error;
        }
    },

    // Xóa địa chỉ
    async delete(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/addresses/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ khách hàng:", error);
            throw error;
        }
    }
};

export default AddressService;
