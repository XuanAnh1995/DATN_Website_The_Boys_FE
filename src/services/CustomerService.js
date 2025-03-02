import axios from "axios";

const CustomerService = {
    // Lấy danh sách khách hàng
    async getAll(search = '', page = 0, size = 10, sortBy = 'id', sortDir = 'desc') {
        try {
            const validSortKeys = ["id", "customerCode", "fullname", "username", "email", "phone", "createDate"];
            if (!validSortKeys.includes(sortBy)) {
                sortBy = "id"; 
            }

            const params = {
                search,
                page,
                size,
                sortBy,
                sortDir
            };

            const response = await axios.get(`http://localhost:8080/api/customers`, { params });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
            throw error;
        }
    },

    // Lấy thông tin khách hàng theo ID
    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin khách hàng:", error);
            throw error;
        }
    },

    // Thêm mới khách hàng
    async add(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/customers`, data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo khách hàng:", error);
            throw error;
        }
    },

    // Cập nhật thông tin khách hàng
    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/customers/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật khách hàng:", error);
            throw error;
        }
    },

    // Thay đổi trạng thái khách hàng
    async toggleStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/customers/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái khách hàng:", error);
            throw error;
        }
    },

    // Xóa khách hàng
    async delete(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa khách hàng:", error);
            throw error;
        }
    }
};

export default CustomerService;