import axios from "axios";

const API_URL = "http://localhost:8080/api/promotion";

const PromotionService = {
  getAllPromotions: (
    search = "",
    page = 0,
    size = 10,
    sortBy = "id",
    sortDir = "asc"
  ) => {
    return axios
      .get(API_URL, {
        params: { search, page, size, sortBy, sortDir },
      })
      .then((response) => {
        return response.data.data;
      });
  },

  getPromotionById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },

  createPromotion: (promotionData) => {
    return axios.post(API_URL, promotionData);
  },

  updatePromotion: (id, promotionData) => {
    return axios.put(`${API_URL}/${id}`, promotionData);
  },

  toggleStatusPromotion: (id) => {
    return axios.put(`${API_URL}/${id}/toggle-status`);
  },

  deletePromotion: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },
};

export default PromotionService;
