import api from "../ultils/api"; // Import instance Axios đã cấu hình

const API_URL = "api/order";

const OrderService = {
  // Lấy danh sách đơn hàng
  getAllOrders: async (search = "", page = 0, size = 10, sortKey = "id", sortDirection = "asc") => {
    try {
      const response = await api.get(API_URL, {
        params: { search, page, size, sortKey, sortDirection },
      });
      console.log("Danh sách đơn hàng: ", response.data.data);
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error.response?.data || error.message);
      throw error; // Ném lỗi để phía gọi xử lý tiếp
    }
  },

  // Chuyển đổi trạng thái đơn hàng
  toggleStatusOrder: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/toggle-status`);
      console.log(`Trạng thái đơn hàng ${id} đã thay đổi:`, response.data);
      return response.data; // Trả về dữ liệu sau khi thay đổi trạng thái
    } catch (error) {
      console.error(`❌ Lỗi khi thay đổi trạng thái đơn hàng ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, orderData);
      console.log(`Đơn hàng ${id} đã cập nhật:`, response.data);
      return response.data; // Trả về dữ liệu đơn hàng đã cập nhật
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật đơn hàng ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Tạo mới đơn hàng
  createOrder: async (orderData) => {
    try {
      const response = await api.post(API_URL, orderData);
      console.log("Đơn hàng đã tạo:", response.data);
      return response.data; // Trả về dữ liệu đơn hàng vừa tạo
    } catch (error) {
      console.error("❌ Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}/details`);
      console.log(`Chi tiết đơn hàng ${id}:`, response.data);
      return response.data; // Trả về dữ liệu chi tiết đơn hàng
    } catch (error) {
      console.error(`❌ Lỗi khi lấy chi tiết đơn hàng ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`${API_URL}/${id}/${status}`);
      console.log(`Trạng thái đơn hàng ${id} đã cập nhật thành ${status}:`, response.data);
      return response.data; // Trả về dữ liệu sau khi cập nhật trạng thái
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default OrderService;

