import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderService from "../../services/OrderService";
import { AiOutlineEye } from "react-icons/ai";
import LoginInfoService from "../../services/LoginInfoService";

// Các trạng thái đơn hàng
const orderStatusMap = {
  "-1": "Đã hủy",
  0: "Chờ xác nhận",
  1: "Chờ thanh toán",
  2: "Đã xác nhận",
  3: "Đang giao hàng",
  4: "Giao hàng không thành công",
  5: "Hoàn thành",
};

// Tạo lớp CSS cho từng trạng thái
const getStatusClass = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  return status === -1
    ? `${baseClasses} bg-red-100 text-red-800`
    : status === 0
      ? `${baseClasses} bg-yellow-100 text-yellow-800`
      : status === 1
        ? `${baseClasses} bg-blue-100 text-blue-800`
        : status === 2
          ? `${baseClasses} bg-purple-100 text-purple-800`
          : status === 3
            ? `${baseClasses} bg-indigo-100 text-indigo-800`
            : status === 4
              ? `${baseClasses} bg-orange-100 text-orange-800`
              : `${baseClasses} bg-green-100 text-green-800`;
};

// Component Timeline
const OrderTimeline = ({ currentStatus }) => {
  const statusIcons = {
    "-1": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ),
    0: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    2: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    3: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
    ),
    4: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    5: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const getNodeStatus = (status, currentStatus) => {
    const current = parseInt(currentStatus, 10);
    const step = parseInt(status, 10);

    if (isNaN(current) || isNaN(step)) return "disabled";

    if (current === -1 && step === 5) return "hidden";
    if (current === -1 && status === "-1") return "completed";
    if (current === -1) return "disabled";

    if (step === current) return "current";
    if (step < current || (current === 5 && step !== -1)) return "completed";

    return "disabled";
  };

  const getNodeClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500 shadow-lg shadow-green-200";
      case "current":
        return "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200 ring-4 ring-blue-100";
      case "hidden":
        return "hidden";
      default:
        return "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
    }
  };

  const getConnectorClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
        return "bg-gray-300";
      case "hidden":
        return "hidden";
      default:
        return "bg-gray-200";
    }
  };

  const mainFlow = ["0", "2", "3"];
  const branchFlow = ["4", "5"];

  return (
    <div className="mb-8">
      {parseInt(currentStatus) === -1 && (
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${getNodeClasses(
                "completed"
              )}`}
            >
              {statusIcons["-1"]}
            </div>
            <span className="mt-2 font-medium text-red-600">
              Đơn hàng đã bị hủy
            </span>
          </div>
        </div>
      )}

      {parseInt(currentStatus) !== -1 && (
        <div className="relative">
          <div className="flex items-center justify-between mb-12">
            {mainFlow.map((status, index) => {
              const nodeStatus = getNodeStatus(status, currentStatus);
              if (nodeStatus === "hidden") return null;
              return (
                <div
                  key={status}
                  className="flex-1 flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-medium text-sm transition-all duration-300 ${getNodeClasses(
                      nodeStatus
                    )}`}
                  >
                    {statusIcons[status]}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      nodeStatus === "current"
                        ? "text-blue-600"
                        : nodeStatus === "completed"
                          ? "text-green-600"
                          : "text-gray-600"
                    }`}
                  >
                    {orderStatusMap[status]}
                  </span>
                  {index < mainFlow.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 w-full h-1 ${getConnectorClasses(
                        getNodeStatus(mainFlow[index + 1], currentStatus)
                      )}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {parseInt(currentStatus) >= 3 && (
            <>
              <div className="absolute top-12 left-3/4 transform -translate-x-1/2 w-1 h-8 bg-gray-300"></div>
              <div className="flex justify-center gap-32 relative mt-8">
                {branchFlow.map((status) => {
                  const nodeStatus = getNodeStatus(status, currentStatus);
                  if (nodeStatus === "hidden") return null;
                  return (
                    <div
                      key={status}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-medium text-sm transition-all duration-300 ${getNodeClasses(
                          nodeStatus
                        )}`}
                      >
                        {statusIcons[status]}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          nodeStatus === "current"
                            ? "text-blue-600"
                            : nodeStatus === "completed"
                              ? "text-green-600"
                              : "text-gray-600"
                        }`}
                      >
                        {orderStatusMap[status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Trạng thái hiện tại: {orderStatusMap[currentStatus]}
        </h4>
        <p className="text-sm text-gray-600">
          {parseInt(currentStatus) === -1
            ? "Đơn hàng đã bị hủy và số lượng sản phẩm đã được hoàn lại nếu trước đó đã xác nhận."
            : parseInt(currentStatus) === 0
              ? "Đơn hàng của bạn đang chờ được xác nhận. Số lượng sản phẩm chưa được trừ."
              : parseInt(currentStatus) === 2
                ? "Đơn hàng đã được xác nhận và đang chờ giao hàng."
                : parseInt(currentStatus) === 3
                  ? "Đơn hàng đang được vận chuyển đến địa chỉ của bạn."
                  : parseInt(currentStatus) === 4
                    ? "Đơn hàng không thể giao thành công. Có thể thử lại hoặc hủy đơn."
                    : "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!"}
        </p>
      </div>
    </div>
  );
};

const UserOrder = () => {
  const { isLoggedIn, role } = useSelector((state) => state.user); // Lấy thêm customer từ state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [customer, setCustomer] = useState(null);
  const [isCustomerLoaded, setIsCustomerLoaded] = useState(false); // Thêm trạng thái để theo dõi tải customer
  const navigate = useNavigate();

  const tabs = [
    { key: "all", label: "Tất cả", status: null },
    { key: "pending_payment", label: "Chờ thanh toán", status: 1 },
    { key: "transporting", label: "Vận chuyển", status: 3 },
    { key: "awaiting_delivery", label: "Chờ giao hàng", status: 2 },
    { key: "completed", label: "Hoàn thành", status: 5 },
    { key: "canceled", label: "Đã hủy", status: -1 },
  ];

  // Lấy và in dữ liệu khách hàng
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isLoggedIn || role !== "CUSTOMER") return;

      try {
        const customerData = await LoginInfoService.getCurrentUser();
        console.log("Dữ liệu khách hàng:", customerData);
        setCustomer(customerData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin khách hàng!"
        );
      } finally {
        setIsCustomerLoaded(true); // Đánh dấu rằng customer đã được tải
      }
    };

    fetchCustomerData();
  }, [isLoggedIn, role]);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    if (isCustomerLoaded) {
      fetchOrders();
    }
  }, [isCustomerLoaded]);

  const fetchOrders = async (page = 0, searchQuery = "", status = null) => {
    if (!isLoggedIn || role !== "CUSTOMER") return;

    try {
      setIsLoading(true);
      const response = await OrderService.getOnlineOrders(
        searchQuery,
        page,
        pageSize,
        "id",
        "desc",
        status
      );
      let filteredOrders = response.content || [];

      // Log dữ liệu để kiểm tra
      console.log("Dữ liệu từ API:", filteredOrders);

      // Log thông tin customer hiện tại
      console.log("Thông tin customer hiện tại:", customer);
      console.log("Số điện thoại của customer:", customer.phone);

      // Lọc đơn hàng theo phone với kiểm tra an toàn
      filteredOrders = filteredOrders.filter((order) => {
        return (
          order.customer &&
          typeof order.customer === "object" &&
          order.customer.phone &&
          typeof order.customer.phone === "string" &&
          order.customer.phone === customer.phone
        );
      });

      // Lọc phía client nếu API không hỗ trợ lọc trạng thái
      if (status !== null) {
        filteredOrders = filteredOrders.filter(
          (order) => order.statusOrder === status
        );
      }

      setOrders(filteredOrders);
      const newTotalPages = response.totalPages > 0 ? response.totalPages : 1;
      setTotalPages(newTotalPages);

      // Điều chỉnh currentPage nếu vượt quá totalPages
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
        if (page !== newTotalPages - 1) {
          fetchOrders(newTotalPages - 1, searchQuery, status);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng!"
      );
      setOrders([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const orderDetails = await OrderService.getOnlineOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải chi tiết đơn hàng!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const status = tabs.find((tab) => tab.key === activeTab)?.status;
    fetchOrders(0, search, status);
  };

  const handleTabChange = (tabKey, status) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setSearch("");
    fetchOrders(0, "", status);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const status = tabs.find((tab) => tab.key === activeTab)?.status;
      fetchOrders(page - 1, search, status);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelNote.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }
    try {
      setIsLoading(true);
      await OrderService.updateOrderStatus(selectedOrder.id, -1, cancelNote);
      toast.success("Đơn hàng đã hủy thành công!");
      setShowCancelInput(false);
      setCancelNote("");
      const status = tabs.find((tab) => tab.key === activeTab)?.status;
      fetchOrders(currentPage - 1, search, status);
      const updatedOrder = await OrderService.getOnlineOrderDetails(
        selectedOrder.id
      );
      setSelectedOrder(updatedOrder);
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error(
        error.response?.data?.message ||
          "Lỗi khi hủy đơn hàng. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
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
    return pageNumbers.length > 0 ? pageNumbers : [1];
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "CUSTOMER") {
      toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "CUSTOMER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-red-600 animate-pulse">
          Vui lòng đăng nhập để xem lịch sử mua hàng!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Lịch sử mua hàng
        </h1>

        {/* Tabs */}
        <section className="mb-6" role="tablist">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => handleTabChange(tab.key, tab.status)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-6">
          <div className="relative flex items-center bg-white rounded-lg shadow p-2">
            <svg
              width="19px"
              height="19px"
              viewBox="0 0 19 19"
              className="mr-2 text-gray-400"
            >
              <g strokeWidth="2" fill="none" fillRule="evenodd">
                <g transform="translate(1, 1)">
                  <circle cx="7" cy="7" r="7"></circle>
                  <path
                    d="M12,12 L16.9799555,16.919354"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </g>
            </svg>
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                role="search"
                autoComplete="off"
                placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 text-sm border-none focus:ring-0"
              />
            </form>
          </div>
        </section>

        {/* Order List */}
        <main role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          <section>
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-500 text-lg font-semibold">
                  Chưa có đơn hàng
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          STT
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Mã đơn hàng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ngày đặt hàng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tổng tiền
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.orderCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.createDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 font-medium">
                            {formatCurrency(item.totalBill)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={getStatusClass(item.statusOrder)}>
                              {orderStatusMap[item.statusOrder.toString()] ||
                                "Không xác định"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                              onClick={() => handleViewOrderDetails(item.id)}
                              title="Xem chi tiết"
                            >
                              <AiOutlineEye size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Pagination */}
          {orders.length > 0 && (
            // Trong phần render phân trang:
            <div className="bg-white p-4 rounded-lg shadow mt-6">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const newPageSize = Number(e.target.value);
                      setPageSize(newPageSize);
                      setCurrentPage(1);
                      const status = tabs.find(
                        (tab) => tab.key === activeTab
                      )?.status;
                      fetchOrders(0, search, status);
                    }}
                    className="border border-gray-300 rounded-md text-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    Trang <span className="font-medium">{currentPage}</span> /{" "}
                    <span className="font-medium">{totalPages}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 mt-4 sm:mt-0">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                    className={`p-2 border rounded-md ${
                      currentPage === 1 || isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    «
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className={`p-2 border rounded-md ${
                      currentPage === 1 || isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    -
                  </button>
                  {getPageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      disabled={isLoading}
                      className={`p-2 border rounded-md min-w-[40px] ${
                        currentPage === number
                          ? "bg-blue-500 text-white"
                          : isLoading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className={`p-2 border rounded-md ${
                      currentPage === totalPages || isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                    className={`p-2 border rounded-md ${
                      currentPage === totalPages || isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Chi tiết đơn hàng #{selectedOrder.orderCode}
                </h2>
                <span className={getStatusClass(selectedOrder.statusOrder)}>
                  {orderStatusMap[selectedOrder.statusOrder.toString()] ||
                    "Không xác định"}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="font-medium">
                    {selectedOrder.customer?.fullname || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{selectedOrder.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                  <p className="font-medium">
                    {selectedOrder.address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  <p className="font-medium">
                    {formatDate(selectedOrder.createDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Phương thức thanh toán
                  </p>
                  <p className="font-medium">
                    {selectedOrder.paymentMethod === 0
                      ? "Thanh toán khi nhận hàng"
                      : selectedOrder.paymentMethod === 1
                        ? "Thanh toán online"
                        : "N/A"}
                  </p>
                </div>
                {selectedOrder.note &&
                  parseInt(selectedOrder.statusOrder) === -1 && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Lý do hủy</p>
                      <p className="font-medium text-red-600">
                        {selectedOrder.note}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="p-4 border-b">
              <OrderTimeline currentStatus={selectedOrder.statusOrder} />
            </div>

            {/* Order Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Các sản phẩm
              </h3>
              <div className="overflow-x-auto border rounded-lg shadow-md">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm font-semibold border-b">
                      <th className="py-3 px-4 text-left">Sản phẩm</th>
                      <th className="py-3 px-4 text-center">Số lượng</th>
                      <th className="py-3 px-4 text-center">Màu sắc</th>
                      <th className="py-3 px-4 text-center">Size</th>
                      <th className="py-3 px-4 text-right">Đơn giá</th>
                      <th className="py-3 px-4 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y divide-gray-300">
                    {Array.isArray(selectedOrder.orderDetails) &&
                    selectedOrder.orderDetails.length > 0 ? (
                      selectedOrder.orderDetails.map((detail, index) => {
                        const product = detail.productDetail?.product;
                        const productDetail = detail.productDetail || {};
                        const quantity = detail.quantity ?? 0;
                        const colorName =
                          detail.productDetail?.color?.name ?? "Không có màu";
                        const sizeName =
                          detail.productDetail?.size?.name ??
                          "Không có kích thước";
                        const price =
                          detail.productDetail?.salePrice ??
                          product?.salePrice ??
                          0;
                        const totalPrice = price * quantity;

                        return (
                          <tr
                            key={detail.id || index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="py-3 px-4 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center text-xs font-semibold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {product?.productName || "Không có tên"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {productDetail.productDetailCode ||
                                    "Không có mã"}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-medium">
                              {quantity}
                            </td>
                            <td className="py-3 px-4 text-center font-medium">
                              {colorName}
                            </td>
                            <td className="py-3 px-4 text-center font-medium">
                              {sizeName}
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-green-600">
                              {formatCurrency(price)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                              {formatCurrency(totalPrice)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-3 px-4 text-center text-gray-500"
                        >
                          Không có sản phẩm nào trong đơn hàng
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-100 text-gray-800 font-bold border-t">
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-right">
                        Tổng tiền hàng:
                      </td>
                      <td
                        colSpan="2"
                        className="py-4 px-4 text-right text-xl text-gray-700"
                      >
                        {formatCurrency(selectedOrder.totalAmount ?? 0)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-right">
                        Phí giao hàng:
                      </td>
                      <td
                        colSpan="2"
                        className="py-4 px-4 text-right text-xl text-blue-600"
                      >
                        {formatCurrency(selectedOrder.shipfee ?? 0)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-right">
                        Giảm giá:
                      </td>
                      <td
                        colSpan="2"
                        className="py-4 px-4 text-right text-xl text-green-600"
                      >
                        -
                        {formatCurrency(
                          selectedOrder.totalAmount +
                            (selectedOrder.shipfee ?? 0) -
                            selectedOrder.totalBill
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-right">
                        Tổng thanh toán:
                      </td>
                      <td
                        colSpan="2"
                        className="py-4 px-4 text-right text-xl text-red-600"
                      >
                        {formatCurrency(selectedOrder.totalBill ?? 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Voucher Information */}
            {selectedOrder.voucher && (
              <div className="p-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Mã giảm giá đã áp dụng
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p className="font-medium">
                          {selectedOrder.voucher?.voucherName || "Không có tên"}
                        </p>
                        <p>
                          {selectedOrder.voucher?.description ||
                            "Không có mô tả"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Order Input */}
            {selectedOrder.statusOrder === 0 && (
              <div className="px-4 pb-4">
                {showCancelInput ? (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Lý do hủy đơn hàng
                    </h4>
                    <textarea
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Vui lòng nhập lý do hủy đơn hàng (bắt buộc)"
                      value={cancelNote}
                      onChange={(e) => setCancelNote(e.target.value)}
                      rows={4}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={() => {
                          setShowCancelInput(false);
                          setCancelNote("");
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleCancelOrder}
                        disabled={isLoading}
                      >
                        Xác nhận hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => setShowCancelInput(true)}
                  >
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="bg-gray-50 px-4 py-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                onClick={() => {
                  setIsModalOpen(false);
                  setShowCancelInput(false);
                  setCancelNote("");
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
