import axios from 'axios';

const API_URL = 'http://localhost:8080/api/colors';

const ColorService = {
    getAllColors: (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        return axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        }).then(response => {
            // Trả về dữ liệu theo cấu trúc API
            return response.data.data;
        });
    },


    getColorById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    createColor: (colorData) => {
        return axios.post(API_URL, colorData);
    },

    updateColor: (id, colorData) => {
        return axios.put(`${API_URL}/${id}`, colorData);
    },

    toggleStatusColor: (id) => {
        return axios.put(`${API_URL}/${id}/toggle-status`);
    },
};

export default ColorService;
