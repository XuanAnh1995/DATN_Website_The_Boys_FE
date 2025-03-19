import axios from "axios";

const API_URL = "http://localhost:8080/api/vouchers";

const VoucherService = {
  getAllVouchers: (
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
  getVoucherById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },
  createVoucher: (voucherData) => {
    try {
      return axios.post(API_URL, voucherData);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khách hàng:", error);
      throw error;
    }
  },
  updateVoucher: (id, voucherData) => {
    try {
      return axios.put(`${API_URL}/${id}`, voucherData);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khách hàng:", error);
      throw error;
    }
  },
  toggleStatusVoucher: (id) => {
    return axios.put(`${API_URL}/${id}/toggle-status`);
  },
};
export default VoucherService;
