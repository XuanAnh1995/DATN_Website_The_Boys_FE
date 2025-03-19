import React, { useState, useEffect, useCallback } from "react";
import VoucherService from "../../../services/VoucherServices";
import { toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import Switch from "react-switch";
import CreateVoucherModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

export default function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const fetchVouchers = useCallback(async () => {
    try {
      const { content, totalPages } = await VoucherService.getAllVouchers(
        search,
        currentPage,
        pageSize,
        sortConfig.key,
        sortConfig.direction
      );
      setVouchers(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch vouchers");
    }
  }, [search, currentPage, pageSize, sortConfig]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(0);
  };
  const handleUpdateVoucher = (voucher) => {
    setCurrentVoucher(voucher);
    setUpdateModal(true);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      Math.max(0, Math.min(prev + direction, totalPages - 1))
    );
  };

  const handleToggleStatus = async (id) => {
    console.log("Toggling status for:", id);
    try {
      await VoucherService.toggleStatusVoucher(id);
      fetchVouchers();
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Quản lý Voucher</h1>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm voucher"
          className="border rounded-lg px-4 py-2 w-64 focus:ring-blue-500"
          value={search}
          onChange={handleSearch}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Thêm Voucher
        </button>
      </div>
      <table className="table-auto w-full bg-white rounded-lg shadow-lg text-center text-sm">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã Voucher</th>
            <th className="px-4 py-2">Tên Voucher</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Điều kiện tối thiểu</th>
            <th className="px-4 py-2">Giảm tối đa</th>
            <th className="px-4 py-2">Phần trăm giảm</th>
            <th className="px-4 py-2">Ngày bắt đầu</th>
            <th className="px-4 py-2">Ngày kết thúc</th>
            <th className="px-4 py-2 cursor-pointer">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((item, index) => (
            <tr key={item.id} className="bg-white hover:bg-gray-100 border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.voucherCode}</td>
              <td className="px-4 py-2">{item.voucherName}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2">{item.minCondition}</td>
              <td className="px-4 py-2">{item.maxDiscount}</td>
              <td className="px-4 py-2">{item.reducedPercent}%</td>
              <td className="px-4 py-2">
                {new Date(item.startDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {new Date(item.endDate).toLocaleDateString()}
              </td>
              <td
                className={`px-4 py-2 ${item.status ? "text-green-500" : "text-red-500"}`}
              >
                {item.status ? "Kích hoạt" : "Không kích hoạt"}
              </td>
              <td className="px-4 py-2 flex justify-center gap-4">
                <button
                  className="text-blue-500"
                  onClick={() => handleUpdateVoucher(item)}
                >
                  <AiOutlineEdit size={20} />
                </button>
                <Switch
                  onChange={() => handleToggleStatus(item.id)}
                  checked={item.status}
                  height={20}
                  width={40}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm">
            Xem
          </label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm">Voucher</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200"
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <span className="text-sm font-semibold">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded-lg bg-gray-200"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>
      <CreateVoucherModal
        isOpen={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        fetchVouchers={fetchVouchers}
        
      />
      <UpdateModal
        isOpen={updateModal}
        setUpdateModal={setUpdateModal}
        fetchVouchers={fetchVouchers}
        selectedVoucher={currentVoucher}
      />
    </div>
  );
}
