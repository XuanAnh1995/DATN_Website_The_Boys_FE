import axios from "axios";

const API_URL = "http://localhost:8080/api/brand";

const BrandService = {
    getAllBrands: async (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        const response = await axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        });
        // Trả về dữ liệu theo cấu trúc API
        console.log("Danh sách thương hiệu: ", response.data.data);
        return response.data.data;
    },

    getBrandById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    createBrand: (brandData) => {
        return axios.post(API_URL, brandData);
    },

    updateBrand: (id, brandData) => {
        return axios.put(`${API_URL}/${id}`, brandData);
    },

    toggleStatusBrand: (id) => {
        return axios.put(`${API_URL}/${id}/toggle-status`);
    },
};

export default BrandService;