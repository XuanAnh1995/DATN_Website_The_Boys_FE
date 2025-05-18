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
  const [errors, setErrors] = useState({});

  // Hàm chuyển đổi ngày từ ISO string sang YYYY-MM-DD theo múi giờ local
  const formatDateToLocal = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    // Điều chỉnh múi giờ local (UTC+7)
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (selectedVoucher) {
      console.log("Dữ liệu nhận từ API:", selectedVoucher);
      setVoucher({
        ...selectedVoucher,
        startDate: formatDateToLocal(selectedVoucher.startDate),
        endDate: formatDateToLocal(selectedVoucher.endDate),
      });
    }
  }, [selectedVoucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateVoucher = () => {
    const newErrors = {};

    if (!voucher.voucherName.trim()) {
      newErrors.voucherName = "Tên voucher không được để trống!";
    } else if (voucher.voucherName.length > 100) {
      newErrors.voucherName = "Tên voucher không được vượt quá 100 ký tự!";
    }

    if (voucher.minCondition === "") {
      newErrors.minCondition = "Điều kiện tối thiểu không được để trống!";
    } else {
      const minCondition = Number(voucher.minCondition);
      if (isNaN(minCondition) || minCondition < 0) {
        newErrors.minCondition = "Điều kiện tối thiểu phải là số không âm!";
      }
    }

    if (voucher.maxDiscount === "") {
      newErrors.maxDiscount = "Mức giảm tối đa không được để trống!";
    } else {
      const maxDiscount = Number(voucher.maxDiscount);
      if (isNaN(maxDiscount) || maxDiscount < 0) {
        newErrors.maxDiscount = "Mức giảm tối đa phải là số không âm!";
      }
    }

    if (voucher.reducedPercent === "") {
      newErrors.reducedPercent = "Phần trăm giảm giá không được để trống!";
    } else {
      const reducedPercent = Number(voucher.reducedPercent);
      if (isNaN(reducedPercent) || reducedPercent < 0 || reducedPercent > 100) {
        newErrors.reducedPercent = "Phần trăm giảm giá phải từ 0 đến 100!";
      }
    }

    if (voucher.description && voucher.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự!";
    }

    if (!voucher.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống!";
    }

    if (!voucher.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    } else if (voucher.startDate) {
      const start = new Date(voucher.startDate);
      const end = new Date(voucher.endDate);
      if (end <= start) {
        newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateVoucher()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const formattedVoucher = {
        ...voucher,
        minCondition: Number(voucher.minCondition) || 0,
        maxDiscount: Number(voucher.maxDiscount) || 0,
        reducedPercent: Number(voucher.reducedPercent) || 0,
        startDate: new Date(voucher.startDate + "T00:00:00").toISOString(),
        endDate: new Date(voucher.endDate + "T00:00:00").toISOString(),
      };

      console.log("Dữ liệu gửi lên API:", formattedVoucher);
      await VoucherService.updateVoucher(voucher.id, formattedVoucher);
      toast.success("Voucher cập nhật thành công!");
      fetchVouchers();
      setUpdateModal(false);
    } catch (error) {
      console.error(
        "Error updating voucher:",
        error.response?.data || error.message
      );
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setUpdateModal(false)}
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 border border-gray-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
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
            className="w-full p-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
            disabled
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
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.voucherName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.voucherName && (
            <p className="text-red-500 text-xs mt-1">{errors.voucherName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={voucher.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
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
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.minCondition ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.minCondition && (
              <p className="text-red-500 text-xs mt-1">{errors.minCondition}</p>
            )}
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
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.maxDiscount ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.maxDiscount && (
              <p className="text-red-500 text-xs mt-1">{errors.maxDiscount}</p>
            )}
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
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.reducedPercent ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.reducedPercent && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reducedPercent}
              </p>
            )}
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
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
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
              type="date"
              name="startDate"
              value={voucher.startDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endDate"
              value={voucher.endDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
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
    </Modal>
  );
};

export default UpdateModal;
