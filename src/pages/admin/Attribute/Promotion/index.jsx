import React, { useState, useEffect, useCallback } from "react";
import PromotionService from "../../../../services/PromotionServices";
import { toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import Switch from "react-switch";
import CreatePromotionModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState(""); // Thêm bộ lọc trạng thái
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotions = useCallback(async () => {
    try {
      console.log("Fetching with params:", {
        search,
        currentPage,
        pageSize,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
        startDate: dateRange.start,
        endDate: dateRange.end,
        minPercent: percentRange.min,
        maxPercent: percentRange.max,
        status: statusFilter,
      });

      const { content, totalPages } = await PromotionService.getAllPromotions(
        search || "",
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction,
        dateRange.start || null,
        dateRange.end || null,
        percentRange.min ? Number(percentRange.min) : null,
        percentRange.max ? Number(percentRange.max) : null
      );

      let filteredPromotions = content.map((promo) => ({
        ...promo,
        status:
          new Date(promo.startDate) <= new Date() &&
          new Date(promo.endDate) >= new Date(),
      }));

      // Lọc theo tên
      if (search) {
        filteredPromotions = filteredPromotions.filter((promo) =>
          promo.promotionName.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Lọc theo khoảng ngày
      if (dateRange.start) {
        filteredPromotions = filteredPromotions.filter(
          (promo) => new Date(promo.startDate) >= new Date(dateRange.start)
        );
      }
      if (dateRange.end) {
        filteredPromotions = filteredPromotions.filter(
          (promo) => new Date(promo.endDate) <= new Date(dateRange.end)
        );
      }

      // Lọc theo phần trăm
      if (percentRange.min) {
        filteredPromotions = filteredPromotions.filter(
          (promo) => promo.promotionPercent >= Number(percentRange.min)
        );
      }
      if (percentRange.max) {
        filteredPromotions = filteredPromotions.filter(
          (promo) => promo.promotionPercent <= Number(percentRange.max)
        );
      }

      // Lọc theo trạng thái
      if (statusFilter) {
        filteredPromotions = filteredPromotions.filter(
          (promo) => promo.status === (statusFilter === "active")
        );
      }

      setPromotions(filteredPromotions);
      setTotalPages(Math.ceil(filteredPromotions.length / pageSize) || 1);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Lỗi khi tải dữ liệu khuyến mãi");
    }
  }, [
    search,
    currentPage,
    pageSize,
    sortConfig,
    dateRange,
    percentRange,
    statusFilter,
  ]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0);
  };

  const handleDateFilter = (field) => (event) => {
    const value = event.target.value;
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handlePercentFilter = (field) => (event) => {
    const value = event.target.value;
    setPercentRange((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDateRange({ start: "", end: "" });
    setPercentRange({ min: "", max: "" });
    setStatusFilter("");
    setCurrentPage(0);
  };

  const handleUpdatePromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setUpdateModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Quản lý Khuyến mãi
      </h1>

      {/* Bộ lọc đẹp hơn */}
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

      {/* Bảng danh sách khuyến mãi */}
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
          {promotions
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
                  {item.promotionName}
                </td>
                <td className="px-4 py-3 text-gray-600 italic">
                  {item.description}
                </td>
                <td className="px-4 py-3">{item.promotionPercent}%</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(item.startDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(item.endDate).toLocaleDateString("vi-VN")}
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
                    <Switch
                      onChange={() =>
                        console.log("Toggling status for:", item.id)
                      }
                      checked={item.status}
                      height={20}
                      width={40}
                      onColor="#10B981"
                      offColor="#EF4444"
                      disabled
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Phân trang */}
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
