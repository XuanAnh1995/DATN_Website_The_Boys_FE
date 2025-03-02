import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sizes';

const SizeService = {
    getAllSizes: (search = "", page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
        return axios.get(API_URL, {
            params: { search, page, size, sortBy, sortDir },
        }).then(response => {
            // Trả về dữ liệu theo cấu trúc API
            return response.data.data;
        });
    },


    getSizeById(id) {
        return axios.get(`${API_URL}/${id}`);
    },

    createSize(sizeCreateRequest) {
        return axios.post(API_URL, sizeCreateRequest);
    },

    updateSize(id, sizeUpdateRequest) {
        return axios.put(`${API_URL}/${id}`, sizeUpdateRequest);
    },

    deleteSize(id) {
        return axios.delete(`${API_URL}/${id}`);
    },

    toggleStatusSize(id) {
        return axios.put(`${API_URL}/${id}/toggle-status`);
    }
};

export default SizeService;
