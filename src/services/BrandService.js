import axios from "axios";

const API_URL = "http://localhost:8080/api/brand";

const BrandService = {
    getAllBrands: (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        return axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        }).then(response => {
            // Trả về dữ liệu theo cấu trúc API
            return response.data.data;
        });
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