import axios from "axios";

const API_URL = "http://localhost:8080/api/categories";

const CategoryService = {
    async getAll(page = 0, size = 10, search = '', sortKey = 'id', sortDirection = 'asc') {
        try {
            const validSortKeys = ["id", "name", "status"];
            if (!validSortKeys.includes(sortKey)) {
                sortKey = "id";
            }

            const params = {
                page,
                size,
                search,
                sortBy: sortKey,
                sortDir: sortDirection,
            };

            const response = await axios.get(API_URL, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching category data:", error);
            throw error;
        }
    },

    async add(categoryCreateRequest) {
        try {
            const response = await axios.post(API_URL, categoryCreateRequest);
            return response.data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },

    async update(id, categoryUpdateRequest) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, categoryUpdateRequest);
            return response.data;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await axios.put(`${API_URL}/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            console.error("Error toggling category status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    },
};

export default CategoryService;
