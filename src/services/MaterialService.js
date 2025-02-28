import axios from 'axios';

const API_URL = 'http://localhost:8080/api/material';

const MaterialService = {
    getAllMaterials: (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        return axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        }).then(response => {
            // Trả về dữ liệu theo cấu trúc API
            return response.data.data;
        });
    },


    getMaterialById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    createMaterial: (materialData) => {
        return axios.post(API_URL, materialData);
    },

    updateMaterial: (id, materialData) => {
        return axios.put(`${API_URL}/${id}`, materialData);
    },

    toggleStatusMaterial: (id) => {
        return axios.put(`${API_URL}/${id}/toggle-status`);
    },
};

export default MaterialService;
