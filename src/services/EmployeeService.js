import axios from "axios";

const API_URL = 'http://localhost:8080/api/employees';

const EmployeeService = {
    async getAll(page = 0, size = 10, search = '', trangThai = null, sortKey = 'id', sortDirection = 'desc') {
        try {
            const validSortKeys = ["id", "employeeCode", "fullname","username", "fullname", "email", "phone"];
            if (!validSortKeys.includes(sortKey)) {
                sortKey = "id";
            }
    
            const params = {
                page,
                size,
                search,
                sortBy: sortKey,
                sortDir: sortDirection
            };
    
            if (trangThai !== null && !isNaN(trangThai)) {
                params.trangThai = parseInt(trangThai, 10);
            }
    
            const response = await axios.get(API_URL, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching employee data:", error);
            throw error;
        }
    },

    async add(employeeCreateRequest) {
        try {
            const response = await axios.post(API_URL, employeeCreateRequest);
            return response.data;
        } catch (error) {
            console.error("Error creating employee:", error);
            throw error;
        }
    },

    async update(id, employeeUpdateRequest) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, employeeUpdateRequest);
            return response.data;
        } catch (error) {
            console.error("Error updating employee:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await axios.patch(`${API_URL}/toggle-status/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling employee status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting employee:", error);
            throw error;
        }
    },

    async resetPassword(id) {
        try {
            const response = await axios.post(`${API_URL}/reset-password/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    }
};

export default EmployeeService;