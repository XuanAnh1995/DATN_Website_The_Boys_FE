import axios from "axios";

const API_URL = "http://localhost:8080/api/collars";

const CollarService = {
    getAllCollars: (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        return axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        }).then(response => {
            // Trả về dữ liệu theo cấu trúc API
            return response.data.data;
        });
    },

    getCollarById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    createCollar: (brandData) => {
        return axios.post(API_URL, brandData);
    },

    updateCollar: (id, brandData) => {
        return axios.put(`${API_URL}/${id}`, brandData);
    },

    toggleStatusCollar: (id) => {
        return axios.put(`${API_URL}/${id}/toggle-status`);
    },
};

export default CollarService;
