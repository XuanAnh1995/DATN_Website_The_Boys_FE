import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import VoucherService from "../../../../services/VoucherServices";
Modal.setAppElement("#root");
const formatDateTime = (date) => {
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

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
    status: true,
  });
  const [errors, setErrors] = useState({});

  // Khi selectedVoucher thay đổi, cập nhật dữ liệu vào state
  useEffect(() => {
    if (selectedVoucher) {
      console.log("Dữ liệu nhận từ API:", selectedVoucher); // Debug dữ liệu

      setVoucher({
        ...selectedVoucher,
        startDate: selectedVoucher.startDate
          ? new Date(selectedVoucher.startDate).toISOString().slice(0, 16)
          : "",
        endDate: selectedVoucher.endDate
          ? new Date(selectedVoucher.endDate).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [selectedVoucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const validateVoucher = () => {
    const newErrors = {};

    if (!voucher.voucherName.trim()) {
      newErrors.voucherName = "Tên voucher không được để trống!";
    } else if (voucher.voucherName.length > 100) {
      newErrors.voucherName = "Tên voucher không được vượt quá 100 ký tự!";
    }

    if (!voucher.minCondition) {
      newErrors.minCondition = "Điều kiện tối thiểu không được để trống!";
    } else {
      const minCondition = Number(voucher.minCondition);
      if (isNaN(minCondition) || minCondition < 0) {
        newErrors.minCondition = "Điều kiện tối thiểu phải là số không âm!";
      }
    }

    if (!voucher.maxDiscount) {
      newErrors.maxDiscount = "Mức giảm tối đa không được để trống!";
    } else {
      const maxDiscount = Number(voucher.maxDiscount);
      if (isNaN(maxDiscount) || maxDiscount < 0) {
        newErrors.maxDiscount = "Mức giảm tối đa phải là số không âm!";
      }
    }

    if (!voucher.reducedPercent) {
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
    } else if (isNaN(new Date(voucher.startDate).getTime())) {
      newErrors.startDate = "Ngày và giờ bắt đầu không hợp lệ!";
    }

    if (!voucher.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    } else if (isNaN(new Date(voucher.endDate).getTime())) {
      newErrors.endDate = "Ngày và giờ kết thúc không hợp lệ!";
    } else if (voucher.startDate) {
      const start = new Date(voucher.startDate);
      const end = new Date(voucher.endDate);
      if (end <= start) {
        newErrors.endDate = "Ngày và giờ kết thúc phải sau ngày bắt đầu!";
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
        startDate: formatDateTime(new Date(voucher.startDate)),
        endDate: formatDateTime(new Date(voucher.endDate)),
        status: voucher.status,
      };

      console.log("Dữ liệu gửi API:", formattedVoucher);
      await VoucherService.updateVoucher(voucher.id, formattedVoucher);
      toast.success("Cập nhật voucher thành công!");
      fetchVouchers();
      setUpdateModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setUpdateModal(false)}
      contentLabel="Cập nhật voucher"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20 border border-gray-200"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
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
            className="w-full p-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            rows="3"
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
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.minCondition ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
            />
            {errors.minCondition && (
              <p className="text-red-500 text-xs mt-1">{errors.minCondition}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mức giảm tối đa
            </label>
            <input
              type="number"
              name="maxDiscount"
              value={voucher.maxDiscount}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.maxDiscount ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
            />
            {errors.maxDiscount && (
              <p className="text-red-500 text-xs mt-1">{errors.maxDiscount}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phần trăm giảm giá
          </label>
          <input
            type="number"
            name="reducedPercent"
            value={voucher.reducedPercent}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reducedPercent ? "border-red-500" : "border-gray-300"
            }`}
            min="0"
            max="100"
          />
          {errors.reducedPercent && (
            <p className="text-red-500 text-xs mt-1">{errors.reducedPercent}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày và giờ bắt đầu
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={voucher.startDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày và giờ kết thúc
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={voucher.endDate}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
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
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          >
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setUpdateModal(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-150"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Cập Nhật
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateModal;
