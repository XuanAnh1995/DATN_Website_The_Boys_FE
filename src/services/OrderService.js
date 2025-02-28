import axios from "axios";

const API_URL = "http://localhost:8080/api/order";

const getAllOrders = async (search, page, size, sortKey, sortDirection) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        search,
        page,
        size,
        sortKey,
        sortDirection,
      },
    });
    console.log("API response:", response.data); // Thêm log để kiểm tra dữ liệu
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
    console.log("Order details response:", response.data); // Thêm log để kiểm tra dữ liệu
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export default {
  getAllOrders,
  toggleStatusOrder,
  updateOrder,
  createOrder,
  getOrderDetails,
};