import React, { useState, useEffect, useCallback } from "react";
import PromotionService from "../../../../services/PromotionServices";
import { toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import CreatePromotionModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

export default function Promotion() {
  const [allPromotions, setAllPromotions] = useState([]); // Lưu toàn bộ dữ liệu gốc
  const [filteredPromotions, setFilteredPromotions] = useState([]); // Lưu dữ liệu đã lọc
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [percentRange, setPercentRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // Lấy toàn bộ dữ liệu khuyến mãi từ API (không gửi tham số lọc)
  const fetchPromotions = useCallback(async () => {
    try {
      console.log("Fetching all promotions...");
      const response = await PromotionService.getAllPromotions(
        "",
        0,
        1000,
        "id",
        "desc"
      ); // Lấy số lượng lớn để đảm bảo có tất cả dữ liệu
      const { content, totalPages } = response;
      console.log("API response:", { content, totalPages });

      setAllPromotions(Array.isArray(content) ? content : []);
      setFilteredPromotions(Array.isArray(content) ? content : []);
      setTotalPages(Math.ceil(content.length / pageSize) || 1);
    } catch (error) {
      console.error(
        "Error fetching promotions:",
        error.response?.data || error.message
      );
      toast.error("Lỗi khi tải dữ liệu khuyến mãi");
      setAllPromotions([]);
      setFilteredPromotions([]);
      setTotalPages(1);
    }
  }, [pageSize]);

  // Lọc dữ liệu trên frontend
  const applyFilters = useCallback(() => {
    let filtered = [...allPromotions];

    // Lọc theo từ khóa tìm kiếm
    if (search) {
      filtered = filtered.filter((item) =>
        item.promotionName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Lọc theo khoảng ngày
    if (dateRange.start) {
      filtered = filtered.filter(
        (item) => new Date(item.startDate) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (item) => new Date(item.endDate) <= new Date(dateRange.end)
      );
    }

    // Lọc theo phần trăm giảm
    if (percentRange.min) {
      filtered = filtered.filter(
        (item) => item.promotionPercent >= Number(percentRange.min)
      );
    }
    if (percentRange.max) {
      filtered = filtered.filter(
        (item) => item.promotionPercent <= Number(percentRange.max)
      );
    }

    // Lọc theo trạng thái
    if (statusFilter) {
      filtered = filtered.filter(
        (item) => item.status === (statusFilter === "active")
      );
    }

    // Sắp xếp dữ liệu
    filtered.sort((a, b) => {
      const key = sortConfig.key;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return -direction;
      if (a[key] > b[key]) return direction;
      return 0;
    });

    console.log("Filtered promotions:", filtered);
    setFilteredPromotions(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
    setCurrentPage(0); // Reset về trang đầu tiên sau khi lọc
  }, [
    allPromotions,
    search,
    dateRange,
    percentRange,
    statusFilter,
    sortConfig,
    pageSize,
  ]);

  // Gọi API khi component mount
  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Áp dụng bộ lọc khi state thay đổi
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (event) => {
    const value = event.target.value;
    console.log("Search input:", value);
    setSearch(value);
  };

  const handleDateFilter = (field) => (event) => {
    const value = event.target.value;
    console.log(`Date filter ${field}:`, value);
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handlePercentFilter = (field) => (event) => {
    const value = event.target.value;
    console.log(`Percent filter ${field}:`, value);
    setPercentRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusFilter = (event) => {
    const value = event.target.value;
    console.log("Status filter:", value);
    setStatusFilter(value);
  };

  const handleResetFilters = () => {
    console.log("Resetting filters");
    setSearch("");
    setDateRange({ start: "", end: "" });
    setPercentRange({ min: "", max: "" });
    setStatusFilter("");
    setCurrentPage(0);
  };

  const handleUpdatePromotion = (promotion) => {
    console.log("Updating promotion:", promotion);
    setSelectedPromotion(promotion);
    setUpdateModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Quản lý Khuyến mãi
      </h1>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Bộ Lọc</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên khuyến mãi"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu từ
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.start}
              onChange={handleDateFilter("start")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc đến
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.end}
              onChange={handleDateFilter("end")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phần trăm giảm
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={percentRange.min}
                onChange={handlePercentFilter("min")}
                min="0"
                max="100"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={percentRange.max}
                onChange={handlePercentFilter("max")}
                min="0"
                max="100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">Tất cả</option>
              <option value="active">Kích hoạt</option>
              <option value="inactive">Không kích hoạt</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-150"
            onClick={handleResetFilters}
          >
            Bỏ lọc
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-150"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Thêm Khuyến mãi
          </button>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow-lg text-center text-sm border-separate border-spacing-0">
        <thead>
          <tr className="bg-blue-100 text-gray-700 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 rounded-tl-lg">STT</th>
            <th className="px-4 py-3">Tên KM</th>
            <th className="px-4 py-3">Mô tả</th>
            <th className="px-4 py-3">Phần trăm giảm</th>
            <th className="px-4 py-3">Ngày bắt đầu</th>
            <th className="px-4 py-3">Ngày kết thúc</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 rounded-tr-lg">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPromotions.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-3 text-gray-600">
                Không tìm thấy khuyến mãi nào
              </td>
            </tr>
          ) : (
            filteredPromotions
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    {currentPage * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.promotionName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 italic">
                    {item.description || "Không có mô tả"}
                  </td>
                  <td className="px-4 py-3">
                    {item.promotionPercent
                      ? `${item.promotionPercent}%`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      item.status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.status ? "Kích hoạt" : "Không kích hoạt"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                        onClick={() => handleUpdatePromotion(item)}
                      >
                        <AiOutlineEdit size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm text-gray-700">
            Xem
          </label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">Khuyến mãi</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {totalPages > 0
              ? `Trang ${currentPage + 1} / ${totalPages}`
              : "Không có dữ liệu"}
          </span>
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage >= totalPages - 1 || totalPages === 0}
          >
            {">"}
          </button>
        </div>
      </div>

      <CreatePromotionModal
        isOpen={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        fetchPromotions={fetchPromotions}
      />
      <UpdateModal
        isOpen={updateModal}
        setUpdateModal={setUpdateModal}
        fetchPromotions={fetchPromotions}
        selectedPromotion={selectedPromotion}
      />
    </div>
  );
}
