import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import OrderService from "../../services/OrderService";

import {
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineCloseCircle,
} from "react-icons/ai";

const orderStatusMap = {
  "-1": "Đã hủy",
  0: "Chờ xác nhận",
  1: "Chờ thanh toán",
  2: "Đã xác nhận",
  3: "Đang giao hàng",
  4: "Giao hàng không thành công",
  5: "Hoàn thành",
};

const getStatusClass = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  return status === -1
    ? `${baseClasses} bg-red-100 text-red-800`
    : status === 0
      ? `${baseClasses} bg-yellow-100 text-yellow-800`
      : status === 1
        ? `${baseClasses} bg-blue-100 text-blue-800`
        : status === 2
          ? `${baseClasses} bg-green-100 text-green-800`
          : status === 3
            ? `${baseClasses} bg-purple-100 text-purple-800`
            : status === 4
              ? `${baseClasses} bg-orange-100 text-orange-800`
              : `${baseClasses} bg-gray-100 text-gray-800`;
};

const UserOrder = () => {
  const user = useSelector((state) => state.user);
  const { isLoggedIn, role } = user;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedCustomerId, setFetchedCustomerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Redux user state:", user); // Debug Redux state
    if (!isLoggedIn || role !== "CUSTOMER") {
      toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
      navigate("/login");
      return;
    }

    const getCustomerId = async (retryCount = 3, delay = 1000) => {
      let id = user.id || user.customerId || user.userId || user.customer_id;
      console.log("Initial ID from Redux:", id); // Debug initial ID

      if (!id) {
        const endpoints = [
          "/api/auth/me",
          "/api/users/me",
          "/api/profile",
          "/api/account",
        ];
        for (const endpoint of endpoints) {
          for (let attempt = 1; attempt <= retryCount; attempt++) {
            try {
              console.log(
                `Attempt ${attempt} to fetch customer ID from ${endpoint}`
              );
              const response = await api.get(endpoint);
              console.log(`Response from ${endpoint}:`, response.data);
              id =
                response.data?.id ||
                response.data?.customerId ||
                response.data?.userId ||
                response.data?.customer_id;
              if (id) {
                console.log(`Found customer ID ${id} from ${endpoint}`);
                break;
              }
            } catch (error) {
              console.error(
                `Attempt ${attempt} failed for ${endpoint}:`,
                error.response?.data || error.message
              );
              if (attempt < retryCount) {
                await new Promise((resolve) => setTimeout(resolve, delay));
              }
            }
            if (id) break;
          }
          if (id) break;
        }
      }

      if (!id) {
        id =
          localStorage.getItem("customerId") ||
          sessionStorage.getItem("customerId");
        console.log("ID from storage:", id); // Debug storage
      }

      if (!id) {
        console.error("No customer ID found in Redux, API, or storage");
        toast.error(
          "Không thể lấy thông tin khách hàng! Vui lòng đăng nhập lại."
        );
        navigate("/login");
        return;
      }

      setFetchedCustomerId(id);
    };

    getCustomerId();
  }, [isLoggedIn, role, user, navigate]);

  useEffect(() => {
    if (fetchedCustomerId) {
      console.log("Fetching orders for customer ID:", fetchedCustomerId); // Debug fetch
      fetchOrders();
    }
  }, [fetchedCustomerId, currentPage, pageSize]);

  useEffect(() => {
    filterOrders();
  }, [search, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await OrderService.getCustomerOrders(
        fetchedCustomerId,
        "",
        currentPage - 1,
        pageSize
      );
      console.log("Fetched orders:", data); // Debug fetched orders
      setOrders(data?.content || []);
      setFilteredOrders(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      toast.error(
        error.response?.data?.message ||
          "Lỗi khi tải đơn hàng! Vui lòng thử lại."
      );
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (!search.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const searchTerm = search.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.orderCode.toLowerCase().includes(searchTerm) ||
        orderStatusMap[order.statusOrder.toString()]
          .toLowerCase()
          .includes(searchTerm)
    );
    setFilteredOrders(filtered);
  };

  const isCancellable = (status) => {
    return [0, 1, 2].includes(parseInt(status));
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        await OrderService.updateOrderStatus(orderId, "-1");
        toast.success("Hủy đơn hàng thành công!");
        fetchOrders();
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng!");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Đơn hàng của bạn</h1>
        <p className="text-gray-600 mt-2">
          Xem và quản lý tất cả đơn hàng bạn đã đặt
        </p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <AiOutlineSearch className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc trạng thái..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.orderCode}
                  </h3>
                  <span className={getStatusClass(order.statusOrder)}>
                    {orderStatusMap[order.statusOrder.toString()]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Ngày đặt: {formatDate(order.createDate)}
                </p>
                <p className="text-sm text-gray-600">
                  Tổng tiền:{" "}
                  <span className="font-semibold text-red-600">
                    {formatCurrency(order.totalBill)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Số lượng:{" "}
                  <span className="font-semibold">{order.totalAmount}</span>
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <AiOutlineEye className="mr-1" /> Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={!isCancellable(order.statusOrder)}
                    className={`flex items-center px-3 py-1 rounded-lg transition ${
                      isCancellable(order.statusOrder)
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <AiOutlineCloseCircle className="mr-1" /> Hủy đơn
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-lg shadow mt-6 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md text-sm p-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 border rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 border rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                ></button>
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`p-2 border rounded-md min-w-[40px] ${
                      currentPage === number
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 border rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                ></button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`p-2 border rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserOrder;
