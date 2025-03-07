import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import VoucherService from "../../../../services/VoucherServices";

const UpdateModal = ({
  isOpen,
  setUpdateModal,
  fetchVouchers,
  selectedVoucher,
}) => {
  const [voucher, setVoucher] = useState({
    voucherCode: "",
    voucherName: "",
    description: "",
    minCondition: "",
    maxDiscount: "",
    reducedPercent: "",
    startDate: "",
    endDate: "",
    status: false,
  });

  useEffect(() => {
    if (selectedVoucher) {
      setVoucher(selectedVoucher);
    }
  }, [selectedVoucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await VoucherService.updateVoucher(voucher.id, voucher);
      toast.success("Voucher cập nhật thành công!");
      fetchVouchers();
      setUpdateModal(false);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setUpdateModal(false)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Cập Nhật Voucher
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã Voucher
            </label>
            <input
              type="text"
              name="voucherCode"
              value={voucher.voucherCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên Voucher
            </label>
            <input
              type="text"
              name="voucherName"
              value={voucher.voucherName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={voucher.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Điều kiện tối thiểu
              </label>
              <input
                type="number"
                name="minCondition"
                value={voucher.minCondition}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giảm tối đa
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={voucher.maxDiscount}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phần trăm giảm
              </label>
              <input
                type="number"
                name="reducedPercent"
                value={voucher.reducedPercent}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={voucher.status}
                onChange={(e) =>
                  setVoucher((prev) => ({
                    ...prev,
                    status: e.target.value === "true",
                  }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Kích hoạt</option>
                <option value="false">Không kích hoạt</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày bắt đầu
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={voucher.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={voucher.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setUpdateModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateModal;
