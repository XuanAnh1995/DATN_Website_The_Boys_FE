import axios from "axios";

const API_URL = "http://localhost:8080/api/order";

const getAllOrders = async (search, page, size, sortKey, sortDirection) => {
  try {
    const response = await axios.get(API_URL, {
      params: { search, page, size, sortKey, sortDirection },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const toggleStatusOrder = async (id) => {
  return axios.put(`${API_URL}/${id}/toggle-status`);
};

const updateOrder = async (id, orderData) => {
  await axios.put(`${API_URL}/${id}`, orderData);
};

const createOrder = async (orderData) => {
  await axios.post(API_URL, orderData);
};

const getOrderDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

// **Thêm phương thức cập nhật trạng thái đơn hàng**
const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export default {
  getAllOrders,
  toggleStatusOrder,
  updateOrder,
  createOrder,
  getOrderDetails,
  updateOrderStatus, // **Thêm phương thức này vào export**
};
