import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sleeve';

const SleeveService = {
    getAllSleeves: (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        return axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        }).then(response => {
            // Trả về dữ liệu theo cấu trúc API
            return response.data.data;
        });
    },

    getSleeveById(id) {
        return axios.get(`${API_URL}/${id}`);
    },

    createSleeve(sleeveCreateRequest) {
        return axios.post(API_URL, sleeveCreateRequest);
    },

    updateSleeve(id, sleeveUpdateRequest) {
        return axios.put(`${API_URL}/${id}`, sleeveUpdateRequest);
    },

    deleteSleeve(id) {
        return axios.delete(`${API_URL}/${id}`);
    },

    toggleStatusSleeve(id) {
        return axios.put(`${API_URL}/${id}/toggle-status`);
    }
};

export default SleeveService;