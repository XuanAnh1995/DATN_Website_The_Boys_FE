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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotions = useCallback(async () => {
    try {
      const { content, totalPages } = await PromotionService.getAllPromotions(
        search,
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction
      );
      setPromotions(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải dữ liệu khuyến mãi");
    }
  }, [search, currentPage, pageSize, sortConfig]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
  };

  const handleUpdatePromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setUpdateModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Quản lý Khuyến mãi
      </h1>

      {/* Thanh tìm kiếm tự động */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          className="border rounded-lg px-4 py-2 w-64 focus:ring-blue-500"
          value={search}
          onChange={handleSearch}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Thêm Khuyến mãi
        </button>
      </div>

      {/* Bảng danh sách khuyến mãi */}
      <table className="table-auto w-full bg-white rounded-lg shadow-lg text-center text-sm">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Tên KM</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Phần trăm giảm</th>
            <th className="px-4 py-2">Ngày bắt đầu</th>
            <th className="px-4 py-2">Ngày kết thúc</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((item, index) => (
            <tr key={item.id} className="bg-white hover:bg-gray-100 border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.promotionName}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2">{item.promotionPercent}%</td>
              <td className="px-4 py-2">
                {new Date(item.startDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {new Date(item.endDate).toLocaleDateString()}
              </td>
              <td
                className={`px-4 py-2 ${item.status ? "text-blue-500" : "text-red-500"}`}
              >
                {item.status ? "Kích hoạt" : "Không kích hoạt"}
              </td>
              <td className="px-4 py-2 flex justify-center gap-4">
                <button
                  className="text-blue-500"
                  onClick={() => handleUpdatePromotion(item)}
                >
                  <AiOutlineEdit size={20} />
                </button>
                <Switch
                  onChange={() => console.log("Toggling status for:", item.id)}
                  checked={item.status}
                  height={20}
                  width={40}
                  onColor="#1E90FF" // Sử dụng Dodger Blue làm ví dụ
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm">
            Xem
          </label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:ring-blue-500"
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
          <span className="text-sm">Promotion</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>

          <span className="text-sm font-semibold">
            {totalPages > 0
              ? `Trang ${currentPage + 1} / ${totalPages}`
              : "Không có dữ liệu"}
          </span>

          <button
            className="px-3 py-1 border rounded-lg bg-gray-200 disabled:opacity-50"
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
