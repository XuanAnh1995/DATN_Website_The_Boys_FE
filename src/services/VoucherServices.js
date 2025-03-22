import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL = "/api/vouchers"; // Đường dẫn tương đối vì baseURL đã được cấu hình trong api.js

const VoucherService = {
  // Lấy danh sách voucher
  getAllVouchers: async (
    search = "",
    page = 0,
    size = 10,
    sortBy = "id",
    sortDir = "asc"
  ) => {
    try {
      const response = await api.get(API_URL, {
        params: { search, page, size, sortBy, sortDir },
      });
      console.log("Danh sách voucher: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi lấy danh sách voucher:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Lấy voucher theo ID
  getVoucherById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      console.log(`Voucher ${id}:`, response.data);
      return response.data; // Trả về dữ liệu voucher
    } catch (error) {
      console.error(
        `❌ Lỗi khi lấy voucher ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Tạo mới voucher
  createVoucher: async (voucherData) => {
    try {
      const response = await api.post(API_URL, voucherData);
      console.log("Voucher đã tạo:", response.data);
      return response.data; // Trả về dữ liệu voucher vừa tạo
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo voucher:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, voucherData);
      console.log(`Voucher ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu voucher đã cập nhật
    } catch (error) {
      console.error(
        `❌ Lỗi khi cập nhật voucher ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Chuyển đổi trạng thái voucher
  toggleStatusVoucher: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái voucher ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(
        `❌ Lỗi khi thay đổi trạng thái voucher ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
  sendVoucherEmail: async (emailData) => {
    try {
      const response = await api.post("/api/send-voucher-email", emailData);
      console.log("Email đã gửi:", response.data);
      return response.data; // Trả về phản hồi từ API
    } catch (error) {
      console.error(
        "❌ Lỗi khi gửi email:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default VoucherService;
